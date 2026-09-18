import Link from 'next/link';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

export default async function QuestionsPage() {
  const md = await readFile(path.join(process.cwd(), 'docs/50-key-questions.md'), 'utf8');

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
        <p className="mt-4 text-coal-soft">
          Investor · Buyer · Seller · Auditor — mapped to what Cladak has, added, or defers honestly
          to Phase 2.
        </p>
        <article className="mt-10 space-y-3 border border-coal/12 bg-stone-raised p-6 font-mono text-[12px] leading-relaxed text-coal-soft whitespace-pre-wrap">
          {md}
        </article>
        <p className="mt-6 text-xs text-coal-mute">
          Source file: <code>docs/50-key-questions.md</code>
        </p>
      </div>
    </main>
  );
}
