import type { LoginFormValues } from '../types/auth.types';

/** Gateway path suffixes — the only place auth endpoints are spelled. */
export const AUTH_ENDPOINTS = {
  login: 'auth/login',
} as const;

export const LOGIN_FIELD_IDS = {
  email: 'login-email-field',
  password: 'login-password-field',
} as const;

export const PASSWORD_MIN_LENGTH = 8;

export const LOGIN_FORM_DEFAULT_VALUES: LoginFormValues = {
  email: '',
  password: '',
};
