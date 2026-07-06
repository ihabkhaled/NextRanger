/**
 * Owner wrapper for the canonical date library (dayjs). App code formats and
 * parses dates only through this facade; raw dayjs/date-fns imports elsewhere
 * are an ESLint boundary violation.
 */

export {
  formatDisplayDate,
  formatDisplayDateTime,
  formatRelativeToNow,
  isValidDate,
  toIsoString,
  type AppDateInput,
} from './app-date';
