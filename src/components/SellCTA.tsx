'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function SellCTA() {
  const { t } = useLang();
  return (
    <section className="py-24">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="relative overflow-hidden border border-coal bg-coal px-8 py-16 text-white sm:px-14">
          <div className="absolute -end-10 top-0 h-40 w-40 bg-signal/40 blur-3xl" aria-hidden />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{t.navSell}</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {t.sellBannerTitle}
          </h2>
          <p className="mt-4 max-w-lg text-white/65">{t.sellBannerBody}</p>
          <Link href="/sell" className="btn-primary mt-10">
            {t.sellBannerCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
