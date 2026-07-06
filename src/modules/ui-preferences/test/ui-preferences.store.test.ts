import { beforeEach, describe, expect, it } from 'vitest';

import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';

import { UI_PREFERENCES_DEFAULTS } from '../constants/ui-preferences.constants';
import { selectPreferencesSnapshot } from '../store/ui-preferences.selectors';
import { useUiPreferencesStore } from '../store/ui-preferences.store';

describe('ui-preferences store', () => {
  beforeEach(() => {
    useUiPreferencesStore.setState({ ...UI_PREFERENCES_DEFAULTS, hasHydrated: false });
  });

  it('starts with the documented defaults, not yet hydrated', () => {
    const state = useUiPreferencesStore.getState();

    expect(selectPreferencesSnapshot(state)).toEqual(UI_PREFERENCES_DEFAULTS);
    expect(state.hasHydrated).toBe(false);
  });

  it('setTheme and setDirection update the snapshot', () => {
    useUiPreferencesStore.getState().setTheme(AppTheme.Dark);
    useUiPreferencesStore.getState().setDirection(AppDirection.Rtl);

    const snapshot = selectPreferencesSnapshot(useUiPreferencesStore.getState());

    expect(snapshot.theme).toBe(AppTheme.Dark);
    expect(snapshot.direction).toBe(AppDirection.Rtl);
  });

  it('toggleSidebar flips the flag both ways', () => {
    useUiPreferencesStore.getState().toggleSidebar();
    expect(useUiPreferencesStore.getState().isSidebarExpanded).toBe(false);

    useUiPreferencesStore.getState().toggleSidebar();
    expect(useUiPreferencesStore.getState().isSidebarExpanded).toBe(true);
  });

  it('hydrate applies a stored snapshot and marks hydration done', () => {
    useUiPreferencesStore.getState().hydrate({
      theme: AppTheme.Dark,
      direction: AppDirection.Rtl,
      isSidebarExpanded: false,
    });

    const state = useUiPreferencesStore.getState();

    expect(state.hasHydrated).toBe(true);
    expect(state.theme).toBe(AppTheme.Dark);
    expect(state.direction).toBe(AppDirection.Rtl);
    expect(state.isSidebarExpanded).toBe(false);
  });
});
