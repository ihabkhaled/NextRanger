import type { MetadataRoute } from 'next';

import { SUPPORTED_LOCALES } from '@/packages/i18n';
import { appConfig } from '@/shared/config/app-config';
import { NON_INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

export default function robots(): MetadataRoute.Robots {
  const privateDocuments = SUPPORTED_LOCALES.flatMap((locale) =>
    NON_INDEXABLE_PATHS.map((path) => buildLocalizedPath(locale, path)),
  );
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', ...privateDocuments],
    },
    sitemap: new URL('/sitemap.xml', appConfig.appUrl).toString(),
    host: appConfig.appUrl,
  };
}
