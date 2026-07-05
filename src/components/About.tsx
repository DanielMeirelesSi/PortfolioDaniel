"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/lang";
import { stack } from "@/data/content";
import Reveal from "./Reveal";
import { GradIcon } from "./Icons";

export default function About() {
  const { t } = useLang();
  const [si, setSi] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    setSi(0);
  }, [t]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setOut(true);
      setTimeout(() => {
        setSi((s) => (s + 1) % t.skills.length);
        setOut(false);
      }, 350);
    }, 2200);
    return () => clearInterval(id);
  }, [t.skills.length]);

  return (
    <section className="about" id="sobre">
      <div className="sec-head">
        <h2 className="sec-title">{t.aboutTitle}</h2>
      </div>

      <div className="about-grid">
        <div className="about-main">
          <Reveal as="p" className="about-lead">
            {t.aboutLead}
          </Reveal>
          <Reveal className="about-text">
            {t.aboutParas.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>

        <Reveal className="about-media">
          <div className="about-photo">
            <img src="/foto-perfil.jpeg" alt="Daniel Meireles" />
          </div>
          <div className="skills-rot">
            <span className="skills-cap">{t.skillsCap}</span>
            <span className={`skills-word ${out ? "out" : ""}`}>{t.skills[si]}</span>
          </div>
        </Reveal>
      </div>

      <Reveal className="edu">
        <h3 className="edu-title">{t.eduTitle}</h3>
        <div className="edu-card">
          <span className="edu-icon">{GradIcon}</span>
          <div className="edu-info">
            <p className="edu-degree">{t.eduDegree}</p>
            <p className="edu-inst">{t.eduInst}</p>
          </div>
          <span className="edu-status">{t.eduStatus}</span>
        </div>
      </Reveal>

      <Reveal className="edu">
        <h3 className="edu-title">{t.langTitle}</h3>
        <div className="edu-card">
          <div className="edu-info">
            <p className="edu-degree">{t.langName}</p>
            <p className="edu-inst">{t.langLevel}</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="stack">
        {t.aboutCats.map((cat, ci) => (
          <div className="stack-cat" key={cat}>
            <h4>{cat}</h4>
            <div className="stack-grid">
              {(stack[ci] ?? []).map((item) => (
                <div className="tech" key={item.n}>
                  <img src={item.url} alt={item.n} className={item.dark ? "ic-adapt" : ""} loading="lazy" />
                  <span>{item.n}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Reveal>

      <div className="focus">
        {t.focus.map((f, i) => (
          <Reveal key={i} className="focus-item" delay={i * 0.05}>
            <h5>{f.h}</h5>
            <p>{f.p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
