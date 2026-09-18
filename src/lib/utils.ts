import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'GBP', locale = 'en-GB') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string, locale = 'fa-IR') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date));
}

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
  askingPrice: number;
  mrr: number | null;
  multiple: number | null;
  grade: string | null;
  score: number | null;
  verificationStatus: string;
  verificationNotes: string | null;
  websiteUrl: string | null;
  verifiedAt: Date | string | null;
  createdAt: Date | string;
};
