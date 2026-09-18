'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

const STEPS = 4;

export default function SellWizard() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    product: '',
    url: '',
    niche: '',
    mrr: '',
    askingPrice: '',
    notes: '',
    evidenceRevenueUrl: '',
    evidenceProductUrl: '',
    evidenceNotes: '',
  });
  const [evidenceUiAttested, setEvidenceUiAttested] = useState(false);
  const [swornEvidence, setSwornEvidence] = useState(false);
  const [acceptedSellerTerms, setAcceptedSellerTerms] = useState(false);
  const [acceptedNonCircumvention, setAcceptedNonCircumvention] = useState(false);

  const next = () => setStep((s) => Math.min(STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/seller-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          evidenceUiAttested,
          swornEvidence,
          acceptedSellerTerms: true,
          acceptedNonCircumvention: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error');
      setResultMsg(data.message);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-coal bg-stone-raised p-8 shadow-hard">
        <p className="eyebrow">Submitted</p>
        <h2 className="mt-3 font-display text-4xl font-bold">Diligence received</h2>
        <p className="mt-3 text-coal-soft">
          {resultMsg ||
            'Listings go public only with a complete evidence pack (or Ops review).'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/marketplace" className="btn-primary">
            Open market
          </Link>
          <Link href="/studio" className="btn-ghost">
            Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-coal bg-stone-raised shadow-hard">
      <div className="flex border-b border-coal/10">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 px-2 py-3 text-center font-mono text-[10px] uppercase tracking-wider sm:px-4 sm:text-[11px] ${
              step === s ? 'bg-coal text-white' : 'text-coal-mute'
            }`}
          >
            {s === 1 ? 'Seller' : s === 2 ? 'Asset' : s === 3 ? 'Evidence' : 'Review'}
          </div>
        ))}
      </div>

      <div className="space-y-4 p-6 sm:p-8">
        {step === 1 && (
          <>
            <Field
              label={fa ? 'نام' : 'Name'}
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Field
              label={fa ? 'ایمیل' : 'Email'}
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              ltr
              type="email"
            />
          </>
        )}
        {step === 2 && (
          <>
            <Field
              label={fa ? 'نام محصول' : 'Product'}
              value={form.product}
              onChange={(v) => setForm({ ...form, product: v })}
            />
            <Field
              label="URL"
              value={form.url}
              onChange={(v) => setForm({ ...form, url: v })}
              ltr
            />
            <Field
              label={fa ? 'نیچ' : 'Niche'}
              value={form.niche}
              onChange={(v) => setForm({ ...form, niche: v })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="MRR"
                value={form.mrr}
                onChange={(v) => setForm({ ...form, mrr: v })}
                ltr
              />
              <Field
                label={fa ? 'قیمت درخواستی' : 'Asking'}
                value={form.askingPrice}
                onChange={(v) => setForm({ ...form, askingPrice: v })}
                ltr
              />
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="text-sm text-coal-soft">
              Evidence pack required for public listing. Links must be real diligence artefacts
              (Stripe dashboard share, bank CSV host, live product).
            </p>
            <Field
              label="Revenue proof URL"
              value={form.evidenceRevenueUrl}
              onChange={(v) => setForm({ ...form, evidenceRevenueUrl: v })}
              ltr
              type="url"
            />
            <Field
              label="Live product URL"
              value={form.evidenceProductUrl}
              onChange={(v) => setForm({ ...form, evidenceProductUrl: v })}
              ltr
              type="url"
            />
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                Evidence notes
              </span>
              <textarea
                className="input-field"
                rows={3}
                value={form.evidenceNotes}
                onChange={(e) => setForm({ ...form, evidenceNotes: e.target.value })}
              />
            </label>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-coal-soft">
              <input
                type="checkbox"
                className="mt-0.5 accent-[#FF3B00]"
                checked={evidenceUiAttested}
                onChange={(e) => setEvidenceUiAttested(e.target.checked)}
              />
              <span>I attest the product UI/UX matches the listing screenshots and live URL.</span>
            </label>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-coal-soft">
              <input
                type="checkbox"
                className="mt-0.5 accent-[#FF3B00]"
                checked={swornEvidence}
                onChange={(e) => setSwornEvidence(e.target.checked)}
              />
              <span>
                Sworn declaration: revenue and product evidence are accurate under England &amp;
                Wales law. False evidence = removal + fee survival.
              </span>
            </label>
          </>
        )}
        {step === 4 && (
          <>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                {fa ? 'یادداشت برای بررسی' : 'Notes for reviewers'}
              </span>
              <textarea
                className="input-field"
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
            <div className="border border-coal/10 bg-stone-soft p-4 text-sm text-coal-soft">
              <p>
                <strong>{form.product || '—'}</strong> · {form.niche || '—'}
              </p>
              <p className="mt-1 font-mono text-xs">
                MRR {form.mrr || '—'} · Ask {form.askingPrice || '—'}
              </p>
              <p className="mt-2 font-mono text-[10px]" dir="ltr">
                Evidence: {form.evidenceRevenueUrl ? 'revenue✓' : 'revenue✗'}{' '}
                {form.evidenceProductUrl ? 'product✓' : 'product✗'}{' '}
                {evidenceUiAttested ? 'ui✓' : 'ui✗'} {swornEvidence ? 'sworn✓' : 'sworn✗'}
              </p>
            </div>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-coal-soft">
              <input
                type="checkbox"
                className="mt-0.5 accent-[#FF3B00]"
                checked={acceptedSellerTerms}
                onChange={(e) => setAcceptedSellerTerms(e.target.checked)}
                required
              />
              <span>
                {fa ? 'شرایط فروشنده و کارمزد موفقیت را می‌پذیرم.' : 'I accept Seller Terms and success fees.'}{' '}
                <a href="/legal/terms" className="text-signal underline" target="_blank" rel="noreferrer">
                  Terms
                </a>
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
                {fa
                  ? 'متعهد می‌شوم معامله را خارج از کلادک نببندم.'
                  : 'I will not close deals off-platform outside Cladak.'}{' '}
                <a
                  href="/legal/non-circumvention"
                  className="text-signal underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Non-Circumvention
                </a>
              </span>
            </label>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-between gap-3 pt-2">
          <button type="button" className="btn-ghost" onClick={back} disabled={step === 1}>
            Back
          </button>
          {step < STEPS ? (
            <button
              type="button"
              className="btn-primary"
              onClick={next}
              disabled={
                (step === 1 && (!form.name || !form.email)) ||
                (step === 2 && !form.product) ||
                (step === 3 &&
                  (!form.evidenceRevenueUrl ||
                    !form.evidenceProductUrl ||
                    !evidenceUiAttested ||
                    !swornEvidence))
              }
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={submit}
              disabled={
                status === 'loading' || !acceptedSellerTerms || !acceptedNonCircumvention
              }
            >
              {status === 'loading' ? '…' : fa ? 'ارسال با مدرک' : 'Submit with evidence'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ltr,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ltr?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-coal-mute">
        {label}
      </span>
      <input
        className="input-field"
        type={type}
        dir={ltr ? 'ltr' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
