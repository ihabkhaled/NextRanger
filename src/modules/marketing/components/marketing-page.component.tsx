import type { ReactElement } from 'react';

import { Stack } from '@/packages/ui-primitives';

import { marketingClasses } from '../constants/marketing-style.constants';
import type { MarketingPageProps } from '../types/marketing.types';

export function MarketingPage(props: MarketingPageProps): ReactElement {
  return (
    <div className={marketingClasses.page}>
      <script type="application/ld+json" nonce={props.nonce}>
        {props.structuredData}
      </script>
      <section className={marketingClasses.hero}>
        <Stack gap="lg">
          <p className={marketingClasses.eyebrow}>{props.eyebrow}</p>
          <h1 className={marketingClasses.title}>{props.title}</h1>
          <p className={marketingClasses.description}>{props.description}</p>
          <div className={marketingClasses.actions}>
            {props.primaryAction}
            {props.secondaryAction}
          </div>
        </Stack>
      </section>
      <p className={marketingClasses.trust}>{props.trustLabel}</p>
      {props.content}
    </div>
  );
}
