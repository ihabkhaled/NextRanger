import { useAppTranslation } from '@/packages/i18n';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import { buildIndexedTestId } from '@/shared/testing/test-id.helper';

import { UI_PREFERENCES_MESSAGE_KEYS } from '../constants/ui-preferences-message-keys.constants';
import {
  UI_PREFERENCE_DIRECTION_OPTION_VALUES,
  UI_PREFERENCE_THEME_OPTION_VALUES,
} from '../constants/ui-preferences.constants';
import { buildPreferenceOptions } from '../helpers/ui-preferences.helper';
import { useUiPreferencesStore } from '../store/ui-preferences.store';
import type { UiPreferencesViewModel } from '../types/ui-preferences.types';

/** Orchestration for the settings screen. */
export function useUiPreferences(): UiPreferencesViewModel {
  const t = useAppTranslation(I18N_NAMESPACES.settings);
  const theme = useUiPreferencesStore((state) => state.theme);
  const direction = useUiPreferencesStore((state) => state.direction);
  const isSidebarExpanded = useUiPreferencesStore((state) => state.isSidebarExpanded);
  const setTheme = useUiPreferencesStore((state) => state.setTheme);
  const setDirection = useUiPreferencesStore((state) => state.setDirection);
  const toggleSidebar = useUiPreferencesStore((state) => state.toggleSidebar);

  const themeOptions = buildPreferenceOptions({
    values: UI_PREFERENCE_THEME_OPTION_VALUES,
    selectedValue: theme,
    getLabel: (value) => t(UI_PREFERENCES_MESSAGE_KEYS.themeOption[value]),
    getTestId: (value) => buildIndexedTestId(TEST_IDS.settingsTheme, value),
  });

  const directionOptions = buildPreferenceOptions({
    values: UI_PREFERENCE_DIRECTION_OPTION_VALUES,
    selectedValue: direction,
    getLabel: (value) => t(UI_PREFERENCES_MESSAGE_KEYS.directionOption[value]),
    getTestId: (value) => buildIndexedTestId(TEST_IDS.settingsDirection, value),
  });

  return {
    themeLabel: t(UI_PREFERENCES_MESSAGE_KEYS.themeLabel),
    themeOptions,
    onSelectTheme: setTheme,
    directionLabel: t(UI_PREFERENCES_MESSAGE_KEYS.directionLabel),
    directionOptions,
    onSelectDirection: setDirection,
    sidebarLabel: t(UI_PREFERENCES_MESSAGE_KEYS.sidebarLabel),
    sidebarStateLabel: isSidebarExpanded
      ? t(UI_PREFERENCES_MESSAGE_KEYS.sidebarExpanded)
      : t(UI_PREFERENCES_MESSAGE_KEYS.sidebarCollapsed),
    onToggleSidebar: toggleSidebar,
  };
}
