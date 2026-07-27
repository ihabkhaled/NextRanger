import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('rounded-md border p-4 text-sm', {
  variants: {
    tone: {
      info: 'border-border bg-muted text-foreground',
      success: 'border-success/40 bg-success/10 text-success-readable',
      warning: 'border-warning/40 bg-warning/10 text-warning-readable',
      danger: 'border-danger/40 bg-danger/10 text-danger',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

export type AlertVariantProps = VariantProps<typeof alertVariants>;
