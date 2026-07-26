import type { InputHTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Readonly<InputProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-surface-raised px-3 text-sm text-foreground shadow-xs transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger',
        className,
      )}
      {...rest}
    />
  );
}
