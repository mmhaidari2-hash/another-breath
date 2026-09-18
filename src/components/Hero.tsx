'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

export default function Hero({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  const lane = [...listings, ...listings];

  return (
    <section className="hero-field relative min-h-[100svh] overflow-hidden border-b border-coal/10">
      {/* Full-bleed visual plane: live asset ticker as the hero image */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] ticker-mask" aria-hidden>
        <div className="flex w-max animate-marquee gap-4 px-4">
          {lane.map((l, i) => (
            <div
              key={`${l.id}-${i}`}
              className="flex min-w-[240px] items-center justify-between gap-6 border border-coal/15 bg-stone-raised/80 px-5 py-4 backdrop-blur-sm"
            >
              <div>
                <p className="font-display text-xl font-bold leading-none">{l.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                  {l.niche} · {l.grade ?? '—'}
                </p>
              </div>
              <p className="font-mono text-sm font-semibold text-signal">
                {formatCurrency(l.askingPrice)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-shell flex-col justify-center px-4 pb-36 pt-16 sm:px-6">
        <p className="animate-rise eyebrow">Verified exchange</p>
        <h1
          className="animate-rise mt-4 font-display text-[clamp(4.5rem,16vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.04em] text-coal"
          style={{ animationDelay: '60ms' }}
        >
          CLADAK
        </h1>
        <p
          className="animate-rise mt-6 max-w-xl text-balance text-xl font-medium text-coal sm:text-2xl"
          style={{ animationDelay: '140ms' }}
        >
          {t.heroHeadline}
        </p>
        <p
          className="animate-rise mt-4 max-w-lg text-base leading-relaxed text-coal-soft sm:text-lg"
          style={{ animationDelay: '220ms' }}
        >
          {t.heroSub}
        </p>
        <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '300ms' }}>
          <Link href="/marketplace" className="btn-primary">
            {t.ctaBrowse}
          </Link>
          <Link href="/sell" className="btn-ghost">
            {t.ctaSell}
          </Link>
        </div>
      </div>
    </section>
  );
}
