import Link from 'next/link';
import QuestionsDesk from '@/components/QuestionsDesk';
import { KEY_QUESTIONS } from '@/data/key-questions';

export const metadata = {
  title: '50 Key Questions — Cladak Diligence Pack',
  description:
    'Investor, buyer, seller, and auditor questions mapped to live product answers.',
};

export default function QuestionsPage() {
  return (
    <main className="pb-24 pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/trust" className="text-sm text-coal-mute hover:text-coal">
          Trust Center
        </Link>
        <p className="eyebrow mt-8">Diligence pack</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight">
          50 key questions
        </h1>
        <p className="mt-4 max-w-2xl text-coal-soft">
          Investor · Buyer · Seller · Auditor — every answer mapped to what Cladak has in product,
          what is covered by policy, or what we honestly put on the roadmap.
        </p>
        <p className="mt-2 font-mono text-[11px] text-coal-mute">
          {KEY_QUESTIONS.length} questions · linked to live product pages
        </p>
        <QuestionsDesk />
      </div>
    </main>
  );
}
