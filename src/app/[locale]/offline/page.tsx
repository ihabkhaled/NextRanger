import type { ReactElement } from 'react';

import { getServerTranslations, isSupportedLocale, setServerLocale } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { PageContainer, Stack } from '@/packages/ui-primitives';
import { buildNonIndexableMetadata } from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

export const metadata = buildNonIndexableMetadata();

export default async function OfflinePage(
  props: Readonly<{ params: Promise<{ locale: string }> }>,
): Promise<ReactElement> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  setServerLocale(locale);
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.pwa });
  return (
    <PageContainer>
      <Stack gap="md">
        <h1>{t('offlineTitle')}</h1>
        <p>{t('offlineDescription')}</p>
      </Stack>
    </PageContainer>
  );
}
