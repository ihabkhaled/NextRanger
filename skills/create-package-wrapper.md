# Skill: Create a Package Wrapper

Use this skill when the team approves a new third-party dependency. Every vendor gets exactly
one owning wrapper under `src/packages/<vendor>/` — app code never imports the raw package.
The rule that enforces this is `no-raw-package-imports` (see
[docs/eslint/no-raw-package-imports.md](../docs/eslint/no-raw-package-imports.md)); the doctrine
is [rules/09-library-wrapping.md](../rules/09-library-wrapping.md).

## Steps

1. **Record the decision first.** Add an entry to
   [memory/package-decisions.md](../memory/package-decisions.md): what the package does, why the
   existing wrappers cannot cover it, and what the facade will expose.
2. **Install the package** with an exact-range-friendly npm install, then run
   `npm run security:audit` and `npm run security:scan`. A new dependency that introduces an
   unhandled vulnerability MUST NOT land; fix it via an `overrides` entry in `package.json`
   (the `postcss` override there is the reference example) or pick another package.
3. **Create the owner directory** `src/packages/<name>/` where `<name>` describes the
   capability, not the vendor: dayjs lives in `src/packages/date/`, sonner in
   `src/packages/toast/`, react-virtuoso in `src/packages/virtuoso/`. This keeps a future
   vendor swap invisible to app code.
4. **Design the facade, not a re-export.** The wrapper MUST expose app-shaped functions and
   components with our naming (`showToast`, `formatDisplayDate`, `VirtualizedList`) and MUST
   hide vendor option objects behind narrow prop/param types. Study
   `src/packages/toast/index.ts` and `src/packages/virtuoso/virtualized-list.tsx` as the
   canonical shapes. Rules:
   - `index.ts` is the only public surface; export named symbols and their types.
   - Client-only wrappers start with `'use client'` plus a
     `// client-boundary-reason: …` comment (see `src/packages/virtuoso/virtualized-list.tsx`).
   - Never leak vendor types through the facade signature unless the type is the product
     (as with `z` from `src/packages/zod`).
5. **Register the boundary.** Add one line to the `packageBoundaries` array in
   `eslint/package-boundaries.config.mjs`:

   ```js
   { package: 'some-vendor', owners: ['src/packages/<name>/'] },
   ```

   For Next.js built-in module specifiers use `matchSubpaths: false` as done for
   `next/link` and `next/navigation`. From this moment, importing the vendor anywhere else
   fails `npm run lint` (which runs with `--max-warnings=0`).

6. **Update the human-readable twin.** `eslint/package-boundaries.config.mjs` states in its
   header comment that it must move in lockstep with
   [context/package-boundaries.md](../context/package-boundaries.md). Add the vendor, wrapper
   path, and key exports there in the same commit.
7. **Write unit tests** in a `*.test.ts` file colocated per the testing standard
   ([skills/write-unit-tests.md](write-unit-tests.md)). Wrappers under `src/packages/**` are
   inside the 95% coverage gate in `vitest.config.mts`; pure helper logic inside the wrapper
   MUST hit 100%. Test the facade contract (inputs → outputs, error normalization), never
   vendor internals.
8. **Verify the fence.** Temporarily import the raw vendor from a module file and confirm
   `npm run lint` fails with `frontend-architecture-boundaries/no-raw-package-imports`, then
   revert. Finish with `npm run quality` and `npm run quality:dead-code` (knip flags unused
   facade exports — export only what callers need today).

## Definition of done

- Wrapper directory with `index.ts` public surface and tests.
- Boundary line in `eslint/package-boundaries.config.mjs` and matching row in
  [context/package-boundaries.md](../context/package-boundaries.md).
- Decision recorded in [memory/package-decisions.md](../memory/package-decisions.md).
- `npm run validate` green.
