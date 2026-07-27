---
name: add-route
description: Use when adding or changing a Next.js page, route handler, public marketing document, sitemap entry, or crawl-visibility contract.
---

# Add a route

Routes are thin locale-aware composition shells. Read
[the localization/SEO map](../context/localization-and-seo-map.md) and
[rule 01](../rules/01-next-app-router-architecture.md).

## Choose the route class

| Class                          | Location                                    | Discovery                  |
| ------------------------------ | ------------------------------------------- | -------------------------- |
| Public marketing               | `src/app/[locale]/(public)/<slug>/page.tsx` | indexable, sitemap, schema |
| Auth/product/workbench/offline | matching `[locale]` group                   | `noindex`, robots disallow |
| API                            | `src/app/api/<path>/route.ts`               | robots disallow            |

## Green vertical slice

1. Write the focused failing test. Keep it local; red tests are never committed or pushed.
2. Add the locale-free path to `ROUTE_PATHS`. Use `buildLocalizedPath` or
   `buildLocalizedLocation` at navigation boundaries.
3. Add copy to every catalog in `src/packages/i18n/messages/`; update message-key constants.
4. Add the async Server Component page. It validates `params.locale`, composes module exports,
   and contains no feature logic or client boundary.
5. Update typed navigation labels/items and breadcrumb scope.
6. Apply discovery:
   - Public: add `INDEXABLE_PATHS`, `MarketingPageKind`, metadata/keywords, semantic JSON-LD,
     sitemap and SEO tests. Reuse `/social/<locale>.png` unless the product requires per-page art.
   - Utility: add `NON_INDEXABLE_PATHS`, `buildNonIndexableMetadata`, and crawler tests.
7. If offline navigation should cache the route, update `public/sw.js` and its contract test.
8. Add unit/e2e coverage; add a11y and reviewed visual coverage when UI changed.

## Gates and checkpoint

Run the focused tests, `npm run lint`, `npm run typecheck`, and `npm run build`. For discovery
changes also run:

```sh
npx playwright test src/tests/e2e/seo.e2e.ts
npm run assets:social:check
```

Commit the complete green vertical slice conventionally and push it promptly. Before final
publication run `npm run gate:push`; never bypass hooks.

## Done

- Locale-prefixed URL, route constant, navigation/breadcrumb, and all catalogs agree.
- Page is server composition only; public/private crawler policy is explicit.
- Focused tests and gates are green with zero warnings.
