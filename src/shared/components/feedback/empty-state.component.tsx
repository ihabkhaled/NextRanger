import type { ReactElement } from 'react';

import { Alert } from '@/packages/ui-primitives';

import type { EmptyStateProps } from '../types/shared-component.types';

export function EmptyState(props: EmptyStateProps): ReactElement {
  return (
    <Alert tone="info" data-testid={props.testId}>
      {props.message}
    </Alert>
  );
}
