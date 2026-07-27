# Risk Baseline

Every change is assigned a risk class at intake and recorded in the PR description. The class drives the gate matrix in [qa-baseline.md](./qa-baseline.md), the review depth in [engineering-standards.md](./engineering-standards.md), and UAT requirements in [uat-baseline.md](./uat-baseline.md). When in doubt, classify one level higher.

## Classes

### High

Changes that can break authentication, leak data, take the whole app down, or silently corrupt user-visible behavior across modules.

Examples in this repo:

- Anything under `src/modules/auth` (login flow, `useAuthStore` session snapshot, `loginFormSchema`).
- `src/proxy.ts` (nonce CSP) or the security headers in `next.config.ts`.
- The BFF gateway: `src/app` route handler for `/api/gateway/[...path]` and its `gateway-handler.ts`, `buildGatewayPath`, `API_ROUTES`.
- Env handling: `src/packages/env`, `.env.example`, `appConfig` in `src/shared/config/app-config.ts`.
- The axios wrapper `src/packages/axios` (`httpClient`, `HttpError`, `normalizeToHttpError`) — every network call flows through it.
- Root layout / providers in `src/app` (i18n provider, `AppQueryProvider`, `UiPreferencesEffects` mounting).
- Dependency upgrades of framework-tier packages (next, react, typescript) or any `overrides` change in `package.json`.

**Required mitigations**: two reviewer approvals including the relevant specialist agent checklist; full gate matrix incl. e2e, a11y, visual; manual UAT sign-off; rollback plan referenced in the PR; security review doc updated when the change is security-adjacent.

### Medium

Changes with real behavior impact confined to one module or one shared surface.

Examples:

- New feature module or new layer inside `src/modules/<feature>` (a new query, mutation, container, store).
- Changes to shared building blocks in `src/shared/` (error mapping, `ROUTE_PATHS`, `TEST_IDS`, design-system primitives in `src/packages/ui-primitives`).
- New or changed package wrapper other than axios/env (e.g. `src/packages/query`, `src/packages/storage`).
- ESLint policy changes: `eslint/architecture.config.mjs` layer table, `eslint/package-boundaries.config.mjs` ownership map, new custom rules.
- Non-framework dependency upgrades.

**Required mitigations**: one approval; Medium column of the gate matrix; consumer test suites re-run for wrapper changes; docs updated per [documentation-baseline.md](./documentation-baseline.md).

### Low

Changes that cannot alter behavior for users beyond their visible intent.

Examples:

- Copy changes: editing values in `src/packages/i18n/messages/en.json` + `ar.json` (both, always).
- Documentation-only changes under `rules/`, `docs/`, `memory/`, `context/`.
- Test-only additions (new specs, new factories in `src/tests/factories`).
- Styling token tweaks in `src/app/styles.css` that do not change component structure.

**Required mitigations**: one approval; `npm run quality` green; for copy changes, catalog-parity
tests plus affected-locale visual review, including Arabic and Persian RTL flow.

## Escalation triggers

Reclassify to **High** immediately if a change, whatever its origin: touches cookie or storage formats (`STORAGE_KEYS`, `readStorageJson` schemas), alters `LOCALE_COOKIE_NAME` handling, changes error sanitization (`mapErrorToMessageKey`), or modifies any CI workflow gate in `.github/workflows/`. Weakening a gate is itself a High-risk change and additionally requires an exception doc ([docs/exceptions/README.md](../exceptions/README.md)).
