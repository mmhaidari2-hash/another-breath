import LegalShell from '@/components/LegalShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const config = await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

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
        listings require VERIFIED status. Seller contact details are never published.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">2. Fees</h2>
      <p>
        Listing is free. A success fee of {config.successFeeMinBps / 100}–
        {config.successFeeMaxBps / 100}% applies to closed transactions introduced through Cladak. See{' '}
        <a href="/legal/fees">Fees</a>.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">3. Non-circumvention</h2>
      <p>
        Users must not bypass Cladak to close deals with counterparties discovered on the platform
        within {config.nonCircumventionDays} days of introduction. Fee rights survive circumvention.
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
      <h2 className="font-display text-xl font-bold text-coal">7. Listing removal</h2>
      <p>
        Sellers may request removal or unpublish via {config.supportEmail}. Cladak may remove listings
        that fail verification integrity or violate these Terms.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">8. Governing law</h2>
      <p>
        These Terms are governed by the laws of <strong>{config.governingLaw}</strong>. Courts of that
        jurisdiction have exclusive venue, unless mandatory consumer law requires otherwise. Have
        counsel confirm entity details before launch.
      </p>
      <p className="text-xs text-coal-mute">Last updated: 2026-09-18 · Not legal advice.</p>
    </LegalShell>
  );
}
