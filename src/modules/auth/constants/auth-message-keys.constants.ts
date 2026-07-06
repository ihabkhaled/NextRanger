/**
 * Message keys relative to the `auth` namespace. Validation keys are also
 * embedded in the Zod schema and translated in the hook layer.
 */
export const AUTH_MESSAGE_KEYS = {
  loginTitle: 'login.title',
  loginSubtitle: 'login.subtitle',
  emailLabel: 'login.emailLabel',
  passwordLabel: 'login.passwordLabel',
  submit: 'login.submit',
  submitting: 'login.submitting',
  success: 'login.success',
  genericError: 'login.genericError',
} as const;

export const AUTH_VALIDATION_MESSAGE_KEYS = {
  emailRequired: 'login.validation.emailRequired',
  emailInvalid: 'login.validation.emailInvalid',
  passwordRequired: 'login.validation.passwordRequired',
  passwordTooShort: 'login.validation.passwordTooShort',
} as const;
