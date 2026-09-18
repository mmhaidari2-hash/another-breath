import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-mist transition group-hover:text-white">
            CLADAK
          </span>
          <span className="text-xs font-medium tracking-wide text-mist-faint">کلادک</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#listings"
            className="hidden text-sm text-mist-muted transition hover:text-mist sm:inline"
          >
            لیستینگ‌ها
          </Link>
          <Link
            href="/#how"
            className="hidden text-sm text-mist-muted transition hover:text-mist sm:inline"
          >
            نحوه تأیید
          </Link>
          <Link href="/sell" className="btn-ghost !py-2 !px-3.5 text-xs sm:text-sm">
            فروش محصول
          </Link>
        </nav>
      </div>
    </header>
  );
}
