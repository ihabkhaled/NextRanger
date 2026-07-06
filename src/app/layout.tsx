import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import {
  AppIntlProvider,
  DEFAULT_LOCALE,
  getLocaleDirection,
  getServerLocale,
  getServerTranslations,
  isSupportedLocale,
} from '@/packages/i18n';
import { AppLink } from '@/packages/link';
import { AppToaster } from '@/packages/toast';
import { LANDMARK_IDS } from '@/shared/accessibility/landmark-ids.constants';
import { AppHeader } from '@/shared/components/layout/app-header.component';
import { appHeaderClasses } from '@/shared/components/layout/app-header.variants';
import { SkipLink } from '@/shared/components/primitives/skip-link.component';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';
import { interFont } from '@/shared/fonts/app-fonts';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { layoutClasses } from './layout.variants';
import { AppProviders } from './providers';

import './styles.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations(I18N_NAMESPACES.app);

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout(
  props: Readonly<{ children: ReactNode }>,
): Promise<ReactElement> {
  const detectedLocale = await getServerLocale();
  const locale = isSupportedLocale(detectedLocale) ? detectedLocale : DEFAULT_LOCALE;
  const direction = getLocaleDirection(locale);
  const tApp = await getServerTranslations(I18N_NAMESPACES.app);
  const tNav = await getServerTranslations(I18N_NAMESPACES.nav);

  return (
    <html lang={locale} dir={direction} data-theme="light" className={interFont.variable}>
      <body className={layoutClasses.body}>
        <AppIntlProvider locale={locale}>
          <AppProviders>
            <SkipLink targetHref={`#${LANDMARK_IDS.mainContent}`} label={tApp('skipToContent')} />
            <AppHeader
              homeLabel={tApp('title')}
              navLandmarkLabel={tNav('landmarkLabel')}
              testId={TEST_IDS.appHeader}
              navItems={
                <>
                  <AppLink href={ROUTE_PATHS.home} className={appHeaderClasses.navLink}>
                    {tNav('home')}
                  </AppLink>
                  <AppLink href={ROUTE_PATHS.articles} className={appHeaderClasses.navLink}>
                    {tNav('articles')}
                  </AppLink>
                  <AppLink href={ROUTE_PATHS.settings} className={appHeaderClasses.navLink}>
                    {tNav('settings')}
                  </AppLink>
                  <AppLink href={ROUTE_PATHS.workbench} className={appHeaderClasses.navLink}>
                    {tNav('workbench')}
                  </AppLink>
                  <AppLink href={ROUTE_PATHS.login} className={appHeaderClasses.navLink}>
                    {tNav('login')}
                  </AppLink>
                </>
              }
            />
            <main id={LANDMARK_IDS.mainContent} className={layoutClasses.main}>
              {props.children}
            </main>
            <AppToaster />
          </AppProviders>
        </AppIntlProvider>
      </body>
    </html>
  );
}
