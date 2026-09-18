'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function TrustDesk({ verified }: { verified: number }) {
  const { lang } = useLang();
  const fa = lang === 'fa';

  const standards = fa
    ? [
        {
          t: 'تأیید دستی قبل از انتشار',
          d: 'هیچ لیستینگی بدون وضعیت VERIFIED عمومی نمی‌شود. یادداشت بررسی روی دارایی می‌ماند.',
        },
        {
          t: 'شواهد درآمد / محصول / UI',
          d: 'فاز ۱: شواهد آپلود/اسکرین دستی. Stripe/GA زنده فاز ۲ است — بدون ادعای دروغ.',
        },
        {
          t: 'ضد دور زدن',
          d: 'ایمیل فروشنده عمومی نیست. Lead با Terms + Non-Circumvention. URL اغلب intro-only.',
        },
        {
          t: 'پروتکل Closing',
          d: 'مسیر intro → diligence → close مستند است. Escrow شریک فاز ۲؛ امروز جعل نمی‌کنیم.',
        },
      ]
    : [
        {
          t: 'Manual verification before publish',
          d: 'Nothing goes public without VERIFIED status. Review notes stay on the asset page.',
        },
        {
          t: 'Revenue · product · UI evidence',
          d: 'Phase 1 reviews seller-submitted evidence by hand. Live Stripe/GA ingest is Phase 2 — stated plainly.',
        },
        {
          t: 'Anti-circumvention by default',
          d: 'Seller email never public. Leads require Terms + Non-Circumvention. Demo URLs default to intro-only.',
        },
        {
          t: 'Documented closing protocol',
          d: 'Intro → diligence → commercial terms → close is written down. Escrow partner rails are Phase 2.',
        },
      ];

  return (
    <>
      <p className="eyebrow mt-8">{fa ? 'مرکز اعتماد' : 'Trust Center'}</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
        {fa ? 'اعتماد از فرایند' : 'Trust from process'}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-coal-soft">
        {fa
          ? 'سیگنال اعتماد برای خریدار و فروشنده — نه داشبورد داخلی، نه گواهی جعلی.'
          : 'Buyer- and seller-facing trust signals — not an internal ops dashboard, not fabricated certificates.'}
      </p>

      <div className="mt-10 border border-coal/12 bg-stone-raised p-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {fa ? 'بازار عمومی' : 'Public market'}
        </p>
        <p className="mt-2 font-display text-4xl font-bold">
          {verified}{' '}
          <span className="text-2xl text-coal-soft">
            {fa ? 'دارایی تأییدشده' : 'verified assets live'}
          </span>
        </p>
        <p className="mt-2 text-sm text-coal-soft">
          {fa
            ? 'این عدد فقط از دیتابیس محصول خوانده می‌شود.'
            : 'This count is read from the live product database — not marketing inventiveness.'}
        </p>
      </div>

      <section className="mt-12 space-y-4">
        {standards.map((b, i) => (
          <article key={b.t} className="border-b border-coal/10 pb-6">
            <p className="font-mono text-[11px] text-signal">0{i + 1}</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{b.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-coal-soft">{b.d}</p>
          </article>
        ))}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/questions" className="btn-primary">
          {fa ? '۵۰ سؤال diligence' : '50 diligence questions'}
        </Link>
        <Link href="/closing" className="btn-ghost">
          Closing protocol
        </Link>
        <Link href="/legal/non-circumvention" className="btn-ghost">
          Non-Circumvention
        </Link>
      </div>
    </>
  );
}
