# Company SDLC Policy

Every feature moves through the lifecycle below. Each stage produces the corresponding phase document from [docs/features/_template](../features/_template/00-intake.md), copied into `docs/features/<feature-slug>/`. A stage MUST NOT start until the previous stage's exit criteria are met, and a feature MUST NOT ship with any phase document missing.

## Roles

- **Product owner** — owns intake, requirements, UAT sign-off.
- **Feature engineer** — owns implementation, tests, and phase docs 04, 06, 07.
- **Frontend architect** — owns architecture review (see [agents/frontend-architect.md](../../agents/frontend-architect.md)); approves module/layer decisions.
- **Reviewers** — security, performance, accessibility, i18n/RTL reviewers per [agents/README.md](../../agents/README.md).
- **Release gatekeeper** — owns release readiness and hypercare (see [agents/frontend-release-gatekeeper.md](../../agents/frontend-release-gatekeeper.md)).

## Stages

### 1. Intake — [00-intake.md](../features/_template/00-intake.md)

- Entry: a named problem and a requester.
- Exit: problem statement, initial risk class per [risk-baseline.md](./risk-baseline.md), go/no-go from the product owner.

### 2. Analysis — [01-business-analysis.md](../features/_template/01-business-analysis.md), [02-product-requirements.md](../features/_template/02-product-requirements.md), [03-ux-ui-analysis.md](../features/_template/03-ux-ui-analysis.md)

- Entry: intake approved.
- Exit: acceptance criteria written, UX states enumerated (loading / error / empty / ready, matching the container doctrine in [rules/02-components-and-containers.md](../../rules/02-components-and-containers.md)), all copy identified as i18n message keys for both `en` and `ar` including RTL impact.

### 3. Technical refinement — [04-technical-refinement.md](../features/_template/04-technical-refinement.md), [05-architecture-review.md](../features/_template/05-architecture-review.md)

- Entry: requirements signed off.
- Exit: target module and layers named (`src/modules/<feature>/` anatomy per [context/architecture-map.md](../../context/architecture-map.md)), new package wrappers identified per [rules/09-library-wrapping.md](../../rules/09-library-wrapping.md), architect approval recorded. Any architectural novelty MUST become an ADR under [architecture/adrs/README.md](../../architecture/adrs/README.md).

### 4. Test strategy — [06-test-strategy.md](../features/_template/06-test-strategy.md)

- Entry: architecture approved.
- Exit: test plan covering the levels in [testing/testing-strategy.md](../../testing/testing-strategy.md); coverage impact assessed against the thresholds in `vitest.config.mts` (95% global, 100% for utils/helpers/mappers/schemas/query-key builders).

### 5. Implementation — [07-implementation-plan.md](../features/_template/07-implementation-plan.md)

- Entry: test strategy approved; definition of ready met ([engineering-standards.md](./engineering-standards.md)).
- Exit: all PRs merged with green `npm run quality`; no undocumented `eslint-disable` or `@ts-expect-error` (see [docs/exceptions/README.md](../exceptions/README.md)).

### 6. Pre-release reviews — [08-security-review.md](../features/_template/08-security-review.md), [09-performance-review.md](../features/_template/09-performance-review.md), [10-accessibility-review.md](../features/_template/10-accessibility-review.md)

- Entry: implementation complete on `main`.
- Exit: each review doc completed by its reviewer; findings either fixed or filed as exceptions. Mandatory scope per review is defined in [skills/security-review.md](../../skills/security-review.md), [skills/performance-review.md](../../skills/performance-review.md), [skills/accessibility-review.md](../../skills/accessibility-review.md).

### 7. Release readiness — [11-release-readiness.md](../features/_template/11-release-readiness.md)

- Entry: all reviews closed; UAT exit criteria met ([uat-baseline.md](./uat-baseline.md)).
- Exit: [release-checklist.md](./release-checklist.md) executed end to end; release notes drafted from [release-notes/release-notes-template.md](../../release-notes/release-notes-template.md).

### 8. Hypercare — [12-hypercare.md](../features/_template/12-hypercare.md)

- Entry: feature in production.
- Exit: monitoring window closed with no unresolved Sev-1/Sev-2 incidents; support handover per [support/support-readiness-template.md](../../support/support-readiness-template.md).

### 9. Retrospective — [13-retrospective.md](../features/_template/13-retrospective.md)

- Entry: hypercare closed.
- Exit: lessons recorded; recurring pitfalls promoted into [memory/known-pitfalls.md](../../memory/known-pitfalls.md) per [documentation-baseline.md](./documentation-baseline.md).

## Fast track

Changes classified **Low** risk in [risk-baseline.md](./risk-baseline.md) (e.g. copy-only changes) may collapse stages 1–4 into a single intake note, but stages 5–7 gates always apply — `npm run validate` never has a fast track.
