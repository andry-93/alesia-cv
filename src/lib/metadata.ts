import type { Metadata } from 'next';
import { cvData } from '@/content/cv';
import type { Locale } from '@/types/cv';
import { SITE_URL } from '@/lib/site';

export function buildPageMetadata(locale: Locale): Metadata {
  const d = cvData[locale];
  const path = locale === 'ru' ? '/ru' : '/';

  return {
    metadataBase: new URL(SITE_URL),
    title: d.pageTitle,
    description: d.about.text,
    alternates: {
      canonical: path,
      languages: { en: '/', ru: '/ru', 'x-default': '/' }
    },
    openGraph: {
      type: 'profile',
      title: d.pageTitle,
      description: d.about.text,
      url: `${SITE_URL}${path}`,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      siteName: 'Alesia Zayats CV'
    },
    twitter: {
      card: 'summary',
      title: d.pageTitle,
      description: d.about.text
    }
  };
}
