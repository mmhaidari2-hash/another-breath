'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function SellCTA() {
  const { t } = useLang();
  return (
    <section className="py-24">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/10 bg-navy px-8 py-14 text-white sm:px-14">
          <div
            className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-forest/40 blur-3xl"
            aria-hidden
          />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            {t.navSell}
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
            {t.sellBannerTitle}
          </h2>
          <p className="mt-4 max-w-lg text-white/75">{t.sellBannerBody}</p>
          <Link
            href="/sell"
            className="mt-8 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-paper"
          >
            {t.sellBannerCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
