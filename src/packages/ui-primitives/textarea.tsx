import type { ReactElement, TextareaHTMLAttributes } from 'react';

import { cn } from './cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea(props: Readonly<TextareaProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-sm text-foreground shadow-xs transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger',
        className,
      )}
      {...rest}
    />
  );
}
