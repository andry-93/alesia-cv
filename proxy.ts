import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, pathForLocale } from '@/lib/locale';

function detectLocaleFromHeader(header: string | null): 'en' | 'ru' {
  if (!header) return DEFAULT_LOCALE;
  return header.toLowerCase().includes('ru') ? 'ru' : 'en';
}

function nextWithLocale(request: NextRequest, locale: 'en' | 'ru') {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== '/' && pathname !== '/ru') {
    return NextResponse.next();
  }

  // If visiting /ru explicitly, always allow it
  if (pathname === '/ru') {
    return nextWithLocale(request, 'ru');
  }

  // Logic for visiting /
  const cookieLocaleRaw = request.cookies.get(LOCALE_COOKIE)?.value;
  const cookieLocale = isLocale(cookieLocaleRaw) ? cookieLocaleRaw : null;

  if (cookieLocale === 'ru') {
    const url = request.nextUrl.clone();
    url.pathname = '/ru';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!cookieLocale) {
    const detectedLocale = detectLocaleFromHeader(request.headers.get('accept-language'));
    if (detectedLocale === 'ru') {
      const url = request.nextUrl.clone();
      url.pathname = '/ru';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return nextWithLocale(request, 'en');
}

export const config = {
  matcher: ['/', '/ru']
};
