import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';

import type { AppLocale } from './locale.constants';

/**
 * Bridges server-resolved locale/messages into the client tree. Rendered once
 * in the root layout with the locale it resolved; messages are inherited from
 * the request config.
 */
export function AppIntlProvider(
  props: Readonly<{ locale: AppLocale; children: ReactNode }>,
): ReactElement {
  return <NextIntlClientProvider locale={props.locale}>{props.children}</NextIntlClientProvider>;
}
