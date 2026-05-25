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
    return nextWithLocale(request, cookieLocale);
  }

  if (pathname === '/') {
    const detectedLocale = detectLocaleFromHeader(request.headers.get('accept-language'));
    if (detectedLocale === 'ru') {
      const url = request.nextUrl.clone();
      url.pathname = '/ru';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return nextWithLocale(request, pathname === '/ru' ? 'ru' : 'en');
}

export const config = {
  matcher: ['/', '/ru']
};
