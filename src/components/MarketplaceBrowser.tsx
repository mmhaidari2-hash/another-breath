'use client';

import { useMemo, useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';

type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'mrrDesc';

export default function MarketplaceBrowser({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  const [q, setQ] = useState('');
  const [niche, setNiche] = useState('all');
  const [grade, setGrade] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const niches = useMemo(
    () =>
      Array.from(new Set(listings.map((l) => l.niche).filter(Boolean) as string[])).sort(),
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
      <div className="rounded-2xl border border-ink/10 bg-paper-raised p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-ink-faint">{t.searchPlaceholder}</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="input-field"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-ink-faint">{t.filterNiche}</span>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="input-field"
            >
              <option value="all">{t.filterAll}</option>
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-ink-faint">{t.sortLabel}</span>
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
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="self-center text-xs font-medium text-ink-faint">{t.filterGrade}:</span>
          {['all', 'A', 'B', 'C'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                grade === g
                  ? 'border-forest bg-forest text-white'
                  : 'border-ink/10 bg-paper text-ink-soft hover:border-ink/25'
              }`}
            >
              {g === 'all' ? t.filterAll : `${t.grade} ${g}`}
            </button>
          ))}
          <span className="ms-auto self-center text-xs text-ink-faint">
            {filtered.length} {t.results}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center text-ink-soft">
          {t.noResults}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              askingLabel={t.asking}
              mrrLabel={t.mrr}
              verifiedLabel={t.verified}
              gradeLabel={t.grade}
            />
          ))}
        </div>
      )}
    </div>
  );
}
