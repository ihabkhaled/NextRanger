import type {
  QueryClient,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

/** App-owned aliases so query layers never name vendor types directly. */
export type AppQueryKey = QueryKey;
export type QueryClientLike = QueryClient;

export type AppQueryOptions<TData, TError = Error> = UseQueryOptions<TData, TError>;

export type AppMutationOptions<TData, TError = Error, TVariables = void> = UseMutationOptions<
  TData,
  TError,
  TVariables
>;
