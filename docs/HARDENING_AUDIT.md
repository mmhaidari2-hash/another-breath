# Hardening audit — Cladak (executed 2026-09-22)

## Phase 1 — Root & database

| Check | Finding | Action |
|-------|---------|--------|
| Multi-tenant relations | **Not present** — single-operator marketplace (honest) | No fake multi-tenant layer |
| GBP precision | `Float` for asking/MRR/fee — float drift risk | Added `FeeLedger.amountPence` (int) as settlement truth |
| Listing statuses | PENDING / VERIFIED / REJECTED | Added **CLOSING** lock status for atomic settle |
| Fee double-spend | `paymentRef` not unique | `@unique` on `paymentRef` |
| Seed | Clean with Prisma 5 | Verified after `db push` |

## Phase 2 — Zod

- HTTPS-only evidence URLs; block localhost / example.com / fake hosts
- Shared `checkoutSchema`, `dealCompleteSchema`, `escrowSchema`, `gbpAmountSchema`
- Sworn evidence requires both revenue + product HTTPS URLs

## Phase 3 — Frontend / server

- Dev server on `:3005` — `/`, `/marketplace`, `/sell` return 200
- Seed populates 10 VERIFIED listings

## Phase 4 — Concurrency

- `completeDealAndPurge` runs in `prisma.$transaction`
- Listing `VERIFIED → CLOSING` lock (updateMany count check) — TOCTOU closed
- Duplicate `paymentRef` / `leadIdHash` rejected
- Escrow rejects second open case for same lead (409)

## Phase 5 — Rate limit & security

- In-memory + durable `RateLimitBucket` table
- Optional Upstash Redis when `UPSTASH_REDIS_REST_*` set
- Per-route presets (`RL.auth/lead/seller/deal/escrow`)

## Remaining (needs owner infra)

- Live Stripe / Resend / HTTPS host / Play publish
- True Redis cluster (optional Upstash)
- Postgres Decimal money types in production DB
