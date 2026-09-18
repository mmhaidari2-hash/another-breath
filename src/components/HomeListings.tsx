'use client';

import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';

export default function HomeListings({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  return (
    <section className="border-t border-ink/8 py-20">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">{t.navListings}</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
              {t.allListings}
            </h2>
          </div>
          <Link href="/marketplace" className="btn-secondary">
            {t.ctaBrowse}
          </Link>
        </div>
        {listings.length === 0 ? (
          <p className="mt-10 text-ink-soft">{t.emptyMarket}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.slice(0, 6).map((listing) => (
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
    </section>
  );
}
