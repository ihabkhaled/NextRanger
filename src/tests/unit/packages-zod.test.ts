import { describe, expect, it } from 'vitest';

import { parseSchema, safeParseSchema, SchemaParseError, z } from '@/packages/zod';

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().nonnegative(),
});

describe('parseSchema', () => {
  it('returns the parsed value on success', () => {
    expect(parseSchema(schema, { name: 'A', age: 3 }, 'person')).toEqual({ name: 'A', age: 3 });
  });

  it('throws an app-owned SchemaParseError with normalized issues on failure', () => {
    let caught: unknown;

    try {
      parseSchema(schema, { name: '', age: -1 }, 'person');
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(SchemaParseError);

    const schemaError = caught as SchemaParseError;

    expect(schemaError.message).toContain('person');
    expect(schemaError.issues.length).toBeGreaterThanOrEqual(2);
    expect(typeof schemaError.issues[0]?.path).toBe('string');
    expect(typeof schemaError.issues[0]?.message).toBe('string');
  });
});

describe('safeParseSchema', () => {
  it('returns a success outcome with data', () => {
    const outcome = safeParseSchema(schema, { name: 'A', age: 0 });

    expect(outcome).toEqual({ success: true, data: { name: 'A', age: 0 } });
  });

  it('returns normalized issues with dotted paths on failure', () => {
    const nested = z.object({ profile: z.object({ email: z.email() }) });
    const outcome = safeParseSchema(nested, { profile: { email: 'nope' } });

    expect(outcome.success).toBe(false);

    const issues = outcome.success ? [] : outcome.issues;

    expect(issues[0]?.path).toBe('profile.email');
  });
});
