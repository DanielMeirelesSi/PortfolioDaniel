"use client";

import { useLang } from "@/context/lang";
import { socials } from "@/data/content";
import Reveal from "./Reveal";
import SpotifyNowPlayingCard from "./SpotifyNowPlayingCard";
import { MailIcon, LinkedInIcon, WhatsAppIcon } from "./Icons";

export default function Contact() {
  const { t } = useLang();

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${socials.email}`;
  const waHref = `https://wa.me/${socials.whatsapp}?text=${encodeURIComponent(t.contactWaMsg)}`;

  return (
    <section className="contact" id="contato">
      <div className="sec-head">
        <h2 className="sec-title">{t.contactTitle}</h2>
      </div>

      <div className="contact-grid">
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
            <a className="cbtn cbtn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              {WhatsAppIcon}
              <span>{t.contactWhatsappBtn}</span>
            </a>
          </div>
          <p className="contact-note">{t.contactFreela}</p>
        </Reveal>
        <Reveal className="contact-spotify">
          <div className="contact-spotify-content">
            <h3 className="contact-spotify-title">{t.spotifySectionTitle}</h3>
            <SpotifyNowPlayingCard />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
