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

export interface SiteShellProps {
  readonly brandHomeLink: ReactNode;
  readonly desktopNavigation: ReactNode;
  readonly mobileNavigation: ReactNode;
  readonly utilityNavigation: ReactNode;
  readonly controls: ReactNode;
  readonly breadcrumb: ReactNode;
  readonly footerNote: ReactNode;
  readonly footerNavigation: ReactNode;
  readonly children: ReactNode;
  readonly navigationLabel: string;
  readonly breadcrumbLabel: string;
  readonly menuLabel: string;
}
