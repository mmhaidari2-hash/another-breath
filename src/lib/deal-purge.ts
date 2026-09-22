import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { feePenceFromClose } from '@/lib/money';

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

/** Thrown when a concurrent close / duplicate settle is blocked. Maps to HTTP 409. */
export class ConflictError extends Error {
  readonly status = 409 as const;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export function isConflictError(e: unknown): e is ConflictError {
  return e instanceof ConflictError || (e instanceof Error && e.name === 'ConflictError');
}

/**
 * Atomic success-fee settle + purge.
 * - Serializable interactive transaction
 * - VERIFIED → CLOSING via updateMany WHERE status=VERIFIED (TOCTOU-safe; no soft CLOSING retry)
 * - paymentRef unique (double-spend safe)
 */
export async function completeDealAndPurge(input: {
  leadId: string;
  closePricePence: number;
  paymentRef?: string;
  ip?: string;
  userAgent?: string | null;
}) {
  if (!Number.isInteger(input.closePricePence) || input.closePricePence <= 0) {
    throw new Error('closePricePence must be a positive integer');
  }

  const paymentRef = input.paymentRef || `auto_${Date.now()}`;
  const closePricePence = input.closePricePence;

  const result = await prisma.$transaction(
    async (tx) => {
      const config = await tx.platformConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: { id: 'default' },
      });

      const priorByPayment = await tx.feeLedger.findFirst({
        where: { paymentRef },
      });
      if (priorByPayment) {
        throw new ConflictError('Deal already completed (duplicate payment or lead)');
      }

      const lead = await tx.lead.findUnique({
        where: { id: input.leadId },
        include: { listing: { include: { seller: true } } },
      });
      if (!lead) {
        // Concurrent purge may have already removed the lead — treat as conflict if hashed
        const priorByLead = await tx.feeLedger.findFirst({
          where: { leadIdHash: hash(input.leadId) },
        });
        if (priorByLead) {
          throw new ConflictError('Deal already completed (duplicate payment or lead)');
        }
        throw new Error('Lead not found');
      }

      const prior = await tx.feeLedger.findFirst({
        where: { leadIdHash: hash(lead.id) },
      });
      if (prior) {
        throw new ConflictError('Deal already completed (duplicate payment or lead)');
      }

      // Atomic lock — only VERIFIED wins; CLOSING/SOLD never soft-retry
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
        throw new ConflictError('Listing already closing or sold (concurrent close blocked)');
      }

      const feeBps = config.successFeeMinBps;
      const amountPence = feePenceFromClose(closePricePence, feeBps);

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
            amountPence,
            feeBps,
            listingSlugHash: hash(listingSlug),
            leadIdHash: hash(leadId),
            paymentRef,
          },
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          throw new ConflictError('Deal already completed (paymentRef conflict)');
        }
        throw new ConflictError('Deal already completed (paymentRef conflict)');
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
          budgetPence: null,
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
        amountPence,
        feeBps,
        paymentRef,
        purged: true as const,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 10_000,
      timeout: 30_000,
    }
  );

  await writeAudit({
    action: 'DEAL_COMPLETED_PURGED',
    entityType: 'FeeLedger',
    entityId: result.ledgerId,
    meta: {
      amountPence: result.amountPence,
      feeBps: result.feeBps,
      paymentRef: result.paymentRef,
    },
    ip: input.ip,
    userAgent: input.userAgent,
  });

  return result;
}
