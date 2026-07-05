"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/lang";
import { socials } from "@/data/content";
import ThemeToggle from "./ThemeToggle";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { label: t.nav[0], href: "#projetos" },
    { label: t.nav[1], href: "#sobre" },
    { label: t.nav[2], href: "#contato" },
    { label: t.nav[3], href: socials.cv, download: true },
  ];

  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <>
      <nav className="rise d1">
        <span className="mark">
          <span className="dot" />
          Daniel Meireles
        </span>
        <div className="navright">
          <div className="links">
            {links.map((l, i) => (
              <a key={i} href={l.href} className={i === 0 ? "on" : ""} {...(l.download ? { download: true } : {})}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="ctrls">
            <ThemeToggle />
            <LangToggle />
            <button
              className="burger"
              aria-label="Menu"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
            >
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobilemenu ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        {links.map((l, i) => (
          <a key={i} href={l.href} {...(l.download ? { download: true } : {})}>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
