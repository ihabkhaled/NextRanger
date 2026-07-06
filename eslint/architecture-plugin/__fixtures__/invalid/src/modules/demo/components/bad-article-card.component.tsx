// FIXTURE: deliberate violations for the frontend-architecture rule tests.
// This directory is excluded from the normal lint run (eslint/ignores.config.mjs)
// and exercised by src/tests/unit/eslint-architecture-rules.test.ts.
import { useState } from 'react';

import { useArticlesList } from '../hooks/use-articles-list.hook';

interface InlineProps {
  title: string;
}

const INLINE_CONFIG = { pageSize: 10 };

export function BadArticleCard(props: InlineProps) {
  const [open, setOpen] = useState(false);
  const articles = useArticlesList();

  return (
    <article className="rounded-lg border p-4">
      <h2 onClick={() => setOpen(!open)}>Latest articles</h2>
      <ul>
        {articles.items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <p>{open ? (props.title ? props.title : 'Untitled') : 'Closed'}</p>
      <span>{INLINE_CONFIG.pageSize}</span>
    </article>
  );
}
