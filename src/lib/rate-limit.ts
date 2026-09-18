// Rate limiter ساده‌ی in-memory برای فاز ۱ (یک سرور، بدون نیاز به Redis).
// وقتی بیشتر از یک instance سرور داشتیم (فاز ۲+)، این باید با یک
// rate limiter مبتنی بر Redis (مثل Upstash) جایگزین بشه، چون حافظه‌ی
// in-memory بین instance‌های مختلف مشترک نیست.

const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // ۱ دقیقه
const MAX_REQUESTS = 5; // حداکثر ۵ درخواست در دقیقه به‌ازای هر کلید

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}
