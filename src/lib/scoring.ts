import { prisma } from '@/lib/db';

/** Compute listing grade from evidence pack + basics (no live Stripe/GA scrape). */
export function scoreListing(input: {
  evidenceRevenue: boolean;
  evidenceProduct: boolean;
  evidenceUi: boolean;
  swornEvidence: boolean;
  evidenceRevenueUrl?: string | null;
  evidenceProductUrl?: string | null;
  mrrPence?: number | null;
  askingPricePence: number;
}) {
  let score = 0;
  if (input.evidenceRevenue && input.evidenceRevenueUrl) score += 30;
  if (input.evidenceProduct && input.evidenceProductUrl) score += 25;
  if (input.evidenceUi) score += 15;
  if (input.swornEvidence) score += 15;
  if (input.mrrPence && input.mrrPence > 0) score += 10;
  if (input.askingPricePence > 0 && input.mrrPence && input.mrrPence > 0) {
    const multiple = input.askingPricePence / (input.mrrPence * 12);
    if (multiple >= 2 && multiple <= 5) score += 5;
  }

  const grade = score >= 85 ? 'A' : score >= 65 ? 'B' : score >= 40 ? 'C' : 'D';
  return { score, grade };
}

export async function applyScoreToListing(listingId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return null;
  const { score, grade } = scoreListing(listing);
  return prisma.listing.update({
    where: { id: listingId },
    data: { score, grade },
  });
}
