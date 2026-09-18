import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { writeAudit } from '@/lib/audit';

const schema = z.object({
  leadId: z.string().min(1),
  note: z.string().trim().max(500).optional(),
});

export async function POST(req: Request) {
  const { user } = await requireUser(['SELLER', 'ADMIN', 'COFOUNDER', 'BUYER']);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({
    where: { id: parsed.data.leadId },
    include: { listing: { select: { sellerId: true, title: true } } },
  });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const allowed =
    user.role === 'ADMIN' ||
    user.role === 'COFOUNDER' ||
    lead.listing.sellerId === user.id ||
    lead.buyerEmail === user.email;
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: 'CLOSED_REPORTED',
      closedNote: parsed.data.note || 'Deal reported closed via Studio',
    },
  });

  await writeAudit({
    action: 'LEAD_CLOSED_REPORTED',
    entityType: 'Lead',
    entityId: lead.id,
    meta: { by: user.id, listing: lead.listing.title },
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
    userAgent: req.headers.get('user-agent'),
  });

  return NextResponse.json({ success: true, status: updated.status });
}
