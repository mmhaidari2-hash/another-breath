export default function HowItWorks() {
  const steps = [
    {
      n: '۰۱',
      title: 'ثبت محصول',
      body: 'فروشنده محصول را ثبت می‌کند. تا قبل از بررسی، در فهرست عمومی دیده نمی‌شود.',
    },
    {
      n: '۰۲',
      title: 'بررسی دستی',
      body: 'درآمد، محصول، و کیفیت UI بررسی می‌شود. یادداشت بررسی همراه لیستینگ می‌ماند.',
    },
    {
      n: '۰۳',
      title: 'انتشار و تماس',
      body: 'فقط پس از تأیید، لیستینگ عمومی می‌شود. خریدار از طریق فرم، مستقیم درخواست می‌دهد.',
    },
  ];

  return (
    <section id="how" className="relative z-10 border-t border-line bg-ink-raised/40 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm tracking-widest text-sea">نحوه کار</p>
        <h2 className="mt-3 font-display text-4xl text-mist sm:text-5xl">تأیید قبل از نمایش</h2>
        <p className="mt-4 max-w-2xl text-mist-muted">
          بج «تأییدشده» فقط وقتی ظاهر می‌شود که بررسی دستی انجام شده باشد — نه به‌عنوان دکوراسیون.
        </p>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="relative">
              <span className="font-display text-5xl text-sea/40">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-mist">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
