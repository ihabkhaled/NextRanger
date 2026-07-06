/**
 * Wire types for the auth backend contract. The session is cookie-based —
 * no tokens ever cross into client-readable storage.
 */
export interface LoginApiRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginApiResponse {
  readonly user_id: string;
  readonly display_name: string;
  readonly session_expires_at: string;
}
