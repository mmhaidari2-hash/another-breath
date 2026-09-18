'use client';

import MarketplaceBrowser from '@/components/MarketplaceBrowser';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';

export default function MarketplaceClient({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <p className="eyebrow">{t.navListings}</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          {t.marketplaceTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-coal-soft">{t.marketplaceSub}</p>
        <div className="mt-10">
          <MarketplaceBrowser listings={listings} />
        </div>
      </div>
    </main>
  );
}
