import type { ReactNode } from 'react';

export interface SkipLinkProps {
  readonly targetHref: string;
  readonly label: string;
}

export interface VisuallyHiddenProps {
  readonly children: ReactNode;
}

export interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

export interface LoadingStateProps {
  readonly label: string;
  readonly testId?: string;
}

export interface EmptyStateProps {
  readonly message: string;
  readonly testId?: string;
}

export interface ErrorStateProps {
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly testId?: string;
}

export interface FormFieldProps {
  readonly fieldId: string;
  readonly label: string;
  readonly error?: string | undefined;
  readonly children: ReactNode;
}

export interface AppHeaderProps {
  readonly homeLabel: string;
  readonly navLandmarkLabel: string;
  readonly navItems: ReactNode;
  readonly actions?: ReactNode;
  readonly testId?: string;
}
