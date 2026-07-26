import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { MarketingPageContainer } from '@/modules/marketing';
import { isSupportedLocale } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import type { LocaleRouteProps } from '@/shared/types/app-route.types';

import { buildMarketingMetadata } from '../marketing-metadata';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { locale } = await props.params;
  return isSupportedLocale(locale) ? buildMarketingMetadata(locale, 'faq') : {};
}

export default async function FaqPage(props: LocaleRouteProps): Promise<ReactElement> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  return <MarketingPageContainer locale={locale} kind="faq" />;
}
