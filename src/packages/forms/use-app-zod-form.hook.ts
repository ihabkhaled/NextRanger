import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldValues, type Resolver } from 'react-hook-form';

import type { z } from '@/packages/zod';

import type { AppFormReturn, AppZodFormOptions } from './form-types';

/**
 * The app form hook: react-hook-form wired to a Zod schema. Validation always
 * runs through the schema — no ad-hoc validate callbacks.
 *
 * The resolver cast below is the single sanctioned bridge between the vendor
 * generics of @hookform/resolvers and our generic facade: zodResolver cannot
 * carry an abstract TFieldValues through its overloads under
 * exactOptionalPropertyTypes. The runtime contract is unchanged (schema
 * output == form values), which is what the wrapper guarantees.
 */
export function useAppZodForm<TFieldValues extends FieldValues>(
  options: AppZodFormOptions<TFieldValues>,
): AppFormReturn<TFieldValues> {
  const resolver = zodResolver(
    options.schema as unknown as z.ZodType<FieldValues, FieldValues>,
  ) as unknown as Resolver<TFieldValues>;

  return useForm<TFieldValues>({
    resolver,
    defaultValues: options.defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
}
