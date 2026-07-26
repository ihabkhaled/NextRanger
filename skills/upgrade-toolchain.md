# Skill: Upgrade Dependencies and Compiler Tooling

## Read first

- [rules/10-eslint-typescript.md](../rules/10-eslint-typescript.md)
- [context/stack-and-toolchain.md](../context/stack-and-toolchain.md)
- [memory/known-pitfalls.md](../memory/known-pitfalls.md)

## Procedure

1. Start clean: record `git status`, Node/npm versions, `npm outdated`, and the audit report.
2. Upgrade compatible packages deliberately. Read peer ranges before a major; never use
   `--force` or hide a finding. Refresh the lockfile with the chosen ranges.
3. Preserve the compiler split exactly:
   - `@typescript/native: npm:typescript@^7.0.2` runs primary app/test/node checks.
   - `typescript: npm:@typescript/typescript6@^6.0.2` supplies the ESLint/tooling API.
   - `npm run compiler:versions` and `src/tests/unit/toolchain-contract.test.ts` prove the wiring.
4. Keep `npm run lint` and `lint:fix` at `--max-warnings=0` plus `lint:severity`; enabled rules
   must resolve to `error`, never `warn`.
5. Update package ownership/config only when the dependency changed. Use dependency-cruiser for
   cycle/unresolvable checks; do not reintroduce madge.
6. Update `package.json`, lockfile, stack/toolchain context, CI labels, pitfalls, and command docs
   in the same change. Search for removed package names and old command names.

## Validation

```bash
npm run lint
npm run typecheck
npm run typecheck:compat
npm run test -- src/tests/unit/toolchain-contract.test.ts
npm run security:audit
npm run quality:dead-code
npm run quality:circular
npm run build
```

Finish with the full [final-validation skill](./final-validation.md). A major upgrade is incomplete
if only installation succeeds.
