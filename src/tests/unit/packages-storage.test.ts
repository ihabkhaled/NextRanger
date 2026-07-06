import { beforeEach, describe, expect, it } from 'vitest';

import { readStorageJson, removeStorageItem, writeStorageJson } from '@/packages/storage';
import { z } from '@/packages/zod';

const schema = z.object({ theme: z.string() });
const KEY = 'test.storage-key';

describe('web storage facade', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    globalThis.sessionStorage.clear();
  });

  it('round-trips JSON values through localStorage', () => {
    expect(writeStorageJson('local', KEY, { theme: 'dark' })).toBe(true);
    expect(readStorageJson('local', KEY, schema)).toEqual({ theme: 'dark' });
  });

  it('round-trips through sessionStorage independently', () => {
    writeStorageJson('session', KEY, { theme: 'light' });

    expect(readStorageJson('session', KEY, schema)).toEqual({ theme: 'light' });
    expect(readStorageJson('local', KEY, schema)).toBeNull();
  });

  it('returns null for absent keys', () => {
    expect(readStorageJson('local', 'missing', schema)).toBeNull();
  });

  it('returns null and discards malformed JSON', () => {
    globalThis.localStorage.setItem(KEY, '{not json');

    expect(readStorageJson('local', KEY, schema)).toBeNull();
  });

  it('returns null when the stored value fails schema validation', () => {
    globalThis.localStorage.setItem(KEY, JSON.stringify({ theme: 42 }));

    expect(readStorageJson('local', KEY, schema)).toBeNull();
  });

  it('removeStorageItem deletes the key', () => {
    writeStorageJson('local', KEY, { theme: 'dark' });
    removeStorageItem('local', KEY);

    expect(readStorageJson('local', KEY, schema)).toBeNull();
  });
});
