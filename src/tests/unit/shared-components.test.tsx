import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppLink } from '@/packages/link';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { AppHeader } from '@/shared/components/layout/app-header.component';
import { SkipLink } from '@/shared/components/primitives/skip-link.component';
import { VisuallyHidden } from '@/shared/components/primitives/visually-hidden.component';

describe('AppHeader', () => {
  it('renders brand, labelled navigation, and optional actions', () => {
    render(
      <AppHeader
        homeLabel="Strict Next Ranger"
        navLandmarkLabel="Primary"
        testId="app-header"
        navItems={<AppLink href="/articles">Articles</AppLink>}
        actions={<button type="button">Sign in</button>}
      />,
    );

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByText('Strict Next Ranger')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Articles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('omits the actions slot when not provided', () => {
    render(
      <AppHeader
        homeLabel="Brand"
        navLandmarkLabel="Primary"
        navItems={<a href="#main">Home</a>}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('PageHeader', () => {
  it('renders the h1 with an optional subtitle', () => {
    render(<PageHeader title="Articles" subtitle="Reference module" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Articles' })).toBeInTheDocument();
    expect(screen.getByText('Reference module')).toBeInTheDocument();
  });

  it('omits the subtitle when absent', () => {
    render(<PageHeader title="Articles" />);

    expect(screen.queryByText('Reference module')).not.toBeInTheDocument();
  });
});

describe('SkipLink', () => {
  it('targets the main landmark with the translated label', () => {
    render(<SkipLink targetHref="#main-content" label="Skip to main content" />);

    const link = screen.getByRole('link', { name: 'Skip to main content' });

    expect(link).toHaveAttribute('href', '#main-content');
  });
});

describe('VisuallyHidden', () => {
  it('keeps content in the accessibility tree', () => {
    render(<VisuallyHidden>Screen reader only</VisuallyHidden>);

    expect(screen.getByText('Screen reader only')).toBeInTheDocument();
  });
});
