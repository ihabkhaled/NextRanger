export const appHeaderClasses = {
  root: 'sticky top-0 z-40 border-b border-border/80 bg-surface/85 px-4 py-3 shadow-sm shadow-shadow/5 backdrop-blur-xl sm:px-6',
  inner: 'mx-auto max-w-7xl',
  brand:
    'inline-flex shrink-0 items-center gap-2 text-sm font-bold tracking-tight text-foreground before:size-2.5 before:rounded-full before:bg-primary before:shadow-[0_0_0_5px_color-mix(in_oklch,var(--role-primary)_14%,transparent)]',
  nav: 'min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  navLink:
    'inline-flex min-h-9 items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
} as const;
