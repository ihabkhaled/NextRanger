import { matchesMediaQuery } from '@/packages/browser';
import { AppTheme, type AppThemeValue } from '@/shared/enums/app-theme.enum';

import { DARK_COLOR_SCHEME_QUERY } from '../constants/ui-preferences.constants';
import type {
  BuildPreferenceOptionsInput,
  PreferenceOptionViewModel,
} from '../types/ui-preferences.types';

export function resolveThemeAttribute(theme: AppThemeValue): string {
  if (theme === AppTheme.System) {
    return matchesMediaQuery(DARK_COLOR_SCHEME_QUERY) ? AppTheme.Dark : AppTheme.Light;
  }

  return theme;
}

export function buildPreferenceOptions<TValue extends string>(
  options: BuildPreferenceOptionsInput<TValue>,
): readonly PreferenceOptionViewModel<TValue>[] {
  return options.values.map((value) => ({
    value,
    label: options.getLabel(value),
    isSelected: options.selectedValue === value,
    testId: options.getTestId(value),
  }));
}
