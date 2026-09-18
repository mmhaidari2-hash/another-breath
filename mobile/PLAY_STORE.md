# Cladak Android — Google Play path

English-only mobile client for the Cladak verified Micro-SaaS exchange.
Operator context: **England · GBP · England & Wales law**.

## What this app does (v1)
- Browse verified listings
- Open asset detail + request intro (Terms + Non-Circumvention required)
- Submit sell intake (creates PENDING listing on API)
- Sign in to Studio shell
- Trust Center copy

## Point at your API
```bash
cd mobile
echo 'EXPO_PUBLIC_API_URL=https://your-cladak-domain.com' > .env
# local:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3005   # Android emulator → host
```

Also set `expo.extra.apiUrl` in `app.json` for production defaults.

## Run locally
```bash
cd mobile
npm install
npx expo start
```

## Build for Google Play (AAB)
1. Create an Expo account and run `npx eas-cli login`
2. Replace `extra.eas.projectId` in `app.json` after `eas init`
3. Create a Google Play Console app with package `com.cladak.exchange`
4. Create a Play service account JSON → `mobile/google-play-service-account.json` (do not commit)
5. Build:
```bash
cd mobile
npx eas-cli build --platform android --profile production
npx eas-cli submit --platform android --profile production
```

## Store listing (draft copy)
- **Title:** Cladak — Verified Micro-SaaS
- **Short:** Buy and sell verified Micro-SaaS assets. GBP. England-based.
- **Full:** Cladak is a verified exchange for Micro-SaaS. Only manually reviewed assets go public. Seller contact is mediated. Success fee 3–5% on closed deals. Escrow partner rails are Phase 2.

## Honest limits
This is the Play-ready client shell. It does not invent escrow, SOC2, or live Stripe/GA. Backend must be deployed and HTTPS before store review.
