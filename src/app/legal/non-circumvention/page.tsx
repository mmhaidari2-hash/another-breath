import LegalShell from '@/components/LegalShell';

export default function NonCircumventionPage() {
  return (
    <LegalShell title="Non-Circumvention Policy">
      <p>
        Cladak’s value is verified discovery and mediated introduction. Circumvention destroys that
        value and is prohibited.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">What counts as circumvention</h2>
      <ul className="list-disc ps-5">
        <li>Contacting a seller/buyer found on Cladak outside the platform to close the same deal</li>
        <li>Sharing contact details to avoid success fees</li>
        <li>Using demo URLs or diligence packs obtained via Cladak to finish off-platform without fee</li>
      </ul>
      <h2 className="font-display text-xl font-bold text-coal">Controls in product</h2>
      <ul className="list-disc ps-5">
        <li>Seller email never exposed in public UI or Lead API responses</li>
        <li>Mandatory Non-Circumvention checkbox before Lead / Seller Inquiry</li>
        <li>Demo URLs default to INTRO_ONLY</li>
        <li>Audit log of agreement-backed Leads</li>
      </ul>
      <h2 className="font-display text-xl font-bold text-coal">Fee survival</h2>
      <p>
        If parties close a deal within the configured non-circumvention window (default 730 days)
        after introduction, Cladak’s success fee remains due.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Honest limit</h2>
      <p>
        No marketplace can technologically stop every private deal. These controls + contract terms
        are the industry standard deterrent used by Acquire-class platforms. Escrow enforcement is
        Phase 2.
      </p>
      <p className="text-xs text-coal-mute">Last updated: 2026-09-18 · Have counsel review before launch.</p>
    </LegalShell>
  );
}
