import type { Route } from 'next';

/**
 * Every internal route path lives here. Raw path strings in app code are a
 * no-magic-strings violation; typed Route keeps dead links out of the build.
 */
export const ROUTE_PATHS = {
  home: '/' as Route,
  login: '/login' as Route,
  articles: '/articles' as Route,
  settings: '/settings' as Route,
  workbench: '/workbench' as Route,
} as const;

/** Catalog-derived public API. @public */
export type AppRoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
