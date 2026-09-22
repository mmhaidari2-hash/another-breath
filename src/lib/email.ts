import { prisma } from '@/lib/db';

type SendInput = {
  to: string;
  subject: string;
  body: string;
  template: string;
  meta?: Record<string, unknown>;
};

/**
 * Automated outbound mail.
 * - Always writes EmailOutbox (audit of what the system tried to send)
 * - If RESEND_API_KEY is set, delivers via Resend
 * - Otherwise marks SENT in local/demo mode so automation still completes without ops
 */
export async function sendTransactional(input: SendInput) {
  const row = await prisma.emailOutbox.create({
    data: {
      toEmail: input.to.toLowerCase(),
      subject: input.subject,
      bodyText: input.body,
      template: input.template,
      status: 'QUEUED',
      meta: input.meta ? JSON.stringify(input.meta) : null,
    },
  });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Cladak <ops@cladak.com>';

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          subject: input.subject,
          text: input.body,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        await prisma.emailOutbox.update({
          where: { id: row.id },
          data: { status: 'FAILED', error: err.slice(0, 500) },
        });
        return { id: row.id, status: 'FAILED' as const };
      }
      await prisma.emailOutbox.update({
        where: { id: row.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
      return { id: row.id, status: 'SENT' as const };
    } catch (e: unknown) {
      await prisma.emailOutbox.update({
        where: { id: row.id },
        data: {
          status: 'FAILED',
          error: e instanceof Error ? e.message : 'send failed',
        },
      });
      return { id: row.id, status: 'FAILED' as const };
    }
  }

  // No provider key: complete the automation loop locally (outbox = source of truth)
  await prisma.emailOutbox.update({
    where: { id: row.id },
    data: { status: 'SENT', sentAt: new Date(), error: 'local_outbox_no_resend_key' },
  });
  return { id: row.id, status: 'SENT' as const, local: true };
}

export async function notifyIntro(input: {
  buyerEmail: string;
  buyerName: string;
  sellerEmail: string;
  listingTitle: string;
  leadId: string;
}) {
  await sendTransactional({
    to: input.buyerEmail,
    subject: `Cladak intro opened — ${input.listingTitle}`,
    template: 'LEAD_INTRODUCED_BUYER',
    meta: { leadId: input.leadId },
    body: [
      `Hi ${input.buyerName},`,
      '',
      `Your intro for "${input.listingTitle}" is open.`,
      'Seller contact is mediated by Cladak. Do not take the deal off-platform.',
      `Lead ref: ${input.leadId}`,
      '',
      'Next: diligence → commercial terms → success fee → accounts purge.',
      '— Cladak (England & Wales)',
    ].join('\n'),
  });

  await sendTransactional({
    to: input.sellerEmail,
    subject: `Buyer intro — ${input.listingTitle}`,
    template: 'LEAD_INTRODUCED_SELLER',
    meta: { leadId: input.leadId },
    body: [
      `A qualified buyer was introduced for "${input.listingTitle}".`,
      `Lead ref: ${input.leadId}`,
      'Reply only through the Cladak closing path. Success fee applies on close.',
      '— Cladak Ops',
    ].join('\n'),
  });
}

function formatGbpFromPence(pence: number): string {
  return (pence / 100).toFixed(2);
}

export async function notifyFeeDue(input: {
  buyerEmail: string;
  listingTitle: string;
  leadId: string;
  amountPence: number;
  checkoutUrl?: string;
}) {
  const amountLabel = formatGbpFromPence(input.amountPence);
  await sendTransactional({
    to: input.buyerEmail,
    subject: `Success fee due — £${amountLabel} — ${input.listingTitle}`,
    template: 'FEE_DUE',
    meta: { leadId: input.leadId, amountPence: input.amountPence },
    body: [
      `Success fee for "${input.listingTitle}" is £${amountLabel}.`,
      input.checkoutUrl
        ? `Pay securely: ${input.checkoutUrl}`
        : 'Open your Cladak intro confirmation to pay with Stripe.',
      `Lead ref: ${input.leadId}`,
      'After payment, buyer and seller accounts are purged automatically.',
      '— Cladak',
    ].join('\n'),
  });
}

export async function notifyEscrowRequested(input: {
  buyerEmail: string;
  sellerEmail: string;
  partnerName: string;
  partnerUrl: string;
  amountPence: number;
  caseId: string;
}) {
  const amountLabel = formatGbpFromPence(input.amountPence);
  const body = [
    `Escrow case ${input.caseId} requested for £${amountLabel}.`,
    `Partner: ${input.partnerName}`,
    input.partnerUrl ? `Start: ${input.partnerUrl}` : '',
    'Cladak does not hold funds. The licensed partner does.',
    '— Cladak Closing Desk',
  ]
    .filter(Boolean)
    .join('\n');

  await sendTransactional({
    to: input.buyerEmail,
    subject: `Escrow requested — £${amountLabel}`,
    template: 'ESCROW_REQUESTED',
    meta: { caseId: input.caseId, amountPence: input.amountPence },
    body,
  });
  await sendTransactional({
    to: input.sellerEmail,
    subject: `Escrow requested — £${amountLabel}`,
    template: 'ESCROW_REQUESTED',
    meta: { caseId: input.caseId, amountPence: input.amountPence },
    body,
  });
}

export async function notifyDealPurged(input: {
  amountPence: number;
  paymentRef: string;
  supportEmail: string;
}) {
  const amountLabel = formatGbpFromPence(input.amountPence);
  await sendTransactional({
    to: input.supportEmail,
    subject: `Fee booked anonymously — £${amountLabel}`,
    template: 'DEAL_PURGED_OPS',
    meta: { paymentRef: input.paymentRef, amountPence: input.amountPence },
    body: [
      `Anonymous FeeLedger entry booked: £${amountLabel} (${input.amountPence} pence).`,
      `Payment ref hash path: ${input.paymentRef}`,
      'Buyer/seller accounts and listing PII purged.',
      '— Cladak automation',
    ].join('\n'),
  });
}
