'use client';
// client-boundary-reason: virtualization measures the viewport and handles scroll events at runtime.

import type { ReactElement } from 'react';
import { Virtuoso } from 'react-virtuoso';

export interface VirtualizedListProps<TItem> {
  readonly items: readonly TItem[];
  readonly heightPx: number;
  readonly computeItemKey: (item: TItem, index: number) => string;
  readonly renderItem: (item: TItem, index: number) => ReactElement;
  /** Rows rendered before measurement (SSR and non-layout environments). */
  readonly initialRenderCount?: number;
  readonly testId?: string;
}

/**
 * Long lists (100+ rows) render through this wrapper instead of `.map()` so
 * the DOM stays small. See rules/12-performance.md.
 */
export function VirtualizedList<TItem>(props: VirtualizedListProps<TItem>): ReactElement {
  const measurementProps =
    props.initialRenderCount === undefined ? {} : { initialItemCount: props.initialRenderCount };

  return (
    <Virtuoso<TItem>
      data={props.items}
      style={{ height: props.heightPx }}
      computeItemKey={(index, item) => props.computeItemKey(item, index)}
      itemContent={(index, item) => props.renderItem(item, index)}
      data-testid={props.testId}
      {...measurementProps}
    />
  );
}
