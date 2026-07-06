import { describe, expect, it } from 'vitest';

import { HEALTH_STATUS } from '../constants/health.constants';
import { buildHealthReport } from '../services/health.service';

describe('buildHealthReport', () => {
  it('reports ok with a valid ISO timestamp', () => {
    const report = buildHealthReport();

    expect(report.status).toBe(HEALTH_STATUS.Ok);
    expect(new Date(report.checkedAt).toISOString()).toBe(report.checkedAt);
  });
});
