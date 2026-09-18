'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function TrustDesk({
  verified,
  leads,
  audits,
  feeMin,
  feeMax,
}: {
  verified: number;
  leads: number;
  audits: number;
  feeMin: number;
  feeMax: number;
}) {
  const { lang } = useLang();
  const fa = lang === 'fa';

  const blocks = fa
    ? [
        {
          t: 'تأیید',
          d: 'فقط لیستینگ VERIFIED عمومی است. یادداشت بررسی روی دارایی می‌ماند. Stripe/GA خودکار فاز ۲ است — همین را می‌گوییم.',
        },
        {
          t: 'ضد دور زدن',
          d: 'تماس فروشنده هرگز عمومی نیست. Lead نیازمند Terms + Non-Circumvention است. URL دمو پیش‌فرض intro-only است.',
        },
        {
          t: 'پایه امنیت',
          d: 'هدرهای امنیتی، اعتبارسنجی Zod، rate limit، IP هش‌شده، مسیر audit، بدون ایمیل فروشنده در پاسخ API.',
        },
        {
          t: 'فاز ۱ چه چیزی نیست',
          d: 'Escrow نیست، SOC2 نیست، بانک نیست، جایگزین diligence خریدار نیست. ادعای خلاف این ممنوع است.',
        },
      ]
    : [
        {
          t: 'Verification',
          d: 'Only VERIFIED listings are public. Review notes stay on the asset. Automated Stripe/GA is Phase 2 — we say so.',
        },
        {
          t: 'Anti-circumvention',
          d: 'Seller contacts are never public. Leads require Terms + Non-Circumvention. Demo URLs default to intro-only.',
        },
        {
          t: 'Security baseline',
          d: 'Security headers, Zod validation, rate limits, hashed IPs, audit trail, no seller email in API responses.',
        },
        {
          t: 'What Phase 1 is not',
          d: 'Not escrow, not SOC2, not a bank, not a substitute for buyer diligence. Those claims would violate our golden rule.',
        },
      ];

  return (
    <>
      <p className="eyebrow mt-8">{fa ? 'مرکز اعتماد' : 'Trust Center'}</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
        {fa ? 'ساخته‌شده برای diligence' : 'Built for diligence'}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-coal-soft">
        {fa
          ? 'پاسخ خریدار، فروشنده، سرمایه‌گذار و ممیز — بدون گواهی جعلی.'
          : 'Answers for buyers, sellers, investors, and auditors — without fabricated certificates.'}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label={fa ? 'لیستینگ تأییدشده' : 'Verified listings'}
          value={String(verified)}
        />
        <Stat label={fa ? 'درخواست‌های Lead' : 'Leads (all-time)'} value={String(leads)} />
        <Stat label={fa ? 'رویدادهای Audit' : 'Audit events'} value={String(audits)} />
        <Stat label={fa ? 'کارمزد موفقیت' : 'Success fee'} value={`${feeMin}–${feeMax}%`} />
      </div>

      <section className="mt-12 space-y-4">
        {blocks.map((b, i) => (
          <article key={b.t} className="border border-coal/12 bg-stone-raised p-6">
            <p className="font-mono text-[11px] text-signal">0{i + 1}</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{b.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-coal-soft">{b.d}</p>
          </article>
        ))}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/questions" className="btn-primary">
          {fa ? '۵۰ سؤال کلیدی' : '50 key questions'}
        </Link>
        <Link href="/legal/non-circumvention" className="btn-ghost">
          Non-Circumvention
        </Link>
        <Link href="/legal/privacy" className="btn-ghost">
          Privacy
        </Link>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-coal/10 bg-stone-raised p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
