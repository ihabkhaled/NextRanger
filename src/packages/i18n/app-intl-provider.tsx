import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';

import type { AppMessages } from './intl-messages-provider';
import type { AppLocale } from './locale.constants';

/**
 * Bridges server-resolved locale/messages into the client tree. Rendered once
 * in the root layout with the locale it resolved; messages are inherited from
 * the request config.
 */
export function AppIntlProvider(
  props: Readonly<{ locale: AppLocale; messages?: AppMessages; children: ReactNode }>,
): ReactElement {
  if (props.messages === undefined) {
    return <NextIntlClientProvider locale={props.locale}>{props.children}</NextIntlClientProvider>;
  }

  return (
    <NextIntlClientProvider locale={props.locale} messages={props.messages}>
      {props.children}
    </NextIntlClientProvider>
  );
}
