export type Locale = 'en' | 'ru';

export const LOCALE_COOKIE = 'locale';
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'ru';
}

export function pathForLocale(locale: Locale): '/' | '/ru' {
  return locale === 'ru' ? '/ru' : '/';
}
