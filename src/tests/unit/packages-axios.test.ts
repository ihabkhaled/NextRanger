import { http, HttpResponse } from '@tests/msw/handler-tools';
import { mswServer } from '@tests/msw/server';
import { describe, expect, it } from 'vitest';

import { createHttpClient, HttpError, isHttpError, normalizeToHttpError } from '@/packages/axios';

describe('normalizeToHttpError', () => {
  it('passes HttpError instances through unchanged', () => {
    const original = new HttpError({ kind: 'timeout', message: 'slow' });

    expect(normalizeToHttpError(original)).toBe(original);
  });

  it('wraps plain errors and unknown values as unknown kind', () => {
    expect(normalizeToHttpError(new Error('boom')).kind).toBe('unknown');
    expect(normalizeToHttpError('boom').kind).toBe('unknown');
    expect(normalizeToHttpError('boom').message).toBe('Unknown HTTP failure');
  });
});

describe('createHttpClient interceptor', () => {
  it('normalizes HTTP failures into HttpError with status and body', async () => {
    mswServer.use(
      http.get('*/interceptor-check', () => HttpResponse.json({ error: 'nope' }, { status: 503 })),
    );

    const client = createHttpClient();
    const failure = await client.get('/interceptor-check').catch((error: unknown) => error);

    expect(isHttpError(failure)).toBe(true);

    const httpFailure = failure as HttpError;

    expect(httpFailure.kind).toBe('http');
    expect(httpFailure.status).toBe(503);
    expect(httpFailure.responseBody).toEqual({ error: 'nope' });
  });

  it('returns successful responses untouched', async () => {
    mswServer.use(http.get('*/interceptor-ok', () => HttpResponse.json({ fine: true })));

    const client = createHttpClient();
    const response = await client.get<{ fine: boolean }>('/interceptor-ok');

    expect(response.data).toEqual({ fine: true });
  });
});
