'use client';
// client-boundary-reason: marks current URL navigation and breadcrumb state.

import type { ReactElement } from 'react';

import { AppLink } from '@/packages/link';
import { cn } from '@/packages/ui-primitives';
import { siteShellClasses } from '@/shared/components/layout/site-shell.variants';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

import { BREADCRUMB_SEPARATOR } from '../constants/site-navigation.constants';
import { useCurrentBreadcrumb, useSiteNavigation } from '../hooks/use-site-navigation.hook';
import type { BreadcrumbProps, SiteNavigationProps } from '../types/site-navigation.types';

export function SiteNavigationContainer(props: SiteNavigationProps): ReactElement {
  const navigation = useSiteNavigation(props);
  return (
    <>
      {navigation.items.map((item) => (
        <AppLink
          key={item.href}
          href={item.href}
          className={cn(
            siteShellClasses.navLink,
            item.isCurrent && siteShellClasses.navLinkCurrent,
          )}
          aria-current={item.isCurrent ? 'page' : undefined}
          onClick={navigation.onSelect}
        >
          {item.label}
        </AppLink>
      ))}
    </>
  );
}

export function BreadcrumbContainer(props: BreadcrumbProps): ReactElement {
  const current = useCurrentBreadcrumb(props.locale, props.labels);
  const homeHref = buildLocalizedPath(props.locale, ROUTE_PATHS.home);
  return (
    <>
      <AppLink href={homeHref}>{props.labels.home}</AppLink>
      {current && current.href !== homeHref ? (
        <>
          <span aria-hidden>{BREADCRUMB_SEPARATOR}</span>
          <span aria-current="page">{current.label}</span>
        </>
      ) : null}
    </>
  );
}
