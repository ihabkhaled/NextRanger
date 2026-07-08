import type { ReactNode } from 'react';

import type { PaginationParams } from '@/shared/types/pagination.types';

import type { ArticleStatusValue } from '../enums/article-status.enum';

/** Domain model (camelCase) used by everything above the mapper. */
export interface Article {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly status: ArticleStatusValue;
  readonly publishedAt: string | null;
  readonly readingTimeMinutes: number;
}

export type ArticleListParams = PaginationParams;

export interface ArticleListResult {
  readonly items: readonly Article[];
  readonly totalCount: number;
}

export interface CreateArticleInput {
  readonly title: string;
  readonly summary: string;
}

/** Fully-translated, display-ready card data. Components render this as-is. */
export interface ArticleCardViewModel {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly statusLabel: string;
  readonly statusBadgeClassName: string;
  readonly publishedLabel: string | null;
  readonly readingTimeLabel: string;
  readonly testId: string;
}

export type ArticlesListState = 'loading' | 'error' | 'empty' | 'ready';

export interface ArticlesListViewModel {
  readonly state: ArticlesListState;
  readonly items: readonly ArticleCardViewModel[];
  readonly loadingLabel: string;
  readonly emptyMessage: string;
  readonly errorMessage: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
}

export interface ArticlesListQueryOptions {
  readonly queryKey: readonly unknown[];
  readonly queryFn: () => Promise<ArticleListResult>;
}

export interface ArticleCardProps {
  readonly viewModel: ArticleCardViewModel;
}

export interface ArticleListSlots {
  readonly children: ReactNode;
  readonly testId: string;
}

export interface ResolveArticlesListStateOptions {
  readonly isPending: boolean;
  readonly isError: boolean;
  readonly itemCount: number;
}

export interface ArticleDisplayTranslations {
  readonly translateStatus: (status: Article['status']) => string;
  readonly translateReadingTime: (minutes: number) => string;
  readonly translatePublishedOn: (formattedDate: string) => string;
}

export interface BuildArticleCardViewModelOptions {
  readonly article: Article;
  readonly locale: string;
  readonly cardTestId: string;
  readonly translations: ArticleDisplayTranslations;
}
