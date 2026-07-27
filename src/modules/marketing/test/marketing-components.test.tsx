import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, IntlMessagesProvider } from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { AppLink } from '@/packages/link';

import { EditorialSection } from '../components/editorial-section.component';
import { MarketingPage } from '../components/marketing-page.component';
import { RouteAtlas } from '../components/route-atlas.component';
import { ContactFormContainer } from '../containers/contact-form.container';

function renderWithMessages(content: ReactNode): void {
  render(
    <IntlMessagesProvider locale={DEFAULT_LOCALE} messages={enMessages}>
      {content}
    </IntlMessagesProvider>,
  );
}

describe('MarketingPage', () => {
  it('renders the editorial hero, trust signal, actions, and supplied content', () => {
    render(
      <MarketingPage
        eyebrow="Build with confidence"
        title="A strict product foundation"
        description="Prepared for focused teams."
        trustLabel="Trusted by product and platform teams"
        primaryAction={<AppLink href="/en/features">Explore features</AppLink>}
        secondaryAction={<AppLink href="/en/workbench">Open workbench</AppLink>}
        content={<section aria-label="Route atlas">Localized route map</section>}
        structuredData='{"@type":"WebPage"}'
        nonce="test-nonce"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'A strict product foundation' }),
    ).toBeVisible();
    expect(screen.getByText('Build with confidence')).toBeVisible();
    expect(screen.getByText('Prepared for focused teams.')).toBeVisible();
    expect(screen.getByText('Trusted by product and platform teams')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Explore features' })).toHaveAttribute(
      'href',
      '/en/features',
    );
    expect(screen.getByRole('link', { name: 'Open workbench' })).toHaveAttribute(
      'href',
      '/en/workbench',
    );
    expect(screen.getByRole('region', { name: 'Route atlas' })).toHaveTextContent(
      'Localized route map',
    );
  });
});

describe('marketing content modules', () => {
  it('renders a labelled route atlas and an editorial evidence section', () => {
    render(
      <>
        <RouteAtlas
          label="Localized route atlas"
          title="Every language is a first-class route"
          description="Canonical pages connect through one visible publishing system."
          stations={
            <>
              <li>01 /en</li>
              <li>02 /en/features</li>
            </>
          }
        />
        <EditorialSection
          eyebrow="Operating principles"
          title="Decisions teams can trust"
          description="Rules stay visible and enforceable."
          content={
            <ol>
              <li>Server-first by default</li>
            </ol>
          }
        />
      </>,
    );

    expect(screen.getByRole('region', { name: 'Localized route atlas' })).toHaveTextContent(
      '/en/features',
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Every language is a first-class route',
      }),
    ).toBeVisible();
    expect(screen.getByText('Server-first by default')).toBeVisible();
  });
});

describe('ContactFormContainer', () => {
  it('shows translated validation and prepares a truthful local handoff', async () => {
    const user = userEvent.setup();
    renderWithMessages(<ContactFormContainer />);

    await user.click(screen.getByRole('button', { name: 'Prepare email draft' }));

    expect(await screen.findByText('Enter your name.')).toBeVisible();
    expect(screen.getByText('Enter your email address.')).toBeVisible();
    expect(screen.getByText('Enter a message.')).toBeVisible();

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'A');
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'a@b.co');
    await user.type(screen.getByRole('textbox', { name: 'Message' }), '12345678901234567890');
    await user.click(screen.getByRole('button', { name: 'Prepare email draft' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your message is valid. Configure NEXT_PUBLIC_CONTACT_EMAIL to address the draft.',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
