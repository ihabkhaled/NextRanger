import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { LoginFormContainer } from '@/modules/auth';
import { getServerTranslations } from '@/packages/i18n';
import { PageContainer } from '@/packages/ui-primitives';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations(I18N_NAMESPACES.auth);

  return { title: buildPageTitle(t('login.title')) };
}

export default function LoginPage(): ReactElement {
  return (
    <PageContainer>
      <LoginFormContainer />
    </PageContainer>
  );
}
