import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
      <p className="font-display text-6xl text-sea/50">404</p>
      <h1 className="mt-4 text-xl text-mist">لیستینگ پیدا نشد یا هنوز تأیید نشده</h1>
      <Link href="/" className="btn-primary mt-8">
        بازگشت به خانه
      </Link>
    </main>
  );
}
