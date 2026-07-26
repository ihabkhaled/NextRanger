import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/** Standard page width, padding, and vertical rhythm. */
export function PageContainer(props: Readonly<PageContainerProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
        className,
      )}
      {...rest}
    />
  );
}
