import { prisma } from '@/lib/db';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import SellCTA from '@/components/SellCTA';
import ListingCard from '@/components/ListingCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    where: { category: 'Micro-SaaS', verificationStatus: 'VERIFIED' },
    orderBy: [{ grade: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <main>
      <Hero />

      <section id="listings" className="relative z-10 border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm tracking-widest text-sea">فهرست عمومی</p>
              <h2 className="mt-2 font-display text-4xl text-mist sm:text-5xl">
                لیستینگ‌های تأییدشده
              </h2>
              <p className="mt-3 max-w-xl text-mist-muted">
                {listings.length > 0
                  ? `${listings.length} محصول تأییدشده در حوزه‌ی Micro-SaaS.`
                  : 'هنوز لیستینگ تأییدشده‌ای نیست.'}
              </p>
            </div>
          </div>

          {listings.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-mist-muted">
              هنوز لیستینگ تأییدشده‌ای وجود نداره. از صفحهٔ فروش، محصولت را برای بررسی بفرست.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />
      <SellCTA />
    </main>
  );
}
