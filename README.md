# CLADAK — Verified Micro-SaaS Exchange

England-based marketplace. Public product is **English only**. Persian is cofounder-gated (`/cofounder`). GBP · England & Wales law.

## What ships (no owner secrets required)
- Evidence-gated listings → auto-intro leads → Stripe Checkout (or demo) → purge
- Partner escrow referral · Email outbox · Ops desk · Auth/Studio · Android Expo client
- Health: `GET /api/health`

## What still needs you
| Item | Env / action |
|------|----------------|
| Live GBP fees | `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` → webhook `/api/webhooks/stripe` |
| Real email delivery | `RESEND_API_KEY` (+ `EMAIL_FROM`) |
| Public HTTPS host | Deploy container / Node host + `NEXT_PUBLIC_APP_URL` |
| Play Store publish | Your Play Console + `eas submit` (see `mobile/PLAY_STORE.md`) |

## Owner access (seed)
- `/cofounder` code: `cladak-cofounder`
- `cofounder@cladak.com` / `CofounderPass123!`
- `ops@cladak.com` / `AdminPass123!`

## Web
```bash
npm install
cp .env.example .env
npx prisma db push && npm run db:seed
npm run build && npm run start -- -p 3005
# or: bash scripts/prod-local.sh
```

## Docker
```bash
docker build -t cladak .
docker run --rm -p 3000:3000 --env-file .env cladak
```

## Mobile
```bash
cd mobile && npm install && npx expo start
```

Docs: `docs/OWNER_ACCESS.md` · `docs/architecture-and-idea.md` · `mobile/PLAY_STORE.md`
