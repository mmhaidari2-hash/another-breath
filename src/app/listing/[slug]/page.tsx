import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import LeadForm from '@/components/LeadForm';
import ListingCard from '@/components/ListingCard';
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

  if (!listing || listing.verificationStatus !== 'VERIFIED') notFound();

  const related = await prisma.listing.findMany({
    where: {
      verificationStatus: 'VERIFIED',
      id: { not: listing.id },
      OR: [{ niche: listing.niche ?? undefined }, { grade: listing.grade ?? undefined }],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="pb-24 pt-10">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <Link href="/marketplace" className="text-sm font-medium text-ink-faint hover:text-ink">
          بازگشت به بازار / Back to market
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <header>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {listing.niche && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    {listing.niche}
                  </span>
                )}
                {listing.grade && (
                  <span className="rounded-md border border-forest/30 bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">
                    درجه / Grade {listing.grade}
                  </span>
                )}
                <span className="rounded-md border border-forest/25 bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">
                  تأییدشده / Verified
                </span>
              </div>
              <h1 className="font-display text-5xl tracking-tight text-ink sm:text-6xl">
                {listing.title}
              </h1>
              {listing.tagline && (
                <p className="mt-4 text-xl text-ink-soft">{listing.tagline}</p>
              )}
              <p className="mt-3 text-sm text-ink-faint">
                ثبت {formatDate(listing.createdAt)}
                {listing.verifiedAt ? ` · تأیید ${formatDate(listing.verifiedAt)}` : ''}
              </p>
            </header>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Asking" value={formatCurrency(listing.askingPrice)} />
              <Metric
                label="MRR"
                value={listing.mrr !== null ? formatCurrency(listing.mrr) : '—'}
                accent
              />
              <Metric
                label="Multiple"
                value={listing.multiple !== null ? `${listing.multiple}×` : '—'}
              />
              <Metric label="Score" value={listing.score !== null ? String(listing.score) : '—'} />
            </div>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-forest">
                توضیحات / Description
              </h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-soft">
                {listing.description}
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              {listing.techStack && (
                <div className="rounded-xl border border-ink/10 bg-paper-raised p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Stack
                  </p>
                  <p className="mt-1 text-sm text-ink" dir="ltr">
                    {listing.techStack}
                  </p>
                </div>
              )}
              {listing.foundedYear && (
                <div className="rounded-xl border border-ink/10 bg-paper-raised p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Founded
                  </p>
                  <p className="mt-1 text-sm text-ink">{listing.foundedYear}</p>
                </div>
              )}
            </div>

            {listing.websiteUrl && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-forest">
                  Website
                </h2>
                <a
                  href={listing.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-navy underline-offset-4 hover:underline"
                  dir="ltr"
                >
                  {listing.websiteUrl}
                </a>
              </section>
            )}

            {listing.verificationNotes && (
              <section className="rounded-2xl border border-ink/10 bg-navy/[0.04] p-5">
                <h2 className="text-sm font-semibold text-ink">یادداشت بررسی / Review notes</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {listing.verificationNotes}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-ink/10 bg-paper-raised p-6 shadow-lift">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Asking price
                </p>
                <p className="mt-1 font-display text-5xl tracking-tight text-ink">
                  {formatCurrency(listing.askingPrice)}
                </p>
                {listing.mrr !== null && (
                  <p className="mt-2 text-sm text-ink-soft">
                    MRR:{' '}
                    <span className="font-semibold text-forest">
                      {formatCurrency(listing.mrr)}
                    </span>
                  </p>
                )}
              </div>
              <div className="h-px bg-ink/10" />
              <div>
                <h3 className="mb-4 text-sm font-semibold text-ink">
                  درخواست تماس / Contact seller
                </h3>
                <LeadForm listingId={listing.id} listingTitle={listing.title} />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-ink">مرتبط / Related</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={{
                    ...l,
                    featured: l.featured,
                  }}
                  askingLabel="Asking"
                  mrrLabel="MRR"
                  verifiedLabel="Verified"
                  gradeLabel="Grade"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-paper-raised p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${accent ? 'text-forest' : 'text-ink'}`}>{value}</p>
    </div>
  );
}
