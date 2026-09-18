import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function history(base: number, months = 12) {
  const out: { month: string; mrr: number }[] = [];
  let v = Math.round(base * 0.58);
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(2026, 8, 1);
    d.setMonth(d.getMonth() - i);
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const step = 1.035 + ((base % 7) * 0.004);
    v = Math.round(v * step);
    if (i === 0) v = base;
    out.push({ month: label, mrr: v });
  }
  return out;
}

const LISTINGS = [
  {
    slug: 'seatline',
    title: 'Seatline',
    tagline: 'رزرو نوبت برای کلینیک‌های کوچک',
    niche: 'Scheduling',
    techStack: 'Laravel, Vue, MySQL',
    foundedYear: 2022,
    featured: true,
    businessModel: 'SaaS subscription',
    customersApprox: 48,
    reasonForSale: 'تمرکز بنیان‌گذار روی محصول بعدی؛ انتقال کامل با پشتیبانی ۳۰ روزه.',
    highlights: [
      'چند کلینیک فعال با پرداخت ماهانه',
      'یادآوری SMS و تقویم چندکاربره',
      'کدبیس قابل‌استقرار روی Railway',
    ],
    gallery: [
      { label: 'Dashboard', tone: '#0B0C0F' },
      { label: 'Booking', tone: '#1A2332' },
      { label: 'Calendar', tone: '#12241C' },
    ],
    description:
      'سیستم رزرو نوبت آنلاین برای کلینیک و سالن. تقویم چندکاربره، یادآوری SMS، صفحه عمومی برند، گزارش حضور.\n\nیکی از بالغ‌ترین دارایی‌های این مجموعه از نظر درآمد و ثبات. انتقال شامل ریپو، دامنه (در صورت توافق)، و یک جلسه تحویل.',
    websiteUrl: 'https://example.com/seatline',
    mrr: 890,
    askingPrice: 18500,
    grade: 'A',
    score: 88,
    verificationNotes:
      'بررسی دستی: درآمد ماهانه و تعداد کلینیک‌های فعال تأیید شد. MRR از فاکتور/داشبورد نمونه استخراج شد.',
  },
  {
    slug: 'parcelkit',
    title: 'ParcelKit',
    tagline: 'ردیابی مرسوله برای فروشگاه‌های کوچک',
    niche: 'E-commerce Ops',
    techStack: 'Node, React, PostgreSQL',
    foundedYear: 2023,
    featured: true,
    businessModel: 'SaaS + usage',
    customersApprox: 36,
    reasonForSale: 'بنیان‌گذار تمام‌وقت روی محصول دیگری است.',
    highlights: ['اتصال چند سرویس پستی', 'اعلان واتساپ/ایمیل', 'مشتریان واقعی در بازار فارسی'],
    gallery: [
      { label: 'Shipments', tone: '#101820' },
      { label: 'Tracking', tone: '#1C2430' },
      { label: 'Alerts', tone: '#142018' },
    ],
    description:
      'داشبورد و پلاگین ردیابی مرسوله برای فروشگاه‌های آنلاین کوچک. اتصال چند سرویس پستی، اعلان مشتری، صفحه وضعیت برند.',
    websiteUrl: 'https://example.com/parcelkit',
    mrr: 680,
    askingPrice: 14500,
    grade: 'A',
    score: 86,
    verificationNotes: 'بررسی دستی: لاگین دمو + نمونه‌ی تراکنش ماهانه.',
  },
  {
    slug: 'briefbay',
    title: 'BriefBay',
    tagline: 'جمع‌آوری بریف مشتری برای آژانس‌ها',
    niche: 'Agency Ops',
    techStack: 'Next.js, Postgres, Resend',
    foundedYear: 2022,
    featured: true,
    businessModel: 'SaaS subscription',
    customersApprox: 22,
    reasonForSale: 'خروج استراتژیک برای تمرکز روی consulting.',
    highlights: ['فرم بریف ساخت‌یافته', 'آرشیو پروژه', 'اعلان تیم'],
    gallery: [
      { label: 'Briefs', tone: '#12141A' },
      { label: 'Projects', tone: '#1A1E28' },
      { label: 'Team', tone: '#161C22' },
    ],
    description:
      'فرم بریف ساخت‌یافته، آرشیو پروژه، اعلان تیم. جایگزین پراکندگی ایمیل برای آژانس‌های ۲ تا ۱۵ نفره.',
    websiteUrl: 'https://example.com/briefbay',
    mrr: 610,
    askingPrice: 13200,
    grade: 'A',
    score: 84,
    verificationNotes: 'بررسی دستی: دمو + اسکرین درآمد ماهانه.',
  },
  {
    slug: 'fluxnote',
    title: 'FluxNote',
    tagline: 'یادداشت تیمی با همگام‌سازی آفلاین',
    niche: 'Productivity',
    techStack: 'Next.js, SQLite, Tailwind',
    foundedYear: 2024,
    featured: true,
    businessModel: 'SaaS subscription',
    customersApprox: 19,
    reasonForSale: 'زمان بنیان‌گذار محدود شده.',
    highlights: ['آفلاین-first', 'Markdown search', 'اشتراک لینک محدود'],
    gallery: [
      { label: 'Editor', tone: '#0E1218' },
      { label: 'Sync', tone: '#182028' },
      { label: 'Share', tone: '#101818' },
    ],
    description:
      'ابزار یادداشت تیمی برای استارتاپ‌های کوچک. همگام‌سازی آفلاین، اشتراک لینک محدود، جستجوی سریع markdown.',
    websiteUrl: 'https://example.com/fluxnote',
    mrr: 420,
    askingPrice: 9500,
    grade: 'B',
    score: 72,
    verificationNotes: 'بررسی دستی: اسکرین‌شات داشبورد درآمد و دمو محصول.',
  },
  {
    slug: 'inkledger',
    title: 'InkLedger',
    tagline: 'صورتحساب ساده برای فریلنسرها',
    niche: 'Finance',
    techStack: 'Rails, Hotwire, Postgres',
    foundedYear: 2023,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 41,
    reasonForSale: 'اولویت شخصی عوض شده.',
    highlights: ['فاکتور سریع', 'یادآوری خودکار', 'بدون پیچیدگی حسابداری'],
    gallery: [
      { label: 'Invoices', tone: '#141210' },
      { label: 'Payments', tone: '#1C1814' },
      { label: 'Reminders', tone: '#181410' },
    ],
    description: 'صدور فاکتور، پیگیری پرداخت، یادآوری خودکار برای فریلنسر تک‌نفره.',
    websiteUrl: 'https://example.com/inkledger',
    mrr: 540,
    askingPrice: 11000,
    grade: 'B',
    score: 74,
    verificationNotes: 'بررسی دستی: Stripe فقط‌خواندنی نمونه + UI.',
  },
  {
    slug: 'guestfolio',
    title: 'Guestfolio',
    tagline: 'پورتفولیوی مهمان برای اقامتگاه‌ها',
    niche: 'Hospitality',
    techStack: 'Next.js, Sanity, Stripe',
    foundedYear: 2023,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 27,
    reasonForSale: 'فروش برای نقدینگی روی پروژه بعدی.',
    highlights: ['صفحه برند اقامتگاه', 'ویرایش آسان', 'اشتراک ماهانه'],
    gallery: [
      { label: 'Guide', tone: '#101618' },
      { label: 'Editor', tone: '#161C20' },
      { label: 'Guest', tone: '#121A16' },
    ],
    description: 'صفحه راهنمای دیجیتال برای اقامتگاه و بوم‌گردی.',
    websiteUrl: 'https://example.com/guestfolio',
    mrr: 470,
    askingPrice: 9800,
    grade: 'B',
    score: 70,
    verificationNotes: 'بررسی دستی: چند صفحه زنده + درآمد اشتراک.',
  },
  {
    slug: 'routepulse',
    title: 'RoutePulse',
    tagline: 'مانیتورینگ آپتایم با هشدار تلگرام',
    niche: 'DevTools',
    techStack: 'Go, Redis, React',
    foundedYear: 2023,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 33,
    reasonForSale: 'نگهداری کم‌حجم است؛ فروش برای تمرکز روی infra دیگر.',
    highlights: ['هشدار تلگرام', 'چک API/وب', 'داشبورد ساده'],
    gallery: [
      { label: 'Monitors', tone: '#0C1418' },
      { label: 'Incidents', tone: '#141C22' },
      { label: 'Alerts', tone: '#101818' },
    ],
    description: 'چک آپتایم وب‌سایت و API با هشدار تلگرام/ایمیل.',
    websiteUrl: 'https://example.com/routepulse',
    mrr: 390,
    askingPrice: 8200,
    grade: 'B',
    score: 71,
    verificationNotes: 'بررسی دستی: مانیتورینگ زنده و لاگ هشدار نمونه.',
  },
  {
    slug: 'formora',
    title: 'Formora',
    tagline: 'فرم چندمرحله‌ای بدون کدنویسی',
    niche: 'Forms',
    techStack: 'Next.js, Prisma, Vercel',
    foundedYear: 2024,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 15,
    reasonForSale: 'رشد کندتر از هدف؛ فروش برای تمرکز روی B2B دیگر.',
    highlights: ['منطق شرطی', 'وب‌هوک', 'خروجی Sheets'],
    gallery: [
      { label: 'Builder', tone: '#12141C' },
      { label: 'Logic', tone: '#181A24' },
      { label: 'Responses', tone: '#141820' },
    ],
    description: 'سازنده فرم چندمرحله‌ای با منطق شرطی و وب‌هوک.',
    websiteUrl: 'https://example.com/formora',
    mrr: 310,
    askingPrice: 7200,
    grade: 'B',
    score: 68,
    verificationNotes: 'بررسی دستی: دمو محصول و لیست مشترکین نمونه.',
  },
  {
    slug: 'clipstack',
    title: 'ClipStack',
    tagline: 'کتابخانه کلیپ کوتاه برای سازندگان',
    niche: 'Creator Tools',
    techStack: 'SvelteKit, R2, Cloudflare',
    foundedYear: 2024,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 11,
    reasonForSale: 'early-stage؛ مناسب خریدار operator.',
    highlights: ['برچسب‌گذاری کلیپ', 'لینک خصوصی', 'جستجوی سریع'],
    gallery: [
      { label: 'Library', tone: '#101014' },
      { label: 'Tags', tone: '#16161C' },
      { label: 'Share', tone: '#121218' },
    ],
    description: 'آپلود، برچسب‌گذاری و جستجوی کلیپ کوتاه. رشد درآمد محدود.',
    websiteUrl: 'https://example.com/clipstack',
    mrr: 260,
    askingPrice: 5800,
    grade: 'C',
    score: 58,
    verificationNotes: 'بررسی دستی: محصول کار می‌کند؛ رشد درآمد محدود گزارش شد.',
  },
  {
    slug: 'another-breath',
    title: 'Another Breath',
    tagline: 'هنر مولد از الگوی تنفس — با پیشکش خیریه',
    niche: 'Creative',
    techStack: 'Vanilla JS, Web Audio, Canvas',
    foundedYear: 2025,
    featured: false,
    businessModel: 'Product asset / impact',
    customersApprox: null,
    reasonForSale: 'فروش دارایی محصول برای تمرکز روی کلادک.',
    highlights: ['پردازش محلی صوت', 'اثر قطعی با Breath ID', 'مدل پیشکش شفاف'],
    gallery: [
      { label: 'Breath', tone: '#0A1018' },
      { label: 'Canvas', tone: '#101820' },
      { label: 'Cert', tone: '#0E1614' },
    ],
    description:
      'تجربه وب که الگوی تنفس را به اثر هنری قطعی تبدیل می‌کند. بدون MRR اشتراکی؛ ارزش‌گذاری روی دارایی محصول و برند.',
    websiteUrl: 'https://mmhaidari2-hash.github.io/another-breath/',
    mrr: null,
    askingPrice: 4500,
    grade: 'B',
    score: 66,
    verificationNotes: 'بررسی دستی: دمو عمومی زنده است. بدون MRR.',
  },
];

async function main() {
  await prisma.scoringRubric.upsert({
    where: { category: 'Micro-SaaS' },
    update: {},
    create: {
      category: 'Micro-SaaS',
      version: 1,
      criteria: JSON.stringify([
        { key: 'verified_mrr_growth', label: 'رشد درآمد ماهانه (تأییدشده)', weight: 30 },
        { key: 'churn_rate', label: 'نرخ ریزش کاربر', weight: 20 },
        { key: 'traffic_trend_6mo', label: 'روند بازدید ۶ ماه اخیر', weight: 20 },
        { key: 'ui_ux_review_score', label: 'بررسی دستی UI/UX', weight: 15 },
        { key: 'time_on_market', label: 'مدت زمان فعالیت محصول', weight: 15 },
      ]),
      gradeBands: JSON.stringify({ A: 85, B: 65, C: 40 }),
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@cladak.local' },
    update: { name: 'مالک مجموعه' },
    create: { email: 'seller@cladak.local', name: 'مالک مجموعه', role: 'SELLER' },
  });

  for (const item of LISTINGS) {
    const multiple =
      item.mrr && item.mrr > 0
        ? Math.round((item.askingPrice / (item.mrr * 12)) * 10) / 10
        : null;

    const payload = {
      title: item.title,
      tagline: item.tagline,
      niche: item.niche,
      techStack: item.techStack,
      foundedYear: item.foundedYear,
      featured: item.featured,
      description: item.description,
      websiteUrl: item.websiteUrl,
      mrr: item.mrr,
      askingPrice: item.askingPrice,
      grade: item.grade,
      score: item.score,
      verificationNotes: item.verificationNotes,
      businessModel: item.businessModel,
      customersApprox: item.customersApprox,
      reasonForSale: item.reasonForSale,
      highlights: JSON.stringify(item.highlights),
      gallery: JSON.stringify(item.gallery),
      mrrHistory: item.mrr ? JSON.stringify(history(item.mrr)) : null,
      multiple,
      category: 'Micro-SaaS',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      sellerId: seller.id,
    };

    await prisma.listing.upsert({
      where: { slug: item.slug },
      update: payload,
      create: { slug: item.slug, ...payload },
    });
  }

  console.log(`✅ Seeded ${LISTINGS.length} rich verified listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
