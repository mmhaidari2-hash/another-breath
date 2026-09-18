import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { dataRightsSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';
import { hashIp, writeAudit } from '@/lib/audit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent');

  if (!checkRateLimit(`data-rights:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = dataRightsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const row = await prisma.dataRightsRequest.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      requestType: parsed.data.requestType,
      details: parsed.data.details,
      ipHash: hashIp(ip),
    },
  });

  await writeAudit({
    action: 'DATA_RIGHTS_REQUEST',
    entityType: 'DataRightsRequest',
    entityId: row.id,
    meta: { requestType: parsed.data.requestType },
    ip,
    userAgent: ua,
  });

  return NextResponse.json(
    {
      success: true,
      id: row.id,
      message: 'Request queued. We will respond via email.',
    },
    { status: 201 }
  );
}
