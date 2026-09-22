/** Integer GBP pence helpers — never use Float for money persistence. */

export function gbpToPence(gbp: number): number {
  if (!Number.isFinite(gbp)) throw new Error('Invalid GBP amount');
  return Math.round(gbp * 100);
}

export function penceToGbp(pence: number): number {
  return pence / 100;
}

/** Format integer pence as £X,XXX.XX */
export function formatPence(pence: number | null | undefined): string {
  if (pence == null || !Number.isFinite(pence)) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(pence / 100);
}

/** Fee percent (e.g. 3) → basis points (300) */
export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}

export function bpsToPercent(bps: number): number {
  return bps / 100;
}

/** Fee in pence: closePricePence * feeBps / 10000 */
export function feePenceFromClose(closePricePence: number, feeBps: number): number {
  if (!Number.isInteger(closePricePence) || !Number.isInteger(feeBps)) {
    throw new Error('feePenceFromClose requires integer pence and bps');
  }
  return Math.round((closePricePence * feeBps) / 10_000);
}

/** Parse user GBP string/number → pence (rejects >2dp) */
export function parseGbpToPence(raw: string | number): number {
  const n = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n) || n < 0) return 0;
  if (Math.abs(n * 100 - Math.round(n * 100)) > 1e-6) {
    throw new Error('Amount must have at most 2 decimal places');
  }
  return Math.round(n * 100);
}
