import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card(props: Readonly<CardProps>): ReactElement {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface-raised p-6 shadow-sm shadow-shadow/5 transition-[border-color,box-shadow,transform]',
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader(props: Readonly<HTMLAttributes<HTMLDivElement>>): ReactElement {
  const { className, ...rest } = props;

  return <div className={cn('flex flex-col gap-1.5', className)} {...rest} />;
}

export function CardTitle(props: Readonly<HTMLAttributes<HTMLHeadingElement>>): ReactElement {
  const { className, children, ...rest } = props;

  return (
    <h2 className={cn('text-lg font-bold tracking-tight text-foreground', className)} {...rest}>
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

  return <div className={cn('pt-5', className)} {...rest} />;
}

export function CardFooter(props: Readonly<HTMLAttributes<HTMLDivElement>>): ReactElement {
  const { className, ...rest } = props;

  return <div className={cn('flex items-center gap-3 pt-5', className)} {...rest} />;
}
