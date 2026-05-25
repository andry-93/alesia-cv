import { cvData } from '@/content/cv';
import type { Locale } from '@/types/cv';
import { SITE_URL } from '@/lib/site';

export function buildPersonJsonLd(locale: Locale) {
  const d = cvData[locale];
  const path = locale === 'ru' ? '/ru' : '/';
  const pageUrl = `${SITE_URL}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: d.name,
    jobTitle: d.heroTitle,
    description: d.about.text,
    address: {
      '@type': 'PostalAddress',
      addressLocality: d.contact.location.split(',')[1]?.trim() ?? d.contact.location,
      addressCountry: 'BY'
    },
    email: d.contact.email,
    telephone: d.contact.phone,
    url: pageUrl,
    inLanguage: locale,
    sameAs: [d.contact.linkedin, d.contact.telegram],
    knowsAbout: d.skills.items,
    alumniOf: d.education.items.map((i) => i.institution),
    worksFor: d.experience.items[0]?.company
      ? { '@type': 'Organization', name: d.experience.items[0].company }
      : undefined
  };
}
