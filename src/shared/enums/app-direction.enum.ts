export const AppDirection = {
  Ltr: 'ltr',
  Rtl: 'rtl',
} as const;

export type AppDirectionValue = (typeof AppDirection)[keyof typeof AppDirection];
