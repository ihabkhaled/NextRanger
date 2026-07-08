import { buildArticle } from '@tests/factories/article.factory';
import { describe, expect, it } from 'vitest';

import { ARTICLE_STATUS_BADGE_CLASSES } from '../constants/article-style.constants';
import { buildArticleCardViewModel } from '../helpers/article-display.helper';
import type { ArticleDisplayTranslations } from '../types/article.types';

const translations: ArticleDisplayTranslations = {
  translateStatus: (status) => `status:${status}`,
  translateReadingTime: (minutes) => `${minutes} min`,
  translatePublishedOn: (formattedDate) => `on ${formattedDate}`,
};

describe('buildArticleCardViewModel', () => {
  it('builds a fully display-ready view model for a published article', () => {
    const article = buildArticle({
      id: 'a-7',
      status: 'published',
      publishedAt: '2026-03-04T12:00:00.000Z',
      readingTimeMinutes: 6,
    });

    const viewModel = buildArticleCardViewModel({
      article,
      locale: 'en',
      cardTestId: 'article-card',
      translations,
    });

    expect(viewModel.id).toBe('a-7');
    expect(viewModel.statusLabel).toBe('status:published');
    expect(viewModel.statusBadgeClassName).toBe(ARTICLE_STATUS_BADGE_CLASSES.published);
    expect(viewModel.readingTimeLabel).toBe('6 min');
    expect(viewModel.publishedLabel).toMatch(/^on .*2026/);
    expect(viewModel.testId).toBe('article-card-a-7');
  });

  it('omits the published label for unpublished articles', () => {
    const viewModel = buildArticleCardViewModel({
      article: buildArticle({ status: 'draft', publishedAt: null }),
      locale: 'en',
      cardTestId: 'article-card',
      translations,
    });

    expect(viewModel.publishedLabel).toBeNull();
    expect(viewModel.statusBadgeClassName).toBe(ARTICLE_STATUS_BADGE_CLASSES.draft);
  });

  it('localizes the published date through the date facade', () => {
    const english = buildArticleCardViewModel({
      article: buildArticle({ publishedAt: '2026-03-04T12:00:00.000Z' }),
      locale: 'en',
      cardTestId: 'article-card',
      translations,
    });
    const arabic = buildArticleCardViewModel({
      article: buildArticle({ publishedAt: '2026-03-04T12:00:00.000Z' }),
      locale: 'ar',
      cardTestId: 'article-card',
      translations,
    });

    expect(english.publishedLabel).not.toBe(arabic.publishedLabel);
  });
});
