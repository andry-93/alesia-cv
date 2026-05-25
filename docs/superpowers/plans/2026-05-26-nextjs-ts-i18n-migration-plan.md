# Next.js TypeScript i18n Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static CV site to Next.js + TypeScript with EN canonical route at `/`, RU route at `/ru`, and route-correct SEO metadata.

**Architecture:** Use Next.js App Router with two explicit pages (`/` and `/ru`) backed by one typed content source and shared section components. Keep content server-rendered, isolate browser-only interactions into client components, and generate sitemap/robots/metadata from the app layer.

**Tech Stack:** Next.js (App Router), React, TypeScript, CSS (existing styles ported), Metadata API, structured data (JSON-LD)

---

## File Structure Plan

- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/ru/page.tsx`, `app/globals.css`
- Create: `app/sitemap.ts`, `app/robots.ts`
- Create: `src/types/cv.ts`, `src/content/cv.ts`
- Create: `src/lib/site.ts`, `src/lib/metadata.ts`, `src/lib/jsonld.ts`
- Create: `src/components/cv/CvPage.tsx`
- Create: `src/components/cv/CvPageClient.tsx`
- Create: `public/img/*` (copy from current `img/*`), `public/Alesia_Zayats_CV.docx`, `public/googleca5eec5d041d5790.html`
- Modify: `README.md` (new run/build/dev instructions)

### Task 1: Bootstrap Next.js + TypeScript skeleton

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `.gitignore` (append Next ignores if missing)

- [ ] **Step 1: Write failing smoke check by running Next command before setup**

Run: `npm run dev`
Expected: command fails because `package.json` scripts/dependencies are missing.

- [ ] **Step 2: Add project bootstrap files**

`package.json`

```json
{
  "name": "alesia-cv-next",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.3.3",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/node": "22.15.30",
    "@types/react": "19.0.11",
    "@types/react-dom": "19.0.4",
    "typescript": "5.8.3"
  }
}
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
```

`next.config.ts`

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/', has: [{ type: 'query', key: 'lang', value: 'ru' }], destination: '/ru', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'lang', value: 'en' }], destination: '/', permanent: true }
    ];
  }
};

export default nextConfig;
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: install completes and lockfile is generated.

- [ ] **Step 4: Verify bootstrap passes basic checks**

Run: `npm run typecheck`
Expected: passes or reports missing app files (resolved in next tasks).

### Task 2: Define typed content model and migrate `data.js`

**Files:**
- Create: `src/types/cv.ts`
- Create: `src/content/cv.ts`
- Modify: `data.js` (leave as legacy reference or remove after cutover)

- [ ] **Step 1: Write failing type import check**

Create temporary import in `src/content/cv.ts` before type file exists:

```ts
import type { CvDictionary } from '@/types/cv';
```

Run: `npm run typecheck`
Expected: fails with cannot find module `@/types/cv`.

- [ ] **Step 2: Create CV types**

`src/types/cv.ts`

```ts
export type Locale = 'en' | 'ru';

export interface NavItem { id: string; label: string }
export interface AchievementItem { number: string; label: string }
export interface ExperienceItem { period: string; company: string; position: string; paragraphs: string[] }
export interface EducationItem { period: string; institution: string; degree: string }
export interface CertificateItem { file: string; name: string; date: string; issuer: string }
export interface LanguageItem { name: string; level: string }

export interface CvData {
  pageTitle: string;
  name: string;
  heroTitle: string;
  heroStatus: string;
  heroLocation: string;
  nav: NavItem[];
  about: { title: string; text: string };
  achievements: { title: string; items: AchievementItem[] };
  skills: { title: string; items: string[] };
  experience: { title: string; items: ExperienceItem[] };
  education: { title: string; items: EducationItem[] };
  certificates: { title: string; items: CertificateItem[] };
  languages: { title: string; items: LanguageItem[] };
  contact: {
    title: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    telegram: string;
    downloadLabel: string;
    cvFile: string;
  };
}

export type CvDictionary = Record<Locale, CvData>;
```

- [ ] **Step 3: Move localized data into TS dictionary**

`src/content/cv.ts`

```ts
import type { CvDictionary } from '@/types/cv';

export const cvData: CvDictionary = {
  en: {
    pageTitle: 'Alesia Zayats - Lead IT Recruiter',
    name: 'Alesia Zayats',
    heroTitle: 'Lead IT Recruiter / Recruitment Team Lead',
    heroStatus: 'Open to work',
    heroLocation: 'Belarus, Minsk - Remote',
    nav: [
      { id: 'hero', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'achievements', label: 'Achievements' },
      { id: 'skills', label: 'Skills' },
      { id: 'experience', label: 'Experience' },
      { id: 'education', label: 'Education' },
      { id: 'certificates', label: 'Certificates' },
      { id: 'languages', label: 'Languages' },
      { id: 'contact', label: 'Contact' }
    ],
    about: {
      title: 'About',
      text: 'Lead IT Recruiter with 2.5+ years of experience driving full-cycle recruitment and partnering with hiring managers to solve complex hiring challenges. Strong focus on data-driven hiring, market intelligence, and stakeholder consulting. A strategic recruiter who advises business, not just fills roles.'
    },
    achievements: { title: 'Key Achievements', items: [] },
    skills: { title: 'Core Skills', items: [] },
    experience: { title: 'Experience', items: [] },
    education: { title: 'Education', items: [] },
    certificates: { title: 'Certificates', items: [] },
    languages: { title: 'Languages', items: [] },
    contact: {
      title: "Let's Work Together",
      location: 'Belarus, Minsk',
      email: 'alesiaromasko19@gmail.com',
      phone: '+375298508516',
      linkedin: 'https://linkedin.com/in/alesiaromasko',
      telegram: 'https://t.me/lesiaRomashko',
      downloadLabel: 'Download CV',
      cvFile: '/Alesia_Zayats_CV.docx'
    }
  },
  ru: {
    pageTitle: 'Алеся Заяц - Ведущий IT-рекрутер',
    name: 'Алеся Заяц',
    heroTitle: 'Ведущий IT-рекрутер / Руководитель группы подбора',
    heroStatus: 'Открыта к предложениям',
    heroLocation: 'Беларусь, Минск - Удаленно',
    nav: [
      { id: 'hero', label: 'Главная' },
      { id: 'about', label: 'Обо мне' },
      { id: 'achievements', label: 'Достижения' },
      { id: 'skills', label: 'Навыки' },
      { id: 'experience', label: 'Опыт' },
      { id: 'education', label: 'Образование' },
      { id: 'certificates', label: 'Сертификаты' },
      { id: 'languages', label: 'Языки' },
      { id: 'contact', label: 'Контакты' }
    ],
    about: {
      title: 'Обо мне',
      text: 'Ведущий IT-рекрутер с опытом более 2,5 лет в полном цикле подбора. Работаю в плотной связке с нанимающими менеджерами, помогаю решать сложные задачи по найму. Ключевые направления - data-driven рекрутинг, аналитика рынка труда и консалтинг заказчиков. Стратегический партнер для бизнеса, а не просто исполнитель заявок.'
    },
    achievements: { title: 'Ключевые результаты', items: [] },
    skills: { title: 'Ключевые навыки', items: [] },
    experience: { title: 'Опыт работы', items: [] },
    education: { title: 'Образование', items: [] },
    certificates: { title: 'Сертификаты', items: [] },
    languages: { title: 'Языки', items: [] },
    contact: {
      title: 'Давайте работать вместе',
      location: 'Беларусь, Минск',
      email: 'alesiaromasko19@gmail.com',
      phone: '+375298508516',
      linkedin: 'https://linkedin.com/in/alesiaromasko',
      telegram: 'https://t.me/lesiaRomashko',
      downloadLabel: 'Скачать резюме',
      cvFile: '/Alesia_Zayats_CV.docx'
    }
  }
};
```

- [ ] **Step 3a: Backfill full arrays from existing `data.js` using exact migration script**

Create `scripts/migrate-data-to-ts.mjs`:

```js
import fs from 'node:fs';
import vm from 'node:vm';

const js = fs.readFileSync('data.js', 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${js}; this.__cvData = cvData;`, sandbox);

const raw = sandbox.__cvData;
const out = `import type { CvDictionary } from '@/types/cv';\n\nexport const cvData: CvDictionary = ${JSON.stringify(raw, null, 2)} as CvDictionary;\n`;
fs.mkdirSync('src/content', { recursive: true });
fs.writeFileSync('src/content/cv.ts', out, 'utf8');
console.log('Generated src/content/cv.ts from data.js');
```

Run:

```bash
node scripts/migrate-data-to-ts.mjs
```

Expected: `src/content/cv.ts` contains full EN/RU arrays from current source data.

- [ ] **Step 4: Verify types compile**

Run: `npm run typecheck`
Expected: typecheck passes for model/data files.

### Task 3: Build core app shell and route pages (`/`, `/ru`)

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/ru/page.tsx`
- Create: `app/globals.css`
- Create: `src/components/cv/CvPage.tsx`

- [ ] **Step 1: Write failing route render check**

Run: `npm run build`
Expected: fails because `app/layout.tsx` and route pages do not exist.

- [ ] **Step 2: Add base layout and globals**

`app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://alesiaz19.github.io')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
```

`app/globals.css`

```css
@import '../style.css';
```

- [ ] **Step 3: Add reusable CV page component**

`src/components/cv/CvPage.tsx`

```tsx
import Link from 'next/link';
import type { Locale } from '@/types/cv';
import { cvData } from '@/content/cv';

export function CvPage({ locale }: { locale: Locale }) {
  const d = cvData[locale];
  const altHref = locale === 'ru' ? '/' : '/ru';
  const altLabel = locale === 'ru' ? 'EN' : 'RU';

  return (
    <main className="container">
      <header className="header" id="header">
        <a href="#hero" className="logo">{d.name}</a>
        <nav>
          <ul className="nav-links">
            {d.nav.map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="nav-link">{item.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="lang-toggle"><Link href={altHref}>{altLabel}</Link></div>
      </header>

      <section id="hero" className="hero">
        <h1>{d.name}</h1>
        <p className="hero-title">{d.heroTitle}</p>
        <p className="hero-location">{d.heroLocation}</p>
        <span className="status-dot">{d.heroStatus}</span>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Add EN and RU route files**

`app/page.tsx`

```tsx
import { CvPage } from '@/components/cv/CvPage';

export default function EnPage() {
  return <CvPage locale="en" />;
}
```

`app/ru/page.tsx`

```tsx
import { CvPage } from '@/components/cv/CvPage';

export default function RuPage() {
  return <CvPage locale="ru" />;
}
```

- [ ] **Step 5: Verify routes build and render**

Run: `npm run build`
Expected: successful build with routes `/` and `/ru` in output.

### Task 4: Implement route-level localized metadata and JSON-LD

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/metadata.ts`
- Create: `src/lib/jsonld.ts`
- Modify: `app/page.tsx`
- Modify: `app/ru/page.tsx`

- [ ] **Step 1: Write failing metadata helper import check**

In `app/page.tsx`, add import before helper exists:

```tsx
import { buildPageMetadata } from '@/lib/metadata';
```

Run: `npm run typecheck`
Expected: fails with missing module.

- [ ] **Step 2: Add SEO utility files**

`src/lib/site.ts`

```ts
export const SITE_URL = 'https://alesiaz19.github.io';
export const SITE_PATH = '/alesia-cv';
export const SITE_BASE = `${SITE_URL}${SITE_PATH}`;
```

`src/lib/metadata.ts`

```ts
import type { Metadata } from 'next';
import { cvData } from '@/content/cv';
import type { Locale } from '@/types/cv';
import { SITE_BASE } from '@/lib/site';

export function buildPageMetadata(locale: Locale): Metadata {
  const d = cvData[locale];
  const path = locale === 'ru' ? '/ru' : '/';
  const url = `${SITE_BASE}${path}`;

  return {
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
      url,
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
```

`src/lib/jsonld.ts`

```ts
import { cvData } from '@/content/cv';
import type { Locale } from '@/types/cv';
import { SITE_BASE } from '@/lib/site';

export function buildPersonJsonLd(locale: Locale) {
  const d = cvData[locale];
  const path = locale === 'ru' ? '/ru' : '/';
  const pageUrl = `${SITE_BASE}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: d.name,
    jobTitle: d.heroTitle,
    description: d.about.text,
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
```

- [ ] **Step 3: Use metadata and JSON-LD in routes**

`app/page.tsx`

```tsx
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
```

`app/ru/page.tsx`

```tsx
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
```

- [ ] **Step 4: Verify metadata generation**

Run: `npm run build`
Expected: build passes with typed metadata and no route errors.

### Task 5: Add Next-generated sitemap and robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Write failing check for missing route handlers**

Run: `npm run build`
Expected: build succeeds without handlers (baseline), then continue to add handlers and verify outputs.

- [ ] **Step 2: Implement sitemap**

`app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next';
import { SITE_BASE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_BASE}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${SITE_BASE}/ru`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    }
  ];
}
```

- [ ] **Step 3: Implement robots**

`app/robots.ts`

```ts
import type { MetadataRoute } from 'next';
import { SITE_BASE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_BASE}/sitemap.xml`
  };
}
```

- [ ] **Step 4: Verify generated SEO files**

Run: `npm run dev`
Then verify in browser:
- `/sitemap.xml`
- `/robots.txt`

Expected: both are generated and include `/` and `/ru` language URLs.

### Task 6: Port interactive behaviors to client component

**Files:**
- Create: `src/components/cv/CvPageClient.tsx`
- Modify: `src/components/cv/CvPage.tsx`

- [ ] **Step 1: Write failing behavior check**

Run app and verify these fail before implementation:
- mobile menu does not open/close,
- scroll-to-top absent,
- lightbox absent.

- [ ] **Step 2: Implement client behavior wrapper**

`src/components/cv/CvPageClient.tsx`

```tsx
'use client';

import { useEffect } from 'react';

export function CvPageClient() {
  useEffect(() => {
    const onScroll = () => {
      const header = document.getElementById('header');
      const btn = document.getElementById('scrollTop');
      if (header) header.classList.toggle('scrolled', window.scrollY > 50);
      if (btn) btn.classList.toggle('visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
```

- [ ] **Step 3: Mount client behavior component**

In `src/components/cv/CvPage.tsx`, mount:

```tsx
import { CvPageClient } from './CvPageClient';

// inside component return
<>
  <CvPageClient />
  {/* existing page markup */}
</>
```

- [ ] **Step 4: Verify interaction parity**

Run: `npm run dev`
Expected: header shrink and scroll-top behavior work.

- [ ] **Step 5: Implement and verify mobile menu toggle**

Acceptance:

- menu opens on burger click,
- menu closes on second click,
- menu closes when mobile nav link is clicked.

- [ ] **Step 6: Implement and verify certificate lightbox**

Acceptance:

- clicking certificate image opens lightbox,
- clicking overlay closes lightbox,
- `Escape` key closes lightbox.

- [ ] **Step 7: Implement and verify section reveal animation**

Acceptance:

- sections receive visible class when entering viewport,
- observer disconnect/cleanup is handled.

### Task 7: Move assets and remove query-param language runtime logic

**Files:**
- Create/Copy: `public/img/*`
- Create/Copy: `public/Alesia_Zayats_CV.docx`
- Create/Copy: `public/googleca5eec5d041d5790.html`
- Modify: `README.md`

- [ ] **Step 1: Copy static assets**

Run:

```bash
mkdir -p public/img
cp img/* public/img/
cp Alesia_Zayats_CV.docx public/
cp googleca5eec5d041d5790.html public/
```

Expected: files available under `/img/...`, `/Alesia_Zayats_CV.docx`, and verification html path.

- [ ] **Step 2: Update README for Next workflow**

Add/replace sections with:

```md
## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Localization

- EN route: `/`
- RU route: `/ru`
- Legacy compatibility: `/?lang=ru` permanently redirects to `/ru`
```

- [ ] **Step 3: Verify assets and download links**

Run: `npm run dev`
Expected: certificate images load, CV download link works on both locales.

### Task 8: Final verification pass (no commit)

**Files:**
- Modify: files touched in prior tasks only when verification exposes regressions

- [ ] **Step 1: Run full verification commands**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both commands pass with no TypeScript errors.

- [ ] **Step 2: Manual route and SEO checks**

Verify in browser:

- `/` => EN content, EN metadata
- `/ru` => RU content, RU metadata
- `/?lang=ru` redirects to `/ru`
- `/?lang=en` resolves to `/`
- canonical and hreflang reflect EN/RU split
- JSON-LD fields (`jobTitle`, `knowsAbout`, `description`, `url`) are locale-correct

Expected: all checks pass.

- [ ] **Step 3: Confirm no commit policy**

Run: `git status`
Expected: working tree contains uncommitted migration changes and no commit is created.
