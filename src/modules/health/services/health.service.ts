import { toIsoString } from '@/packages/date';

import { HEALTH_STATUS } from '../constants/health.constants';
import type { HealthReport } from '../types/health.types';

/** Liveness payload served by /api/health. */
export function buildHealthReport(): HealthReport {
  return {
    status: HEALTH_STATUS.Ok,
    checkedAt: toIsoString(Date.now()),
  };
}
