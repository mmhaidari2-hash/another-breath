import LegalShell from '@/components/LegalShell';

export default function FeesPage() {
  return (
    <LegalShell title="Fees">
      <h2 className="font-display text-xl font-bold text-coal">Listing</h2>
      <p>
        Free to submit. Public only after a complete evidence pack (revenue proof URL, live product
        URL, UI attestation, sworn declaration) or Ops verification of that pack.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Success fee</h2>
      <p>
        3%–5% of closed transaction value for deals introduced through Cladak. Collected via{' '}
        <strong>Stripe Checkout (GBP)</strong>. On payment, an anonymous FeeLedger row is kept and
        buyer/seller accounts are purged.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Escrow</h2>
      <p>
        Optional partner escrow (default Escrow.com). Cladak never holds or custodies transaction
        funds — the licensed partner does.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Who pays</h2>
      <p>
        Default: seller-side success fee unless otherwise agreed in writing. Transparent before
        intro completion.
      </p>
    </LegalShell>
  );
}
