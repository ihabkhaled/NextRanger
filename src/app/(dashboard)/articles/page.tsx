import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ArticlesListContainer } from '@/modules/articles';
import { getServerTranslations } from '@/packages/i18n';
import { PageContainer } from '@/packages/ui-primitives';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations(I18N_NAMESPACES.articles);

  return { title: buildPageTitle(t('title')) };
}

export default async function ArticlesPage(): Promise<ReactElement> {
  const t = await getServerTranslations(I18N_NAMESPACES.articles);

  return (
    <PageContainer>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <ArticlesListContainer />
    </PageContainer>
  );
}
