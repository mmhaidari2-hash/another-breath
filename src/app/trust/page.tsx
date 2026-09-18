import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TrustPage() {
  const [verified, leads, audits, config] = await Promise.all([
    prisma.listing.count({ where: { verificationStatus: 'VERIFIED' } }),
    prisma.lead.count(),
    prisma.auditEvent.count(),
    prisma.platformConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    }),
  ]);

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          Home
        </Link>
        <p className="eyebrow mt-8">Trust Center</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          Built for diligence
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-coal-soft">
          Answers for buyers, sellers, investors, and auditors — without fabricated certificates.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Verified listings" value={String(verified)} />
          <Stat label="Leads (all-time)" value={String(leads)} />
          <Stat label="Audit events" value={String(audits)} />
          <Stat
            label="Success fee"
            value={`${config.successFeeMinPercent}–${config.successFeeMaxPercent}%`}
          />
        </div>

        <section className="mt-12 space-y-4">
          {[
            {
              t: 'Verification',
              d: 'Only VERIFIED listings are public. Review notes stay on the asset. Automated Stripe/GA is Phase 2 — we say so.',
            },
            {
              t: 'Anti-circumvention',
              d: 'Seller contacts are never public. Leads require Terms + Non-Circumvention. Demo URLs default to intro-only.',
            },
            {
              t: 'Security baseline',
              d: 'Security headers, Zod validation, rate limits, hashed IPs, audit trail, no seller email in API responses.',
            },
            {
              t: 'What Phase 1 is not',
              d: 'Not escrow, not SOC2, not a bank, not a substitute for buyer diligence. Those claims would violate our golden rule.',
            },
          ].map((b, i) => (
            <article key={b.t} className="border border-coal/12 bg-stone-raised p-6">
              <p className="font-mono text-[11px] text-signal">0{i + 1}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{b.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-coal-soft">{b.d}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/questions" className="btn-primary">
            50 key questions
          </Link>
          <Link href="/legal/non-circumvention" className="btn-ghost">
            Non-Circumvention
          </Link>
          <Link href="/legal/privacy" className="btn-ghost">
            Privacy
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-coal/10 bg-stone-raised p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
