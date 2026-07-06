import type { ButtonHTMLAttributes, ReactElement } from 'react';

import { buttonVariants, type ButtonVariantProps } from './button.variants';
import { cn } from './cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {}

export function Button(props: Readonly<ButtonProps>): ReactElement {
  const { className, variant, size, type, ...rest } = props;

  return (
    <button
      type={type ?? 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}
