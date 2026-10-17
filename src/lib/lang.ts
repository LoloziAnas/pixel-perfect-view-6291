import { useEffect, useState } from "react";

export type Lang = "fr" | "ar";

const KEY = "noauma-lang";

export function setDocumentLang(lang: Lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

// Starts as "fr" to match the server render, then restores the saved choice.
export function useLang() {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "ar") setLang("ar");
    } catch {
      // Storage unavailable (private mode, blocked cookies): keep the default.
    }
  }, []);

  useEffect(() => {
    setDocumentLang(lang);
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      // Ignore: the choice just won't persist.
    }
  }, [lang]);

  return [lang, setLang] as const;
}
