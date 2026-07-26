import { useCallback, useState } from 'react';

import { openEmailDraft } from '@/packages/browser';
import { useAppZodForm } from '@/packages/forms';
import { useAppTranslation } from '@/packages/i18n';
import { appConfig } from '@/shared/config/app-config';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { CONTACT_FIELD_IDS, CONTACT_FORM_DEFAULTS } from '../constants/contact-form.constants';
import { contactFormSchema } from '../schemas/contact.schema';
import type { ContactFormValues, ContactFormViewModel } from '../types/marketing.types';

export function useContactForm(): ContactFormViewModel {
  const t = useAppTranslation(I18N_NAMESPACES.marketing);
  const [outcome, setOutcome] = useState<string | null>(null);
  const form = useAppZodForm<ContactFormValues>({
    schema: contactFormSchema,
    defaultValues: CONTACT_FORM_DEFAULTS,
  });
  const handleValid = useCallback(
    (values: ContactFormValues) => {
      if (!appConfig.contactEmail) {
        setOutcome(t('contactForm.notConfigured'));
        return;
      }
      const handoffRequested = openEmailDraft(
        appConfig.contactEmail,
        t('contactForm.subject'),
        `${values.name} <${values.email}>\n\n${values.message}`,
      );
      setOutcome(t(handoffRequested ? 'contactForm.ready' : 'contactNote'));
    },
    [t],
  );
  const submit = form.handleSubmit(handleValid);
  const onSubmit = useCallback(
    (event: Parameters<ContactFormViewModel['onSubmit']>[0]) => {
      void submit(event);
    },
    [submit],
  );
  const field = (name: keyof ContactFormValues, fieldId: string): ContactFormViewModel['name'] => {
    const errorKey = form.formState.errors[name]?.message;
    return {
      fieldId,
      label: t(`contactForm.${name}Label`),
      error: errorKey ? t(errorKey) : undefined,
      inputProps: form.register(name),
    };
  };
  return {
    name: field('name', CONTACT_FIELD_IDS.name),
    email: field('email', CONTACT_FIELD_IDS.email),
    message: field('message', CONTACT_FIELD_IDS.message),
    submitLabel: t('contactForm.submit'),
    outcome,
    onSubmit,
  };
}
