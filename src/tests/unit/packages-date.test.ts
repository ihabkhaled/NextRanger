import { describe, expect, it } from 'vitest';

import {
  formatDisplayDate,
  formatDisplayDateTime,
  formatRelativeToNow,
  isValidDate,
  toIsoString,
} from '@/packages/date';

const ISO = '2026-03-04T12:30:00.000Z';

describe('isValidDate', () => {
  it('accepts ISO strings and rejects garbage', () => {
    expect(isValidDate(ISO)).toBe(true);
    expect(isValidDate('not-a-date')).toBe(false);
  });
});

describe('formatDisplayDate', () => {
  it('formats per locale', () => {
    expect(formatDisplayDate(ISO, 'en')).toContain('2026');
    expect(formatDisplayDate(ISO, 'ar')).not.toBe(formatDisplayDate(ISO, 'en'));
  });

  it('returns an empty string for invalid input', () => {
    expect(formatDisplayDate('garbage', 'en')).toBe('');
  });
});

describe('formatDisplayDateTime', () => {
  it('includes a time component', () => {
    expect(formatDisplayDateTime(ISO, 'en')).toMatch(/\d{1,2}:\d{2}/);
  });

  it('returns an empty string for invalid input', () => {
    expect(formatDisplayDateTime('garbage', 'en')).toBe('');
  });
});

describe('formatRelativeToNow', () => {
  it('describes past dates relatively', () => {
    expect(formatRelativeToNow('2020-01-01T00:00:00.000Z', 'en')).toContain('years ago');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatRelativeToNow('garbage', 'en')).toBe('');
  });
});

describe('toIsoString', () => {
  it('produces a canonical UTC ISO string', () => {
    expect(toIsoString(ISO)).toBe(ISO);
    expect(toIsoString(new Date(ISO))).toBe(ISO);
  });

  it('returns an empty string for invalid input', () => {
    expect(toIsoString('garbage')).toBe('');
  });
});
