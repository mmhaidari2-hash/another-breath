import Link from 'next/link';

export const metadata = {
  title: 'Closing protocol — Cladak',
};

export default function ClosingPage() {
  const steps = [
    {
      t: '1 · Qualified intro',
      d: 'Buyer accepts Terms + Non-Circumvention. Seller contact stays private until Cladak marks the lead INTRODUCED.',
    },
    {
      t: '2 · Diligence window',
      d: 'Buyer reviews verification notes, MRR snapshots, product access (when demoPolicy allows). NDA/VDR packs can be attached offline in Phase 1.',
    },
    {
      t: '3 · Commercial terms',
      d: 'Parties agree price, transition support, and asset transfer checklist. Success fee (3–5%) is due on closed deals introduced via Cladak.',
    },
    {
      t: '4 · Closing desk',
      d: 'Phase 1 documents the closing checklist and fee survival. Phase 2 adds escrow partner rails. We do not fake escrow today.',
    },
    {
      t: '5 · Post-close',
      d: 'Report close in Studio / Ops so audit trail stays complete. Circumvention within the configured window still owes the success fee.',
    },
  ];

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/trust" className="text-sm text-coal-mute hover:text-coal">
          Trust Center
        </Link>
        <p className="eyebrow mt-8">Deal protocol</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight">Closing</h1>
        <p className="mt-4 text-lg text-coal-soft">
          How a Cladak intro becomes a closed Micro-SaaS transfer — without pretending Phase-2 rails
          already exist.
        </p>

        <ol className="mt-10 space-y-4">
          {steps.map((s) => (
            <li key={s.t} className="border border-coal/12 bg-stone-raised p-6">
              <h2 className="font-display text-2xl font-bold">{s.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-coal-soft">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/marketplace" className="btn-primary">
            Browse market
          </Link>
          <Link href="/legal/non-circumvention" className="btn-ghost">
            Non-Circumvention
          </Link>
          <Link href="/legal/fees" className="btn-ghost">
            Fees
          </Link>
        </div>
      </div>
    </main>
  );
}
