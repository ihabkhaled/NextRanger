import type { HTMLAttributes, ReactElement } from 'react';

import { badgeVariants, type BadgeVariantProps } from './badge.variants';
import { cn } from './cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {}

export function Badge(props: Readonly<BadgeProps>): ReactElement {
  const { className, tone, ...rest } = props;

  return <span className={cn(badgeVariants({ tone }), className)} {...rest} />;
}
