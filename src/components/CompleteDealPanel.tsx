'use client';

import { useState } from 'react';

export default function CompleteDealPanel({
  leadId,
  defaultPrice,
}: {
  leadId: string;
  defaultPrice?: number;
}) {
  const [closePriceGbp, setClosePriceGbp] = useState(
    defaultPrice ? String(defaultPrice) : ''
  );
  const [paymentRef, setPaymentRef] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      const res = await fetch('/api/deals/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          closePriceGbp: Number(closePriceGbp),
          paymentRef: paymentRef || `paid_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setStatus('done');
      setMessage(
        `Fee £${data.amountGbp} recorded anonymously. Buyer + seller accounts purged.`
      );
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed');
    }
  };

  if (status === 'done') {
    return (
      <div className="mt-4 border border-signal/40 bg-signal/10 p-4 text-sm">
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border border-coal/15 bg-stone-soft p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
        Automation · pay fee & purge parties
      </p>
      <p className="text-xs text-coal-soft">
        On payment confirmation the success fee is booked anonymously, then buyer and seller
        accounts and PII are deleted. Only a hashed fee receipt remains.
      </p>
      <input
        className="input-field"
        type="number"
        min="1"
        step="1"
        required
        placeholder="Close price (GBP)"
        value={closePriceGbp}
        onChange={(e) => setClosePriceGbp(e.target.value)}
      />
      <input
        className="input-field"
        required
        placeholder="Payment reference (Stripe/bank id)"
        value={paymentRef}
        onChange={(e) => setPaymentRef(e.target.value)}
      />
      {message && status === 'error' && <p className="text-sm text-red-600">{message}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? 'Completing…' : 'Confirm fee & purge accounts'}
      </button>
    </form>
  );
}
