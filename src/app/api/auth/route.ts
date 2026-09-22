import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  createSessionToken,
  hashPassword,
  sessionCookieOptions,
  verifyPassword,
  clearSessionCookie,
} from '@/lib/auth';
import { checkRateLimit, RL } from '@/lib/rate-limit';
import { writeAudit } from '@/lib/audit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2).max(100),
  role: z.enum(['BUYER', 'SELLER']).default('BUYER'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`auth:${ip}`, RL.auth)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const mode = (body as { mode?: string }).mode;

  if (mode === 'register') {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (exists?.passwordHash) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 409 });
    }
    const user = exists
      ? await prisma.user.update({
          where: { id: exists.id },
          data: {
            name: parsed.data.name,
            role: parsed.data.role,
            passwordHash: hashPassword(parsed.data.password),
          },
        })
      : await prisma.user.create({
          data: {
            email: parsed.data.email.toLowerCase(),
            name: parsed.data.name,
            role: parsed.data.role,
            passwordHash: hashPassword(parsed.data.password),
          },
        });

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    await writeAudit({
      action: 'AUTH_REGISTER',
      entityType: 'User',
      entityId: user.id,
      ip,
      userAgent: req.headers.get('user-agent'),
    });
    const res = NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  }

  if (mode === 'logout') {
    const res = NextResponse.json({ success: true });
    res.cookies.set(clearSessionCookie());
    return res;
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user?.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
    await writeAudit({ action: 'AUTH_FAILED', ip, userAgent: req.headers.get('user-agent') });
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  await writeAudit({
    action: 'AUTH_LOGIN',
    entityType: 'User',
    entityId: user.id,
    ip,
    userAgent: req.headers.get('user-agent'),
  });
  const res = NextResponse.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  res.cookies.set(sessionCookieOptions(token));
  return res;
}
