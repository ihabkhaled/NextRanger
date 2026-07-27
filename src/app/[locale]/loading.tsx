import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import { PageContainer } from '@/packages/ui-primitives';
import { LoadingState } from '@/shared/components/feedback/loading-state.component';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

/**
 * The loading boundary belongs below the nonce-aware locale layout. Keeping a
 * root-level boundary outside every root layout makes Next.js emit an
 * untrusted bootstrap chunk under a strict-dynamic CSP.
 */
export default async function LocaleLoading(): Promise<ReactElement> {
  const t = await getServerTranslations(I18N_NAMESPACES.app);

  return (
    <PageContainer>
      <LoadingState label={t('loading')} />
    </PageContainer>
  );
}
