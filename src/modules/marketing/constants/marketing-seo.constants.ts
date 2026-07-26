import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';

import type { MarketingPageKind } from '../types/marketing.types';

export const MARKETING_PATHS = {
  home: ROUTE_PATHS.home,
  about: ROUTE_PATHS.about,
  features: ROUTE_PATHS.features,
  faq: ROUTE_PATHS.faq,
  contact: ROUTE_PATHS.contact,
} as const;

export const MARKETING_KEYWORDS: Readonly<Record<MarketingPageKind, readonly string[]>> = {
  home: ['Next.js boilerplate', 'TypeScript 7', 'strict frontend architecture'],
  about: ['maintainable Next.js', 'frontend architecture', 'AI coding context'],
  features: ['reusable React components', 'ESLint strict', 'Next.js starter features'],
  faq: ['Next.js starter FAQ', 'strict boilerplate guidance', 'frontend conventions'],
  contact: ['Next.js consulting', 'frontend foundation', 'product engineering'],
};
