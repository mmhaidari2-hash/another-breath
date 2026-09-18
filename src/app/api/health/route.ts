import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** Readiness for load balancers / deploy checks — no secrets leaked. */
export async function GET() {
  let dbOk = false;
  try {
    await prisma.platformConfig.findUnique({ where: { id: 'default' } });
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const body = {
    ok: dbOk,
    service: 'cladak',
    time: new Date().toISOString(),
    checks: {
      database: dbOk ? 'up' : 'down',
      stripe: stripeConfigured() ? 'configured' : 'demo_mode',
      email: process.env.RESEND_API_KEY ? 'resend' : 'local_outbox',
      appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    },
  };

  return NextResponse.json(body, { status: dbOk ? 200 : 503 });
}
