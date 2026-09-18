# نقشه راه مالک — از الان تا اپ روی Google Play

کارهای کد و اتوماسیون تمام شده‌اند. این سند فقط کارهایی است که **تو** باید انجام بدهی (اکانت، پول، دامنه، انتشار).

ترتیب را عوض نکن: بدون HTTPS، اپ Play رد می‌شود؛ بدون Stripe، پول واقعی نمی‌آید.

---

## فاز A — هویت و امنیت (قبل از هر چیز عمومی)

### A1. رمزها را عوض کن
در production هرگز seed پیش‌فرض را نگه ندار:

| در | الان (لوکال) | کار تو |
|----|----------------|--------|
| `/cofounder` | `cladak-cofounder` | مقدار جدید در `COFOUNDER_ACCESS_CODE` |
| کوفایندر | `cofounder@cladak.com` / `CofounderPass123!` | یوزر/رمز قوی جدید بساز |
| Ops | `ops@cladak.com` / `AdminPass123!` | همین |
| `SESSION_SECRET` | مقدار dev | رشته تصادفی بلند |
| `AUDIT_SALT` | مقدار dev | رشته تصادفی بلند |
| `DEAL_COMPLETE_SECRET` | اختیاری | برای endpoint داخلی کامل‌کردن معامله |

### A2. دامنه بخر / وصل کن
- دامنه (مثلاً `cladak.com` یا subdomain)
- DNS → سرور/هاست
- هدف: `https://YOUR_DOMAIN` زنده باشد

---

## فاز B — هاست وب (API + سایت)

### B1. دیتابیس production
- SQLite فقط برای لوکال است
- برای live: PostgreSQL (مثلاً Neon / Supabase / RDS)
- `DATABASE_URL=postgresql://...`

### B2. دیپلوی
یکی از این‌ها:

**گزینه Docker (همین ریپو):**
```bash
docker build -t cladak .
docker run -p 3000:3000 --env-file .env.production cladak
```

**یا Node روی VPS:**
```bash
npm ci
npx prisma db push
# seed فقط یک‌بار اگر لازم است — بعد رمزها را عوض کن
npm run build && npm run start -- -p 3000
```

### B3. Env حیاتی روی سرور
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN
SESSION_SECRET=...
AUDIT_SALT=...
COFOUNDER_ACCESS_CODE=...
DEAL_COMPLETE_SECRET=...
```

### B4. چک سلامت
باز کن: `https://YOUR_DOMAIN/api/health`  
باید `"ok": true` ببینی.

صفحه‌های اجباری برای Play:
- `https://YOUR_DOMAIN/legal/privacy`
- `https://YOUR_DOMAIN/legal/terms`

---

## فاز C — پول واقعی (Stripe GBP)

### C1. اکانت Stripe
1. [stripe.com](https://stripe.com) — اکانت UK/GBP
2. Business details + بانک برای payout
3. از **Test mode** شروع کن، بعد Live

### C2. کلیدها
در Dashboard → Developers → API keys:
- `STRIPE_SECRET_KEY` = `sk_live_...` (یا `sk_test_...` اول)

### C3. Webhook
1. Endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`
2. Event: حداقل `checkout.session.completed`
3. Signing secret → `STRIPE_WEBHOOK_SECRET=whsec_...`

### C4. تست
1. یک لیستینگ با مدرک کامل بساز
2. Lead بزن
3. Pay success fee → بعد از پرداخت باید FeeLedger بیاید و حساب‌ها purge شوند
4. در Ops → Anonymous fee ledger چک کن

بدون این فاز، سیستم روی **demo checkout** می‌ماند (purge کار می‌کند، پول واقعی نه).

---

## فاز D — ایمیل واقعی (Resend)

### D1. اکانت Resend
1. [resend.com](https://resend.com)
2. دامنه را verify کن (DNS SPF/DKIM)
3. `RESEND_API_KEY=re_...`
4. `EMAIL_FROM=Cladak <ops@YOUR_DOMAIN>`

بدون Resend، ایمیل‌ها فقط در **Email outbox** داخل Ops ثبت می‌شوند.

---

## فاز E — Escrow پارتنر (اختیاری ولی توصیه‌شده)

کد الان به پارتنر ارجاع می‌دهد (پیش‌فرض Escrow.com). تو باید:

1. اکانت business روی پارتنر بسازی
2. در صورت نیاز نام/URL را در `PlatformConfig` عوض کنی:
   - `escrowPartnerName`
   - `escrowPartnerUrl`
3. بدان: **کلادک پول نگه نمی‌دارد** — فقط referral

---

## فاز F — اپ Android تا Google Play

بدون B (HTTPS) این فاز Fail می‌شود.

### F1. اکانت‌ها
- [ ] Google Play Console ($25 یک‌بار) — developer account
- [ ] Expo حساب → `npx eas-cli login`

### F2. پروژه EAS
```bash
cd mobile
npx eas-cli init
```
`projectId` را در `mobile/app.json` → `extra.eas.projectId` بگذار.

### F3. API اپ را به دامنه زنده ببند
`mobile/.env`:
```env
EXPO_PUBLIC_API_URL=https://YOUR_DOMAIN
```
و در `app.json` → `extra.apiUrl` همان URL.

### F4. دارایی‌های استور
آماده در ریپو:
- Feature graphic: `mobile/assets/store/feature_graphic_1024x500.png`
- Icon/splash: `mobile/assets/`

تو اضافه کن اگر خواستی:
- اسکرین‌شات واقعی از اپ (حداقل ۲–۴ تا، فون)
- توضیح کوتاه/بلند (متن پیشنهادی در `mobile/PLAY_STORE.md`)

### F5. Privacy / Data safety در Console
- Privacy policy URL: `https://YOUR_DOMAIN/legal/privacy`
- Data safety: ایمیل اکانت برای auth؛ بدون ad SDK؛ purge بعد از fee

### F6. ساخت AAB
```bash
cd mobile
npx eas-cli build --platform android --profile production
```

### F7. Service account برای submit (اختیاری اتومات)
1. Google Cloud → service account با دسترسی Play
2. JSON را بگذار: `mobile/google-play-service-account.json` (**commit نکن**)
3. یا AAB را دستی در Play Console آپلود کن

### F8. Submit / Review
```bash
npx eas-cli submit --platform android --profile production
```
یا آپلود دستی → Internal testing → بعد Production.

Package: `com.cladak.exchange`

### F9. بعد از Approve
- لینک استور را در سایت/مارکتینگ بگذار
- `playStoreUrl` در `app.json` درست است اگر package همان باشد

---

## فاز G — عملیات روزمره (بعد از live)

اتوماسیون بیشتر کارها را می‌کند؛ تو فقط:

| کار | کجا |
|-----|-----|
| لیستینگ‌های PENDING بدون مدرک کامل | `/ops` → Verify/Reject |
| درخواست Data Rights | `/ops` → Fulfill |
| وضعیت escrow پارتنر | `/ops` → Funded/Released |
| دیدن ایمیل‌ها / کارمزد ناشناس | `/ops` outbox + fee ledger |
| فارسی UI | `/cofounder` |

حلقه عادی خرید/فروش/کارمزد/پاک‌سازی حساب‌ها **بدون دخالت** توست — اگر Stripe+Resend درست باشد.

---

## چک‌لیست نهایی «آماده برای پول + اپ»

- [ ] دامنه + HTTPS
- [ ] Postgres + دیپلوی
- [ ] `NEXT_PUBLIC_APP_URL` درست
- [ ] رمزهای production عوض شده
- [ ] `/api/health` سبز
- [ ] Stripe live + webhook
- [ ] Resend + دامنه ایمیل
- [ ] یک معامله تست end-to-end موفق
- [ ] EAS projectId
- [ ] `EXPO_PUBLIC_API_URL` = دامنه زنده
- [ ] Privacy/Terms در استور
- [ ] AAB ساخته و در Play آپلود/approve شده

---

## آنچه عمداً بعداً است (لازم برای v1 نیست)

- NDA/VDR کامل
- Ingest خودکار Stripe/GA (الان لینک مدرک فروشنده است)
- Redis rate-limit چندسروره
- Custody واقعی escrow توسط خود کلادک (قانوناً پیچیده — عمداً پارتنر)

---

## دسترسی سریع لوکال (فقط تا قبل از عوض کردن رمزها)

| در | آدرس |
|----|------|
| Owner / فارسی | `/cofounder` · کد `cladak-cofounder` |
| لاگین | `/login` · `cofounder@cladak.com` / `CofounderPass123!` |
| Ops | `/ops` |
| راهنمای همین نقشه | `docs/OWNER_ROADMAP.md` |
