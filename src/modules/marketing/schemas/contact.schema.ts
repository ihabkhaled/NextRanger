import { z } from '@/packages/zod';

import {
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_VALIDATION_KEYS,
} from '../constants/contact-form.constants';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, CONTACT_VALIDATION_KEYS.nameRequired),
  email: z
    .string()
    .trim()
    .min(1, CONTACT_VALIDATION_KEYS.emailRequired)
    .pipe(z.email(CONTACT_VALIDATION_KEYS.emailInvalid)),
  message: z
    .string()
    .trim()
    .min(1, CONTACT_VALIDATION_KEYS.messageRequired)
    .min(CONTACT_MESSAGE_MIN_LENGTH, CONTACT_VALIDATION_KEYS.messageShort),
});
