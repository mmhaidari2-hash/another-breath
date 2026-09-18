# کلادک (CLADAK) — فاز ۱ · Micro-SaaS Exchange

بازار تأییدشده برای خرید و فروش Micro-SaaS. فقط لیستینگ‌های دستی‌بررسی‌شده در فهرست عمومی دیده می‌شوند.

📄 معماری: [`docs/architecture-and-idea.md`](./docs/architecture-and-idea.md)

## محصول
- لندینگ + بازار با جستجو/فیلتر/مرتب‌سازی
- ۱۰ لیستینگ تأییدشده (seed) با MRR، درجه، stack، یادداشت بررسی
- صفحه جزئیات + فرم Lead واقعی (Zod + rate limit)
- صفحه Trust / Verification
- فرم فروش با API ذخیره‌سازی `SellerInquiry`
- FA / EN

## قانون طلایی
هیچ آمار یا ادعای جعلی روی صفحات عمومی نگذارید مگر واقعاً درست باشد.

## اجرا
```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Production: `DATABASE_URL` را به PostgreSQL ببرید و `provider` اسکیما را عوض کنید.
