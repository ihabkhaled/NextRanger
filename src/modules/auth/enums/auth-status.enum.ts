export const AuthStatus = {
  Anonymous: 'anonymous',
  Authenticated: 'authenticated',
} as const;

export type AuthStatusValue = (typeof AuthStatus)[keyof typeof AuthStatus];
