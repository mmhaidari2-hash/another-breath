'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function DataRightsForm() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<'ACCESS' | 'DELETE' | 'CORRECT'>('ACCESS');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/data-rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, requestType, details }),
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
      <div className="border border-signal/40 bg-signal/10 p-5 text-sm">
        {fa
          ? 'درخواست ثبت شد. پاسخ از طریق ایمیل ارسال می‌شود.'
          : 'Request queued. We will reply by email.'}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-lg space-y-4">
      <div>
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {fa ? 'نام' : 'Full name'}
        </label>
        <input
          required
          className="input-field"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          Email
        </label>
        <input
          required
          type="email"
          dir="ltr"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {fa ? 'نوع درخواست' : 'Request type'}
        </label>
        <select
          className="input-field"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as typeof requestType)}
        >
          <option value="ACCESS">{fa ? 'دسترسی به داده' : 'Access my data'}</option>
          <option value="DELETE">{fa ? 'حذف داده' : 'Delete my data'}</option>
          <option value="CORRECT">{fa ? 'اصلاح داده' : 'Correct my data'}</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
          {fa ? 'جزئیات' : 'Details'}
        </label>
        <textarea
          rows={4}
          className="input-field"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary">
        {status === 'loading'
          ? fa
            ? 'در حال ارسال…'
            : 'Sending…'
          : fa
            ? 'ثبت درخواست'
            : 'Submit request'}
      </button>
      <p className="text-xs text-coal-mute">
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
