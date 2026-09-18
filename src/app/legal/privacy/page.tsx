import LegalShell from '@/components/LegalShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const config = await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

  return (
    <LegalShell title="Privacy Policy">
      <p>
        We collect only what Phase 1 needs: Lead and Seller Inquiry fields, agreement acceptances,
        hashed IP for abuse prevention, and audit metadata.
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Data we store</h2>
      <ul className="list-disc ps-5">
        <li>Buyer name/email/message on Leads</li>
        <li>Seller inquiry details</li>
        <li>SHA-256 hashed IP + user-agent (not raw IP in logs)</li>
        <li>Audit events for security review</li>
        <li>Data-rights requests (access / delete / correct)</li>
      </ul>
      <h2 className="font-display text-xl font-bold text-coal">What we do not do</h2>
      <p>We do not sell personal data. We do not run third-party ad trackers in Phase 1.</p>
      <h2 className="font-display text-xl font-bold text-coal">Your rights</h2>
      <p>
        Request access, correction, or deletion via the{' '}
        <a href="/legal/data-request" className="text-signal underline">
          Data Rights form
        </a>{' '}
        or {config.supportEmail}. We respond within a reasonable period. Authenticated self-serve
        GDPR tooling arrives with accounts (Phase 2).
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Security</h2>
      <p>
        Transport security headers, input validation (Zod), rate limits, and least-data API responses.
        Authentication/SSO is Phase 2. Production requires a unique AUDIT_SALT.
      </p>
      <p className="text-xs text-coal-mute">Last updated: 2026-09-18</p>
    </LegalShell>
  );
}
