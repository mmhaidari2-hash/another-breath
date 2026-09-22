import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function toPence(gbp: number) {
  return Math.round(gbp * 100);
}

/**
 * Atomic success-fee settle + purge.
 * - Locks listing VERIFIED → CLOSING (TOCTOU-safe)
 * - paymentRef unique (double-spend safe)
 * - All mutations in a single interactive transaction
 */
export async function completeDealAndPurge(input: {
  leadId: string;
  closePriceGbp: number;
  paymentRef?: string;
  ip?: string;
  userAgent?: string | null;
}) {
  const paymentRef = input.paymentRef || `auto_${Date.now()}`;
  const closePriceGbp =
    Math.round(input.closePriceGbp * 100) / 100;

  const result = await prisma.$transaction(async (tx) => {
    const config = await tx.platformConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    });

    const lead = await tx.lead.findUnique({
      where: { id: input.leadId },
      include: { listing: { include: { seller: true } } },
    });
    if (!lead) throw new Error('Lead not found');

    // Already settled?
    const prior = await tx.feeLedger.findFirst({
      where: {
        OR: [
          { paymentRef },
          { leadIdHash: hash(lead.id) },
        ],
      },
    });
    if (prior) throw new Error('Deal already completed (duplicate payment or lead)');

    if (!['VERIFIED', 'CLOSING'].includes(lead.listing.verificationStatus)) {
      throw new Error('Listing not available for close');
    }

    // Atomic lock: only one closer wins
    const locked = await tx.listing.updateMany({
      where: {
        id: lead.listingId,
        verificationStatus: 'VERIFIED',
      },
      data: {
        verificationStatus: 'CLOSING',
        verificationNotes: 'Closing — fee settlement in progress',
      },
    });
    if (locked.count === 0) {
      // Allow retry only if we already marked CLOSING for this flow and no ledger yet
      if (lead.listing.verificationStatus !== 'CLOSING') {
        throw new Error('Listing already closing or sold (concurrent close blocked)');
      }
    }

    const feePercent = config.successFeeMinPercent;
    const amountGbp =
      Math.round(((closePriceGbp * feePercent) / 100) * 100) / 100;
    const amountPence = toPence(amountGbp);

    const buyerEmail = lead.buyerEmail.toLowerCase();
    const sellerEmail = lead.listing.seller.email.toLowerCase();
    const sellerId = lead.listing.sellerId;
    const listingId = lead.listingId;
    const listingSlug = lead.listing.slug;
    const leadId = lead.id;

    const buyerUser = await tx.user.findUnique({ where: { email: buyerEmail } });

    let ledger;
    try {
      ledger = await tx.feeLedger.create({
        data: {
          amountGbp,
          amountPence,
          feePercent,
          listingSlugHash: hash(listingSlug),
          leadIdHash: hash(leadId),
          paymentRef,
        },
      });
    } catch {
      throw new Error('Deal already completed (paymentRef conflict)');
    }

    await tx.auditEvent.deleteMany({
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

    await tx.escrowCase.deleteMany({ where: { listingId } });
    await tx.lead.deleteMany({ where: { listingId } });
    await tx.listing.delete({ where: { id: listingId } });
    await tx.sellerInquiry.deleteMany({
      where: { OR: [{ email: sellerEmail }, { email: buyerEmail }] },
    });
    await tx.dataRightsRequest.deleteMany({
      where: { email: { in: [buyerEmail, sellerEmail] } },
    });

    await tx.lead.updateMany({
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
      const platform = await tx.user.upsert({
        where: { email: 'platform@cladak.invalid' },
        update: {},
        create: {
          email: 'platform@cladak.invalid',
          name: 'Cladak Platform',
          role: 'ADMIN',
        },
      });

      if (buyerUser && !['ADMIN', 'COFOUNDER'].includes(buyerUser.role)) {
        await tx.listing.updateMany({
          where: { sellerId: buyerUser.id },
          data: { sellerId: platform.id },
        });
        await tx.user.delete({ where: { id: buyerUser.id } }).catch(() => null);
      }

      const sellerListingsLeft = await tx.listing.count({ where: { sellerId } });
      if (sellerListingsLeft === 0) {
        const seller = await tx.user.findUnique({ where: { id: sellerId } });
        if (seller && !['ADMIN', 'COFOUNDER'].includes(seller.role)) {
          await tx.user.delete({ where: { id: sellerId } }).catch(() => null);
        }
      }
    }

    return {
      ledgerId: ledger.id,
      amountGbp,
      amountPence,
      feePercent,
      paymentRef,
      purged: true as const,
    };
  });

  await writeAudit({
    action: 'DEAL_COMPLETED_PURGED',
    entityType: 'FeeLedger',
    entityId: result.ledgerId,
    meta: {
      amountGbp: result.amountGbp,
      amountPence: result.amountPence,
      feePercent: result.feePercent,
      paymentRef: result.paymentRef,
    },
    ip: input.ip,
    userAgent: input.userAgent,
  });

  return result;
}
