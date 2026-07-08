import type { ArticlesListState, ResolveArticlesListStateOptions } from '../types/article.types';

export function resolveArticlesListState(
  options: ResolveArticlesListStateOptions,
): ArticlesListState {
  if (options.isPending) {
    return 'loading';
  }

  if (options.isError) {
    return 'error';
  }

  return options.itemCount === 0 ? 'empty' : 'ready';
}
