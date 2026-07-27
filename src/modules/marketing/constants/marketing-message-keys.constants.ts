export const MARKETING_MESSAGE_KEYS = {
  pages: {
    home: 'home',
    about: 'about',
    features: 'features',
    faq: 'faq',
    contact: 'contact',
  },
  primaryAction: 'primaryAction',
  secondaryAction: 'secondaryAction',
  trustLabel: 'trustLabel',
  routeAtlasLabel: 'routeAtlasLabel',
  highlights: ['highlights.one', 'highlights.two', 'highlights.three'],
  questions: ['questions.one', 'questions.two', 'questions.three'],
  principlesTitle: 'principlesTitle',
  principles: [
    'principleComponents',
    'principleBoundaries',
    'principleServerFirst',
    'principleTesting',
  ],
  contactAction: 'contactAction',
  contactNote: 'contactNote',
} as const;

export const MARKETING_ATLAS_STATIONS = [
  { kind: 'home', navKey: 'home', code: '01' },
  { kind: 'about', navKey: 'about', code: '02' },
  { kind: 'features', navKey: 'features', code: '03' },
  { kind: 'faq', navKey: 'faq', code: '04' },
  { kind: 'contact', navKey: 'contact', code: '05' },
] as const;
