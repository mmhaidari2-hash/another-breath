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
          d: 'درآمد اعلامی (اسکرین/دسترسی فقط‌خواندنی در صورت امکان)، دمو محصول، کیفیت UI/UX، و یادداشت شفاف از بررسی‌کننده.',
        },
        {
          t: 'چه چیزی تأیید نمی‌شود (هنوز)',
          d: 'اتصال خودکار Stripe/GA در فاز ۲ است. الان بررسی دستی است — و صادقانه همین را می‌گوییم.',
        },
        {
          t: 'قانون طلایی',
          d: 'هیچ عدد یا گواهی ساختگی روی صفحات عمومی نمی‌رود. اگر عدد واقعی نداریم، خالی می‌ماند یا با عبارت صادقانه پر می‌شود.',
        },
        {
          t: 'امتیاز و درجه',
          d: 'فقط بعد از تأیید محاسبه می‌شود. rubric حوزه‌ی Micro-SaaS در دیتابیس است و قابل‌تغییر بدون هاردکد.',
        },
      ]
    : [
        {
          t: 'What we verify',
          d: 'Claimed revenue (screens / read-only access when possible), product demo, UI/UX quality, and a clear reviewer note.',
        },
        {
          t: 'What we do not pretend to verify yet',
          d: 'Automated Stripe/GA pulls are Phase 2. Today review is manual — and we say so honestly.',
        },
        {
          t: 'Golden rule',
          d: 'No fabricated numbers or certificates on public pages. If we lack a real figure, it stays empty or uses honest wording.',
        },
        {
          t: 'Score & grade',
          d: 'Computed only after verification. The Micro-SaaS rubric lives in the database — not hardcoded.',
        },
      ];

  return (
    <main className="pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-ink-faint hover:text-ink">
          {fa ? 'بازگشت' : 'Back'}
        </Link>
        <p className="section-eyebrow mt-8">{fa ? 'اعتماد' : 'Trust'}</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-6xl">
          {fa ? 'چطور تأیید می‌کنیم' : 'How verification works'}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {fa
            ? 'کلادک یک دایرکتوری باز نیست. فهرست عمومی فقط لیستینگ‌های VERIFIED را نشان می‌دهد.'
            : 'Cladak is not an open dump of listings. The public market only shows VERIFIED assets.'}
        </p>
        <div className="mt-12 space-y-6">
          {blocks.map((b) => (
            <article key={b.t} className="rounded-2xl border border-ink/10 bg-paper-raised p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-ink">{b.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.d}</p>
            </article>
          ))}
        </div>
        <Link href="/sell" className="btn-primary mt-10">
          {fa ? 'ارسال محصول برای بررسی' : 'Submit a product for review'}
        </Link>
      </div>
    </main>
  );
}
