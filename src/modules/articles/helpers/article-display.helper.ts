import { formatDisplayDate } from '@/packages/date';
import { buildIndexedTestId } from '@/shared/testing/test-id.helper';

import { ARTICLE_STATUS_BADGE_CLASSES } from '../constants/article-style.constants';
import type {
  ArticleCardViewModel,
  BuildArticleCardViewModelOptions,
} from '../types/article.types';

/**
 * Pure presentation assembly: domain article → display-ready card view model.
 * Translation functions are injected so this stays unit-testable.
 */
export function buildArticleCardViewModel(
  options: BuildArticleCardViewModelOptions,
): ArticleCardViewModel {
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
