// FIXTURE: deliberate violation for no-react-in-pure-layers.
import { useMemo } from 'react';

import type { Article } from '@/modules/articles/types/article.types';

export function badListWithReact(): Article[] {
  void useMemo;

  return [];
}
