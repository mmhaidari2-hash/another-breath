import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-plane relative min-h-[100svh] overflow-hidden pt-16">
      {/* Full-bleed atmospheric visual plane */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/4 h-[42vmin] w-[42vmin] animate-breathe rounded-full bg-sea/20 blur-3xl" />
        <div className="absolute -right-16 bottom-1/4 h-[50vmin] w-[50vmin] animate-drift rounded-full bg-bronze/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        {/* Abstract product constellation */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.14]"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M120 620 C280 480, 420 520, 560 400 S880 220, 1080 280"
            stroke="#3d9b8f"
            strokeWidth="1.2"
          />
          <path
            d="M80 240 C260 300, 400 180, 620 260 S900 380, 1120 300"
            stroke="#c4a574"
            strokeWidth="1"
            opacity="0.7"
          />
          <circle cx="560" cy="400" r="4" fill="#3d9b8f" />
          <circle cx="280" cy="480" r="3" fill="#c4a574" />
          <circle cx="880" cy="220" r="3.5" fill="#3d9b8f" />
          <circle cx="620" cy="260" r="2.5" fill="#e8ebe6" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
        <p
          className="animate-rise mb-5 font-display text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.9] tracking-tight text-mist"
          style={{ animationDelay: '0.05s' }}
        >
          CLADAK
        </p>
        <p
          className="animate-rise mb-3 text-lg text-sea sm:text-xl"
          style={{ animationDelay: '0.15s' }}
        >
          کلادک
        </p>
        <h1
          className="animate-rise max-w-2xl text-balance text-2xl font-medium leading-snug text-mist sm:text-3xl"
          style={{ animationDelay: '0.25s' }}
        >
          خرید و فروش Micro-SaaS تأییدشده — نه ادعا، نه آمار ساختگی.
        </h1>
        <p
          className="animate-rise mt-4 max-w-xl text-base leading-relaxed text-mist-muted sm:text-lg"
          style={{ animationDelay: '0.35s' }}
        >
          فقط محصولاتی که دستی بررسی شده‌اند در فهرست عمومی دیده می‌شوند. تازه شروع کرده‌ایم؛
          شفاف می‌مانیم.
        </p>
        <div
          className="animate-rise mt-10 flex flex-wrap gap-3"
          style={{ animationDelay: '0.45s' }}
        >
          <Link href="/#listings" className="btn-primary">
            مشاهده لیستینگ‌ها
          </Link>
          <Link href="/sell" className="btn-ghost">
            فروش محصول من
          </Link>
        </div>
      </div>
    </section>
  );
}
