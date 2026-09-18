'use client';

import type { MrrPoint } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export default function RevenueChart({
  points,
  label = 'Verified MRR trend',
}: {
  points: MrrPoint[];
  label?: string;
}) {
  if (!points.length) {
    return (
      <div className="flex h-48 items-center justify-center border border-coal/12 bg-stone-raised text-sm text-coal-mute">
        No MRR history for this asset
      </div>
    );
  }

  const w = 640;
  const h = 220;
  const pad = 28;
  const max = Math.max(...points.map((p) => p.mrr)) * 1.08;
  const min = Math.min(...points.map((p) => p.mrr)) * 0.92;
  const span = Math.max(max - min, 1);

  const coords = points.map((p, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - ((p.mrr - min) / span) * (h - pad * 2);
    return { x, y, ...p };
  });

  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const area = `${line} L ${coords[coords.length - 1].x} ${h - pad} L ${coords[0].x} ${h - pad} Z`;
  const last = points[points.length - 1];
  const first = points[0];
  const growth = first.mrr > 0 ? Math.round(((last.mrr - first.mrr) / first.mrr) * 100) : 0;

  return (
    <div className="border border-coal/12 bg-stone-raised p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{label}</p>
          <p className="mt-1 text-sm text-coal-soft">From manual review snapshots · not live bank feed</p>
        </div>
        <div className="text-end">
          <p className="font-display text-2xl font-bold">{formatCurrency(last.mrr)}</p>
          <p className={`font-mono text-xs ${growth >= 0 ? 'text-signal' : 'text-coal-mute'}`}>
            {growth >= 0 ? '+' : ''}
            {growth}% / {points.length} mo
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF3B00" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FF3B00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => {
          const y = pad + ((h - pad * 2) / 3) * i;
          return <line key={i} x1={pad} x2={w - pad} y1={y} y2={y} stroke="rgba(11,12,15,0.08)" />;
        })}
        <path d={area} fill="url(#mrrFill)" />
        <path d={line} fill="none" stroke="#FF3B00" strokeWidth="2.5" />
        {coords.map((c) => (
          <circle key={c.month} cx={c.x} cy={c.y} r="3.2" fill="#0B0C0F" stroke="#FF3B00" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}
