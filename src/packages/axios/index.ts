/**
 * Owner wrapper for `axios`. App code consumes `httpClient` / HttpError;
 * raw axios imports elsewhere are an ESLint boundary violation.
 */

export { createHttpClient, httpClient, normalizeToHttpError } from './http-client';
export { HttpError, isHttpError, type HttpErrorKind } from './http-error';
export type { HttpRequestConfig, HttpResponse } from './http-types';
