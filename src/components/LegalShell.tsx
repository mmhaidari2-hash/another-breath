import Link from 'next/link';

export default function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          Home
        </Link>
        <p className="eyebrow mt-8">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="prose-legal mt-10 space-y-5 text-sm leading-relaxed text-coal-soft">
          {children}
        </div>
        <nav className="mt-12 flex flex-wrap gap-4 border-t border-coal/10 pt-6 text-xs font-mono uppercase tracking-wider">
          <Link href="/legal/terms" className="hover:text-signal">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-signal">
            Privacy
          </Link>
          <Link href="/legal/non-circumvention" className="hover:text-signal">
            Non-Circumvention
          </Link>
          <Link href="/legal/fees" className="hover:text-signal">
            Fees
          </Link>
          <Link href="/legal/cookies" className="hover:text-signal">
            Cookies
          </Link>
          <Link href="/legal/data-request" className="hover:text-signal">
            Data Rights
          </Link>
        </nav>
      </div>
    </main>
  );
}
