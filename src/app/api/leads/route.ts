import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { leadFormSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';
import { hashIp, writeAudit } from '@/lib/audit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent');

  if (!checkRateLimit(`lead:${ip}`)) {
    await writeAudit({ action: 'LEAD_RATE_LIMITED', ip, userAgent: ua });
    return NextResponse.json(
      { error: 'Too many requests. Try again in a minute.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = leadFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: {
      id: true,
      slug: true,
      title: true,
      verificationStatus: true,
      sellerId: true,
      askingPrice: true,
    },
  });

  if (!listing || listing.verificationStatus !== 'VERIFIED') {
    return NextResponse.json({ error: 'Listing unavailable' }, { status: 404 });
  }

  const config = await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

  const autoIntro = config.autoIntroduceLeads;

  const lead = await prisma.lead.create({
    data: {
      listingId: listing.id,
      buyerName: parsed.data.buyerName,
      buyerEmail: parsed.data.buyerEmail.toLowerCase(),
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      message: parsed.data.message,
      acceptedTerms: true,
      acceptedNonCircumvention: true,
      ipHash: hashIp(ip),
      userAgent: ua?.slice(0, 300),
      status: autoIntro ? 'INTRODUCED' : 'QUEUED',
      introducedAt: autoIntro ? new Date() : null,
    },
  });

  await writeAudit({
    action: autoIntro ? 'LEAD_AUTO_INTRODUCED' : 'LEAD_CREATED',
    entityType: 'Lead',
    entityId: lead.id,
    meta: { listingId: listing.id, listingSlug: listing.slug },
    ip,
    userAgent: ua,
  });

  return NextResponse.json(
    {
      success: true,
      leadId: lead.id,
      status: lead.status,
      askingPrice: listing.askingPrice,
      message: autoIntro
        ? 'Intro automated. Complete the deal to pay the success fee — accounts purge after payment.'
        : 'Request queued. Seller contact is mediated by Cladak.',
    },
    { status: 201 }
  );
}
