# Pull Request

## What and why

<!-- What changes, and what problem they solve. Link the feature doc under docs/features/ if one exists. -->

## Change type

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Docs / rules / skills
- [ ] Tooling / CI

## Architecture checklist (rules/20-review-checklist.md has the full version)

- [ ] Components stayed TSX-only; new behavior lives in hooks/containers
- [ ] No new magic strings (routes, keys, copy, test ids are constants/builders)
- [ ] New vendor imports go through an owner wrapper (`src/packages/`)
- [ ] Cross-module imports use public surfaces only (`@/modules/<feature>`)
- [ ] User-facing copy added to BOTH `en.json` and `ar.json`
- [ ] No `eslint-disable` / `@ts-expect-error` without a doc in `docs/exceptions/`

## Test evidence

- [ ] Unit/integration tests added or updated (TDD: written first)
- [ ] `npm run test:coverage` passes locally
- [ ] E2E/a11y/visual updated if user-visible behavior changed

## Gates

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
