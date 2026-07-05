"use client";

import { useLang } from "@/context/lang";
import { socials } from "@/data/content";
import Reveal from "./Reveal";
import { MailIcon, LinkedInIcon } from "./Icons";

export default function Contact() {
  const { t } = useLang();

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${socials.email}`;

  return (
    <section className="contact" id="contato">
      <div className="sec-head">
        <h2 className="sec-title">{t.contactTitle}</h2>
      </div>

      <Reveal className="contact-box">
        <p className="contact-lead">{t.contactLead}</p>
        <div className="contact-actions">
          <a className="cbtn cbtn-primary" href={gmailHref} target="_blank" rel="noopener noreferrer">
            {MailIcon}
            <span>{t.contactEmailBtn}</span>
          </a>
          <a className="cbtn cbtn-in" href={socials.linkedin} target="_blank" rel="noopener noreferrer">
            {LinkedInIcon}
            <span>{t.contactLinkedinBtn}</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}