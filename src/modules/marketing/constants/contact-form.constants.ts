export const CONTACT_FIELD_IDS = {
  name: 'contact-name',
  email: 'contact-email',
  message: 'contact-message',
} as const;
export const CONTACT_FORM_DEFAULTS = { name: '', email: '', message: '' } as const;
export const CONTACT_MESSAGE_MIN_LENGTH = 20;
export const CONTACT_VALIDATION_KEYS = {
  nameRequired: 'contactForm.validation.nameRequired',
  emailRequired: 'contactForm.validation.emailRequired',
  emailInvalid: 'contactForm.validation.emailInvalid',
  messageRequired: 'contactForm.validation.messageRequired',
  messageShort: 'contactForm.validation.messageShort',
} as const;
