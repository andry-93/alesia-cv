import type { Locale } from '@/types/cv';

export interface UiData {
  language: string;
  download: string;
  mobileMenu: string;
  scrollUp: string;
}

export const uiData: Record<Locale, UiData> = {
  en: { language: 'Language', download: 'Download CV', mobileMenu: 'Menu', scrollUp: 'Scroll to top' },
  ru: { language: 'Язык', download: 'Скачать резюме', mobileMenu: 'Меню', scrollUp: 'Прокрутить вверх' }
};

export const getUi = (locale: Locale) => uiData[locale];
