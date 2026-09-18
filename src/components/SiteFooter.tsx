'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-ink/10 bg-paper-raised">
      <div className="mx-auto flex max-w-shell flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-3xl text-ink">CLADAK</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{t.footerTag}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-ink-faint">
          <Link href="/marketplace" className="hover:text-ink">
            {t.navListings}
          </Link>
          <Link href="/trust" className="hover:text-ink">
            {t.navTrust}
          </Link>
          <Link href="/sell" className="hover:text-ink">
            {t.navSell}
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
