/**
 * Message namespaces available in the catalogs under
 * src/packages/i18n/messages/. Hooks pass these to useAppTranslation instead
 * of raw namespace strings.
 */
export const I18N_NAMESPACES = {
  app: 'app',
  nav: 'nav',
  home: 'home',
  articles: 'articles',
  auth: 'auth',
  settings: 'settings',
  errors: 'errors',
  notFound: 'notFound',
  errorPage: 'errorPage',
  workbench: 'workbench',
  marketing: 'marketing',
  pwa: 'pwa',
} as const;

/** Catalog-derived public API. @public */
export type I18nNamespace = (typeof I18N_NAMESPACES)[keyof typeof I18N_NAMESPACES];
