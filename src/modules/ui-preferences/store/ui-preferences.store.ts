import { createAppStore } from '@/packages/zustand';

import { UI_PREFERENCES_DEFAULTS } from '../constants/ui-preferences.constants';
import type { UiPreferencesSnapshot, UiPreferencesState } from '../types/ui-preferences.types';

/**
 * True client global state: theme, direction, sidebar. Persistence and DOM
 * side effects live in the effects hook — the store itself stays pure.
 */
export const useUiPreferencesStore = createAppStore<UiPreferencesState>()((set) => ({
  ...UI_PREFERENCES_DEFAULTS,
  hasHydrated: false,
  setTheme: (theme) => {
    set({ theme });
  },
  setDirection: (direction) => {
    set({ direction });
  },
  toggleSidebar: () => {
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded }));
  },
  hydrate: (snapshot: UiPreferencesSnapshot) => {
    set({ ...snapshot, hasHydrated: true });
  },
}));
