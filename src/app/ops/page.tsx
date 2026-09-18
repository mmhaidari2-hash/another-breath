import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import OpsControls from '@/components/OpsControls';

export const dynamic = 'force-dynamic';

export default async function OpsPage() {
  const { user } = await requireUser(['ADMIN', 'COFOUNDER']);
  if (!user) redirect('/login');

  const [pending, queuedLeads, inquiries] = await Promise.all([
    prisma.listing.findMany({
      where: { verificationStatus: { not: 'VERIFIED' } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.lead.findMany({
      where: { status: 'QUEUED' },
      include: { listing: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.sellerInquiry.findMany({
      where: { status: 'NEW' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <Link href="/studio" className="text-sm text-coal-mute hover:text-coal">
          Studio
        </Link>
        <p className="eyebrow mt-8">Operations</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight">Ops desk</h1>
        <p className="mt-3 max-w-2xl text-sm text-coal-soft">
          Manual verification queue, intro mediation, and sell intake. Stripe/GA auto-ingest remains
          Phase 2 — this desk is the honest Phase-1 control plane.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Verification queue</h2>
          <div className="mt-4 space-y-3">
            {pending.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">
                No pending listings. All public assets are VERIFIED.
              </p>
            )}
            {pending.map((l) => (
              <div key={l.id} className="border border-coal/12 p-4">
                <p className="font-display text-xl font-bold">{l.title}</p>
                <p className="mt-1 font-mono text-[11px] text-coal-mute">{l.verificationStatus}</p>
                <OpsControls kind="verify" id={l.id} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Intro queue</h2>
          <div className="mt-4 space-y-3">
            {queuedLeads.map((lead) => (
              <div key={lead.id} className="border border-coal/12 p-4">
                <p className="font-display text-lg font-bold">
                  {lead.listing.title} ← {lead.buyerName}
                </p>
                <p className="mt-1 text-sm text-coal-soft">{lead.buyerEmail}</p>
                <OpsControls kind="introduce" id={lead.id} />
              </div>
            ))}
            {queuedLeads.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">No queued intros.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Sell intake</h2>
          <div className="mt-4 space-y-3">
            {inquiries.map((q) => (
              <div key={q.id} className="border border-coal/12 p-4">
                <p className="font-display text-lg font-bold">{q.product}</p>
                <p className="mt-1 text-sm text-coal-soft">
                  {q.name} · {q.email} · MRR {q.mrr || '—'}
                </p>
                <OpsControls kind="intake" id={q.id} />
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">No new intake.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
