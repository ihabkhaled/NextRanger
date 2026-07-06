import { useAppMutation, useAppQueryClient } from '@/packages/query';

import { createArticle } from '../services/article.service';
import type { Article, CreateArticleInput } from '../types/article.types';

import { invalidateArticleLists } from './article.invalidate';

export function useCreateArticleMutation(): ReturnType<
  typeof useAppMutation<Article, Error, CreateArticleInput>
> {
  const queryClient = useAppQueryClient();

  return useAppMutation<Article, Error, CreateArticleInput>({
    mutationFn: createArticle,
    onSuccess: () => invalidateArticleLists(queryClient),
  });
}
