import { prisma } from '@/lib/db';
import Hero from '@/components/Hero';
import FeaturedLane from '@/components/FeaturedLane';
import HowItWorks from '@/components/HowItWorks';
import SellCTA from '@/components/SellCTA';
import HomeStrip from '@/components/HomeStrip';
import type { ListingDTO } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function toDTO(l: Awaited<ReturnType<typeof prisma.listing.findMany>>[number]): ListingDTO {
  return {
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
  };
}

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    where: { category: 'Micro-SaaS', verificationStatus: 'VERIFIED' },
    orderBy: [{ featured: 'desc' }, { grade: 'asc' }, { createdAt: 'desc' }],
  });
  const dtos = listings.map(toDTO);
  const featured = dtos.filter((l) => l.featured);

  return (
    <main>
      <Hero listings={dtos} />
      <FeaturedLane listings={featured} />
      <HomeStrip listings={dtos} />
      <HowItWorks />
      <SellCTA />
    </main>
  );
}
