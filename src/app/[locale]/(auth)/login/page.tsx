import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { LoginFormContainer } from '@/modules/auth';
import { getServerTranslations, isSupportedLocale } from '@/packages/i18n';
import { PageContainer } from '@/packages/ui-primitives';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { buildNonIndexableMetadata } from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import type { LocaleRouteProps } from '@/shared/types/app-route.types';

import { loginPageClasses } from './page.variants';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    return {};
  }
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.auth });

  return buildNonIndexableMetadata(buildPageTitle(t('login.title')));
}

export default function LoginPage(): ReactElement {
  return (
    <PageContainer className={loginPageClasses.page}>
      <LoginFormContainer />
    </PageContainer>
  );
}
