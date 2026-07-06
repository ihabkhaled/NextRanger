import { beforeEach, describe, expect, it } from 'vitest';

import { AuthStatus } from '../enums/auth-status.enum';
import { selectDisplayName, selectIsAuthenticated } from '../store/auth.selectors';
import { useAuthStore } from '../store/auth.store';

const session = {
  userId: 'u-1',
  displayName: 'demo',
  sessionExpiresAt: '2026-07-06T00:00:00.000Z',
};

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('starts anonymous with no session', () => {
    const state = useAuthStore.getState();

    expect(state.status).toBe(AuthStatus.Anonymous);
    expect(selectIsAuthenticated(state)).toBe(false);
    expect(selectDisplayName(state)).toBeNull();
  });

  it('setSession authenticates and stores the snapshot', () => {
    useAuthStore.getState().setSession(session);

    const state = useAuthStore.getState();

    expect(state.status).toBe(AuthStatus.Authenticated);
    expect(selectIsAuthenticated(state)).toBe(true);
    expect(selectDisplayName(state)).toBe('demo');
  });

  it('clearSession returns to anonymous', () => {
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().clearSession();

    const state = useAuthStore.getState();

    expect(state.status).toBe(AuthStatus.Anonymous);
    expect(state.session).toBeNull();
  });
});
