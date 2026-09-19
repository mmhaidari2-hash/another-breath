# راهنمای نصب استپ‌بای‌استپ — Cladak روی دسکتاپ

این راهنما برای **تست لوکال** است (قبل از دامنه و Stripe و Play Store).

---

## پیش‌نیاز (یک‌بار)

### استپ ۰
1. برو به https://nodejs.org  
2. نسخه **LTS (20 یا بالاتر)** را دانلود و نصب کن  
3. نصب را تمام کن و لپ‌تاپ/کامپیوتر را اگر لازم بود یک‌بار Restart کن  

### استپ ۰‑ب — چک کن Node نصب است

**Windows:** Start → `PowerShell` را باز کن  
**Mac:** Terminal را باز کن (`Cmd+Space` → Terminal)

بعد بنویس:
```bash
node -v
npm -v
```

باید چیزی شبیه `v20.x.x` و `10.x.x` ببینی.  
اگر `command not found` آمد → Node درست نصب نشده؛ استپ ۰ را تکرار کن.

---

## راه A — با فایل ZIP (ساده‌ترین)

### استپ ۱ — دانلود
فایل `cladak-desktop-test.zip` را از Cursor (Artifacts) دانلود کن و روی Desktop بگذار.

### استپ ۲ — Extract
- **Windows:** راست‌کلیک → Extract All → پوشه مثلاً `Desktop\cladak`
- **Mac:** دابل‌کلیک روی ZIP → پوشه `cladak-desktop-test` ساخته می‌شود  
  پوشه را به Desktop بکش و اگر خواستی نامش را `cladak` بگذار

### استپ ۳ — ترمینال را داخل پوشه باز کن

**Windows (PowerShell):**
```powershell
cd $env:USERPROFILE\Desktop\cladak
```
(اگر اسم پوشه فرق دارد، همان اسم را بگذار)

**Mac / Linux:**
```bash
cd ~/Desktop/cladak
```

اگر مطمئن نیستی کجاست:
```bash
ls
```
باید `package.json` و `scripts` را ببینی.

### استپ ۴ — اجرا

**Windows:**
```powershell
.\scripts\desktop-start.ps1
```
اگر خطا داد: ExecutionPolicy
```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\desktop-start.ps1
```

**Mac / Linux:**
```bash
bash scripts/desktop-start.sh
```

### استپ ۵ — صبر کن
اولین بار چند دقیقه طول می‌کشد (`npm install` + build).  
وقتی این متن آمد، آماده‌ای:

```
Cladak ready
Open:  http://127.0.0.1:3005
```

### استپ ۶ — مرورگر
Chrome یا Edge را باز کن و برو به:

**http://127.0.0.1:3005**

---

## راه B — با Git (اگر Git داری)

### استپ ۱
Git را نصب کن اگر نداری: https://git-scm.com

### استپ ۲
```bash
cd ~/Desktop
git clone -b cursor/cladak-premium-redesign-dee3 https://github.com/mmhaidari2-hash/another-breath.git cladak
cd cladak
```

### استپ ۳
همان استپ ۴ راه A (`desktop-start`).

---

## ورود به پنل مالک

### استپ ۷ — فارسی / Owner
برو به: **http://127.0.0.1:3005/cofounder**  
کد را وارد کن:

```
cladak-cofounder
```

دکمه Unlock را بزن → فارسی در هدر فعال می‌شود.

### استپ ۸ — لاگین Ops
1. برو به **http://127.0.0.1:3005/login**  
2. ایمیل: `cofounder@cladak.com`  
3. رمز: `CofounderPass123!`  
4. بعد برو به **http://127.0.0.1:3005/ops**

---

## تست محصول (۱۰ دقیقه)

### استپ ۹ — فروش با مدرک
1. `/sell`  
2. نام و ایمیل تست بگذار  
3. محصول + MRR + قیمت  
4. Evidence: دو URL واقعی (`https://...`)  
5. تیک UI + سوگند + Terms  
6. Submit  

اگر مدرک کامل باشد → لیستینگ **VERIFIED** می‌شود.

### استپ ۱۰ — خرید / Intro
1. `/marketplace`  
2. یک لیستینگ باز کن  
3. Lead بفرست (نام + ایمیل + Terms)  
4. Intro اتومات می‌شود  

### استپ ۱۱ — پرداخت کارمزد (دمو)
1. در پنل بعد از Lead → **Pay success fee**  
2. چون Stripe نداری، **demo checkout** اجرا می‌شود  
3. بعدش حساب‌ها purge می‌شوند  
4. در `/ops` → Fee ledger و Email outbox را ببین  

---

## توقف

در همان پنجره ترمینال: **Ctrl + C**

دفعه بعد فقط:
```bash
cd ~/Desktop/cladak   # یا مسیر خودت
bash scripts/desktop-start.sh
```
(Windows: `.\scripts\desktop-start.ps1`)

---

## اگر گیر کردی

| مشکل | کار |
|------|-----|
| `node` پیدا نمی‌شود | Node را دوباره نصب کن؛ ترمینال را ببند و باز کن |
| پورت 3005 اشغال است | ترمینال قبلی را ببند، یا `PORT=3006 bash scripts/desktop-start.sh` |
| PowerShell اسکریپت را اجرا نمی‌کند | `Set-ExecutionPolicy -Scope Process Bypass` |
| صفحه سفید / خطا | صبر کن تا build تمام شود؛ بعد Hard refresh (`Ctrl+Shift+R`) |
| `EADDRINUSE` | یک `next` دیگر روی 3005 باز است — آن را ببند |

---

## جدول آدرس‌های مهم

| صفحه | آدرس |
|------|------|
| خانه | http://127.0.0.1:3005 |
| Owner / فارسی | http://127.0.0.1:3005/cofounder |
| لاگین | http://127.0.0.1:3005/login |
| Ops | http://127.0.0.1:3005/ops |
| فروش | http://127.0.0.1:3005/sell |
| بازار | http://127.0.0.1:3005/marketplace |

کد Owner: `cladak-cofounder`  
لاگین: `cofounder@cladak.com` / `CofounderPass123!`
