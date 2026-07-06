import { getSafeWindow } from '@/packages/browser';
import { appLogger } from '@/packages/logger';
import { safeParseSchema, type z } from '@/packages/zod';

type WebStorageArea = 'local' | 'session';

function getStorage(area: WebStorageArea): Storage | null {
  const safeWindow = getSafeWindow();

  if (!safeWindow) {
    return null;
  }

  try {
    return area === 'local' ? safeWindow.localStorage : safeWindow.sessionStorage;
  } catch {
    // Storage can throw in privacy modes; the facade degrades to null.
    return null;
  }
}

/**
 * Read and validate a JSON value. Returns null when storage is unavailable,
 * the key is absent, JSON is malformed, or the schema rejects the value —
 * callers always receive either a valid value or null, never garbage.
 */
export function readStorageJson<TSchema extends z.ZodType>(
  area: WebStorageArea,
  key: string,
  schema: TSchema,
): z.output<TSchema> | null {
  const storage = getStorage(area);

  if (!storage) {
    return null;
  }

  const raw = storage.getItem(key);

  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = safeParseSchema(schema, parsed);

    if (!result.success) {
      appLogger.warn('Discarding invalid stored value', { key, issues: result.issues });

      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

/** Write a JSON value; returns false when storage is unavailable or full. */
export function writeStorageJson(area: WebStorageArea, key: string, value: unknown): boolean {
  const storage = getStorage(area);

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, JSON.stringify(value));

    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(area: WebStorageArea, key: string): void {
  const storage = getStorage(area);

  if (storage) {
    storage.removeItem(key);
  }
}
