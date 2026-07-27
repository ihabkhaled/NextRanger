import type { ReactElement } from 'react';

import { marketingClasses } from '../constants/marketing-style.constants';
import type { RouteAtlasProps } from '../types/marketing.types';

/** Recognizable publishing-map signature for every localized public route. */
export function RouteAtlas(props: RouteAtlasProps): ReactElement {
  return (
    <section className={marketingClasses.atlas} aria-label={props.label}>
      <header className={marketingClasses.atlasHeader}>
        <p className={marketingClasses.atlasLabel}>{props.label}</p>
        <h2 className={marketingClasses.atlasTitle}>{props.title}</h2>
        <p className={marketingClasses.atlasDescription}>{props.description}</p>
      </header>
      <ol className={marketingClasses.atlasStations}>{props.stations}</ol>
    </section>
  );
}
