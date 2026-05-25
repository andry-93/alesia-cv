import type { Metadata } from 'next';
import { CvPage } from '@/components/cv/CvPage';
import { buildPageMetadata } from '@/lib/metadata';
import { buildPersonJsonLd } from '@/lib/jsonld';

export const metadata: Metadata = buildPageMetadata('en');

export default function EnPage() {
  const jsonLd = buildPersonJsonLd('en');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CvPage locale="en" />
    </>
  );
}
