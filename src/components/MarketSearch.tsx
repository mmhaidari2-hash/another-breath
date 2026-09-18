'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLang } from '@/components/LanguageProvider';

export default function MarketSearch({ verifiedCount }: { verifiedCount: number; totalAsking?: number }) {
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
            {fa ? 'جستجو' : 'Search market'}
          </button>
        </form>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-coal-mute">
          {verifiedCount} {fa ? 'دارایی تأییدشده در بازار' : 'verified assets on the market'} ·{' '}
          {fa ? 'بدون آمار جعلی' : 'no fabricated claims'}
        </p>
      </div>
    </section>
  );
}
