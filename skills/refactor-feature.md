# Skill: Refactor a Feature (Move Code Between Layers Safely)

Use this when code sits in the wrong layer — logic in a component, fetching in a container, React
in a service — or when a module needs restructuring. The layer contract is
[rules/01-next-app-router-architecture.md](../rules/01-next-app-router-architecture.md); the
enforcement table is `eslint/architecture.config.mjs` (`layerPolicies`). The articles module
(`src/modules/articles/`) is the reference anatomy for where each kind of code belongs.

## Doctrine

- **Tests first.** Never move code that has no characterization test. If coverage is missing,
  write it against the _current_ behavior before touching anything
  ([skills/write-unit-tests.md](write-unit-tests.md)).
- **One layer at a time.** Each move is one commit: extract, re-point imports, run the gates.
  Never combine "move service logic out of a hook" with "rename the mapper" in one change.
- **Public surface stays stable.** Other modules import only `@/modules/<feature>` (the module's
  `index.ts`); deep imports are blocked by
  [docs/eslint/no-cross-module-deep-imports.md](../docs/eslint/no-cross-module-deep-imports.md).
  As long as `index.ts` re-exports the same names with the same types, internal moves are
  invisible to the rest of the app. If the refactor must change the public surface, do that as
  its own final step with every consumer updated in the same commit.

## Steps

1. **Map the current shape.** List the files involved and their layers
   (`api/ gateway/ services/ queries/ store/ containers/ components/ hooks/ utils/ helpers/
mappers/ schemas/ types/ enums/ constants/`). Run `npm run lint` and note which architecture
   rules already fire — those are the target defects.
2. **Lock in behavior.** Run the module's scoped tests and record the baseline:

   ```sh
   npx vitest run src/modules/<feature>
   ```

   Add missing tests for the code paths you are about to move (100% is required for
   utils/helpers/mappers/schemas/query-key builders per `vitest.config.mts`).

3. **Move downward first.** Extract pure logic to `utils/`/`helpers/`/`mappers/` (React-free by
   policy), wire translation to `mappers/`, HTTP calls to `gateway/`, use-case orchestration to
   `services/`. Each extraction: create the new file with its test, re-point the old call site,
   delete the dead original, run the scoped tests.
4. **Then fix the React layers.** Hooks absorb orchestration from containers; containers keep
   only hook-to-component wiring and the `.map()` to children; components end up TSX-only. The
   architecture rules (`no-hooks-in-components`, `no-inline-component-logic`,
   `no-restricted-layer-imports`) confirm each step — a clean `npm run lint` per commit is the
   proof the layer move is complete.
5. **Re-check the seams.** After the last move:

   ```sh
   npm run quality:circular   # dependency-cruiser: no cycles from re-pointed imports
   npm run quality:dead-code  # knip: nothing orphaned by the moves
   ```

6. **Run the full gates** before opening the PR:

   ```sh
   npm run quality            # lint + typecheck + test:coverage + build
   ```

   For refactors touching routes or user flows, also `npm run test:e2e` and `npm run test:visual`
   — a refactor MUST be pixel-identical unless the PR says otherwise.

## Done when

Behavior tests pass unchanged against the new structure, the module's `index.ts` diff is empty
(or its change is an explicit, final commit), no architecture rule fires, and dependency-cruiser/knip report
no new cycles or dead code.
