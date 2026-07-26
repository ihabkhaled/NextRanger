import { describe, expect, it } from 'vitest';

import { AppTheme } from '@/shared/enums/app-theme.enum';

import { getNextTheme } from '../helpers/next-theme.helper';

describe('getNextTheme', () => {
  it('cycles through every supported theme', () => {
    expect(getNextTheme(AppTheme.Light)).toBe(AppTheme.Dark);
    expect(getNextTheme(AppTheme.Dark)).toBe(AppTheme.System);
    expect(getNextTheme(AppTheme.System)).toBe(AppTheme.Light);
  });
});
