# Architecture Decision Records (ADRs)

ADRs are the permanent memory of _why_ strict-next-ranger is built the way it is. Rules in
[rules/](../../rules/README.md) say what to do; ADRs record the decision that made the rule exist.

## Index

| ADR                                                | Title                                                                                                                     | Status   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| [adr-template.md](adr-template.md)                 | Template for new ADRs                                                                                                     | —        |
| [0001](0001-strict-next-architecture.md)           | Strict Next.js frontend architecture (module-first, TSX-only components, owner wrappers, ESLint enforcement, BFF gateway) | Accepted |
| [0002](0002-component-workbench-over-storybook.md) | Component workbench route instead of Storybook                                                                            | Accepted |

## When an ADR is required

You MUST write an ADR before merging any change that:

- Adds, removes, or replaces a third-party runtime dependency (each vendor gets exactly one
  owning wrapper under `src/packages/` — see [rules/09-library-wrapping.md](../../rules/09-library-wrapping.md)).
- Changes a layer boundary or import policy enforced by
  [eslint/architecture.config.mjs](../../eslint/architecture.config.mjs) or
  [eslint/package-boundaries.config.mjs](../../eslint/package-boundaries.config.mjs).
- Changes a release gate, coverage threshold, or security baseline
  (see [rules/19-release-gates.md](../../rules/19-release-gates.md)).
- Reverses or amends a previous ADR.

Small, reversible choices (naming inside one module, a local refactor) do NOT need an ADR.
One-off deviations from an existing rule are not ADRs either — those go through
[docs/exceptions/](../../docs/exceptions/README.md).

## Numbering and lifecycle

- Numbers are four-digit, zero-padded, strictly sequential: the next ADR is `0003-<kebab-slug>.md`.
  Never reuse or renumber.
- Every ADR MUST carry a `Status` field with one of: **Proposed**, **Accepted**, **Deprecated**,
  **Superseded by ADR-XXXX**.
- ADRs are immutable once Accepted. To change course, write a new ADR that supersedes the old
  one and update the old ADR's status line — never rewrite its content.
- An ADR is Accepted when it merges to `main` after review by the maintainers of the affected
  area (see [agents/frontend-architect.md](../../agents/frontend-architect.md) for the review lens).

## Writing a new ADR

1. Copy [adr-template.md](adr-template.md) to `architecture/adrs/NNNN-<slug>.md`.
2. Fill every section; delete none. "Alternatives considered" with honest trade-offs is mandatory.
3. Add the ADR to the index table above in the same pull request.
4. If the decision changes an enforced rule, update the matching file under
   [rules/](../../rules/README.md) and the ESLint config in the same pull request so docs and
   machine enforcement never drift apart.
