import { isHttpError } from '@/packages/axios';

import { ERROR_MESSAGE_KEYS, type ErrorMessageKey } from './error-keys.constants';
import {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR_FLOOR,
  HTTP_STATUS_UNAUTHORIZED,
} from './http-status.constants';

/**
 * Sanitize any thrown value into a translatable error key. This is the only
 * path from transport failures to user-visible copy.
 */
export function mapErrorToMessageKey(error: unknown): ErrorMessageKey {
  if (!isHttpError(error)) {
    return ERROR_MESSAGE_KEYS.generic;
  }

  if (error.kind === 'network') {
    return ERROR_MESSAGE_KEYS.network;
  }

  if (error.kind === 'timeout') {
    return ERROR_MESSAGE_KEYS.timeout;
  }

  if (error.status === null) {
    return ERROR_MESSAGE_KEYS.generic;
  }

  if (error.status === HTTP_STATUS_UNAUTHORIZED) {
    return ERROR_MESSAGE_KEYS.unauthorized;
  }

  if (error.status === HTTP_STATUS_FORBIDDEN) {
    return ERROR_MESSAGE_KEYS.forbidden;
  }

  if (error.status === HTTP_STATUS_NOT_FOUND) {
    return ERROR_MESSAGE_KEYS.notFound;
  }

  if (error.status >= HTTP_STATUS_SERVER_ERROR_FLOOR) {
    return ERROR_MESSAGE_KEYS.server;
  }

  return ERROR_MESSAGE_KEYS.generic;
}
