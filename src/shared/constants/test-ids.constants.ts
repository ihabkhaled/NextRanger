/**
 * data-testid values shared between components and test suites. Raw testid
 * strings in either place are a no-magic-strings violation.
 */
export const TEST_IDS = {
  appHeader: 'app-header',
  localeSwitch: 'locale-switch',
  articlesList: 'articles-list',
  articleCard: 'article-card',
  articlesEmpty: 'articles-empty',
  articlesError: 'articles-error',
  articlesLoading: 'articles-loading',
  loginForm: 'login-form',
  loginEmail: 'login-email',
  loginPassword: 'login-password',
  loginSubmit: 'login-submit',
  loginError: 'login-error',
  settingsTheme: 'settings-theme',
  settingsDirection: 'settings-direction',
  settingsSidebar: 'settings-sidebar',
} as const;

/** Catalog-derived public API. @public */
export type AppTestId = (typeof TEST_IDS)[keyof typeof TEST_IDS];
