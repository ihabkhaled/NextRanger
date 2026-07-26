import type { AppLocale } from '@/packages/i18n';
import { appConfig } from '@/shared/config/app-config';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

import { MARKETING_PATHS } from '../constants/marketing-seo.constants';
import type { MarketingPageKind } from '../types/marketing.types';

export function buildMarketingStructuredData(
  locale: AppLocale,
  kind: MarketingPageKind,
  title: string,
  description: string,
): string {
  const pageUrl = new URL(
    buildLocalizedPath(locale, MARKETING_PATHS[kind]),
    appConfig.appUrl,
  ).toString();
  const homeUrl = new URL(
    buildLocalizedPath(locale, ROUTE_PATHS.home),
    appConfig.appUrl,
  ).toString();
  const websiteId = `${homeUrl}#website`;
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: appConfig.appName, item: homeUrl },
    ...(kind === 'home' ? [] : [{ '@type': 'ListItem', position: 2, name: title, item: pageUrl }]),
  ];
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: appConfig.appName,
        url: homeUrl,
        inLanguage: locale,
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        name: title,
        description,
        url: pageUrl,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
      },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbItems },
    ],
  });
}
