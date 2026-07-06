import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppImage } from '@/packages/image';
import { AppLink, ExternalLink } from '@/packages/link';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';

describe('AppLink', () => {
  it('renders an anchor with the typed route href', () => {
    render(<AppLink href={ROUTE_PATHS.articles}>Articles</AppLink>);

    const anchor = screen.getByRole('link', { name: 'Articles' });

    expect(anchor).toHaveAttribute('href', '/articles');
  });

  it('forwards className, aria-label, and data-testid', () => {
    render(
      <AppLink
        href={ROUTE_PATHS.home}
        className="nav-link"
        aria-label="Go home"
        data-testid="home-link"
      >
        Home
      </AppLink>,
    );

    const anchor = screen.getByTestId('home-link');

    expect(anchor).toHaveClass('nav-link');
    expect(anchor).toHaveAccessibleName('Go home');
  });
});

describe('ExternalLink', () => {
  it('always applies rel-safety and opens a new tab', () => {
    render(<ExternalLink href="https://example.com">Docs</ExternalLink>);

    const anchor = screen.getByRole('link', { name: 'Docs' });

    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    expect(anchor).toHaveAttribute('href', 'https://example.com');
  });
});

describe('AppImage', () => {
  it('renders an img with mandatory alt text', () => {
    render(<AppImage src="/logo.png" alt="Company logo" width={64} height={64} />);

    expect(screen.getByAltText('Company logo')).toBeInTheDocument();
  });
});
