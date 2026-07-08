# Skill: Add a Form

Use this skill for any user-input form. The auth login flow is the end-to-end reference —
follow its files layer by layer. Doctrine:
[rules/02-components-and-containers.md](../rules/02-components-and-containers.md),
[rules/03-hooks.md](../rules/03-hooks.md).

## Reference implementation (auth login)

| Layer        | File                                                               |
| ------------ | ------------------------------------------------------------------ |
| Schema       | `src/modules/auth/schemas/auth.schema.ts` (`loginFormSchema`)      |
| Message keys | `src/modules/auth/constants/auth-message-keys.constants.ts`        |
| Field ids    | `src/modules/auth/constants/auth.constants.ts` (`LOGIN_FIELD_IDS`) |
| Mutation     | `src/modules/auth/queries/auth.mutations.ts` (`useLoginMutation`)  |
| Hook         | `src/modules/auth/hooks/use-login-form.hook.ts` (`useLoginForm`)   |
| Component    | `src/modules/auth/components/login-form.component.tsx` (TSX-only)  |
| Container    | `src/modules/auth/containers/login-form.container.tsx`             |

## Steps

1. **Schema with i18n-key messages.** Define the form schema in
   `src/modules/<feature>/schemas/` using `z` from `@/packages/zod`. Every error message is
   an i18n KEY from the module's `*-message-keys.constants.ts`, never copy:

   ```ts
   email: z
     .string()
     .min(1, AUTH_VALIDATION_MESSAGE_KEYS.emailRequired)
     .pipe(z.email(AUTH_VALIDATION_MESSAGE_KEYS.emailInvalid)),
   ```

   Add the corresponding keys to both catalogs per
   [skills/add-i18n-message-key.md](add-i18n-message-key.md). Numeric limits
   (`PASSWORD_MIN_LENGTH`) live in `constants/`, not inline.

2. **Wire react-hook-form through the wrapper.** In the hook, call `useAppZodForm` from
   `@/packages/forms` with `schema` and `defaultValues` — never raw `useForm` or ad-hoc
   validate callbacks (`src/packages/forms/use-app-zod-form.hook.ts` fixes
   `mode: 'onSubmit'`, `reValidateMode: 'onChange'`).
3. **Create the submit mutation** in `queries/` via `useAppMutation` from
   `@/packages/query`, delegating to a React-free service
   ([skills/create-mutation.md](create-mutation.md)). `useLoginMutation` is the minimal
   example.
4. **Build field view models in the hook.** The hook (`use-login-form.hook.ts`) returns one
   fully-translated view model: per-field `{ fieldId, label, error, testId, inputProps }`
   plus `title`, `submitLabel`, `isSubmitting`, `formError`, and `onSubmit`. Key rules:
   - Field error keys come off `form.formState.errors.<field>?.message` and are translated
     with `t(...)` before display.
   - `inputProps` is `form.register('<field>')` (`AppRegisteredFieldProps`).
   - On valid submit: `await mutateAsync(values)`, update the store, `showToast` with
     translated copy, then `navigation.push(ROUTE_PATHS.…)` via `@/packages/navigation`.
   - `formError` is the translated generic error when `mutation.isError` — never the raw
     error message (error sanitization doctrine,
     [rules/18-error-handling.md](../rules/18-error-handling.md)).
5. **Render through `FormField` for accessibility.** The TSX-only component wraps each
   control in `FormField` (`src/shared/components/forms/form-field.component.tsx`), which
   binds `Label` via `htmlFor={fieldId}` and renders the error in a `role="alert"` region
   whose id is the field id suffixed with `-error`. The `Input` MUST carry `aria-invalid`
   and the matching `aria-describedby`, plus `data-testid` from `TEST_IDS` — copy the
   pattern in `login-form.component.tsx` exactly. The `<form>` uses `noValidate` (the schema
   is the validator) and the submit `Button` is `disabled={isSubmitting}`.
6. **Container connects hook to component.** A `'use client'` file with a
   `// client-boundary-reason:` comment that calls the hook and passes the view model —
   nothing else (`login-form.container.tsx` is 13 lines; yours should be too).
7. **Test both paths.**
   - Unit tests: schema table-driven cases (valid, each invalid variant → expected key) at
     100% coverage ([skills/write-unit-tests.md](write-unit-tests.md)).
   - Integration: `renderWithProviders`, submit empty → assert translated validation copy in
     the alert regions; submit valid → assert success flow. The negative server path uses
     the sentinel `AUTH_MOCK_REJECTED_PASSWORD = 'wrong-password'` from
     `src/modules/auth/api/auth.mock.ts`, which the mock gateway rejects — assert the
     generic form error appears (`TEST_IDS.loginError`). See
     [skills/write-integration-tests.md](write-integration-tests.md).
   - E2e: happy login + wrong-password negative path per
     [skills/write-e2e-tests.md](write-e2e-tests.md).

## Definition of done

- Schema keys translated in the hook; component TSX-only; `FormField` wiring intact.
- Negative-path test exists at integration and e2e level. `npm run quality` green.
