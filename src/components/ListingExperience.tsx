'use client';

import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import ProductGallery from '@/components/ProductGallery';
import RevenueChart from '@/components/RevenueChart';
import { useWatchCompare } from '@/components/WatchCompare';
import { formatCurrency, formatDate, type ListingDTO } from '@/lib/utils';

export default function ListingExperience({
  listing,
  related,
}: {
  listing: ListingDTO;
  related: ListingDTO[];
}) {
  const { watch, compare, toggleWatch, toggleCompare } = useWatchCompare();
  const watched = watch.includes(listing.id);
  const compared = compare.includes(listing.id);

  return (
    <main className="pb-28">
      <section className="border-b border-coal/10 bg-coal text-white">
        <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/marketplace" className="text-sm text-white/50 hover:text-white">
              ← Market
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleWatch(listing.id)}
                className={`border px-3 py-2 text-xs font-semibold ${
                  watched ? 'border-signal bg-signal text-white' : 'border-white/20 text-white/80'
                }`}
              >
                {watched ? 'Watching' : 'Watch'}
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(listing.id)}
                className={`border px-3 py-2 text-xs font-semibold ${
                  compared ? 'border-signal bg-signal text-white' : 'border-white/20 text-white/80'
                }`}
              >
                {compared ? 'In compare' : 'Compare'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
            <span>{listing.niche}</span>
            <span className="text-white/30">·</span>
            <span>Grade {listing.grade}</span>
            <span className="text-white/30">·</span>
            <span>Verified</span>
            {listing.businessModel && (
              <>
                <span className="text-white/30">·</span>
                <span className="text-white/70">{listing.businessModel}</span>
              </>
            )}
          </div>

          <h1 className="mt-4 font-display text-[clamp(3rem,11vw,7rem)] font-extrabold leading-[0.88] tracking-[-0.035em]">
            {listing.title}
          </h1>
          {listing.tagline && (
            <p className="mt-5 max-w-3xl text-lg text-white/65 sm:text-2xl">{listing.tagline}</p>
          )}

          <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-5">
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
            <Metric
              label="Customers"
              value={listing.customersApprox != null ? String(listing.customersApprox) : '—'}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-shell gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <ProductGallery frames={listing.gallery || []} title={listing.title} />

          <section>
            <p className="eyebrow">Overview</p>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-coal-soft">
              {listing.description}
            </p>
          </section>

          {(listing.highlights?.length ?? 0) > 0 && (
            <section>
              <p className="eyebrow">Why this asset</p>
              <ul className="mt-4 space-y-3">
                {listing.highlights!.map((h) => (
                  <li key={h} className="border-s-2 border-signal bg-stone-raised px-4 py-3 text-sm">
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <p className="eyebrow">Financials</p>
            <div className="mt-4">
              <RevenueChart points={listing.mrrHistory || []} />
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {listing.techStack && (
              <Info label="Stack" value={listing.techStack} ltr />
            )}
            {listing.foundedYear && <Info label="Founded" value={String(listing.foundedYear)} />}
            <div className="border border-coal/12 bg-stone-raised p-5 sm:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">Live access</p>
              {listing.demoPolicy === 'PUBLIC' && listing.websiteUrl ? (
                <a
                  href={listing.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-mono text-sm text-signal hover:underline"
                  dir="ltr"
                >
                  {listing.websiteUrl}
                </a>
              ) : (
                <p className="mt-2 text-sm text-coal-soft">
                  URL is <strong>intro-only</strong> to reduce off-platform circumvention. Request contact;
                  Cladak mediates the demo access.
                </p>
              )}
            </div>
          </div>

          {listing.reasonForSale && (
            <section className="border border-coal/12 bg-stone-raised p-6">
              <p className="eyebrow">Reason for sale</p>
              <p className="mt-3 text-sm leading-relaxed text-coal-soft">{listing.reasonForSale}</p>
            </section>
          )}

          <section className="border border-coal/12 bg-stone-raised p-6">
            <p className="eyebrow">Evidence reviewed</p>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
              <span className={`border px-2 py-1 ${listing.evidenceRevenue ? 'border-signal text-signal' : 'border-coal/20 text-coal-mute'}`}>
                Revenue {listing.evidenceRevenue ? 'checked' : 'n/a'}
              </span>
              <span className={`border px-2 py-1 ${listing.evidenceProduct ? 'border-signal text-signal' : 'border-coal/20 text-coal-mute'}`}>
                Product {listing.evidenceProduct ? 'checked' : 'pending'}
              </span>
              <span className={`border px-2 py-1 ${listing.evidenceUi ? 'border-signal text-signal' : 'border-coal/20 text-coal-mute'}`}>
                UI {listing.evidenceUi ? 'checked' : 'pending'}
              </span>
            </div>
            <p className="mt-3 text-xs text-coal-mute">
              Manual Phase-1 review — not a live bank feed.
            </p>
          </section>

          {listing.verificationNotes && (
            <section className="border border-coal bg-coal p-6 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                Verification file
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{listing.verificationNotes}</p>
              {listing.verifiedAt && (
                <p className="mt-4 font-mono text-[11px] text-white/40">
                  Verified {formatDate(listing.verifiedAt)}
                </p>
              )}
            </section>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-6 border border-coal bg-stone-raised p-6 shadow-hard">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                Acquisition desk
              </p>
              <p className="mt-2 font-display text-5xl font-extrabold tracking-tight">
                {formatCurrency(listing.askingPrice)}
              </p>
              {listing.mrr !== null && (
                <p className="mt-2 text-sm text-coal-soft">
                  MRR <span className="font-semibold text-signal">{formatCurrency(listing.mrr)}</span>
                  {listing.multiple !== null && (
                    <span className="text-coal-mute"> · {listing.multiple}× annual</span>
                  )}
                </p>
              )}
            </div>
            <div className="space-y-2 border border-signal/30 bg-signal/5 p-4 text-xs leading-relaxed text-coal-soft">
              <p className="font-semibold text-coal">Anti-circumvention (Phase 1)</p>
              <p>1. Accept Terms + Non-Circumvention — required</p>
              <p>2. Request intro — seller email stays private forever on Cladak</p>
              <p>3. Cladak mediates contact; success fee (3–5%) applies</p>
              <p>4. Closing off-platform after intro still owes the fee</p>
              <p className="text-coal-mute">Escrow tooling is Phase 2 — we do not pretend otherwise.</p>
            </div>
            <div className="h-px bg-coal/10" />
            <LeadForm
              listingId={listing.id}
              listingTitle={listing.title}
              askingPrice={listing.askingPrice}
            />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-shell px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold">Similar verified assets</h2>
          <div className="mt-6 divide-y divide-coal/10 border border-coal/12 bg-stone-raised">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/listing/${r.slug}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-stone-soft"
              >
                <div>
                  <p className="font-display text-xl font-bold">{r.title}</p>
                  <p className="text-xs text-coal-mute">
                    {r.niche} · Grade {r.grade}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(r.askingPrice)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-coal px-4 py-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-2 text-lg font-semibold sm:text-xl ${accent ? 'text-signal' : ''}`}>{value}</p>
    </div>
  );
}

function Info({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="border border-coal/12 bg-stone-raised p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{label}</p>
      <p className="mt-2 font-display text-xl font-bold" dir={ltr ? 'ltr' : undefined}>
        {value}
      </p>
    </div>
  );
}
