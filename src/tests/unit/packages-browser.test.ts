import { describe, expect, it } from 'vitest';

import {
  getRootAttribute,
  getSafeDocument,
  getSafeWindow,
  isBrowser,
  matchesMediaQuery,
  prefersReducedMotion,
  setRootAttribute,
} from '@/packages/browser';

describe('browser environment facade (jsdom)', () => {
  it('detects the browser environment', () => {
    expect(isBrowser()).toBe(true);
    expect(getSafeWindow()).not.toBeNull();
    expect(getSafeDocument()).not.toBeNull();
  });

  it('evaluates media queries through the stubbed matchMedia', () => {
    expect(matchesMediaQuery('(prefers-color-scheme: dark)')).toBe(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('sets and reads root attributes', () => {
    setRootAttribute('data-test-attribute', 'value-1');

    expect(getRootAttribute('data-test-attribute')).toBe('value-1');
    expect(document.documentElement.dataset['testAttribute']).toBe('value-1');
  });

  it('returns null for absent root attributes', () => {
    expect(getRootAttribute('data-never-set')).toBeNull();
  });
});
