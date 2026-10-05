# Next.js + TypeScript Migration Design (EN `/`, RU `/ru`)

## Context

Current project is a static CV site with:

- Rendering via `index.html` + `script.js` + `data.js`
- Language switching via query param (`?lang=ru`)
- Client-side SEO updates in JS (`title`, meta tags, canonical, JSON-LD)
- Static `sitemap.xml` and `robots.txt`

Target state:

- Next.js application with TypeScript typing
- Language routing by path, not query params
- Canonical EN route at `/`
- RU route at `/ru`
- SEO metadata and structured data always matching selected route language
- No commits in this migration session

## Goals and Non-Goals

### Goals

1. Migrate to Next.js App Router with strict TS typing for content model.
2. Replace `?lang=ru` routing with path-based localization:
   - EN: `/`
   - RU: `/ru`
3. Ensure route-level SEO correctness:
   - Canonical
   - hreflang alternates
   - OpenGraph/Twitter metadata
   - JSON-LD localized per route
4. Preserve existing visual presentation and interaction behavior as baseline.
5. Keep legacy URLs index-safe with redirects.

### Non-Goals

1. No redesign of CV information architecture.
2. No major visual rewrite during migration phase.
3. No CMS integration.
4. No additional languages in this phase.

## Recommended Approach

Use Next.js App Router with two explicit pages and shared typed content/components.

- `app/page.tsx` for EN
- `app/ru/page.tsx` for RU
- Shared component tree + typed dictionary data source

Why this approach:

- Minimal complexity for two-language setup
- Clean SEO surface with deterministic URLs
- Avoids middleware-heavy locale prefix logic when EN must remain unprefixed

## Architecture

### Routing

- EN default route: `/`
- RU route: `/ru`
- Legacy query redirect rules:
  - `/?lang=ru` -> `/ru`
  - `/?lang=en` -> `/`

Redirects can be implemented in `next.config.ts` (preferred for simplicity) or middleware if query handling requires more control.

### Data Layer

Move `data.js` into TS modules:

- `src/types/cv.ts` - all interfaces and utility types
- `src/content/cv.ts` - localized dataset `{ en, ru }` typed against interfaces

Core types:

- `Locale = 'en' | 'ru'`
- `CvData` (page-level model)
- section models (`Hero`, `About`, `ExperienceItem`, `CertificateItem`, etc.)

### UI Layer

Use shared section components so both locales render the same structure:

- `src/components/cv/CvPage.tsx`
- `src/components/sections/*`

Split by rendering needs:

- Server components for static content sections
- Client components only where browser APIs are needed (menu, scroll behavior, lightbox, reveal animation)

### Styling

- Migrate `style.css` baseline into `app/globals.css`
- Keep class names and structure close to current version in phase 1 to reduce regression risk

### Static Assets

- Move images to `public/img/*`
- Keep CV file at `public/Alesia_Zayats_CV.docx`

## SEO and i18n Rules

### Metadata

Each route exports language-specific metadata with `generateMetadata()`:

- localized `title` and `description`
- localized OG/Twitter title and description
- route-specific `openGraph.url`
- route-specific locale (`en_US` / `ru_RU`)

### Canonical and Hreflang

For `/`:

- canonical: `/`
- alternates: `en=/`, `ru=/ru`, `x-default=/`

For `/ru`:

- canonical: `/ru`
- alternates: `en=/`, `ru=/ru`, `x-default=/`

### JSON-LD

Create a typed JSON-LD builder and render localized `Person` schema per route:

- `url` reflects route (`/` or `/ru`)
- `description`, `jobTitle`, `knowsAbout` use locale data
- `inLanguage` reflects active locale

### Sitemap and Robots

Use Next route handlers:

- `app/sitemap.ts` with exactly two entries (`/`, `/ru`)
- `app/robots.ts` with `Allow: /` and sitemap URL

This replaces manual static XML/TXT and keeps SEO outputs aligned with route structure.

## Interaction Migration

Migrate current client behaviors from `script.js` into focused client components/hooks:

1. Language toggle (`/` <-> `/ru`) via `next/link`
2. Mobile menu open/close and close-on-nav-click
3. Header shrink on scroll
4. Scroll-to-top button visibility and action
5. Certificate lightbox with Escape handling
6. Section reveal animation via IntersectionObserver

Implementation rule: each behavior includes proper listener cleanup in `useEffect`.

## Validation Strategy

### Functional

- `/` renders EN content
- `/ru` renders RU content
- language toggle switches route correctly
- all existing sections render complete content in both locales

### SEO

Per route verify:

- `<html lang>`
- canonical
- hreflang links
- OG/Twitter metadata
- JSON-LD localized fields (`description`, `jobTitle`, `knowsAbout`, `url`, `inLanguage`)

Global verify:

- `sitemap.xml` contains `/` and `/ru`
- `robots.txt` references sitemap
- legacy query URLs redirect correctly

### Regression

- mobile and desktop layout parity check
- anchor navigation check
- certificate image loading/lightbox check
- CV download link check

## Risks and Mitigations

1. **SEO regression during URL change**
   - Mitigation: legacy redirects + canonical/hreflang consistency.
2. **Client/server rendering mismatch**
   - Mitigation: keep content rendering server-side; isolate browser-only behavior in client components.
3. **EN/RU data drift**
   - Mitigation: strict TS interfaces and compile-time enforcement.
4. **Visual regressions**
   - Mitigation: phase-1 CSS parity, incremental refactors after functional parity is reached.

## Definition of Done

1. Next.js + TS app runs locally and builds successfully.
2. EN canonical route is `/`; RU route is `/ru`.
3. Query-param language logic is removed from runtime behavior.
4. `/?lang=ru` legacy traffic is redirected to `/ru`.
5. Route-specific SEO output is fully localized and server-rendered.
6. Sitemap and robots are generated by Next and valid.
7. UI/UX parity with current page is acceptable on desktop and mobile.
8. No commits are created in this session.
