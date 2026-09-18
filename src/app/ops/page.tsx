import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import OpsControls from '@/components/OpsControls';
import { stripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export default async function OpsPage() {
  const { user } = await requireUser(['ADMIN', 'COFOUNDER']);
  if (!user) redirect('/login');

  const [
    pending,
    queuedLeads,
    inquiries,
    rights,
    outbox,
    fees,
    escrow,
    config,
  ] = await Promise.all([
    prisma.listing.findMany({
      where: { verificationStatus: { notIn: ['VERIFIED', 'REJECTED'] } },
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
      where: { status: { in: ['NEW', 'REVIEWING'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.dataRightsRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.emailOutbox.findMany({ orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.feeLedger.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.escrowCase.findMany({
      where: { status: { notIn: ['RELEASED', 'CANCELLED'] } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.platformConfig.findUnique({ where: { id: 'default' } }),
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
          Evidence verify, intros, intake, data-rights, email outbox, anonymous fees, partner
          escrow. Automation runs without you; this desk is for exceptions.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Stripe" value={stripeConfigured() ? 'Live keys' : 'Demo mode'} />
          <Stat
            label="Email"
            value={process.env.RESEND_API_KEY ? 'Resend' : 'Local outbox'}
          />
          <Stat label="Fee receipts" value={String(fees.length)} />
          <Stat
            label="Auto-intro"
            value={config?.autoIntroduceLeads ? 'On' : 'Off'}
          />
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Verification queue</h2>
          <div className="mt-4 space-y-3">
            {pending.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">
                No pending listings.
              </p>
            )}
            {pending.map((l) => (
              <div key={l.id} className="border border-coal/12 p-4">
                <p className="font-display text-xl font-bold">{l.title}</p>
                <p className="mt-1 font-mono text-[11px] text-coal-mute">
                  {l.verificationStatus} · sworn={String(l.swornEvidence)}
                </p>
                <p className="mt-2 font-mono text-[10px] text-coal-soft" dir="ltr">
                  rev: {l.evidenceRevenueUrl || '—'}
                  <br />
                  prod: {l.evidenceProductUrl || '—'}
                </p>
                {l.evidenceNotes && (
                  <p className="mt-2 text-xs text-coal-soft">{l.evidenceNotes}</p>
                )}
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
                  {q.name} · {q.email} · MRR {q.mrr || '—'} · {q.status}
                </p>
                <OpsControls kind="intake" id={q.id} />
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">No open intake.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Partner escrow</h2>
          <div className="mt-4 space-y-3">
            {escrow.map((e) => (
              <div key={e.id} className="border border-coal/12 p-4">
                <p className="font-display text-lg font-bold">
                  £{e.amountGbp} · {e.status}
                </p>
                <p className="mt-1 font-mono text-[11px] text-coal-mute" dir="ltr">
                  {e.partnerName} · {e.id}
                </p>
                <OpsControls kind="escrow" id={e.id} />
              </div>
            ))}
            {escrow.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">No open escrow cases.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Data rights</h2>
          <div className="mt-4 space-y-3">
            {rights.map((r) => (
              <div key={r.id} className="border border-coal/12 p-4">
                <p className="font-display text-lg font-bold">
                  {r.requestType} · {r.fullName}
                </p>
                <p className="mt-1 text-sm text-coal-soft">{r.email}</p>
                <OpsControls kind="rights" id={r.id} />
              </div>
            ))}
            {rights.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">No requests.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Email outbox</h2>
          <div className="mt-4 space-y-2">
            {outbox.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-baseline justify-between gap-2 border border-coal/10 px-3 py-2 text-xs"
              >
                <span className="font-mono text-coal-mute">{m.template}</span>
                <span dir="ltr">{m.toEmail}</span>
                <span className="text-coal-soft">{m.status}</span>
              </div>
            ))}
            {outbox.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">Empty.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Anonymous fee ledger</h2>
          <div className="mt-4 space-y-2">
            {fees.map((f) => (
              <div
                key={f.id}
                className="flex flex-wrap items-baseline justify-between gap-2 border border-coal/10 px-3 py-2 text-xs"
                dir="ltr"
              >
                <span>£{f.amountGbp}</span>
                <span className="text-coal-mute">{f.paymentRef || '—'}</span>
                <span className="text-coal-soft">{f.createdAt.toISOString().slice(0, 10)}</span>
              </div>
            ))}
            {fees.length === 0 && (
              <p className="border border-coal/12 p-4 text-sm text-coal-mute">No fees yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-coal/12 bg-stone-soft p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-coal-mute">{label}</p>
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
    </div>
  );
}
