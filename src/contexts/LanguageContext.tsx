"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";
import ko from "@/locales/ko.json";
import vi from "@/locales/vi.json";

export type Locale = "en" | "zh" | "ko" | "vi";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translationsMap: Record<Locale, Record<string, any>> = { en, zh, ko, vi };

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

function getNested(obj: Record<string, any>, path: string): string {
  const keys = path.split(".");
  let current: any = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = current[key];
    if (current === undefined) return path;
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("tcm_locale") as Locale | null;
    if (stored && ["en", "zh", "ko", "vi"].includes(stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("tcm_locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNested(translationsMap[locale], key);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
