/**
 * Owner wrapper for the i18n vendor (next-intl). All user-facing copy flows
 * through message keys resolved by these facades; raw next-intl imports
 * elsewhere are an ESLint boundary violation.
 */

export { AppIntlProvider } from './app-intl-provider';
export { IntlMessagesProvider, type AppMessages } from './intl-messages-provider';
export {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  LOCALE_NAMES,
  OPEN_GRAPH_LOCALES,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
  type AppLocale,
  type AppTextDirection,
} from './locale.constants';
export { getServerLocale, getServerMessages, getServerTranslations } from './server-messages';
export { setServerLocale } from './server-messages';
export { useAppLocale, useAppTranslation } from './translation-hooks';
