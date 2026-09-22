import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatPence } from '@/lib/money';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Format integer GBP pence as currency (en-GB). */
export function formatCurrency(pence: number, _currency: string = 'GBP', _locale = 'en-GB') {
  return formatPence(pence);
}

export function formatDate(date: Date | string, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date));
}

export type MrrPoint = { month: string; mrrPence: number };
export type GalleryFrame = { label: string; tone: string };

export type ListingDTO = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline: string | null;
  niche: string | null;
  techStack: string | null;
  foundedYear: number | null;
  featured: boolean;
  askingPricePence: number;
  mrrPence: number | null;
  multiple: number | null;
  grade: string | null;
  score: number | null;
  verificationStatus: string;
  verificationNotes: string | null;
  websiteUrl: string | null;
  verifiedAt: Date | string | null;
  createdAt: Date | string;
  businessModel?: string | null;
  customersApprox?: number | null;
  reasonForSale?: string | null;
  demoPolicy?: string | null;
  evidenceRevenue?: boolean;
  evidenceProduct?: boolean;
  evidenceUi?: boolean;
  highlights?: string[];
  gallery?: GalleryFrame[];
  mrrHistory?: MrrPoint[];
};

export function parseListing(l: {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline: string | null;
  niche: string | null;
  techStack: string | null;
  foundedYear: number | null;
  featured: boolean;
  askingPricePence: number;
  mrrPence: number | null;
  multiple: number | null;
  grade: string | null;
  score: number | null;
  verificationStatus: string;
  verificationNotes: string | null;
  websiteUrl: string | null;
  verifiedAt: Date | string | null;
  createdAt: Date | string;
  businessModel?: string | null;
  customersApprox?: number | null;
  reasonForSale?: string | null;
  demoPolicy?: string | null;
  evidenceRevenue?: boolean;
  evidenceProduct?: boolean;
  evidenceUi?: boolean;
  highlights?: string | null;
  gallery?: string | null;
  mrrHistory?: string | null;
}): ListingDTO {
  const safe = <T,>(raw: string | null | undefined, fallback: T): T => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  // Support legacy seed JSON `{ month, mrr }` (GBP) by detecting and converting
  const rawHistory = safe<Array<{ month: string; mrrPence?: number; mrr?: number }>>(
    l.mrrHistory,
    []
  );
  const mrrHistory: MrrPoint[] = rawHistory.map((p) => ({
    month: p.month,
    mrrPence:
      typeof p.mrrPence === 'number'
        ? p.mrrPence
        : typeof p.mrr === 'number'
          ? Math.round(p.mrr * 100)
          : 0,
  }));

  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    description: l.description,
    tagline: l.tagline,
    niche: l.niche,
    techStack: l.techStack,
    foundedYear: l.foundedYear,
    featured: l.featured,
    askingPricePence: l.askingPricePence,
    mrrPence: l.mrrPence,
    multiple: l.multiple,
    grade: l.grade,
    score: l.score,
    verificationStatus: l.verificationStatus,
    verificationNotes: l.verificationNotes,
    websiteUrl: l.websiteUrl,
    verifiedAt: l.verifiedAt,
    createdAt: l.createdAt,
    businessModel: l.businessModel ?? null,
    customersApprox: l.customersApprox ?? null,
    reasonForSale: l.reasonForSale ?? null,
    demoPolicy: l.demoPolicy ?? 'INTRO_ONLY',
    evidenceRevenue: l.evidenceRevenue ?? false,
    evidenceProduct: l.evidenceProduct ?? false,
    evidenceUi: l.evidenceUi ?? false,
    highlights: safe<string[]>(l.highlights, []),
    gallery: safe<GalleryFrame[]>(l.gallery, []),
    mrrHistory,
  };
}
