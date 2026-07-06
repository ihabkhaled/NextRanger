import type { Article } from '../types/article.types';

/**
 * Newest-first ordering; unpublished articles (null publishedAt) sink to the
 * end while preserving their relative order.
 */
export function sortArticlesByNewest(articles: readonly Article[]): readonly Article[] {
  return articles.toSorted((first, second) => {
    if (first.publishedAt === null && second.publishedAt === null) {
      return 0;
    }

    if (first.publishedAt === null) {
      return 1;
    }

    if (second.publishedAt === null) {
      return -1;
    }

    return second.publishedAt.localeCompare(first.publishedAt);
  });
}
