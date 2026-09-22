import { z } from 'zod';

/** Reject obviously fake / non-public evidence hosts */
const BLOCKED_HOST_RE =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|example\.com|example\.org|test\.com|placeholder\.|fake\.|ngrok\.|localtest\.)/i;

export const httpsUrlSchema = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .max(500)
  .refine((u) => /^https:\/\//i.test(u), 'Evidence URLs must use HTTPS')
  .refine((u) => {
    try {
      const host = new URL(u).hostname;
      return !BLOCKED_HOST_RE.test(host);
    } catch {
      return false;
    }
  }, 'Evidence URL host not allowed (no localhost/example/fake hosts)');

export const optionalHttpsUrlSchema = z.union([httpsUrlSchema, z.literal('')]).optional();

/** GBP amounts — coerce, positive, capped, max 2dp */
export const gbpAmountSchema = z.coerce
  .number({ invalid_type_error: 'Amount must be a number' })
  .positive('Amount must be positive')
  .max(50_000_000, 'Amount too large')
  .refine((n) => Number.isFinite(n), 'Invalid amount')
  .refine((n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6, {
    message: 'Amount must have at most 2 decimal places',
  });

export const leadFormSchema = z.object({
  listingId: z.string().trim().min(1).max(64),
  buyerName: z
    .string()
    .trim()
    .min(2, 'Name too short / نام خیلی کوتاهه')
    .max(100),
  buyerEmail: z.string().trim().email('Invalid email / ایمیل معتبر نیست').max(200),
  budget: z.coerce.number().min(0).max(50_000_000).optional(),
  timeline: z.enum(['Immediately', '1-3 months', '3-6 months', '6+ months']).optional(),
  message: z.string().trim().max(2000).optional(),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'Terms required / قبول شرایط الزامی است' }),
  }),
  acceptedNonCircumvention: z.literal(true, {
    errorMap: () => ({
      message: 'Non-circumvention required / قبول منع دورزدن پلتفرم الزامی است',
    }),
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
    // If seller claims sworn pack, require real HTTPS evidence URLs
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
