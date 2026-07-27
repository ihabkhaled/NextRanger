import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import manifest from '@/app/manifest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { buildMarketingKeywords } from '@/modules/marketing';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/packages/i18n';
import {
  INDEXABLE_PATHS,
  NON_INDEXABLE_PATHS,
  SOCIAL_IMAGE_DIRECTORY,
  SOCIAL_IMAGE_SIZE,
} from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import {
  buildAbsoluteAppUrl,
  buildLanguageAlternates,
  buildNonIndexableMetadata,
  buildSeoMetadata,
} from '@/shared/helpers/seo-metadata.helper';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const serviceWorkerSource = readFileSync(path.join(repoRoot, 'public/sw.js'), 'utf8');
const iconSource = readFileSync(path.join(repoRoot, 'public/icons/icon.svg'), 'utf8');

describe('SEO and PWA contracts', () => {
  it('builds reciprocal locale alternates including x-default', () => {
    const alternates = buildLanguageAlternates('/features');

    expect(Object.keys(alternates)).toHaveLength(SUPPORTED_LOCALES.length + 1);
    expect(alternates['x-default']).toContain(`/${DEFAULT_LOCALE}/features`);
    for (const locale of SUPPORTED_LOCALES) {
      expect(alternates[locale]).toContain(`/${locale}/features`);
    }
  });

  it('builds complete indexable metadata with locale-specific social tags', () => {
    const metadata = buildSeoMetadata({
      locale: 'fr',
      path: '/features',
      title: 'Fonctionnalites',
      description: 'Une base stricte et localisee.',
      keywords: ['Next.js', 'TypeScript'],
      socialImageAlt: 'Fonctionnalites · Strict Next Ranger',
    });

    expect(metadata).toEqual(
      expect.objectContaining({
        applicationName: 'Strict Next Ranger',
        title: 'Fonctionnalites',
        description: 'Une base stricte et localisee.',
        keywords: ['Next.js', 'TypeScript'],
        publisher: 'Strict Next Ranger',
        robots: { index: true, follow: true },
      }),
    );
    expect(metadata.alternates?.canonical).toBe(buildAbsoluteAppUrl('/fr/features'));
    expect(metadata.alternates?.languages?.fr).toBe(buildAbsoluteAppUrl('/fr/features'));
    expect(metadata.alternates?.languages?.['x-default']).toBe(buildAbsoluteAppUrl('/en/features'));
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        locale: 'fr_FR',
        url: buildAbsoluteAppUrl('/fr/features'),
        title: 'Fonctionnalites',
        images: [
          {
            url: buildAbsoluteAppUrl(`${SOCIAL_IMAGE_DIRECTORY}/fr.png`),
            width: SOCIAL_IMAGE_SIZE.width,
            height: SOCIAL_IMAGE_SIZE.height,
            alt: 'Fonctionnalites · Strict Next Ranger',
          },
        ],
      }),
    );
    const alternateLocales =
      metadata.openGraph && !Array.isArray(metadata.openGraph)
        ? metadata.openGraph.alternateLocale
        : undefined;
    expect(alternateLocales).not.toContain('fr_FR');
    expect(metadata.twitter).toEqual(
      expect.objectContaining({
        card: 'summary_large_image',
        title: 'Fonctionnalites',
        images: [
          {
            url: buildAbsoluteAppUrl(`${SOCIAL_IMAGE_DIRECTORY}/fr.png`),
            alt: 'Fonctionnalites · Strict Next Ranger',
          },
        ],
      }),
    );
  });

  it('keeps private metadata out of search results', () => {
    const metadata = buildNonIndexableMetadata('Workbench · Strict Next Ranger');

    expect(metadata.title).toBe('Workbench · Strict Next Ranger');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('omits an undefined title from private metadata', () => {
    expect(buildNonIndexableMetadata()).toEqual({
      robots: { index: false, follow: false },
    });
  });

  it('lists all 70 public documents with reciprocal alternates', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(70);
    expect(entries).toHaveLength(INDEXABLE_PATHS.length * SUPPORTED_LOCALES.length);
    expect(
      entries.every(
        (entry) =>
          Object.keys(entry.alternates?.languages ?? {}).length === SUPPORTED_LOCALES.length + 1,
      ),
    ).toBe(true);
  });

  it('publishes a default-locale manifest and protected crawler routes', () => {
    expect(manifest().start_url).toBe(buildLocalizedPath(DEFAULT_LOCALE, '/'));
    expect(manifest().theme_color).toBe('#087e8b');
    expect(manifest().background_color).toBe('#f4f7f8');
    expect(iconSource).not.toContain('#6d5dfc');
    expect(iconSource).toContain('#087E8B');

    const crawlerRules = robots().rules;
    expect(crawlerRules).not.toBeInstanceOf(Array);
    expect(crawlerRules).toEqual(expect.objectContaining({ userAgent: '*' }));
    const disallowed = Array.isArray(crawlerRules) ? undefined : crawlerRules.disallow;
    expect(disallowed).toContain('/api/');
    for (const locale of SUPPORTED_LOCALES) {
      for (const path of NON_INDEXABLE_PATHS) {
        expect(disallowed).toContain(buildLocalizedPath(locale, path));
      }
    }
  });

  it('builds deduplicated localized marketing keywords around stable technology terms', () => {
    expect(
      buildMarketingKeywords([
        'Fonctionnalités',
        'Tout est inclus',
        'Fonctionnalités',
        'Pensé pour les équipes produit',
      ]),
    ).toEqual([
      'Fonctionnalités',
      'Tout est inclus',
      'Pensé pour les équipes produit',
      'Next.js',
      'React',
      'TypeScript 7',
      'Progressive Web App',
    ]);
  });

  it('keeps service-worker locale and request exclusions aligned', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(serviceWorkerSource).toContain(`'${locale}'`);
    }
    expect(serviceWorkerSource).toContain('key.startsWith(CACHE_PREFIX)');
    expect(serviceWorkerSource).toContain("url.pathname.startsWith('/api/')");
    expect(serviceWorkerSource).toContain("request.headers.has('RSC')");
    expect(serviceWorkerSource).toContain("request.method !== 'GET'");
  });

  it('allows only the five public marketing routes and the offline fallback', () => {
    expect(serviceWorkerSource).toContain(
      "const PUBLIC_PATHS = ['', '/about', '/features', '/faq', '/contact', '/offline'];",
    );
    expect(serviceWorkerSource).toContain('!isPublicNavigationPath(url.pathname)');
  });
});
