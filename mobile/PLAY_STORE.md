# Cladak Android — Google Play path

English-only mobile client for the Cladak verified Micro-SaaS exchange.
Operator context: **England · GBP · England & Wales law**.

## Status
- Client shell: ready (`com.cladak.exchange`)
- Backend rails: Stripe Checkout + evidence diligence + partner escrow + email outbox
- Store publish: one EAS build + Play Console credentials away (not published until you run submit)

## What this app does (v1)
- Browse verified listings
- Open asset detail + request intro (Terms + Non-Circumvention required)
- Submit sell intake **with evidence pack** (revenue URL, product URL, UI attestation, sworn)
- Sign in to Studio shell
- Trust Center copy

## Point at your API
```bash
cd mobile
echo 'EXPO_PUBLIC_API_URL=https://your-cladak-domain.com' > .env
# local emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3005
```

Also set `expo.extra.apiUrl` in `app.json` for production defaults.

## Run locally
```bash
cd mobile
npm install
npx expo start
```

## Build AAB for Google Play
1. `npx eas-cli login` + `eas init` → paste real `extra.eas.projectId` into `app.json`
2. Play Console app package: `com.cladak.exchange`
3. Service account JSON → `mobile/google-play-service-account.json` (**do not commit**)
4. Privacy policy URL live: `https://your-domain/legal/privacy`
5. Build + submit:
```bash
cd mobile
npx eas-cli build --platform android --profile production
npx eas-cli submit --platform android --profile production
```

## Store listing (ready copy)
- **Title:** Cladak — Verified Micro-SaaS
- **Short:** Buy and sell verified Micro-SaaS. GBP. England-based.
- **Full:** Cladak is a verified Micro-SaaS exchange. Listings require seller evidence (revenue proof, live product, sworn declaration). Seller contact is mediated. Success fee 3–5% via Stripe. Optional partner escrow — Cladak does not hold funds. England & Wales law.
- **Category:** Business
- **Content rating:** Everyone / PEGI 3 equivalent (no UGC chat in v1)
- **Data safety:** Account email for auth; no ad SDKs; purge after fee

## Pre-submit checklist
- [ ] HTTPS API live + `EXPO_PUBLIC_API_URL` set
- [ ] Privacy + Terms URLs open in-app
- [ ] Feature graphic 1024×500 + icon 512
- [ ] STRIPE_SECRET_KEY on server (or accept demo-only until live)
- [ ] RESEND_API_KEY for real buyer/seller mail (optional; outbox works without)

## Honest note
Publishing requires your Google Play Developer account. Code + listing draft are ready; the agent cannot click “Publish” without your Play credentials.
