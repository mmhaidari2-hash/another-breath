# کلادک (CLADAK) — فاز ۱ · Micro-SaaS

بازارچه‌ی تأییدشده برای خرید و فروش Micro-SaaS. فقط لیستینگ‌هایی که دستی بررسی شده‌اند در فهرست عمومی دیده می‌شوند.

📄 معماری و قوانین: [`docs/architecture-and-idea.md`](./docs/architecture-and-idea.md)

## چی داخلشه
- طراحی پرمیوم RTL (کلادک / CLADAK)
- ۱۰ لیستینگ نمونهٔ تأییدشده (seed)
- فرم تماس خریدار با Zod + rate limit + Prisma
- صفحهٔ فروش (درخواست بررسی از طریق ایمیل — تا آماده‌شدن پنل)
- rubric امتیازدهی Micro-SaaS در دیتابیس

## چی عمداً نیست (فاز ۲+)
- NDA / VDR / پرداخت آنلاین / اتصال خودکار Stripe-GA

## قانون طلایی
هیچ آمار یا ادعای جعلی روی صفحات عمومی نگذارید مگر واقعاً درست باشد.

## راه‌اندازی
```bash
npm install
cp .env.example .env   # پیش‌فرض: SQLite
npx prisma db push
npm run db:seed
npm run dev
```

برای production می‌توانید `DATABASE_URL` را به PostgreSQL تغییر دهید و `provider` در `prisma/schema.prisma` را به `postgresql` برگردانید.
