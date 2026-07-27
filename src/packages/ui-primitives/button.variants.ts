import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-xs transition-[color,background-color,border-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-md',
        secondary:
          'border border-border bg-surface-raised text-foreground hover:border-primary/25 hover:bg-muted',
        soft: 'border border-primary/15 bg-primary/10 text-primary-readable hover:bg-primary/15',
        danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
        ghost: 'shadow-none text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-9 px-3.5',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-base',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
