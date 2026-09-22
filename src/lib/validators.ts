import { z } from 'zod';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

/** Always blocked in every environment (reserved / fake hosts) */
const ALWAYS_BLOCKED_HOST_RE =
  /^(example\.(com|org|net)|test\.com|(placeholder|fake|invalid|localtest)\.)/i;

/** Loopback / local / staging — allowed ONLY when NODE_ENV === 'development' */
const DEV_ONLY_HOST_RE =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|::1|.*\.local|.*\.localhost|.*\.internal|staging\..*|.*\.staging\..*)$/i;

function hostAllowed(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (ALWAYS_BLOCKED_HOST_RE.test(host)) return false;
  if (DEV_ONLY_HOST_RE.test(host) || DEV_ONLY_HOST_RE.test(hostname.toLowerCase())) {
    return isDev;
  }
  return true;
}

export const httpsUrlSchema = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .max(500)
  .refine((u) => {
    try {
      const parsed = new URL(u);
      if (isProd || !isDev) {
        // production (and any non-development env): HTTPS only
        return parsed.protocol === 'https:';
      }
      // development: allow http only for loopback / local hosts
      if (parsed.protocol === 'https:') return true;
      if (parsed.protocol === 'http:' && DEV_ONLY_HOST_RE.test(parsed.hostname)) return true;
      return false;
    } catch {
      return false;
    }
  }, isDev
    ? 'URL must be https (or http://localhost in development)'
    : 'Evidence URLs must use HTTPS')
  .refine((u) => {
    try {
      return hostAllowed(new URL(u).hostname);
    } catch {
      return false;
    }
  }, isDev
    ? 'Evidence URL host not allowed (no example.com/fake hosts)'
    : 'Evidence URL host not allowed in production (no localhost/example/fake/staging hosts)');

export const optionalHttpsUrlSchema = z.union([httpsUrlSchema, z.literal('')]).optional();

/** Accept GBP major units from forms → callers convert to pence via gbpToPence */
export const gbpAmountSchema = z.coerce
  .number({ invalid_type_error: 'Amount must be a number' })
  .positive('Amount must be positive')
  .max(50_000_000, 'Amount too large')
  .refine((n) => Number.isFinite(n), 'Invalid amount')
  .refine((n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6, {
    message: 'Amount must have at most 2 decimal places',
  });

/** Integer pence amounts (API-native) */
export const penceAmountSchema = z.coerce
  .number()
  .int('Amount must be integer pence')
  .positive('Amount must be positive')
  .max(5_000_000_000_000, 'Amount too large');

export const leadFormSchema = z.object({
  listingId: z.string().trim().min(1).max(64),
  buyerName: z.string().trim().min(2).max(100),
  buyerEmail: z.string().trim().email().max(200),
  /** GBP major units from form; converted to budgetPence in route */
  budget: z.coerce.number().min(0).max(50_000_000).optional(),
  timeline: z.enum(['Immediately', '1-3 months', '3-6 months', '6+ months']).optional(),
  message: z.string().trim().max(2000).optional(),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'Terms required' }),
  }),
  acceptedNonCircumvention: z.literal(true, {
    errorMap: () => ({ message: 'Non-circumvention required' }),
  }),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export const sellerInquirySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    product: z.string().trim().min(2).max(120),
    mrr: z.string().trim().max(40).optional(),
    url: z.union([z.string().trim().url().max(300), z.literal('')]).optional(),
    niche: z.string().trim().max(80).optional(),
    askingPrice: z.string().trim().max(40).optional(),
    notes: z.string().trim().max(2000).optional(),
    evidenceRevenueUrl: optionalHttpsUrlSchema,
    evidenceProductUrl: optionalHttpsUrlSchema,
    evidenceNotes: z.string().trim().max(2000).optional(),
    evidenceUiAttested: z.boolean().optional(),
    swornEvidence: z.boolean().optional(),
    acceptedSellerTerms: z.literal(true),
    acceptedNonCircumvention: z.literal(true),
  })
  .superRefine((data, ctx) => {
    if (data.swornEvidence || data.evidenceUiAttested) {
      if (!data.evidenceRevenueUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['evidenceRevenueUrl'],
          message: 'Revenue proof HTTPS URL required with sworn evidence',
        });
      }
      if (!data.evidenceProductUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['evidenceProductUrl'],
          message: 'Live product HTTPS URL required with sworn evidence',
        });
      }
    }
  });

export const dataRightsSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  requestType: z.enum(['ACCESS', 'DELETE', 'CORRECT']),
  details: z.string().trim().max(2000).optional(),
});

/** Forms send GBP; routes convert to pence before persistence / settlement */
export const checkoutSchema = z.object({
  leadId: z.string().trim().min(1).max(64),
  closePriceGbp: gbpAmountSchema,
});

export const dealCompleteSchema = z.object({
  leadId: z.string().trim().min(1).max(64),
  closePriceGbp: gbpAmountSchema,
  paymentRef: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-zA-Z0-9_\-:.=]+$/, 'Invalid payment reference characters'),
  secret: z.string().max(200).optional(),
});

export const escrowSchema = z.object({
  leadId: z.string().trim().min(1).max(64),
  amountGbp: gbpAmountSchema,
  notes: z.string().trim().max(1000).optional(),
});

export const authSchema = z.object({
  mode: z.enum(['login', 'register']),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(100),
  name: z.string().trim().min(2).max(100).optional(),
  role: z.enum(['BUYER', 'SELLER']).optional(),
});

export { isProd as isProductionEnv, isDev as isDevelopmentEnv };
