'use client';
// client-boundary-reason: binds the interactive preferences store (theme, direction, sidebar) to option buttons.

import type { ReactElement } from 'react';

import { Button } from '@/packages/ui-primitives';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

import { SettingsSection } from '../components/settings-section.component';
import { useUiPreferences } from '../hooks/use-ui-preferences.hook';

export function UiPreferencesContainer(): ReactElement {
  const viewModel = useUiPreferences();

  return (
    <>
      <SettingsSection legend={viewModel.themeLabel} testId={TEST_IDS.settingsTheme}>
        {viewModel.themeOptions.map((option) => (
          <Button
            key={option.value}
            variant={option.isSelected ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={option.isSelected}
            data-testid={option.testId}
            onClick={() => {
              viewModel.onSelectTheme(option.value);
            }}
          >
            {option.label}
          </Button>
        ))}
      </SettingsSection>
      <SettingsSection legend={viewModel.sidebarLabel} testId={TEST_IDS.settingsSidebar}>
        <Button variant="secondary" size="sm" onClick={viewModel.onToggleSidebar}>
          {viewModel.sidebarStateLabel}
        </Button>
      </SettingsSection>
    </>
  );
}
