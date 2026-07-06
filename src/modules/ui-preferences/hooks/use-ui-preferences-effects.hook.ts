import { useEffect } from 'react';

import { getRootAttribute, matchesMediaQuery, setRootAttribute } from '@/packages/browser';
import { readStorageJson, writeStorageJson } from '@/packages/storage';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys.constants';
import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme, type AppThemeValue } from '@/shared/enums/app-theme.enum';

import {
  DARK_COLOR_SCHEME_QUERY,
  UI_PREFERENCE_DOM_ATTRIBUTES,
} from '../constants/ui-preferences.constants';
import { uiPreferencesSnapshotSchema } from '../schemas/ui-preferences.schema';
import { selectPreferencesSnapshot } from '../store/ui-preferences.selectors';
import { useUiPreferencesStore } from '../store/ui-preferences.store';

function resolveThemeAttribute(theme: AppThemeValue): string {
  if (theme === AppTheme.System) {
    return matchesMediaQuery(DARK_COLOR_SCHEME_QUERY) ? AppTheme.Dark : AppTheme.Light;
  }

  return theme;
}

/**
 * Side-effect bridge between the preferences store and the outside world:
 * hydrate from storage once, then mirror changes to the DOM and storage.
 *
 * DOM/storage sync is gated on hydration: the server renders the
 * locale-derived direction (e.g. rtl for Arabic), and the store must adopt
 * that reality — never overwrite it with pre-hydration defaults.
 */
export function useUiPreferencesEffects(): void {
  const hasHydrated = useUiPreferencesStore((state) => state.hasHydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);
  const theme = useUiPreferencesStore((state) => state.theme);
  const direction = useUiPreferencesStore((state) => state.direction);
  const isSidebarExpanded = useUiPreferencesStore((state) => state.isSidebarExpanded);

  useEffect(() => {
    if (hasHydrated) {
      return;
    }

    const stored = readStorageJson(
      'local',
      STORAGE_KEYS.uiPreferences,
      uiPreferencesSnapshotSchema,
    );

    if (stored) {
      hydrate(stored);

      return;
    }

    // First visit: adopt the server-rendered, locale-derived direction.
    const documentDirection =
      getRootAttribute(UI_PREFERENCE_DOM_ATTRIBUTES.direction) === AppDirection.Rtl
        ? AppDirection.Rtl
        : AppDirection.Ltr;

    hydrate({
      ...selectPreferencesSnapshot(useUiPreferencesStore.getState()),
      direction: documentDirection,
    });
  }, [hasHydrated, hydrate]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    setRootAttribute(UI_PREFERENCE_DOM_ATTRIBUTES.theme, resolveThemeAttribute(theme));
    setRootAttribute(UI_PREFERENCE_DOM_ATTRIBUTES.direction, direction);
  }, [hasHydrated, theme, direction]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    writeStorageJson('local', STORAGE_KEYS.uiPreferences, {
      theme,
      direction,
      isSidebarExpanded,
    });
  }, [hasHydrated, theme, direction, isSidebarExpanded]);
}
