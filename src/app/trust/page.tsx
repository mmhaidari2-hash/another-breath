import Link from 'next/link';
import { prisma } from '@/lib/db';
import TrustDesk from '@/components/TrustDesk';

export const dynamic = 'force-dynamic';

export default async function TrustPage() {
  const verified = await prisma.listing.count({
    where: { verificationStatus: 'VERIFIED' },
  });

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-coal-mute hover:text-coal">
          Home
        </Link>
        <TrustDesk verified={verified} />
      </div>
    </main>
  );
}
