import LegalShell from '@/components/LegalShell';

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Use">
      <p>
        Cladak is a verified marketplace for Micro-SaaS assets. By using the site you agree to these
        Terms. Cladak is an introduction platform, not a broker-dealer, bank, or escrow agent in Phase
        1.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">1. Accounts & roles</h2>
      <p>
        Buyers request introductions via Lead forms. Sellers submit assets for manual review. Public
        listings require VERIFIED status.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">2. Fees</h2>
      <p>
        Listing is free. A success fee of 3–5% applies to closed transactions introduced through
        Cladak. See <a href="/legal/fees">Fees</a>.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">3. Non-circumvention</h2>
      <p>
        Users must not bypass Cladak to close deals with counterparties discovered on the platform.
        See <a href="/legal/non-circumvention">Non-Circumvention</a>.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">4. No fabricated claims</h2>
      <p>
        Cladak does not publish fake user counts, fake certifications, or “legally binding” labels on
        non-binding flows.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">5. Liability</h2>
      <p>
        Listings are provided by sellers and reviewed manually to a Phase-1 standard. Cladak does not
        guarantee future revenue, uptime, or legal title. Buyers must perform their own diligence.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">6. IP</h2>
      <p>
        Platform software and branding belong to the platform owner. Listed product IP remains with
        the seller until a separate transfer agreement.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">7. Governing law</h2>
      <p>
        Governing law/jurisdiction must be set by the platform owner before production launch
        (placeholder in PlatformConfig).
      </p>
      <p className="text-xs text-coal-mute">Last updated: 2026-09-18 · Not legal advice.</p>
    </LegalShell>
  );
}
