export const ArticleStatus = {
  Draft: 'draft',
  Published: 'published',
  Archived: 'archived',
} as const;

export type ArticleStatusValue = (typeof ArticleStatus)[keyof typeof ArticleStatus];

export const ARTICLE_STATUS_VALUES = Object.values(ArticleStatus);
