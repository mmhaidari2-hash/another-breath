export type QuestionPersona = 'investor' | 'buyer' | 'seller' | 'auditor';
export type QuestionStatus = 'live' | 'added' | 'phase2' | 'owner';

export type KeyQuestion = {
  id: number;
  persona: QuestionPersona;
  status: QuestionStatus;
  q: { fa: string; en: string };
  a: { fa: string; en: string };
  href?: string;
};

export const PERSONA_LABELS: Record<
  QuestionPersona,
  { fa: string; en: string }
> = {
  investor: { fa: 'سرمایه‌گذار', en: 'Investor' },
  buyer: { fa: 'خریدار', en: 'Buyer' },
  seller: { fa: 'فروشنده', en: 'Seller' },
  auditor: { fa: 'ممیز / ناظر', en: 'Auditor' },
};

export const STATUS_LABELS: Record<
  QuestionStatus,
  { fa: string; en: string }
> = {
  live: { fa: 'داره', en: 'Live' },
  added: { fa: 'الان اضافه شد', en: 'Added' },
  phase2: { fa: 'فاز ۲', en: 'Phase 2' },
  owner: { fa: 'تصمیم مالک', en: 'Owner call' },
};

export const KEY_QUESTIONS: KeyQuestion[] = [
  {
    id: 1,
    persona: 'investor',
    status: 'added',
    q: {
      fa: 'مدل درآمد چیست؟',
      en: 'What is the revenue model?',
    },
    a: {
      fa: 'ثبت رایگان؛ کارمزد موفقیت ۳–۵٪ روی معامله بسته‌شده؛ بعداً اشتراک خریدار.',
      en: 'Free listing; 3–5% success fee on closed deals; buyer subscription later.',
    },
    href: '/legal/fees',
  },
  {
    id: 2,
    persona: 'investor',
    status: 'live',
    q: {
      fa: 'چرا فقط Micro-SaaS نه همه‌چیز؟',
      en: 'Why Micro-SaaS only, not everything?',
    },
    a: {
      fa: 'فاز صفر باریک برای اثبات تقاضا قبل از گسترش حوزه.',
      en: 'Narrow Phase 0 to prove demand before expanding categories.',
    },
    href: '/trust',
  },
  {
    id: 3,
    persona: 'investor',
    status: 'live',
    q: {
      fa: 'بدون آمار جعلی چطور اعتماد می‌سازید؟',
      en: 'How do you build trust without fake stats?',
    },
    a: {
      fa: 'فقط لیستینگ VERIFIED عمومی می‌شود؛ قانون طلایی: بدون SOC2/Escrow جعلی.',
      en: 'Only VERIFIED listings are public; golden rule: no fake SOC2/escrow claims.',
    },
    href: '/trust',
  },
  {
    id: 4,
    persona: 'investor',
    status: 'added',
    q: {
      fa: 'دفاع در برابر دور زدن پلتفرم چیست؟',
      en: 'How do you prevent platform circumvention?',
    },
    a: {
      fa: 'قبول اجباری Non-Circumvention قبل از Lead؛ تماس فروشنده عمومی نیست؛ Audit log؛ URL اغلب intro-only.',
      en: 'Mandatory Non-Circumvention before leads; seller contact never public; audit log; URLs often intro-only.',
    },
    href: '/legal/non-circumvention',
  },
  {
    id: 5,
    persona: 'investor',
    status: 'phase2',
    q: {
      fa: 'واحد اقتصاد (CAC/LTV) چیست؟',
      en: 'What are unit economics (CAC/LTV)?',
    },
    a: {
      fa: 'هنوز داده واقعی بازار نداریم — صادقانه خالی تا بعد از معاملات واقعی.',
      en: 'No real market data yet — left empty until closed deals exist.',
    },
  },
  {
    id: 6,
    persona: 'investor',
    status: 'live',
    q: {
      fa: 'نقشه راه چیست؟',
      en: 'What is the roadmap?',
    },
    a: {
      fa: 'فاز۱ لیست+تأیید دستی+Lead · فاز۲ Stripe/GA+اشتراک+Escrow · فاز۳ حوزه جدید.',
      en: 'P1 listing+manual verify+lead · P2 Stripe/GA+subscription+escrow · P3 new verticals.',
    },
    href: '/trust',
  },
  {
    id: 7,
    persona: 'investor',
    status: 'added',
    q: {
      fa: 'ریسک قانونی کجاست؟',
      en: 'Where is legal risk?',
    },
    a: {
      fa: 'Jurisdiction باید توسط مالک تعیین شود — قالب در Terms قابل‌پیکربندی است.',
      en: 'Jurisdiction is an owner decision — Terms include a configurable template.',
    },
    href: '/legal/terms',
  },
  {
    id: 8,
    persona: 'investor',
    status: 'added',
    q: {
      fa: 'مالکیت IP پلتفرم با کیست؟',
      en: 'Who owns platform IP?',
    },
    a: {
      fa: 'کد و برند کلادک متعلق به مالک پلتفرم؛ دارایی لیستینگ متعلق به فروشنده.',
      en: 'Cladak code/brand belong to the platform owner; listing assets belong to sellers.',
    },
    href: '/legal/terms',
  },
  {
    id: 9,
    persona: 'investor',
    status: 'added',
    q: {
      fa: 'ریسک داده کاربران چیست؟',
      en: 'What is user data risk?',
    },
    a: {
      fa: 'Privacy Policy؛ Lead در DB؛ بدون فروش داده؛ IP فقط به‌صورت هش.',
      en: 'Privacy Policy; leads in DB; no data sales; IPs stored hashed only.',
    },
    href: '/legal/privacy',
  },
  {
    id: 10,
    persona: 'investor',
    status: 'live',
    q: {
      fa: 'رقابت با Acquire/Flippa چطور؟',
      en: 'How do you compete with Acquire/Flippa?',
    },
    a: {
      fa: 'تأیید دستی صادقانه + FA/EN + تمرکز باریک Micro-SaaS.',
      en: 'Honest manual verification + FA/EN + narrow Micro-SaaS focus.',
    },
  },
  {
    id: 11,
    persona: 'investor',
    status: 'owner',
    q: {
      fa: 'چقدر runway تا product-market fit؟',
      en: 'How much runway to product-market fit?',
    },
    a: {
      fa: 'تصمیم مالک کسب‌وکار — پلتفرم ابزار و KPIهای فاز۱ را دارد.',
      en: 'Business-owner decision — platform provides Phase-1 tooling and KPIs.',
    },
  },
  {
    id: 12,
    persona: 'investor',
    status: 'added',
    q: {
      fa: 'KPIهای فاز۱ چیست؟',
      en: 'What are Phase-1 KPIs?',
    },
    a: {
      fa: 'تعداد VERIFIED، Leadهای واجدشرایط، رویدادهای Audit — در Trust Center از DB.',
      en: 'Verified count, qualified leads, audit events — live from DB in Trust Center.',
    },
    href: '/trust',
  },
  {
    id: 13,
    persona: 'buyer',
    status: 'live',
    q: {
      fa: 'از کجا بفهمم درآمد واقعی است؟',
      en: 'How do I know revenue is real?',
    },
    a: {
      fa: 'یادداشت بررسی + چارت snapshot دستی؛ API بانکی زنده هنوز نیست (صادقانه).',
      en: 'Review notes + manual MRR snapshots; live bank APIs are Phase 2 — stated honestly.',
    },
  },
  {
    id: 14,
    persona: 'buyer',
    status: 'added',
    q: {
      fa: 'ایمیل فروشنده را کجا ببینم؟',
      en: 'Where do I see the seller email?',
    },
    a: {
      fa: 'نمی‌بینید — فقط از طریق معرفی پلتفرم. API هم ایمیل فروشنده برنمی‌گرداند.',
      en: 'You don’t — only via platform intro. APIs never return seller email.',
    },
    href: '/legal/non-circumvention',
  },
  {
    id: 15,
    persona: 'buyer',
    status: 'added',
    q: {
      fa: 'اگر مستقیم با فروشنده ببندم؟',
      en: 'What if I close directly with the seller?',
    },
    a: {
      fa: 'نقض Non-Circumvention؛ پلتفرم حق کارمزد موفقیت را حفظ می‌کند.',
      en: 'Breach of Non-Circumvention; platform retains success-fee rights.',
    },
    href: '/legal/non-circumvention',
  },
  {
    id: 16,
    persona: 'buyer',
    status: 'phase2',
    q: {
      fa: 'Escrow دارید؟',
      en: 'Do you offer escrow?',
    },
    a: {
      fa: 'فاز ۲ — الان صریح نوشته شده که نداریم و ادعای جعلی ممنوع است.',
      en: 'Phase 2 — we state clearly we do not have it; fake claims are forbidden.',
    },
    href: '/trust',
  },
  {
    id: 17,
    persona: 'buyer',
    status: 'phase2',
    q: {
      fa: 'NDA قبل از داده حساس؟',
      en: 'NDA before sensitive data?',
    },
    a: {
      fa: 'فاز ۲ VDR/NDA؛ الان فقط intro از طریق Lead.',
      en: 'Phase 2 VDR/NDA; today intro-only via Lead.',
    },
  },
  {
    id: 18,
    persona: 'buyer',
    status: 'live',
    q: {
      fa: 'مقایسه چند دارایی؟',
      en: 'Can I compare multiple assets?',
    },
    a: {
      fa: 'Compare desk تا ۳ مورد.',
      en: 'Compare desk supports up to 3 assets.',
    },
    href: '/compare',
  },
  {
    id: 19,
    persona: 'buyer',
    status: 'live',
    q: {
      fa: 'Watchlist دارید؟',
      en: 'Is there a watchlist?',
    },
    a: {
      fa: 'بله — محلی در مرورگر خریدار.',
      en: 'Yes — local to the buyer’s browser.',
    },
  },
  {
    id: 20,
    persona: 'buyer',
    status: 'live',
    q: {
      fa: 'فیلتر حرفه‌ای؟',
      en: 'Professional filters?',
    },
    a: {
      fa: 'قیمت / MRR / درجه / نیچ در بازار.',
      en: 'Price / MRR / grade / niche in the market.',
    },
    href: '/marketplace',
  },
  {
    id: 21,
    persona: 'buyer',
    status: 'added',
    q: {
      fa: 'پول کارمزد کجا می‌رود؟',
      en: 'Where do fees go?',
    },
    a: {
      fa: 'طبق Fees و Terms — کارمزد موفقیت به پلتفرم.',
      en: 'Per Fees & Terms — success fee to the platform.',
    },
    href: '/legal/fees',
  },
  {
    id: 22,
    persona: 'buyer',
    status: 'added',
    q: {
      fa: 'اگر دارایی خلاف ادعا بود؟',
      en: 'If the asset misrepresents claims?',
    },
    a: {
      fa: 'کلادک واسط معرفی است نه ضامن درآمد — Disclaimer در Terms.',
      en: 'Cladak is an introduction intermediary, not a revenue guarantor — see Terms disclaimer.',
    },
    href: '/legal/terms',
  },
  {
    id: 23,
    persona: 'buyer',
    status: 'added',
    q: {
      fa: 'داده شخصی‌ام چه می‌شود؟',
      en: 'What happens to my personal data?',
    },
    a: {
      fa: 'طبق Privacy؛ درخواست دسترسی/حذف از فرم Data Rights.',
      en: 'Per Privacy; access/deletion via the Data Rights form.',
    },
    href: '/legal/data-request',
  },
  {
    id: 24,
    persona: 'buyer',
    status: 'live',
    q: {
      fa: 'Rate limit روی اسپم؟',
      en: 'Rate limits against spam?',
    },
    a: {
      fa: 'بله — in-memory فاز۱؛ Redis فاز۲.',
      en: 'Yes — in-memory Phase 1; Redis Phase 2.',
    },
  },
  {
    id: 25,
    persona: 'buyer',
    status: 'live',
    q: {
      fa: 'آیا لیستینگ تأییدنشده دیده می‌شود؟',
      en: 'Are unverified listings visible?',
    },
    a: {
      fa: 'خیر — فقط VERIFIED عمومی است.',
      en: 'No — only VERIFIED are public.',
    },
  },
  {
    id: 26,
    persona: 'buyer',
    status: 'added',
    q: {
      fa: 'زبان پشتیبانی خریدار؟',
      en: 'Buyer support channel?',
    },
    a: {
      fa: 'از طریق Lead و ایمیل پلتفرم؛ FA/EN.',
      en: 'Via Lead and platform email; FA/EN.',
    },
  },
  {
    id: 27,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'چطور لیست کنم؟',
      en: 'How do I list?',
    },
    a: {
      fa: 'ویزارد ۳ مرحله + قبول Seller Terms و Non-Circumvention.',
      en: '3-step wizard + Seller Terms and Non-Circumvention acceptance.',
    },
    href: '/sell',
  },
  {
    id: 28,
    persona: 'seller',
    status: 'live',
    q: {
      fa: 'کی عمومی می‌شوم؟',
      en: 'When do I go public?',
    },
    a: {
      fa: 'فقط بعد از VERIFIED دستی.',
      en: 'Only after manual VERIFIED review.',
    },
  },
  {
    id: 29,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'خریدار مستقیم پیدام می‌کند؟',
      en: 'Can buyers find me directly?',
    },
    a: {
      fa: 'تماس عمومی نیست؛ intro فقط از پلتفرم.',
      en: 'No public contact; intros only via platform.',
    },
  },
  {
    id: 30,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'کارمزد من چقدر است؟',
      en: 'What is my fee?',
    },
    a: {
      fa: '۳–۵٪ موفقیت روی معامله بسته‌شده.',
      en: '3–5% success fee on closed deals.',
    },
    href: '/legal/fees',
  },
  {
    id: 31,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'اگر خریدار دور بزند؟',
      en: 'If a buyer circumvents?',
    },
    a: {
      fa: 'بند Non-Circumvention دوطرفه؛ حق کارمزد محفوظ.',
      en: 'Bilateral Non-Circumvention; fee rights retained.',
    },
    href: '/legal/non-circumvention',
  },
  {
    id: 32,
    persona: 'seller',
    status: 'live',
    q: {
      fa: 'چه مدارکی برای تأیید؟',
      en: 'What proof for verification?',
    },
    a: {
      fa: 'درآمد / دمو / UI — توضیح در Trust Center.',
      en: 'Revenue / demo / UI — detailed in Trust Center.',
    },
    href: '/trust',
  },
  {
    id: 33,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'می‌توانم URL کامل مخفی کنم؟',
      en: 'Can I hide the full URL?',
    },
    a: {
      fa: 'بله — demoPolicy=INTRO_ONLY تا بعد از intro.',
      en: 'Yes — demoPolicy=INTRO_ONLY until after intro.',
    },
  },
  {
    id: 34,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'مالکیت داده مشتریان محصولم؟',
      en: 'Who owns my product’s customer data?',
    },
    a: {
      fa: 'مال شماست؛ کلادک فقط متادیتای لیستینگ را نگه می‌دارد.',
      en: 'Yours; Cladak only stores listing metadata.',
    },
    href: '/legal/terms',
  },
  {
    id: 35,
    persona: 'seller',
    status: 'added',
    q: {
      fa: 'حذف لیستینگ؟',
      en: 'Listing removal?',
    },
    a: {
      fa: 'از طریق درخواست به ادمین — فرایند در Terms.',
      en: 'Via admin request — process in Terms.',
    },
    href: '/legal/terms',
  },
  {
    id: 36,
    persona: 'seller',
    status: 'live',
    q: {
      fa: 'چند حوزه همزمان؟',
      en: 'Multiple verticals at once?',
    },
    a: {
      fa: 'فعلاً فقط Micro-SaaS.',
      en: 'Micro-SaaS only for now.',
    },
  },
  {
    id: 37,
    persona: 'seller',
    status: 'phase2',
    q: {
      fa: 'پرداخت آنلاین کارمزد؟',
      en: 'Online fee payment?',
    },
    a: {
      fa: 'فاز ۲.',
      en: 'Phase 2.',
    },
  },
  {
    id: 38,
    persona: 'seller',
    status: 'phase2',
    q: {
      fa: 'پنل فروشنده؟',
      en: 'Seller dashboard?',
    },
    a: {
      fa: 'فاز بعد — فعلاً Studio/درخواست فروش.',
      en: 'Later phase — currently sell inquiry / studio.',
    },
    href: '/sell',
  },
  {
    id: 39,
    persona: 'auditor',
    status: 'added',
    q: {
      fa: 'HTTPS و هدرهای امنیتی؟',
      en: 'HTTPS and security headers?',
    },
    a: {
      fa: 'HSTS، X-Frame DENY، nosniff، Referrer-Policy، CSP پایه در Next.',
      en: 'HSTS, X-Frame DENY, nosniff, Referrer-Policy, baseline CSP in Next.',
    },
  },
  {
    id: 40,
    persona: 'auditor',
    status: 'live',
    q: {
      fa: 'اعتبارسنجی ورودی؟',
      en: 'Input validation?',
    },
    a: {
      fa: 'Zod روی Lead و SellerInquiry؛ توافق‌نامه‌ها literal true.',
      en: 'Zod on Lead and SellerInquiry; agreements must be literal true.',
    },
  },
  {
    id: 41,
    persona: 'auditor',
    status: 'live',
    q: {
      fa: 'Rate limiting؟',
      en: 'Rate limiting?',
    },
    a: {
      fa: 'In-memory فاز۱؛ Redis فاز۲.',
      en: 'In-memory Phase 1; Redis Phase 2.',
    },
  },
  {
    id: 42,
    persona: 'auditor',
    status: 'added',
    q: {
      fa: 'لاگ ممیزی؟',
      en: 'Audit logging?',
    },
    a: {
      fa: 'مدل AuditEvent برای lead/agreement/rate-limit با IP هش‌شده.',
      en: 'AuditEvent model for lead/agreement/rate-limit with hashed IP.',
    },
    href: '/trust',
  },
  {
    id: 43,
    persona: 'auditor',
    status: 'phase2',
    q: {
      fa: 'رمزنگاری داده حساس؟',
      en: 'Encryption of sensitive data?',
    },
    a: {
      fa: 'حمل‌ونقل/هاست؛ Auth و رمز عبور کاربر هنوز نیست.',
      en: 'Transport/host-level; user auth/passwords not yet.',
    },
  },
  {
    id: 44,
    persona: 'auditor',
    status: 'added',
    q: {
      fa: 'GDPR / حذف داده؟',
      en: 'GDPR / data deletion?',
    },
    a: {
      fa: 'Privacy + فرم Data Rights برای دسترسی/حذف؛ tooling کامل Auth فاز۲.',
      en: 'Privacy + Data Rights form for access/deletion; full auth tooling in Phase 2.',
    },
    href: '/legal/data-request',
  },
  {
    id: 45,
    persona: 'auditor',
    status: 'live',
    q: {
      fa: 'ادعای «legally binding» الکی؟',
      en: 'Fake “legally binding” claims?',
    },
    a: {
      fa: 'ممنوع — قانون طلایی معماری.',
      en: 'Forbidden — architecture golden rule.',
    },
  },
  {
    id: 46,
    persona: 'auditor',
    status: 'added',
    q: {
      fa: 'CSP / clickjacking؟',
      en: 'CSP / clickjacking?',
    },
    a: {
      fa: 'X-Frame-Options DENY + frame-ancestors none + CSP پایه.',
      en: 'X-Frame-Options DENY + frame-ancestors none + baseline CSP.',
    },
  },
  {
    id: 47,
    persona: 'auditor',
    status: 'added',
    q: {
      fa: 'افشای اطلاعات فروشنده در API؟',
      en: 'Seller PII leakage in APIs?',
    },
    a: {
      fa: 'پاسخ Lead فقط success/leadId؛ بدون ایمیل فروشنده.',
      en: 'Lead response is success/leadId only; never seller email.',
    },
  },
  {
    id: 48,
    persona: 'auditor',
    status: 'added',
    q: {
      fa: 'کوکی و ردیابی؟',
      en: 'Cookies and tracking?',
    },
    a: {
      fa: 'Cookie notice حداقلی؛ بدون tracker شخص ثالث اجباری در فاز۱.',
      en: 'Minimal cookie notice; no mandatory third-party trackers in Phase 1.',
    },
    href: '/legal/cookies',
  },
  {
    id: 49,
    persona: 'auditor',
    status: 'live',
    q: {
      fa: 'جداسازی محیط؟',
      en: 'Environment separation?',
    },
    a: {
      fa: '.env؛ secret در ریپو نیست.',
      en: '.env; secrets not committed.',
    },
  },
  {
    id: 50,
    persona: 'auditor',
    status: 'phase2',
    q: {
      fa: 'آمادگی برای SOC2؟',
      en: 'SOC2 readiness?',
    },
    a: {
      fa: 'هنوز نه — roadmap صادقانه در Trust؛ ادعای گواهی جعلی ممنوع.',
      en: 'Not yet — honest roadmap in Trust; fake certificate claims forbidden.',
    },
    href: '/trust',
  },
];
