import { describe, expect, it } from 'vitest';

import { safeParseSchema } from '@/packages/zod';

import { AUTH_VALIDATION_MESSAGE_KEYS } from '../constants/auth-message-keys.constants';
import { loginApiResponseSchema, loginFormSchema } from '../schemas/auth.schema';

function firstIssueMessage(value: unknown): string | null {
  const result = safeParseSchema(loginFormSchema, value);

  if (result.success) {
    return null;
  }

  return result.issues[0]?.message ?? null;
}

describe('loginFormSchema', () => {
  it('accepts valid credentials', () => {
    const result = safeParseSchema(loginFormSchema, {
      email: 'user@example.com',
      password: 'long-enough-password',
    });

    expect(result.success).toBe(true);
  });

  it('reports the emailRequired key for an empty email', () => {
    expect(firstIssueMessage({ email: '', password: 'long-enough-password' })).toBe(
      AUTH_VALIDATION_MESSAGE_KEYS.emailRequired,
    );
  });

  it('reports the emailInvalid key for a malformed email', () => {
    expect(firstIssueMessage({ email: 'not-an-email', password: 'long-enough-password' })).toBe(
      AUTH_VALIDATION_MESSAGE_KEYS.emailInvalid,
    );
  });

  it('reports the passwordRequired key for an empty password', () => {
    expect(firstIssueMessage({ email: 'user@example.com', password: '' })).toBe(
      AUTH_VALIDATION_MESSAGE_KEYS.passwordRequired,
    );
  });

  it('reports the passwordTooShort key below the minimum length', () => {
    expect(firstIssueMessage({ email: 'user@example.com', password: 'short' })).toBe(
      AUTH_VALIDATION_MESSAGE_KEYS.passwordTooShort,
    );
  });
});

describe('loginApiResponseSchema', () => {
  it('accepts a valid wire response', () => {
    const result = safeParseSchema(loginApiResponseSchema, {
      user_id: 'u-1',
      display_name: 'demo',
      session_expires_at: '2026-07-06T00:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a non-ISO expiry', () => {
    const result = safeParseSchema(loginApiResponseSchema, {
      user_id: 'u-1',
      display_name: 'demo',
      session_expires_at: 'soon',
    });

    expect(result.success).toBe(false);
  });
});
