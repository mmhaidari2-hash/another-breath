import Link from 'next/link';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

const GRADE: Record<string, string> = {
  A: 'border-forest/30 bg-forest/10 text-forest',
  B: 'border-navy/25 bg-navy/10 text-navy',
  C: 'border-ink/15 bg-ink/5 text-ink-soft',
};

export default function ListingCard({
  listing,
  askingLabel,
  mrrLabel,
  verifiedLabel,
  gradeLabel,
}: {
  listing: ListingDTO;
  askingLabel: string;
  mrrLabel: string;
  verifiedLabel: string;
  gradeLabel: string;
}) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-paper-raised p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lift"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {listing.niche && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {listing.niche}
          </span>
        )}
        {listing.grade && (
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
              GRADE[listing.grade] ?? GRADE.C
            }`}
          >
            {gradeLabel} {listing.grade}
          </span>
        )}
        {listing.verificationStatus === 'VERIFIED' && (
          <span className="inline-flex rounded-md border border-forest/25 bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">
            {verifiedLabel}
          </span>
        )}
        {listing.featured && (
          <span className="inline-flex rounded-md border border-navy/20 bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy">
            ★
          </span>
        )}
      </div>

      <h3 className="font-display text-[1.75rem] leading-none tracking-tight text-ink transition group-hover:text-forest">
        {listing.title}
      </h3>
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {listing.tagline || listing.description}
      </p>

      {listing.techStack && (
        <p className="mt-4 text-xs text-ink-faint" dir="ltr">
          {listing.techStack}
        </p>
      )}

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/8 pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">{askingLabel}</p>
          <p className="mt-0.5 text-xl font-semibold text-ink">
            {formatCurrency(listing.askingPrice)}
          </p>
        </div>
        {listing.mrr !== null && (
          <div className="text-end">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">{mrrLabel}</p>
            <p className="mt-0.5 font-semibold text-forest">{formatCurrency(listing.mrr)}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
