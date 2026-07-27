---
name: final-validation
description: Use before a push, merge, release, or completion claim for any feature, refactor, UI, documentation, or dependency change.
---

# Final validation

Treat [package.json](../package.json) as the executable source of truth. Read
[release gates](../rules/19-release-gates.md) and the
[release checklist](../docs/sdlc/release-checklist.md). Stop at the first failure; fix the cause,
then rerun the failed command and its parent composite. Never bypass a hook or weaken a gate.

## Prepare a fresh checkout

```sh
nvm use
node --version
corepack npm --version
trivy --version
corepack npm ci
corepack npm run test:e2e:install
```

Versions MUST match `.nvmrc`, `packageManager`, and `.trivy-version`; provision the pinned external
Trivy CLI before validation. `npm ci` is lockfile-frozen. Trivy and browser installation are once
per environment, not release gates.

## Validate

Before each pushed checkpoint, run the focused test and let `.husky/pre-push` execute:

```sh
corepack npm run gate:push
```

Before merge, release, or a completion claim, run:

```sh
corepack npm run validate
```

`gate:push` covers formatting, localized asset drift, zero-warning lint, TypeScript 7 plus
TypeScript 6 compatibility, coverage, production build, dead code, cycles, and runtime audit.
`validate` adds the full Playwright discovery set (E2E, accessibility, and visual) plus Trivy.
Do not duplicate or replace these composites with a hand-maintained command list.

For a dependency change, also run `corepack npm run deps:check` and inspect
`corepack npm run deps:check:all`; every compatibility hold needs a recorded decision.

## Visual baseline changes

Ordinary validation is compare-only. Only after confirming an intentional visual change:

```sh
corepack npm run test:e2e:baseline
```

Review every changed current-OS PNG, record its reviewer, then rerun `validate`. Never update
snapshots merely to silence a failure. A missing platform baseline is a separate reviewed baseline
change, not first-run setup.

## Release evidence

Record:

- branch, commit SHA, date, clean `git status`, Node/npm versions;
- `gate:push` and `validate` exit results; test counts, all coverage dimensions, generated-page
  count, and Playwright project/OS;
- audit and Trivy finding counts; changed baseline files and reviewer, or `none`;
- exception links, manual accessibility and smoke-test results, release-checklist result;
- green GitHub CI, E2E, and Security run URLs.

Confirm conventional commits and hooks passed. For PR delivery, complete the review checklist; for
direct `main`, retain explicit owner authorization. Anything red, skipped, unreviewed, or
unexplained means the work is not done.
