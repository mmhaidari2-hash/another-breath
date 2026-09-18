# CLADAK — Phase 1 · Verified Micro-SaaS Exchange

England-based marketplace for buying and selling Micro-SaaS. Public product is **English only**. Persian is cofounder-gated. GBP · England & Wales law.

Architecture: [`docs/architecture-and-idea.md`](./docs/architecture-and-idea.md)  
Android / Play path: [`mobile/PLAY_STORE.md`](./mobile/PLAY_STORE.md)

## Product
- Web market + listing desks + Sell → PENDING → Ops VERIFY loop
- Auth, Studio, Ops, Closing protocol, Trust Center
- Anti-circumvention gated leads
- Mobile app (`mobile/`) for Google Play via EAS

## Golden rule
No fabricated stats, SOC2, or escrow claims.

## Web
```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

## Mobile
```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

See `mobile/PLAY_STORE.md` for AAB / Play Console steps.
