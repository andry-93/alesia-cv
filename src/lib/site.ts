const DEFAULT_SITE_URL = 'https://alesia-cv.vercel.app';

function normalizeSiteUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
);
