/**
 * Server-side translation facade for Server Components and route handlers.
 */

export {
  getLocale as getServerLocale,
  getMessages as getServerMessages,
  getTranslations as getServerTranslations,
  setRequestLocale as setServerLocale,
} from 'next-intl/server';
