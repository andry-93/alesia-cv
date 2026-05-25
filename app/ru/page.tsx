import type { Metadata } from 'next';
import { CvPage } from '@/components/cv/CvPage';
import { buildPageMetadata } from '@/lib/metadata';
import { buildPersonJsonLd } from '@/lib/jsonld';

export const metadata: Metadata = buildPageMetadata('ru');

export default function RuPage() {
  const jsonLd = buildPersonJsonLd('ru');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CvPage locale="ru" />
    </>
  );
}
