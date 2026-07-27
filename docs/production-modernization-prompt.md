# Production modernization master prompt

Replace the bracketed values, then give this prompt to a coding agent at the workspace root. Keep
the branch policy explicit: direct `main` work is appropriate only when the repository owner has
authorized it.

## Copyable prompt

```text
Modernize every repository in this workspace into a production-ready, AI-efficient engineering
baseline. Work on repositories in parallel when their files and commands are independent.

Context
- Repositories: [LIST REPOSITORIES AND PURPOSES]
- Authorized branch per repository: [BRANCH, FOR EXAMPLE main]
- Deployment targets: [WEB / CAPACITOR iOS+ANDROID / API / WORKER]
- Production URLs/environments and deployment trigger per branch: [LIST]
- Rollback mechanism, release owner, health checks, and observability links: [LIST]
- Data stores and migration constraints: [LIST]
- Brand, audience, conversion goal: [BRAND CONTEXT]
- Required locales: English, Arabic, French, Italian, German, Hindi, Persian, Thai, Japanese,
  Simplified Chinese, Spanish, Portuguese, Korean, and Turkish, unless an existing product contract
  defines a larger set.
- Non-negotiable integrations or compatibility constraints: [LIST]

Operating rules
1. Read each repository's AGENTS.md and local instructions before changing it. Preserve unrelated
   user work and never use destructive Git commands.
2. Inspect the current branch, working tree, remotes, open pull requests, required checks, dependency
   graph, lockfiles, runtime versions, build, tests, and deployment configuration. Identify conflict
   markers and lockfile failures, but modify only authorized scope. Preserve unrelated work and stop
   on unsafe overlaps. Resolve manifest conflicts first, then regenerate each authoritative lockfile
   with its pinned package manager; never introduce a competing lockfile.
3. Do not infer missing branch authorization. If direct work on main is authorized, keep main
   releasable. Otherwise use the named branch. For an authorized non-main branch, create or update
   its existing pull request, avoid duplicates, monitor checks for each candidate head SHA, and
   never merge without explicit authorization.
4. Split work into the smallest coherent, independently revertible conventional commits. Run the
   focused deterministic check and inspect the staged diff before committing. Before every push,
   determine whether the branch auto-deploys. An auto-deploying production branch requires the
   complete deploy-blocking local gate; otherwise push each green checkpoint promptly to the
   authorized non-production branch. Preserve a tested rollback path, verify post-deploy health, and
   use backward-compatible expand/contract data migrations. Never bypass hooks, force-push, publish
   known-red work, or perform destructive data migration without explicit authorization.
5. Make evidence-based assumptions that stay inside scope. Ask only when a decision is irreversible,
   requires secrets, changes product behavior materially, or expands authority.

Package and compiler modernization
- Use primary registry/release documentation to identify current stable versions. Upgrade every
  compatible runtime dependency, development dependency, GitHub Action, and tool. Regenerate the
  lockfile with the repository's pinned package manager and prove a clean immutable install.
- Pin one supported Node runtime and exact package-manager version through Corepack or the project's
  equivalent. Keep local, CI, hooks, containers, and deployment builds identical.
- Use stable TypeScript 7 as the primary build and typecheck compiler where the ecosystem supports
  it. If ESLint or another tool still consumes a TypeScript 6 compiler API, keep a narrowly named
  compatibility alias and test both paths. Remove it when upstream support lands.
- Before any major upgrade, inspect peer ranges. Never use --force, --legacy-peer-deps, broad
  overrides, or hidden warnings. If the newest major is peer-blocked, stay on the newest valid line,
  record the exact blockers and exit condition, and keep the held majors visible in a drift command.
- Treat dependency install scripts as supply-chain capabilities: fail closed, approve only reviewed
  packages, pin approved versions, explicitly deny nonessential scripts, and audit new entries.
- Pin third-party GitHub Actions to reviewed full commit SHAs with readable version comments, review
  permission changes, and enforce least-privilege workflow permissions.
- Run a zero-finding runtime audit and a pinned filesystem vulnerability, secret, and
  misconfiguration scanner. Require zero unreviewed actionable findings; an unavoidable finding
  needs owner-approved, expiring risk acceptance, compensating controls, and an exit condition.
  Document every narrow transitive override and remove stale overrides.

Strict code and architecture
- Enable every applicable maintained ESLint strict, typed, framework, React/hooks, accessibility,
  import, promise, regexp, security, complexity, testing, and Playwright rule as error. Resolve
  conflicts deliberately; do not enable removed, mutually exclusive, or factually inapplicable
  rules. Enforce --max-warnings=0 and add a configuration test that rejects warning severities.
- Use the strictest maintainable TypeScript settings, including strict null checks, exact optional
  properties, unchecked indexed access, safe catch variables, override checks, and no unused code.
- Keep routes/controllers thin. Separate presentational components, containers, hooks, services,
  gateways, schemas, mappers, types, constants, and tests. Enforce one-way layer dependencies,
  public module entrypoints, no circular imports, and no cross-feature deep imports.
- Give each third-party library one owning adapter. Prohibit raw vendor imports outside that owner.
  Centralize environment access, logging, storage, browser APIs, HTTP errors, query keys, and
  validation. Never add blanket lint disables; a necessary exception must be narrow, justified,
  owned, dated, and expiring.
- Prefer small named pure functions and typed view models. A fresh junior should understand the
  happy path; a CTO should be able to audit boundaries and tradeoffs without reverse-engineering
  spaghetti.

Frontend design system and experience
- Establish semantic design tokens for color, typography, spacing, radii, elevation, motion,
  breakpoints, safe areas, light/dark themes, focus, hover, disabled, error, and success states.
- Create an importable UI module with production-ready Button, IconButton, Link, Input, Textarea,
  Select/Dropdown, Checkbox, Radio, Switch, Label, FormField, Card, Badge, Alert, Toast, Dialog,
  Skeleton, Spinner, Divider, Stack, Container, and PageHeader primitives as the product needs.
  Components must be typed, accessible, documented, and reused rather than redefined per screen.
- Create reusable application-shell modules: responsive navbar, mobile navigation, collapsible
  sidebar, breadcrumbs, footer, theme control, and language switcher. Support keyboard navigation,
  visible focus, reduced motion, screen readers, touch targets, safe-area insets, narrow phones,
  tablets, desktops, zoom, long translations, dark mode, LTR, and RTL.
- Redesign the welcome/landing experience with a distinctive brand direction, strong hero,
  credible proof, feature storytelling, objection handling, calls to action, and polished empty,
  loading, error, offline, and success states. Avoid generic template styling and decorative noise.
- Define a 100-point marketing/sales rubric covering value-proposition clarity, audience fit,
  proof, differentiation, objections, CTA hierarchy, trust, and content usefulness. Require at
  least 98 with evidence and no weak category; do not award subjective “9.8/10” claims without
  concrete page-level findings. Give logos and brand marks accessible names or appropriate alt text.
- For Capacitor, verify native status/navigation bars, safe areas, keyboard behavior, back
  navigation, deep links, offline transitions, install/update behavior, and iOS/Android builds.
- For Next.js, preserve Server Component boundaries, static generation, streaming, image/font
  optimization, route typing, and minimal client JavaScript.

Internationalization, discovery, and PWA
- Make every human page locale-prefixed. Greenfield URL identifiers default to `en`, `ar`, `fr`,
  `it`, `de`, `hi`, `fa`, `th`, `ja`, `zh`, `es`, `pt`, `ko`, and `tr`. In an already-deployed
  product, preserve canonical locale slugs or ship permanent redirects and reciprocal SEO during a
  deliberate migration; use precise BCP 47 hreflang such as `zh-CN` for Simplified Chinese. A
  language switcher must navigate to the equivalent localized URL, not merely swap client text.
  Redirect an unprefixed entry safely and reject unsupported locales. Generate locale routes from
  one typed source of truth.
- Keep one complete catalog per locale with automated key, shape, placeholder, and plural parity.
  Use meaningful translations; do not ship English copies as fake translations. Treat Arabic and
  Persian as RTL and verify mirrored layout, mixed-direction content, numbers, controls, and icons.
- Build indexable localized home, features, about, FAQ, and contact pages. The production contact
  path must work end to end through an explicitly configured provider or owned backend, with client
  and server validation, accessible pending/success/failure states, rate limiting and anti-abuse
  controls, privacy handling, observable delivery failures, and honest responses. Never report
  success unless delivery was accepted.
- Give every public locale/page unique useful title, description, canonical URL, reciprocal
  hreflang alternates, Open Graph/Twitter data, meaningful social-image alt text, semantic headings,
  image alt text, and appropriate JSON-LD. Keep private, auth, workbench, offline, and API routes
  noindex/disallowed.
- Generate robots.txt for relevant crawlers and a deterministic sitemap.xml containing every
  public page in every locale, with no private routes. Test counts, canonical consistency,
  alternates, structured data, metadata fallbacks, and the production site origin.
- Treat robots directives as crawler hints, never access control. Enforce authentication and
  authorization on every private route, keep private content out of public caches and sitemaps, and
  use appropriate `X-Robots-Tag` or metadata in addition to robots.txt.
- Make the app installable: validated web manifest, complete icons, theme/background colors,
  service-worker registration, versioned cache policy, safe update behavior, and a localized
  offline page. Never cache secrets or authenticated responses accidentally.
- Add Lighthouse CI or an equivalent reproducible audit. Require SEO 100 and define demanding,
  evidence-based accessibility, best-practices, and performance budgets. “SEO 10/10” means passing
  measurable technical gates; do not promise search ranking.

Low-token AI operating system
- Create one canonical AGENTS.md and thin tool-specific entrypoints only where needed. Add a compact
  .ai/BOOTSTRAP.md and task-to-context manifest so an agent loads only the rule, skill, example, and
  owned files required for the current task.
- Organize concise rules/, skills/, context/, memory/, ADRs, testing standards, release runbooks,
  and exception records. Store mutable facts in code/constants and link to them; never duplicate
  locale lists, routes, commands, versions, or architecture facts across prompts.
- Add task skills for common vertical slices, dependency upgrades, i18n copy, routes, tests,
  security review, accessibility review, and final validation. RED-test each skill with a fresh
  agent, rewrite ambiguity, then GREEN-test it. Keep examples canonical and remove stale commands.
- Include an architecture map, package-ownership map, design-system inventory, localization/SEO
  map, command map, and known pitfalls. Measure context size and prefer routing plus links over
  giant always-loaded documents.

Verification and gates
- Make local composites and GitHub workflows invoke the same pinned commands. Add conventional
  commit, staged formatting/lint, and complete pre-push hooks; never hide warnings.
- Required proof, adapted to the repository: immutable install; format check; zero-warning lint;
  TypeScript 7 and compatibility typecheck; unit/integration coverage; production build; dead-code
  and dependency-cycle checks; runtime audit; pinned security scan; E2E; accessibility/axe;
  reviewed visual regression; SEO/metadata/sitemap/robots checks; PWA/offline checks; and native
  Capacitor builds where applicable.
- Test pure helpers at 100% and set a high global coverage floor without excluding difficult product
  code. Test keyboard use, reduced motion, dark mode, RTL, responsive layouts, crawler visibility,
  locale parity, security headers, and failure states.
- Run browser verification against the production build. Review screenshots rather than blindly
  updating baselines. Treat flaky tests as failures.

Deliverables
- Push a sequence of small conventional commits to each authorized branch.
- Report commit SHAs, remote branch, clean working tree, open/merged PR state, compatible package
  drift, documented version holds, and lockfile integrity.
- Report exact gate results with test counts, coverage, generated route/sitemap counts, build output,
  audit/security findings, browser/native coverage, and GitHub run links.
- Provide a concise before/after architecture and UX summary, reusable component inventory,
  locale/public-page matrix, AI-context routing map, screenshots where useful, and any remaining
  risks or decisions requiring my authority.

Do not claim completion until local gates and required remote checks are green. Continue fixing
in-scope failures autonomously and keep commits/pushes frequent throughout the work.
```
