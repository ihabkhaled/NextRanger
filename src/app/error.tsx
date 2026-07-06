'use client';
// client-boundary-reason: Next.js route error boundaries must be client components to receive the reset callback.

import { useEffect, type ReactElement } from 'react';

import { useAppTranslation } from '@/packages/i18n';
import { appLogger } from '@/packages/logger';
import { PageContainer } from '@/packages/ui-primitives';
import { ErrorState } from '@/shared/components/feedback/error-state.component';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export default function RouteError(
  props: Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
  }>,
): ReactElement {
  const t = useAppTranslation(I18N_NAMESPACES.errorPage);

  useEffect(() => {
    appLogger.error('Route error boundary caught an error', {
      digest: props.error.digest,
      message: props.error.message,
    });
  }, [props.error]);

  return (
    <PageContainer>
      <ErrorState message={t('description')} retryLabel={t('retry')} onRetry={props.reset} />
    </PageContainer>
  );
}
