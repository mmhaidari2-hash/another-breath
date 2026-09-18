import { prisma } from '@/lib/db';
import { parseListing } from '@/lib/utils';
import CompareClient from './CompareClient';

export const dynamic = 'force-dynamic';

export default async function ComparePage() {
  const listings = await prisma.listing.findMany({
    where: { verificationStatus: 'VERIFIED' },
  });
  return <CompareClient listings={listings.map(parseListing)} />;
}
