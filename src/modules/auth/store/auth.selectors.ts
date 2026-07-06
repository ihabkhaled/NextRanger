import { AuthStatus } from '../enums/auth-status.enum';
import type { AuthStoreState } from '../types/auth.types';

export function selectIsAuthenticated(state: AuthStoreState): boolean {
  return state.status === AuthStatus.Authenticated;
}

export function selectDisplayName(state: AuthStoreState): string | null {
  return state.session?.displayName ?? null;
}
