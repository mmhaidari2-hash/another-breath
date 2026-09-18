'use client';

import Link from 'next/link';
import SellWizard from '@/components/SellWizard';
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
          <p className="eyebrow mt-8">Sell desk</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            {fa ? 'لیست کردن دارایی' : 'List an asset'}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-coal-soft">
            {fa
              ? 'ویزارد سه‌مرحله‌ای. ذخیره واقعی در دیتابیس. انتشار فقط بعد از تأیید دستی.'
              : 'Three-step wizard. Real database persistence. Public only after manual verification.'}
          </p>
        </div>
        <div className="lg:col-span-7">
          <SellWizard />
        </div>
      </div>
    </main>
  );
}
