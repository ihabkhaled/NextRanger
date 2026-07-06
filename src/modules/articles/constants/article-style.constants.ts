import type { ArticleStatusValue } from '../enums/article-status.enum';

const badgeBase = 'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium';

/** Status badge class bundles, selected in the display helper. */
export const ARTICLE_STATUS_BADGE_CLASSES: Readonly<Record<ArticleStatusValue, string>> = {
  draft: `${badgeBase} bg-muted text-muted-foreground`,
  published: `${badgeBase} bg-success/10 text-success`,
  archived: `${badgeBase} bg-warning/10 text-warning`,
};

export const articleCardClasses = {
  meta: 'flex flex-row flex-wrap items-center gap-3 text-xs text-muted-foreground',
} as const;
