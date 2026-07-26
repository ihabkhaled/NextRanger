import type { ReactElement } from 'react';

import { articleListClasses } from '../constants/article-style.constants';
import type { ArticleListSlots } from '../types/article.types';

/** Layout slot for pre-built article cards (mapping happens in the container). */
export function ArticleList(props: ArticleListSlots): ReactElement {
  return (
    <div className={articleListClasses.root} data-testid={props.testId}>
      {props.children}
    </div>
  );
}
