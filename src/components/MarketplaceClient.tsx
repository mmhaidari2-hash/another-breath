'use client';

import { Suspense } from 'react';
import MarketplaceBrowser from '@/components/MarketplaceBrowser';
import { useLang } from '@/components/LanguageProvider';
import type { ListingDTO } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

function MarketInner({ listings }: { listings: ListingDTO[] }) {
  const { t } = useLang();
  const params = useSearchParams();
  const q = params.get('q') || '';

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <p className="eyebrow">{t.navListings}</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          {t.marketplaceTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-coal-soft">{t.marketplaceSub}</p>
        <div className="mt-10">
          <MarketplaceBrowser listings={listings} initialQuery={q} />
        </div>
      </div>
    </main>
  );
}

export default function MarketplaceClient({ listings }: { listings: ListingDTO[] }) {
  return (
    <Suspense fallback={<main className="p-10">Loading market…</main>}>
      <MarketInner listings={listings} />
    </Suspense>
  );
}
