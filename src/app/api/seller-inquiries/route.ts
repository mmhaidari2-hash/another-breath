import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  product: z.string().trim().min(2).max(120),
  mrr: z.string().trim().max(40).optional(),
  url: z.string().trim().max(300).optional(),
  niche: z.string().trim().max(80).optional(),
  askingPrice: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`seller:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const row = await prisma.sellerInquiry.create({ data: parsed.data });
  return NextResponse.json({ success: true, id: row.id }, { status: 201 });
}
