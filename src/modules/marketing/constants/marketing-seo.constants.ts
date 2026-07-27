import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';

import type { MarketingPageKind } from '../types/marketing.types';

export const MARKETING_PATHS = {
  home: ROUTE_PATHS.home,
  about: ROUTE_PATHS.about,
  features: ROUTE_PATHS.features,
  faq: ROUTE_PATHS.faq,
  contact: ROUTE_PATHS.contact,
} as const;

export const MARKETING_TECHNOLOGY_KEYWORDS = [
  'Next.js',
  'React',
  'TypeScript 7',
  'Progressive Web App',
] as const;

export const MARKETING_PAGE_SCHEMA_TYPES: Readonly<
  Record<MarketingPageKind, 'WebPage' | 'AboutPage' | 'FAQPage' | 'ContactPage'>
> = {
  home: 'WebPage',
  about: 'AboutPage',
  features: 'WebPage',
  faq: 'FAQPage',
  contact: 'ContactPage',
};
