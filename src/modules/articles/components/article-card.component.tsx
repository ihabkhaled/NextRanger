import type { ReactElement } from 'react';

import { Card, CardDescription, CardTitle } from '@/packages/ui-primitives';

import { articleCardClasses } from '../constants/article-style.constants';
import type { ArticleCardProps } from '../types/article.types';

/**
 * TSX-only: every label is pre-translated, every class comes from constants,
 * every value is pre-computed in the hook/helper layer.
 */
export function ArticleCard(props: ArticleCardProps): ReactElement {
  return (
    <Card className={articleCardClasses.card} data-testid={props.viewModel.testId}>
      <span className={props.viewModel.statusBadgeClassName}>{props.viewModel.statusLabel}</span>
      <CardTitle>{props.viewModel.title}</CardTitle>
      <CardDescription className={articleCardClasses.summary}>
        {props.viewModel.summary}
      </CardDescription>
      <p className={articleCardClasses.meta}>
        {props.viewModel.publishedLabel ? <span>{props.viewModel.publishedLabel}</span> : null}
        <span>{props.viewModel.readingTimeLabel}</span>
      </p>
    </Card>
  );
}
