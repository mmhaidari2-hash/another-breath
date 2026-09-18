import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { leadFormSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(`lead:${ip}`)) {
    return NextResponse.json(
      { error: 'درخواست‌های زیاد. یک دقیقه دیگه دوباره امتحان کن.' },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = leadFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'ورودی نامعتبر' },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
  });

  if (!listing) {
    return NextResponse.json({ error: 'لیستینگ پیدا نشد' }, { status: 404 });
  }

  const lead = await prisma.lead.create({
    data: {
      listingId: parsed.data.listingId,
      buyerName: parsed.data.buyerName,
      buyerEmail: parsed.data.buyerEmail,
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      message: parsed.data.message,
    },
  });

  return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
}
