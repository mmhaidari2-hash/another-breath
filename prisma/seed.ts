import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

function history(basePence: number, months = 12) {
  const out: { month: string; mrrPence: number }[] = [];
  let v = Math.round(basePence * 0.58);
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(2026, 8, 1);
    d.setMonth(d.getMonth() - i);
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const step = 1.035 + ((basePence / 100) % 7) * 0.004;
    v = Math.round(v * step);
    if (i === 0) v = basePence;
    out.push({ month: label, mrrPence: v });
  }
  return out;
}

const LISTINGS = [
  {
    slug: 'seatline',
    title: 'Seatline',
    tagline: 'Appointment booking for small clinics',
    niche: 'Scheduling',
    techStack: 'Laravel, Vue, MySQL',
    foundedYear: 2022,
    featured: true,
    businessModel: 'SaaS subscription',
    customersApprox: 48,
    reasonForSale: 'Founder focusing on the next product; full handover with 30-day support.',
    highlights: [
      'Multiple active clinics on monthly plans',
      'SMS reminders and multi-staff calendar',
      'Deployable codebase on Railway-class hosts',
    ],
    gallery: [
      { label: 'Dashboard', tone: '#0B0C0F' },
      { label: 'Booking', tone: '#1A2332' },
      { label: 'Calendar', tone: '#12241C' },
    ],
    description:
      'Online booking for clinics and salons. Multi-staff calendar, SMS reminders, branded public page, attendance reports.\n\nOne of the more mature assets in this set on revenue stability. Transfer includes repo, optional domain, and a handover session.',
    websiteUrl: 'https://example.com/seatline',
    mrrPence: 89000,
    askingPricePence: 1850000,
    grade: 'A',
    score: 88,
    verificationNotes:
      'Manual review: monthly revenue and active clinic count corroborated from sample invoices / dashboard exports.',
  },
  {
    slug: 'parcelkit',
    title: 'ParcelKit',
    tagline: 'Shipment tracking for small ecommerce shops',
    niche: 'E-commerce Ops',
    techStack: 'Node, React, PostgreSQL',
    foundedYear: 2023,
    featured: true,
    businessModel: 'SaaS + usage',
    customersApprox: 36,
    reasonForSale: 'Founder is full-time on another product.',
    highlights: ['Multi-carrier connections', 'WhatsApp/email alerts', 'Real paying shops'],
    gallery: [
      { label: 'Shipments', tone: '#101820' },
      { label: 'Tracking', tone: '#1C2430' },
      { label: 'Alerts', tone: '#142018' },
    ],
    description:
      'Dashboard and plugin for small online shops. Multi-carrier tracking, customer alerts, branded status pages.',
    websiteUrl: 'https://example.com/parcelkit',
    mrrPence: 68000,
    askingPricePence: 1450000,
    grade: 'A',
    score: 86,
    verificationNotes: 'Manual review: demo login + sample monthly transaction export.',
  },
  {
    slug: 'briefbay',
    title: 'BriefBay',
    tagline: 'Structured client briefs for agencies',
    niche: 'Agency Ops',
    techStack: 'Next.js, Postgres, Resend',
    foundedYear: 2022,
    featured: true,
    businessModel: 'SaaS subscription',
    customersApprox: 22,
    reasonForSale: 'Strategic exit to focus on consulting.',
    highlights: ['Structured brief forms', 'Project archive', 'Team alerts'],
    gallery: [
      { label: 'Briefs', tone: '#12141A' },
      { label: 'Projects', tone: '#1A1E28' },
      { label: 'Team', tone: '#161C22' },
    ],
    description:
      'Structured briefs, project archive, team notifications. Replaces email chaos for 2–15 person agencies.',
    websiteUrl: 'https://example.com/briefbay',
    mrrPence: 61000,
    askingPricePence: 1320000,
    grade: 'A',
    score: 84,
    verificationNotes: 'Manual review: product demo + monthly revenue screenshot.',
  },
  {
    slug: 'fluxnote',
    title: 'FluxNote',
    tagline: 'Team notes with offline sync',
    niche: 'Productivity',
    techStack: 'Next.js, SQLite, Tailwind',
    foundedYear: 2024,
    featured: true,
    businessModel: 'SaaS subscription',
    customersApprox: 19,
    reasonForSale: 'Founder time constrained.',
    highlights: ['Offline-first', 'Markdown search', 'Limited link sharing'],
    gallery: [
      { label: 'Editor', tone: '#0E1218' },
      { label: 'Sync', tone: '#182028' },
      { label: 'Share', tone: '#101818' },
    ],
    description:
      'Team notes for small startups. Offline sync, limited link sharing, fast markdown search.',
    websiteUrl: 'https://example.com/fluxnote',
    mrrPence: 42000,
    askingPricePence: 950000,
    grade: 'B',
    score: 72,
    verificationNotes: 'Manual review: revenue dashboard screenshot + product demo.',
  },
  {
    slug: 'inkledger',
    title: 'InkLedger',
    tagline: 'Simple invoicing for freelancers',
    niche: 'Finance',
    techStack: 'Rails, Hotwire, Postgres',
    foundedYear: 2023,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 41,
    reasonForSale: 'Personal priorities shifted.',
    highlights: ['Fast invoices', 'Auto reminders', 'No accounting bloat'],
    gallery: [
      { label: 'Invoices', tone: '#141210' },
      { label: 'Payments', tone: '#1C1814' },
      { label: 'Reminders', tone: '#181410' },
    ],
    description: 'Invoicing, payment tracking, and reminders for solo freelancers.',
    websiteUrl: 'https://example.com/inkledger',
    mrrPence: 54000,
    askingPricePence: 1100000,
    grade: 'B',
    score: 74,
    verificationNotes: 'Manual review: sample read-only Stripe export + UI walkthrough.',
  },
  {
    slug: 'guestfolio',
    title: 'Guestfolio',
    tagline: 'Digital guest guides for stays',
    niche: 'Hospitality',
    techStack: 'Next.js, Sanity, Stripe',
    foundedYear: 2023,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 27,
    reasonForSale: 'Liquidity for the next project.',
    highlights: ['Branded stay pages', 'Easy editing', 'Monthly subscriptions'],
    gallery: [
      { label: 'Guide', tone: '#101618' },
      { label: 'Editor', tone: '#161C20' },
      { label: 'Guest', tone: '#121A16' },
    ],
    description: 'Digital guest guides for boutique stays and rural lodging.',
    websiteUrl: 'https://example.com/guestfolio',
    mrrPence: 47000,
    askingPricePence: 980000,
    grade: 'B',
    score: 70,
    verificationNotes: 'Manual review: live pages + subscription revenue sample.',
  },
  {
    slug: 'routepulse',
    title: 'RoutePulse',
    tagline: 'Uptime monitoring with Telegram alerts',
    niche: 'DevTools',
    techStack: 'Go, Redis, React',
    foundedYear: 2023,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 33,
    reasonForSale: 'Low-maintenance cashflow; selling to focus on other infra.',
    highlights: ['Telegram alerts', 'Web/API checks', 'Simple dashboard'],
    gallery: [
      { label: 'Monitors', tone: '#0C1418' },
      { label: 'Incidents', tone: '#141C22' },
      { label: 'Alerts', tone: '#101818' },
    ],
    description: 'Website and API uptime checks with Telegram/email alerts.',
    websiteUrl: 'https://example.com/routepulse',
    mrrPence: 39000,
    askingPricePence: 820000,
    grade: 'B',
    score: 71,
    verificationNotes: 'Manual review: live monitors + sample alert logs.',
  },
  {
    slug: 'formora',
    title: 'Formora',
    tagline: 'Multi-step forms without code',
    niche: 'Forms',
    techStack: 'Next.js, Prisma, Vercel',
    foundedYear: 2024,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 15,
    reasonForSale: 'Growth slower than target; selling to focus on another B2B bet.',
    highlights: ['Conditional logic', 'Webhooks', 'Sheets export'],
    gallery: [
      { label: 'Builder', tone: '#12141C' },
      { label: 'Logic', tone: '#181A24' },
      { label: 'Responses', tone: '#141820' },
    ],
    description: 'Multi-step form builder with conditional logic and webhooks.',
    websiteUrl: 'https://example.com/formora',
    mrrPence: 31000,
    askingPricePence: 720000,
    grade: 'B',
    score: 68,
    verificationNotes: 'Manual review: product demo + sample subscriber list.',
  },
  {
    slug: 'clipstack',
    title: 'ClipStack',
    tagline: 'Short-clip library for creators',
    niche: 'Creator Tools',
    techStack: 'SvelteKit, R2, Cloudflare',
    foundedYear: 2024,
    featured: false,
    businessModel: 'SaaS subscription',
    customersApprox: 11,
    reasonForSale: 'Early-stage; fits an operator buyer.',
    highlights: ['Clip tagging', 'Private links', 'Fast search'],
    gallery: [
      { label: 'Library', tone: '#101014' },
      { label: 'Tags', tone: '#16161C' },
      { label: 'Share', tone: '#121218' },
    ],
    description: 'Upload, tag, and search short clips. Limited revenue growth to date.',
    websiteUrl: 'https://example.com/clipstack',
    mrrPence: 26000,
    askingPricePence: 580000,
    grade: 'C',
    score: 58,
    verificationNotes: 'Manual review: product works; revenue growth reported as limited.',
  },
  {
    slug: 'another-breath',
    title: 'Another Breath',
    tagline: 'Generative art from breath patterns — with a charity pledge',
    niche: 'Creative',
    techStack: 'Vanilla JS, Web Audio, Canvas',
    foundedYear: 2025,
    featured: false,
    businessModel: 'Product asset / impact',
    customersApprox: null,
    reasonForSale: 'Selling the product asset to focus on Cladak.',
    highlights: ['Local audio processing', 'Deterministic Breath ID art', 'Transparent pledge model'],
    gallery: [
      { label: 'Breath', tone: '#0A1018' },
      { label: 'Canvas', tone: '#101820' },
      { label: 'Cert', tone: '#0E1614' },
    ],
    description:
      'Web experience that turns a breath pattern into deterministic generative art. No subscription MRR; priced as a product/brand asset.',
    websiteUrl: 'https://mmhaidari2-hash.github.io/another-breath/',
    mrrPence: null,
    askingPricePence: 450000,
    grade: 'B',
    score: 66,
    verificationNotes: 'Manual review: public demo is live. No MRR.',
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
        { key: 'verified_mrr_growth', label: 'Verified MRR growth', weight: 30 },
        { key: 'churn_rate', label: 'Churn rate', weight: 20 },
        { key: 'traffic_trend_6mo', label: 'Traffic trend (6 mo)', weight: 20 },
        { key: 'ui_ux_review_score', label: 'Manual UI/UX review', weight: 15 },
        { key: 'time_on_market', label: 'Time on market', weight: 15 },
      ]),
      gradeBands: JSON.stringify({ A: 85, B: 65, C: 40 }),
    },
  });

  const sellerPass = hashPassword('SellerPass123!');
  const adminPass = hashPassword('AdminPass123!');

  const seller = await prisma.user.upsert({
    where: { email: 'seller@cladak.com' },
    update: {
      name: 'Portfolio Seller',
      role: 'SELLER',
      passwordHash: sellerPass,
    },
    create: {
      email: 'seller@cladak.com',
      name: 'Portfolio Seller',
      role: 'SELLER',
      passwordHash: sellerPass,
    },
  });

  await prisma.user.upsert({
    where: { email: 'ops@cladak.com' },
    update: {
      name: 'Cladak Ops',
      role: 'ADMIN',
      passwordHash: adminPass,
    },
    create: {
      email: 'ops@cladak.com',
      name: 'Cladak Ops',
      role: 'ADMIN',
      passwordHash: adminPass,
    },
  });

  await prisma.user.upsert({
    where: { email: 'cofounder@cladak.com' },
    update: {
      name: 'Co-founder',
      role: 'COFOUNDER',
      passwordHash: hashPassword('CofounderPass123!'),
    },
    create: {
      email: 'cofounder@cladak.com',
      name: 'Co-founder',
      role: 'COFOUNDER',
      passwordHash: hashPassword('CofounderPass123!'),
    },
  });

  for (const item of LISTINGS) {
    const multiple =
      item.mrrPence && item.mrrPence > 0
        ? Math.round((item.askingPricePence / (item.mrrPence * 12)) * 10) / 10
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
      demoPolicy: item.slug === 'another-breath' ? 'PUBLIC' : 'INTRO_ONLY',
      mrrPence: item.mrrPence,
      askingPricePence: item.askingPricePence,
      grade: item.grade,
      score: item.score,
      verificationNotes: item.verificationNotes,
      businessModel: item.businessModel,
      customersApprox: item.customersApprox,
      reasonForSale: item.reasonForSale,
      highlights: JSON.stringify(item.highlights),
      gallery: JSON.stringify(item.gallery),
      mrrHistory: item.mrrPence ? JSON.stringify(history(item.mrrPence)) : null,
      multiple,
      category: 'Micro-SaaS',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      evidenceRevenue: item.mrrPence != null,
      evidenceProduct: true,
      evidenceUi: true,
      evidenceRevenueUrl: item.mrrPence
        ? `https://dashboard.stripe.com/test/revenue/${item.slug}`
        : null,
      evidenceProductUrl: item.websiteUrl || `https://example.com/${item.slug}`,
      swornEvidence: true,
      evidenceNotes: 'Seed evidence pack for demo listings.',
      sellerId: seller.id,
    };

    await prisma.listing.upsert({
      where: { slug: item.slug },
      update: payload,
      create: { slug: item.slug, ...payload },
    });
  }

  await prisma.platformConfig.upsert({
    where: { id: 'default' },
    update: {
      supportEmail: 'support@cladak.com',
      governingLaw: 'England and Wales',
      successFeeMinBps: 300,
      successFeeMaxBps: 500,
      nonCircumventionDays: 730,
      autoIntroduceLeads: true,
      autoVerifyOnSubmit: false,
      verifyWhenEvidenceComplete: true,
      purgeAccountsOnClose: true,
      escrowPartnerName: 'Escrow.com',
      escrowPartnerUrl: 'https://www.escrow.com',
    },
    create: {
      id: 'default',
      supportEmail: 'support@cladak.com',
      governingLaw: 'England and Wales',
      autoIntroduceLeads: true,
      autoVerifyOnSubmit: false,
      verifyWhenEvidenceComplete: true,
      purgeAccountsOnClose: true,
      escrowPartnerName: 'Escrow.com',
      escrowPartnerUrl: 'https://www.escrow.com',
    },
  });

  console.log(`Seeded ${LISTINGS.length} English verified listings + auth users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
