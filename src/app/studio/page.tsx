import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { formatCurrency } from '@/lib/utils';
import StudioActions from '@/components/StudioActions';
import CloseLeadButton from '@/components/CloseLeadButton';

export const dynamic = 'force-dynamic';

export default async function StudioPage() {
  const { user } = await requireUser();
  if (!user) redirect('/login');

  const isOperator = ['SELLER', 'ADMIN', 'COFOUNDER'].includes(user.role);

  const listings = await prisma.listing.findMany({
    where: isOperator
      ? user.role === 'SELLER'
        ? { sellerId: user.id }
        : {}
      : { sellerId: user.id },
    include: {
      leads: { orderBy: { createdAt: 'desc' }, take: 20 },
      _count: { select: { leads: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const inquiries = isOperator
    ? await prisma.sellerInquiry.findMany({
        where: user.role === 'SELLER' ? { email: user.email } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 30,
      })
    : await prisma.sellerInquiry.findMany({
        where: { email: user.email },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

  const myLeads = await prisma.lead.findMany({
    where: { buyerEmail: user.email },
    include: { listing: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const pendingCount = listings.filter((l) => l.verificationStatus !== 'VERIFIED').length;

  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Studio</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight">{user.name}</h1>
            <p className="mt-2 text-sm text-coal-soft">
              {user.email} · {user.role}
              {isOperator && pendingCount > 0
                ? ` · ${pendingCount} asset(s) awaiting verification`
                : ''}
            </p>
          </div>
          <StudioActions />
        </div>

        {isOperator && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Your listings</h2>
            <div className="mt-4 divide-y divide-coal/10 border border-coal/12">
              {listings.length === 0 && (
                <p className="p-5 text-sm text-coal-mute">
                  No listings yet. Submit via Sell — assets enter as PENDING until Ops verifies.
                </p>
              )}
              {listings.map((l) => (
                <div key={l.id} className="grid gap-3 px-5 py-4 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-5">
                    {l.verificationStatus === 'VERIFIED' ? (
                      <Link
                        href={`/listing/${l.slug}`}
                        className="font-display text-xl font-bold hover:text-signal"
                      >
                        {l.title}
                      </Link>
                    ) : (
                      <p className="font-display text-xl font-bold">{l.title}</p>
                    )}
                    <p className="mt-1 font-mono text-[11px] text-coal-mute">
                      {l.verificationStatus} · {l.grade ?? '—'} · leads {l._count.leads}
                    </p>
                  </div>
                  <div className="sm:col-span-3 text-sm text-coal-soft">
                    {formatCurrency(l.askingPrice)}
                    {l.mrr != null && (
                      <span className="text-coal-mute"> · MRR {formatCurrency(l.mrr)}</span>
                    )}
                  </div>
                  <div className="sm:col-span-4 space-y-1 text-xs text-coal-soft">
                    {l.leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-signal">{lead.status}</span>
                        <span>
                          {lead.buyerName} · {lead.buyerEmail}
                        </span>
                        {lead.status === 'INTRODUCED' && <CloseLeadButton leadId={lead.id} />}
                      </div>
                    ))}
                    {l.leads.length === 0 && <p className="text-coal-mute">No inbound leads yet</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Your buyer intros</h2>
          <div className="mt-4 divide-y divide-coal/10 border border-coal/12">
            {myLeads.length === 0 && (
              <p className="p-5 text-sm text-coal-mute">No intro requests under this email yet.</p>
            )}
            {myLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <Link
                    href={`/listing/${lead.listing.slug}`}
                    className="font-display text-lg font-bold hover:text-signal"
                  >
                    {lead.listing.title}
                  </Link>
                  <p className="mt-1 text-xs text-coal-mute">
                    {new Date(lead.createdAt).toLocaleDateString('en-GB')} · status{' '}
                    <span className="text-signal">{lead.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {lead.status === 'INTRODUCED' && <CloseLeadButton leadId={lead.id} />}
                  <Link href="/closing" className="text-xs text-signal underline">
                    Closing protocol →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isOperator && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Sell intake</h2>
            <div className="mt-4 divide-y divide-coal/10 border border-coal/12">
              {inquiries.map((q) => (
                <div key={q.id} className="px-5 py-4 text-sm">
                  <p className="font-display text-lg font-bold">{q.product}</p>
                  <p className="mt-1 text-coal-soft">
                    {q.name} · {q.email} · <span className="font-mono text-signal">{q.status}</span>
                  </p>
                </div>
              ))}
              {inquiries.length === 0 && (
                <p className="p-5 text-sm text-coal-mute">No seller inquiries.</p>
              )}
            </div>
            {(user.role === 'ADMIN' || user.role === 'COFOUNDER') && (
              <Link href="/ops" className="mt-4 inline-block text-sm text-signal underline">
                Open ops desk →
              </Link>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
