import type { LoginApiResponse, LoginApiRequest } from '../api/auth.api.types';
import type { AuthSessionSnapshot, LoginFormValues } from '../types/auth.types';

export function mapLoginFormToApiRequest(values: LoginFormValues): LoginApiRequest {
  return {
    email: values.email.trim().toLowerCase(),
    password: values.password,
  };
}

export function mapLoginResponseToSession(response: LoginApiResponse): AuthSessionSnapshot {
  return {
    userId: response.user_id,
    displayName: response.display_name,
    sessionExpiresAt: response.session_expires_at,
  };
}
