import { describe, expect, it } from 'vitest';

import type { ArticleApiItem } from '../api/articles.api.types';
import { mapArticleApiItem, mapArticleListResponse } from '../mappers/article.mapper';

const apiItem: ArticleApiItem = {
  id: 'a-1',
  title: 'Title',
  summary: 'Summary',
  status: 'published',
  published_at: '2026-01-01T00:00:00.000Z',
  reading_time_minutes: 5,
};

describe('mapArticleApiItem', () => {
  it('converts wire snake_case to domain camelCase', () => {
    expect(mapArticleApiItem(apiItem)).toEqual({
      id: 'a-1',
      title: 'Title',
      summary: 'Summary',
      status: 'published',
      publishedAt: '2026-01-01T00:00:00.000Z',
      readingTimeMinutes: 5,
    });
  });

  it('preserves null publishedAt for unpublished articles', () => {
    expect(mapArticleApiItem({ ...apiItem, published_at: null }).publishedAt).toBeNull();
  });
});

describe('mapArticleListResponse', () => {
  it('maps every item and the total count', () => {
    const result = mapArticleListResponse({ items: [apiItem, apiItem], total_count: 12 });

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(12);
    expect(result.items[0]?.readingTimeMinutes).toBe(5);
  });

  it('maps an empty response', () => {
    expect(mapArticleListResponse({ items: [], total_count: 0 })).toEqual({
      items: [],
      totalCount: 0,
    });
  });
});
