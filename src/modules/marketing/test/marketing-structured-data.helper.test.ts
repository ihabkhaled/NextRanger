import { describe, expect, it } from 'vitest';

import { buildMarketingStructuredData } from '../helpers/marketing-structured-data.helper';
import type { MarketingPageKind } from '../types/marketing.types';

interface StructuredDataNode {
  readonly '@type': string;
  readonly '@id'?: string;
  readonly isPartOf?: Readonly<{ '@id': string }>;
  readonly itemListElement?: readonly unknown[];
  readonly logo?: string;
  readonly mainEntity?: readonly unknown[];
}

function readGraph(
  kind: MarketingPageKind,
  questions: readonly Readonly<{ question: string; answer: string }>[] = [],
): readonly StructuredDataNode[] {
  const value = JSON.parse(
    buildMarketingStructuredData('en', kind, 'Visible title', 'Visible description', questions),
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

  it('publishes organization identity and the correct semantic page types', () => {
    const homeGraph = readGraph('home');
    const organization = homeGraph.find((node) => node['@type'] === 'Organization');

    expect(organization?.logo).toMatch(/\/icons\/icon-512\.png$/u);
    expect(readGraph('about').some((node) => node['@type'] === 'AboutPage')).toBe(true);
    expect(readGraph('contact').some((node) => node['@type'] === 'ContactPage')).toBe(true);
  });

  it('publishes visible FAQ answers as FAQPage entities', () => {
    const graph = readGraph('faq', [
      { question: 'Does it support localized routes?', answer: 'Yes, every locale has a URL.' },
      { question: 'Is it strict?', answer: 'All quality findings are errors.' },
    ]);
    const faqPage = graph.find((node) => node['@type'] === 'FAQPage');

    expect(faqPage?.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'Does it support localized routes?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, every locale has a URL.' },
      },
      {
        '@type': 'Question',
        name: 'Is it strict?',
        acceptedAnswer: { '@type': 'Answer', text: 'All quality findings are errors.' },
      },
    ]);
  });
});
