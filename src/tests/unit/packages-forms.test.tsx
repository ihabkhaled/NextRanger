import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useAppZodForm } from '@/packages/forms';
import { z } from '@/packages/zod';

interface DemoFormValues {
  email: string;
  [key: string]: unknown;
}

const demoSchema = z.object({
  email: z.string().min(1, 'demo.required').pipe(z.email('demo.invalid')),
}) as unknown as z.ZodType<DemoFormValues>;

describe('useAppZodForm', () => {
  it('validates through the zod schema and surfaces message keys', async () => {
    const { result } = renderHook(() => {
      const form = useAppZodForm<DemoFormValues>({
        schema: demoSchema,
        defaultValues: { email: '' },
      });

      // formState is a lazy proxy: reading errors during render subscribes
      // this hook to validation-state updates (mirrors real hook usage).
      return { form, emailError: form.formState.errors.email?.message };
    });

    await act(async () => {
      await result.current.form.handleSubmit(() => {})();
    });

    expect(result.current.emailError).toBe('demo.required');
  });

  it('passes valid values to the submit handler', async () => {
    let submitted: DemoFormValues | null = null;

    const { result } = renderHook(() =>
      useAppZodForm<DemoFormValues>({
        schema: demoSchema,
        defaultValues: { email: 'user@example.com' },
      }),
    );

    await act(async () => {
      await result.current.handleSubmit((values) => {
        submitted = values;
      })();
    });

    expect(submitted).toEqual({ email: 'user@example.com' });
  });
});
