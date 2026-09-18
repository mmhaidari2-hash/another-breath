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

type Ctx = {
  lang: Lang;
  t: Copy;
  setLang: (l: Lang) => void;
  dir: 'rtl' | 'ltr';
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fa');

  useEffect(() => {
    const saved = window.localStorage.getItem('cladak-lang') as Lang | null;
    if (saved === 'fa' || saved === 'en') setLangState(saved);
    else if ((navigator.language || '').toLowerCase().startsWith('en')) setLangState('en');
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem('cladak-lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
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
    }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
