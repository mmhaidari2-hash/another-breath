import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { parseSessionToken, SESSION_COOKIE, type SessionPayload } from '@/lib/auth';

export async function getSession(): Promise<SessionPayload | null> {
  const jar = cookies();
  return parseSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser(roles?: string[]) {
  const session = await getSession();
  if (!session) return { session: null, user: null as null };
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { session: null, user: null };
  if (roles && !roles.includes(user.role)) return { session, user: null };
  return { session, user };
}
