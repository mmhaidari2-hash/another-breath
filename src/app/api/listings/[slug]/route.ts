import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseListing } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const listing = await prisma.listing.findFirst({
    where: { slug: params.slug, verificationStatus: 'VERIFIED' },
  });
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const dto = parseListing(listing);
  // Never expose seller email / identity
  return NextResponse.json({ listing: dto });
}
