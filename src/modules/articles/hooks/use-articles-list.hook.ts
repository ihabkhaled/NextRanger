import { useCallback, useMemo } from 'react';

import { useAppLocale, useAppTranslation } from '@/packages/i18n';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import {
  ARTICLE_MESSAGE_KEYS,
  ARTICLE_STATUS_MESSAGE_KEYS,
} from '../constants/article-message-keys.constants';
import { ARTICLES_DEFAULT_PAGE, ARTICLES_DEFAULT_PAGE_SIZE } from '../constants/article.constants';
import { buildArticleCardViewModel } from '../helpers/article-display.helper';
import { resolveArticlesListState } from '../helpers/article-list-state.helper';
import { useArticlesListQuery } from '../queries/article.queries';
import type { ArticlesListViewModel } from '../types/article.types';
import { sortArticlesByNewest } from '../utils/article.utils';

/**
 * Orchestration: query state + i18n + display helpers → a fully-computed view
 * model. The container renders it; the components stay TSX-only.
 */
export function useArticlesList(): ArticlesListViewModel {
  const t = useAppTranslation(I18N_NAMESPACES.articles);
  const locale = useAppLocale();
  const query = useArticlesListQuery({
    page: ARTICLES_DEFAULT_PAGE,
    pageSize: ARTICLES_DEFAULT_PAGE_SIZE,
  });

  const refetch = query.refetch;
  const onRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const items = useMemo(() => {
    const articles = query.data ? sortArticlesByNewest(query.data.items) : [];

    return articles.map((article) =>
      buildArticleCardViewModel({
        article,
        locale,
        cardTestId: TEST_IDS.articleCard,
        translations: {
          translateStatus: (status) => t(ARTICLE_STATUS_MESSAGE_KEYS[status]),
          translateReadingTime: (minutes) => t(ARTICLE_MESSAGE_KEYS.readingTime, { minutes }),
          translatePublishedOn: (formattedDate) =>
            t(ARTICLE_MESSAGE_KEYS.publishedOn, { date: formattedDate }),
        },
      }),
    );
  }, [query.data, locale, t]);

  return {
    state: resolveArticlesListState({
      isPending: query.isPending,
      isError: query.isError,
      itemCount: items.length,
    }),
    items,
    loadingLabel: t(ARTICLE_MESSAGE_KEYS.loading),
    emptyMessage: t(ARTICLE_MESSAGE_KEYS.empty),
    errorMessage: t(ARTICLE_MESSAGE_KEYS.error),
    retryLabel: t(ARTICLE_MESSAGE_KEYS.retry),
    onRetry,
  };
}
