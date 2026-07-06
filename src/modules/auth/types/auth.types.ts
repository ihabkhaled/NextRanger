import type { SyntheticEvent } from 'react';

import type { AppRegisteredFieldProps } from '@/packages/forms';

import type { AuthStatusValue } from '../enums/auth-status.enum';

export interface LoginFormValues {
  readonly email: string;
  readonly password: string;
}

/**
 * Client-visible session snapshot. Deliberately token-free: authentication
 * material lives in HttpOnly cookies managed by the gateway.
 */
export interface AuthSessionSnapshot {
  readonly userId: string;
  readonly displayName: string;
  readonly sessionExpiresAt: string;
}

export interface AuthStoreState {
  readonly status: AuthStatusValue;
  readonly session: AuthSessionSnapshot | null;
  readonly setSession: (session: AuthSessionSnapshot) => void;
  readonly clearSession: () => void;
}

export interface LoginFieldViewModel {
  readonly fieldId: string;
  readonly label: string;
  readonly error: string | undefined;
  readonly testId: string;
  readonly inputProps: AppRegisteredFieldProps;
}

export interface LoginFormProps {
  readonly viewModel: LoginFormViewModel;
}

export interface LoginFormViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly submitLabel: string;
  readonly isSubmitting: boolean;
  readonly formError: string | null;
  readonly email: LoginFieldViewModel;
  readonly password: LoginFieldViewModel;
  readonly onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}
