'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-coal/10 bg-coal text-white">
      <div className="mx-auto flex max-w-shell flex-col gap-8 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-4xl font-bold tracking-tight">CLADAK</p>
          <p className="mt-3 max-w-md text-sm text-white/60">{t.footerTag}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-white/55">
          <Link href="/marketplace" className="hover:text-white">
            {t.navListings}
          </Link>
          <Link href="/trust" className="hover:text-white">
            {t.navTrust}
          </Link>
          <Link href="/sell" className="hover:text-signal">
            {t.navSell}
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
