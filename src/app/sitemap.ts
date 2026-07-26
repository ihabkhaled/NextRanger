import type { MetadataRoute } from 'next';

import { SUPPORTED_LOCALES } from '@/packages/i18n';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { buildAbsoluteAppUrl, buildLanguageAlternates } from '@/shared/helpers/seo-metadata.helper';

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.flatMap((path) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: buildAbsoluteAppUrl(buildLocalizedPath(locale, path)),
      changeFrequency: path === ROUTE_PATHS.home ? 'weekly' : 'monthly',
      priority: path === ROUTE_PATHS.home ? 1 : 0.7,
      alternates: { languages: buildLanguageAlternates(path) },
    })),
  );
}
