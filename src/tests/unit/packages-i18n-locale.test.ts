import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from '@/packages/i18n';

describe('locale constants', () => {
  it('supports English and Arabic with English as default', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'ar']);
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('isSupportedLocale', () => {
  it('accepts supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('ar')).toBe(true);
  });

  it('rejects unsupported and non-string values', () => {
    expect(isSupportedLocale('fr')).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
    expect(isSupportedLocale(7)).toBe(false);
  });
});

describe('getLocaleDirection', () => {
  it('maps Arabic to rtl and English to ltr', () => {
    expect(getLocaleDirection('ar')).toBe('rtl');
    expect(getLocaleDirection('en')).toBe('ltr');
  });
});
