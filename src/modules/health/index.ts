/**
 * Public surface of the health module.
 */

export { HEALTH_STATUS, type HealthStatusValue } from './constants/health.constants';
export { buildHealthReport } from './services/health.service';
export type { HealthReport } from './types/health.types';
