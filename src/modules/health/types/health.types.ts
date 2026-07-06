import type { HealthStatusValue } from '../constants/health.constants';

export interface HealthReport {
  readonly status: HealthStatusValue;
  readonly checkedAt: string;
}
