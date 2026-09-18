import Link from 'next/link';

export const metadata = {
  title: 'Closing protocol — Cladak',
};

export default function ClosingPage({
  searchParams,
}: {
  searchParams?: { paid?: string; demo?: string; fee?: string; cancelled?: string };
}) {
  const paid = searchParams?.paid === '1';
  const cancelled = searchParams?.cancelled === '1';
  const demo = searchParams?.demo === '1';

  const steps = [
    {
      t: '1 · Qualified intro',
      d: 'Buyer accepts Terms + Non-Circumvention. Auto-intro emails both parties. Seller contact stays mediated.',
    },
    {
      t: '2 · Diligence window',
      d: 'Public listings require a complete evidence pack: revenue proof URL, live product URL, UI attestation, sworn declaration. Ops cannot VERIFY without that pack.',
    },
    {
      t: '3 · Commercial terms',
      d: 'Parties agree price and transfer checklist. Success fee (3–5%) is collected via Stripe Checkout on close.',
    },
    {
      t: '4 · Partner escrow',
      d: 'Optional: open an EscrowCase referred to a licensed partner (default Escrow.com). Cladak never holds or custodies buyer/seller funds.',
    },
    {
      t: '5 · Fee → purge',
      d: 'Stripe webhook (or demo checkout) books an anonymous FeeLedger row, then deletes buyer/seller accounts and listing PII automatically.',
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
          Intro → evidence → Stripe fee → partner escrow (optional) → automatic purge. No fake
          custody.
        </p>

        {paid && (
          <div className="mt-6 border border-signal/40 bg-signal/10 p-4 text-sm">
            Fee payment recorded{demo ? ' (demo mode)' : ''}.
            {searchParams?.fee ? ` £${searchParams.fee}.` : ''} Parties purged.
          </div>
        )}
        {cancelled && (
          <div className="mt-6 border border-coal/15 bg-stone-soft p-4 text-sm text-coal-soft">
            Checkout cancelled — lead still open. You can retry from the listing intro panel.
          </div>
        )}

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
