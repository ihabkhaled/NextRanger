/**
 * Owner wrapper for `@tanstack/react-query` (and its devtools). Provides the
 * app query provider and typed hook aliases. Query keys always come from
 * per-module `*query-keys.ts` builder files.
 */

export { AppQueryProvider } from './app-query-provider';
export { AppQueryClient, AppQueryClientProvider } from './query-client';
export { useAppMutation, useAppQuery, useAppQueryClient, useAppSuspenseQuery } from './query-hooks';
export type {
  AppMutationOptions,
  AppQueryKey,
  AppQueryOptions,
  QueryClientLike,
} from './query-types';
