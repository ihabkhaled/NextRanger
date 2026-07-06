import type { ArticleApiItem, ArticleApiListResponse } from '../api/articles.api.types';
import type { Article, ArticleListResult } from '../types/article.types';

/** Wire → domain. Nothing above the service layer ever sees snake_case. */
export function mapArticleApiItem(apiItem: ArticleApiItem): Article {
  return {
    id: apiItem.id,
    title: apiItem.title,
    summary: apiItem.summary,
    status: apiItem.status,
    publishedAt: apiItem.published_at,
    readingTimeMinutes: apiItem.reading_time_minutes,
  };
}

export function mapArticleListResponse(response: ArticleApiListResponse): ArticleListResult {
  return {
    items: response.items.map((item) => mapArticleApiItem(item)),
    totalCount: response.total_count,
  };
}
