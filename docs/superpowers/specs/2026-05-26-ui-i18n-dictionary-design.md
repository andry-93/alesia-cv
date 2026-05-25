# UI Labels i18n via Dictionary Object Design

## Goal

Provide i18n for hardcoded interface labels (e.g., "Download CV", "Language", "Menu") while keeping CV data (`src/content/cv.ts`) unchanged.

## Architecture

Use a **Typed Dictionary Object** approach (`Record<Locale, UiData>`) in `src/lib/i18n.ts`.

## Implementation

1. **Schema Definition**:
   Define `UiData` interface:
   ```ts
   interface UiData {
     language: string;
     download: string;
     mobileMenu: string;
   }
   ```

2. **Data Source**:
   Define `uiData: Record<Locale, UiData>` in `src/lib/i18n.ts`.

3. **Access**:
   In components, access labels via:
   ```ts
   const t = uiData[locale];
   // use t.language, t.download, t.mobileMenu
   ```

## Scope

- Replace hardcoded UI labels only.
- Leave `src/content/cv.ts` untouched.
- TypeScript strictly enforces key existence.

## Validation

- Ensure all localized UI components (switchers, download buttons, mobile nav) use `t.key`.
- Verify no hardcoded interface strings remain in the UI component codebase.
- Verify build passes.
