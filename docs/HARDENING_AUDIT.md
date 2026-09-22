# Hardening audit — Cladak (executed / closed 2026-09-22)

## Phase 1 — Root & database

| Check | Finding | Action |
|-------|---------|--------|
| Multi-tenant relations | **Not present** — single-operator marketplace (honest) | No fake multi-tenant layer |
| GBP precision | Float money eliminated | All money = integer pence (`*Pence`) / fee BPS (`*Bps`) |
| Listing statuses | PENDING / VERIFIED / REJECTED / CLOSING | CLOSING lock for atomic settle |
| Fee double-spend | `paymentRef` unique | Enforced + ConflictError → 409 |
| Seed | Integer pence seed data | Verified after `db push` |

## Phase 2 — Zod URL validation

- HTTPS-only evidence URLs in production / non-development
- `localhost` / loopback / `*.internal` / staging hosts **only** when `NODE_ENV === 'development'`
- Always reject `example.com`, fake/placeholder/invalid hosts

## Phase 3 — Frontend / server

- Display via `formatPence` / `formatCurrency(pence)`
- Forms accept GBP major units; routes convert with `gbpToPence` before persistence

## Phase 4 — Concurrency

- `completeDealAndPurge` uses `prisma.$transaction` with **Serializable** isolation
- `VERIFIED → CLOSING` via `updateMany` WHERE `verificationStatus: 'VERIFIED'` only (no soft CLOSING retry)
- Escrow open-case creation is transactional; duplicates → **409 Conflict**
- Duplicate payment / concurrent close → **409 Conflict**

## Phase 5 — Rate limit & security

- Production: **Upstash Redis mandatory** (`UPSTASH_REDIS_REST_*`); missing/unreachable → fail closed (429)
- Sync `checkRateLimit` throws in production — all routes use `checkRateLimitAsync`
- Dev: durable `RateLimitBucket` (in-memory never authoritative in prod)
- Lead / auth / seller / deal / escrow / cofounder / data-rights return **429** on burst

## Remaining (needs owner infra)

- Live Stripe / Resend / HTTPS host / Play publish
- Upstash Redis credentials in production
- Postgres for multi-instance production DB
