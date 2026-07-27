import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ArticlesListContainer } from '@/modules/articles';
import { getServerTranslations, isSupportedLocale } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { PageContainer } from '@/packages/ui-primitives';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import type { LocaleRouteProps } from '@/shared/types/app-route.types';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    return {};
  }
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.articles });

  return { title: buildPageTitle(t('title')), robots: { index: false, follow: true } };
}

export default async function ArticlesPage(props: LocaleRouteProps): Promise<ReactElement> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.articles });

  return (
    <PageContainer>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <ArticlesListContainer />
    </PageContainer>
  );
}
