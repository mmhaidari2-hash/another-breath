import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sellerInquirySchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';
import { hashIp, writeAudit } from '@/lib/audit';

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

  const row = await prisma.sellerInquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      product: parsed.data.product,
      mrr: parsed.data.mrr,
      url: parsed.data.url,
      niche: parsed.data.niche,
      askingPrice: parsed.data.askingPrice,
      notes: parsed.data.notes,
      acceptedSellerTerms: true,
      acceptedNonCircumvention: true,
      ipHash: hashIp(ip),
    },
  });

  await writeAudit({
    action: 'SELLER_INQUIRY_CREATED',
    entityType: 'SellerInquiry',
    entityId: row.id,
    meta: { product: parsed.data.product },
    ip,
    userAgent: ua,
  });

  return NextResponse.json({ success: true, id: row.id }, { status: 201 });
}
