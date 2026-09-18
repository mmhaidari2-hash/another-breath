'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

const OWNER_DOORS = [
  {
    title: 'Persian UI unlock',
    path: '/cofounder',
    detail: 'Code: cladak-cofounder (env COFOUNDER_ACCESS_CODE)',
  },
  {
    title: 'Co-founder login',
    path: '/login',
    detail: 'cofounder@cladak.com · CofounderPass123!',
  },
  {
    title: 'Ops desk',
    path: '/ops',
    detail: 'After login as cofounder or ops@cladak.com · AdminPass123!',
  },
  {
    title: 'Studio',
    path: '/studio',
    detail: 'Seller + operator workspace',
  },
] as const;

export default function CofounderGate() {
  const { unlockCofounder, lockCofounder, cofounder, setLang } = useLang();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/cofounder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Invalid access');
      return;
    }
    unlockCofounder();
    setLang('fa');
    setOk(true);
  };

  const unlocked = cofounder || ok;

  return (
    <main className="pb-24 pt-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          Home
        </Link>
        <p className="eyebrow mt-8">Owner access</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
          Your doors
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-coal-soft">
          Public site is English-only. This page is your private map. Enter the co-founder code
          to unlock Persian, then use the logins below for Ops and Studio.
        </p>

        <div className="mt-8 space-y-3 border border-coal/15 bg-stone-soft p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
            Access map
          </p>
          {OWNER_DOORS.map((door) => (
            <div key={door.path} className="border-t border-coal/10 pt-3 first:border-0 first:pt-0">
              <Link href={door.path} className="font-display text-lg font-bold text-coal hover:text-signal">
                {door.path}
              </Link>
              <p className="text-xs font-semibold text-coal">{door.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-coal-soft" dir="ltr">
                {door.detail}
              </p>
            </div>
          ))}
        </div>

        {unlocked ? (
          <div className="mt-8 space-y-4 border border-signal/40 bg-signal/10 p-5 text-sm">
            <p className="font-semibold text-coal">
              Unlocked. Persian is on. Your accounts are live after seed reset.
            </p>
            <ul className="space-y-1 font-mono text-[11px] text-coal-soft" dir="ltr">
              <li>FA unlock code → cladak-cofounder</li>
              <li>cofounder@cladak.com → CofounderPass123!</li>
              <li>ops@cladak.com → AdminPass123!</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href="/ops" className="btn-primary">
                Open Ops
              </Link>
              <Link href="/studio" className="btn-ghost">
                Studio
              </Link>
              <Link href="/login" className="btn-ghost">
                Login
              </Link>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  lockCofounder();
                  setOk(false);
                }}
              >
                Lock again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                Co-founder access code
              </label>
              <input
                type="password"
                className="input-field"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="cladak-cofounder"
                autoComplete="off"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary">
              Unlock Persian + owner session
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
