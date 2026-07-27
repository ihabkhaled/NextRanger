# Localization and SEO map

Load this page for routes, copy, metadata, PWA, or crawler work.

## Sources of truth

| Contract                                           | Source                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| Locale codes, names, Open Graph locales, direction | `src/packages/i18n/locale.constants.ts`                             |
| Locale-preserving URLs                             | `src/shared/helpers/localized-route.helper.ts`                      |
| App paths                                          | `src/shared/constants/route-paths.constants.ts`                     |
| Public/private crawl paths and social size         | `src/shared/constants/seo.constants.ts`                             |
| Metadata, canonical, hreflang, social cards        | `src/shared/helpers/seo-metadata.helper.ts`                         |
| Public page schema                                 | `src/modules/marketing/helpers/marketing-structured-data.helper.ts` |
| Sitemap, robots, manifest                          | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`    |

Every page URL starts with one of the 14 `SUPPORTED_LOCALES`. Arabic and Persian are RTL.
Five public marketing paths produce 70 sitemap documents. Login, articles, settings, workbench,
offline, and API routes are intentionally non-indexable.

## Public-page change

1. Add the locale-free path to `ROUTE_PATHS` and `INDEXABLE_PATHS`.
2. Add the page below `src/app/[locale]/(public)/`.
3. Add every message key to every file in `src/packages/i18n/messages/`.
4. Build metadata with `buildSeoMetadata`; expose semantic JSON-LD matching visible copy.
5. Update navigation, breadcrumb, sitemap/robots tests, and the production SEO e2e spec.
6. If social copy changed, run `npm run assets:social:generate` and review all changed PNGs.

Run `npm run assets:social:check` for deterministic asset drift, then the focused unit/e2e tests.
Use `npm run gate:push` before publication.
