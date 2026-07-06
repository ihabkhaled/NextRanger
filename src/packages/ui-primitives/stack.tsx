import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';
import { stackVariants, type StackVariantProps } from './stack.variants';

export interface StackProps extends HTMLAttributes<HTMLDivElement>, StackVariantProps {}

/** Flex layout primitive with logical-direction awareness (RTL-safe). */
export function Stack(props: Readonly<StackProps>): ReactElement {
  const { className, direction, gap, align, justify, wrap, ...rest } = props;

  return (
    <div
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...rest}
    />
  );
}
