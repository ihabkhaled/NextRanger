/**
 * Every browser-storage key lives here, namespaced to avoid collisions.
 */
export const STORAGE_KEYS = {
  uiPreferences: 'snr.ui-preferences.v1',
} as const;

/** Catalog-derived public API. @public */
export type AppStorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
