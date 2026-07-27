# AI bootstrap

Use this entrypoint to minimize context. Do not preload every document.

1. Read [AGENTS.md](../AGENTS.md).
2. Select one task from [context-manifest.json](./context-manifest.json).
3. Read only that task's rule, skill, and canonical example.
4. Inspect the owned files, state acceptance checks, then work test-first.
5. Run the focused gate. Commit the coherent green change and push it promptly.
6. Run `npm run gate:push` before the final push; never bypass hooks.

Mutable facts belong in code, not prompts:

- locales and direction: `src/packages/i18n/locale.constants.ts`
- app paths: `src/shared/constants/route-paths.constants.ts`
- crawl visibility: `src/shared/constants/seo.constants.ts`
- reusable UI: `context/design-system-map.md`
- commands and package versions: `package.json`

Record durable decisions in `memory/`; update a rule or skill only when its contract changes.
Task narration, copied source, and generic framework advice do not belong in permanent context.
