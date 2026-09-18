'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  KEY_QUESTIONS,
  PERSONA_LABELS,
  STATUS_LABELS,
  type QuestionPersona,
  type QuestionStatus,
} from '@/data/key-questions';
import { useLang } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';

const PERSONAS: Array<QuestionPersona | 'all'> = [
  'all',
  'investor',
  'buyer',
  'seller',
  'auditor',
];

export default function QuestionsDesk() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const [persona, setPersona] = useState<QuestionPersona | 'all'>('all');
  const [openId, setOpenId] = useState<number | null>(1);

  const filtered = useMemo(
    () =>
      persona === 'all'
        ? KEY_QUESTIONS
        : KEY_QUESTIONS.filter((q) => q.persona === persona),
    [persona]
  );

  const counts = useMemo(() => {
    const base: Record<QuestionStatus, number> = {
      live: 0,
      added: 0,
      phase2: 0,
      owner: 0,
    };
    for (const q of KEY_QUESTIONS) base[q.status] += 1;
    return base;
  }, []);

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {PERSONAS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPersona(p)}
            className={cn(
              'border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider',
              persona === p
                ? 'border-coal bg-coal text-white'
                : 'border-coal/15 bg-stone-raised text-coal-soft hover:border-coal/40'
            )}
          >
            {p === 'all'
              ? fa
                ? 'همه'
                : 'All'
              : fa
                ? PERSONA_LABELS[p].fa
                : PERSONA_LABELS[p].en}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(counts) as QuestionStatus[]).map((s) => (
          <div key={s} className="border border-coal/10 bg-stone-raised px-3 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
              {fa ? STATUS_LABELS[s].fa : STATUS_LABELS[s].en}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">{counts[s]}</p>
          </div>
        ))}
      </div>

      <ul className="mt-10 space-y-2">
        {filtered.map((item) => {
          const open = openId === item.id;
          return (
            <li key={item.id} className="border border-coal/12 bg-stone-raised">
              <button
                type="button"
                className="flex w-full items-start gap-3 px-4 py-4 text-start"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <span className="font-mono text-[11px] text-signal">
                  {String(item.id).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">
                      {fa
                        ? PERSONA_LABELS[item.persona].fa
                        : PERSONA_LABELS[item.persona].en}
                    </span>
                    <StatusPill status={item.status} fa={fa} />
                  </span>
                  <span className="mt-1 block font-display text-lg font-bold leading-snug sm:text-xl">
                    {fa ? item.q.fa : item.q.en}
                  </span>
                </span>
                <span className="font-mono text-coal-mute">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="border-t border-coal/10 px-4 pb-5 pt-3 sm:ps-14">
                  <p className="text-sm leading-relaxed text-coal-soft">
                    {fa ? item.a.fa : item.a.en}
                  </p>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="mt-3 inline-block font-mono text-[11px] text-signal underline"
                    >
                      {fa ? 'مشاهده در محصول' : 'Open in product'} → {item.href}
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusPill({ status, fa }: { status: QuestionStatus; fa: boolean }) {
  const tone =
    status === 'live' || status === 'added'
      ? 'border-signal/40 text-signal'
      : status === 'phase2'
        ? 'border-coal/20 text-coal-mute'
        : 'border-coal/30 text-coal-soft';
  return (
    <span className={cn('border px-1.5 py-0.5 font-mono text-[10px]', tone)}>
      {fa ? STATUS_LABELS[status].fa : STATUS_LABELS[status].en}
    </span>
  );
}
