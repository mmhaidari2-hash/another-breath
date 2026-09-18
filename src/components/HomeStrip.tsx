'use client';

import Link from 'next/link';
import ListingRow from '@/components/ListingRow';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';

export default function HomeStrip({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  const rows = listings.slice(0, 8);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t.navListings}</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t.allListings}
            </h2>
          </div>
          <Link href="/marketplace" className="btn-ghost">
            {t.ctaBrowse}
          </Link>
        </div>

        <div className="mt-10 border border-coal/12 bg-stone-raised">
          {rows.map((listing, i) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              askingLabel={t.asking}
              mrrLabel={t.mrr}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
