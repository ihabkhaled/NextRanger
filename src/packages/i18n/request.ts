import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, isSupportedLocale } from './locale.constants';

/** URL-derived next-intl request configuration. */
export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = isSupportedLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
  const messages = (await import(`./messages/${locale}.json`)) as {
    default: Record<string, unknown>;
  };

  return { locale, messages: messages.default };
});
