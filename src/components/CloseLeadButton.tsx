'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CloseLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className="border border-coal/20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider hover:border-signal hover:text-signal"
      onClick={async () => {
        setLoading(true);
        await fetch('/api/leads/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId }),
        });
        setLoading(false);
        router.refresh();
      }}
    >
      {loading ? '…' : 'Report closed'}
    </button>
  );
}
