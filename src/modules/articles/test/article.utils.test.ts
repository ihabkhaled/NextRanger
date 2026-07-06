import { buildArticle } from '@tests/factories/article.factory';
import { describe, expect, it } from 'vitest';

import { sortArticlesByNewest } from '../utils/article.utils';

describe('sortArticlesByNewest', () => {
  it('orders published articles newest first', () => {
    const older = buildArticle({ publishedAt: '2025-01-01T00:00:00.000Z' });
    const newer = buildArticle({ publishedAt: '2026-06-01T00:00:00.000Z' });

    const sorted = sortArticlesByNewest([older, newer]);

    expect(sorted.map((article) => article.id)).toEqual([newer.id, older.id]);
  });

  it('sinks unpublished articles to the end', () => {
    const draft = buildArticle({ publishedAt: null });
    const published = buildArticle({ publishedAt: '2026-06-01T00:00:00.000Z' });

    const sorted = sortArticlesByNewest([draft, published]);

    expect(sorted.map((article) => article.id)).toEqual([published.id, draft.id]);
  });

  it('keeps relative order among unpublished articles', () => {
    const firstDraft = buildArticle({ publishedAt: null });
    const secondDraft = buildArticle({ publishedAt: null });

    const sorted = sortArticlesByNewest([firstDraft, secondDraft]);

    expect(sorted.map((article) => article.id)).toEqual([firstDraft.id, secondDraft.id]);
  });

  it('does not mutate the input array', () => {
    const input = [
      buildArticle({ publishedAt: null }),
      buildArticle({ publishedAt: '2026-06-01T00:00:00.000Z' }),
    ];
    const snapshot = [...input];

    sortArticlesByNewest(input);

    expect(input).toEqual(snapshot);
  });
});
