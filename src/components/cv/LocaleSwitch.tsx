'use client';

import { useRouter } from 'next/navigation';
import type { Locale } from '@/types/cv';

function persistLocale(locale: Locale) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `locale=${locale}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  try {
    localStorage.setItem('locale', locale);
  } catch {
    // Ignore storage errors in restricted browsers.
  }
}

export function LocaleSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();

  const onSwitch = (target: Locale) => {
    if (target === locale) return;
    persistLocale(target);
    router.push(target === 'ru' ? '/ru' : '/');
  };

  return (
    <div className={className}>
      <button type="button" className={`lang-opt ${locale === 'en' ? 'active' : ''}`} onClick={() => onSwitch('en')}>EN</button>
      <button type="button" className={`lang-opt ${locale === 'ru' ? 'active' : ''}`} onClick={() => onSwitch('ru')}>RU</button>
      <div className="lang-slider" />
    </div>
  );
}
