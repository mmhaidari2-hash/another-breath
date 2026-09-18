'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

const KEY = 'cladak-cookie-notice-v1';

export default function CookieNotice() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={fa ? 'اطلاع کوکی' : 'Cookie notice'}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-coal/15 bg-stone-raised/95 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-shell flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-coal-soft">
          {fa
            ? 'کلادک فقط فضای ضروری مرورگر (زبان، واچ‌لیست، مقایسه) را نگه می‌دارد — بدون ترکر تبلیغاتی.'
            : 'Cladak stores only essential browser data (language, watchlist, compare) — no ad trackers.'}{' '}
          <Link href="/legal/cookies" className="text-signal underline">
            {fa ? 'جزئیات' : 'Details'}
          </Link>
        </p>
        <button type="button" onClick={dismiss} className="btn-primary shrink-0 !px-5 !py-2 text-sm">
          {fa ? 'متوجه شدم' : 'Got it'}
        </button>
      </div>
    </div>
  );
}
