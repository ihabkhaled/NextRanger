import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card(props: Readonly<CardProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <div
      className={cn('rounded-lg border border-border bg-surface p-6 shadow-sm', className)}
      {...rest}
    />
  );
}

export function CardTitle(props: Readonly<HTMLAttributes<HTMLHeadingElement>>): ReactElement {
  const { className, children, ...rest } = props;

  return (
    <h2 className={cn('text-lg font-semibold text-foreground', className)} {...rest}>
      {children}
    </h2>
  );
}

export function CardDescription(
  props: Readonly<HTMLAttributes<HTMLParagraphElement>>,
): ReactElement {
  const { className, ...rest } = props;

  return <p className={cn('text-sm text-muted-foreground', className)} {...rest} />;
}

export function CardContent(props: Readonly<HTMLAttributes<HTMLDivElement>>): ReactElement {
  const { className, ...rest } = props;

  return <div className={cn('pt-4', className)} {...rest} />;
}
