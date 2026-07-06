import type { UiPreferencesSnapshot, UiPreferencesState } from '../types/ui-preferences.types';

export function selectPreferencesSnapshot(state: UiPreferencesState): UiPreferencesSnapshot {
  return {
    theme: state.theme,
    direction: state.direction,
    isSidebarExpanded: state.isSidebarExpanded,
  };
}
