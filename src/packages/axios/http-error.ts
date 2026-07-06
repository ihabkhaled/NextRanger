export type HttpErrorKind = 'http' | 'network' | 'timeout' | 'aborted' | 'unknown';

/**
 * App-owned HTTP error. Vendor (axios) errors never leave the wrapper —
 * services and hooks only ever see HttpError.
 */
export class HttpError extends Error {
  readonly kind: HttpErrorKind;
  readonly status: number | null;
  readonly responseBody: unknown;

  constructor(options: {
    kind: HttpErrorKind;
    message: string;
    status?: number;
    responseBody?: unknown;
  }) {
    super(options.message);
    this.name = 'HttpError';
    this.kind = options.kind;
    this.status = options.status ?? null;
    this.responseBody = options.responseBody ?? null;
  }
}

export function isHttpError(value: unknown): value is HttpError {
  return value instanceof HttpError;
}
