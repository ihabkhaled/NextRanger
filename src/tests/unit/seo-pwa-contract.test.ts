import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import manifest from '@/app/manifest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/packages/i18n';
import { INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { buildLanguageAlternates } from '@/shared/helpers/seo-metadata.helper';

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
