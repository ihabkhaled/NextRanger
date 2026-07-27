# Strict Next Ranger

A **strict Next.js frontend operating system**: a production-grade starter repository that any
team can clone as the foundation for an enterprise frontend. It pairs a real, runnable
Next.js 16 App Router application with a governance layer — rules, skills, agents, context,
memory — and a custom ESLint architecture plugin that turns the architecture into something
machines enforce, not something reviewers hope for.

This is the frontend counterpart of a strict backend engineering OS: same discipline, adapted
to React Server Components, client boundaries, design systems, i18n/RTL, and browser security.

## What this frontend OS gives you

- **A real app**, not placeholders: articles list, login, settings, health endpoint, and a
  component workbench, all runnable with zero backend (the BFF gateway serves fixtures).
- **Module-first architecture** with machine-enforced one-way layer dependencies.
- **TSX-only components**: behavior lives in hooks/containers, logic in helpers/mappers.
- **One owner per vendor**: every third-party package is wrapped once under `src/packages/`.
- **14 custom ESLint rules** (`frontend-architecture/*`) enforcing what no off-the-shelf
  plugin can, with fixtures and a test harness proving they fire.
- **TDD gates**: Vitest + Testing Library + MSW, Playwright e2e/accessibility/visual, axe,
  95% global coverage (100% for pure logic).
- **Security by default**: per-request nonce CSP, strict headers, validated env split,
  cookie-session doctrine, Trivy + npm audit zero-unhandled-vulnerability policy.
- **Fourteen crawlable locales**: locale-prefixed URLs, reciprocal SEO, all-catalog parity,
  and Arabic/Persian RTL handling.
- **An AI operating system**: `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `cursor.md`,
  `.ai/`, `.cursor/rules/`, plus `rules/`, `skills/`, `agents/`, `context/`, and `memory/`
  so coding agents work inside the same guardrails humans do.
- **A reusable modernization brief**:
  [copy the production master prompt](docs/production-modernization-prompt.md) into an existing
  web, Capacitor, or backend project and replace its bracketed context.

## Quick start

```bash
nvm use
corepack enable
npm install
npm run dev        # http://localhost:3000 — gateway mock mode is on by default
```

The pinned toolchain is Node 24.18.0 and npm 12.0.1; `.nvmrc`, `.node-version`, and
`packageManager` keep local and CI installs identical.

Gates:

```bash
npm run lint             # ESLint, --max-warnings=0
npm run typecheck        # stable TypeScript 7 over app/test/node configs
npm run typecheck:compat # TypeScript 6 API compatibility for ESLint/tooling
npm run test:coverage    # Vitest + coverage thresholds
npm run build            # next build --turbopack
npm run test:e2e:install # one-time Playwright browser install (chromium for this project)
npm run test:e2e:baseline # explicit, reviewed refresh of every current-OS baseline
npm run test:e2e         # Playwright (builds and starts the prod server itself)
npm run test:a11y        # axe + keyboard suites
npm run test:visual      # screenshot baselines
npm run security:audit   # runtime graph, every severity
npm run security:scan    # Trivy: vuln + secret + misconfig
npm run quality:dead-code  # knip
npm run quality:circular   # dependency-cruiser
npm run validate         # everything above, in order
```

> **First-time e2e setup (repeatable on any OS):** run these two local-binary one-time
> steps before the first `npm run validate`, exactly as agents do it here:
>
> ```bash
> npm run test:e2e:install   # playwright install chromium
> npm run test:e2e:baseline  # playwright test src/tests/visual --update-snapshots=all
> ```
>
> `npm run validate` expects the browser to be present; the install is not part of
> `validate` to keep that command fast and repeatable in CI. Visual baselines are
> **per-OS** (`*-chromium-linux.png`, `*-chromium-win32.png`, …). CI is compare-only and
> fails when a Linux baseline is missing or changed. Run `test:e2e:baseline` only after
> inspecting an intentional visual diff; it refreshes every baseline for the current OS.
> The committed Linux baselines remain the source of truth (see
> [testing/visual-testing-standard.md](testing/visual-testing-standard.md)).
> Every Playwright npm script resolves the committed local binary; it never downloads a surprise
> CLI during validation.

## Architecture in one breath

`src/app` routes and composes; `src/modules/<feature>` owns features through strict layers
(components are TSX-only, hooks orchestrate, services/gateways speak HTTP, mappers translate
wire↔domain, queries own the cache, stores hold client-only state); `src/shared` is generic;
`src/packages` wraps every vendor exactly once; `src/tests` proves all of it; `src/proxy.ts`
signs every response with a nonce CSP.

## Canonical source tree

```txt
src/
  app/            routes, layouts, route handlers, providers — no business logic
  modules/        articles, auth, health, ui-preferences — full layer anatomy each
  shared/         config, constants, enums, errors, i18n keys, generic components
  packages/       axios, query, zustand, zod, date, forms, i18n, toast, icons,
                  ui-primitives, virtuoso, link, image, navigation, env, browser,
                  storage, logger — one owner per vendor
  tests/          setup, msw, unit, integration, e2e, accessibility, visual, factories
  proxy.ts        per-request nonce Content-Security-Policy
eslint/           split flat configs + the frontend-architecture plugin (14 rules)
rules/ skills/ agents/ context/ memory/ testing/ docs/   the governance brain
```

The full annotated map lives in [context/architecture-map.md](context/architecture-map.md).

## The component / container / hook / query / service split

| Layer              | File suffix        | May contain                                 |
| ------------------ | ------------------ | ------------------------------------------- |
| Component          | `.component.tsx`   | JSX from pre-computed props — nothing else  |
| Container          | `.container.tsx`   | `'use client'` + reason; wires hooks to JSX |
| Hook               | `.hook.ts`         | orchestration, translation, view models     |
| Query              | `.queries.ts` etc. | TanStack Query bound to key builders        |
| Service            | `.service.ts`      | use-cases; React does not exist here        |
| Gateway            | `.gateway.ts`      | HTTP wire contracts, Zod-validated          |
| Mapper/Helper/Util | `.mapper.ts` …     | pure logic, 100% branch-covered             |
| Types/Enums/Consts | `.types.ts` …      | declarations only; enums are `as const`     |

See [rules/02-components-and-containers.md](rules/02-components-and-containers.md) and the
real examples quoted in [context/reference-patterns.md](context/reference-patterns.md).

## Every library has one owner

Raw vendor imports outside their owner wrapper fail the lint gate
(`frontend-architecture/no-raw-package-imports`). The complete vendor → owner → facade table
is in [context/package-boundaries.md](context/package-boundaries.md). Adding a package means
adding a wrapper: [skills/create-package-wrapper.md](skills/create-package-wrapper.md).

## Reference modules

- **articles** — the flagship: list screen with loading/empty/error/ready states, query-key
  builders, exact invalidation, translated view models, gateway fixtures.
- **auth** — schema-validated login form (error messages are i18n keys), mutation + session
  snapshot store, token-free cookie-session doctrine, negative-path sentinel for e2e.
- **ui-preferences** — Zustand for true client global state (theme/direction/sidebar) with
  validated persistence and DOM sync through facades.
- **health** — the smallest possible module: one service, one route handler, one test.

## Testing strategy

TDD is policy ([rules/15-testing-and-coverage.md](rules/15-testing-and-coverage.md)): pure
logic first, then services/schemas/mappers, then integration through real providers with MSW,
then Playwright happy/negative paths, axe scans, keyboard walks, and visual baselines across
desktop/tablet/mobile and LTR/RTL. Standards live under [testing/](testing/README.md).

## Security and performance defaults

Nonce-based CSP with `strict-dynamic` ([src/proxy.ts](src/proxy.ts)), static security headers
([next.config.ts](next.config.ts)), Zod-validated public/server env split with a `server-only`
guard, sanitized error keys, safe external links, Trivy + audit gates — see
[rules/11-security.md](rules/11-security.md). Server Components first, justified client
boundaries, virtualization for long lists, backend-driven pagination — see
[rules/12-performance.md](rules/12-performance.md).

## AI tool compatibility

Point your agent at its entrypoint and it inherits the whole operating system:

- Universal: [AGENTS.md](AGENTS.md)
- Claude Code: [CLAUDE.md](CLAUDE.md)
- Codex: [CODEX.md](CODEX.md)
- Cursor: [cursor.md](cursor.md), [.cursorrules](.cursorrules), `.cursor/rules/*.mdc`
- Kimi: [KIMI.md](KIMI.md)
- Gemini: [GEMINI.md](GEMINI.md)
- GLM: [GLM.md](GLM.md)
- Qwen: [QWEN.md](QWEN.md)
- DeepSeek: [DEEPSEEK.md](DEEPSEEK.md)

Task-shaped playbooks live in [skills/](skills/README.md); reviewer personas in
[agents/](agents/README.md); durable decisions and pitfalls in [memory/](memory/README.md).

## How to add a new feature

Follow [skills/create-module.md](skills/create-module.md): plan tests first, scaffold the
module layers, expose a public surface via `index.ts`, add route + nav constants, add message
keys to **both** catalogs, wire gateway mocks, and run the gates. The full lifecycle template
is under [docs/features/\_template/](docs/features/README.md).

## How to add a new package wrapper

[skills/create-package-wrapper.md](skills/create-package-wrapper.md): install, create
`src/packages/<owner>/` with an `index.ts` facade and app-owned types, register the boundary
in [eslint/package-boundaries.config.mjs](eslint/package-boundaries.config.mjs), document it
in [context/package-boundaries.md](context/package-boundaries.md), and test the facade.

## How to migrate an existing frontend into this architecture

Strangler pattern, one feature at a time:

1. Drop the governance layer (rules/skills/context/eslint plugin) into the legacy repo with
   the custom rules at `warn` severity to get a violation inventory.
2. Wrap the vendors the legacy code uses most (http client, state, dates) and migrate imports.
3. Move one feature into `src/modules/<feature>` using
   [skills/refactor-feature.md](skills/refactor-feature.md) — tests first.
4. Flip the migrated paths to `error` severity; repeat.
5. When all features are modules, delete the legacy folders and enable the full gate set.

## License / status

Private starter template. Adjust `package.json` metadata when cloning for a real product.
