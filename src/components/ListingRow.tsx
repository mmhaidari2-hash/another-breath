import Link from 'next/link';
import { formatCurrency, type ListingDTO } from '@/lib/utils';

export default function ListingRow({
  listing,
  askingLabel,
  mrrLabel,
  index,
}: {
  listing: ListingDTO;
  askingLabel: string;
  mrrLabel: string;
  index: number;
}) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group grid grid-cols-12 items-center gap-3 border-b border-coal/10 px-3 py-5 transition hover:bg-stone-raised sm:px-5"
    >
      <div className="col-span-1 font-mono text-xs text-coal-mute">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="col-span-5 sm:col-span-4">
        <p className="font-display text-xl font-bold tracking-tight group-hover:text-signal">
          {listing.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-coal-mute">{listing.tagline}</p>
      </div>
      <div className="col-span-3 hidden font-mono text-xs uppercase tracking-wider text-coal-mute sm:block">
        {listing.niche}
      </div>
      <div className="col-span-2 text-end sm:col-span-1">
        <span className="inline-block border border-coal/15 px-2 py-0.5 font-mono text-[11px]">
          {listing.grade ?? '—'}
        </span>
      </div>
      <div className="col-span-4 text-end sm:col-span-2">
        <p className="text-[10px] uppercase tracking-wider text-coal-mute sm:hidden">{askingLabel}</p>
        <p className="font-semibold">{formatCurrency(listing.askingPrice)}</p>
      </div>
      <div className="col-span-2 hidden text-end sm:block">
        <p className="font-mono text-sm text-signal">
          {listing.mrr !== null ? formatCurrency(listing.mrr) : '—'}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-coal-mute">{mrrLabel}</p>
      </div>
    </Link>
  );
}
