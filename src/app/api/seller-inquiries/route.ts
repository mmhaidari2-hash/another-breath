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
  notes: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`seller:${ip}`)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in a minute.' },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const row = await prisma.sellerInquiry.create({ data: parsed.data });
  return NextResponse.json({ success: true, id: row.id }, { status: 201 });
}
