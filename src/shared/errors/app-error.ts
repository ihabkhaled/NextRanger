import { ERROR_MESSAGE_KEYS, type ErrorMessageKey } from './error-keys.constants';

/**
 * App-level error carrying a translatable message key instead of raw text.
 */
export class AppError extends Error {
  readonly messageKey: ErrorMessageKey;

  constructor(messageKey: ErrorMessageKey, options?: { cause?: unknown }) {
    super(`AppError: ${messageKey}`, options);
    this.name = 'AppError';
    this.messageKey = messageKey;
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

export function toAppError(value: unknown): AppError {
  if (isAppError(value)) {
    return value;
  }

  return new AppError(ERROR_MESSAGE_KEYS.generic, { cause: value });
}
