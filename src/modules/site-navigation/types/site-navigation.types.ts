import type { Route } from 'next';
import type { MouseEventHandler } from 'react';

import type { AppLocale } from '@/packages/i18n';

export type SiteNavigationScope = 'marketing' | 'utility' | 'all' | 'footer';
export type SiteNavigationLabelKey =
  | 'home'
  | 'about'
  | 'features'
  | 'faq'
  | 'contact'
  | 'articles'
  | 'settings'
  | 'workbench'
  | 'login';
export type SiteNavigationLabels = Readonly<Record<SiteNavigationLabelKey, string>>;
export interface SiteNavigationProps {
  readonly locale: AppLocale;
  readonly labels: SiteNavigationLabels;
  readonly scope: SiteNavigationScope;
}
export interface BreadcrumbProps {
  readonly locale: AppLocale;
  readonly labels: SiteNavigationLabels;
}
export interface SiteNavigationItemViewModel {
  readonly href: Route;
  readonly label: string;
  readonly isCurrent: boolean;
}
export interface SiteNavigationViewModel {
  readonly items: readonly SiteNavigationItemViewModel[];
  readonly onSelect: MouseEventHandler<HTMLAnchorElement>;
}
