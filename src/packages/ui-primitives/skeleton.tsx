import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton(props: Readonly<SkeletonProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...rest}
    />
  );
}
