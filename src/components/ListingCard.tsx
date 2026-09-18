import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface ListingCardProps {
  listing: {
    id: string;
    slug: string;
    title: string;
    description: string;
    tagline?: string | null;
    niche?: string | null;
    askingPrice: number;
    mrr: number | null;
    grade: string | null;
    verificationStatus: string;
  };
}

const GRADE_TONE: Record<string, string> = {
  A: 'text-sea border-sea/40 bg-sea/10',
  B: 'text-bronze border-bronze/40 bg-bronze/10',
  C: 'text-mist-muted border-line bg-white/[0.03]',
};

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-line bg-ink-raised/60 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-sea/35 hover:shadow-aura"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {listing.niche && (
          <span className="text-[11px] uppercase tracking-[0.14em] text-mist-faint">
            {listing.niche}
          </span>
        )}
        {listing.grade && (
          <span
            className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${
              GRADE_TONE[listing.grade] ?? GRADE_TONE.C
            }`}
          >
            درجه {listing.grade}
          </span>
        )}
        {listing.verificationStatus === 'VERIFIED' && (
          <span className="inline-flex rounded border border-sea/30 bg-sea/10 px-2 py-0.5 text-[11px] font-medium text-sea">
            تأیید‌شده
          </span>
        )}
      </div>

      <h3 className="font-display text-2xl text-mist transition group-hover:text-white">
        {listing.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-muted">
        {listing.tagline || listing.description}
      </p>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-mist-faint">قیمت درخواستی</p>
          <p className="mt-0.5 text-lg font-semibold text-mist">
            {formatCurrency(listing.askingPrice)}
          </p>
        </div>
        {listing.mrr !== null && (
          <div className="text-left">
            <p className="text-[11px] uppercase tracking-wider text-mist-faint">MRR</p>
            <p className="mt-0.5 font-medium text-sea">{formatCurrency(listing.mrr)}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
