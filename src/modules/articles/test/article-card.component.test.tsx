import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticleCard } from '../components/article-card.component';
import type { ArticleCardViewModel } from '../types/article.types';

const viewModel: ArticleCardViewModel = {
  id: 'a-1',
  title: 'Strict frontends',
  summary: 'A summary of the article.',
  statusLabel: 'Published',
  statusBadgeClassName: 'badge',
  publishedLabel: 'Published March 4, 2026',
  readingTimeLabel: '6 minute read',
  testId: 'article-card-a-1',
};

describe('ArticleCard', () => {
  it('renders every pre-computed label', () => {
    render(<ArticleCard viewModel={viewModel} />);

    expect(screen.getByRole('heading', { name: 'Strict frontends' })).toBeInTheDocument();
    expect(screen.getByText('A summary of the article.')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Published March 4, 2026')).toBeInTheDocument();
    expect(screen.getByText('6 minute read')).toBeInTheDocument();
    expect(screen.getByTestId('article-card-a-1')).toBeInTheDocument();
  });

  it('omits the published line when the label is null', () => {
    render(<ArticleCard viewModel={{ ...viewModel, publishedLabel: null }} />);

    expect(screen.queryByText(/Published March/)).not.toBeInTheDocument();
    expect(screen.getByText('6 minute read')).toBeInTheDocument();
  });
});
