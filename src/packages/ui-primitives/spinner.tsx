import type { ReactElement } from 'react';

import { cn } from './cn';

export interface SpinnerProps {
  readonly label: string;
  readonly className?: string;
}

export function Spinner(props: SpinnerProps): ReactElement {
  return (
    <span role="status" aria-label={props.label} className={cn('inline-flex', props.className)}>
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-border border-t-primary"
      />
    </span>
  );
}
