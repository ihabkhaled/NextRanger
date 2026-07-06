import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

import { HttpError, type HttpErrorKind } from './http-error';

const DEFAULT_TIMEOUT_MS = 15_000;

function classifyAxiosError(error: AxiosError): HttpErrorKind {
  if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
    return 'timeout';
  }

  if (error.code === 'ERR_CANCELED') {
    return 'aborted';
  }

  if (error.response) {
    return 'http';
  }

  if (error.request) {
    return 'network';
  }

  return 'unknown';
}

export function normalizeToHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const kind = classifyAxiosError(error);

    return new HttpError({
      kind,
      message: error.message,
      ...(error.response ? { status: error.response.status } : {}),
      ...(error.response ? { responseBody: error.response.data } : {}),
    });
  }

  return new HttpError({
    kind: 'unknown',
    message: error instanceof Error ? error.message : 'Unknown HTTP failure',
  });
}

/**
 * Create an app-owned HTTP client. Every response error is normalized to
 * HttpError before it can reach a service.
 */
export function createHttpClient(config?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create({
    timeout: DEFAULT_TIMEOUT_MS,
    ...config,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      throw normalizeToHttpError(error);
    },
  );

  return instance;
}

/**
 * Default client for browser code. Requests target same-origin BFF routes
 * (`/api/gateway/...`), never external hosts directly.
 */
export const httpClient: AxiosInstance = createHttpClient();
