import { useAppQuery } from '@/packages/query';

import { listArticles } from '../services/article.service';
import type {
  ArticleListResult,
  ArticleListParams,
  ArticlesListQueryOptions,
} from '../types/article.types';

import { articleQueryKeys } from './article-query-keys';

/** Exported for reuse in integration tests and prefetching. */
export function buildArticlesListQueryOptions(params: ArticleListParams): ArticlesListQueryOptions {
  return {
    queryKey: articleQueryKeys.list(params),
    queryFn: () => listArticles(params),
  };
}

export function useArticlesListQuery(
  params: ArticleListParams,
): ReturnType<typeof useAppQuery<ArticleListResult, Error>> {
  return useAppQuery<ArticleListResult>(buildArticlesListQueryOptions(params));
}
