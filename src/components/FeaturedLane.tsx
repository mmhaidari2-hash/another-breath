'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

/** Cinematic featured lane — not a card grid */
export default function FeaturedLane({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  if (!listings.length) return null;

  return (
    <section className="border-b border-coal/10 bg-coal py-16 text-white">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{t.featured}</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t.featured}
            </h2>
          </div>
          <Link href="/marketplace" className="text-sm text-white/60 underline-offset-4 hover:text-white hover:underline">
            {t.ctaBrowse}
          </Link>
        </div>
      </div>

      <div className="mt-10 flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6" style={{ scrollSnapType: 'x mandatory' }}>
        {listings.map((l, idx) => (
          <Link
            key={l.id}
            href={`/listing/${l.slug}`}
            className="group relative min-w-[85vw] flex-shrink-0 scroll-mx-4 border border-white/10 bg-white/[0.04] p-7 transition hover:border-signal/50 sm:min-w-[420px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs text-signal">0{idx + 1}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                {l.niche} · {t.grade} {l.grade}
              </span>
            </div>
            <h3 className="mt-8 font-display text-4xl font-bold tracking-tight transition group-hover:text-signal sm:text-5xl">
              {l.title}
            </h3>
            <p className="mt-3 line-clamp-2 max-w-sm text-sm text-white/60">{l.tagline}</p>
            <div className="mt-10 flex items-end justify-between border-t border-white/10 pt-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{t.asking}</p>
                <p className="mt-1 text-2xl font-semibold">{formatCurrency(l.askingPrice)}</p>
              </div>
              {l.mrr !== null && (
                <div className="text-end">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{t.mrr}</p>
                  <p className="mt-1 text-lg font-semibold text-signal">{formatCurrency(l.mrr)}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
