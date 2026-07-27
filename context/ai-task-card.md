# AI Task Card

Use this page after [architecture-map.md](./architecture-map.md). Load only the row that matches
the task, then open the linked rule and skill. Do not scan the whole repository to rediscover a
contract documented here.

| Task               | Work in                                                   | Read                                                      | First focused gate                |
| ------------------ | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------- |
| Page or route      | `src/app/[locale]/<group>/`                               | localization-and-seo-map + rules/01 + skills/add-route    | route unit/e2e test               |
| SEO, PWA, crawler  | metadata helpers + `src/app/{sitemap,robots,manifest}.ts` | localization-and-seo-map + rules/14                       | SEO unit/e2e test                 |
| Feature behavior   | `src/modules/<feature>/`                                  | rules/01–08 + skills/create-module                        | module test file                  |
| Reusable UI        | `src/packages/ui-primitives/` or `src/shared/components/` | [design-system-map.md](./design-system-map.md) + rules/02 | primitive/shared unit test        |
| Vendor integration | owning `src/packages/<vendor>/` facade                    | rules/09 + skills/create-package-wrapper                  | `npm run lint`                    |
| Copy, locale, RTL  | message catalogs + message-key constants                  | rules/14 + skills/add-i18n-message-key                    | i18n unit/e2e test                |
| Toolchain          | `package.json`, lockfile, configs                         | rules/10 + skills/upgrade-toolchain                       | lint + typecheck + toolchain test |
| Release proof      | no source changes                                         | rules/19 + rules/21 + skills/final-validation             | `npm run gate:push`               |
| AI context/docs    | `.ai/`, `context/`, matching rule or skill                | `.ai/BOOTSTRAP.md` + changed contract source              | links + focused contract grep     |

## Minimal execution loop

1. State the owned files and acceptance checks before editing.
2. Copy the closest pattern from [reference-patterns.md](./reference-patterns.md); use public
   imports and existing primitives.
3. Run the smallest relevant test, then lint and typecheck. Commit and push a coherent green
   checkpoint; expand to release gates before the final push.
4. Update the matching context/rule/skill only when the contract changed. Record durable traps in
   `memory/known-pitfalls.md`; do not write task narration into permanent docs.

## Stop conditions

Stop and re-route if a change needs a raw vendor import, cross-module deep import, inline user
copy/class bundle, hook in a component, browser/env access outside its owner package, or a disabled
rule. Those are architecture errors, not exceptions to work around.
