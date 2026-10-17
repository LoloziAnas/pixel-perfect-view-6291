import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar";

const KEY = "noauma-lang";

const LangContext = createContext<readonly [Lang, (lang: Lang) => void] | null>(null);

// Shared across routes so the choice survives navigation. Starts as "fr" to match the
// server render, then restores the saved choice.
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "ar") setLang("ar");
    } catch {
      // Storage unavailable (private mode, blocked cookies): keep the default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      // Ignore: the choice just won't persist.
    }
  }, [lang]);

  const value = useMemo(() => [lang, setLang] as const, [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside <LangProvider>");
  return value;
}
