import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimitAsync, RL } from '@/lib/rate-limit';
import { getStripe, stripeConfigured } from '@/lib/stripe';
import { notifyFeeDue } from '@/lib/email';
import { checkoutSchema } from '@/lib/validators';
import { gbpToPence, feePenceFromClose, bpsToPercent } from '@/lib/money';

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

  const closePricePence = gbpToPence(parsed.data.closePriceGbp);
  const feeBps = config.successFeeMinBps;
  const amountPence = feePenceFromClose(closePricePence, feeBps);
  const feePercent = bpsToPercent(feeBps);

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get('origin') ||
    'http://127.0.0.1:3005';

  if (!stripeConfigured()) {
    const demoUrl = `${origin}/api/deals/checkout/demo?leadId=${encodeURIComponent(
      lead.id
    )}&closePricePence=${closePricePence}&amountPence=${amountPence}`;
    await notifyFeeDue({
      buyerEmail: lead.buyerEmail,
      listingTitle: lead.listing.title,
      leadId: lead.id,
      amountPence,
      checkoutUrl: demoUrl,
    });
    return NextResponse.json({
      success: true,
      mode: 'demo',
      amountPence,
      feeBps,
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
            description: `Lead ${lead.id} · close ${closePricePence} pence`,
          },
        },
      },
    ],
    metadata: {
      leadId: lead.id,
      closePricePence: String(closePricePence),
      feeBps: String(feeBps),
      amountPence: String(amountPence),
    },
    success_url: `${origin}/closing?paid=1&leadId=${lead.id}`,
    cancel_url: `${origin}/closing?cancelled=1&leadId=${lead.id}`,
  });

  await notifyFeeDue({
    buyerEmail: lead.buyerEmail,
    listingTitle: lead.listing.title,
    leadId: lead.id,
    amountPence,
    checkoutUrl: session.url || undefined,
  });

  return NextResponse.json({
    success: true,
    mode: 'stripe',
    amountPence,
    feeBps,
    feePercent,
    checkoutUrl: session.url,
    sessionId: session.id,
  });
}
