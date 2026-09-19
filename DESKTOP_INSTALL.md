# Cladak — نصب روی دسکتاپ (تست لوکال)

حداقل نیاز: **Node.js 20+** از https://nodejs.org

## راه ۱ — از GitHub (پیشنهادی)

```bash
git clone -b cursor/cladak-premium-redesign-dee3 https://github.com/mmhaidari2-hash/another-breath.git cladak
cd cladak
```

### macOS / Linux
```bash
bash scripts/desktop-start.sh
```

### Windows (PowerShell)
```powershell
.\scripts\desktop-start.ps1
```

بعد مرورگر را باز کن:

**http://127.0.0.1:3005**

---

## راه ۲ — از فایل ZIP

1. ZIP را از حالت فشرده خارج کن
2. ترمینال را داخل پوشه باز کن
3. همان دستورهای بالا (`desktop-start`)

---

## دسترسی مالک (تست)

| چه | آدرس / مقدار |
|----|----------------|
| سایت | http://127.0.0.1:3005 |
| فارسی / Owner | http://127.0.0.1:3005/cofounder |
| کد کوفایندر | `cladak-cofounder` |
| لاگین | http://127.0.0.1:3005/login |
| ایمیل | `cofounder@cladak.com` |
| رمز | `CofounderPass123!` |
| Ops | http://127.0.0.1:3005/ops |
| Ops جایگزین | `ops@cladak.com` / `AdminPass123!` |

---

## تست سریع پیشنهاد می‌شود

1. `/sell` → لیستینگ با مدرک کامل بساز  
2. از Market یک دارایی باز کن → Lead بزن  
3. Pay success fee (دمو بدون Stripe) → حساب‌ها purge می‌شوند  
4. `/ops` → outbox و fee ledger را ببین  

---

## توقف سرور

در همان ترمینال: `Ctrl+C`

---

## اپ موبایل (اختیاری، بعد از وب)

```bash
cd mobile
npm install
echo "EXPO_PUBLIC_API_URL=http://127.0.0.1:3005" > .env
npx expo start
```

روی گوشی واقعی، IP دسکتاپ را بگذار نه `127.0.0.1` (مثلاً `http://192.168.1.x:3005`).

---

## اگر خطا دیدی

- Node کمتر از 20 → ارتقا بده  
- پورت 3005 اشغال → در `.env` عوض نکن؛ فرایند قبلی را ببند یا `PORT=3006 bash scripts/desktop-start.sh`  
- `prisma` خطا → `npx prisma generate && npx prisma db push`
