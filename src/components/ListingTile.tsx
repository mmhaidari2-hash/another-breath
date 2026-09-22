import Link from 'next/link';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

export default function ListingTile({
  listing,
  askingLabel,
  mrrLabel,
  verifiedLabel,
}: {
  listing: ListingDTO;
  askingLabel: string;
  mrrLabel: string;
  verifiedLabel: string;
}) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex h-full flex-col border border-coal/12 bg-stone-raised p-6 transition hover:-translate-y-1 hover:border-signal hover:shadow-hard"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-coal-mute">
          {listing.niche}
        </span>
        <span className="font-mono text-[10px] text-signal">{verifiedLabel}</span>
      </div>
      <h3 className="mt-6 font-display text-3xl font-bold tracking-tight group-hover:text-signal">
        {listing.title}
      </h3>
      <p className="mt-3 line-clamp-2 flex-1 text-sm text-coal-soft">{listing.tagline}</p>
      {listing.techStack && (
        <p className="mt-4 font-mono text-[11px] text-coal-mute" dir="ltr">
          {listing.techStack}
        </p>
      )}
      <div className="mt-6 flex items-end justify-between border-t border-coal/10 pt-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{askingLabel}</p>
          <p className="text-xl font-semibold">{formatCurrency(listing.askingPricePence)}</p>
        </div>
        {listing.mrrPence !== null && (
          <div className="text-end">
            <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{mrrLabel}</p>
            <p className="font-semibold text-signal">{formatCurrency(listing.mrrPence)}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
