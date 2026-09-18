import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import LeadForm from '@/components/LeadForm';
import { formatCurrency, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug },
    include: { seller: true },
  });

  if (!listing || listing.verificationStatus !== 'VERIFIED') {
    notFound();
  }

  return (
    <main className="relative z-10 min-h-screen pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 hero-plane opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/#listings"
          className="mb-8 inline-flex text-sm text-mist-muted transition hover:text-mist"
        >
          ← بازگشت به فهرست
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <header>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {listing.niche && (
                  <span className="text-[11px] uppercase tracking-[0.14em] text-mist-faint">
                    {listing.niche}
                  </span>
                )}
                {listing.grade && (
                  <span className="inline-flex rounded border border-sea/40 bg-sea/10 px-2 py-0.5 text-[11px] font-medium text-sea">
                    درجه {listing.grade}
                  </span>
                )}
                <span className="inline-flex rounded border border-sea/30 bg-sea/10 px-2 py-0.5 text-[11px] font-medium text-sea">
                  تأیید‌شده
                </span>
              </div>
              <h1 className="font-display text-4xl text-mist sm:text-5xl">{listing.title}</h1>
              {listing.tagline && (
                <p className="mt-3 text-lg text-mist-muted">{listing.tagline}</p>
              )}
              <p className="mt-2 text-sm text-mist-faint">
                ثبت‌شده در {formatDate(listing.createdAt)}
                {listing.verifiedAt ? ` · تأیید در ${formatDate(listing.verifiedAt)}` : ''}
              </p>
            </header>

            <div className="line-rule" />

            <section>
              <h2 className="mb-3 text-sm tracking-widest text-sea">توضیحات</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-mist-muted">
                {listing.description}
              </p>
            </section>

            {listing.websiteUrl && (
              <section>
                <h2 className="mb-3 text-sm tracking-widest text-sea">وب‌سایت</h2>
                <a
                  href={listing.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bronze underline-offset-4 hover:underline"
                  dir="ltr"
                >
                  {listing.websiteUrl}
                </a>
              </section>
            )}

            {listing.verificationNotes && (
              <section className="rounded-xl border border-line bg-ink-raised/70 p-5">
                <h2 className="mb-2 text-sm font-medium text-mist">یادداشت بررسی</h2>
                <p className="text-sm leading-relaxed text-mist-muted">
                  {listing.verificationNotes}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-6 rounded-xl border border-line bg-ink-raised/80 p-6 shadow-aura backdrop-blur">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-mist-faint">قیمت درخواستی</p>
                <p className="mt-1 font-display text-4xl text-mist">
                  {formatCurrency(listing.askingPrice)}
                </p>
                {listing.mrr !== null && (
                  <p className="mt-2 text-sm text-mist-muted">
                    درآمد ماهانه (MRR):{' '}
                    <span className="text-sea">{formatCurrency(listing.mrr)}</span>
                  </p>
                )}
                {listing.score !== null && (
                  <p className="mt-1 text-xs text-mist-faint">امتیاز rubric: {listing.score}</p>
                )}
              </div>

              <div className="line-rule" />

              <div>
                <h3 className="mb-4 text-sm font-medium text-mist">درخواست تماس با فروشنده</h3>
                <LeadForm listingId={listing.id} listingTitle={listing.title} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
