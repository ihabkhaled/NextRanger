import type { Metadata } from 'next';

import { DEFAULT_LOCALE, OPEN_GRAPH_LOCALES, SUPPORTED_LOCALES } from '@/packages/i18n';
import { appConfig } from '@/shared/config/app-config';
import { SOCIAL_IMAGE_DIRECTORY, SOCIAL_IMAGE_SIZE } from '@/shared/constants/seo.constants';
import type { SeoMetadataInput } from '@/shared/types/seo.types';

import { buildLocalizedPath } from './localized-route.helper';

export function buildAbsoluteAppUrl(path: string): string {
  return new URL(path, appConfig.appUrl).toString();
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      buildAbsoluteAppUrl(buildLocalizedPath(locale, path)),
    ]),
  );
  return {
    ...languages,
    'x-default': buildAbsoluteAppUrl(buildLocalizedPath(DEFAULT_LOCALE, path)),
  };
}

export function buildSeoMetadata(input: SeoMetadataInput): Metadata {
  const canonical = buildAbsoluteAppUrl(buildLocalizedPath(input.locale, input.path));
  const socialImageUrl = buildAbsoluteAppUrl(`${SOCIAL_IMAGE_DIRECTORY}/${input.locale}.png`);
  return {
    applicationName: appConfig.appName,
    title: input.title,
    description: input.description,
    keywords: [...input.keywords],
    creator: appConfig.appName,
    publisher: appConfig.appName,
    alternates: { canonical, languages: buildLanguageAlternates(input.path) },
    openGraph: {
      type: 'website',
      locale: OPEN_GRAPH_LOCALES[input.locale],
      alternateLocale: SUPPORTED_LOCALES.filter((locale) => locale !== input.locale).map(
        (locale) => OPEN_GRAPH_LOCALES[locale],
      ),
      url: canonical,
      siteName: appConfig.appName,
      title: input.title,
      description: input.description,
      images: [
        {
          url: socialImageUrl,
          width: SOCIAL_IMAGE_SIZE.width,
          height: SOCIAL_IMAGE_SIZE.height,
          alt: input.socialImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [{ url: socialImageUrl, alt: input.socialImageAlt }],
    },
    robots: { index: true, follow: true },
  };
}

export function buildNonIndexableMetadata(title?: string): Metadata {
  return {
    ...(title ? { title } : {}),
    robots: { index: false, follow: false },
  };
}
