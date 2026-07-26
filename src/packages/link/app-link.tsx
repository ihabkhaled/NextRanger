import type { Route } from 'next';
import NextLink from 'next/link';
import type { MouseEventHandler, ReactElement, ReactNode } from 'react';

/**
 * Deliberately narrow prop surface: navigation styling and identification
 * only. Interactive behavior belongs in containers, not links.
 */
export interface AppLinkProps {
  readonly href: Route;
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly prefetch?: boolean;
  readonly 'aria-label'?: string;
  readonly 'aria-current'?: 'page' | undefined;
  readonly 'data-testid'?: string;
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/** Internal navigation. Typed routes keep dead links out of the build. */
export function AppLink(props: AppLinkProps): ReactElement {
  const optionalClickProps = props.onClick === undefined ? {} : { onClick: props.onClick };

  return (
    <NextLink
      href={props.href}
      prefetch={props.prefetch ?? true}
      className={props.className}
      aria-label={props['aria-label']}
      aria-current={props['aria-current']}
      data-testid={props['data-testid']}
      {...optionalClickProps}
    >
      {props.children}
    </NextLink>
  );
}

export interface ExternalLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly 'aria-label'?: string;
  readonly 'data-testid'?: string;
}

/** External links always open safely (noopener/noreferrer, new tab). */
export function ExternalLink(props: ExternalLinkProps): ReactElement {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className={props.className}
      aria-label={props['aria-label']}
      data-testid={props['data-testid']}
    >
      {props.children}
    </a>
  );
}
