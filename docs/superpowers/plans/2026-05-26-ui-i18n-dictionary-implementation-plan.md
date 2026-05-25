# UI Labels i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement i18n dictionary for interface labels while keeping CV content static.

**Architecture:** Typed dictionary object `uiData` accessed via a typed locale-aware helper in components.

**Tech Stack:** TypeScript, React (Next.js)

---

### Task 1: Create I18n Dictionary Library

**Files:**
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Write failing type check for dictionary**
Create `src/lib/i18n.ts`:
```ts
// TBD: Types
```
Run `npm run typecheck` - expected failure.

- [ ] **Step 2: Implement Typed Dictionary**

`src/lib/i18n.ts`
```ts
import type { Locale } from '@/types/cv';

export interface UiData {
  language: string;
  download: string;
  mobileMenu: string;
}

export const uiData: Record<Locale, UiData> = {
  en: { language: 'Language', download: 'Download CV', mobileMenu: 'Menu' },
  ru: { language: 'Язык', download: 'Скачать резюме', mobileMenu: 'Меню' }
};

export const getUi = (locale: Locale) => uiData[locale];
```

- [ ] **Step 3: Verify build**
Run `npm run build`.

### Task 2: Migrate CV Page Labels

**Files:**
- Modify: `src/components/cv/CvPage.tsx`

- [ ] **Step 1: Replace Hardcoded Labels**

In `CvPage.tsx`, import `getUi` and replace:
- "Language" (if used)
- "Download CV" / "Скачать резюме"
- "Menu" (if used)

Example for download button:
```tsx
import { getUi } from '@/lib/i18n';
// ...
const t = getUi(locale);
// ...
<span id="downloadLabel">{t.download}</span>
```

- [ ] **Step 2: Verify build**
Run `npm run build`.

### Task 3: Migrate Mobile Menu Labels

**Files:**
- Modify: `src/components/cv/CvPage.tsx`

- [ ] **Step 1: Replace Mobile Menu Hardcoded Labels**

Replace mobile menu labels with `t.mobileMenu`.

- [ ] **Step 2: Verify build**
Run `npm run build`.

---

Plan complete and saved to `docs/superpowers/plans/2026-05-26-ui-i18n-dictionary-implementation-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?