import type { ReactElement } from 'react';

import { Spinner, Stack } from '@/packages/ui-primitives';

import type { LoadingStateProps } from '../types/shared-component.types';

export function LoadingState(props: LoadingStateProps): ReactElement {
  return (
    <Stack align="center" justify="center" gap="sm" data-testid={props.testId}>
      <Spinner label={props.label} />
    </Stack>
  );
}
