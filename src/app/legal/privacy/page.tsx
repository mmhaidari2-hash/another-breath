import LegalShell from '@/components/LegalShell';

export default function PrivacyPage() {
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
      </ul>
      <h2 className="font-display text-xl font-bold text-coal">What we do not do</h2>
      <p>We do not sell personal data. We do not run third-party ad trackers in Phase 1.</p>
      <h2 className="font-display text-xl font-bold text-coal">Your rights</h2>
      <p>
        Request access or deletion via support@cladak.local. We respond within a reasonable period.
        Full GDPR tooling arrives with authenticated accounts (Phase 2).
      </p>
      <h2 className="font-display text-xl font-bold text-coal">Security</h2>
      <p>
        Transport security headers, input validation (Zod), rate limits, and least-data API responses.
        Authentication/SSO is Phase 2.
      </p>
      <p className="text-xs text-coal-mute">Last updated: 2026-09-18</p>
    </LegalShell>
  );
}
