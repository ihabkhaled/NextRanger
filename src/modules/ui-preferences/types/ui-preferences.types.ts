import type { ReactNode } from 'react';

import type { AppDirectionValue } from '@/shared/enums/app-direction.enum';
import type { AppThemeValue } from '@/shared/enums/app-theme.enum';

export interface UiPreferencesSnapshot {
  readonly theme: AppThemeValue;
  readonly direction: AppDirectionValue;
  readonly isSidebarExpanded: boolean;
}

export interface UiPreferencesState extends UiPreferencesSnapshot {
  readonly hasHydrated: boolean;
  readonly setTheme: (theme: AppThemeValue) => void;
  readonly setDirection: (direction: AppDirectionValue) => void;
  readonly toggleSidebar: () => void;
  readonly hydrate: (snapshot: UiPreferencesSnapshot) => void;
}

export interface PreferenceOptionViewModel<TValue extends string> {
  readonly value: TValue;
  readonly label: string;
  readonly isSelected: boolean;
  readonly testId: string;
}

export interface SettingsSectionProps {
  readonly legend: string;
  readonly testId: string;
  readonly children: ReactNode;
}

export interface UiPreferencesViewModel {
  readonly themeLabel: string;
  readonly themeOptions: readonly PreferenceOptionViewModel<AppThemeValue>[];
  readonly onSelectTheme: (theme: AppThemeValue) => void;
  readonly directionLabel: string;
  readonly directionOptions: readonly PreferenceOptionViewModel<AppDirectionValue>[];
  readonly onSelectDirection: (direction: AppDirectionValue) => void;
  readonly sidebarLabel: string;
  readonly sidebarStateLabel: string;
  readonly onToggleSidebar: () => void;
}

export interface BuildPreferenceOptionsInput<TValue extends string> {
  readonly values: readonly TValue[];
  readonly selectedValue: TValue;
  readonly getLabel: (value: TValue) => string;
  readonly getTestId: (value: TValue) => string;
}
