import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { writeAudit } from '@/lib/audit';
import { applyScoreToListing } from '@/lib/scoring';
import { sendTransactional } from '@/lib/email';

const schema = z.object({
  kind: z.enum(['verify', 'introduce', 'intake', 'rights', 'escrow']),
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
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const packOk =
      listing.swornEvidence &&
      listing.evidenceRevenueUrl &&
      listing.evidenceProductUrl &&
      listing.evidenceUi;
    if (!packOk) {
      return NextResponse.json(
        {
          error:
            'Evidence pack incomplete — need revenue URL, product URL, UI attestation, sworn declaration before VERIFY.',
        },
        { status: 400 }
      );
    }
    await prisma.listing.update({
      where: { id },
      data: {
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        evidenceRevenue: true,
        evidenceProduct: true,
        evidenceUi: true,
        verificationNotes:
          'Ops verified seller evidence pack (England). Revenue + product URLs reviewed; sworn declaration on file.',
      },
    });
    await applyScoreToListing(id);
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

  if (kind === 'verify' && action === 'REJECT') {
    await prisma.listing.update({
      where: { id },
      data: {
        verificationStatus: 'REJECTED',
        verificationNotes: 'Rejected by Ops — evidence insufficient or policy breach.',
        featured: false,
      },
    });
    await writeAudit({
      action: 'LISTING_REJECTED',
      entityType: 'Listing',
      entityId: id,
      meta: { by: user.id },
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    return NextResponse.json({ success: true });
  }

  if (kind === 'introduce' && action === 'INTRODUCE') {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: 'INTRODUCED', introducedAt: new Date() },
      include: { listing: { include: { seller: true } } },
    });
    const { notifyIntro } = await import('@/lib/email');
    await notifyIntro({
      buyerEmail: lead.buyerEmail,
      buyerName: lead.buyerName,
      sellerEmail: lead.listing.seller.email,
      listingTitle: lead.listing.title,
      leadId: lead.id,
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
    const status =
      action === 'ACCEPT' ? 'ACCEPTED' : action === 'DECLINE' ? 'DECLINED' : null;
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

  if (kind === 'rights' && action === 'FULFILL') {
    const row = await prisma.dataRightsRequest.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (row.requestType === 'DELETE') {
      const email = row.email.toLowerCase();
      await prisma.lead.updateMany({
        where: { buyerEmail: email },
        data: {
          buyerName: 'purged',
          buyerEmail: `purged_rights_${id}@invalid.local`,
          message: null,
          ipHash: null,
          userAgent: null,
        },
      });
      await prisma.sellerInquiry.deleteMany({ where: { email } });
      const u = await prisma.user.findUnique({ where: { email } });
      if (u && !['ADMIN', 'COFOUNDER'].includes(u.role)) {
        const left = await prisma.listing.count({ where: { sellerId: u.id } });
        if (left === 0) await prisma.user.delete({ where: { id: u.id } }).catch(() => null);
      }
    }

    await sendTransactional({
      to: row.email,
      subject: `Cladak data-rights ${row.requestType} fulfilled`,
      template: 'DATA_RIGHTS_FULFILLED',
      meta: { requestId: id, type: row.requestType },
      body: `Your ${row.requestType} request (${id}) was fulfilled by Cladak Ops.\n— Cladak (England & Wales)`,
    });

    await writeAudit({
      action: 'DATA_RIGHTS_FULFILLED',
      entityType: 'DataRightsRequest',
      entityId: id,
      meta: { type: row.requestType, by: user.id },
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    return NextResponse.json({ success: true });
  }

  if (kind === 'escrow' && (action === 'FUNDED' || action === 'RELEASED' || action === 'CANCELLED')) {
    await prisma.escrowCase.update({
      where: { id },
      data: { status: action },
    });
    await writeAudit({
      action: `ESCROW_${action}`,
      entityType: 'EscrowCase',
      entityId: id,
      meta: { by: user.id },
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unsupported' }, { status: 400 });
}
