"use client";

import { useLang } from "@/context/lang";

export default function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button className="lang" aria-label="Mudar idioma" onClick={toggle}>
      <b>{lang.toUpperCase()}</b>
      <span className="sep">/</span>
      <span>{lang === "pt" ? "EN" : "PT"}</span>
    </button>
  );
}
