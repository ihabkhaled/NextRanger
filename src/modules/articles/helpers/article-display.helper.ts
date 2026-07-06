import { formatDisplayDate } from '@/packages/date';
import { buildIndexedTestId } from '@/shared/testing/test-id.helper';

import { ARTICLE_STATUS_BADGE_CLASSES } from '../constants/article-style.constants';
import type { Article, ArticleCardViewModel } from '../types/article.types';

export interface ArticleDisplayTranslations {
  readonly translateStatus: (status: Article['status']) => string;
  readonly translateReadingTime: (minutes: number) => string;
  readonly translatePublishedOn: (formattedDate: string) => string;
}

/**
 * Pure presentation assembly: domain article → display-ready card view model.
 * Translation functions are injected so this stays unit-testable.
 */
export function buildArticleCardViewModel(options: {
  article: Article;
  locale: string;
  cardTestId: string;
  translations: ArticleDisplayTranslations;
}): ArticleCardViewModel {
  const { article, locale, cardTestId, translations } = options;
  const formattedDate = article.publishedAt ? formatDisplayDate(article.publishedAt, locale) : null;

  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    statusLabel: translations.translateStatus(article.status),
    statusBadgeClassName: ARTICLE_STATUS_BADGE_CLASSES[article.status],
    publishedLabel: formattedDate ? translations.translatePublishedOn(formattedDate) : null,
    readingTimeLabel: translations.translateReadingTime(article.readingTimeMinutes),
    testId: buildIndexedTestId(cardTestId, article.id),
  };
}
