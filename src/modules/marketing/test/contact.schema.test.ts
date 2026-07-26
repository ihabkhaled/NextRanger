import { describe, expect, it } from 'vitest';

import { CONTACT_MESSAGE_MIN_LENGTH } from '../constants/contact-form.constants';
import { contactFormSchema } from '../schemas/contact.schema';

describe('contactFormSchema', () => {
  it('accepts a useful contact request', () => {
    expect(
      contactFormSchema.safeParse({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'A sufficiently detailed project message.',
      }).success,
    ).toBe(true);
  });

  it('rejects empty, invalid, and too-short fields', () => {
    const result = contactFormSchema.safeParse({
      name: '',
      email: 'invalid',
      message: 'x'.repeat(CONTACT_MESSAGE_MIN_LENGTH - 1),
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(3);
  });
});
