'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function SellForm() {
  const { lang } = useLang();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    product: '',
    mrr: '',
    url: '',
    notes: '',
  });
  const fa = lang === 'fa';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/seller-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      <div className="border border-coal bg-stone-raised p-8 shadow-hard">
        <h2 className="font-display text-3xl font-bold">
          {fa ? 'درخواست ثبت شد' : 'Request received'}
        </h2>
        <p className="mt-3 text-coal-soft">
          {fa
            ? 'تیم بررسی دستی تماس می‌گیرد. تا تأیید، چیزی عمومی نمی‌شود.'
            : 'Manual review will contact you. Nothing is public until verified.'}
        </p>
        <Link href="/marketplace" className="btn-primary mt-6">
          {fa ? 'بازار' : 'Market'}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-coal bg-stone-raised p-6 shadow-hard sm:p-8">
      {(
        [
          ['name', fa ? 'نام' : 'Name', false],
          ['email', fa ? 'ایمیل' : 'Email', true],
          ['product', fa ? 'نام محصول' : 'Product name', false],
          ['mrr', fa ? 'MRR تقریبی' : 'Approx. MRR', true],
          ['url', fa ? 'آدرس محصول' : 'Product URL', true],
        ] as const
      ).map(([key, label, ltr]) => (
        <div key={key}>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute" htmlFor={key}>
            {label}
          </label>
          <input
            id={key}
            required={key === 'name' || key === 'email' || key === 'product'}
            type={key === 'email' ? 'email' : 'text'}
            dir={ltr ? 'ltr' : undefined}
            className="input-field"
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          />
        </div>
      ))}
      <div>
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute" htmlFor="notes">
          {fa ? 'توضیح' : 'Notes'}
        </label>
        <textarea
          id="notes"
          rows={4}
          className="input-field"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? (fa ? '...' : '...') : fa ? 'ارسال برای بررسی' : 'Submit for review'}
      </button>
    </form>
  );
}
