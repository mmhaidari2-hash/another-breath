'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-coal/10 bg-stone/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-coal sm:text-[1.7rem]">
          CLADAK
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/marketplace"
            className={cn(
              'hidden px-3 py-2 text-sm font-medium sm:inline',
              pathname.startsWith('/marketplace') ? 'text-signal' : 'text-coal-soft hover:text-coal'
            )}
          >
            {t.navListings}
          </Link>
          <Link
            href="/compare"
            className={cn(
              'hidden px-3 py-2 text-sm font-medium sm:inline',
              pathname.startsWith('/compare') ? 'text-signal' : 'text-coal-soft hover:text-coal'
            )}
          >
            Compare
          </Link>
          <Link
            href="/trust"
            className={cn(
              'hidden px-3 py-2 text-sm font-medium sm:inline',
              pathname.startsWith('/trust') ? 'text-signal' : 'text-coal-soft hover:text-coal'
            )}
          >
            {t.navTrust}
          </Link>

          <div className="mx-1 flex border border-coal/15 font-mono text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLang('fa')}
              className={cn('px-2.5 py-1.5', lang === 'fa' ? 'bg-coal text-white' : 'bg-stone-raised')}
            >
              FA
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={cn('px-2.5 py-1.5', lang === 'en' ? 'bg-coal text-white' : 'bg-stone-raised')}
            >
              EN
            </button>
          </div>

          <Link href="/sell" className="btn-primary !px-3.5 !py-2 text-xs sm:text-sm">
            {t.navSell}
          </Link>
        </nav>
      </div>
    </header>
  );
}
