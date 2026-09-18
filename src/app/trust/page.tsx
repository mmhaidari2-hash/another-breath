'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function TrustPage() {
  const { lang } = useLang();
  const fa = lang === 'fa';

  const blocks = fa
    ? [
        {
          t: 'چه چیزی تأیید می‌شود',
          d: 'درآمد اعلامی، دمو محصول، کیفیت UI، و یادداشت شفاف بررسی‌کننده.',
        },
        {
          t: 'چه چیزی هنوز خودکار نیست',
          d: 'Stripe/GA خودکار فاز ۲ است. الان بررسی دستی است — و همین را می‌گوییم.',
        },
        {
          t: 'قانون طلایی',
          d: 'هیچ عدد ساختگی روی صفحات عمومی نمی‌رود.',
        },
        {
          t: 'امتیاز و درجه',
          d: 'فقط بعد از تأیید. rubric در دیتابیس است.',
        },
      ]
    : [
        {
          t: 'What we verify',
          d: 'Claimed revenue, product demo, UI quality, and a clear reviewer note.',
        },
        {
          t: 'What is not automated yet',
          d: 'Stripe/GA pulls are Phase 2. Review is manual — and we say so.',
        },
        {
          t: 'Golden rule',
          d: 'No fabricated numbers on public pages.',
        },
        {
          t: 'Score & grade',
          d: 'Only after verification. Rubric lives in the database.',
        },
      ];

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          {fa ? 'بازگشت' : 'Back'}
        </Link>
        <p className="eyebrow mt-8">Trust</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          {fa ? 'چطور تأیید می‌کنیم' : 'How we verify'}
        </h1>
        <div className="mt-12 space-y-4">
          {blocks.map((b, i) => (
            <article key={b.t} className="border border-coal/12 bg-stone-raised p-6">
              <p className="font-mono text-[11px] text-signal">0{i + 1}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{b.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-coal-soft">{b.d}</p>
            </article>
          ))}
        </div>
        <Link href="/sell" className="btn-primary mt-10">
          {fa ? 'ارسال محصول' : 'Submit a product'}
        </Link>
      </div>
    </main>
  );
}
