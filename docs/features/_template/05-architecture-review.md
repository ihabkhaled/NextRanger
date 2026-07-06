# 05 — Architecture Review

> An architect (human or [agents/frontend-architect.md](../../../agents/frontend-architect.md)) reviews the stage-04 plan against the architecture rules before implementation starts. The canonical references are [rules/01-next-app-router-architecture.md](../../../rules/01-next-app-router-architecture.md), the boundary map in [context/package-boundaries.md](../../../context/package-boundaries.md), and the layer policy table in eslint/architecture.config.mjs.

## Review inputs

- **Stage-04 document version reviewed:** <commit hash or date>
- **Reviewer:** <name / agent>

## Boundary checklist

- [ ] **App layer stays thin.** New files under src/app/ are routes, layouts, or route handlers only; all logic lands in the module. <Confirm or list violations.>
- [ ] **Module public surface.** Cross-module consumers import only `@/modules/<slug>`; no deep imports planned (docs/eslint/no-cross-module-deep-imports.md). <Confirm.>
- [ ] **Layer import direction.** The plan respects the policy table in eslint/architecture.config.mjs — components depend on nothing stateful, containers wire hooks to components, services/gateways are React-free (rules/04-services-api-gateway.md). <Confirm.>
- [ ] **Vendor ownership.** Every third-party dependency flows through its wrapper in src/packages/ per eslint/package-boundaries.config.mjs; no raw vendor imports planned (docs/eslint/no-raw-package-imports.md). <Confirm; list new wrappers.>
- [ ] **shared vs module placement.** Anything planned for src/shared/ is genuinely generic (used or plausibly usable by ≥2 modules); anything feature-specific stays in the module (rules/07-types-enums-constants.md). <Confirm.>
- [ ] **Server/client split.** Client components carry `'use client'` + a `// client-boundary-reason:` comment (docs/eslint/require-client-component-reason.md); nothing importing server-only code crosses into the client bundle (docs/eslint/no-server-only-import-in-client.md). <Confirm the planned boundary components.>
- [ ] **BFF discipline.** All network calls go same-origin through `/api/gateway/[...path]` using buildGatewayPath — no direct external hosts from the browser. <Confirm.>
- [ ] **State placement.** Server state lives in TanStack Query (rules/05-tanstack-query.md); only genuine client state gets a Zustand store (rules/06-zustand.md). <Confirm which is which for this feature.>

## Deviations requested

<Any deliberate deviation from the rules needs an exception filed per docs/exceptions/exception-template.md before it ships. List requested deviations here with the exception file path, or "none".>

| Deviation   | Justification | Exception file              |
| ----------- | ------------- | --------------------------- |
| <deviation> | <why>         | <docs/exceptions/<file>.md> |

## Architecture decisions taken

<Decisions of lasting consequence (new shared abstraction, new wrapper, new pattern) get an ADR under architecture/adrs/ using architecture/adrs/adr-template.md. List them, or "none".>

## Verdict

- **Outcome:** <approved | approved with conditions | rework stage 04>
- **Conditions:** <list, or "none">

## Gate

- [ ] All boundary checklist items confirmed or covered by a filed exception
- [ ] ADRs written for any lasting decisions
- [ ] Verdict recorded

**Signed off by:** <name> — <YYYY-MM-DD>
