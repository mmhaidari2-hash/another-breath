'use client';

import Link from 'next/link';
import SellForm from '@/components/SellForm';
import { useLang } from '@/components/LanguageProvider';

export default function SellPage() {
  const { lang } = useLang();
  const fa = lang === 'fa';

  return (
    <main className="pb-24 pt-10">
      <div className="mx-auto grid max-w-shell gap-10 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" className="text-sm text-ink-faint hover:text-ink">
            {fa ? 'بازگشت' : 'Back'}
          </Link>
          <p className="section-eyebrow mt-8">{fa ? 'فروشندگان' : 'Sellers'}</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            {fa ? 'فروش در کلادک' : 'Sell on Cladak'}
          </h1>
          <p className="mt-4 text-ink-soft leading-relaxed">
            {fa
              ? 'ثبت رایگان است. محصولت دستی بررسی می‌شود و فقط بعد از تأیید در بازار دیده می‌شود. این فرم درخواست را در دیتابیس ذخیره می‌کند — نه نمایش تزئینی.'
              : 'Listing is free. Your product is manually reviewed and only goes public after verification. This form stores a real inquiry in the database — not a decorative mailto.'}
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink-soft">
            <li className="border-s-2 border-forest ps-3">
              {fa ? 'بدون آمار جعلی روی لیستینگ' : 'No fabricated metrics on listings'}
            </li>
            <li className="border-s-2 border-forest ps-3">
              {fa ? 'یادداشت بررسی همراه آگهی می‌ماند' : 'Review notes stay with the listing'}
            </li>
            <li className="border-s-2 border-forest ps-3">
              {fa ? 'کارمزد فقط روی معامله بسته‌شده' : 'Success fee only on closed deals'}
            </li>
          </ul>
        </div>
        <div className="lg:col-span-7">
          <SellForm />
        </div>
      </div>
    </main>
  );
}
