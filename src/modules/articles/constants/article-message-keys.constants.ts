import type { ArticleStatusValue } from '../enums/article-status.enum';

/**
 * Message keys relative to the `articles` namespace in the i18n catalogs.
 */
export const ARTICLE_MESSAGE_KEYS = {
  title: 'title',
  subtitle: 'subtitle',
  empty: 'empty',
  error: 'error',
  retry: 'retry',
  loading: 'loading',
  readingTime: 'readingTime',
  publishedOn: 'publishedOn',
} as const;

export const ARTICLE_STATUS_MESSAGE_KEYS: Readonly<Record<ArticleStatusValue, string>> = {
  draft: 'status.draft',
  published: 'status.published',
  archived: 'status.archived',
};
