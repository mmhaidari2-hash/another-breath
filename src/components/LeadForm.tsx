'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';
import CompleteDealPanel from '@/components/CompleteDealPanel';

export default function LeadForm({
  listingId,
  listingTitle,
  askingPrice,
}: {
  listingId: string;
  listingTitle: string;
  askingPrice?: number;
}) {
  const { t } = useLang();
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedNonCircumvention, setAcceptedNonCircumvention] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !acceptedNonCircumvention) {
      setError('Terms and non-circumvention are required');
      return;
    }
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
          acceptedTerms: true,
          acceptedNonCircumvention: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error');
      setLeadId(data.leadId);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  if (status === 'success' && leadId) {
    return (
      <div className="border border-signal/40 bg-signal/10 p-4 text-sm text-coal">
        <p>{t.leadSuccess}</p>
        <span className="mt-1 block font-display text-lg font-bold">{listingTitle}</span>
        <p className="mt-2 text-xs text-coal-soft">
          Intro is automated. When the deal closes, confirm the success fee — buyer and seller
          accounts are then purged. Only an anonymous fee receipt remains.
        </p>
        <CompleteDealPanel leadId={leadId} defaultPrice={askingPrice} />
        <p className="mt-3 text-xs text-coal-mute">
          See <Link href="/closing" className="underline">Closing protocol</Link>.
        </p>
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
          autoComplete="name"
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
          autoComplete="email"
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

      <label className="flex items-start gap-2 text-xs leading-relaxed text-coal-soft">
        <input
          type="checkbox"
          className="mt-0.5 accent-[#FF3B00]"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          required
        />
        <span>
          I accept the Terms and fee schedule.{' '}
          <Link href="/legal/terms" className="text-signal underline" target="_blank">
            Terms
          </Link>
        </span>
      </label>

      <label className="flex items-start gap-2 text-xs leading-relaxed text-coal-soft">
        <input
          type="checkbox"
          className="mt-0.5 accent-[#FF3B00]"
          checked={acceptedNonCircumvention}
          onChange={(e) => setAcceptedNonCircumvention(e.target.checked)}
          required
        />
        <span>
          I agree not to circumvent Cladak and deal off-platform (Non-Circumvention).{' '}
          <Link href="/legal/non-circumvention" className="text-signal underline" target="_blank">
            Policy
          </Link>
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? t.sending : t.send}
      </button>
    </form>
  );
}
