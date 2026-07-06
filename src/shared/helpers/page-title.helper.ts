import { appConfig } from '@/shared/config/app-config';

/** Consistent browser-tab titles: "Section · App name". */
export function buildPageTitle(sectionTitle: string): string {
  if (!sectionTitle.trim()) {
    return appConfig.appName;
  }

  return `${sectionTitle} · ${appConfig.appName}`;
}
