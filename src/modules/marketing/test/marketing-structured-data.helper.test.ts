import { describe, expect, it } from 'vitest';

import { buildMarketingStructuredData } from '../helpers/marketing-structured-data.helper';

interface StructuredDataNode {
  readonly '@type': string;
  readonly '@id'?: string;
  readonly isPartOf?: Readonly<{ '@id': string }>;
  readonly itemListElement?: readonly unknown[];
}

function readGraph(kind: 'home' | 'features'): readonly StructuredDataNode[] {
  const value = JSON.parse(
    buildMarketingStructuredData('en', kind, 'Visible title', 'Visible description'),
  ) as Readonly<{ '@graph': readonly StructuredDataNode[] }>;

  return value['@graph'];
}

describe('buildMarketingStructuredData', () => {
  it('links the page to a declared WebSite identity', () => {
    const graph = readGraph('features');
    const website = graph.find((node) => node['@type'] === 'WebSite');
    const webpage = graph.find((node) => node['@type'] === 'WebPage');

    expect(website?.['@id']).toMatch(/#website$/u);
    expect(webpage?.isPartOf?.['@id']).toBe(website?.['@id']);
  });

  it('matches the visible one-item breadcrumb on home', () => {
    const breadcrumb = readGraph('home').find((node) => node['@type'] === 'BreadcrumbList');

    expect(breadcrumb?.itemListElement).toHaveLength(1);
  });
});
