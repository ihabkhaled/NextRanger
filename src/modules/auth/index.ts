/**
 * Public surface of the auth module.
 */

export { AUTH_MOCK_REJECTED_PASSWORD, buildLoginMockResponse } from './api/auth.mock';
export { LoginFormContainer } from './containers/login-form.container';
export { AuthStatus, type AuthStatusValue } from './enums/auth-status.enum';
export { selectDisplayName, selectIsAuthenticated } from './store/auth.selectors';
export { useAuthStore } from './store/auth.store';
export type { AuthSessionSnapshot, LoginFormValues } from './types/auth.types';
