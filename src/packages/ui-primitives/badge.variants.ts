import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-muted text-muted-foreground',
        brand: 'border-primary/20 bg-primary/10 text-primary-readable',
        success: 'border-success/20 bg-success/10 text-success-readable',
        warning: 'border-warning/20 bg-warning/10 text-warning-readable',
        danger: 'border-danger/20 bg-danger/10 text-danger',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
