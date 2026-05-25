# Locale Auto-Detection and Preference Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement first-visit locale auto-detection and manual locale persistence (cookie + localStorage) while keeping canonical EN `/` and RU `/ru` routes.

**Architecture:** Use `proxy.ts` for server-visible routing decisions with cookie priority and `Accept-Language` fallback. Use a small client handler in the language switcher to persist manual selection to both cookie and localStorage before route navigation.

**Tech Stack:** Next.js App Router, TypeScript, Edge Middleware, React client handler

---

## File Structure Plan

- Create: `proxy.ts` (locale routing policy)
- Modify: `src/components/cv/CvPage.tsx` (manual language switch persistence)
- Create: `src/lib/locale.ts` (shared locale constants/helpers)
- Modify: `README.md` (document language behavior)

### Task 1: Add shared locale constants

**Files:**
- Create: `src/lib/locale.ts`

- [ ] **Step 1: Write failing test-like compile check**

Add temporary import in `proxy.ts` before creating file:

```ts
import { LOCALE_COOKIE } from '@/lib/locale';
```

Run: `npm run typecheck`
Expected: FAIL with module-not-found for `@/lib/locale`.

- [ ] **Step 2: Create locale constants/helper module**

`src/lib/locale.ts`

```ts
export type Locale = 'en' | 'ru';

export const LOCALE_COOKIE = 'locale';
export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'ru'];

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'ru';
}

export function pathForLocale(locale: Locale): '/' | '/ru' {
  return locale === 'ru' ? '/ru' : '/';
}
```

- [ ] **Step 3: Verify compile now passes for helper module**

Run: `npm run typecheck`
Expected: PASS (or next failure points to missing proxy implementation, resolved in Task 2).

### Task 2: Implement proxy locale policy

**Files:**
- Create: `proxy.ts`
- Modify: `next.config.ts` (keep existing query redirects unchanged)

- [ ] **Step 1: Write failing behavior test plan in comments + run build**

Run: `npm run build`
Expected: PASS baseline before proxy. This establishes pre-change behavior.

- [ ] **Step 2: Create proxy with cookie-priority routing**

`proxy.ts`

```ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, pathForLocale } from '@/lib/locale';

function detectLocaleFromHeader(header: string | null): 'en' | 'ru' {
  if (!header) return DEFAULT_LOCALE;
  const normalized = header.toLowerCase();
  return normalized.includes('ru') ? 'ru' : 'en';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== '/' && pathname !== '/ru') {
    return NextResponse.next();
  }

  const cookieLocaleRaw = request.cookies.get(LOCALE_COOKIE)?.value;
  const cookieLocale = isLocale(cookieLocaleRaw) ? cookieLocaleRaw : null;

  if (cookieLocale) {
    const targetPath = pathForLocale(cookieLocale);
    if (pathname !== targetPath) {
      const url = request.nextUrl.clone();
      url.pathname = targetPath;
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    const detected = detectLocaleFromHeader(request.headers.get('accept-language'));
    if (detected === 'ru') {
      const url = request.nextUrl.clone();
      url.pathname = '/ru';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/ru']
};
```

- [ ] **Step 3: Verify proxy compiles and app builds**

Run: `npm run build`
Expected: PASS with proxy included.

### Task 3: Persist manual language choice in UI switcher

**Files:**
- Modify: `src/components/cv/CvPage.tsx`

- [ ] **Step 1: Write failing type check for new client APIs**

Add temporary references to `document.cookie`/`localStorage` in server component without client boundary.
Run: `npm run typecheck`
Expected: reveals need for client-only handling.

- [ ] **Step 2: Add client-side click handler for locale switch**

In `src/components/cv/CvPage.tsx`, ensure the language controls are in a client-executed path (existing component already uses client behavior setup; keep this focused on click handling):

```tsx
const setLocalePreference = (locale: 'en' | 'ru') => {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `locale=${locale}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  try {
    localStorage.setItem('locale', locale);
  } catch {
    // no-op: cookie remains source of truth for server routing
  }
};
```

Use this handler on both EN/RU switch actions before navigation.

- [ ] **Step 3: Replace plain language links with handler-aware controls**

For each language action:

```tsx
onClick={() => setLocalePreference('en')}
onClick={() => setLocalePreference('ru')}
```

Keep hrefs as `/` and `/ru` to preserve normal navigation and SEO-safe URLs.

- [ ] **Step 4: Verify type/build checks**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both PASS.

### Task 4: Validate behavior matrix locally

**Files:**
- No file changes required unless regressions found

- [ ] **Step 1: Manual test — first visit RU detection**

Clear cookie/storage for site, then request `/` with RU browser preference.
Expected: redirect to `/ru`.

- [ ] **Step 2: Manual test — first visit non-RU default**

Clear cookie/storage for site, request `/` with non-RU preference.
Expected: stay on `/`.

- [ ] **Step 3: Manual test — manual switch persistence**

From `/`, switch to RU.
Expected:

- navigates to `/ru`
- cookie `locale=ru` exists
- localStorage `locale=ru` exists

Reload `/` directly.
Expected: redirected to `/ru` by cookie.

- [ ] **Step 4: Manual test — EN override from RU**

From `/ru`, switch EN.
Expected:

- navigates to `/`
- cookie `locale=en`
- localStorage `locale=en`

Reload `/ru` directly.
Expected: redirected to `/` by cookie.

### Task 5: Documentation update

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add locale behavior section**

Add explicit docs:

```md
## Locale behavior

- Canonical EN: `/`
- RU route: `/ru`
- First visit without preference:
  - RU browser language redirects `/` -> `/ru`
  - all non-RU stay on `/`
- Manual language switch persists in both:
  - cookie `locale`
  - `localStorage.locale`
- Manual selection has priority over auto-detection.
```

- [ ] **Step 2: Verify final checks**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both PASS.

- [ ] **Step 3: Confirm no-commit policy**

Run: `git status --short`
Expected: uncommitted changes present, no commits created.
