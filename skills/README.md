# Skills

Skills are the executable procedures of the strict-next-ranger operating system. Every skill follows
the same shape: read the governing rules first, plan tests first, execute numbered steps, run the
validation commands, and check the definition of done. If a task matches a row below, follow that
skill — do not improvise a parallel workflow.

Rules (the "what is allowed") live in [rules/README.md](../rules/README.md). Orientation material
(the "where things live") is in [context/codebase-navigation.md](../context/codebase-navigation.md).

## Routing table

| Task                                                        | Skill                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| Scaffold a new feature module under `src/modules/`          | [create-module.md](create-module.md)                         |
| Add a TSX-only presentational component                     | [create-component.md](create-component.md)                   |
| Add a client container that wires hooks to components       | [create-container.md](create-container.md)                   |
| Add a view-model or orchestration hook                      | [create-hook.md](create-hook.md)                             |
| Add a React-free service (gateway + mapper composition)     | [create-service.md](create-service.md)                       |
| Add a TanStack Query read (keys, options, hook)             | [create-query.md](create-query.md)                           |
| Add a mutation with cache invalidation or optimistic update | [create-mutation.md](create-mutation.md)                     |
| Add client global state with Zustand                        | [create-zustand-store.md](create-zustand-store.md)           |
| Wrap a new third-party package in `src/packages/`           | [create-package-wrapper.md](create-package-wrapper.md)       |
| Add a page or route handler under `src/app/`                | [add-route.md](add-route.md)                                 |
| Add translated copy across every supported catalog          | [add-i18n-message-key.md](add-i18n-message-key.md)           |
| Build a form with `useAppZodForm` and a Zod schema          | [add-form.md](add-form.md)                                   |
| Render a large list with `VirtualizedList`                  | [add-virtualized-list.md](add-virtualized-list.md)           |
| Write Vitest unit tests for module code                     | [write-unit-tests.md](write-unit-tests.md)                   |
| Write cross-module integration tests with MSW               | [write-integration-tests.md](write-integration-tests.md)     |
| Write Playwright end-to-end tests                           | [write-e2e-tests.md](write-e2e-tests.md)                     |
| Write axe-based accessibility tests                         | [write-accessibility-tests.md](write-accessibility-tests.md) |
| Write Playwright visual regression tests                    | [write-visual-tests.md](write-visual-tests.md)               |
| Review a change for security issues                         | [security-review.md](security-review.md)                     |
| Review a change for rendering/bundle performance            | [performance-review.md](performance-review.md)               |
| Review a change for accessibility                           | [accessibility-review.md](accessibility-review.md)           |
| Restructure an existing feature to match the architecture   | [refactor-feature.md](refactor-feature.md)                   |
| Resolve ESLint or typecheck failures correctly              | [fix-eslint-typecheck.md](fix-eslint-typecheck.md)           |
| Upgrade dependencies or compiler tooling                    | [upgrade-toolchain.md](upgrade-toolchain.md)                 |
| Run the full quality gate before merge/release              | [final-validation.md](final-validation.md)                   |

## How to use a skill

1. Open the skill and read its "Read first" links before touching code.
2. Follow the steps in order; each step names the exact file paths and exports involved.
3. Run every command in the skill's validation section — all must pass with zero warnings.
4. Only claim the task done when every item in the definition of done is true.

Skills never grant exceptions. If a step seems impossible without breaking a rule, stop and follow
the exception process in [docs/exceptions/README.md](../docs/exceptions/README.md) instead of
working around the guardrail.
