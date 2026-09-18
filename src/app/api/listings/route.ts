import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseListing } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const niche = (searchParams.get('niche') || '').trim();

  const listings = await prisma.listing.findMany({
    where: {
      verificationStatus: 'VERIFIED',
      category: 'Micro-SaaS',
      ...(niche ? { niche } : {}),
    },
    orderBy: [{ featured: 'desc' }, { grade: 'asc' }, { createdAt: 'desc' }],
  });

  let dtos = listings.map(parseListing);
  if (q) {
    dtos = dtos.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.niche || '').toLowerCase().includes(q) ||
        (l.tagline || '').toLowerCase().includes(q) ||
        (l.techStack || '').toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    count: dtos.length,
    listings: dtos.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      tagline: l.tagline,
      niche: l.niche,
      askingPrice: l.askingPrice,
      mrr: l.mrr,
      multiple: l.multiple,
      grade: l.grade,
      score: l.score,
      featured: l.featured,
      demoPolicy: l.demoPolicy,
      evidenceRevenue: l.evidenceRevenue,
      evidenceProduct: l.evidenceProduct,
      evidenceUi: l.evidenceUi,
    })),
  });
}
