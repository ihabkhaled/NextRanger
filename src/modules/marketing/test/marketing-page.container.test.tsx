import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MarketingPageContainer } from '../containers/marketing-page.container';

const serverMocks = vi.hoisted(() => ({
  getRequestNonce: vi.fn(() => Promise.resolve('nonce-for-test')),
  getServerTranslations: vi.fn((input: Readonly<{ locale: string; namespace: string }>) =>
    Promise.resolve((key: string): string => `${input.namespace}.${key}`),
  ),
  setServerLocale: vi.fn(),
}));

vi.mock('@/packages/headers', () => ({
  getRequestNonce: serverMocks.getRequestNonce,
}));

vi.mock('@/packages/i18n', () => ({
  getServerTranslations: serverMocks.getServerTranslations,
  setServerLocale: serverMocks.setServerLocale,
}));

vi.mock('../containers/contact-form.container', () => ({
  ContactFormContainer: () => <form aria-label="Mock contact form" />,
}));

async function renderMarketingKind(
  kind: Parameters<typeof MarketingPageContainer>[0]['kind'],
): Promise<void> {
  render(await MarketingPageContainer({ locale: 'en', kind }));
}

describe('MarketingPageContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('composes the home route atlas and capability evidence', async () => {
    await renderMarketingKind('home');

    expect(screen.getByRole('heading', { level: 1, name: 'marketing.home.title' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: 'app.title' })).toBeVisible();
    expect(screen.getByText('/en/features')).toBeVisible();
    expect(screen.getByText('marketing.highlights.one.title')).toBeVisible();
    expect(serverMocks.setServerLocale).toHaveBeenCalledWith('en');
  });

  it('gives the about page an editorial principles layout', async () => {
    await renderMarketingKind('about');

    expect(screen.getByText('home.principleComponents')).toBeVisible();
    expect(screen.queryByText('/en/features')).not.toBeInTheDocument();
    expect(screen.queryByText('marketing.highlights.one.title')).not.toBeInTheDocument();
  });

  it('combines capability cards and engineering principles on features', async () => {
    await renderMarketingKind('features');

    expect(screen.getByText('marketing.highlights.one.title')).toBeVisible();
    expect(screen.getByText('home.principleTesting')).toBeVisible();
  });

  it('renders crawlable disclosure content on FAQ', async () => {
    await renderMarketingKind('faq');

    expect(screen.getByText('marketing.questions.one.question')).toBeVisible();
    expect(screen.queryByText('marketing.highlights.one.title')).not.toBeInTheDocument();
  });

  it('renders the interactive contact module only on Contact', async () => {
    await renderMarketingKind('contact');

    expect(screen.getByRole('form', { name: 'Mock contact form' })).toBeVisible();
    expect(screen.queryByText('marketing.questions.one.question')).not.toBeInTheDocument();
  });
});
