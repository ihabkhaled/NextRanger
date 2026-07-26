import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';

import type { SiteNavigationLabelKey, SiteNavigationScope } from '../types/site-navigation.types';

export interface SiteNavigationItemConfig {
  readonly path: (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
  readonly labelKey: SiteNavigationLabelKey;
  readonly scopes: readonly SiteNavigationScope[];
}

export const SITE_NAVIGATION_ITEMS: readonly SiteNavigationItemConfig[] = [
  { path: ROUTE_PATHS.home, labelKey: 'home', scopes: ['marketing', 'all'] },
  { path: ROUTE_PATHS.about, labelKey: 'about', scopes: ['marketing', 'all', 'footer'] },
  { path: ROUTE_PATHS.features, labelKey: 'features', scopes: ['marketing', 'all', 'footer'] },
  { path: ROUTE_PATHS.faq, labelKey: 'faq', scopes: ['marketing', 'all', 'footer'] },
  { path: ROUTE_PATHS.contact, labelKey: 'contact', scopes: ['marketing', 'all', 'footer'] },
  { path: ROUTE_PATHS.articles, labelKey: 'articles', scopes: ['utility', 'all'] },
  { path: ROUTE_PATHS.settings, labelKey: 'settings', scopes: ['utility', 'all'] },
  { path: ROUTE_PATHS.workbench, labelKey: 'workbench', scopes: ['utility', 'all'] },
  { path: ROUTE_PATHS.login, labelKey: 'login', scopes: ['utility', 'all'] },
];

export const BREADCRUMB_SEPARATOR = '/';
