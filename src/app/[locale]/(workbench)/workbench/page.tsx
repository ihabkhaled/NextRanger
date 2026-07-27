import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { getServerTranslations, isSupportedLocale } from '@/packages/i18n';
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
import { appNotFound } from '@/packages/navigation';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Divider,
  Input,
  Label,
  PageContainer,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Textarea,
} from '@/packages/ui-primitives';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { buildNonIndexableMetadata } from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import type { LocaleRouteProps } from '@/shared/types/app-route.types';

import { workbenchClasses } from './page.variants';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    return {};
  }
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.workbench });

  return buildNonIndexableMetadata(buildPageTitle(t('title')));
}

/**
 * Component workbench: the living showcase of design-system primitives.
 * This replaces Storybook — see ADR 0002.
 */
export default async function WorkbenchPage(props: LocaleRouteProps): Promise<ReactElement> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.workbench });

  return (
    <PageContainer>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className={workbenchClasses.sectionGrid}>
        <Card className={workbenchClasses.card}>
          <CardHeader>
            <Badge tone="brand">{t('sampleButton')}</Badge>
            <CardTitle>{t('buttonsSection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack direction="row" gap="sm" wrap="wrap">
              <Button>{t('sampleButton')}</Button>
              <Button variant="secondary">{t('sampleSecondaryButton')}</Button>
              <Button variant="soft">{t('sampleSecondaryButton')}</Button>
              <Button variant="danger">{t('sampleDangerButton')}</Button>
              <Button variant="ghost">{t('sampleSecondaryButton')}</Button>
              <Button disabled>{t('sampleButton')}</Button>
            </Stack>
          </CardContent>
        </Card>
        <Card className={workbenchClasses.card}>
          <CardHeader>
            <Badge tone="success">{t('feedbackSection')}</Badge>
            <CardTitle>{t('feedbackSection')}</CardTitle>
          </CardHeader>
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
        <Card className={workbenchClasses.card}>
          <CardHeader>
            <Badge>{t('iconsSection')}</Badge>
            <CardTitle>{t('iconsSection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={workbenchClasses.iconGrid}>
              <NewspaperIcon aria-hidden="true" />
              <SettingsIcon aria-hidden="true" />
              <GlobeIcon aria-hidden="true" />
              <SunIcon aria-hidden="true" />
              <MoonIcon aria-hidden="true" />
              <CheckIcon aria-hidden="true" />
              <AlertIcon aria-hidden="true" />
              <ArrowRightIcon aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        <Card className={workbenchClasses.card}>
          <CardHeader>
            <Badge tone="warning">{t('formsSection')}</Badge>
            <CardTitle>{t('formsSection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              <Label htmlFor="workbench-sample-input">{t('sampleLabel')}</Label>
              <Input id="workbench-sample-input" placeholder={t('samplePlaceholder')} />
              <Divider />
              <Label htmlFor="workbench-sample-select">{t('buttonsSection')}</Label>
              <Select id="workbench-sample-select" defaultValue="primary">
                <option value="primary">{t('sampleButton')}</option>
                <option value="secondary">{t('sampleSecondaryButton')}</option>
              </Select>
              <Label htmlFor="workbench-sample-textarea">{t('feedbackSection')}</Label>
              <Textarea id="workbench-sample-textarea" placeholder={t('sampleAlert')} />
            </Stack>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
