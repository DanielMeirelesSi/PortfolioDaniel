"use client";

import { useState } from "react";
import { useLang } from "@/context/lang";
import { projects, type Project } from "@/data/content";
import Reveal from "./Reveal";
import Preview from "./Previews";
import { GitHubIcon, ExternalIcon } from "./Icons";

const STEP = 3;

function Cover({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  if (project.image && !failed) {
    return (
      <img
        className="pcover-img"
        src={project.image}
        alt={project.title}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return <Preview id={project.id} />;
}

export default function Projects() {
  const { t, lang } = useLang();
  const [visible, setVisible] = useState(STEP);
  const total = projects.length;
  const shown = projects.slice(0, visible);

  return (
    <section className="projects" id="projetos">
      <div className="proj-head">
        <div className="proj-head-text">
          <h2 className="sec-title">{t.projectsTitle}</h2>
          <p className="sec-sub">{t.projectsSub}</p>
        </div>
        <a className="cta" href="#contato">
          {t.contactCta} <span className="arr">↗</span>
        </a>
      </div>

      <div className="pgrid">
        {shown.map((p, i) => {
          const c = p[lang];
          return (
            <Reveal key={p.id} as="article" className="pcard" delay={(i % STEP) * 0.06}>
              <div className="pcover">
                <span className={`pbadge ${p.status === "dev" ? "dev" : ""}`}>
                  {p.status === "dev" ? t.statusDev : t.statusDone}
                </span>
                <Cover project={p} />
              </div>
              <div className="pcard-body">
                <h3 className="pcard-title">{p.title}</h3>
                <p className="pcard-desc">{c.desc}</p>
                <div className="ptags">
                  {p.tags.map((tag) => (
                    <span className="ptag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pcard-links">
                  {p.site && (
                    <a className="pcard-link site" href={p.site} target="_blank" rel="noopener noreferrer">
                      {ExternalIcon} {t.siteLabel}
                    </a>
                  )}
                  <a className="pcard-link repo" href={p.repo} target="_blank" rel="noopener noreferrer">
                    {GitHubIcon} {t.repoLabel}
                  </a>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {total > STEP && (
        <div className="showrow">
          {visible < total && (
            <button className="showbtn" onClick={() => setVisible((v) => Math.min(v + STEP, total))}>
              {t.showMore}
            </button>
          )}
          {visible > STEP && (
            <button className="showbtn ghost" onClick={() => setVisible((v) => Math.max(STEP, v - STEP))}>
              {t.showLess}
            </button>
          )}
        </div>
      )}
    </section>
  );
}