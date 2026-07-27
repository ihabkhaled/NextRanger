export const siteShellClasses = {
  body: 'min-h-dvh bg-canvas font-sans text-foreground antialiased',
  header: 'sticky top-0 z-50 border-b-2 border-foreground bg-canvas px-4 py-3 sm:px-6',
  headerInner: 'mx-auto flex max-w-[90rem] items-center justify-between gap-4',
  brand: 'inline-flex items-center gap-3 text-sm font-black tracking-tight text-foreground',
  brandMark:
    'grid size-9 place-items-center border-2 border-foreground bg-warning font-mono text-foreground shadow-[3px_3px_0_var(--role-foreground)]',
  desktopNav: 'hidden items-center gap-1 lg:flex',
  navLink:
    'rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  navLinkCurrent:
    'font-black text-foreground after:mx-auto after:mt-1 after:block after:h-0.5 after:w-5 after:bg-primary after:content-[""]',
  controls: 'flex items-center gap-2',
  localeSelect: 'h-9 max-w-32 py-0',
  mobileMenu: 'relative lg:hidden',
  mobileSummary:
    'cursor-pointer list-none rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm font-bold',
  mobilePanel:
    'absolute end-0 top-12 z-50 grid min-w-60 gap-1 border-2 border-foreground bg-surface-raised p-3 shadow-[6px_6px_0_var(--role-primary)]',
  frame: 'mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[90rem] lg:grid-cols-[15rem_minmax(0,1fr)]',
  sidebar: 'hidden border-e border-border/70 bg-surface/55 p-5 lg:block',
  sidebarNav: 'sticky top-24 grid gap-1',
  content: 'min-w-0',
  breadcrumb:
    'mx-auto flex max-w-7xl items-center gap-2 px-4 pt-5 text-xs font-semibold text-muted-foreground sm:px-6 lg:px-8',
  main: 'relative min-h-[60dvh] overflow-hidden',
  footer: 'border-t border-border/70 bg-surface/70 px-4 py-8 sm:px-6',
  footerInner:
    'mx-auto flex max-w-[90rem] flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
  footerLinks: 'flex flex-wrap gap-4',
  themeButton: 'size-9 rounded-xl px-0',
} as const;
