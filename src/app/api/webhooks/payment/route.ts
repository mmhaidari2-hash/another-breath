import { NextResponse } from 'next/server';

/** @deprecated Use /api/webhooks/stripe */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Moved',
      use: '/api/webhooks/stripe',
      message: 'Configure Stripe webhook to /api/webhooks/stripe',
    },
    { status: 410 }
  );
}
