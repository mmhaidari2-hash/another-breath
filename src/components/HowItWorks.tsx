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
    <section className="border-y border-coal/10 bg-stone-soft py-24">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <p className="eyebrow">{t.navTrust}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-coal sm:text-6xl">
          {t.howTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-coal-soft">{t.howSub}</p>
        <ol className="mt-14 grid gap-0 border border-coal/12 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={`bg-stone-raised p-8 ${i > 0 ? 'border-t border-coal/12 sm:border-t-0 sm:border-s' : ''}`}
            >
              <span className="font-display text-5xl font-bold text-signal/30">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-coal-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
