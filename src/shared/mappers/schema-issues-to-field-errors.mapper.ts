import type { SchemaParseIssue } from '@/packages/zod';

/**
 * Convert schema issues into a field → message map for form display. The
 * first issue per field wins (matching how users fix forms top-down).
 */
export function mapSchemaIssuesToFieldErrors(
  issues: readonly SchemaParseIssue[],
): Readonly<Record<string, string>> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const field = issue.path || '_root';

    if (!(field in fieldErrors)) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
