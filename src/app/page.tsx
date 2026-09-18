import { prisma } from '@/lib/db';
import Hero from '@/components/Hero';
import FeaturedLane from '@/components/FeaturedLane';
import HowItWorks from '@/components/HowItWorks';
import SellCTA from '@/components/SellCTA';
import HomeStrip from '@/components/HomeStrip';
import MarketSearch from '@/components/MarketSearch';
import { parseListing } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    where: { category: 'Micro-SaaS', verificationStatus: 'VERIFIED' },
    orderBy: [{ featured: 'desc' }, { grade: 'asc' }, { createdAt: 'desc' }],
  });
  const dtos = listings.map(parseListing);
  const featured = dtos.filter((l) => l.featured);
  const verifiedCount = dtos.length;
  const totalAsking = dtos.reduce((s, l) => s + l.askingPrice, 0);

  return (
    <main>
      <Hero listings={dtos} />
      <MarketSearch verifiedCount={verifiedCount} totalAsking={totalAsking} />
      <FeaturedLane listings={featured} />
      <HomeStrip listings={dtos} />
      <HowItWorks />
      <SellCTA />
    </main>
  );
}
