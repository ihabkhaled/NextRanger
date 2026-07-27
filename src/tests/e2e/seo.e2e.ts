import { expect, test } from '@playwright/test';

import { SUPPORTED_LOCALES } from '@/packages/i18n';
import { NON_INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

test.describe('search and social discovery', () => {
  test('publishes complete localized metadata and a reachable social image', async ({
    page,
    request,
  }) => {
    await page.goto('/fr/features');

    await expect(page).toHaveTitle(/Strict Next Ranger/u);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /socle|modules|production/iu,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/fr\/features$/u);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(
      SUPPORTED_LOCALES.length + 1,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /index,\s*follow/iu,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'fr_FR');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );

    const socialImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const socialImageAlt = await page
      .locator('meta[property="og:image:alt"]')
      .getAttribute('content');
    expect(socialImage).toMatch(/\/social\/fr\.png$/u);
    expect(socialImageAlt).toMatch(/rigueur.*Strict Next Ranger/iu);

    const imageResponse = await request.get(socialImage ?? '');
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()['content-type']).toContain('image/png');
    for (const locale of SUPPORTED_LOCALES) {
      const localizedImageResponse = await request.get(`/social/${locale}.png`);
      expect(localizedImageResponse.ok()).toBe(true);
      expect(localizedImageResponse.headers()['content-type']).toContain('image/png');
    }
  });

  test('marks every localized utility page noindex and nofollow', async ({ page }) => {
    for (const path of NON_INDEXABLE_PATHS) {
      await page.goto(buildLocalizedPath('en', path));
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex,\s*nofollow/iu,
      );
    }
  });

  test('publishes a complete sitemap while shielding utility routes from crawlers', async ({
    request,
  }) => {
    const robotsResponse = await request.get('/robots.txt');
    const sitemapResponse = await request.get('/sitemap.xml');
    const robotsText = await robotsResponse.text();
    const sitemapText = await sitemapResponse.text();

    expect(robotsResponse.ok()).toBe(true);
    expect(sitemapResponse.ok()).toBe(true);
    expect(robotsText).toContain('Disallow: /en/articles');
    expect(robotsText).toContain('Disallow: /ar/offline');
    expect(sitemapText.match(/<url>/gu)).toHaveLength(70);
    expect(sitemapText).toContain('/en/features');
    expect(sitemapText).toContain('/ar/features');
    expect(sitemapText).not.toContain('/en/settings');
  });
});
