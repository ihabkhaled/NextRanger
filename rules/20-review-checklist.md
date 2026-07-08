# Rule 20 — PR Review Checklist

The reviewer's working checklist. Every box MUST be checked (or covered by a documented exception
in [docs/exceptions/](../docs/exceptions/README.md)) before approval. Each group cites the rule
that defines it — when in doubt, the numbered rule wins.

## Architecture ([01](01-next-app-router-architecture.md), [02](02-components-and-containers.md), [03](03-hooks.md), [04](04-services-api-gateway.md), [09](09-library-wrapping.md))

- [ ] `src/app` contains only routes, layouts, and route handlers — feature logic lives in `src/modules/<feature>`.
- [ ] Cross-module imports go through the module's `index.ts` public surface (`@/modules/<feature>`), never deep paths.
- [ ] New third-party usage goes through its owner wrapper in `src/packages/` — no raw vendor imports.
- [ ] `*.component.tsx` files are TSX-only: no hooks, no logic, no local declarations, no inline query keys, no raw copy, no service/gateway imports.
- [ ] Containers carry `'use client'` plus a `// client-boundary-reason:` comment and do the `.map()` to child elements.
- [ ] Hooks, services, gateways, utils, helpers, and mappers contain no inline types, interfaces, enums, constants, or local helper functions.
- [ ] Services, gateways, and mappers are React-free; wire snake_case is mapped to domain camelCase in `mappers/`.
- [ ] Query keys come only from a builder file (e.g. `articleQueryKeys`) — [05](05-tanstack-query.md).

## Quality ([07](07-types-enums-constants.md), [08](08-utils-helpers-mappers.md), [10](10-eslint-typescript.md), [12](12-performance.md))

- [ ] `npm run lint` and `npm run typecheck` pass; no new `eslint-disable` without an exception doc.
- [ ] No magic strings: routes via `ROUTE_PATHS`, storage via `STORAGE_KEYS`, test ids via `TEST_IDS`.
- [ ] Server-component-first respected; every new `'use client'` boundary is justified.
- [ ] Lists that can exceed ~100 rows use `VirtualizedList`; pagination is backend-driven.
- [ ] No speculative `useMemo`/`useCallback`/`React.memo`; measured memoization lives in hooks only.
- [ ] No dead code or new circular imports (`npm run quality:dead-code`, `npm run quality:circular`).

## Security ([11](11-security.md), [17](17-configuration-environment.md), [18](18-error-handling.md))

- [ ] No CSP or security-header changes in `src/proxy.ts` / `next.config.ts` without security review.
- [ ] No raw `process.env`; new variables follow the schema → `env.d.ts` → `.env.example` → docs steps.
- [ ] No secrets or tokens in client code, storage, or logs; sessions stay cookie-based.
- [ ] No `dangerouslySetInnerHTML`; external links use `ExternalLink` / `isSafeExternalUrl`.
- [ ] Errors surface only translated `ERROR_MESSAGE_KEYS` copy; no vendor error text leaks to users.
- [ ] `security:audit` and `security:scan` are green or a dated exception exists.

## Accessibility ([13](13-accessibility.md))

- [ ] Landmarks intact; new pages reachable from `SkipLink` via `LANDMARK_IDS`.
- [ ] One `h1` per page; heading levels descend without gaps.
- [ ] Form controls use `FormField` with `aria-invalid` + `aria-describedby` error wiring.
- [ ] Everything keyboard-operable; focus-visible styles from primitives untouched.
- [ ] Toggle state exposed via `aria-pressed`/`aria-checked`; `npm run test:a11y` green.

## i18n / RTL ([14](14-i18n-rtl.md))

- [ ] Every new string exists in both `en.json` and `ar.json`; namespaces from `I18N_NAMESPACES`.
- [ ] Components and schemas carry keys; translation happens in hooks or server components.
- [ ] Only logical utilities (`ps-`/`pe-`/`ms-`/`me-`/`start-`/`end-`); layout verified in `dir="rtl"`.
- [ ] Plurals use ICU syntax with Arabic categories; dates go through `src/packages/date`.

## Testing ([15](15-testing-and-coverage.md))

- [ ] Tests exist at the right layer (module `test/`, `src/tests/integration`, Playwright suites).
- [ ] Coverage thresholds hold: 95% global, 100% utils/helpers/mappers/schemas/query-key builders.
- [ ] API-touching tests use MSW handlers, not transport mocks.
- [ ] No `.only`, no snapshot-only tests, no implementation-detail assertions.

Final release verification is separate: [rules/19-release-gates.md](19-release-gates.md) and
[skills/final-validation.md](../skills/final-validation.md).
