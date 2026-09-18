'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { mode: 'login', email, password }
            : { mode: 'register', name, email, password, role }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Auth failed');
      router.push(data.user?.role === 'SELLER' || data.user?.role === 'ADMIN' ? '/studio' : '/marketplace');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pb-24 pt-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          Home
        </Link>
        <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="mt-3 text-sm text-coal-soft">
          Buyers track intros. Sellers manage listings and inbound demand in Studio.
        </p>

        <div className="mt-6 flex border border-coal/15 font-mono text-[11px]">
          <button
            type="button"
            className={`flex-1 px-3 py-2 ${mode === 'login' ? 'bg-coal text-white' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`flex-1 px-3 py-2 ${mode === 'register' ? 'bg-coal text-white' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                  Name
                </label>
                <input className="input-field" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                  Role
                </label>
                <select
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'BUYER' | 'SELLER')}
                >
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
              Email
            </label>
            <input
              type="email"
              required
              dir="ltr"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </main>
  );
}
