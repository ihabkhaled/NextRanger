import type { ReactElement } from 'react';

import { Label, Stack } from '@/packages/ui-primitives';

import type { FormFieldProps } from '../types/shared-component.types';

import { formFieldClasses } from './form-field.variants';

/**
 * Accessible field wrapper: label is bound to the control via htmlFor, and
 * the error region is referenced by the control's aria-describedby
 * (`<fieldId>-error`), wired by the container.
 */
export function FormField(props: FormFieldProps): ReactElement {
  return (
    <Stack gap="xs">
      <Label htmlFor={props.fieldId}>{props.label}</Label>
      {props.children}
      {props.error ? (
        <p id={`${props.fieldId}-error`} role="alert" className={formFieldClasses.error}>
          {props.error}
        </p>
      ) : null}
    </Stack>
  );
}
