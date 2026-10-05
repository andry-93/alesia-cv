import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-05T11:53:28+03:00');

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${SITE_URL}/ru`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9
    }
  ];
}
