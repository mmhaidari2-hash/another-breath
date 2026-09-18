'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SellPage() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('');
  const [mrr, setMrr] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // فاز ۱: فرم فروشنده هنوز بک‌اند ندارد — درخواست به‌صورت mailto ارسال می‌شود
    // تا وقتی پنل ادمین آماده شود. صادقانه، بدون ادعای اتوماسیون.
    const subject = encodeURIComponent(`[Cladak] درخواست فروش: ${product || 'بدون عنوان'}`);
    const body = encodeURIComponent(
      `نام: ${name}\nایمیل: ${email}\nمحصول: ${product}\nMRR تقریبی: ${mrr || '—'}\n\nتوضیحات:\n${notes}`
    );
    window.location.href = `mailto:hello@cladak.local?subject=${subject}&body=${body}`;
    setStatus('sent');
  };

  return (
    <main className="relative z-10 min-h-screen pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 hero-plane opacity-50" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        <Link href="/" className="mb-8 inline-flex text-sm text-mist-muted hover:text-mist">
          بازگشت
        </Link>

        <p className="text-sm tracking-widest text-bronze">فروشندگان</p>
        <h1 className="mt-3 font-display text-4xl text-mist sm:text-5xl">فروش محصول در کلادک</h1>
        <p className="mt-4 text-mist-muted leading-relaxed">
          ثبت رایگان است. محصولت دستی بررسی می‌شود و فقط بعد از تأیید در فهرست عمومی دیده می‌شود.
          فعلاً درخواست‌ها از طریق ایمیل دریافت می‌شوند تا پنل فروشنده آماده شود.
        </p>

        {status === 'sent' ? (
          <div className="mt-10 rounded-xl border border-sea/30 bg-sea/10 p-6 text-sm text-mist">
            اگر کلاینت ایمیل باز شد، درخواستت آمادهٔ ارسال است. در غیر این صورت، جزئیات را مستقیم به
            تیم کلادک بفرست.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded-xl border border-line bg-ink-raised/70 p-6">
            <div>
              <label className="mb-1.5 block text-xs text-mist-muted" htmlFor="name">
                نام
              </label>
              <input
                id="name"
                required
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-mist-muted" htmlFor="email">
                ایمیل
              </label>
              <input
                id="email"
                type="email"
                required
                dir="ltr"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-mist-muted" htmlFor="product">
                نام محصول
              </label>
              <input
                id="product"
                required
                className="input-field"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-mist-muted" htmlFor="mrr">
                MRR تقریبی (اختیاری)
              </label>
              <input
                id="mrr"
                dir="ltr"
                className="input-field"
                value={mrr}
                onChange={(e) => setMrr(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-mist-muted" htmlFor="notes">
                توضیح کوتاه
              </label>
              <textarea
                id="notes"
                rows={4}
                className="input-field"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              ارسال درخواست بررسی
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
