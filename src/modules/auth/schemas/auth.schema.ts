import { z } from '@/packages/zod';

import { AUTH_VALIDATION_MESSAGE_KEYS } from '../constants/auth-message-keys.constants';
import { PASSWORD_MIN_LENGTH } from '../constants/auth.constants';

/**
 * Form schema. Error messages are i18n keys (auth namespace) translated by
 * the hook before display — raw copy never lives in schemas.
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGE_KEYS.emailRequired)
    .pipe(z.email(AUTH_VALIDATION_MESSAGE_KEYS.emailInvalid)),
  password: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGE_KEYS.passwordRequired)
    .min(PASSWORD_MIN_LENGTH, AUTH_VALIDATION_MESSAGE_KEYS.passwordTooShort),
});

/** Wire-format validation for the login response. */
export const loginApiResponseSchema = z.object({
  user_id: z.string().min(1),
  display_name: z.string().min(1),
  session_expires_at: z.iso.datetime(),
});
