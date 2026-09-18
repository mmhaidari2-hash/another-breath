import { z } from 'zod';

export const leadFormSchema = z.object({
  listingId: z.string().min(1),
  buyerName: z.string().trim().min(2, 'نام خیلی کوتاهه').max(100),
  buyerEmail: z.string().trim().email('ایمیل معتبر نیست'),
  budget: z.coerce.number().min(0).optional(),
  timeline: z.enum(['Immediately', '1-3 months', '3-6 months', '6+ months']).optional(),
  message: z.string().trim().max(2000).optional(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;
