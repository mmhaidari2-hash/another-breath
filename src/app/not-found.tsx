import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl text-forest/30">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">
        Listing not found or not verified yet
      </h1>
      <Link href="/marketplace" className="btn-primary mt-8">
        Back to market
      </Link>
    </main>
  );
}
