# 09 — Performance Review

> Run against the finished code by [agents/react-performance-reviewer.md](../../../agents/react-performance-reviewer.md) or a human reviewer following [skills/performance-review.md](../../../skills/performance-review.md). Norms are defined in [rules/12-performance.md](../../../rules/12-performance.md).

## Review scope

- **Code reviewed:** <branch/commit>
- **Reviewer:** <name / agent>
- **Date:** <YYYY-MM-DD>

## Checklist (per skills/performance-review.md)

### Server/client boundary

- [ ] Client boundaries are as low as possible; every `'use client'` file has a justified `// client-boundary-reason:` comment and nothing above it was made client unnecessarily. <Findings.>
- [ ] No server-only work (data fetching, heavy computation) moved into the client where a server component could do it. <Findings.>

### Rendering

- [ ] Components are TSX-only (enforced by docs/eslint/no-inline-component-logic.md and docs/eslint/no-inline-declarations.md), so no per-render closures or object literals leak into hot paths. <Confirm.>
- [ ] Lists over the threshold agreed in stage 02 use `VirtualizedList` (src/packages/virtuoso) per [skills/add-virtualized-list.md](../../../skills/add-virtualized-list.md). <Findings.>
- [ ] Zustand selectors are narrow; multi-field reads use `useAppStoreShallow` (src/packages/zustand) to avoid over-subscription. <Findings.>

### Data fetching

- [ ] Query keys come from the module's keys builder; caching, staleTime, and invalidation scope reviewed (invalidations target the narrowest key, as `invalidateArticleLists` does in src/modules/articles/queries/article.invalidate.ts). <Findings.>
- [ ] No request waterfalls a single query or parallel queries could avoid; suspense boundaries via `useAppSuspenseQuery` where appropriate. <Findings.>

### Assets and bundle

- [ ] Images go through `AppImage` (src/packages/image) with proper sizing. <Findings.>
- [ ] Fonts unchanged (interFont via src/shared/fonts/app-fonts.ts) or changes justified. <Confirm.>
- [ ] `npm run build` output reviewed: no unexpected growth in the route's first-load JS. <Record numbers below.>

## Measurements

| Metric                                                     | Before  | After   | Budget   | Pass? |
| ---------------------------------------------------------- | ------- | ------- | -------- | ----- |
| Route first-load JS (`npm run build` output)               | <kB>    | <kB>    | <kB>     | <y/n> |
| <interaction latency / LCP on the new screen, if measured> | <value> | <value> | <budget> | <y/n> |

## Findings register

| #   | Severity          | Finding   | Resolution                                    |
| --- | ----------------- | --------- | --------------------------------------------- |
| 1   | <high/medium/low> | <finding> | <fixed in <commit> / accepted with rationale> |

## Gate

- [ ] No unresolved high-severity finding
- [ ] Build-size numbers recorded and within budget
- [ ] Deliberate trade-offs recorded (and mirrored to memory/performance-decisions.md if durable)

**Signed off by:** <name> — <YYYY-MM-DD>
