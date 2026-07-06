import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export type AppDateInput = string | number | Date;

/** True when the value parses to a valid date. */
export function isValidDate(value: AppDateInput): boolean {
  return dayjs(value).isValid();
}

/** Format an ISO date for display in the given locale (e.g. "March 4, 2026"). */
export function formatDisplayDate(value: AppDateInput, locale: string): string {
  const parsed = dayjs(value);

  if (!parsed.isValid()) {
    return '';
  }

  return parsed.locale(locale).format('LL');
}

/** Format an ISO date-time for display in the given locale. */
export function formatDisplayDateTime(value: AppDateInput, locale: string): string {
  const parsed = dayjs(value);

  if (!parsed.isValid()) {
    return '';
  }

  return parsed.locale(locale).format('LLL');
}

/** Relative time from now ("3 days ago") localized. */
export function formatRelativeToNow(value: AppDateInput, locale: string): string {
  const parsed = dayjs(value);

  if (!parsed.isValid()) {
    return '';
  }

  return parsed.locale(locale).fromNow();
}

/** Canonical UTC ISO-8601 string for API payloads. */
export function toIsoString(value: AppDateInput): string {
  const parsed = dayjs(value);

  if (!parsed.isValid()) {
    return '';
  }

  return parsed.utc().toISOString();
}
