# Reference Patterns

Canonical excerpts quoted verbatim from the repo. When you write a new file, start from the
matching excerpt here and its source file — do not invent a new shape. The `articles` module is
the flagship reference for the full layer anatomy.

## 1. TSX-only component

From [src/modules/articles/components/article-card.component.tsx](../src/modules/articles/components/article-card.component.tsx).
No hooks, no logic, no raw copy, no raw classes — everything arrives pre-computed on the view model.

```tsx
export function ArticleCard(props: ArticleCardProps): ReactElement {
  return (
    <Card data-testid={props.viewModel.testId}>
      <span className={props.viewModel.statusBadgeClassName}>{props.viewModel.statusLabel}</span>
      <CardTitle>{props.viewModel.title}</CardTitle>
      <CardDescription>{props.viewModel.summary}</CardDescription>
      <p className={articleCardClasses.meta}>
        {props.viewModel.publishedLabel ? <span>{props.viewModel.publishedLabel}</span> : null}
        <span>{props.viewModel.readingTimeLabel}</span>
      </p>
    </Card>
  );
}
```

## 2. Container: hook → components, state switch, the `.map()`

From [src/modules/articles/containers/articles-list.container.tsx](../src/modules/articles/containers/articles-list.container.tsx).
Note the mandatory client-boundary reason comment and the exhaustive `assertNever` default.

```tsx
'use client';
// client-boundary-reason: connects the interactive articles query hook to presentational components.

export function ArticlesListContainer(): ReactElement {
  const viewModel = useArticlesList();

  switch (viewModel.state) {
    case 'loading': {
      return <LoadingState label={viewModel.loadingLabel} testId={TEST_IDS.articlesLoading} />;
    }
    // … 'error' and 'empty' branches elided …
    case 'ready': {
      return (
        <ArticleList testId={TEST_IDS.articlesList}>
          {viewModel.items.map((item) => (
            <ArticleCard key={item.id} viewModel={item} />
          ))}
        </ArticleList>
      );
    }
    default: {
      return assertNever(viewModel.state);
    }
  }
}
```

## 3. Query-key builder

[src/modules/articles/queries/article-query-keys.ts](../src/modules/articles/queries/article-query-keys.ts)
in full — the only source of article cache addresses (`no-inline-query-keys` enforces this).

```ts
export const articleQueryKeys = {
  root: ['articles'] as const,
  lists: () => [...articleQueryKeys.root, 'list'] as const,
  list: (params: ArticleListParams) => [...articleQueryKeys.lists(), params] as const,
  details: () => [...articleQueryKeys.root, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
};
```

## 4. Gateway → mapper → service chain

Gateway ([src/modules/articles/gateway/articles.gateway.ts](../src/modules/articles/gateway/articles.gateway.ts))
speaks HTTP to the BFF and validates the wire shape; it returns API types only:

```ts
export async function fetchArticleListFromGateway(
  params: ArticleListParams,
): Promise<ArticleApiListResponse> {
  const response = await httpClient.get<unknown>(buildGatewayPath(ARTICLE_ENDPOINTS.list), {
    params: { page: params.page, page_size: params.pageSize },
  });

  return parseSchema(articleApiListResponseSchema, response.data, 'articles list response');
}
```

Mapper ([src/modules/articles/mappers/article.mapper.ts](../src/modules/articles/mappers/article.mapper.ts))
converts wire snake_case to domain camelCase — "Nothing above the service layer ever sees snake_case":

```ts
export function mapArticleApiItem(apiItem: ArticleApiItem): Article {
  return {
    id: apiItem.id,
    title: apiItem.title,
    summary: apiItem.summary,
    status: apiItem.status,
    publishedAt: apiItem.published_at,
    readingTimeMinutes: apiItem.reading_time_minutes,
  };
}
```

Service ([src/modules/articles/services/article.service.ts](../src/modules/articles/services/article.service.ts))
is the React-free use case that composes both:

```ts
export async function listArticles(params: ArticleListParams): Promise<ArticleListResult> {
  const response = await fetchArticleListFromGateway(params);

  return mapArticleListResponse(response);
}
```

The query file ([src/modules/articles/queries/article.queries.ts](../src/modules/articles/queries/article.queries.ts))
binds the service to the cache through the facade: `useAppQuery<ArticleListResult>({ queryKey:
articleQueryKeys.list(params), queryFn: () => listArticles(params) })`.

## 5. Zustand store

From [src/modules/ui-preferences/store/ui-preferences.store.ts](../src/modules/ui-preferences/store/ui-preferences.store.ts).
The store stays pure; persistence and DOM sync live in `use-ui-preferences-effects.hook.ts` via the
storage and browser facades.

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

## 6. Form: schema with i18n-key messages + orchestration hook + toast

Schema ([src/modules/auth/schemas/auth.schema.ts](../src/modules/auth/schemas/auth.schema.ts)) —
error messages are i18n keys, never raw copy:

```ts
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGE_KEYS.emailRequired)
    .pipe(z.email(AUTH_VALIDATION_MESSAGE_KEYS.emailInvalid)),
  password: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGE_KEYS.passwordRequired)
    .min(PASSWORD_MIN_LENGTH, AUTH_VALIDATION_MESSAGE_KEYS.passwordTooShort),
});
```

Hook ([src/modules/auth/hooks/use-login-form.hook.ts](../src/modules/auth/hooks/use-login-form.hook.ts)) —
`useAppZodForm` + mutation + store + toast + typed navigation in one submit path:

```ts
const form = useAppZodForm<LoginFormValues>({
  schema: loginFormSchema,
  defaultValues: { email: '', password: '' },
});

const handleValidSubmit = useCallback(
  async (values: LoginFormValues) => {
    const session = await mutateAsync(values);

    setSession(session);
    showToast({ type: ToastType.Success, message: t(AUTH_MESSAGE_KEYS.success) });
    navigation.push(ROUTE_PATHS.home);
  },
  [mutateAsync, setSession, navigation, t],
);
```

Field errors come back as keys and are translated at the edge:
`error: emailErrorKey ? t(emailErrorKey) : undefined`.

## 7. Error mapping chain

From [src/shared/errors/http-error-to-message-key.mapper.ts](../src/shared/errors/http-error-to-message-key.mapper.ts) —
"the only path from transport failures to user-visible copy". `HttpError` in, translatable key out:

```ts
export function mapErrorToMessageKey(error: unknown): ErrorMessageKey {
  if (!isHttpError(error)) {
    return ERROR_MESSAGE_KEYS.generic;
  }

  if (error.kind === 'network') {
    return ERROR_MESSAGE_KEYS.network;
  }
  // … timeout / 401 / 403 / 404 / >=500 branches elided …
  return ERROR_MESSAGE_KEYS.generic;
}
```

The full chain: axios interceptor normalizes to `HttpError` (`@/packages/axios`), hooks map it with
`mapErrorToMessageKey`, and `useAppTranslation` renders the key. Raw error text never reaches users —
see [rules/18-error-handling.md](../rules/18-error-handling.md).
