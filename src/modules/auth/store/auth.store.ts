import { createAppStore } from '@/packages/zustand';

import { AuthStatus } from '../enums/auth-status.enum';
import type { AuthSessionSnapshot, AuthStoreState } from '../types/auth.types';

/**
 * Client session snapshot only (display name, expiry). Zustand never holds
 * server cache or tokens — see rules/06-zustand.md.
 */
export const useAuthStore = createAppStore<AuthStoreState>()((set) => ({
  status: AuthStatus.Anonymous,
  session: null,
  setSession: (session: AuthSessionSnapshot) => {
    set({ status: AuthStatus.Authenticated, session });
  },
  clearSession: () => {
    set({ status: AuthStatus.Anonymous, session: null });
  },
}));
