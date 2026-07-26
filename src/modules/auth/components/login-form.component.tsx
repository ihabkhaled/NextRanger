import type { ReactElement } from 'react';

import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Input,
  Stack,
} from '@/packages/ui-primitives';
import { FormField } from '@/shared/components/forms/form-field.component';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

import { loginFormClasses } from '../constants/auth-style.constants';
import type { LoginFormProps } from '../types/auth.types';

/**
 * TSX-only login form. All labels/errors are pre-translated; all behavior
 * (validation, submission, redirect) lives in the hook behind the container.
 */
export function LoginForm(props: LoginFormProps): ReactElement {
  return (
    <Card className={loginFormClasses.card}>
      <Stack gap="sm">
        <CardTitle>{props.viewModel.title}</CardTitle>
        <CardDescription>{props.viewModel.subtitle}</CardDescription>
      </Stack>
      <form
        className={loginFormClasses.form}
        onSubmit={props.viewModel.onSubmit}
        noValidate
        data-testid={TEST_IDS.loginForm}
      >
        <Stack gap="md">
          {props.viewModel.formError ? (
            <Alert tone="danger" data-testid={TEST_IDS.loginError}>
              {props.viewModel.formError}
            </Alert>
          ) : null}
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
              aria-describedby={`${props.viewModel.email.fieldId}-error`}
              data-testid={props.viewModel.email.testId}
              {...props.viewModel.email.inputProps}
            />
          </FormField>
          <FormField
            fieldId={props.viewModel.password.fieldId}
            label={props.viewModel.password.label}
            error={props.viewModel.password.error}
          >
            <Input
              id={props.viewModel.password.fieldId}
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(props.viewModel.password.error)}
              aria-describedby={`${props.viewModel.password.fieldId}-error`}
              data-testid={props.viewModel.password.testId}
              {...props.viewModel.password.inputProps}
            />
          </FormField>
          <Button
            type="submit"
            disabled={props.viewModel.isSubmitting}
            data-testid={TEST_IDS.loginSubmit}
          >
            {props.viewModel.submitLabel}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
