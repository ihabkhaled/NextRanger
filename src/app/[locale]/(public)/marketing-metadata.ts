import type { Metadata } from 'next';

import {
  MARKETING_KEYWORDS,
  MARKETING_MESSAGE_KEYS,
  MARKETING_PATHS,
  type MarketingPageKind,
} from '@/modules/marketing';
import { getServerTranslations, setServerLocale, type AppLocale } from '@/packages/i18n';
import { buildSeoMetadata } from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export async function buildMarketingMetadata(
  locale: AppLocale,
  kind: MarketingPageKind,
): Promise<Metadata> {
  setServerLocale(locale);
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.marketing });
  const pageKey = MARKETING_MESSAGE_KEYS.pages[kind];
  return buildSeoMetadata({
    locale,
    path: MARKETING_PATHS[kind],
    title: t(`${pageKey}.title`),
    description: t(`${pageKey}.description`),
    keywords: MARKETING_KEYWORDS[kind],
  });
}
