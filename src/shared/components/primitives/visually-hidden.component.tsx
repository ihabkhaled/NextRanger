import type { ReactElement } from 'react';

import type { VisuallyHiddenProps } from '../types/shared-component.types';

/** Screen-reader-only content. */
export function VisuallyHidden(props: VisuallyHiddenProps): ReactElement {
  return <span className="sr-only">{props.children}</span>;
}
