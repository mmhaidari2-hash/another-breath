import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { completeDealAndPurge } from '@/lib/deal-purge';

/**
 * Payment webhook entry — wire Stripe (or bank) here.
 * On successful success-fee payment → anonymous FeeLedger + full party purge.
 * No operator intervention required.
 */
const schema = z.object({
  leadId: z.string().min(1),
  closePriceGbp: z.coerce.number().positive().max(50_000_000),
  paymentRef: z.string().min(3).max(120),
  secret: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent');
  if (!checkRateLimit(`payment-webhook:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const expected = process.env.DEAL_COMPLETE_SECRET;
  if (expected && parsed.data.secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await completeDealAndPurge({
      leadId: parsed.data.leadId,
      closePriceGbp: parsed.data.closePriceGbp,
      paymentRef: parsed.data.paymentRef,
      ip,
      userAgent: ua,
    });
    return NextResponse.json({
      success: true,
      ...result,
      message: 'Fee booked anonymously. Buyer and seller accounts deleted.',
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Webhook failed' },
      { status: 400 }
    );
  }
}
