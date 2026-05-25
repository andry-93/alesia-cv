# Locale Auto-Detection + Manual Preference Persistence Design

## Goal

Add first-visit language auto-detection and persistent manual language preference to the Next.js app while keeping canonical routing unchanged:

- EN canonical route: `/`
- RU route: `/ru`

## Requirements

1. On first visit (no saved manual preference):
   - If preferred language is RU -> redirect `/` to `/ru`
   - Otherwise -> stay on `/`
2. Manual selection must be persisted and take priority over auto-detection.
3. Manual selection must be stored in `localStorage` (as requested).
4. Server-side routing logic must remain SEO-safe and deterministic.

## Recommended Approach

Use **proxy.ts + cookie** for server-visible routing preference, with `localStorage` mirrored on manual selection.

Why:

- Proxy can redirect before render (no flicker).
- Cookie is visible to server and edge runtime.
- `localStorage` is client-only, so it cannot be the only source of truth for routing.

## Behavior Model

### Priority order

1. Manual preference cookie (`locale=ru|en`)
2. Auto-detection via `Accept-Language`
3. Default fallback EN (`/`)

### Routing rules

- If `locale=ru` and path is `/` -> redirect to `/ru`
- If `locale=en` and path is `/ru` -> redirect to `/`
- If no cookie and path is `/`:
  - parse `Accept-Language`
  - if RU preferred -> redirect to `/ru`
  - else continue to `/`
- If no cookie and path is `/ru` -> allow `/ru`

### Manual switch rules

When user clicks language switch:

- Set cookie `locale=ru|en` with long TTL (about 1 year), `Path=/`, `SameSite=Lax`
- Write same value to `localStorage`
- Navigate to corresponding route (`/` or `/ru`)

## Technical Design

### 1) Proxy

Create `proxy.ts` with matcher for localized page routes.

Responsibilities:

- Validate `locale` cookie (`en` / `ru` only)
- Apply redirect rules
- Parse `Accept-Language` for first-visit auto-detection

Non-responsibilities:

- No content rendering logic
- No metadata mutation

### 2) Client language switch

Update language controls in `src/components/cv/CvPage.tsx`:

- Replace pure link-only behavior with click handler
- Handler writes cookie + `localStorage`, then navigates
- Keep routing canonical and unchanged

### 3) SEO compatibility

No SEO architecture changes required:

- Canonical remains EN `/`, RU `/ru`
- Existing metadata/hreflang/sitemap/robots stay valid
- Proxy only controls entry routing behavior

## Edge Cases

1. Invalid cookie value -> ignore as missing cookie.
2. `localStorage` unavailable -> do not fail; cookie is sufficient.
3. User manually chooses EN while on `/ru` -> persist EN and route to `/`.
4. User manually chooses RU while on `/` -> persist RU and route to `/ru`.

## Verification Plan

### Functional

1. No cookie + `Accept-Language: ru-*` -> `/` redirects to `/ru`
2. No cookie + non-RU language -> `/` stays `/`
3. Cookie `locale=ru` -> `/` redirects to `/ru`
4. Cookie `locale=en` -> `/ru` redirects to `/`
5. Manual switch updates both cookie and `localStorage`
6. Reload preserves chosen language

### Regression

1. No new hydration mismatch from language logic
2. Existing build and typecheck remain green
3. Canonical/hreflang unchanged and route-correct

## Definition of Done

1. First-visit auto-detection works from `Accept-Language` at `/`.
2. Manual user choice persists and overrides auto-detection.
3. Persistence is stored in both cookie and `localStorage`.
4. Routing remains `/` (EN) and `/ru` (RU), with no query-language runtime logic.
5. SEO outputs and static generation remain correct.
