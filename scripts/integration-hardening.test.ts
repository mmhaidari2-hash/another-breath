/**
 * Integration hardening tests — money pence, Zod URL, TOCTOU close, rate limits.
 * Run: npm run test:integration
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed += 1;
    console.error(`  ✗ ${name}`);
    console.error(e);
  }
}

async function main() {
  console.log('\n=== Cladak hardening integration tests ===\n');

  console.log('money');
  const money = await import('../src/lib/money');
  await test('gbpToPence rounds to integer pence', () => {
    assert.equal(money.gbpToPence(18.5), 1850);
    assert.equal(money.gbpToPence(0.01), 1);
    assert.equal(money.feePenceFromClose(1_850_000, 300), 55_500);
  });
  await test('feePenceFromClose rejects non-integers', () => {
    assert.throws(() => money.feePenceFromClose(100.5 as number, 300));
  });

  console.log('validators');
  const { httpsUrlSchema } = await import('../src/lib/validators');
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  await test('rejects example.com', () => {
    assert.equal(httpsUrlSchema.safeParse('https://example.com/x').success, false);
  });
  await test('rejects fake.placeholder hosts', () => {
    assert.equal(httpsUrlSchema.safeParse('https://fake.example.org/x').success, false);
  });
  await test('accepts https public host', () => {
    assert.equal(
      httpsUrlSchema.safeParse('https://dashboard.stripe.com/test/revenue').success,
      true
    );
  });
  if (isDev) {
    await test('development accepts http://localhost', () => {
      assert.equal(
        httpsUrlSchema.safeParse('http://localhost/evidence.pdf').success,
        true
      );
    });
  }

  console.log('schema (pence-only money)');
  const schema = readFileSync(resolve('prisma/schema.prisma'), 'utf8');
  await test('no Float money fields remain', () => {
    assert.ok(!/mrr\s+Float/.test(schema));
    assert.ok(!/askingPrice\s+Float/.test(schema));
    assert.ok(!/amountGbp\s+Float/.test(schema));
    assert.ok(!/budget\s+Float/.test(schema));
    assert.ok(!/successFeeMinPercent\s+Float/.test(schema));
    assert.ok(/askingPricePence\s+Int/.test(schema));
    assert.ok(/mrrPence\s+Int\?/.test(schema));
    assert.ok(/amountPence\s+Int/.test(schema));
    assert.ok(/budgetPence\s+Int\?/.test(schema));
    assert.ok(/successFeeMinBps\s+Int/.test(schema));
    assert.ok(/feeBps\s+Int/.test(schema));
  });

  console.log('seed data');
  await test('seatline uses integer pence', async () => {
    const seatline = await prisma.listing.findUnique({ where: { slug: 'seatline' } });
    assert.ok(seatline, 'seatline must be seeded — run npm run db:seed');
    assert.equal(seatline!.askingPricePence, 1_850_000);
    assert.equal(seatline!.mrrPence, 89_000);
    assert.equal(Number.isInteger(seatline!.askingPricePence), true);
  });

  console.log('concurrency');
  const { completeDealAndPurge, isConflictError } = await import('../src/lib/deal-purge');
  const { hashPassword } = await import('../src/lib/auth');

  await test('atomic VERIFIED→CLOSING: only one updateMany wins', async () => {
    const stamp = Date.now();
    const seller = await prisma.user.create({
      data: {
        email: `seller-lock-${stamp}@test.local`,
        name: 'Lock Seller',
        role: 'SELLER',
        passwordHash: hashPassword('TestPass123!'),
      },
    });
    const listing = await prisma.listing.create({
      data: {
        slug: `lock-${stamp}`,
        title: 'Lock Asset',
        description: 'lock',
        askingPricePence: 100_000,
        sellerId: seller.id,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        highlights: '[]',
        gallery: '[]',
      },
    });

    const [a, b] = await Promise.all([
      prisma.listing.updateMany({
        where: { id: listing.id, verificationStatus: 'VERIFIED' },
        data: { verificationStatus: 'CLOSING' },
      }),
      prisma.listing.updateMany({
        where: { id: listing.id, verificationStatus: 'VERIFIED' },
        data: { verificationStatus: 'CLOSING' },
      }),
    ]);
    assert.equal(a.count + b.count, 1);
  });

  await test('concurrent completeDealAndPurge: one success, one ConflictError 409', async () => {
    const stamp = Date.now() + 3;
    const seller = await prisma.user.create({
      data: {
        email: `seller-toctou-${stamp}@test.local`,
        name: 'TOCTOU Seller',
        role: 'SELLER',
        passwordHash: hashPassword('TestPass123!'),
      },
    });
    const listing = await prisma.listing.create({
      data: {
        slug: `toctou-${stamp}`,
        title: 'TOCTOU Asset',
        description: 'Concurrency fixture',
        askingPricePence: 100_000,
        mrrPence: 5_000,
        sellerId: seller.id,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        highlights: '[]',
        gallery: '[]',
      },
    });
    const lead = await prisma.lead.create({
      data: {
        listingId: listing.id,
        buyerName: 'Buyer',
        buyerEmail: `buyer-toctou-${stamp}@test.local`,
        status: 'INTRODUCED',
        introducedAt: new Date(),
        acceptedTerms: true,
        acceptedNonCircumvention: true,
      },
    });

    const results = await Promise.allSettled([
      completeDealAndPurge({
        leadId: lead.id,
        closePricePence: 100_000,
        paymentRef: `pay_a_${stamp}`,
      }),
      completeDealAndPurge({
        leadId: lead.id,
        closePricePence: 100_000,
        paymentRef: `pay_b_${stamp}`,
      }),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    assert.equal(fulfilled.length, 1, `expected 1 success got ${fulfilled.length}`);
    assert.equal(rejected.length, 1, `expected 1 reject got ${rejected.length}`);
    const err = (rejected[0] as PromiseRejectedResult).reason;
    assert.ok(isConflictError(err), `expected ConflictError, got ${err}`);
    assert.equal(err.status, 409);

    const ledgers = await prisma.feeLedger.findMany({
      where: { paymentRef: { in: [`pay_a_${stamp}`, `pay_b_${stamp}`] } },
    });
    assert.equal(ledgers.length, 1);
    assert.equal(ledgers[0].amountPence, 3_000);
    assert.equal(ledgers[0].feeBps, 300);
  });

  await test('duplicate paymentRef → ConflictError 409', async () => {
    const stamp = Date.now() + 1;
    const seller = await prisma.user.create({
      data: {
        email: `seller-dup-${stamp}@test.local`,
        name: 'Dup Seller',
        role: 'SELLER',
        passwordHash: hashPassword('TestPass123!'),
      },
    });
    const listing = await prisma.listing.create({
      data: {
        slug: `dup-${stamp}`,
        title: 'Dup Asset',
        description: 'Dup fixture',
        askingPricePence: 200_000,
        sellerId: seller.id,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        highlights: '[]',
        gallery: '[]',
      },
    });
    const lead1 = await prisma.lead.create({
      data: {
        listingId: listing.id,
        buyerName: 'B1',
        buyerEmail: `b1-${stamp}@test.local`,
        status: 'INTRODUCED',
        acceptedTerms: true,
        acceptedNonCircumvention: true,
      },
    });

    await completeDealAndPurge({
      leadId: lead1.id,
      closePricePence: 200_000,
      paymentRef: `shared_ref_${stamp}`,
    });

    const seller2 = await prisma.user.create({
      data: {
        email: `seller-dup2-${stamp}@test.local`,
        name: 'Dup2',
        role: 'SELLER',
        passwordHash: hashPassword('TestPass123!'),
      },
    });
    const listing2 = await prisma.listing.create({
      data: {
        slug: `dup2-${stamp}`,
        title: 'Dup2',
        description: 'x',
        askingPricePence: 200_000,
        sellerId: seller2.id,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        highlights: '[]',
        gallery: '[]',
      },
    });
    const lead2 = await prisma.lead.create({
      data: {
        listingId: listing2.id,
        buyerName: 'B2',
        buyerEmail: `b2-${stamp}@test.local`,
        status: 'INTRODUCED',
        acceptedTerms: true,
        acceptedNonCircumvention: true,
      },
    });

    await assert.rejects(
      () =>
        completeDealAndPurge({
          leadId: lead2.id,
          closePricePence: 200_000,
          paymentRef: `shared_ref_${stamp}`,
        }),
      (e: unknown) => isConflictError(e) && (e as { status: number }).status === 409
    );
  });

  console.log('rate-limit');
  const { checkRateLimitAsync, checkRateLimit, RL } = await import('../src/lib/rate-limit');
  await test('lead burst exceeds limit → false (maps to HTTP 429)', async () => {
    const key = `test-lead-burst:${Date.now()}`;
    const opts = { windowMs: 60_000, max: 3 };
    assert.equal(await checkRateLimitAsync(key, opts), true);
    assert.equal(await checkRateLimitAsync(key, opts), true);
    assert.equal(await checkRateLimitAsync(key, opts), true);
    assert.equal(await checkRateLimitAsync(key, opts), false);
  });

  await test('sync checkRateLimit throws when NODE_ENV=production', async () => {
    const prev = process.env.NODE_ENV;
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'production';
    try {
      assert.throws(() => checkRateLimit('x'), /forbidden in production/);
    } finally {
      (process.env as { NODE_ENV?: string }).NODE_ENV = prev;
    }
  });

  await test('production without Upstash fails closed', async () => {
    const prev = process.env.NODE_ENV;
    const prevUrl = process.env.UPSTASH_REDIS_REST_URL;
    const prevTok = process.env.UPSTASH_REDIS_REST_TOKEN;
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'production';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try {
      const ok = await checkRateLimitAsync(`prod-fail:${Date.now()}`, RL.lead);
      assert.equal(ok, false);
    } finally {
      (process.env as { NODE_ENV?: string }).NODE_ENV = prev;
      if (prevUrl !== undefined) process.env.UPSTASH_REDIS_REST_URL = prevUrl;
      else delete process.env.UPSTASH_REDIS_REST_URL;
      if (prevTok !== undefined) process.env.UPSTASH_REDIS_REST_TOKEN = prevTok;
      else delete process.env.UPSTASH_REDIS_REST_TOKEN;
    }
  });

  console.log(`\n=== ${passed} passed, ${failed} failed ===\n`);
  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
