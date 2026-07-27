# 03 — UX / UI Analysis

> Map every screen and interaction to the design system before writing components. Verify
> primitives at `/<locale>/workbench`
> (`src/app/[locale]/(workbench)/workbench/page.tsx`). See ADR 0002 for why there is no Storybook.

## Screens and entry points

| Screen        | Route                                                                              | New or existing | Notes                     |
| ------------- | ---------------------------------------------------------------------------------- | --------------- | ------------------------- |
| <screen name> | <path — must appear in ROUTE_PATHS, src/shared/constants/route-paths.constants.ts> | <new/existing>  | <navigation entry points> |

## Design references

- **Design files:** <link to Figma/spec, or "none — pattern-composed from existing primitives">
- **Closest existing pattern in-app:** <e.g. the articles list screen (src/modules/articles) or the settings screen (src/modules/ui-preferences)>

## Primitive inventory

<For each UI element, name the primitive from src/packages/ui-primitives (Button, Input, Label, Card, CardTitle, CardDescription, CardContent, Alert, Spinner, Skeleton, Stack, PageContainer) or the wrapper (AppLink, AppImage, VirtualizedList, showToast, *Icon from src/packages/icons). Anything not coverable is a design-system gap.>

| UI element | Primitive / wrapper | Gap?                   |
| ---------- | ------------------- | ---------------------- |
| <element>  | <e.g. Card + Stack> | <no / yes — see below> |

### Design-system gaps

<Each gap needs a decision: extend src/packages/ui-primitives (design-system change, own review), or compose in the module with a *.variants.ts class-bundle file per rules/02-components-and-containers.md. Raw inline className outside the design system is an ESLint error (docs/eslint/no-inline-classname-outside-design-system.md).>

- <gap → decision>

## Interaction and state design

- **Loading:** <Skeleton vs Spinner per view, matching stage 02's state table>
- **Feedback:** <toasts via showToast from src/packages/toast; inline Alert usage; form errors via field messages>
- **Empty state:** <copy intent and any illustration/action>
- **Focus behavior:** <where focus lands after navigation, submit, dialog open/close>

## Theming and direction

- **Dark theme:** <confirm every new visual works under [data-theme='dark'] — tokens live in src/app/styles.css; no hardcoded colors>
- **RTL:** <call out directional icons, alignment, or ordering that need logical properties or mirroring when dir='rtl' (Arabic). See rules/14-i18n-rtl.md.>

## Copy inventory

<List every user-visible string. Each becomes a message key in every catalog under
src/packages/i18n/messages/ during stage 04; raw JSX text is an ESLint error.>

| String (English draft) | Intended namespace                                                     | Notes                   |
| ---------------------- | ---------------------------------------------------------------------- | ----------------------- |
| <copy>                 | <one of I18N_NAMESPACES, src/shared/i18n/i18n-namespaces.constants.ts> | <plural/interpolation?> |

## Gate

- [ ] Every element mapped to a primitive or logged as a gap with a decision
- [ ] Dark theme and RTL impact reviewed
- [ ] Copy inventory complete with namespaces
- [ ] Focus behavior specified for every interaction

**Signed off by:** <name> — <YYYY-MM-DD>
