'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();

  const links = [
    { href: '/marketplace', label: t.navListings },
    { href: '/trust', label: t.navTrust },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-shell items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-[1.65rem] font-medium tracking-tight text-ink">
            CLADAK
          </span>
          <span className="hidden text-xs font-medium text-ink-faint sm:inline">{t.brandSub}</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'hidden rounded-md px-3 py-2 text-sm font-medium transition sm:inline-flex',
                pathname === l.href ? 'text-forest' : 'text-ink-soft hover:text-ink'
              )}
            >
              {l.label}
            </Link>
          ))}

          <div className="mx-1 flex overflow-hidden rounded-md border border-ink/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang('fa')}
              className={cn(
                'px-2.5 py-1.5 transition',
                lang === 'fa' ? 'bg-ink text-white' : 'bg-paper-raised text-ink-soft hover:text-ink'
              )}
              aria-pressed={lang === 'fa'}
            >
              فا
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={cn(
                'px-2.5 py-1.5 transition',
                lang === 'en' ? 'bg-ink text-white' : 'bg-paper-raised text-ink-soft hover:text-ink'
              )}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
          </div>

          <Link href="/sell" className="btn-secondary !px-3.5 !py-2 text-xs sm:text-sm">
            {t.navSell}
          </Link>
        </nav>
      </div>
    </header>
  );
}
