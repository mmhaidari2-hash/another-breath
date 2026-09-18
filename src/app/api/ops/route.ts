import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { writeAudit } from '@/lib/audit';

const schema = z.object({
  kind: z.enum(['verify', 'introduce', 'intake']),
  id: z.string().min(1),
  action: z.string().min(1),
});

export async function POST(req: Request) {
  const { user } = await requireUser(['ADMIN', 'COFOUNDER']);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
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

  const { kind, id, action } = parsed.data;

  if (kind === 'verify' && action === 'VERIFY') {
    await prisma.listing.update({
      where: { id },
      data: {
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        evidenceRevenue: true,
        evidenceProduct: true,
        evidenceUi: true,
        verificationNotes:
          'Manual Phase-1 verification complete. Evidence reviewed by Cladak ops (England).',
      },
    });
    await writeAudit({
      action: 'LISTING_VERIFIED',
      entityType: 'Listing',
      entityId: id,
      meta: { by: user.id },
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    return NextResponse.json({ success: true });
  }

  if (kind === 'introduce' && action === 'INTRODUCE') {
    await prisma.lead.update({
      where: { id },
      data: { status: 'INTRODUCED', introducedAt: new Date() },
    });
    await writeAudit({
      action: 'LEAD_INTRODUCED',
      entityType: 'Lead',
      entityId: id,
      meta: { by: user.id },
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    return NextResponse.json({ success: true });
  }

  if (kind === 'intake') {
    const status = action === 'ACCEPT' ? 'REVIEWING' : action === 'DECLINE' ? 'DECLINED' : null;
    if (!status) return NextResponse.json({ error: 'Bad action' }, { status: 400 });
    await prisma.sellerInquiry.update({ where: { id }, data: { status } });
    await writeAudit({
      action: 'SELLER_INQUIRY_STATUS',
      entityType: 'SellerInquiry',
      entityId: id,
      meta: { status, by: user.id },
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unsupported' }, { status: 400 });
}
