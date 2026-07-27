# Exceptions Register

This directory is the **only** sanctioned path around a gate. If code needs an `eslint-disable`, a `@ts-expect-error`, a suppressed rule in an `eslint/*.config.mjs` file, an accepted vulnerability, or a waiver of any policy in [docs/sdlc](../sdlc/README.md) — an exception document MUST exist here first. An undocumented suppression is a merge blocker, full stop.

## The contract

Every exception MUST be filed from [exception-template.md](./exception-template.md) and MUST carry:

- **Owner** — a named person accountable for the exception's continued existence.
- **Expiry** — a date on which the exception is re-justified or removed. "Permanent" is allowed only when the safer alternative is structurally impossible, and even then it is re-reviewed at every framework-tier upgrade.
- **Reason** — the concrete failure the gate produces here, not "the rule is annoying".
- **Safer alternative considered** — what was tried or evaluated first, and why it lost.
- **Mitigation** — the compensating control that covers the risk the gate would have covered.

The suppression site in code MUST reference its exception (a comment naming the doc). The release checklist audits expiry dates on every release ([docs/sdlc/release-checklist.md](../sdlc/release-checklist.md)); an expired exception blocks release.

## What requires an exception

| Suppression                                             | Gate bypassed                                        |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `// eslint-disable-*` in source                         | `npm run lint` with `--max-warnings=0`               |
| Rule set to `'off'`/downgraded in `eslint/*.config.mjs` | the rule's whole surface                             |
| `@ts-expect-error` / `as unknown as` bridge             | TypeScript 7 strict typecheck                        |
| Skipped test / lowered coverage threshold               | `npm run test:coverage` gates in `vitest.config.mts` |
| Accepted vulnerability / audit filter                   | `npm run security:audit` / `npm run security:scan`   |
| Raw (untranslated) user-facing copy                     | `no-raw-i18n-text`                                   |

## Currently active exceptions

### EXC-0001 — `sonarjs/no-hardcoded-passwords` off

- **Where**: `eslint/sonar.config.mjs` (rule set to `'off'`).
- **Reason**: the rule cannot distinguish i18n keys, test ids, and form field ids that mention "password" from real credentials; in this codebase every hit was a false positive.
- **Mitigation / ownership**: secret detection is owned by the Trivy secret scanner (`npm run security:scan`) locally and in `.github/workflows/security.yml`.

### EXC-0002 — `security/detect-object-injection` off

- **Where**: `eslint/security.config.mjs` (rule set to `'off'`).
- **Reason**: flags every computed property access; near-100% false positives in strictly typed code.
- **Mitigation / ownership**: object-injection risk is controlled by TypeScript strictness (`noPropertyAccessFromIndexSignature`, `noUncheckedIndexedAccess`) and Zod-validated boundaries via `parseSchema` from `@/packages/zod`.

### EXC-0003 — English fallback copy in the global error boundary

- **Where**: `src/shared/constants/fallback-copy.constants.ts` (`FALLBACK_ERROR_COPY`), consumed by `src/app/global-error.tsx`.
- **Reason**: `global-error.tsx` renders when the app shell — including the next-intl provider — has crashed; there is no i18n runtime left to translate with. This is the single exception to the "all copy is translated" rule ([rules/14-i18n-rtl.md](../../rules/14-i18n-rtl.md)).
- **Mitigation**: copy is confined to one `as const` constant with three keys (title, description, retry); no other file may import untranslated copy.

### EXC-0004 — resolver cast in the forms wrapper

- **Where**: `src/packages/forms/use-app-zod-form.hook.ts` — the `as unknown as Resolver<TFieldValues>` bridge around `zodResolver`.
- **Reason**: `zodResolver` from `@hookform/resolvers` cannot carry an abstract `TFieldValues` through its overloads under `exactOptionalPropertyTypes`; the cast is the single sanctioned bridge between the vendor generics and our generic facade.
- **Mitigation**: the runtime contract (schema output equals form values) is guaranteed by the wrapper itself; the cast exists in exactly one file, owned by the forms package, and is re-evaluated on every `@hookform/resolvers` upgrade.

### EXC-0005 — brace-expansion installer paths

- **Where**: support/patch-brace-expansion-compat.mjs (security/detect-non-literal-fs-filename is off only for this file).
- **Reason**: npm can install the patched package at multiple nested paths; literal filenames cannot cover a dependency tree that legitimately changes.
- **Mitigation**: traversal is confined to process.cwd()/node_modules, the exact package name and version are verified, the source shape is checked before writing, and installation fails closed. See [EXC-0005](./EXC-0005-brace-expansion-installer-paths.md).

### EXC-0006 — localized social-asset filesystem paths

- **Where**: `support/social-*.mjs` via the scoped rule override in
  `eslint/security.config.mjs`.
- **Reason**: deterministic generators must read locale/weight-derived font and PNG paths; the
  security rule cannot prove those enumerations are closed.
- **Mitigation**: paths are confined to fixed repository roots, locale/weight values come from
  validated closed sets, and committed hash manifests fail the quality gate on drift. See
  [EXC-0006](./EXC-0006-social-asset-filesystem.md).

## Lifecycle

1. File the doc from the template with a new `EXC-NNNN` id, get architect approval in the same PR as the suppression.
2. Add the register entry above.
3. On expiry: remove the suppression, or re-justify with a new expiry and a note on why removal is still blocked.
4. When removed: mark the doc superseded (do not delete) and record the lesson in [memory/known-pitfalls.md](../../memory/known-pitfalls.md) if it generalizes.
