# Context

Orientation documents for strict-next-ranger. Read these before touching code: they describe
what the repository is, where everything lives, and which words mean what. They are descriptive
companions to the normative rules in [rules/](../rules/README.md) — when a rule and a context
document disagree, the rule wins and the context document has a bug.

## Contents

| Document                                           | Purpose                                                                                                                                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [architecture-map.md](./architecture-map.md)       | The canonical map: annotated `src/` tree, the one-way layer dependency diagram, and the import policy table enforced by [eslint/architecture.config.mjs](../eslint/architecture.config.mjs). |
| [stack-and-toolchain.md](./stack-and-toolchain.md) | Every dependency in [package.json](../package.json): version, why it was chosen, and which wrapper owns it.                                                                                  |
| [codebase-navigation.md](./codebase-navigation.md) | Task-to-location lookup ("where do I put X"), file-suffix naming conventions, and the TypeScript path alias map.                                                                             |
| [package-boundaries.md](./package-boundaries.md)   | The vendor → owner wrapper → exports table mirroring [eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs), plus the procedure for adding a new vendor.            |
| [reference-patterns.md](./reference-patterns.md)   | Canonical code excerpts quoted from the real modules: component/container split, query-key builder, gateway→mapper→service chain, store, form, toast, error mapping.                         |
| [glossary.md](./glossary.md)                       | Definitions of repo-specific terms: module, layer, owner wrapper, view model, wire type, BFF gateway, gate, exception, and more.                                                             |

## How to use this folder

1. New to the repo? Read [architecture-map.md](./architecture-map.md) first, then
   [codebase-navigation.md](./codebase-navigation.md).
2. About to import a third-party package? Check [package-boundaries.md](./package-boundaries.md)
   before writing the import.
3. About to write a new file? Copy the closest excerpt in
   [reference-patterns.md](./reference-patterns.md) and follow the matching skill in
   [skills/README.md](../skills/README.md).
4. Confused by a term in a review comment? Look it up in [glossary.md](./glossary.md).

These documents MUST be kept in sync with the code. A pull request that moves a directory,
adds a vendor, or renames an alias and does not update the matching context document fails
review per [rules/20-review-checklist.md](../rules/20-review-checklist.md).
