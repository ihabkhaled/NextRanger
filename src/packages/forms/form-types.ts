import type {
  DefaultValues,
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form';

import type { z } from '@/packages/zod';

/** App-owned aliases so form consumers never name vendor types directly. */
export type AppFieldErrors<TFieldValues extends FieldValues> = FieldErrors<TFieldValues>;

export type AppRegisteredFieldProps = UseFormRegisterReturn;

export interface AppZodFormOptions<TFieldValues extends FieldValues> {
  readonly schema: z.ZodType<TFieldValues>;
  readonly defaultValues: DefaultValues<TFieldValues>;
}

export type AppFormReturn<TFieldValues extends FieldValues> = UseFormReturn<TFieldValues>;
