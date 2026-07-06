import { ArticleStatus, type Article } from '@/modules/articles';

let sequence = 0;

/** Build a valid domain article; override any field per test. */
export function buildArticle(overrides: Partial<Article> = {}): Article {
  sequence += 1;

  return {
    id: `a-test-${sequence}`,
    title: `Test article ${sequence}`,
    summary: 'A factory-built article for tests.',
    status: ArticleStatus.Published,
    publishedAt: '2026-01-15T09:00:00.000Z',
    readingTimeMinutes: 4,
    ...overrides,
  };
}
