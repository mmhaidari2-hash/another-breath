import { prisma } from '@/lib/db';
import MarketplaceClient from '@/components/MarketplaceClient';
import type { ListingDTO } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  const listings = await prisma.listing.findMany({
    where: { category: 'Micro-SaaS', verificationStatus: 'VERIFIED' },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  });

  const dtos: ListingDTO[] = listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    description: l.description,
    tagline: l.tagline,
    niche: l.niche,
    techStack: l.techStack,
    foundedYear: l.foundedYear,
    featured: l.featured,
    askingPrice: l.askingPrice,
    mrr: l.mrr,
    multiple: l.multiple,
    grade: l.grade,
    score: l.score,
    verificationStatus: l.verificationStatus,
    verificationNotes: l.verificationNotes,
    websiteUrl: l.websiteUrl,
    verifiedAt: l.verifiedAt,
    createdAt: l.createdAt,
  }));

  return <MarketplaceClient listings={dtos} />;
}
