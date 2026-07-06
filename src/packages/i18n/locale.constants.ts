export const SUPPORTED_LOCALES = ['en', 'ar'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

const RTL_LOCALES: ReadonlySet<AppLocale> = new Set(['ar']);

export type AppTextDirection = 'ltr' | 'rtl';

export function isSupportedLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDirection(locale: AppLocale): AppTextDirection {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
}
