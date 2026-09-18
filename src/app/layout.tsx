import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'کلادک · CLADAK — خرید و فروش Micro-SaaS تأییدشده',
  description:
    'کلادک بازارچه‌ی تأییدشده برای خرید و فروش Micro-SaaS است. فقط لیستینگ‌هایی که دستی بررسی شده‌اند.',
  openGraph: {
    title: 'کلادک · CLADAK',
    description: 'بازارچه‌ی تأییدشده‌ی Micro-SaaS — بدون آمار جعلی، بدون بج نمایشی.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative overflow-x-hidden antialiased">
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
