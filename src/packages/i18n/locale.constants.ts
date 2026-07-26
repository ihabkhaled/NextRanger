export const SUPPORTED_LOCALES = [
  'en',
  'ar',
  'fr',
  'it',
  'de',
  'hi',
  'fa',
  'th',
  'ja',
  'zh',
  'es',
  'pt',
  'ko',
  'tr',
] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

const RTL_LOCALES: ReadonlySet<AppLocale> = new Set(['ar', 'fa']);

export const LOCALE_NAMES: Readonly<Record<AppLocale, string>> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  hi: 'हिन्दी',
  fa: 'فارسی',
  th: 'ไทย',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  pt: 'Português',
  ko: '한국어',
  tr: 'Türkçe',
};

export const OPEN_GRAPH_LOCALES: Readonly<Record<AppLocale, string>> = {
  en: 'en_US',
  ar: 'ar_SA',
  fr: 'fr_FR',
  it: 'it_IT',
  de: 'de_DE',
  hi: 'hi_IN',
  fa: 'fa_IR',
  th: 'th_TH',
  ja: 'ja_JP',
  zh: 'zh_CN',
  es: 'es_ES',
  pt: 'pt_BR',
  ko: 'ko_KR',
  tr: 'tr_TR',
};

export type AppTextDirection = 'ltr' | 'rtl';

export function isSupportedLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDirection(locale: AppLocale): AppTextDirection {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
}
