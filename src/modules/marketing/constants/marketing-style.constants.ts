export const marketingClasses = {
  page: 'mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
  hero: 'relative isolate overflow-hidden border-y-2 border-foreground bg-surface-raised px-6 py-14 shadow-[8px_8px_0_var(--role-primary)] sm:px-10 lg:grid lg:min-h-[30rem] lg:content-center lg:px-16 lg:py-20',
  eyebrow: 'font-mono text-xs font-black uppercase tracking-[0.24em] text-primary',
  title:
    'max-w-5xl text-balance text-4xl font-black leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-7xl',
  description: 'max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl',
  actions: 'flex flex-wrap gap-3 pt-3',
  trust:
    'border-s-4 border-warning bg-surface-raised px-6 py-5 text-start font-mono text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground',
  grid: 'grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3',
  card: 'h-full rounded-none border-0 bg-surface-raised shadow-none',
  cardTitle: 'font-mono text-sm font-black uppercase tracking-[0.08em] text-primary',
  faqGrid: 'grid gap-3',
  faq: 'border-s-4 border-primary bg-surface-raised px-5 py-4 shadow-sm',
  faqQuestion: 'cursor-pointer font-bold',
  faqAnswer: 'pt-3 leading-7 text-muted-foreground',
  contact:
    'flex flex-col items-start gap-3 border border-border bg-surface-raised p-6 shadow-[6px_6px_0_var(--role-primary)]',
} as const;
