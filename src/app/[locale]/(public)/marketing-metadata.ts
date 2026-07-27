import type { Metadata } from 'next';

import {
  MARKETING_MESSAGE_KEYS,
  MARKETING_PATHS,
  buildMarketingKeywords,
  type MarketingPageKind,
} from '@/modules/marketing';
import { getServerTranslations, setServerLocale, type AppLocale } from '@/packages/i18n';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { buildSeoMetadata } from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export async function buildMarketingMetadata(
  locale: AppLocale,
  kind: MarketingPageKind,
): Promise<Metadata> {
  setServerLocale(locale);
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.marketing });
  const pageKey = MARKETING_MESSAGE_KEYS.pages[kind];
  const title = t(`${pageKey}.title`);
  const brandedTitle = buildPageTitle(title);
  return buildSeoMetadata({
    locale,
    path: MARKETING_PATHS[kind],
    title: brandedTitle,
    description: t(`${pageKey}.description`),
    socialImageAlt: brandedTitle,
    keywords: buildMarketingKeywords([
      title,
      t(`${pageKey}.eyebrow`),
      t(MARKETING_MESSAGE_KEYS.trustLabel),
      t(MARKETING_MESSAGE_KEYS.routeAtlasLabel),
    ]),
  });
}
