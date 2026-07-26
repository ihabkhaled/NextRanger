import { useAppNavigation } from '@/packages/navigation';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

import { SITE_NAVIGATION_ITEMS } from '../constants/site-navigation.constants';
import type {
  SiteNavigationItemViewModel,
  SiteNavigationLabels,
  SiteNavigationProps,
  SiteNavigationViewModel,
} from '../types/site-navigation.types';

export function useSiteNavigation(props: SiteNavigationProps): SiteNavigationViewModel {
  const { pathname } = useAppNavigation();
  return {
    items: SITE_NAVIGATION_ITEMS.filter((item) => item.scopes.includes(props.scope)).map((item) => {
      const href = buildLocalizedPath(props.locale, item.path);
      return { href, label: props.labels[item.labelKey], isCurrent: pathname === href };
    }),
    onSelect: (event) => {
      event.currentTarget.closest('details')?.removeAttribute('open');
    },
  };
}

export function useCurrentBreadcrumb(
  locale: SiteNavigationProps['locale'],
  labels: SiteNavigationLabels,
): SiteNavigationItemViewModel | null {
  const { pathname } = useAppNavigation();
  const item = SITE_NAVIGATION_ITEMS.find(
    (candidate) => buildLocalizedPath(locale, candidate.path) === pathname,
  );
  return item
    ? { href: buildLocalizedPath(locale, item.path), label: labels[item.labelKey], isCurrent: true }
    : null;
}
