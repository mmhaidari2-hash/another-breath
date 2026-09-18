'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

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

  return (
    <main className="pb-24 pt-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          Home
        </Link>
        <p className="eyebrow mt-8">Internal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
          Co-founder access
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-coal-soft">
          URL: <code className="text-signal">/cofounder</code>
          <br />
          The public Cladak product is English-only. Persian UI is reserved for co-founder working
          sessions. Enter the access code to unlock FA/EN switching.
        </p>

        {cofounder || ok ? (
          <div className="mt-8 space-y-4 border border-signal/40 bg-signal/10 p-5 text-sm">
            <p className="font-semibold text-coal">Access unlocked. Persian is available in the header.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn-primary">
                Open home (FA)
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
                Access code
              </label>
              <input
                type="password"
                className="input-field"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary">
              Unlock Persian
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
