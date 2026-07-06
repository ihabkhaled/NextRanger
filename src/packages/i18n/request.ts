import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE_NAME } from './locale.constants';

/**
 * next-intl request configuration (referenced by next.config.ts). Locale is
 * cookie-based — no locale routing — and falls back to the default locale.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const messages = (await import(`./messages/${locale}.json`)) as {
    default: Record<string, unknown>;
  };

  return {
    locale,
    messages: messages.default,
  };
});
