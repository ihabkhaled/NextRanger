import type { ReactElement } from 'react';

import { Button, Select } from '@/packages/ui-primitives';
import { siteShellClasses } from '@/shared/components/layout/site-shell.variants';

import type { ShellControlsProps } from '../types/shell-controls.types';

export function ShellControls(props: ShellControlsProps): ReactElement {
  return (
    <>
      <Select
        className={siteShellClasses.localeSelect}
        value={props.locale}
        aria-label={props.localeLabel}
        onChange={props.onLocaleChange}
      >
        {props.localeOptions}
      </Select>
      <Button
        className={siteShellClasses.themeButton}
        variant="secondary"
        size="sm"
        aria-label={props.themeActionLabel}
        title={props.themeActionLabel}
        onClick={props.onThemeChange}
      >
        {props.themeIcon}
      </Button>
    </>
  );
}
