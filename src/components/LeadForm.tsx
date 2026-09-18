'use client';

import { useState } from 'react';

interface LeadFormProps {
  listingId: string;
  listingTitle: string;
}

export default function LeadForm({ listingId, listingTitle }: LeadFormProps) {
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
      if (!res.ok) throw new Error(data.error ?? 'ارسال ناموفق بود');

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-sea/30 bg-sea/10 p-4 text-sm leading-relaxed text-mist">
        درخواستت برای «{listingTitle}» ثبت شد. فروشنده مستقیماً باهات تماس می‌گیره.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="buyerName" className="mb-1.5 block text-xs text-mist-muted">
          نام کامل
        </label>
        <input
          id="buyerName"
          required
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          className="input-field"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="buyerEmail" className="mb-1.5 block text-xs text-mist-muted">
          ایمیل
        </label>
        <input
          id="buyerEmail"
          type="email"
          required
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          className="input-field"
          autoComplete="email"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="budget" className="mb-1.5 block text-xs text-mist-muted">
          بودجه‌ی تقریبی (اختیاری)
        </label>
        <input
          id="budget"
          type="number"
          min="0"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="input-field"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs text-mist-muted">
          پیام (اختیاری)
        </label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field resize-y"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? 'در حال ارسال...' : 'درخواست تماس'}
      </button>
    </form>
  );
}
