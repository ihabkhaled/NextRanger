# CODEX.md

Entrypoint for Codex agents working in **strict-next-ranger**, a strict Next.js 16 frontend
operating system. Canonical sources: [AGENTS.md](AGENTS.md),
[.ai/BOOTSTRAP.md](.ai/BOOTSTRAP.md),
[context/architecture-map.md](context/architecture-map.md),
[rules/00-non-negotiable-rules.md](rules/00-non-negotiable-rules.md).

## Layered-file doctrine

Every piece of code has exactly one home, named by suffix. Put code where the table says —
the `frontend-architecture` ESLint plugin (`eslint/architecture-plugin.mjs`) enforces this.

| Layer                     | Suffix / location                                                 | Contains                                                                                                        | Never contains                                                                         |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Component                 | `*.component.tsx` in `components/`                                | TSX only; props in, markup out                                                                                  | Hooks, logic, inline declarations, raw copy, raw `className` outside the design system |
| Container                 | `*.container.tsx` in `containers/`                                | `'use client'` + `// client-boundary-reason: …`, hook-to-component glue, the `.map()` over items                | Business logic, fetch calls, styling decisions                                         |
| Hook                      | `use-*.hook.ts` in `hooks/`                                       | Orchestration; builds fully-translated view models (see `src/modules/articles/hooks/use-articles-list.hook.ts`) | JSX                                                                                    |
| Query / mutation          | `*.queries.ts`, `*.mutations.ts`, `*-query-keys.ts` in `queries/` | `useAppQuery`/`useAppMutation` from `@/packages/query`; keys only from the builder file                         | Raw `@tanstack/react-query` imports, inline key arrays                                 |
| Service                   | `*.service.ts` in `services/`                                     | React-free domain logic                                                                                         | React imports, hooks, browser globals                                                  |
| Gateway                   | `*.gateway.ts` in `gateway/`                                      | `httpClient` calls to `buildGatewayPath(...)` same-origin BFF paths                                             | Direct axios, absolute backend URLs, `process.env`                                     |
| Mapper                    | `*.mapper.ts` in `mappers/`                                       | Wire snake_case → domain camelCase conversion                                                                   | Side effects, fetching                                                                 |
| Types / enums / constants | `*.types.ts`, `*.enum.ts`, `*.constants.ts`                       | Declarations; enums are `as const` objects                                                                      | Runtime logic                                                                          |
| Schema                    | `*.schema.ts` in `schemas/`                                       | Zod schemas via `@/packages/zod`; error messages are i18n keys                                                  | Raw copy                                                                               |
| Wrapper                   | `src/packages/<vendor>/`                                          | The single owning facade for one third-party package                                                            | App/business logic                                                                     |

Routes and layouts live only in `src/app`. Cross-module imports go only through
`@/modules/<feature>` (the module `index.ts`).

## Never bypass ESLint — move the code

Lint runs with `--max-warnings=0` and the architecture rules are the design. When a rule
fires, it is telling you the code is in the wrong layer:

- Hook in a `*.component.tsx`? Lift it into the container or a `use-*.hook.ts`.
- Raw `import axios` / `zod` / `dayjs`? Import from the wrapper in `src/packages/<vendor>`
  (ownership map: `eslint/package-boundaries.config.mjs`).
- `process.env` reference? Use `publicEnv` from `@/packages/env` or `getServerEnv` from
  `@/packages/env/server`.
- Inline query key? Add it to the module's `*-query-keys.ts` builder.
- Raw string in JSX? Add a message key via [skills/add-i18n-message-key.md](skills/add-i18n-message-key.md).

You MUST NOT add `eslint-disable` comments. The only sanctioned path is a documented
exception in [docs/exceptions/](docs/exceptions/README.md), and that is a reviewed decision,
not an agent shortcut. Rule reference: [docs/eslint/README.md](docs/eslint/README.md).

## Gate commands

```bash
npm run lint          # ESLint 9 flat config, zero warnings tolerated
npm run typecheck     # stable TypeScript 7 over app/test/node; prints compiler versions
npm run typecheck:compat # TypeScript 6 API compatibility for ESLint/tooling
npm run test          # Vitest; npm run test:coverage enforces 95%/100% thresholds
npm run build         # next build --turbopack
npm run gate:push          # format + assets + lint + types + coverage + build + static checks + audit
npm run validate           # push gate + e2e + Trivy
npm run test:e2e:install   # one-time Playwright Chromium download (run before first validate)
npm run test:e2e:baseline  # refresh all current-OS visual baselines; review every changed image
```

Git hooks already enforce these: `.husky/pre-commit` (lint-staged), `.husky/commit-msg`
(conventional commits), `.husky/pre-push` (`gate:push`). Never skip hooks.
