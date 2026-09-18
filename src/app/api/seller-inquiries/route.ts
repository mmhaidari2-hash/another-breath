import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sellerInquirySchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';
import { hashIp, writeAudit } from '@/lib/audit';
import { getSession } from '@/lib/session';
import { slugify } from '@/lib/utils';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent');

  if (!checkRateLimit(`seller:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = sellerInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const session = await getSession();
  const email = parsed.data.email.toLowerCase();

  const seller = session?.email === email
    ? await prisma.user.findUnique({ where: { id: session.userId } })
    : await prisma.user.upsert({
        where: { email },
        update: {
          name: parsed.data.name,
          role: 'SELLER',
        },
        create: {
          email,
          name: parsed.data.name,
          role: 'SELLER',
        },
      });

  if (!seller) {
    return NextResponse.json({ error: 'Seller account unavailable' }, { status: 500 });
  }

  if (session?.userId === seller.id && seller.role === 'BUYER') {
    await prisma.user.update({ where: { id: seller.id }, data: { role: 'SELLER' } });
  }

  const baseSlug = slugify(parsed.data.product) || `asset-${Date.now().toString(36)}`;
  let slug = baseSlug;
  let n = 1;
  while (await prisma.listing.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const asking = parsed.data.askingPrice
    ? Number(String(parsed.data.askingPrice).replace(/[^0-9.]/g, '')) || 0
    : 0;
  const mrrRaw = parsed.data.mrr
    ? Number(String(parsed.data.mrr).replace(/[^0-9.]/g, ''))
    : null;

  const listing = await prisma.listing.create({
    data: {
      slug,
      title: parsed.data.product,
      description:
        parsed.data.notes?.trim() ||
        `${parsed.data.product} submitted for Cladak manual review.`,
      tagline: parsed.data.niche || null,
      niche: parsed.data.niche || null,
      websiteUrl: parsed.data.url || null,
      demoPolicy: 'INTRO_ONLY',
      mrr: mrrRaw && mrrRaw > 0 ? mrrRaw : null,
      askingPrice: asking > 0 ? asking : 1000,
      multiple:
        mrrRaw && mrrRaw > 0 && asking > 0
          ? Math.round((asking / (mrrRaw * 12)) * 10) / 10
          : null,
      category: 'Micro-SaaS',
      verificationStatus: 'PENDING',
      verificationNotes: 'Awaiting manual review.',
      sellerId: seller.id,
      highlights: JSON.stringify([]),
      gallery: JSON.stringify([
        { label: 'Product', tone: '#101418' },
        { label: 'Metrics', tone: '#161C22' },
        { label: 'Stack', tone: '#121820' },
      ]),
    },
  });

  const row = await prisma.sellerInquiry.create({
    data: {
      name: parsed.data.name,
      email,
      product: parsed.data.product,
      mrr: parsed.data.mrr,
      url: parsed.data.url,
      niche: parsed.data.niche,
      askingPrice: parsed.data.askingPrice,
      notes: parsed.data.notes,
      acceptedSellerTerms: true,
      acceptedNonCircumvention: true,
      status: 'REVIEWING',
      ipHash: hashIp(ip),
    },
  });

  await writeAudit({
    action: 'SELLER_INQUIRY_CREATED',
    entityType: 'SellerInquiry',
    entityId: row.id,
    meta: { product: parsed.data.product, listingId: listing.id, slug },
    ip,
    userAgent: ua,
  });

  return NextResponse.json(
    {
      success: true,
      id: row.id,
      listingId: listing.id,
      slug,
      status: 'PENDING',
      message: 'Queued for manual verification. Not public until VERIFIED.',
    },
    { status: 201 }
  );
}
