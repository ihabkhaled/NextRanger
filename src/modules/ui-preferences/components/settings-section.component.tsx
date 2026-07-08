import type { ReactElement } from 'react';

import { Stack } from '@/packages/ui-primitives';

import { settingsSectionClasses } from '../constants/ui-preferences-style.constants';
import type { SettingsSectionProps } from '../types/ui-preferences.types';

/** TSX-only section shell: translated legend + prepared option buttons. */
export function SettingsSection(props: SettingsSectionProps): ReactElement {
  return (
    <fieldset className={settingsSectionClasses.root} data-testid={props.testId}>
      <legend className={settingsSectionClasses.legend}>{props.legend}</legend>
      <Stack direction="row" gap="sm" wrap="wrap">
        {props.children}
      </Stack>
    </fieldset>
  );
}
