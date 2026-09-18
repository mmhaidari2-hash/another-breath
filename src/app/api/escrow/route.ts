import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { writeAudit } from '@/lib/audit';
import { notifyEscrowRequested } from '@/lib/email';

const schema = z.object({
  leadId: z.string().min(1),
  amountGbp: z.coerce.number().positive().max(50_000_000),
  notes: z.string().max(1000).optional(),
});

/**
 * Opens a partner escrow case. Cladak never holds buyer/seller funds.
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`escrow:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.findUnique({
    where: { id: parsed.data.leadId },
    include: { listing: { include: { seller: true } } },
  });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const config = await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

  const row = await prisma.escrowCase.create({
    data: {
      listingId: lead.listingId,
      leadId: lead.id,
      amountGbp: parsed.data.amountGbp,
      partnerName: config.escrowPartnerName,
      partnerUrl: config.escrowPartnerUrl,
      status: 'REFERRED',
      buyerEmail: lead.buyerEmail.toLowerCase(),
      sellerEmail: lead.listing.seller.email.toLowerCase(),
      notes: parsed.data.notes || 'Referred to licensed escrow partner. Cladak does not hold funds.',
    },
  });

  await notifyEscrowRequested({
    buyerEmail: row.buyerEmail,
    sellerEmail: row.sellerEmail,
    partnerName: row.partnerName,
    partnerUrl: row.partnerUrl || config.escrowPartnerUrl,
    amountGbp: row.amountGbp,
    caseId: row.id,
  });

  await writeAudit({
    action: 'ESCROW_REFERRED',
    entityType: 'EscrowCase',
    entityId: row.id,
    meta: { partner: row.partnerName, amountGbp: row.amountGbp },
    ip,
    userAgent: req.headers.get('user-agent'),
  });

  return NextResponse.json({
    success: true,
    caseId: row.id,
    status: row.status,
    partnerName: row.partnerName,
    partnerUrl: row.partnerUrl,
    message:
      'Escrow case opened with partner. Cladak does not custody funds — partner does.',
  });
}
