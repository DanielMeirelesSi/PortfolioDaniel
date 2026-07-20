"use client";

import { useState } from "react";
import { useLang } from "@/context/lang";
import { projects, categories, type Project, type CategoryId } from "@/data/content";
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
  const [active, setActive] = useState<CategoryId>("all");
  const [visible, setVisible] = useState(STEP);

  const catLabel = (id: CategoryId) => {
    const found = categories.find((c) => c.id === id);
    return found ? found[lang] : id;
  };

  const filtered = active === "all" ? projects : projects.filter((p) => p.categories.includes(active));
  const shown = filtered.slice(0, visible);

  const selectCat = (id: CategoryId) => {
    setActive(id);
    setVisible(STEP);
  };

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

      <div className="pfilter">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`pfilter-btn ${active === c.id ? "active" : ""}`}
            onClick={() => selectCat(c.id)}
          >
            {c[lang]}
          </button>
        ))}
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
                <div className="pcat-row">
                  {p.categories.map((cat) => (
                    <span className="pcat" key={cat}>
                      {catLabel(cat)}
                    </span>
                  ))}
                </div>
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
                  {p.repo && (
                    <a className="pcard-link repo" href={p.repo} target="_blank" rel="noopener noreferrer">
                      {GitHubIcon} {t.repoLabel}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {filtered.length > STEP && (
        <div className="showrow">
          {visible < filtered.length && (
            <button className="showbtn" onClick={() => setVisible((v) => Math.min(v + STEP, filtered.length))}>
              {t.showMore}
            </button>
          )}
          {visible > STEP && (
            <button className="showbtn ghost" onClick={() => setVisible(STEP)}>
              {t.showLess}
            </button>
          )}
        </div>
      )}
    </section>
  );
}