export const homeClasses = {
  hero: 'relative isolate overflow-hidden rounded-3xl border border-border bg-surface-raised/85 px-6 py-12 shadow-xl shadow-shadow/5 sm:px-10 sm:py-16 lg:px-16 lg:py-20',
  heroGlow:
    'pointer-events-none absolute -end-24 -top-24 -z-10 size-80 rounded-full bg-primary/15 blur-3xl',
  actions: 'pt-2',
  principlesCard: 'overflow-hidden bg-surface/80 p-0',
  principlesHeader: 'border-b border-border bg-muted/45 px-6 py-5 sm:px-8',
  principlesContent: 'p-6 sm:p-8',
  principleList:
    'grid list-none gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2 [&>li]:rounded-xl [&>li]:border [&>li]:border-border [&>li]:bg-surface-raised [&>li]:p-4 [&>li]:shadow-xs',
} as const;
