'use client';

import { useState } from 'react';
import { formatPence, penceToGbp } from '@/lib/money';

export default function CompleteDealPanel({
  leadId,
  defaultPricePence,
}: {
  leadId: string;
  defaultPricePence?: number;
}) {
  const [closePriceGbp, setClosePriceGbp] = useState(
    defaultPricePence ? String(penceToGbp(defaultPricePence)) : ''
  );
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [escrowId, setEscrowId] = useState<string | null>(null);

  const payFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      const res = await fetch('/api/deals/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          closePriceGbp: Number(closePriceGbp),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      setCheckoutUrl(data.checkoutUrl);
      const feeLabel =
        typeof data.amountPence === 'number'
          ? formatPence(data.amountPence)
          : '—';
      setMessage(
        data.mode === 'stripe'
          ? `Stripe Checkout ready — fee ${feeLabel}. Pay to auto-purge accounts.`
          : `Demo checkout ready — fee ${feeLabel}. Open link to simulate payment + purge (set STRIPE_SECRET_KEY for live).`
      );
      setStatus('done');
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed');
    }
  };

  const requestEscrow = async () => {
    setMessage(null);
    try {
      const res = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          amountGbp:
            Number(closePriceGbp) ||
            (defaultPricePence != null ? penceToGbp(defaultPricePence) : 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Escrow failed');
      setEscrowId(data.caseId);
      setMessage(
        `Escrow case ${data.caseId} referred to ${data.partnerName}. Cladak does not hold funds.`
      );
      if (data.partnerUrl) window.open(data.partnerUrl, '_blank', 'noopener,noreferrer');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Escrow failed');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={payFee} className="mt-4 space-y-3 border border-coal/15 bg-stone-soft p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
        Automation · Stripe fee → purge · partner escrow
      </p>
      <p className="text-xs text-coal-soft">
        Pay the success fee (Stripe Checkout). On payment, accounts purge automatically. Optional:
        open partner escrow — Cladak never custodies funds.
      </p>
      <input
        className="input-field"
        type="number"
        min="1"
        step="0.01"
        required
        placeholder="Close price (GBP)"
        value={closePriceGbp}
        onChange={(e) => setClosePriceGbp(e.target.value)}
      />
      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-coal'}`}>{message}</p>
      )}
      {checkoutUrl && (
        <a href={checkoutUrl} className="block text-sm text-signal underline" dir="ltr">
          Open checkout
        </a>
      )}
      {escrowId && (
        <p className="font-mono text-[11px] text-coal-mute" dir="ltr">
          Escrow case: {escrowId}
        </p>
      )}
      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? 'Starting Checkout…' : 'Pay success fee (Stripe)'}
      </button>
      <button
        type="button"
        className="btn-ghost w-full"
        onClick={requestEscrow}
        disabled={!closePriceGbp}
      >
        Open partner escrow
      </button>
    </form>
  );
}
