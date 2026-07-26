import type { ReactElement } from 'react';

import { Alert, Button, Input, Stack, Textarea } from '@/packages/ui-primitives';
import { FormField } from '@/shared/components/forms/form-field.component';

import { marketingClasses } from '../constants/marketing-style.constants';
import type { ContactFormProps } from '../types/marketing.types';

export function ContactForm(props: ContactFormProps): ReactElement {
  return (
    <form className={marketingClasses.contact} onSubmit={props.viewModel.onSubmit} noValidate>
      <Stack gap="md">
        <FormField
          fieldId={props.viewModel.name.fieldId}
          label={props.viewModel.name.label}
          error={props.viewModel.name.error}
        >
          <Input
            id={props.viewModel.name.fieldId}
            autoComplete="name"
            aria-invalid={Boolean(props.viewModel.name.error)}
            {...props.viewModel.name.inputProps}
          />
        </FormField>
        <FormField
          fieldId={props.viewModel.email.fieldId}
          label={props.viewModel.email.label}
          error={props.viewModel.email.error}
        >
          <Input
            id={props.viewModel.email.fieldId}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(props.viewModel.email.error)}
            {...props.viewModel.email.inputProps}
          />
        </FormField>
        <FormField
          fieldId={props.viewModel.message.fieldId}
          label={props.viewModel.message.label}
          error={props.viewModel.message.error}
        >
          <Textarea
            id={props.viewModel.message.fieldId}
            rows={6}
            aria-invalid={Boolean(props.viewModel.message.error)}
            {...props.viewModel.message.inputProps}
          />
        </FormField>
        <Button type="submit">{props.viewModel.submitLabel}</Button>
        {props.viewModel.outcome ? (
          <Alert tone="info" role="status">
            {props.viewModel.outcome}
          </Alert>
        ) : null}
      </Stack>
    </form>
  );
}
