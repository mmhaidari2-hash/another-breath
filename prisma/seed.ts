import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LISTINGS = [
  {
    slug: 'fluxnote',
    title: 'FluxNote',
    tagline: 'یادداشت تیمی با همگام‌سازی آفلاین',
    niche: 'Productivity',
    techStack: 'Next.js, SQLite, Tailwind',
    foundedYear: 2024,
    featured: true,
    description:
      'ابزار یادداشت تیمی برای استارتاپ‌های کوچک. همگام‌سازی آفلاین، اشتراک لینک محدود، جستجوی سریع روی markdown. مناسب تیم‌های ۲ تا ۱۲ نفره که نمی‌خواهند وارد اکوسیستم سنگین Notion شوند.\n\nانتقال شامل: ریپوی کامل، دامنه (در صورت توافق)، دسترسی استریپ/ایمیل، و یک جلسه تحویل.',
    websiteUrl: 'https://example.com/fluxnote',
    mrr: 420,
    askingPrice: 9500,
    grade: 'B',
    score: 72,
    verificationNotes:
      'بررسی دستی ۱۴۰۵/۶: اسکرین‌شات داشبورد درآمد و دمو محصول. MRR اعلامی با فاکتورهای نمونه هم‌خوان بود. UI قابل‌قبول، churn گزارش‌شده پایین.',
  },
  {
    slug: 'parcelkit',
    title: 'ParcelKit',
    tagline: 'ردیابی مرسوله برای فروشگاه‌های کوچک',
    niche: 'E-commerce Ops',
    techStack: 'Node, React, PostgreSQL',
    foundedYear: 2023,
    featured: true,
    description:
      'داشبورد و پلاگین ردیابی مرسوله برای فروشگاه‌های آنلاین کوچک. اتصال چند سرویس پستی، اعلان واتساپ/ایمیل به مشتری، صفحه وضعیت سفارشی برند.\n\nپایگاه مشتری فعال در بازار فارسی‌زبان؛ کدبیس تمیز و قابل‌استقرار روی Railway.',
    websiteUrl: 'https://example.com/parcelkit',
    mrr: 680,
    askingPrice: 14500,
    grade: 'A',
    score: 86,
    verificationNotes:
      'بررسی دستی: لاگین دمو + نمونه‌ی تراکنش ماهانه. محصول فعال، چند فروشگاه واقعی در دمو دیده شد.',
  },
  {
    slug: 'formora',
    title: 'Formora',
    tagline: 'فرم چندمرحله‌ای بدون کدنویسی',
    niche: 'Forms',
    techStack: 'Next.js, Prisma, Vercel',
    foundedYear: 2024,
    featured: false,
    description:
      'سازنده فرم چندمرحله‌ای با منطق شرطی، وب‌هوک، و خروجی Google Sheets. مخاطب: فریلنسرها و آژانس‌های کوچک.',
    websiteUrl: 'https://example.com/formora',
    mrr: 310,
    askingPrice: 7200,
    grade: 'B',
    score: 68,
    verificationNotes: 'بررسی دستی: دمو محصول و لیست مشترکین نمونه.',
  },
  {
    slug: 'seatline',
    title: 'Seatline',
    tagline: 'رزرو نوبت برای کلینیک‌های کوچک',
    niche: 'Scheduling',
    techStack: 'Laravel, Vue, MySQL',
    foundedYear: 2022,
    featured: true,
    description:
      'سیستم رزرو نوبت آنلاین برای کلینیک و سالن. تقویم چندکاربره، یادآوری SMS، صفحه عمومی برند، گزارش حضور.\n\nیکی از بالغ‌ترین دارایی‌های این مجموعه از نظر درآمد و ثبات.',
    websiteUrl: 'https://example.com/seatline',
    mrr: 890,
    askingPrice: 18500,
    grade: 'A',
    score: 88,
    verificationNotes: 'بررسی دستی: درآمد ماهانه و تعداد کلینیک‌های فعال تأیید شد.',
  },
  {
    slug: 'inkledger',
    title: 'InkLedger',
    tagline: 'صورتحساب ساده برای فریلنسرها',
    niche: 'Finance',
    techStack: 'Rails, Hotwire, Postgres',
    foundedYear: 2023,
    featured: false,
    description:
      'صدور فاکتور، پیگیری پرداخت، یادآوری خودکار. تمرکز روی فریلنسر تک‌نفره — بدون پیچیدگی حسابداری سنگین.',
    websiteUrl: 'https://example.com/inkledger',
    mrr: 540,
    askingPrice: 11000,
    grade: 'B',
    score: 74,
    verificationNotes: 'بررسی دستی: Stripe فقط‌خواندنی نمونه + UI.',
  },
  {
    slug: 'clipstack',
    title: 'ClipStack',
    tagline: 'کتابخانه کلیپ کوتاه برای سازندگان',
    niche: 'Creator Tools',
    techStack: 'SvelteKit, R2, Cloudflare',
    foundedYear: 2024,
    featured: false,
    description:
      'آپلود، برچسب‌گذاری و جستجوی کلیپ کوتاه. اشتراک لینک خصوصی برای تیم ادیت. رشد درآمد هنوز محدود است.',
    websiteUrl: 'https://example.com/clipstack',
    mrr: 260,
    askingPrice: 5800,
    grade: 'C',
    score: 58,
    verificationNotes: 'بررسی دستی: محصول کار می‌کند؛ رشد درآمد محدود گزارش شد.',
  },
  {
    slug: 'routepulse',
    title: 'RoutePulse',
    tagline: 'مانیتورینگ آپتایم با هشدار تلگرام',
    niche: 'DevTools',
    techStack: 'Go, Redis, React',
    foundedYear: 2023,
    featured: false,
    description:
      'چک آپتایم وب‌سایت و API با هشدار تلگرام/ایمیل. داشبورد ساده، بدون قفل فروشنده. مناسب خریدار فنی.',
    websiteUrl: 'https://example.com/routepulse',
    mrr: 390,
    askingPrice: 8200,
    grade: 'B',
    score: 71,
    verificationNotes: 'بررسی دستی: مانیتورینگ زنده و لاگ هشدار نمونه.',
  },
  {
    slug: 'guestfolio',
    title: 'Guestfolio',
    tagline: 'پورتفولیوی مهمان برای اقامتگاه‌ها',
    niche: 'Hospitality',
    techStack: 'Next.js, Sanity, Stripe',
    foundedYear: 2023,
    featured: false,
    description:
      'صفحه راهنمای دیجیتال برای اقامتگاه و بوم‌گردی: وای‌فای، قوانین خانه، پیشنهاد محلی. سفارشی‌سازی برند.',
    websiteUrl: 'https://example.com/guestfolio',
    mrr: 470,
    askingPrice: 9800,
    grade: 'B',
    score: 70,
    verificationNotes: 'بررسی دستی: چند صفحه زنده + درآمد اشتراک.',
  },
  {
    slug: 'briefbay',
    title: 'BriefBay',
    tagline: 'جمع‌آوری بریف مشتری برای آژانس‌ها',
    niche: 'Agency Ops',
    techStack: 'Next.js, Postgres, Resend',
    foundedYear: 2022,
    featured: true,
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
    slug: 'another-breath',
    title: 'Another Breath',
    tagline: 'هنر مولد از الگوی تنفس — با پیشکش خیریه',
    niche: 'Creative',
    techStack: 'Vanilla JS, Web Audio, Canvas',
    foundedYear: 2025,
    featured: false,
    description:
      'تجربه وب که الگوی تنفس را به اثر هنری قطعی تبدیل می‌کند. پردازش محلی، بدون ارسال صوت. نیمی از هر پیشکش برای کودکان نیازمند.\n\nدرآمد اشتراکی ندارد؛ ارزش‌گذاری روی دارایی محصول، برند و کد است.',
    websiteUrl: 'https://mmhaidari2-hash.github.io/another-breath/',
    mrr: null,
    askingPrice: 4500,
    grade: 'B',
    score: 66,
    verificationNotes:
      'بررسی دستی: دمو عمومی زنده است. بدون MRR؛ امتیاز بر اساس کیفیت محصول و شفافیت مدل.',
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
    create: {
      email: 'seller@cladak.local',
      name: 'مالک مجموعه',
      role: 'SELLER',
    },
  });

  for (const item of LISTINGS) {
    const multiple =
      item.mrr && item.mrr > 0
        ? Math.round((item.askingPrice / (item.mrr * 12)) * 10) / 10
        : null;

    await prisma.listing.upsert({
      where: { slug: item.slug },
      update: {
        ...item,
        multiple,
        category: 'Micro-SaaS',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        sellerId: seller.id,
      },
      create: {
        ...item,
        multiple,
        category: 'Micro-SaaS',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        sellerId: seller.id,
      },
    });
  }

  console.log(`✅ Seeded ${LISTINGS.length} verified listings + rubric.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
