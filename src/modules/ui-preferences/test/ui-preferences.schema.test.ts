import { describe, expect, it } from 'vitest';

import { safeParseSchema } from '@/packages/zod';

import { uiPreferencesSnapshotSchema } from '../schemas/ui-preferences.schema';

describe('uiPreferencesSnapshotSchema', () => {
  it('accepts a valid persisted snapshot', () => {
    const result = safeParseSchema(uiPreferencesSnapshotSchema, {
      theme: 'dark',
      direction: 'rtl',
      isSidebarExpanded: false,
    });

    expect(result.success).toBe(true);
  });

  it('rejects an unknown theme (corrupted or legacy storage)', () => {
    const result = safeParseSchema(uiPreferencesSnapshotSchema, {
      theme: 'sepia',
      direction: 'ltr',
      isSidebarExpanded: true,
    });

    expect(result.success).toBe(false);
  });

  it('rejects a missing field', () => {
    const result = safeParseSchema(uiPreferencesSnapshotSchema, {
      theme: 'light',
      direction: 'ltr',
    });

    expect(result.success).toBe(false);
  });
});
