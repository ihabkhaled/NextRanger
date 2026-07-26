import { useEffect } from 'react';

import { getRootAttribute, setRootAttribute } from '@/packages/browser';
import { readStorageJson, writeStorageJson } from '@/packages/storage';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys.constants';
import { AppDirection } from '@/shared/enums/app-direction.enum';

import { UI_PREFERENCE_DOM_ATTRIBUTES } from '../constants/ui-preferences.constants';
import { resolveThemeAttribute } from '../helpers/ui-preferences.helper';
import { uiPreferencesSnapshotSchema } from '../schemas/ui-preferences.schema';
import { selectPreferencesSnapshot } from '../store/ui-preferences.selectors';
import { useUiPreferencesStore } from '../store/ui-preferences.store';

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

    // URL locale always owns direction; persisted preferences cannot override it.
    const documentDirection =
      getRootAttribute(UI_PREFERENCE_DOM_ATTRIBUTES.direction) === AppDirection.Rtl
        ? AppDirection.Rtl
        : AppDirection.Ltr;

    hydrate({
      ...(stored ?? selectPreferencesSnapshot(useUiPreferencesStore.getState())),
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
