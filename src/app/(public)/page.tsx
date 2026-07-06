import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import { AppLink } from '@/packages/link';
import {
  buttonVariants,
  Card,
  CardContent,
  CardTitle,
  PageContainer,
  Stack,
} from '@/packages/ui-primitives';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { homeClasses } from './page.variants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations(I18N_NAMESPACES.home);

  return { title: buildPageTitle(t('title')) };
}

export default async function HomePage(): Promise<ReactElement> {
  const t = await getServerTranslations(I18N_NAMESPACES.home);

  return (
    <PageContainer>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <Stack direction="row" gap="sm">
        <AppLink href={ROUTE_PATHS.articles} className={buttonVariants({ variant: 'primary' })}>
          {t('ctaArticles')}
        </AppLink>
        <AppLink href={ROUTE_PATHS.login} className={buttonVariants({ variant: 'secondary' })}>
          {t('ctaLogin')}
        </AppLink>
      </Stack>
      <Card>
        <CardTitle>{t('principlesTitle')}</CardTitle>
        <CardContent>
          <ul className={homeClasses.principleList}>
            <li>{t('principleComponents')}</li>
            <li>{t('principleBoundaries')}</li>
            <li>{t('principleServerFirst')}</li>
            <li>{t('principleTesting')}</li>
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
