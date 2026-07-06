/**
 * App-owned aliases for the TanStack Query hooks. Query layers import these,
 * never the vendor package.
 */

export {
  useMutation as useAppMutation,
  useQuery as useAppQuery,
  useQueryClient as useAppQueryClient,
  useSuspenseQuery as useAppSuspenseQuery,
} from '@tanstack/react-query';
