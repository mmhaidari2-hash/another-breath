import { createHash } from 'crypto';
import { prisma } from '@/lib/db';

export function hashIp(ip: string): string {
  const salt = process.env.AUDIT_SALT;
  if (!salt) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUDIT_SALT must be set in production');
    }
    // Dev-only fallback — never ship production without AUDIT_SALT
  }
  return createHash('sha256')
    .update(`${salt || 'cladak-dev-salt'}:${ip}`)
    .digest('hex')
    .slice(0, 32);
}

export async function writeAudit(input: {
  action: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string | null;
}) {
  await prisma.auditEvent.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      meta: input.meta ? JSON.stringify(input.meta) : null,
      ipHash: input.ip ? hashIp(input.ip) : null,
      userAgent: input.userAgent?.slice(0, 300) || null,
    },
  });
}
