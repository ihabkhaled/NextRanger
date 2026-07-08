import { AppDirection, type AppDirectionValue } from '@/shared/enums/app-direction.enum';
import { AppTheme, type AppThemeValue } from '@/shared/enums/app-theme.enum';

import type { UiPreferencesSnapshot } from '../types/ui-preferences.types';

export const UI_PREFERENCES_DEFAULTS: UiPreferencesSnapshot = {
  theme: AppTheme.Light,
  direction: AppDirection.Ltr,
  isSidebarExpanded: true,
};

/** DOM attributes mutated by the preference effects (via the browser facade). */
export const UI_PREFERENCE_DOM_ATTRIBUTES = {
  theme: 'data-theme',
  direction: 'dir',
} as const;

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export const UI_PREFERENCE_THEME_OPTION_VALUES: readonly AppThemeValue[] = [
  AppTheme.Light,
  AppTheme.Dark,
  AppTheme.System,
];

export const UI_PREFERENCE_DIRECTION_OPTION_VALUES: readonly AppDirectionValue[] = [
  AppDirection.Ltr,
  AppDirection.Rtl,
];
