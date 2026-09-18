'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { copy, type Copy, type Lang } from '@/lib/i18n';

const COFOUNDER_KEY = 'cladak-cofounder';

type Ctx = {
  lang: Lang;
  t: Copy;
  setLang: (l: Lang) => void;
  dir: 'rtl' | 'ltr';
  cofounder: boolean;
  unlockCofounder: () => void;
  lockCofounder: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Public product is English-only. Persian only after cofounder unlock.
  const [lang, setLangState] = useState<Lang>('en');
  const [cofounder, setCofounder] = useState(false);

  useEffect(() => {
    const unlocked = window.localStorage.getItem(COFOUNDER_KEY) === '1';
    setCofounder(unlocked);
    if (unlocked) {
      const saved = window.localStorage.getItem('cladak-lang') as Lang | null;
      if (saved === 'fa' || saved === 'en') setLangState(saved);
    } else {
      setLangState('en');
      window.localStorage.setItem('cladak-lang', 'en');
    }
  }, []);

  const setLang = useCallback(
    (l: Lang) => {
      if (l === 'fa' && !cofounder) return;
      setLangState(l);
      window.localStorage.setItem('cladak-lang', l);
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
    },
    [cofounder]
  );

  const unlockCofounder = useCallback(() => {
    window.localStorage.setItem(COFOUNDER_KEY, '1');
    setCofounder(true);
  }, []);

  const lockCofounder = useCallback(() => {
    window.localStorage.removeItem(COFOUNDER_KEY);
    setCofounder(false);
    setLangState('en');
    window.localStorage.setItem('cladak-lang', 'en');
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: copy[lang],
      setLang,
      dir: lang === 'fa' ? 'rtl' : 'ltr',
      cofounder,
      unlockCofounder,
      lockCofounder,
    }),
    [lang, setLang, cofounder, unlockCofounder, lockCofounder]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
