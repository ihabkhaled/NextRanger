import { DEFAULT_LOCALE } from '@/packages/i18n';
import { appRedirect } from '@/packages/navigation';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

export default function RootRedirect(): never {
  appRedirect(buildLocalizedPath(DEFAULT_LOCALE, ROUTE_PATHS.home));
}
