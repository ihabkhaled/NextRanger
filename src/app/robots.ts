import type { MetadataRoute } from 'next';

import { appConfig } from '@/shared/config/app-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/login', '/*/settings', '/*/workbench'],
    },
    sitemap: new URL('/sitemap.xml', appConfig.appUrl).toString(),
    host: appConfig.appUrl,
  };
}
