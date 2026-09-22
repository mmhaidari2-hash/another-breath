import { NextResponse } from 'next/server';
import { checkRateLimitAsync, RL } from '@/lib/rate-limit';
import { completeDealAndPurge } from '@/lib/deal-purge';
import { dealCompleteSchema } from '@/lib/validators';

/**
 * Internal/manual complete endpoint.
 * Prefer Stripe Checkout → /api/webhooks/stripe for live money.
 * Atomic purge + unique paymentRef (no double-settle).
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent');
  if (!(await checkRateLimitAsync(`deal-complete:${ip}`, RL.deal))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = dealCompleteSchema.safeParse(body);
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
      message:
        'Fee recorded anonymously. Buyer and seller accounts purged. No party PII retained.',
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Complete failed' },
      { status: 400 }
    );
  }
}
