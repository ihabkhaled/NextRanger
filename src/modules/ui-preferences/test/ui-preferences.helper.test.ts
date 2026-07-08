import { beforeEach, describe, expect, it } from 'vitest';

import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';

import { buildPreferenceOptions, resolveThemeAttribute } from '../helpers/ui-preferences.helper';

function createMatchMedia(matches: boolean) {
  return (query: string): MediaQueryList =>
    ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

describe('resolveThemeAttribute', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: createMatchMedia(false),
    });
  });

  it('returns light for explicit light theme', () => {
    expect(resolveThemeAttribute(AppTheme.Light)).toBe(AppTheme.Light);
  });

  it('returns dark for explicit dark theme', () => {
    expect(resolveThemeAttribute(AppTheme.Dark)).toBe(AppTheme.Dark);
  });

  it('returns light for system theme when the media query does not match dark', () => {
    expect(resolveThemeAttribute(AppTheme.System)).toBe(AppTheme.Light);
  });

  it('returns dark for system theme when the media query matches dark', () => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: createMatchMedia(true),
    });

    expect(resolveThemeAttribute(AppTheme.System)).toBe(AppTheme.Dark);
  });
});

describe('buildPreferenceOptions', () => {
  it('builds a view model for every value, marking the selected one', () => {
    const options = buildPreferenceOptions({
      values: [AppTheme.Light, AppTheme.Dark],
      selectedValue: AppTheme.Dark,
      getLabel: (value) => `label:${value}`,
      getTestId: (value) => `test-${value}`,
    });

    expect(options).toEqual([
      {
        value: AppTheme.Light,
        label: 'label:light',
        isSelected: false,
        testId: 'test-light',
      },
      {
        value: AppTheme.Dark,
        label: 'label:dark',
        isSelected: true,
        testId: 'test-dark',
      },
    ]);
  });

  it('builds direction options using the same generic helper', () => {
    const options = buildPreferenceOptions({
      values: [AppDirection.Ltr, AppDirection.Rtl],
      selectedValue: AppDirection.Rtl,
      getLabel: (value) => value.toUpperCase(),
      getTestId: (value) => `direction-${value}`,
    });

    expect(options[0]?.isSelected).toBe(false);
    expect(options[1]?.isSelected).toBe(true);
  });
});
