import { describe, expect, it } from 'vitest';

import { AUTH_MOCK_REJECTED_PASSWORD, buildLoginMockResponse } from '../api/auth.mock';

describe('buildLoginMockResponse', () => {
  it('accepts any other credentials and derives the display name', () => {
    const response = buildLoginMockResponse({ email: 'jane@example.com', password: 'ok-pass-1' });

    expect(response?.display_name).toBe('jane');
    expect(response?.user_id).toBe('u-1');
  });

  it('rejects the sentinel password used by negative-path tests', () => {
    expect(
      buildLoginMockResponse({ email: 'jane@example.com', password: AUTH_MOCK_REJECTED_PASSWORD }),
    ).toBeNull();
  });

  it('falls back to a generic display name for empty emails', () => {
    const response = buildLoginMockResponse({ email: '', password: 'ok-pass-1' });

    expect(response?.display_name).toBe('demo-user');
  });
});
