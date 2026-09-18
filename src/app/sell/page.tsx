'use client';

import Link from 'next/link';
import SellForm from '@/components/SellForm';
import { useLang } from '@/components/LanguageProvider';

export default function SellPage() {
  const { lang } = useLang();
  const fa = lang === 'fa';

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto grid max-w-shell gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" className="text-sm text-coal-mute hover:text-coal">
            {fa ? 'بازگشت' : 'Back'}
          </Link>
          <p className="eyebrow mt-8">{fa ? 'فروشندگان' : 'Sellers'}</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            {fa ? 'فروش در کلادک' : 'Sell on Cladak'}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-coal-soft">
            {fa
              ? 'ثبت رایگان. بررسی دستی. فقط بعد از تأیید در بازار. درخواست در دیتابیس ذخیره می‌شود.'
              : 'Free to submit. Manual review. Public only after verification. Inquiry is stored in the database.'}
          </p>
        </div>
        <div className="lg:col-span-7">
          <SellForm />
        </div>
      </div>
    </main>
  );
}
