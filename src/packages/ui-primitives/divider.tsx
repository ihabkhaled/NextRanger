import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type DividerProps = HTMLAttributes<HTMLHRElement>;

export function Divider(props: Readonly<DividerProps>): ReactElement {
  const { className, ...rest } = props;

  return <hr className={cn('w-full border-0 border-t border-border', className)} {...rest} />;
}
