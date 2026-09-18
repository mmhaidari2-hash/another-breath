import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LISTINGS = [
  {
    slug: 'fluxnote',
    title: 'FluxNote',
    tagline: 'یادداشت‌های تیمی با همگام‌سازی آفلاین',
    niche: 'Productivity',
    description:
      'ابزار یادداشت تیمی برای استارتاپ‌های کوچک. همگام‌سازی آفلاین، اشتراک‌گذاری لینک محدود، و جستجوی سریع روی محتوای markdown. کدبیس Next.js + SQLite.',
    websiteUrl: 'https://example.com/fluxnote',
    mrr: 420,
    askingPrice: 9500,
    grade: 'B',
    score: 72,
    verificationNotes:
      'بررسی دستی: اسکرین‌شات داشبورد درآمد و دمو محصول بررسی شد. MRR اعلامی با فاکتورهای نمونه مطابقت داشت.',
  },
  {
    slug: 'parcelkit',
    title: 'ParcelKit',
    tagline: 'ردیابی مرسوله برای فروشگاه‌های کوچک',
    niche: 'E-commerce Ops',
    description:
      'پلاگین و داشبورد ردیابی مرسوله برای فروشگاه‌های آنلاین کوچک. اتصال به چند سرویس پستی، اعلان واتساپ/ایمیل به مشتری.',
    websiteUrl: 'https://example.com/parcelkit',
    mrr: 680,
    askingPrice: 14500,
    grade: 'A',
    score: 86,
    verificationNotes:
      'بررسی دستی: لاگین دمو + نمونه‌ی تراکنش‌های ماهانه. محصول فعال و UI قابل‌قبول.',
  },
  {
    slug: 'formora',
    title: 'Formora',
    tagline: 'فرم‌های چندمرحله‌ای بدون کدنویسی',
    niche: 'Forms',
    description:
      'سازنده فرم چندمرحله‌ای با منطق شرطی، وب‌هوک، و خروجی Google Sheets. مناسب فریلنسرها و آژانس‌های کوچک.',
    websiteUrl: 'https://example.com/formora',
    mrr: 310,
    askingPrice: 7200,
    grade: 'B',
    score: 68,
    verificationNotes: 'بررسی دستی: دمو محصول و لیست مشترکین نمونه بررسی شد.',
  },
  {
    slug: 'seatline',
    title: 'Seatline',
    tagline: 'رزرو نوبت برای کلینیک‌های کوچک',
    niche: 'Scheduling',
    description:
      'سیستم رزرو نوبت آنلاین برای کلینیک و سالن. تقویم چندکاربره، یادآوری SMS، و صفحه عمومی برند.',
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
    description:
      'صدور فاکتور، پیگیری پرداخت، و یادآوری خودکار. تمرکز روی فریلنسرهای تک‌نفره — بدون پیچیدگی حسابداری سنگین.',
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
    tagline: 'کتابخانه کلیپ کوتاه برای سازندگان محتوا',
    niche: 'Creator Tools',
    description:
      'آپلود، برچسب‌گذاری و جستجوی کلیپ‌های کوتاه ویدیو. اشتراک‌گذاری با لینک خصوصی برای تیم ادیت.',
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
    description:
      'چک‌کردن آپتایم وب‌سایت و API با هشدار تلگرام/ایمیل. داشبورد ساده، بدون قفل فروشنده.',
    websiteUrl: 'https://example.com/routepulse',
    mrr: 390,
    askingPrice: 8200,
    grade: 'B',
    score: 71,
    verificationNotes: 'بررسی دستی: مانیتورینگ زنده و لاگ هشدار نمونه دیده شد.',
  },
  {
    slug: 'guestfolio',
    title: 'Guestfolio',
    tagline: 'پورتفولیوی مهمان برای اقامتگاه‌ها',
    niche: 'Hospitality',
    description:
      'صفحه راهنمای دیجیتال برای اقامتگاه و بوم‌گردی: وای‌فای، قوانین خانه، پیشنهادهای محلی. قابل‌سفارشی‌سازی برند.',
    websiteUrl: 'https://example.com/guestfolio',
    mrr: 470,
    askingPrice: 9800,
    grade: 'B',
    score: 70,
    verificationNotes: 'بررسی دستی: چند نمونه صفحه زنده + درآمد اشتراک.',
  },
  {
    slug: 'briefbay',
    title: 'BriefBay',
    tagline: 'جمع‌آوری بریف مشتری برای آژانس‌ها',
    niche: 'Agency Ops',
    description:
      'فرم بریف ساخت‌یافته، آرشیو پروژه، و اعلان تیم. جایگزین پراکندگی ایمیل برای آژانس‌های ۲ تا ۱۵ نفره.',
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
    niche: 'Creative / Impact',
    description:
      'تجربهٔ وب که الگوی تنفس کاربر را به اثر هنری قطعی تبدیل می‌کند. پردازش محلی، بدون ارسال صوت. نیمی از هر پیشکش برای کودکان نیازمند.',
    websiteUrl: 'https://mmhaidari2-hash.github.io/another-breath/',
    mrr: null,
    askingPrice: 4500,
    grade: 'B',
    score: 66,
    verificationNotes:
      'بررسی دستی: دمو عمومی زنده است. درآمد اشتراکی ندارد؛ ارزش‌گذاری روی دارایی محصول و برند است.',
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
    update: {},
    create: {
      email: 'seller@cladak.local',
      name: 'مالک پروژه‌ها',
      role: 'SELLER',
    },
  });

  for (const item of LISTINGS) {
    await prisma.listing.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        tagline: item.tagline,
        niche: item.niche,
        description: item.description,
        websiteUrl: item.websiteUrl,
        mrr: item.mrr,
        askingPrice: item.askingPrice,
        grade: item.grade,
        score: item.score,
        verificationStatus: 'VERIFIED',
        verificationNotes: item.verificationNotes,
        verifiedAt: new Date(),
        sellerId: seller.id,
      },
      create: {
        ...item,
        category: 'Micro-SaaS',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        sellerId: seller.id,
      },
    });
  }

  console.log(`✅ Seeded rubric + seller + ${LISTINGS.length} verified listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
