import type { ReactElement } from 'react';

import { Alert, Button, Stack } from '@/packages/ui-primitives';

import type { ErrorStateProps } from '../types/shared-component.types';

export function ErrorState(props: ErrorStateProps): ReactElement {
  return (
    <Stack gap="sm" data-testid={props.testId}>
      <Alert tone="danger">{props.message}</Alert>
      <Stack direction="row" justify="start">
        <Button variant="secondary" onClick={props.onRetry}>
          {props.retryLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
