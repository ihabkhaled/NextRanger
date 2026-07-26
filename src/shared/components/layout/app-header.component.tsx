import type { ReactElement } from 'react';

import { Stack } from '@/packages/ui-primitives';

import type { AppHeaderProps } from '../types/shared-component.types';

import { appHeaderClasses } from './app-header.variants';

/**
 * Site header shell. Navigation items and actions arrive as already-built
 * nodes (links composed by the layout), keeping this component TSX-only.
 */
export function AppHeader(props: AppHeaderProps): ReactElement {
  return (
    <header className={appHeaderClasses.root} data-testid={props.testId}>
      <Stack
        className={appHeaderClasses.inner}
        direction="row"
        align="center"
        justify="between"
        gap="md"
      >
        <span className={appHeaderClasses.brand}>{props.homeLabel}</span>
        <nav className={appHeaderClasses.nav} aria-label={props.navLandmarkLabel}>
          <Stack direction="row" align="center" gap="sm" wrap="wrap">
            {props.navItems}
          </Stack>
        </nav>
        {props.actions ? (
          <Stack direction="row" align="center" gap="sm">
            {props.actions}
          </Stack>
        ) : null}
      </Stack>
    </header>
  );
}
