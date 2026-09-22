import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { checkRateLimitAsync, RL } from '@/lib/rate-limit';
import { writeAudit } from '@/lib/audit';
import { notifyEscrowRequested } from '@/lib/email';
import { escrowSchema } from '@/lib/validators';
import { gbpToPence } from '@/lib/money';

/**
 * Opens a partner escrow case. Cladak never holds buyer/seller funds.
 * Duplicate open cases for the same lead → 409 Conflict.
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!(await checkRateLimitAsync(`escrow:${ip}`, RL.escrow))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = escrowSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const amountPence = gbpToPence(parsed.data.amountGbp);

  try {
    const row = await prisma.$transaction(
      async (tx) => {
        const lead = await tx.lead.findUnique({
          where: { id: parsed.data.leadId },
          include: { listing: { include: { seller: true } } },
        });
        if (!lead) throw Object.assign(new Error('Lead not found'), { status: 404 });
        if (lead.listing.verificationStatus !== 'VERIFIED') {
          throw Object.assign(new Error('Listing not open for escrow'), { status: 409 });
        }

        const existing = await tx.escrowCase.findFirst({
          where: {
            leadId: lead.id,
            status: { in: ['REQUESTED', 'REFERRED', 'FUNDED'] },
          },
        });
        if (existing) {
          throw Object.assign(
            new Error('Open escrow case already exists for this lead'),
            { status: 409, caseId: existing.id }
          );
        }

        const config = await tx.platformConfig.upsert({
          where: { id: 'default' },
          update: {},
          create: { id: 'default' },
        });

        return tx.escrowCase.create({
          data: {
            listingId: lead.listingId,
            leadId: lead.id,
            amountPence,
            partnerName: config.escrowPartnerName,
            partnerUrl: config.escrowPartnerUrl,
            status: 'REFERRED',
            buyerEmail: lead.buyerEmail.toLowerCase(),
            sellerEmail: lead.listing.seller.email.toLowerCase(),
            notes:
              parsed.data.notes ||
              'Referred to licensed escrow partner. Cladak does not hold funds.',
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    const config = await prisma.platformConfig.findUnique({ where: { id: 'default' } });

    await notifyEscrowRequested({
      buyerEmail: row.buyerEmail,
      sellerEmail: row.sellerEmail,
      partnerName: row.partnerName,
      partnerUrl: row.partnerUrl || config?.escrowPartnerUrl || 'https://www.escrow.com',
      amountPence: row.amountPence,
      caseId: row.id,
    });

    await writeAudit({
      action: 'ESCROW_REFERRED',
      entityType: 'EscrowCase',
      entityId: row.id,
      meta: { partner: row.partnerName, amountPence: row.amountPence },
      ip,
      userAgent: req.headers.get('user-agent'),
    });

    return NextResponse.json({
      success: true,
      caseId: row.id,
      status: row.status,
      partnerName: row.partnerName,
      partnerUrl: row.partnerUrl,
      amountPence: row.amountPence,
      message:
        'Escrow case opened with partner. Cladak does not custody funds — partner does.',
    });
  } catch (e: unknown) {
    const status = (e as { status?: number })?.status;
    const caseId = (e as { caseId?: string })?.caseId;
    if (status === 404) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Not found' },
        { status: 404 }
      );
    }
    if (status === 409) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Conflict', caseId },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Escrow failed' },
      { status: 400 }
    );
  }
}
