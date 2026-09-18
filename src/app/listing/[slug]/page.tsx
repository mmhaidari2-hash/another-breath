import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import LeadForm from '@/components/LeadForm';
import ListingTile from '@/components/ListingTile';
import { formatCurrency, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug },
  });

  if (!listing || listing.verificationStatus !== 'VERIFIED') notFound();

  const related = await prisma.listing.findMany({
    where: {
      verificationStatus: 'VERIFIED',
      id: { not: listing.id },
      OR: [{ niche: listing.niche ?? undefined }, { grade: listing.grade ?? undefined }],
    },
    take: 3,
  });

  return (
    <main className="pb-24">
      {/* Case-study masthead */}
      <section className="border-b border-coal/10 bg-coal text-white">
        <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 sm:py-16">
          <Link href="/marketplace" className="text-sm text-white/50 hover:text-white">
            Market / بازار
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="text-signal">{listing.niche}</span>
            <span className="text-white/35">·</span>
            <span>Grade {listing.grade}</span>
            <span className="text-white/35">·</span>
            <span className="text-signal">Verified</span>
          </div>
          <h1 className="mt-4 font-display text-[clamp(3rem,10vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.03em]">
            {listing.title}
          </h1>
          {listing.tagline && (
            <p className="mt-5 max-w-2xl text-lg text-white/65 sm:text-xl">{listing.tagline}</p>
          )}
          <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
            <Stat label="Asking" value={formatCurrency(listing.askingPrice)} />
            <Stat
              label="MRR"
              value={listing.mrr !== null ? formatCurrency(listing.mrr) : '—'}
              accent
            />
            <Stat
              label="Multiple"
              value={listing.multiple !== null ? `${listing.multiple}×` : '—'}
            />
            <Stat label="Score" value={listing.score !== null ? String(listing.score) : '—'} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-shell gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <section>
            <p className="eyebrow">Thesis</p>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-coal-soft">
              {listing.description}
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {listing.techStack && (
              <div className="border border-coal/12 bg-stone-raised p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">Stack</p>
                <p className="mt-2 font-display text-xl font-bold" dir="ltr">
                  {listing.techStack}
                </p>
              </div>
            )}
            {listing.foundedYear && (
              <div className="border border-coal/12 bg-stone-raised p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">Founded</p>
                <p className="mt-2 font-display text-xl font-bold">{listing.foundedYear}</p>
              </div>
            )}
          </div>

          {listing.websiteUrl && (
            <section>
              <p className="eyebrow">Live</p>
              <a
                href={listing.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-mono text-sm text-signal underline-offset-4 hover:underline"
                dir="ltr"
              >
                {listing.websiteUrl}
              </a>
            </section>
          )}

          {listing.verificationNotes && (
            <section className="border border-coal bg-coal p-6 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                Review notes
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {listing.verificationNotes}
              </p>
              {listing.verifiedAt && (
                <p className="mt-4 font-mono text-[11px] text-white/40">
                  Verified {formatDate(listing.verifiedAt)}
                </p>
              )}
            </section>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 border border-coal bg-stone-raised p-6 shadow-hard">
            <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">Acquisition</p>
            <p className="mt-2 font-display text-5xl font-extrabold tracking-tight">
              {formatCurrency(listing.askingPrice)}
            </p>
            {listing.mrr !== null && (
              <p className="mt-2 text-sm text-coal-soft">
                MRR <span className="font-semibold text-signal">{formatCurrency(listing.mrr)}</span>
              </p>
            )}
            <div className="my-6 h-px bg-coal/10" />
            <h3 className="mb-4 font-display text-xl font-bold">Contact seller</h3>
            <LeadForm listingId={listing.id} listingTitle={listing.title} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-shell px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold">Related</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((l) => (
              <ListingTile
                key={l.id}
                listing={l}
                askingLabel="Asking"
                mrrLabel="MRR"
                verifiedLabel="Verified"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-coal px-4 py-5 sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-2 text-xl font-semibold sm:text-2xl ${accent ? 'text-signal' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
