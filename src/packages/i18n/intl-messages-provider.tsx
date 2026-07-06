import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';

import type { AppLocale } from './locale.constants';

export type AppMessages = AbstractIntlMessages;

/**
 * Explicit-messages provider for environments without the Next.js request
 * context (tests, isolated rendering).
 */
export function IntlMessagesProvider(
  props: Readonly<{
    locale: AppLocale;
    messages: AppMessages;
    children: ReactNode;
  }>,
): ReactElement {
  return (
    <NextIntlClientProvider locale={props.locale} messages={props.messages}>
      {props.children}
    </NextIntlClientProvider>
  );
}
