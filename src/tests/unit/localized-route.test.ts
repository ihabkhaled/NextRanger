import { describe, expect, it } from 'vitest';

import {
  buildLocalizedLocation,
  buildLocalizedPath,
  getPathLocale,
  normalizeLocalizedPath,
  replacePathLocale,
  resolvePathLocale,
} from '@/shared/helpers/localized-route.helper';

describe('localized route helpers', () => {
  it('normalizes root, empty, bare, and absolute paths', () => {
    expect(normalizeLocalizedPath('')).toBe('');
    expect(normalizeLocalizedPath('/')).toBe('');
    expect(normalizeLocalizedPath('about')).toBe('/about');
    expect(normalizeLocalizedPath('/about')).toBe('/about');
  });

  it('builds, reads, replaces, and defaults locale segments', () => {
    expect(buildLocalizedPath('fr', '/about')).toBe('/fr/about');
    expect(buildLocalizedPath('en', '/')).toBe('/en');
    expect(getPathLocale('/fa/settings')).toBe('fa');
    expect(getPathLocale('/xx/settings')).toBeNull();
    expect(replacePathLocale('/en/articles', 'ja')).toBe('/ja/articles');
    expect(replacePathLocale('/articles', 'de')).toBe('/de/articles');
    expect(resolvePathLocale('/xx')).toBe('en');
  });

  it('preserves query and hash suffixes in localized locations', () => {
    expect(buildLocalizedLocation('/en/articles', 'ar', '?page=2#latest')).toBe(
      '/ar/articles?page=2#latest',
    );
  });
});
