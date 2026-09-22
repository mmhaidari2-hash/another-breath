'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListingRow from '@/components/ListingRow';
import ListingTile from '@/components/ListingTile';
import { CompareBar, useWatchCompare } from '@/components/WatchCompare';
import { useLang } from '@/components/LanguageProvider';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'mrrDesc' | 'multipleAsc';
type Mode = 'board' | 'gallery';

export default function MarketplaceBrowser({
  listings,
  initialQuery = '',
}: {
  listings: ListingDTO[];
  initialQuery?: string;
}) {
  const { t, lang } = useLang();
  const { watch, compare, toggleWatch, toggleCompare } = useWatchCompare();
  const [q, setQ] = useState(initialQuery);
  const [niche, setNiche] = useState('all');
  const [grade, setGrade] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [mode, setMode] = useState<Mode>('board');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minMrr, setMinMrr] = useState(0);
  const [watchOnly, setWatchOnly] = useState(false);

  const niches = useMemo(
    () => Array.from(new Set(listings.map((l) => l.niche).filter(Boolean) as string[])).sort(),
    [listings]
  );

  const filtered = useMemo(() => {
    let rows = [...listings];
    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter((l) =>
        [l.title, l.tagline, l.niche, l.techStack, l.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      );
    }
    if (niche !== 'all') rows = rows.filter((l) => l.niche === niche);
    if (grade !== 'all') rows = rows.filter((l) => l.grade === grade);
    rows = rows.filter((l) => l.askingPricePence <= maxPrice * 100);
    rows = rows.filter((l) => (l.mrrPence ?? 0) >= minMrr * 100);
    if (watchOnly) rows = rows.filter((l) => watch.includes(l.id));

    rows.sort((a, b) => {
      if (sort === 'priceAsc') return a.askingPricePence - b.askingPricePence;
      if (sort === 'priceDesc') return b.askingPricePence - a.askingPricePence;
      if (sort === 'mrrDesc') return (b.mrrPence ?? -1) - (a.mrrPence ?? -1);
      if (sort === 'multipleAsc') return (a.multiple ?? 999) - (b.multiple ?? 999);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });
    return rows;
  }, [listings, q, niche, grade, sort, maxPrice, minMrr, watchOnly, watch]);

  return (
    <div className="pb-16">
      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-5 border border-coal/12 bg-stone-raised p-5 lg:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {lang === 'fa' ? 'فیلتر حرفه‌ای' : 'Pro filters'}
          </p>
          <label className="block">
            <span className="mb-1.5 block text-xs text-coal-mute">{t.searchPlaceholder}</span>
            <input className="input-field" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-coal-mute">{t.filterNiche}</span>
            <select className="input-field" value={niche} onChange={(e) => setNiche(e.target.value)}>
              <option value="all">{t.filterAll}</option>
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="mb-1.5 block text-xs text-coal-mute">{t.filterGrade}</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'A', 'B', 'C'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`border px-2.5 py-1 font-mono text-[11px] ${
                    grade === g ? 'border-signal bg-signal text-white' : 'border-coal/15'
                  }`}
                >
                  {g === 'all' ? t.filterAll : g}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 flex justify-between text-xs text-coal-mute">
              <span>Max asking</span>
              <span className="font-mono">{formatCurrency(maxPrice * 100)}</span>
            </span>
            <input
              type="range"
              min={3000}
              max={50000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#FF3B00]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex justify-between text-xs text-coal-mute">
              <span>Min MRR</span>
              <span className="font-mono">{formatCurrency(minMrr * 100)}</span>
            </span>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={minMrr}
              onChange={(e) => setMinMrr(Number(e.target.value))}
              className="w-full accent-[#FF3B00]"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={watchOnly}
              onChange={(e) => setWatchOnly(e.target.checked)}
              className="accent-[#FF3B00]"
            />
            Watchlist only ({watch.length})
          </label>
          <Link href="/compare" className="btn-ghost w-full text-center text-xs">
            Compare desk ({compare.length}/3)
          </Link>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs text-coal-mute">
              {filtered.length} {t.results}
            </p>
            <div className="flex flex-wrap gap-2">
              <select
                className="input-field !w-auto !py-2"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <option value="newest">{t.sortNewest}</option>
                <option value="priceAsc">{t.sortPriceAsc}</option>
                <option value="priceDesc">{t.sortPriceDesc}</option>
                <option value="mrrDesc">{t.sortMrrDesc}</option>
                <option value="multipleAsc">Multiple ↑</option>
              </select>
              <div className="flex border border-coal/15">
                <button
                  type="button"
                  onClick={() => setMode('board')}
                  className={`px-3 py-2 text-xs font-semibold ${mode === 'board' ? 'bg-coal text-white' : ''}`}
                >
                  Board
                </button>
                <button
                  type="button"
                  onClick={() => setMode('gallery')}
                  className={`px-3 py-2 text-xs font-semibold ${mode === 'gallery' ? 'bg-coal text-white' : ''}`}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="border border-dashed border-coal/20 px-6 py-16 text-center text-coal-soft">
              {t.noResults}
            </p>
          ) : mode === 'board' ? (
            <div className="overflow-hidden border border-coal/12 bg-stone-raised">
              {filtered.map((listing, i) => (
                <div key={listing.id} className="relative">
                  <ListingRow
                    listing={listing}
                    askingLabel={t.asking}
                    mrrLabel={t.mrr}
                    index={i}
                  />
                  <div className="absolute end-3 top-1/2 flex -translate-y-1/2 gap-1">
                    <button
                      type="button"
                      onClick={() => toggleWatch(listing.id)}
                      className="border border-coal/15 bg-stone-soft px-2 py-1 text-[10px] font-mono"
                    >
                      {watch.includes(listing.id) ? '★' : '☆'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(listing.id)}
                      className="border border-coal/15 bg-stone-soft px-2 py-1 text-[10px] font-mono"
                    >
                      {compare.includes(listing.id) ? 'CMP' : '+'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((listing) => (
                <ListingTile
                  key={listing.id}
                  listing={listing}
                  askingLabel={t.asking}
                  mrrLabel={t.mrr}
                  verifiedLabel={t.verified}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CompareBar />
    </div>
  );
}
