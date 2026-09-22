import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimitAsync, RL } from '@/lib/rate-limit';
import { getStripe, stripeConfigured } from '@/lib/stripe';
import { notifyFeeDue } from '@/lib/email';
import { checkoutSchema } from '@/lib/validators';

/**
 * Creates a Stripe Checkout session for the Cladak success fee.
 * On paid → Stripe webhook → purge. No operator step.
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!(await checkRateLimitAsync(`checkout:${ip}`, RL.deal))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const config = await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: parsed.data.leadId },
    include: { listing: true },
  });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const feePercent = config.successFeeMinPercent;
  const amountGbp =
    Math.round(((parsed.data.closePriceGbp * feePercent) / 100) * 100) / 100;
  const amountPence = Math.round(amountGbp * 100);

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get('origin') ||
    'http://127.0.0.1:3005';

  if (!stripeConfigured()) {
    // Local / pre-Stripe: return a demo checkout that completes via signed internal path
    const demoUrl = `${origin}/api/deals/checkout/demo?leadId=${encodeURIComponent(
      lead.id
    )}&closePriceGbp=${parsed.data.closePriceGbp}&amountGbp=${amountGbp}`;
    await notifyFeeDue({
      buyerEmail: lead.buyerEmail,
      listingTitle: lead.listing.title,
      leadId: lead.id,
      amountGbp,
      checkoutUrl: demoUrl,
    });
    return NextResponse.json({
      success: true,
      mode: 'demo',
      amountGbp,
      feePercent,
      checkoutUrl: demoUrl,
      message:
        'STRIPE_SECRET_KEY not set — demo checkout URL issued. Set Stripe keys for live GBP collection.',
    });
  }

  const stripe = getStripe()!;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'gbp',
    customer_email: lead.buyerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: amountPence,
          product_data: {
            name: `Cladak success fee (${feePercent}%)`,
            description: `Lead ${lead.id} · close £${parsed.data.closePriceGbp}`,
          },
        },
      },
    ],
    metadata: {
      leadId: lead.id,
      closePriceGbp: String(parsed.data.closePriceGbp),
      feePercent: String(feePercent),
      amountGbp: String(amountGbp),
    },
    success_url: `${origin}/closing?paid=1&leadId=${lead.id}`,
    cancel_url: `${origin}/closing?cancelled=1&leadId=${lead.id}`,
  });

  await notifyFeeDue({
    buyerEmail: lead.buyerEmail,
    listingTitle: lead.listing.title,
    leadId: lead.id,
    amountGbp,
    checkoutUrl: session.url || undefined,
  });

  return NextResponse.json({
    success: true,
    mode: 'stripe',
    amountGbp,
    feePercent,
    checkoutUrl: session.url,
    sessionId: session.id,
  });
}
