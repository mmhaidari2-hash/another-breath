import LegalShell from '@/components/LegalShell';
import DataRightsForm from '@/components/DataRightsForm';

export default function DataRequestPage() {
  return (
    <LegalShell title="Data Rights Request">
      <p>
        Phase 1 intake for access, deletion, or correction of personal data stored in Leads,
        Seller Inquiries, and related audit metadata. Authenticated self-serve tooling is Phase 2.
      </p>
      <DataRightsForm />
    </LegalShell>
  );
}
