import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

/**
 * After success fee is confirmed:
 * - keep only an anonymous FeeLedger row (UK fee/accounting receipt)
 * - delete leads, listing, seller inquiries, and buyer/seller accounts
 * - scrub related audit rows that held party identifiers
 */
export async function completeDealAndPurge(input: {
  leadId: string;
  closePriceGbp: number;
  paymentRef?: string;
  ip?: string;
  userAgent?: string | null;
}) {
  const config = await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: input.leadId },
    include: {
      listing: { include: { seller: true } },
    },
  });
  if (!lead) throw new Error('Lead not found');
  if (lead.closedNote?.includes('PURGED')) {
    throw new Error('Deal already completed and purged');
  }

  const feePercent = config.successFeeMinPercent;
  const amountGbp =
    Math.round(((input.closePriceGbp * feePercent) / 100) * 100) / 100;

  const buyerEmail = lead.buyerEmail.toLowerCase();
  const sellerEmail = lead.listing.seller.email.toLowerCase();
  const sellerId = lead.listing.sellerId;
  const listingId = lead.listingId;
  const listingSlug = lead.listing.slug;
  const leadId = lead.id;

  const buyerUser = await prisma.user.findUnique({ where: { email: buyerEmail } });

  const ledger = await prisma.feeLedger.create({
    data: {
      amountGbp,
      feePercent,
      listingSlugHash: hash(listingSlug),
      leadIdHash: hash(leadId),
      paymentRef: input.paymentRef || `auto_${Date.now()}`,
    },
  });

  await prisma.auditEvent.deleteMany({
    where: {
      OR: [
        { entityType: 'Lead', entityId: leadId },
        { entityType: 'Listing', entityId: listingId },
        {
          AND: [
            { entityType: 'SellerInquiry' },
            { meta: { contains: listingSlug } },
          ],
        },
      ],
    },
  });

  await prisma.lead.deleteMany({ where: { listingId } });
  await prisma.listing.delete({ where: { id: listingId } });
  await prisma.sellerInquiry.deleteMany({
    where: { OR: [{ email: sellerEmail }, { email: buyerEmail }] },
  });
  await prisma.dataRightsRequest.deleteMany({
    where: { email: { in: [buyerEmail, sellerEmail] } },
  });

  // Anonymize any leftover leads from this buyer on other assets
  await prisma.lead.updateMany({
    where: { buyerEmail },
    data: {
      buyerName: 'purged',
      buyerEmail: `purged_${hash(buyerEmail)}@invalid.local`,
      message: null,
      budget: null,
      timeline: null,
      userAgent: null,
      ipHash: null,
    },
  });

  if (config.purgeAccountsOnClose) {
    if (buyerUser && !['ADMIN', 'COFOUNDER'].includes(buyerUser.role)) {
      // Reassign any remaining buyer-owned listings to keep FK integrity (rare for buyers)
      const platform = await ensurePlatformGhost();
      await prisma.listing.updateMany({
        where: { sellerId: buyerUser.id },
        data: { sellerId: platform.id },
      });
      await prisma.user.delete({ where: { id: buyerUser.id } }).catch(() => null);
    }

    const sellerListingsLeft = await prisma.listing.count({ where: { sellerId } });
    if (sellerListingsLeft === 0) {
      const seller = await prisma.user.findUnique({ where: { id: sellerId } });
      if (seller && !['ADMIN', 'COFOUNDER'].includes(seller.role)) {
        await prisma.user.delete({ where: { id: sellerId } }).catch(() => null);
      }
    }
  }

  await writeAudit({
    action: 'DEAL_COMPLETED_PURGED',
    entityType: 'FeeLedger',
    entityId: ledger.id,
    meta: {
      amountGbp,
      feePercent,
      listingSlugHash: ledger.listingSlugHash,
      paymentRef: ledger.paymentRef,
    },
    ip: input.ip,
    userAgent: input.userAgent,
  });

  return {
    ledgerId: ledger.id,
    amountGbp,
    feePercent,
    purged: true,
  };
}

async function ensurePlatformGhost() {
  return prisma.user.upsert({
    where: { email: 'platform@cladak.invalid' },
    update: {},
    create: {
      email: 'platform@cladak.invalid',
      name: 'Cladak Platform',
      role: 'ADMIN',
    },
  });
}
