import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from '@/packages/i18n';

describe('locale constants', () => {
  it('supports every public URL locale with English as default', () => {
    expect(SUPPORTED_LOCALES).toEqual([
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
    ]);
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('isSupportedLocale', () => {
  it('accepts supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('ar')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(true);
  });

  it('rejects unsupported and non-string values', () => {
    expect(isSupportedLocale('xx')).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
    expect(isSupportedLocale(7)).toBe(false);
  });
});

describe('getLocaleDirection', () => {
  it('maps Arabic and Persian to rtl and other locales to ltr', () => {
    expect(getLocaleDirection('ar')).toBe('rtl');
    expect(getLocaleDirection('fa')).toBe('rtl');
    expect(getLocaleDirection('en')).toBe('ltr');
    expect(getLocaleDirection('fr')).toBe('ltr');
  });
});
