import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/** Standard page width, padding, and vertical rhythm. */
export function PageContainer(props: Readonly<PageContainerProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <div
      className={cn('mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10', className)}
      {...rest}
    />
  );
}
