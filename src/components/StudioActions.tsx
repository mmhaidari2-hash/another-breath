'use client';

import { useRouter } from 'next/navigation';

export default function StudioActions() {
  const router = useRouter();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="btn-ghost !px-4 !py-2 text-sm"
        onClick={async () => {
          await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'logout' }),
          });
          router.push('/');
          router.refresh();
        }}
      >
        Sign out
      </button>
      <a href="/sell" className="btn-primary !px-4 !py-2 text-sm">
        Submit asset
      </a>
    </div>
  );
}
