import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import { AppLink } from '@/packages/link';
import { buttonVariants, PageContainer, Stack } from '@/packages/ui-primitives';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export default async function NotFound(): Promise<ReactElement> {
  const t = await getServerTranslations(I18N_NAMESPACES.notFound);

  return (
    <PageContainer>
      <PageHeader title={t('title')} subtitle={t('description')} />
      <Stack direction="row">
        <AppLink href={ROUTE_PATHS.home} className={buttonVariants({ variant: 'secondary' })}>
          {t('backHome')}
        </AppLink>
      </Stack>
    </PageContainer>
  );
}
