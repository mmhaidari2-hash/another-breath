'use client';

import { useMemo, useState } from 'react';
import ListingRow from '@/components/ListingRow';
import ListingTile from '@/components/ListingTile';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';

type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'mrrDesc';
type Mode = 'board' | 'gallery';

export default function MarketplaceBrowser({ listings }: { listings: ListingDTO[] }) {
  const { t, lang } = useLang();
  const [q, setQ] = useState('');
  const [niche, setNiche] = useState('all');
  const [grade, setGrade] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [mode, setMode] = useState<Mode>('board');

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
    rows.sort((a, b) => {
      if (sort === 'priceAsc') return a.askingPrice - b.askingPrice;
      if (sort === 'priceDesc') return b.askingPrice - a.askingPrice;
      if (sort === 'mrrDesc') return (b.mrr ?? -1) - (a.mrr ?? -1);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });
    return rows;
  }, [listings, q, niche, grade, sort]);

  return (
    <div>
      <div className="border border-coal/12 bg-stone-raised p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <label className="md:col-span-5">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
              {t.searchPlaceholder}
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input-field"
              placeholder={t.searchPlaceholder}
            />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
              {t.filterNiche}
            </span>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} className="input-field">
              <option value="all">{t.filterAll}</option>
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
              {t.sortLabel}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input-field"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="priceAsc">{t.sortPriceAsc}</option>
              <option value="priceDesc">{t.sortPriceDesc}</option>
              <option value="mrrDesc">{t.sortMrrDesc}</option>
            </select>
          </label>
          <div className="flex items-end md:col-span-3">
            <div className="flex w-full border border-coal/15">
              <button
                type="button"
                onClick={() => setMode('board')}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${
                  mode === 'board' ? 'bg-coal text-white' : 'bg-stone-soft text-coal-soft'
                }`}
              >
                {lang === 'fa' ? 'برد' : 'Board'}
              </button>
              <button
                type="button"
                onClick={() => setMode('gallery')}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${
                  mode === 'gallery' ? 'bg-coal text-white' : 'bg-stone-soft text-coal-soft'
                }`}
              >
                {lang === 'fa' ? 'گالری' : 'Gallery'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
            {t.filterGrade}
          </span>
          {['all', 'A', 'B', 'C'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={`border px-3 py-1 font-mono text-[11px] font-semibold ${
                grade === g
                  ? 'border-signal bg-signal text-white'
                  : 'border-coal/15 bg-stone text-coal-soft hover:border-coal'
              }`}
            >
              {g === 'all' ? t.filterAll : g}
            </button>
          ))}
          <span className="ms-auto font-mono text-xs text-coal-mute">
            {filtered.length} {t.results}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 border border-dashed border-coal/20 px-6 py-16 text-center text-coal-soft">
          {t.noResults}
        </p>
      ) : mode === 'board' ? (
        <div className="mt-6 overflow-hidden border border-coal/12 bg-stone-raised">
          <div className="hidden grid-cols-12 gap-3 border-b border-coal/10 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-coal-mute sm:grid">
            <div className="col-span-1">#</div>
            <div className="col-span-4">{lang === 'fa' ? 'دارایی' : 'Asset'}</div>
            <div className="col-span-3">{t.filterNiche}</div>
            <div className="col-span-1">{t.grade}</div>
            <div className="col-span-2 text-end">{t.asking}</div>
            <div className="col-span-1 text-end">{t.mrr}</div>
          </div>
          {filtered.map((listing, i) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              askingLabel={t.asking}
              mrrLabel={t.mrr}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
