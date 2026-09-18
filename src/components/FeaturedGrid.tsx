'use client';

import ListingCard from '@/components/ListingCard';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';

export default function FeaturedGrid({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  if (!listings.length) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <p className="section-eyebrow">{t.featured}</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {t.featured}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
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
      </div>
    </section>
  );
}
