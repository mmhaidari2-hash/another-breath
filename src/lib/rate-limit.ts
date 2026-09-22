/**
 * Rate limiter with durable SQLite/Postgres bucket + optional Upstash Redis.
 * - Without Redis env: Prisma RateLimitBucket (works across restarts / single node)
 * - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN: distributed Redis
 *
 * checkRateLimit returns true if allowed.
 */

import { prisma } from '@/lib/db';

type LimitOpts = { windowMs?: number; max?: number };

const DEFAULTS: Required<LimitOpts> = { windowMs: 60_000, max: 20 };

/** Sync wrapper used by existing call sites — fires async bucket in background-safe way */
const memory = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, opts?: LimitOpts): boolean {
  const windowMs = opts?.windowMs ?? DEFAULTS.windowMs;
  const max = opts?.max ?? DEFAULTS.max;
  const now = Date.now();

  // Fast path: in-process (always on) — first line of defense
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
  } else if (entry.count >= max) {
    return false;
  } else {
    entry.count += 1;
  }

  // Durable / distributed path — fire and forget would race; use sync memory for hot path
  // and schedule durable bump (best-effort). Critical routes should prefer checkRateLimitAsync.
  void bumpDurable(key, windowMs, max).catch(() => null);

  return true;
}

export async function checkRateLimitAsync(key: string, opts?: LimitOpts): Promise<boolean> {
  const windowMs = opts?.windowMs ?? DEFAULTS.windowMs;
  const max = opts?.max ?? DEFAULTS.max;

  const redis = await checkUpstash(key, windowMs, max);
  if (redis !== null) return redis;

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
    const incr = await fetch(`${url}/incr/${encodeURIComponent(redisKey)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!incr.ok) return null;
    const body = (await incr.json()) as { result?: number };
    const count = body.result ?? 0;
    if (count === 1) {
      await fetch(`${url}/pexpire/${encodeURIComponent(redisKey)}/${windowMs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
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

  await prisma.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return true;
}

/** Endpoint presets */
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
