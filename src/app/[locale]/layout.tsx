import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactElement, ReactNode } from 'react';

import { ServiceWorkerRegistrationContainer } from '@/modules/pwa';
import {
  BreadcrumbContainer,
  SiteNavigationContainer,
  type SiteNavigationLabels,
} from '@/modules/site-navigation';
import { ShellControlsContainer } from '@/modules/ui-preferences';
import {
  AppIntlProvider,
  getLocaleDirection,
  getServerMessages,
  getServerTranslations,
  isSupportedLocale,
  setServerLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from '@/packages/i18n';
import { AppLink } from '@/packages/link';
import { appNotFound } from '@/packages/navigation';
import { AppToaster } from '@/packages/toast';
import { LANDMARK_IDS } from '@/shared/accessibility/landmark-ids.constants';
import { SiteShell } from '@/shared/components/layout/site-shell.component';
import { siteShellClasses } from '@/shared/components/layout/site-shell.variants';
import { SkipLink } from '@/shared/components/primitives/skip-link.component';
import { appConfig } from '@/shared/config/app-config';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';
import { appFontClassName } from '@/shared/fonts/app-fonts';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { AppProviders } from '../providers';

import { layoutClasses } from './layout.variants';

import '../styles.css';

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.appUrl),
};

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: AppLocale }[] {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: LocaleLayoutProps): Promise<ReactElement> {
  const { locale: candidate } = await props.params;
  if (!isSupportedLocale(candidate)) {
    appNotFound();
  }

  const locale = candidate;
  setServerLocale(locale);
  const direction = getLocaleDirection(locale);
  const messages = await getServerMessages({ locale });
  const tApp = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.app });
  const tNav = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.nav });
  const tSettings = await getServerTranslations({
    locale,
    namespace: I18N_NAMESPACES.settings,
  });
  const navigationLabels: SiteNavigationLabels = {
    home: tNav('home'),
    about: tNav('about'),
    features: tNav('features'),
    faq: tNav('faq'),
    contact: tNav('contact'),
    articles: tNav('articles'),
    settings: tNav('settings'),
    workbench: tNav('workbench'),
    login: tNav('login'),
  };

  return (
    <html lang={locale} dir={direction} data-theme="light" className={appFontClassName}>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className={layoutClasses.body}>
        <AppIntlProvider locale={locale} messages={messages}>
          <AppProviders key={locale}>
            {appConfig.isProduction ? <ServiceWorkerRegistrationContainer /> : null}
            <SkipLink targetHref={`#${LANDMARK_IDS.mainContent}`} label={tApp('skipToContent')} />
            <div data-testid={TEST_IDS.appHeader}>
              <SiteShell
                navigationLabel={tNav('landmarkLabel')}
                breadcrumbLabel={tApp('breadcrumbLabel')}
                menuLabel={tNav('menu')}
                brandHomeLink={
                  <AppLink
                    href={buildLocalizedPath(locale, ROUTE_PATHS.home)}
                    className={siteShellClasses.brand}
                  >
                    <span className={siteShellClasses.brandMark} aria-hidden="true">
                      N
                    </span>
                    {tApp('title')}
                  </AppLink>
                }
                desktopNavigation={
                  <SiteNavigationContainer
                    locale={locale}
                    labels={navigationLabels}
                    scope="marketing"
                  />
                }
                mobileNavigation={
                  <SiteNavigationContainer locale={locale} labels={navigationLabels} scope="all" />
                }
                utilityNavigation={
                  <SiteNavigationContainer
                    locale={locale}
                    labels={navigationLabels}
                    scope="utility"
                  />
                }
                controls={
                  <ShellControlsContainer
                    locale={locale}
                    localeLabel={tApp('localeSwitchLabel')}
                    themeLabel={tApp('themeSwitchLabel')}
                    themeLabels={{
                      light: tSettings('theme.light'),
                      dark: tSettings('theme.dark'),
                      system: tSettings('theme.system'),
                    }}
                  />
                }
                breadcrumb={<BreadcrumbContainer locale={locale} labels={navigationLabels} />}
                footerNote={tApp('footerNote')}
                footerNavigation={
                  <SiteNavigationContainer
                    locale={locale}
                    labels={navigationLabels}
                    scope="footer"
                  />
                }
              >
                <main id={LANDMARK_IDS.mainContent} className={layoutClasses.main}>
                  {props.children}
                </main>
              </SiteShell>
            </div>
            <AppToaster />
          </AppProviders>
        </AppIntlProvider>
      </body>
    </html>
  );
}
