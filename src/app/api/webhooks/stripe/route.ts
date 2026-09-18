import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { completeDealAndPurge } from '@/lib/deal-purge';
import { notifyDealPurged } from '@/lib/email';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Stripe webhook — checkout.session.completed → anonymous fee + purge.
 * Configure endpoint secret as STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const sig = req.headers.get('stripe-signature');
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  let event;
  try {
    if (whSecret && sig) {
      event = stripe.webhooks.constructEvent(raw, sig, whSecret);
    } else if (process.env.NODE_ENV !== 'production') {
      event = JSON.parse(raw);
    } else {
      return NextResponse.json({ error: 'Webhook secret required' }, { status: 400 });
    }
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Invalid signature' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string;
      metadata?: Record<string, string>;
      payment_status?: string;
    };
    if (session.payment_status && session.payment_status !== 'paid') {
      return NextResponse.json({ ok: true, skipped: 'not_paid' });
    }
    const leadId = session.metadata?.leadId;
    const closePriceGbp = Number(session.metadata?.closePriceGbp || 0);
    if (!leadId || !closePriceGbp) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    try {
      const result = await completeDealAndPurge({
        leadId,
        closePriceGbp,
        paymentRef: session.id,
        ip: 'stripe-webhook',
        userAgent: 'stripe',
      });
      const config = await prisma.platformConfig.findUnique({ where: { id: 'default' } });
      await notifyDealPurged({
        amountGbp: result.amountGbp,
        paymentRef: session.id,
        supportEmail: config?.supportEmail || 'support@cladak.com',
      });
      return NextResponse.json({ success: true, ...result });
    } catch (e: unknown) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Purge failed' },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
