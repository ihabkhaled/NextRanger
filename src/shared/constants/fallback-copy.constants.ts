/**
 * English-only fallback copy for the global error boundary, which renders
 * when the app shell (including the i18n provider) has crashed. This is the
 * single documented exception to the "all copy is translated" rule — at this
 * point there is no i18n runtime left to translate with.
 */
export const FALLBACK_ERROR_COPY = {
  title: 'Something went wrong',
  description: 'An unexpected error occurred. Please try again.',
  retry: 'Try again',
} as const;
