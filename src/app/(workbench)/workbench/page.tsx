import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  MoonIcon,
  NewspaperIcon,
  SettingsIcon,
  SunIcon,
} from '@/packages/icons';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardTitle,
  Input,
  Label,
  PageContainer,
  Skeleton,
  Spinner,
  Stack,
} from '@/packages/ui-primitives';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { workbenchClasses } from './page.variants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations(I18N_NAMESPACES.workbench);

  return { title: buildPageTitle(t('title')) };
}

/**
 * Component workbench: the living showcase of design-system primitives.
 * This replaces Storybook — see ADR 0002.
 */
export default async function WorkbenchPage(): Promise<ReactElement> {
  const t = await getServerTranslations(I18N_NAMESPACES.workbench);

  return (
    <PageContainer>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <Card>
        <CardTitle>{t('buttonsSection')}</CardTitle>
        <CardContent>
          <Stack direction="row" gap="sm" wrap="wrap">
            <Button>{t('sampleButton')}</Button>
            <Button variant="secondary">{t('sampleSecondaryButton')}</Button>
            <Button variant="danger">{t('sampleDangerButton')}</Button>
            <Button variant="ghost">{t('sampleSecondaryButton')}</Button>
            <Button disabled>{t('sampleButton')}</Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardTitle>{t('feedbackSection')}</CardTitle>
        <CardContent>
          <Stack gap="sm">
            <Alert tone="info">{t('sampleAlert')}</Alert>
            <Alert tone="success">{t('sampleAlert')}</Alert>
            <Alert tone="warning">{t('sampleAlert')}</Alert>
            <Alert tone="danger">{t('sampleAlert')}</Alert>
            <Stack direction="row" gap="md" align="center">
              <Spinner label={t('sampleAlert')} />
              <Skeleton className={workbenchClasses.skeletonSample} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardTitle>{t('iconsSection')}</CardTitle>
        <CardContent>
          <Stack direction="row" gap="md" align="center" wrap="wrap">
            <NewspaperIcon aria-hidden="true" />
            <SettingsIcon aria-hidden="true" />
            <GlobeIcon aria-hidden="true" />
            <SunIcon aria-hidden="true" />
            <MoonIcon aria-hidden="true" />
            <CheckIcon aria-hidden="true" />
            <AlertIcon aria-hidden="true" />
            <ArrowRightIcon aria-hidden="true" />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardTitle>{t('formsSection')}</CardTitle>
        <CardContent>
          <Stack gap="xs">
            <Label htmlFor="workbench-sample-input">{t('sampleLabel')}</Label>
            <Input id="workbench-sample-input" placeholder={t('samplePlaceholder')} />
          </Stack>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
