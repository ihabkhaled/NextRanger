# Known Pitfalls

Failures actually hit while building strict-next-ranger, with their fixes. Consult this file
before debugging toolchain, typing, or lint errors — most of them are already solved here.
Cursor agents get a distilled copy in [.cursor/rules/50-pitfalls.mdc](../.cursor/rules/50-pitfalls.mdc).

## Toolchain and dependency pinning

### ESLint 10 breaks the plugin ecosystem

- **Symptom:** upgrading to ESLint 10 makes `eslint-plugin-jsx-a11y` and `eslint-plugin-unicorn`
  fail to load under the flat-config API.
- **Fix:** stay on the ESLint 9 line (`eslint: ^9.39.4` in `package.json`) until both plugins
  publish ESLint-10-compatible releases. Do not let `npm run deps:upgrade` cross this major
  without re-verifying `npm run lint` on the full tree.

### TypeScript 7 does not provide the programmatic API used by ESLint tooling

- **Symptom:** replacing the root `typescript` package with TypeScript 7 breaks packages that
  import the JavaScript compiler API, even though the TypeScript 7 CLI compiles the app.
- **Fix:** keep the two explicit aliases. `@typescript/native` resolves to stable TypeScript 7 and
  owns `npm run typecheck`; `typescript` resolves to `@typescript/typescript6` for ESLint/tooling
  and owns `npm run typecheck:compat`. `npm run compiler:versions` proves both binaries.
- **Related:** dependency-cruiser replaced madge because madge's TypeScript peer range cannot
  support this split cleanly. Do not reintroduce madge.

### npm `overrides` must mirror the direct devDependency exactly

- **Symptom:** an `overrides` entry whose spec string differs from the direct devDependency
  (`postcss` was the case) makes `npm install` error or silently keep the vulnerable transitive
  version.
- **Fix:** use the identical spec in both places — `"overrides": { "postcss": "^8.5.16" }` and
  `"postcss": "^8.5.16"` in devDependencies — then regenerate `package-lock.json` with a fresh
  `npm install`. Rationale in [security-decisions.md](./security-decisions.md).

## Lint rules vs SSR reality

### `unicorn/prefer-global-this` breaks SSR-safe browser detection

- **Symptom:** the rule rewrites `typeof window !== 'undefined'` to `globalThis`-based code, and
  `lib.dom` types `window` as always present — the naive check then typechecks as always-true and
  the SSR guard evaporates.
- **Fix:** encode detection once through an untyped global read in the browser facade:
  `(globalThis as Record<string, unknown>)['window']` inside
  `src/packages/browser/browser-environment.ts` (`readGlobalProperty`, `isBrowser`,
  `getSafeWindow`). All other code MUST use the facade, never raw globals
  (enforced by `no-direct-browser-api-outside-packages`, see
  [docs/eslint/no-direct-browser-api-outside-packages.md](../docs/eslint/no-direct-browser-api-outside-packages.md)).

### sonarjs `no-hardcoded-passwords` false-positives

- **Symptom:** i18n keys, test ids, and form field ids containing the word "password" (the login
  form is full of them) are flagged as hardcoded credentials.
- **Fix:** rule is `'off'` in `eslint/sonar.config.mjs` with an inline justification comment.
  Secret detection is owned by Trivy (`npm run security:scan`), which scans actual secret patterns.

## React 19 / TypeScript strictness

### React 19 types deprecate `FormEvent` / `FormEventHandler`

- **Fix:** type form submit handlers as `SyntheticEvent<HTMLFormElement>` instead. Reference:
  the `onSubmit` prop in `src/modules/auth/types/auth.types.ts`, consumed by
  `src/modules/auth/components/login-form.component.tsx`.

### TanStack `useMutation` generic order

- **Pitfall:** the order is `<TData, TError, TVariables>` — putting variables second compiles in
  loose codebases and explodes here. The wrapper `useAppMutation` in
  `src/packages/query/query-hooks.ts` fixes the order once; use it, never the raw hook.

### `exactOptionalPropertyTypes` and computed `undefined`

- **Symptom:** view-model fields assigned a computed value that may be `undefined` fail against
  `prop?: T`; vendor prop spreads fail because vendor types were not written for this flag.
- **Fix:** declare such fields as `prop?: T | undefined` on view-model types, and keep wrapper
  prop surfaces narrow (explicit props, no blind `...rest` spreads into vendor components) — see
  `src/packages/virtuoso/virtualized-list.tsx` for the pattern.

### `zodResolver` cannot type-flow through generic schemas

- **Symptom:** under `exactOptionalPropertyTypes`, `zodResolver` cannot carry an abstract
  `TFieldValues` through its overloads.
- **Fix:** one documented double-cast inside `src/packages/forms/use-app-zod-form.hook.ts` — the
  single sanctioned bridge. Never repeat this cast in feature code.

## Next.js 16 conventions

- **`middleware.ts` is now `proxy.ts`:** the per-request nonce CSP lives in `src/proxy.ts`.
  Creating a `middleware.ts` does nothing in Next 16.
- **`next dev`/`next build` rewrite `tsconfig`:** Next forces `"jsx": "react-jsx"` and appends
  `.next` dev type files to `include`. This is expected — do not fight the rewrite, and do not
  commit unrelated tsconfig churn as if it were a regression. Project-reference splits live in
  `tsconfig.app.json` / `tsconfig.test.json` / `tsconfig.node.json`.

## Local-machine and gate-run pitfalls (learned during the founding build)

- **knip is pinned to the 5.x line:** knip 6 hard-requires the `oxc-parser` native module,
  which Windows Application Control policies can block (`ERR_DLOPEN_FAILED` /
  "An Application Control policy has blocked this file"). knip 5 parses with TypeScript and
  needs no native binding. Revisit when the oxc binary ships signed.
- **npm sometimes drops platform-specific optional deps** after lockfile regeneration (the
  well-known npm optional-dependencies bug). Symptom: `Cannot find module './*.node'`.
  Fix locally with a fresh `npm ci`; never commit a platform binding to package.json.
- **Playwright must not use port 3000:** `reuseExistingServer` will happily attach to a
  developer's unrelated dev server on 3000 and every assertion fails against the wrong app.
  The e2e server runs on the dedicated port 3100 (playwright.config.ts).
- **Lint autofixers can change test semantics:** `unicorn/prefer-https` rewrote a deliberate
  `http://` rejection-test URL to `https://`, and `unicorn/no-useless-undefined` stripped a
  required `vi.stubGlobal('window', undefined)` argument. Build attack/edge-case strings
  dynamically (`['http', '//x'].join(':')`) and keep `checkArguments: false` configured.
- **RHF `formState` is a lazy proxy:** read `formState.errors` during render (inside the
  hook under test) or subscriptions never fire and assertions see stale state.
- **`vi.mock('next/navigation')`/`vi.mock('sonner')` do not intercept externalized vendor
  modules.** Provide Next's `AppRouterContext`/`PathnameContext` directly (see
  `src/tests/helpers/app-router-stub.tsx`) and assert real toast DOM output instead.
