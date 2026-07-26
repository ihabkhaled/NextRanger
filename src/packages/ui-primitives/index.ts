/**
 * Owner wrapper for the design-system toolchain (clsx, tailwind-merge,
 * class-variance-authority) and home of the low-level primitives. This is one
 * of the only places raw Tailwind class strings are allowed — everywhere else
 * imports variants/constants.
 */

export { Alert, type AlertProps } from './alert';
export { alertVariants, type AlertVariantProps } from './alert.variants';
export { Badge, type BadgeProps } from './badge';
export { badgeVariants, type BadgeVariantProps } from './badge.variants';
export { Button, type ButtonProps } from './button';
export { buttonVariants, type ButtonVariantProps } from './button.variants';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
} from './card';
export { cn } from './cn';
export { Divider, type DividerProps } from './divider';
export { Input, type InputProps } from './input';
export { Label, type LabelProps } from './label';
export { PageContainer, type PageContainerProps } from './page-container';
export { Select, type SelectProps } from './select';
export { Skeleton, type SkeletonProps } from './skeleton';
export { Spinner, type SpinnerProps } from './spinner';
export { Stack, type StackProps } from './stack';
export { stackVariants, type StackVariantProps } from './stack.variants';
export { Textarea, type TextareaProps } from './textarea';
