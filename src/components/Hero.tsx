"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/lang";
import { socials } from "@/data/content";
import Nav from "./Nav";
import Blob from "./Blob";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

const TICKER: { label: string; bold?: boolean }[] = [
  { label: "C#", bold: true },
  { label: "ASP.NET Core" },
  { label: "Entity Framework" },
  { label: "NestJS", bold: true },
  { label: "Node.js" },
  { label: "React" },
  { label: "MySQL" },
  { label: "MongoDB" },
  { label: "Docker", bold: true },
  { label: "APIs REST" },
  { label: "Git" },
];

function Track() {
  const row = TICKER.map((item, i) => (
    <span key={`t-${i}`}>
      <span>{item.bold ? <b>{item.label}</b> : item.label}</span>
      <i>/</i>
    </span>
  ));
  return (
    <div className="track">
      {row}
      {row}
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const [wi, setWi] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    setWi(0);
  }, [t]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setOut(true);
      setTimeout(() => {
        setWi((w) => (w + 1) % t.roleWords.length);
        setOut(false);
      }, 350);
    }, 2600);
    return () => clearInterval(id);
  }, [t.roleWords.length]);

  return (
    <div className="wrap">
      <div className="grid-bg" />

      <Blob />
      <Nav />

      <main className="hero">
        <p className="eyebrow rise d2">
          {t.rolePrefix} <span className={`rot ${out ? "out" : ""}`}>{t.roleWords[wi]}</span>
        </p>
        <h1 className="name rise d3">Daniel Meireles</h1>

        <div className="hero-socials rise d4">
          <a className="social-btn" href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            {GitHubIcon}
          </a>
          <a className="social-btn" href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            {LinkedInIcon}
          </a>
        </div>
      </main>

      <div className="ticker rise d4">
        <Track />
      </div>
    </div>
  );
}
