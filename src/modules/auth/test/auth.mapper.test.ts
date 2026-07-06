import { describe, expect, it } from 'vitest';

import { mapLoginFormToApiRequest, mapLoginResponseToSession } from '../mappers/auth.mapper';

describe('mapLoginFormToApiRequest', () => {
  it('normalizes the email and never touches the password', () => {
    const request = mapLoginFormToApiRequest({
      email: '  User@Example.COM ',
      password: ' Secret-Password1 ',
    });

    expect(request.email).toBe('user@example.com');
    expect(request.password).toBe(' Secret-Password1 ');
  });
});

describe('mapLoginResponseToSession', () => {
  it('converts the wire response to the client session snapshot', () => {
    const session = mapLoginResponseToSession({
      user_id: 'u-1',
      display_name: 'demo',
      session_expires_at: '2026-07-06T00:00:00.000Z',
    });

    expect(session).toEqual({
      userId: 'u-1',
      displayName: 'demo',
      sessionExpiresAt: '2026-07-06T00:00:00.000Z',
    });
  });
});
