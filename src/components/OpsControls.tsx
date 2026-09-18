'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OpsControls({
  kind,
  id,
}: {
  kind: 'verify' | 'introduce' | 'intake' | 'rights' | 'escrow';
  id: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {kind === 'verify' && (
        <>
          <button
            type="button"
            disabled={loading}
            className="btn-primary !px-3 !py-1.5 text-xs"
            onClick={() => run('VERIFY')}
          >
            Mark verified
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => run('REJECT')}
          >
            Reject
          </button>
        </>
      )}
      {kind === 'introduce' && (
        <button
          type="button"
          disabled={loading}
          className="btn-primary !px-3 !py-1.5 text-xs"
          onClick={() => run('INTRODUCE')}
        >
          Mark introduced
        </button>
      )}
      {kind === 'intake' && (
        <>
          <button
            type="button"
            disabled={loading}
            className="btn-primary !px-3 !py-1.5 text-xs"
            onClick={() => run('ACCEPT')}
          >
            Accept
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => run('DECLINE')}
          >
            Decline
          </button>
        </>
      )}
      {kind === 'rights' && (
        <button
          type="button"
          disabled={loading}
          className="btn-primary !px-3 !py-1.5 text-xs"
          onClick={() => run('FULFILL')}
        >
          Fulfill
        </button>
      )}
      {kind === 'escrow' && (
        <>
          <button
            type="button"
            disabled={loading}
            className="btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => run('FUNDED')}
          >
            Funded
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn-primary !px-3 !py-1.5 text-xs"
            onClick={() => run('RELEASED')}
          >
            Released
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => run('CANCELLED')}
          >
            Cancel
          </button>
        </>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
