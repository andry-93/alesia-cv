# Alesia Zayats — CV Website (Next.js)

Lead IT Recruiter / Recruitment Team Lead — CV-сайт с EN/RU локализацией.

## Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Localization

- EN route: `/` (canonical)
- RU route: `/ru`
- Legacy compatibility: `/?lang=ru` permanently redirects to `/ru`

## Locale behavior

- First visit without preference:
  - RU browser language redirects `/` -> `/ru`
  - non-RU stays on `/`
- Manual language switch persists in:
  - cookie: `locale=en|ru`
  - localStorage: `locale`
- Manual selection always has priority over auto-detection.

## Vercel Deployment

1. Import repository in Vercel.
2. Framework preset: `Next.js`.
3. Add environment variable:
   - `NEXT_PUBLIC_SITE_URL` = your production domain (for example `https://alesia-cv.vercel.app`).
4. Deploy.

After deploy, verify:

- `/` and `/ru` pages render correctly
- `/sitemap.xml` and `/robots.txt` use your production domain
- `/?lang=ru` redirects to `/ru`

## SEO

- Route-level metadata per locale (`title`, `description`, OG, Twitter)
- Route-level JSON-LD per locale
- Next-generated `sitemap.xml` and `robots.txt`
