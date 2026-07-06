export const HEALTH_STATUS = {
  Ok: 'ok',
} as const;

export type HealthStatusValue = (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];
