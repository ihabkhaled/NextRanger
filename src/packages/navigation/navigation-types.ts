import type { Route } from 'next';

export interface AppNavigation {
  readonly pathname: string;
  readonly push: (href: Route) => void;
  readonly replace: (href: Route) => void;
  readonly back: () => void;
  readonly refresh: () => void;
}
