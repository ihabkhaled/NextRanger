# Skill: Add a Route

Use this skill to add a new page under `src/app/`. Routes are thin: a `page.tsx` composes
module containers and shared layout primitives — it never contains feature logic. Doctrine:
[rules/01-next-app-router-architecture.md](../rules/01-next-app-router-architecture.md).

## Steps

1. **Pick the route group.** Existing groups under `src/app/`:
   - `(public)` — unauthenticated marketing/landing surface (home lives at
     `src/app/(public)/page.tsx`).
   - `(auth)` — sign-in flows (`src/app/(auth)/login/page.tsx`).
   - `(dashboard)` — the product shell (`src/app/(dashboard)/articles/page.tsx`,
     `src/app/(dashboard)/settings/page.tsx`).
   - `(workbench)` — the design-system showcase (`src/app/(workbench)/workbench/page.tsx`).
     Create a new group only when the new page needs a different layout shell; otherwise reuse.
2. **Register the path constant.** Add the path to `ROUTE_PATHS` in
   `src/shared/constants/route-paths.constants.ts` (typed as `Route`, so `typedRoutes` catches
   dead links at build time). Raw path strings in app code are a no-magic-strings violation.
3. **Add the i18n copy.** Every page needs at least `title` and `subtitle` keys. Follow
   [skills/add-i18n-message-key.md](add-i18n-message-key.md): add the namespace to
   `I18N_NAMESPACES` if new, and add keys to BOTH `src/packages/i18n/messages/en.json` and
   `src/packages/i18n/messages/ar.json`.
4. **Write `page.tsx`** as an async Server Component. Copy the shape of
   `src/app/(dashboard)/articles/page.tsx` — it is the canonical page:

   ```tsx
   export async function generateMetadata(): Promise<Metadata> {
     const t = await getServerTranslations(I18N_NAMESPACES.articles);

     return { title: buildPageTitle(t('title')) };
   }
   ```

   Rules:
   - `generateMetadata` MUST use `buildPageTitle` from
     `src/shared/helpers/page-title.helper.ts` ("Section · App name" format).
   - Translations come from `getServerTranslations` (`@/packages/i18n`) with an
     `I18N_NAMESPACES` constant — never a raw namespace string.
   - The body composes `PageContainer` (from `@/packages/ui-primitives`), the shared
     `PageHeader` component, and the module's container imported from the module public
     surface (`@/modules/<feature>` — never a deep path).
   - No `'use client'` in `page.tsx`. Interactivity lives in the module's container.

5. **Add the navigation link.** Extend the header/nav with an `AppLink` (from
   `@/packages/link`) pointing at the new `ROUTE_PATHS` entry, labeled with a key in the
   `nav` namespace of both message catalogs.
6. **Write the e2e smoke test** in `src/tests/e2e/<feature>.e2e.ts` per
   [skills/write-e2e-tests.md](write-e2e-tests.md): navigate to the route, assert the page
   title (`buildPageTitle` output) and one stable `TEST_IDS` element. Playwright's
   `webServer` (see `playwright.config.ts`) builds and starts the app with
   `SERVER_API_MOCKING: 'enabled'`, so the page must render fully against mock fixtures.
7. **Gate.** Run `npm run lint`, `npm run typecheck`, `npm run build` (typedRoutes verifies
   every `AppLink` target), and `npm run test:e2e`.

## Definition of done

- `page.tsx` is Server Component + composition only; metadata via `buildPageTitle`.
- `ROUTE_PATHS` entry, nav link, en + ar copy, e2e smoke test.
- `npm run quality` green.
