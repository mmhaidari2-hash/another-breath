'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatCurrency, type ListingDTO } from '@/lib/utils';
import { useWatchCompare } from '@/components/WatchCompare';

export default function CompareClient({ listings }: { listings: ListingDTO[] }) {
  const { compare, toggleCompare } = useWatchCompare();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const rows = useMemo(
    () => listings.filter((l) => compare.includes(l.id)).slice(0, 3),
    [listings, compare]
  );

  if (!ready) return null;

  if (!rows.length) {
    return (
      <main className="mx-auto max-w-shell px-4 py-20 sm:px-6">
        <h1 className="font-display text-5xl font-extrabold">Compare desk</h1>
        <p className="mt-4 text-coal-soft">Select up to 3 listings from the market.</p>
        <Link href="/marketplace" className="btn-primary mt-8">
          Open market
        </Link>
      </main>
    );
  }

  const fields: { key: string; label: string; get: (l: ListingDTO) => string }[] = [
    { key: 'asking', label: 'Asking', get: (l) => formatCurrency(l.askingPrice) },
    { key: 'mrr', label: 'MRR', get: (l) => (l.mrr != null ? formatCurrency(l.mrr) : '—') },
    { key: 'multiple', label: 'Multiple', get: (l) => (l.multiple != null ? `${l.multiple}×` : '—') },
    { key: 'grade', label: 'Grade', get: (l) => l.grade ?? '—' },
    { key: 'score', label: 'Score', get: (l) => (l.score != null ? String(l.score) : '—') },
    {
      key: 'customers',
      label: 'Customers',
      get: (l) => (l.customersApprox != null ? String(l.customersApprox) : '—'),
    },
    { key: 'niche', label: 'Niche', get: (l) => l.niche ?? '—' },
    { key: 'stack', label: 'Stack', get: (l) => l.techStack ?? '—' },
    { key: 'founded', label: 'Founded', get: (l) => (l.foundedYear ? String(l.foundedYear) : '—') },
  ];

  return (
    <main className="mx-auto max-w-shell px-4 py-16 sm:px-6">
      <p className="eyebrow">Acquisition desk</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight">Compare</h1>
      <div className="mt-10 overflow-x-auto border border-coal/12 bg-stone-raised">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-coal/10">
              <th className="px-4 py-4 text-start font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                Field
              </th>
              {rows.map((l) => (
                <th key={l.id} className="px-4 py-4 text-start">
                  <Link href={`/listing/${l.slug}`} className="font-display text-xl font-bold hover:text-signal">
                    {l.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleCompare(l.id)}
                    className="ms-2 font-mono text-[10px] text-coal-mute hover:text-signal"
                  >
                    remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.key} className="border-b border-coal/8">
                <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-coal-mute">
                  {f.label}
                </td>
                {rows.map((l) => (
                  <td key={l.id + f.key} className="px-4 py-3 font-medium">
                    {f.get(l)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
