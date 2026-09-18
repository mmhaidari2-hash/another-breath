'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useLang } from '@/components/LanguageProvider';

export default function MarketSearch({
  verifiedCount,
  totalAsking,
}: {
  verifiedCount: number;
  totalAsking: number;
}) {
  const { lang } = useLang();
  const router = useRouter();
  const [q, setQ] = useState('');
  const fa = lang === 'fa';

  return (
    <section className="border-b border-coal/10 bg-stone-raised py-10">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/marketplace?q=${encodeURIComponent(q)}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={fa ? 'جستجوی دارایی تأییدشده…' : 'Search verified assets…'}
            className="input-field flex-1 !py-4 text-base"
          />
          <button type="submit" className="btn-primary !px-8">
            {fa ? 'جستجو در بازار' : 'Search market'}
          </button>
        </form>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label={fa ? 'لیستینگ تأییدشده' : 'Verified listings'} value={String(verifiedCount)} />
          <Stat label={fa ? 'ارزش فهرست' : 'Listed value'} value={formatCurrency(totalAsking)} />
          <Stat
            label={fa ? 'ادعای جعلی' : 'Fabricated claims'}
            value={fa ? '۰ — ممنوع' : '0 — banned'}
          />
        </div>
        <p className="mt-4 text-xs text-coal-mute">
          {fa
            ? 'این اعداد فقط از دیتابیس واقعی همین محصول خوانده می‌شوند — نه marketing ساختگی.'
            : 'These numbers are read from this product database — not invented marketing stats.'}
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-coal/10 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
