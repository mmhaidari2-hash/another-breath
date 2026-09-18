'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero-mesh relative overflow-hidden border-b border-ink/8">
      <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Full-bleed architectural visual plane */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-y-0 end-0 h-full w-[58%] opacity-[0.55]"
          viewBox="0 0 640 720"
          fill="none"
        >
          <rect
            x="80"
            y="90"
            width="420"
            height="520"
            rx="28"
            className="animate-floaty"
            stroke="#1B3A5C"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <path
            d="M140 220 H440 M140 300 H400 M140 380 H420 M140 460 H360"
            stroke="#0B6E4F"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-draw"
            style={{ strokeDasharray: 240 }}
          />
          <circle cx="470" cy="180" r="54" fill="#0B6E4F" fillOpacity="0.12" />
          <circle cx="180" cy="520" r="36" fill="#1B3A5C" fillOpacity="0.1" />
          <text
            x="160"
            y="190"
            fill="#12141A"
            fillOpacity="0.35"
            fontFamily="Fraunces, Georgia, serif"
            fontSize="28"
          >
            Micro-SaaS
          </text>
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-shell flex-col justify-center px-4 py-20 sm:px-6">
        <p
          className="animate-rise font-display text-[clamp(3.75rem,13vw,8.75rem)] leading-[0.88] tracking-[-0.03em] text-ink"
          style={{ animationDelay: '40ms' }}
        >
          CLADAK
        </p>
        <p className="animate-rise mt-3 text-lg font-medium text-forest" style={{ animationDelay: '120ms' }}>
          {t.brandSub}
        </p>
        <h1
          className="animate-rise mt-8 max-w-2xl text-balance text-2xl font-semibold leading-snug text-ink sm:text-4xl"
          style={{ animationDelay: '200ms' }}
        >
          {t.heroHeadline}
        </h1>
        <p
          className="animate-rise mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          style={{ animationDelay: '280ms' }}
        >
          {t.heroSub}
        </p>
        <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '360ms' }}>
          <Link href="/marketplace" className="btn-primary">
            {t.ctaBrowse}
          </Link>
          <Link href="/sell" className="btn-secondary">
            {t.ctaSell}
          </Link>
        </div>
      </div>
    </section>
  );
}
