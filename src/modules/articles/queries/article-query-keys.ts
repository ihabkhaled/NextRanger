import type { ArticleListParams } from '../types/article.types';

/**
 * Query-key builders — the only source of article cache addresses. Inline
 * key arrays anywhere else are an ESLint violation.
 */
export const articleQueryKeys = {
  root: ['articles'] as const,
  lists: () => [...articleQueryKeys.root, 'list'] as const,
  list: (params: ArticleListParams) => [...articleQueryKeys.lists(), params] as const,
  details: () => [...articleQueryKeys.root, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
};
