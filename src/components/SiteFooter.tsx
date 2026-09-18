import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl text-mist">CLADAK</p>
          <p className="mt-1 max-w-md text-sm text-mist-muted">
            بازارچه‌ی تأییدشده برای Micro-SaaS. فقط آنچه دستی بررسی شده، عمومی می‌شود.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-mist-faint">
          <Link href="/#listings" className="hover:text-mist">
            لیستینگ‌ها
          </Link>
          <Link href="/sell" className="hover:text-mist">
            فروش
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
