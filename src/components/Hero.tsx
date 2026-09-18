'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

export default function Hero({ listings }: { listings: ListingDTO[] }) {
  const { t, lang } = useLang();
  const lane = [...listings, ...listings];

  return (
    <section className="hero-field relative min-h-[100svh] overflow-hidden border-b border-coal/10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-signal/[0.07] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 ticker-mask pb-8 pt-24">
          <div className="flex w-max animate-marquee gap-10 px-6 opacity-40">
            {lane.map((l, i) => (
              <div key={`${l.id}-${i}`} className="flex min-w-[200px] items-baseline gap-4">
                <span className="font-display text-3xl font-bold tracking-tight text-coal">
                  {l.title}
                </span>
                <span className="font-mono text-sm text-signal">{formatCurrency(l.askingPrice)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-shell flex-col justify-center px-4 pb-28 pt-16 sm:px-6">
        <h1
          className="animate-rise font-display text-[clamp(4.5rem,16vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.04em] text-coal"
        >
          CLADAK
        </h1>
        <p
          className="animate-rise mt-6 max-w-xl text-balance text-lg leading-relaxed text-coal-soft sm:text-xl"
          style={{ animationDelay: '120ms' }}
        >
          {t.heroSub}
        </p>
        <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '220ms' }}>
          <Link href="/marketplace" className="btn-primary">
            {t.ctaBrowse}
          </Link>
          <Link href="/sell" className="btn-ghost">
            {t.ctaSell}
          </Link>
        </div>
        <p
          className="animate-rise mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-coal-mute"
          style={{ animationDelay: '300ms' }}
        >
          {lang === 'fa' ? 'تبادل تأییدشده · Micro-SaaS' : 'Verified exchange · Micro-SaaS'}
        </p>
      </div>
    </section>
  );
}
