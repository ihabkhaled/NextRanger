import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';

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
