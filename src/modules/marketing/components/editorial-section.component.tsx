import type { ReactElement } from 'react';

import { marketingClasses } from '../constants/marketing-style.constants';
import type { EditorialSectionProps } from '../types/marketing.types';

/** Reusable editorial section with a strong text column and supplied evidence. */
export function EditorialSection(props: EditorialSectionProps): ReactElement {
  return (
    <section className={marketingClasses.editorial} aria-label={props.eyebrow}>
      <header className={marketingClasses.editorialHeader}>
        <p className={marketingClasses.editorialEyebrow}>{props.eyebrow}</p>
        <h2 className={marketingClasses.editorialTitle}>{props.title}</h2>
        <p className={marketingClasses.editorialDescription}>{props.description}</p>
      </header>
      <div className={marketingClasses.editorialContent}>{props.content}</div>
    </section>
  );
}
