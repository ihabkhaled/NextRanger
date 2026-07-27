export const marketingClasses = {
  page: 'mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
  contentStack: 'grid gap-10',
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
  atlas: 'overflow-hidden border-2 border-foreground bg-surface-raised',
  atlasHeader:
    'grid gap-4 border-b border-border px-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] md:px-8',
  atlasLabel:
    'font-mono text-xs font-black uppercase tracking-[0.2em] text-primary-readable md:col-span-2',
  atlasTitle: 'max-w-3xl text-3xl font-black leading-tight tracking-[-0.03em] sm:text-4xl',
  atlasDescription: 'max-w-2xl leading-7 text-muted-foreground md:justify-self-end',
  atlasStations:
    'relative grid gap-px bg-border before:absolute before:start-7 before:top-0 before:bottom-0 before:w-1 before:bg-primary md:grid-cols-5 md:before:start-0 md:before:end-0 md:before:top-8 md:before:bottom-auto md:before:h-1 md:before:w-auto',
  atlasStation:
    'relative z-10 grid min-h-40 grid-cols-[2.25rem_1fr] content-start gap-x-3 gap-y-2 bg-surface-raised px-5 py-5 md:min-h-56 md:grid-cols-1 md:content-between md:gap-3 md:px-4',
  atlasNode:
    'grid size-6 place-items-center border-2 border-foreground bg-warning font-mono text-[0.625rem] font-black text-foreground shadow-[2px_2px_0_var(--role-foreground)]',
  atlasPath:
    'self-center overflow-hidden text-ellipsis font-mono text-xs font-bold text-primary-readable md:self-auto',
  atlasLink:
    'col-start-2 text-lg font-black underline decoration-primary decoration-2 underline-offset-4 md:col-start-1',
  atlasStationDescription:
    'col-start-2 text-sm leading-6 text-muted-foreground md:col-start-1 md:line-clamp-4',
  editorial:
    'grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]',
  editorialHeader:
    'grid content-start gap-4 border-s-8 border-warning bg-foreground px-6 py-10 text-canvas sm:px-8',
  editorialEyebrow: 'font-mono text-xs font-black uppercase tracking-[0.2em] text-canvas',
  editorialTitle: 'text-3xl font-black leading-tight tracking-[-0.03em] sm:text-4xl',
  editorialDescription: 'max-w-xl leading-7 text-border',
  editorialContent: 'bg-surface-raised',
  principles: 'grid h-full',
  principle:
    'grid grid-cols-[3rem_1fr] items-start gap-4 border-b border-border px-6 py-6 last:border-b-0 sm:px-8',
  principleIndex: 'font-mono text-sm font-black text-primary-readable',
  principleText: 'max-w-2xl text-lg font-bold leading-7',
  faqGrid: 'grid gap-3',
  faq: 'border-s-4 border-primary bg-surface-raised px-5 py-4 shadow-sm',
  faqQuestion: 'cursor-pointer font-bold',
  faqAnswer: 'pt-3 leading-7 text-muted-foreground',
  contact:
    'flex flex-col items-start gap-3 border border-border bg-surface-raised p-6 shadow-[6px_6px_0_var(--role-primary)]',
} as const;
