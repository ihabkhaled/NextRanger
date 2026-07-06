import type { LoginApiRequest, LoginApiResponse } from './auth.api.types';

/**
 * Demo login behavior for the BFF gateway mock mode. Any syntactically valid
 * credentials succeed except the sentinel password below, which exercises the
 * negative path in e2e tests.
 */
export const AUTH_MOCK_REJECTED_PASSWORD = 'wrong-password';

const MOCK_SESSION_TTL_MS = 60 * 60 * 1000;

export function buildLoginMockResponse(request: LoginApiRequest): LoginApiResponse | null {
  if (request.password === AUTH_MOCK_REJECTED_PASSWORD) {
    return null;
  }

  const displayName = request.email.split('@', 1)[0] || 'demo-user';

  return {
    user_id: 'u-1',
    display_name: displayName,
    session_expires_at: new Date(Date.now() + MOCK_SESSION_TTL_MS).toISOString(),
  };
}
