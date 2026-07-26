# Design System Map

Import low-level primitives from the single public surface:

```ts
import { Badge, Button, Card, Input, Select, Textarea } from '@/packages/ui-primitives';
```

| Need            | Existing building block                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| Action          | `Button` (`primary`, `secondary`, `ghost`, `danger`, `soft`; `default`, `sm`, `lg`, `icon`) |
| Status or label | `Badge` (`neutral`, `brand`, `success`, `warning`, `danger`)                                |
| Grouped surface | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`           |
| Form controls   | `Label`, `Input`, `Select`, `Textarea`; compose with shared `FormField`                     |
| Layout rhythm   | `PageContainer`, `Stack`, `Divider`                                                         |
| Feedback        | `Alert`, `Skeleton`, `Spinner`; shared `LoadingState`, `EmptyState`, `ErrorState`           |
| Page chrome     | shared `AppHeader`, `PageHeader`, `SkipLink`, `VisuallyHidden`                              |

## Ownership decision

- Add a primitive only when it is product-agnostic and reused across modules. Keep raw Tailwind
  classes and CVA definitions inside `src/packages/ui-primitives`.
- Add a shared component when it composes primitives into a reusable application pattern. Put
  classes in its adjacent `.variants.ts` file.
- Add feature UI under `src/modules/<feature>/components`; it must be TSX-only. Put behavior in a
  hook/container and styles in `constants/*-style.constants.ts` or `.variants.ts`.
- Add route-only composition in `src/app`; do not move feature behavior into the route.

Before creating UI, inspect this map and `/workbench`. Extend an existing variant when semantics
match. Every new interactive primitive needs a keyboard/focus contract, an accessible name, tests,
dark-theme tokens, RTL-safe logical spacing, and a workbench example.
