'use client';

import { useState } from 'react';
import type { GalleryFrame } from '@/lib/utils';

export default function ProductGallery({ frames, title }: { frames: GalleryFrame[]; title: string }) {
  const [active, setActive] = useState(0);
  if (!frames.length) return null;
  const frame = frames[active] ?? frames[0];

  return (
    <div>
      <div
        className="relative aspect-[16/10] overflow-hidden border border-coal/15"
        style={{ background: frame.tone }}
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-6 border border-white/10" />
          <div className="absolute start-10 top-10 h-3 w-28 bg-white/15" />
          <div className="absolute start-10 top-16 h-2 w-40 bg-white/10" />
          <div className="absolute bottom-10 end-10 start-10 grid grid-cols-3 gap-3">
            <div className="h-16 bg-white/8" />
            <div className="h-16 bg-white/12" />
            <div className="h-16 bg-signal/30" />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            Product frame · {frame.label}
          </p>
          <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {frames.map((f, i) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setActive(i)}
            className={`min-w-[112px] border px-3 py-3 text-start transition ${
              i === active ? 'border-signal bg-coal text-white' : 'border-coal/12 bg-stone-raised'
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">0{i + 1}</span>
            <span className="mt-1 block text-sm font-semibold">{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
