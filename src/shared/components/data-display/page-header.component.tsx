import type { ReactElement } from 'react';

import { Stack } from '@/packages/ui-primitives';

import type { PageHeaderProps } from '../types/shared-component.types';

import { pageHeaderClasses } from './page-header.variants';

export function PageHeader(props: PageHeaderProps): ReactElement {
  return (
    <Stack gap="xs">
      <h1 className={pageHeaderClasses.title}>{props.title}</h1>
      {props.subtitle ? <p className={pageHeaderClasses.subtitle}>{props.subtitle}</p> : null}
    </Stack>
  );
}
