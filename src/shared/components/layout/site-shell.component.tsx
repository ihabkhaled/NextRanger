import type { ReactElement } from 'react';

import type { SiteShellProps } from '../types/shared-component.types';

import { siteShellClasses } from './site-shell.variants';

/** Slot-only application shell. Route and feature owners build every slot. */
export function SiteShell(props: SiteShellProps): ReactElement {
  return (
    <>
      <header className={siteShellClasses.header}>
        <div className={siteShellClasses.headerInner}>
          {props.brandHomeLink}
          <nav className={siteShellClasses.desktopNav} aria-label={props.navigationLabel}>
            {props.desktopNavigation}
          </nav>
          <div className={siteShellClasses.controls}>
            {props.controls}
            <details className={siteShellClasses.mobileMenu}>
              <summary className={siteShellClasses.mobileSummary}>{props.menuLabel}</summary>
              <nav className={siteShellClasses.mobilePanel} aria-label={props.navigationLabel}>
                {props.mobileNavigation}
              </nav>
            </details>
          </div>
        </div>
      </header>
      <div className={siteShellClasses.frame}>
        <aside className={siteShellClasses.sidebar}>
          <nav className={siteShellClasses.sidebarNav} aria-label={props.navigationLabel}>
            {props.utilityNavigation}
          </nav>
        </aside>
        <div className={siteShellClasses.content}>
          <nav className={siteShellClasses.breadcrumb} aria-label={props.breadcrumbLabel}>
            {props.breadcrumb}
          </nav>
          {props.children}
        </div>
      </div>
      <footer className={siteShellClasses.footer}>
        <div className={siteShellClasses.footerInner}>
          <span>{props.footerNote}</span>
          <nav className={siteShellClasses.footerLinks} aria-label={props.navigationLabel}>
            {props.footerNavigation}
          </nav>
        </div>
      </footer>
    </>
  );
}
