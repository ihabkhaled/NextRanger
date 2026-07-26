'use client';
// client-boundary-reason: binds schema validation and local email-draft behavior to the contact form.

import type { ReactElement } from 'react';

import { ContactForm } from '../components/contact-form.component';
import { useContactForm } from '../hooks/use-contact-form.hook';

export function ContactFormContainer(): ReactElement {
  const viewModel = useContactForm();
  return <ContactForm viewModel={viewModel} />;
}
