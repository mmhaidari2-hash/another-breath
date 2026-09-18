import { prisma } from '@/lib/db';
import { parseListing } from '@/lib/utils';
import MarketplaceClient from '@/components/MarketplaceClient';

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  const listings = await prisma.listing.findMany({
    where: { category: 'Micro-SaaS', verificationStatus: 'VERIFIED' },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  });
  return <MarketplaceClient listings={listings.map(parseListing)} />;
}
