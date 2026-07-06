import type { InputHTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Readonly<InputProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger',
        className,
      )}
      {...rest}
    />
  );
}
