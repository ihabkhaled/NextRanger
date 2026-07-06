/**
 * i18n message keys for user-visible errors. Every error surface renders one
 * of these — raw vendor/backend error text never reaches the user.
 */
export const ERROR_MESSAGE_KEYS = {
  generic: 'errors.generic',
  network: 'errors.network',
  timeout: 'errors.timeout',
  notFound: 'errors.notFound',
  unauthorized: 'errors.unauthorized',
  forbidden: 'errors.forbidden',
  server: 'errors.server',
  validation: 'errors.validation',
} as const;

export type ErrorMessageKey = (typeof ERROR_MESSAGE_KEYS)[keyof typeof ERROR_MESSAGE_KEYS];
