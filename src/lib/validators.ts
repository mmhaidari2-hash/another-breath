import { z } from 'zod';

export const leadFormSchema = z.object({
  listingId: z.string().min(1),
  buyerName: z
    .string()
    .trim()
    .min(2, 'Name too short / نام خیلی کوتاهه')
    .max(100),
  buyerEmail: z.string().trim().email('Invalid email / ایمیل معتبر نیست'),
  budget: z.coerce.number().min(0).optional(),
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

export const sellerInquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  product: z.string().trim().min(2).max(120),
  mrr: z.string().trim().max(40).optional(),
  url: z.string().trim().max(300).optional(),
  niche: z.string().trim().max(80).optional(),
  askingPrice: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
  // Diligence evidence pack
  evidenceRevenueUrl: z.union([z.string().trim().url().max(500), z.literal('')]).optional(),
  evidenceProductUrl: z.union([z.string().trim().url().max(500), z.literal('')]).optional(),
  evidenceNotes: z.string().trim().max(2000).optional(),
  evidenceUiAttested: z.boolean().optional(),
  swornEvidence: z.boolean().optional(),
  acceptedSellerTerms: z.literal(true),
  acceptedNonCircumvention: z.literal(true),
});

export const dataRightsSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  requestType: z.enum(['ACCESS', 'DELETE', 'CORRECT']),
  details: z.string().trim().max(2000).optional(),
});
