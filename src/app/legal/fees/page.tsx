import LegalShell from '@/components/LegalShell';

export default function FeesPage() {
  return (
    <LegalShell title="Fees">
      <h2 className="font-display text-xl font-bold text-coal">Listing</h2>
      <p>Free to submit. Public only after manual verification.</p>
      <h2 className="font-display text-xl font-bold text-coal">Success fee</h2>
      <p>
        3%–5% of closed transaction value for deals introduced through Cladak. Exact percent is set
        per deal / PlatformConfig before invoice.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Buyer subscription</h2>
      <p>Not charged in Phase 1. Planned for Phase 2 for deeper diligence access.</p>
      <h2 className="font-display text-xl font-bold text-coal">Who pays</h2>
      <p>
        Default: seller-side success fee unless otherwise agreed in writing. Transparent before
        intro completion.
      </p>
      <p className="text-xs text-coal-mute">Payment processing of fees: Phase 2.</p>
    </LegalShell>
  );
}
