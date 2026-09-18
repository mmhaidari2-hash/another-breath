import { NextResponse } from 'next/server';
import { z } from 'zod';
import { writeAudit } from '@/lib/audit';
import { checkRateLimit } from '@/lib/rate-limit';

const schema = z.object({
  code: z.string().min(1).max(120),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`cofounder:${ip}`)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const expected = process.env.COFOUNDER_ACCESS_CODE || 'cladak-cofounder';
  if (parsed.data.code !== expected) {
    await writeAudit({ action: 'COFOUNDER_DENIED', ip, userAgent: req.headers.get('user-agent') });
    return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
  }

  await writeAudit({ action: 'COFOUNDER_UNLOCKED', ip, userAgent: req.headers.get('user-agent') });
  return NextResponse.json({ success: true });
}
