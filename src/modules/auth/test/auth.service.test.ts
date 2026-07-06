import { describe, expect, it } from 'vitest';

import { isHttpError, type HttpError } from '@/packages/axios';

import { AUTH_MOCK_REJECTED_PASSWORD } from '../api/auth.mock';
import { login } from '../services/auth.service';

describe('login', () => {
  it('returns the session snapshot for valid credentials', async () => {
    const session = await login({ email: 'Demo@Example.com', password: 'valid-password' });

    expect(session.userId).toBe('u-1');
    expect(session.displayName).toBe('demo');
    expect(new Date(session.sessionExpiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('throws a normalized HttpError with status 401 for rejected credentials', async () => {
    const failure = await login({
      email: 'demo@example.com',
      password: AUTH_MOCK_REJECTED_PASSWORD,
    }).catch((error: unknown) => error);

    expect(isHttpError(failure)).toBe(true);

    const httpFailure = failure as HttpError;

    expect(httpFailure.status).toBe(401);
    expect(httpFailure.kind).toBe('http');
  });
});
