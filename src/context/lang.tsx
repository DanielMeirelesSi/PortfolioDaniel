"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ui, type Lang, type UIStrings } from "@/data/content";

const LangContext = createContext<{ lang: Lang; toggle: () => void; t: UIStrings }>({
  lang: "pt",
  toggle: () => {},
  t: ui.pt,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "pt" || saved === "en") {
        setLang(saved);
        document.documentElement.lang = saved === "pt" ? "pt-BR" : "en";
      }
    } catch {}
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next: Lang = prev === "pt" ? "en" : "pt";
      try {
        localStorage.setItem("lang", next);
      } catch {}
      document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
      return next;
    });
  };

  return <LangContext.Provider value={{ lang, toggle, t: ui[lang] }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
