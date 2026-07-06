import { type z } from 'zod';

export class SchemaParseError extends Error {
  readonly issues: readonly SchemaParseIssue[];

  constructor(subject: string, issues: readonly SchemaParseIssue[]) {
    super(`Schema validation failed for ${subject}`);
    this.name = 'SchemaParseError';
    this.issues = issues;
  }
}

export interface SchemaParseIssue {
  readonly path: string;
  readonly message: string;
}

export type SafeParseOutcome<TOutput> =
  | { readonly success: true; readonly data: TOutput }
  | { readonly success: false; readonly issues: readonly SchemaParseIssue[] };

function toParseIssues(error: z.ZodError): readonly SchemaParseIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}

/**
 * Parse `value` against `schema`, throwing an app-owned SchemaParseError
 * (never a raw vendor error) when validation fails.
 */
export function parseSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
  subject: string,
): z.output<TSchema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new SchemaParseError(subject, toParseIssues(result.error));
  }

  return result.data;
}

/**
 * Non-throwing variant returning a discriminated union with normalized issues.
 */
export function safeParseSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
): SafeParseOutcome<z.output<TSchema>> {
  const result = schema.safeParse(value);

  if (!result.success) {
    return { success: false, issues: toParseIssues(result.error) };
  }

  return { success: true, data: result.data };
}
