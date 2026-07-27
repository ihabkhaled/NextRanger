import { ROUTE_PATHS } from './route-paths.constants';

export const INDEXABLE_PATHS = [
  ROUTE_PATHS.home,
  ROUTE_PATHS.about,
  ROUTE_PATHS.features,
  ROUTE_PATHS.faq,
  ROUTE_PATHS.contact,
] as const;

export const NON_INDEXABLE_PATHS = [
  ROUTE_PATHS.login,
  ROUTE_PATHS.articles,
  ROUTE_PATHS.settings,
  ROUTE_PATHS.workbench,
  ROUTE_PATHS.offline,
] as const;

export const SOCIAL_IMAGE_DIRECTORY = '/social' as const;

export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;
