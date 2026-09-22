/**
 * Distributed rate limiting.
 * - production: Upstash Redis REQUIRED (fail closed if missing/unreachable)
 * - development: durable Prisma RateLimitBucket (+ optional Upstash)
 *
 * In-memory Map is NEVER used as a production authority — multi-instance bypass risk.
 */

import { prisma } from '@/lib/db';

type LimitOpts = { windowMs?: number; max?: number };

const DEFAULTS: Required<LimitOpts> = { windowMs: 60_000, max: 20 };

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function upstashConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * @deprecated Sync memory path — development convenience only.
 * Production callers MUST use checkRateLimitAsync (throws if called in production).
 */
export function checkRateLimit(key: string, opts?: LimitOpts): boolean {
  if (isProduction()) {
    throw new Error(
      'checkRateLimit (sync) is forbidden in production — use checkRateLimitAsync with Upstash'
    );
  }
  const windowMs = opts?.windowMs ?? DEFAULTS.windowMs;
  const max = opts?.max ?? DEFAULTS.max;
  void bumpDurable(key, windowMs, max).catch(() => null);
  return bumpMemory(key, windowMs, max);
}

/** Dev-only same-process burst gate — never authoritative in production */
const memory = new Map<string, { count: number; resetAt: number }>();

function bumpMemory(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

export async function checkRateLimitAsync(
  key: string,
  opts?: LimitOpts
): Promise<boolean> {
  const windowMs = opts?.windowMs ?? DEFAULTS.windowMs;
  const max = opts?.max ?? DEFAULTS.max;

  if (isProduction()) {
    if (!upstashConfigured()) {
      console.error('[rate-limit] UPSTASH_REDIS_REST_* required in production');
      return false;
    }
    const redis = await checkUpstash(key, windowMs, max);
    if (redis === null) {
      console.error('[rate-limit] Upstash unreachable — fail closed');
      return false;
    }
    return redis;
  }

  // Development: prefer Upstash if set, else durable SQLite bucket
  if (upstashConfigured()) {
    const redis = await checkUpstash(key, windowMs, max);
    if (redis !== null) return redis;
  }
  return bumpDurable(key, windowMs, max);
}

async function checkUpstash(
  key: string,
  windowMs: number,
  max: number
): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redisKey = `rl:${key}`;
  try {
    const incr = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['PEXPIRE', redisKey, String(windowMs), 'NX'],
      ]),
    });
    if (!incr.ok) return null;
    const body = (await incr.json()) as { result?: number }[];
    const count = body?.[0]?.result ?? 0;
    return count <= max;
  } catch {
    return null;
  }
}

async function bumpDurable(key: string, windowMs: number, max: number): Promise<boolean> {
  const now = new Date();
  const existing = await prisma.rateLimitBucket.findUnique({ where: { key } });

  if (!existing || existing.resetAt <= now) {
    await prisma.rateLimitBucket.upsert({
      where: { key },
      create: {
        key,
        count: 1,
        resetAt: new Date(Date.now() + windowMs),
      },
      update: {
        count: 1,
        resetAt: new Date(Date.now() + windowMs),
      },
    });
    return true;
  }

  if (existing.count >= max) return false;

  const updated = await prisma.rateLimitBucket.updateMany({
    where: { key, count: { lt: max }, resetAt: { gt: now } },
    data: { count: { increment: 1 } },
  });
  return updated.count === 1;
}

export const RL = {
  auth: { windowMs: 60_000, max: 15 },
  lead: { windowMs: 60_000, max: 8 },
  seller: { windowMs: 60_000, max: 5 },
  deal: { windowMs: 60_000, max: 12 },
  escrow: { windowMs: 60_000, max: 8 },
  cofounder: { windowMs: 60_000, max: 8 },
  dataRights: { windowMs: 60_000, max: 5 },
  default: { windowMs: 60_000, max: 30 },
} as const;
