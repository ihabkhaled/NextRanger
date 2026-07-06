import type { QueryClientLike } from '@/packages/query';

import { articleQueryKeys } from './article-query-keys';

/** Exact-scope invalidation: only article lists refetch, nothing else. */
export function invalidateArticleLists(queryClient: QueryClientLike): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
}
