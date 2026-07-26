export const marketingClasses = {
  page: 'mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
  hero: 'relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface-raised px-6 py-14 shadow-xl sm:px-10 lg:px-16 lg:py-20',
  glow: 'pointer-events-none absolute -end-24 -top-32 -z-10 size-96 rounded-full bg-primary/20 blur-3xl',
  eyebrow: 'text-sm font-black uppercase tracking-[0.2em] text-primary',
  title: 'max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl',
  description: 'max-w-3xl text-pretty text-lg leading-8 text-muted-foreground',
  actions: 'flex flex-wrap gap-3 pt-2',
  trust:
    'rounded-2xl border border-border bg-muted/40 px-6 py-5 text-center text-sm font-bold text-muted-foreground',
  grid: 'grid gap-4 md:grid-cols-3',
  card: 'h-full bg-surface-raised',
  cardTitle: 'text-lg font-black',
  faqGrid: 'grid gap-3',
  faq: 'rounded-2xl border border-border bg-surface-raised px-5 py-4 shadow-xs',
  faqQuestion: 'cursor-pointer font-bold',
  faqAnswer: 'pt-3 leading-7 text-muted-foreground',
  contact: 'flex flex-col items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-6',
} as const;
