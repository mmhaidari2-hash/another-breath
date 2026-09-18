'use client';

import { useState } from 'react';
import { useLang } from '@/components/LanguageProvider';

export default function LeadForm({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const { t } = useLang();
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerName,
          buyerEmail,
          budget: budget ? Number(budget) : undefined,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error');
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-signal/40 bg-signal/10 p-4 text-sm text-coal">
        {t.leadSuccess}
        <span className="mt-1 block font-display text-lg font-bold">{listingTitle}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="buyerName" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {t.name}
        </label>
        <input
          id="buyerName"
          required
          className="input-field"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="buyerEmail" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {t.email}
        </label>
        <input
          id="buyerEmail"
          type="email"
          required
          dir="ltr"
          className="input-field"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="budget" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {t.budget}
        </label>
        <input
          id="budget"
          type="number"
          min="0"
          dir="ltr"
          className="input-field"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {t.message}
        </label>
        <textarea
          id="message"
          rows={3}
          className="input-field"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? t.sending : t.send}
      </button>
    </form>
  );
}
