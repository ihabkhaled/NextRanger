/**
 * Owner wrapper for `zod`. All schema building and validation flows through
 * this facade; raw `zod` imports elsewhere are an ESLint boundary violation.
 */

export { z } from 'zod';
export {
  parseSchema,
  safeParseSchema,
  SchemaParseError,
  type SafeParseOutcome,
  type SchemaParseIssue,
} from './parse-schema';
