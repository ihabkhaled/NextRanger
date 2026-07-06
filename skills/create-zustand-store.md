# Skill: Create a Zustand Store

Add true client global state to a module: a pure store built with `createAppStore`, a selectors
file, and — if the state must survive reloads or touch the DOM — a separate effects hook. Zustand
never holds server cache (TanStack Query's job), tokens, or anything derivable from props.

## Read first

- [rules/06-zustand.md](../rules/06-zustand.md)
- Reference: `src/modules/ui-preferences/store/` and
  `src/modules/ui-preferences/hooks/use-ui-preferences-effects.hook.ts`

## Steps

1. Confirm the state is genuinely client-global (theme, direction, sidebar, session snapshot).
   If it comes from the backend, stop and use [skills/create-query.md](create-query.md).
2. Define the state interface in `types/<feature>.types.ts`: readonly fields plus action
   signatures, and a plain snapshot type for the persistable subset (see `UiPreferencesState` /
   `UiPreferencesSnapshot` in `src/modules/ui-preferences/types/ui-preferences.types.ts`).
3. Create `src/modules/<feature>/store/<feature>.store.ts` with `createAppStore` from
   `@/packages/zustand` (never `zustand` directly). The store stays pure — no storage, no DOM,
   no async:

   ```ts
   export const useUiPreferencesStore = createAppStore<UiPreferencesState>()((set) => ({
     ...UI_PREFERENCES_DEFAULTS,
     hasHydrated: false,
     setTheme: (theme) => {
       set({ theme });
     },
     setDirection: (direction) => {
       set({ direction });
     },
     toggleSidebar: () => {
       set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded }));
     },
     hydrate: (snapshot: UiPreferencesSnapshot) => {
       set({ ...snapshot, hasHydrated: true });
     },
   }));
   ```

   Defaults live in `constants/<feature>.constants.ts`, never inline. If the store hydrates from
   storage, include `hasHydrated: false` and a `hydrate(snapshot)` action exactly as above.

4. Create `store/<feature>.selectors.ts` with named selector functions instead of ad-hoc inline
   selectors, e.g. `selectPreferencesSnapshot` in
   `src/modules/ui-preferences/store/ui-preferences.selectors.ts`. Consumers select single fields
   (`useStore((state) => state.theme)`) or use `useAppStoreShallow` from `@/packages/zustand` for
   multi-field selections — never subscribe to the whole store.
5. If the state persists or syncs to the DOM, add
   `hooks/use-<feature>-effects.hook.ts` modeled on `useUiPreferencesEffects`:
   - **Hydrate once**: guard on `hasHydrated`, read via `readStorageJson('local',
STORAGE_KEYS.<key>, <snapshot schema>)` from `@/packages/storage` (schema-validated — add the
     Zod schema in `schemas/`), and fall back to the current state via the snapshot selector.
   - **Mirror to the DOM**: `setRootAttribute` from `@/packages/browser` (this is how theme and
     `dir` reach the root; never touch `document` directly).
   - **Persist after hydration**: guard writes on `hasHydrated` so defaults never clobber stored
     values, then `writeStorageJson('local', STORAGE_KEYS.<key>, snapshot)`.
     Register the storage key in `src/shared/constants/storage-keys.constants.ts`.
6. Mount the effects hook once via a dedicated container the way
   `src/modules/ui-preferences/containers/ui-preferences-effects.container.tsx` is mounted in
   `src/app/providers.tsx` — never per-screen.
7. Test in `src/modules/<feature>/test/`: store actions and selectors as plain functions
   (create, act, assert `getState()`); the effects hook with `renderHook`, asserting hydration
   from a seeded storage value, the `hasHydrated` write guard, and DOM attribute sync through the
   browser facade.

## Forbidden

- Server data, tokens, or form state in a store (`useAuthStore` in
  `src/modules/auth/store/auth.store.ts` keeps only a token-free session snapshot).
- `localStorage`, `window`, or `document` inside a store or effects hook — only the
  `@/packages/storage` and `@/packages/browser` facades.
- Persistence middleware baked into the store; hydration is explicit via the effects hook.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
```

## Definition of done

- Pure store + named selectors; consumers use narrow selections or `useAppStoreShallow`.
- Persistence/DOM sync isolated in an effects hook mounted once in app providers.
- Hydration is schema-validated, one-shot, and write-guarded by `hasHydrated`.
- Store, selectors, and effects hook are unit-tested; no SSR/client hydration mismatch.
