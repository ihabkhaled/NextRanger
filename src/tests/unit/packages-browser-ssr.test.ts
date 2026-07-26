import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getRootAttribute,
  getBrowserLocationSuffix,
  getSafeDocument,
  getSafeWindow,
  isBrowser,
  matchesMediaQuery,
  setRootAttribute,
} from '@/packages/browser';
import { readStorageJson, removeStorageItem, writeStorageJson } from '@/packages/storage';
import { z } from '@/packages/zod';

const schema = z.object({ ok: z.boolean() });

/**
 * Simulates the server environment (no window/document) so the SSR guard
 * branches of the facades execute for real.
 */
describe('browser/storage facades without a browser environment', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('browser facade degrades gracefully when window and document are absent', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    expect(isBrowser()).toBe(false);
    expect(getSafeWindow()).toBeNull();
    expect(getSafeDocument()).toBeNull();
    expect(getBrowserLocationSuffix()).toBe('');
    expect(matchesMediaQuery('(prefers-color-scheme: dark)')).toBe(false);
    expect(getRootAttribute('data-theme')).toBeNull();
    expect(() => {
      setRootAttribute('data-theme', 'dark');
    }).not.toThrow();
  });

  it('returns the current query and hash suffix when a browser exists', () => {
    vi.stubGlobal('window', { location: { search: '?page=2', hash: '#latest' } });
    expect(getBrowserLocationSuffix()).toBe('?page=2#latest');
  });

  it('storage facade returns null/false when window is absent', () => {
    vi.stubGlobal('window', undefined);

    expect(readStorageJson('local', 'k', schema)).toBeNull();
    expect(writeStorageJson('local', 'k', { ok: true })).toBe(false);
    expect(() => {
      removeStorageItem('local', 'k');
    }).not.toThrow();
  });

  it('storage facade degrades when storage access throws (privacy mode)', () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new Error('denied');
      },
      get sessionStorage(): Storage {
        throw new Error('denied');
      },
    });

    expect(readStorageJson('local', 'k', schema)).toBeNull();
    expect(writeStorageJson('session', 'k', { ok: true })).toBe(false);
  });

  it('storage facade degrades when setItem throws (quota exceeded)', () => {
    vi.stubGlobal('window', {
      localStorage: {
        setItem: (): void => {
          throw new Error('quota');
        },
        getItem: (): string | null => null,
        removeItem: (): void => {},
      },
    });

    expect(writeStorageJson('local', 'k', { ok: true })).toBe(false);
  });
});
