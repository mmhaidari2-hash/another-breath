import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ListingExperience from '@/components/ListingExperience';
import { parseListing } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await prisma.listing.findUnique({ where: { slug: params.slug } });
  if (!listing || listing.verificationStatus !== 'VERIFIED') notFound();

  const relatedRaw = await prisma.listing.findMany({
    where: {
      verificationStatus: 'VERIFIED',
      id: { not: listing.id },
      OR: [{ niche: listing.niche ?? undefined }, { grade: listing.grade ?? undefined }],
    },
    take: 4,
  });

  return (
    <ListingExperience
      listing={parseListing(listing)}
      related={relatedRaw.map(parseListing)}
    />
  );
}
