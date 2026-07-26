import type { Route } from 'next';

import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from '@/packages/i18n';

export function normalizeLocalizedPath(path: string): string {
  if (path === '' || path === '/') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildLocalizedPath(locale: AppLocale, path: string): Route {
  return `/${locale}${normalizeLocalizedPath(path)}` as Route;
}

export function getPathLocale(pathname: string): AppLocale | null {
  const candidate = pathname.split('/', 2)[1];
  return isSupportedLocale(candidate) ? candidate : null;
}

export function replacePathLocale(pathname: string, nextLocale: AppLocale): Route {
  const segments = pathname.split('/');
  if (isSupportedLocale(segments[1])) {
    return buildLocalizedPath(nextLocale, segments.slice(2).join('/'));
  }
  return buildLocalizedPath(nextLocale, pathname);
}

export function buildLocalizedLocation(
  pathname: string,
  nextLocale: AppLocale,
  suffix: string,
): Route {
  return `${replacePathLocale(pathname, nextLocale)}${suffix}` as Route;
}

export function resolvePathLocale(pathname: string): AppLocale {
  return getPathLocale(pathname) ?? DEFAULT_LOCALE;
}
