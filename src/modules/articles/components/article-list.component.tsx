import type { ReactElement } from 'react';

import { Stack } from '@/packages/ui-primitives';

import type { ArticleListSlots } from '../types/article.types';

/** Layout slot for pre-built article cards (mapping happens in the container). */
export function ArticleList(props: ArticleListSlots): ReactElement {
  return (
    <Stack gap="md" data-testid={props.testId}>
      {props.children}
    </Stack>
  );
}
