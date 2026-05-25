import { cvData } from '@/content/cv';
import type { Locale } from '@/types/cv';
import { getUi } from '@/lib/i18n';
import { CvPageClient } from './CvPageClient';
import { LocaleSwitch } from './LocaleSwitch';

function shortUrl(url: string) {
  if (url.includes('linkedin.com')) return url.split('/in/')[1]?.split('/')[0] || url;
  if (url.includes('t.me')) return '@' + (url.split('t.me/')[1]?.split('/')[0] || url);
  return url;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3-$4-$5');
}

export function CvPage({ locale }: { locale: Locale }) {
  const d = cvData[locale];
  const t = getUi(locale);

  return (
    <>
      <CvPageClient />
      <header className="header" id="header">
        <a href="#hero" className="logo" id="logo">{d.name}</a>
        <ul className="nav-links" id="navLinks">
          {d.nav.map((item) => <li key={item.id}><a href={`#${item.id}`} className="nav-link">{item.label}</a></li>)}
        </ul>
        <LocaleSwitch locale={locale} className={`lang-toggle ${locale === 'ru' ? 'ru' : ''}`} />
        <div className="burger-menu" id="burgerMenu"><span /><span /><span /></div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <ul className="mobile-nav-links" id="mobileNavLinks">
          {d.nav.map((item) => <li key={`m-${item.id}`}><a href={`#${item.id}`} className="mobile-nav-link">{item.label}</a></li>)}
          <li className="mobile-lang-item">
            <div className="mobile-lang-dock">
              <span className="mobile-lang-label">{t.language}</span>
              <LocaleSwitch locale={locale} className={`lang-toggle mobile-lang-toggle ${locale === 'ru' ? 'ru' : ''}`} />
            </div>
          </li>
        </ul>
      </div>

      <div className="container">
        <section id="hero" className="hero">
          <h1 id="heroName">{d.name}</h1>
          <p id="heroTitle" className="hero-title">{d.heroTitle}</p>
          <p id="heroLocation" className="hero-location">{d.heroLocation}</p>
          <span id="heroStatus" className="status-dot" role="status" aria-label={d.heroStatus}>{d.heroStatus}</span>
        </section>

        <section id="about">
          <h2 id="aboutTitle">{d.about.title}</h2>
          <div className="glass-card about-card"><p id="aboutText">{d.about.text}</p></div>
        </section>

        <section id="achievements">
          <h2 id="achievementsTitle">{d.achievements.title}</h2>
          <div className="stats" id="achievementsStats">
            {d.achievements.items.map((item) => (
              <div className="stat-item" key={`${item.number}-${item.label}`}>
                <div className="stat-number"><span>{item.number}</span></div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills">
          <h2 id="skillsTitle">{d.skills.title}</h2>
          <div className="skills-grid" id="skillsGrid">
            {d.skills.items.map((skill) => <div className="glass-card skill-card" key={skill}>{skill}</div>)}
          </div>
        </section>

        <section id="experience">
          <h2 id="experienceTitle">{d.experience.title}</h2>
          <div id="experienceList">
            {d.experience.items.map((exp) => (
              <div className="glass-card experience-card" key={`${exp.company}-${exp.period}`}>
                <div className="experience-date">{exp.period}</div>
                <div>
                  <strong className="company-name">{exp.company}</strong>
                  <p className="position-title">{exp.position}</p>
                  {exp.paragraphs.map((p) => <p key={p}>{p}</p>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="education">
          <h2 id="educationTitle">{d.education.title}</h2>
          <div id="educationList">
            {d.education.items.map((edu) => (
              <div className="glass-card experience-card" key={`${edu.institution}-${edu.period}`}>
                <div className="experience-date">{edu.period}</div>
                <div>
                  <strong className="company-name">{edu.institution}</strong>
                  <p>{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="certificates">
          <h2 id="certificatesTitle">{d.certificates.title}</h2>
          <div className="cert-grid" id="certificatesList">
            {d.certificates.items.map((cert) => (
              <div className="cert-card glass-card" key={`${cert.file}-${cert.date}`}>
                <img src={`/img/${cert.file}`} alt={cert.name} className="cert-img" loading="lazy" />
                <div className="cert-body">
                  <strong className="cert-name">{cert.name}</strong>
                  <span className="cert-date">{cert.date}</span>
                  <span className="cert-issuer">{cert.issuer}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="languages">
          <h2 id="languagesTitle">{d.languages.title}</h2>
          <div id="languagesList">
            {d.languages.items.map((item) => (
              <div className="glass-card lang-card" key={`${item.name}-${item.level}`}>
                <span className="lang-name">{item.name}</span>
                <span className="lang-level">{item.level}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contact">
          <h2 id="contactTitle">{d.contact.title}</h2>
          <div className="contact" id="contactList">
            <div className="glass-card contact-item"><span className="contact-icon"><i className="fas fa-map-marker-alt" /></span><span>{d.contact.location}</span></div>
            <div className="glass-card contact-item"><span className="contact-icon"><i className="fas fa-envelope" /></span><a href={`mailto:${d.contact.email}`} className="nav-link">{d.contact.email}</a></div>
            <div className="glass-card contact-item"><span className="contact-icon"><i className="fas fa-phone" /></span><a href={`tel:${d.contact.phone}`} className="nav-link">{formatPhone(d.contact.phone)}</a></div>
            <div className="glass-card contact-item"><span className="contact-icon"><i className="fab fa-linkedin" /></span><a href={d.contact.linkedin} className="nav-link" target="_blank">{shortUrl(d.contact.linkedin)}</a></div>
            <div className="glass-card contact-item"><span className="contact-icon"><i className="fab fa-telegram-plane" /></span><a href={d.contact.telegram} className="nav-link" target="_blank">{shortUrl(d.contact.telegram)}</a></div>
          </div>
          <div className="cv-download-wrapper">
            <a href={d.contact.cvFile} download className="cv-download-btn" id="downloadBtn">
              <i className="fas fa-download" /> <span id="downloadLabel">{t.download}</span>
            </a>
          </div>
        </section>
      </div>

      <button className="scroll-top" id="scrollTop" aria-label={t.scrollUp}><i className="fas fa-arrow-up" /></button>

      <div id="lightbox" className="lightbox">
        <img id="lightboxImg" className="lightbox-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />
      </div>
    </>
  );
}
