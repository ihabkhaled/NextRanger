import { http, HttpResponse } from '@tests/msw/handler-tools';
import { mswServer } from '@tests/msw/server';
import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import {
  createHttpClient,
  isHttpError,
  normalizeToHttpError,
  type HttpError,
} from '@/packages/axios';

describe('HttpError kind classification', () => {
  it('classifies network failures end to end', async () => {
    mswServer.use(http.get('*/kind-network', () => HttpResponse.error()));

    const failure = await createHttpClient()
      .get('/kind-network')
      .catch((error: unknown) => error);

    expect(isHttpError(failure)).toBe(true);

    const httpFailure = failure as HttpError;

    expect(httpFailure.kind).toBe('network');
    expect(httpFailure.status).toBeNull();
  });

  it('classifies vendor timeout errors', () => {
    const timedOut = new AxiosError('timeout of 10ms exceeded', AxiosError.ECONNABORTED);

    expect(normalizeToHttpError(timedOut).kind).toBe('timeout');

    const alsoTimedOut = new AxiosError('timeout', AxiosError.ETIMEDOUT);

    expect(normalizeToHttpError(alsoTimedOut).kind).toBe('timeout');
  });

  it('classifies canceled requests as aborted', () => {
    const canceled = new AxiosError('canceled', 'ERR_CANCELED');

    expect(normalizeToHttpError(canceled).kind).toBe('aborted');
  });

  it('classifies vendor errors without request or response as unknown', () => {
    const bare = new AxiosError('setup failure');

    expect(normalizeToHttpError(bare).kind).toBe('unknown');
  });
});
