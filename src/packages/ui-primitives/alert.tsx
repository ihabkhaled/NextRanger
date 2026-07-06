import type { HTMLAttributes, ReactElement } from 'react';

import { alertVariants, type AlertVariantProps } from './alert.variants';
import { cn } from './cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, AlertVariantProps {}

export function Alert(props: Readonly<AlertProps>): ReactElement {
  const { className, tone, ...rest } = props;

  return <div role="status" className={cn(alertVariants({ tone }), className)} {...rest} />;
}
