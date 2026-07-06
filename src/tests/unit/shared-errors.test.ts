import { describe, expect, it } from 'vitest';

import { HttpError } from '@/packages/axios';
import { AppError, isAppError, toAppError } from '@/shared/errors/app-error';
import { ERROR_MESSAGE_KEYS } from '@/shared/errors/error-keys.constants';
import { mapErrorToMessageKey } from '@/shared/errors/http-error-to-message-key.mapper';

describe('AppError', () => {
  it('carries the message key and detects its own instances', () => {
    const error = new AppError(ERROR_MESSAGE_KEYS.notFound);

    expect(error.messageKey).toBe(ERROR_MESSAGE_KEYS.notFound);
    expect(isAppError(error)).toBe(true);
    expect(isAppError(new Error('plain'))).toBe(false);
  });

  it('toAppError passes AppError through and wraps everything else as generic', () => {
    const original = new AppError(ERROR_MESSAGE_KEYS.forbidden);

    expect(toAppError(original)).toBe(original);
    expect(toAppError(new Error('boom')).messageKey).toBe(ERROR_MESSAGE_KEYS.generic);
    expect(toAppError('string failure').messageKey).toBe(ERROR_MESSAGE_KEYS.generic);
  });
});

function httpError(options: ConstructorParameters<typeof HttpError>[0]): HttpError {
  return new HttpError(options);
}

describe('mapErrorToMessageKey', () => {
  it('maps non-HttpError values to generic', () => {
    expect(mapErrorToMessageKey(new Error('x'))).toBe(ERROR_MESSAGE_KEYS.generic);
    expect(mapErrorToMessageKey(null)).toBe(ERROR_MESSAGE_KEYS.generic);
  });

  it('maps network and timeout kinds', () => {
    expect(mapErrorToMessageKey(httpError({ kind: 'network', message: 'x' }))).toBe(
      ERROR_MESSAGE_KEYS.network,
    );
    expect(mapErrorToMessageKey(httpError({ kind: 'timeout', message: 'x' }))).toBe(
      ERROR_MESSAGE_KEYS.timeout,
    );
  });

  it('maps status codes to their dedicated keys', () => {
    expect(mapErrorToMessageKey(httpError({ kind: 'http', message: 'x', status: 401 }))).toBe(
      ERROR_MESSAGE_KEYS.unauthorized,
    );
    expect(mapErrorToMessageKey(httpError({ kind: 'http', message: 'x', status: 403 }))).toBe(
      ERROR_MESSAGE_KEYS.forbidden,
    );
    expect(mapErrorToMessageKey(httpError({ kind: 'http', message: 'x', status: 404 }))).toBe(
      ERROR_MESSAGE_KEYS.notFound,
    );
    expect(mapErrorToMessageKey(httpError({ kind: 'http', message: 'x', status: 500 }))).toBe(
      ERROR_MESSAGE_KEYS.server,
    );
    expect(mapErrorToMessageKey(httpError({ kind: 'http', message: 'x', status: 503 }))).toBe(
      ERROR_MESSAGE_KEYS.server,
    );
  });

  it('falls back to generic for unhandled statuses and missing status', () => {
    expect(mapErrorToMessageKey(httpError({ kind: 'http', message: 'x', status: 418 }))).toBe(
      ERROR_MESSAGE_KEYS.generic,
    );
    expect(mapErrorToMessageKey(httpError({ kind: 'unknown', message: 'x' }))).toBe(
      ERROR_MESSAGE_KEYS.generic,
    );
  });
});
