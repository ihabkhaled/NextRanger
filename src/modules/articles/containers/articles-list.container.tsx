'use client';
// client-boundary-reason: connects the interactive articles query hook to presentational components.

import type { ReactElement } from 'react';

import { EmptyState } from '@/shared/components/feedback/empty-state.component';
import { ErrorState } from '@/shared/components/feedback/error-state.component';
import { LoadingState } from '@/shared/components/feedback/loading-state.component';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

import { ArticleCard } from '../components/article-card.component';
import { ArticleList } from '../components/article-list.component';
import { useArticlesList } from '../hooks/use-articles-list.hook';

export function ArticlesListContainer(): ReactElement {
  const viewModel = useArticlesList();

  switch (viewModel.state) {
    case 'loading': {
      return <LoadingState label={viewModel.loadingLabel} testId={TEST_IDS.articlesLoading} />;
    }
    case 'error': {
      return (
        <ErrorState
          message={viewModel.errorMessage}
          retryLabel={viewModel.retryLabel}
          onRetry={viewModel.onRetry}
          testId={TEST_IDS.articlesError}
        />
      );
    }
    case 'empty': {
      return <EmptyState message={viewModel.emptyMessage} testId={TEST_IDS.articlesEmpty} />;
    }
    /* 'ready' — the only remaining ArticlesListState member. */
    default: {
      return (
        <ArticleList testId={TEST_IDS.articlesList}>
          {viewModel.items.map((item) => (
            <ArticleCard key={item.id} viewModel={item} />
          ))}
        </ArticleList>
      );
    }
  }
}
