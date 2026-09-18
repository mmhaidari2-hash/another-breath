'use client';

import { useEffect, useState } from 'react';

const WATCH_KEY = 'cladak-watch';
const COMPARE_KEY = 'cladak-compare';

function read(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) || '[]') as string[];
  } catch {
    return [];
  }
}

function write(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event('cladak-store'));
}

export function useWatchCompare() {
  const [watch, setWatch] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setWatch(read(WATCH_KEY));
      setCompare(read(COMPARE_KEY));
    };
    sync();
    window.addEventListener('cladak-store', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cladak-store', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggleWatch = (id: string) => {
    const next = watch.includes(id) ? watch.filter((x) => x !== id) : [...watch, id];
    write(WATCH_KEY, next);
    setWatch(next);
  };

  const toggleCompare = (id: string) => {
    let next = compare.includes(id) ? compare.filter((x) => x !== id) : [...compare, id];
    if (next.length > 3) next = next.slice(next.length - 3);
    write(COMPARE_KEY, next);
    setCompare(next);
  };

  return { watch, compare, toggleWatch, toggleCompare };
}

export function CompareBar() {
  const { compare } = useWatchCompare();
  if (!compare.length) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-coal bg-coal px-4 py-3 text-white">
      <div className="mx-auto flex max-w-shell items-center justify-between gap-4">
        <p className="text-sm">
          Compare selected: <span className="font-mono text-signal">{compare.length}/3</span>
        </p>
        <a href="/compare" className="btn-primary !py-2">
          Open compare
        </a>
      </div>
    </div>
  );
}
