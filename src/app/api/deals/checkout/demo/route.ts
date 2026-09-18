import { NextResponse } from 'next/server';
import { completeDealAndPurge } from '@/lib/deal-purge';
import { notifyDealPurged } from '@/lib/email';
import { prisma } from '@/lib/db';

/**
 * Demo checkout completion when STRIPE_SECRET_KEY is not configured.
 * Live path uses Stripe Checkout + /api/webhooks/stripe.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId');
  const closePriceGbp = Number(url.searchParams.get('closePriceGbp') || 0);
  const amountGbp = Number(url.searchParams.get('amountGbp') || 0);

  if (!leadId || !closePriceGbp) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  // Only allow demo path when Stripe is not live
  if (process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Demo checkout disabled while Stripe is configured' },
      { status: 400 }
    );
  }

  try {
    const result = await completeDealAndPurge({
      leadId,
      closePriceGbp,
      paymentRef: `demo_checkout_${Date.now()}`,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      userAgent: req.headers.get('user-agent'),
    });

    const config = await prisma.platformConfig.findUnique({ where: { id: 'default' } });
    await notifyDealPurged({
      amountGbp: result.amountGbp,
      paymentRef: `demo_${result.ledgerId}`,
      supportEmail: config?.supportEmail || 'support@cladak.com',
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3005';
    return NextResponse.redirect(
      `${origin}/closing?paid=1&demo=1&fee=${amountGbp || result.amountGbp}`
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Demo pay failed' },
      { status: 400 }
    );
  }
}
