import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import manifest from '@/app/manifest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/packages/i18n';
import { INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import {
  buildAbsoluteAppUrl,
  buildLanguageAlternates,
  buildSeoMetadata,
} from '@/shared/helpers/seo-metadata.helper';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const serviceWorkerSource = readFileSync(path.join(repoRoot, 'public/sw.js'), 'utf8');

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
    });

    expect(metadata).toEqual(
      expect.objectContaining({
        title: 'Fonctionnalites',
        description: 'Une base stricte et localisee.',
        keywords: ['Next.js', 'TypeScript'],
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
      }),
    );
    const alternateLocales =
      metadata.openGraph && !Array.isArray(metadata.openGraph)
        ? metadata.openGraph.alternateLocale
        : undefined;
    expect(alternateLocales).not.toContain('fr_FR');
    expect(metadata.twitter).toEqual(
      expect.objectContaining({ card: 'summary', title: 'Fonctionnalites' }),
    );
  });

  it('keeps private metadata out of search results', () => {
    const metadata = buildSeoMetadata({
      locale: 'en',
      path: '/workbench',
      title: 'Workbench',
      description: 'Private implementation workspace.',
      keywords: [],
      index: false,
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
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
    expect(robots().rules).toEqual(expect.objectContaining({ userAgent: '*' }));
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
