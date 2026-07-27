import type { ArticleStatusValue } from '../enums/article-status.enum';

const badgeBase = 'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium';

/** Status badge class bundles, selected in the display helper. */
export const ARTICLE_STATUS_BADGE_CLASSES: Readonly<Record<ArticleStatusValue, string>> = {
  draft: `${badgeBase} bg-muted text-muted-foreground`,
  published: `${badgeBase} bg-success/10 text-success-readable`,
  archived: `${badgeBase} bg-warning/10 text-warning-readable`,
};

export const articleCardClasses = {
  card: 'group flex min-h-64 flex-col gap-4 overflow-hidden hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-shadow/8',
  summary: 'line-clamp-3 leading-6',
  meta: 'mt-auto flex flex-row flex-wrap items-center gap-3 border-t border-border pt-4 font-mono text-xs text-muted-foreground',
} as const;

export const articleListClasses = {
  root: 'grid gap-5 md:grid-cols-2',
} as const;
