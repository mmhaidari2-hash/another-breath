'use client';

import { useLang } from '@/components/LanguageProvider';

export default function HowItWorks() {
  const { t } = useLang();
  const steps = [
    { n: '01', title: t.step1t, body: t.step1d },
    { n: '02', title: t.step2t, body: t.step2d },
    { n: '03', title: t.step3t, body: t.step3d },
  ];

  return (
    <section className="border-y border-ink/8 bg-paper-raised py-24">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <p className="section-eyebrow">{t.navTrust}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {t.howTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-ink-soft">{t.howSub}</p>
        <ol className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative border-t border-ink/10 pt-6">
              <span className="font-display text-5xl text-forest/25">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
