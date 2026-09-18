import Link from 'next/link';

export default function SellCTA() {
  return (
    <section className="relative z-10 border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-ink-raised to-ink px-8 py-14 sm:px-14">
          <div
            className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-sea/20 blur-3xl"
            aria-hidden="true"
          />
          <p className="text-sm tracking-widest text-bronze">فروشندگان</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl text-mist sm:text-5xl">
            محصولت را برای بررسی بفرست
          </h2>
          <p className="mt-4 max-w-lg text-mist-muted">
            ثبت رایگان است. تا وقتی تأیید نشود، عمومی نمی‌شود. کارمزد فقط روی معامله‌ی بسته‌شده.
          </p>
          <Link href="/sell" className="btn-primary mt-8">
            شروع فروش
          </Link>
        </div>
      </div>
    </section>
  );
}
