import 'server-only';

import { parseSchema, z } from '@/packages/zod';

const serverEnvSchema = z.object({
  SERVER_API_BASE_URL: z.url().default('http://localhost:4000'),
  SERVER_API_MOCKING: z.enum(['enabled', 'disabled']).default('enabled'),
});

export interface ServerEnv {
  readonly apiBaseUrl: string;
  readonly apiMocking: 'enabled' | 'disabled';
}

let cachedServerEnv: ServerEnv | null = null;

/**
 * Validated server-only environment. Guarded by the `server-only` marker so
 * any accidental client import fails at build time.
 */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = parseSchema(
    serverEnvSchema,
    {
      SERVER_API_BASE_URL: process.env.SERVER_API_BASE_URL,
      SERVER_API_MOCKING: process.env.SERVER_API_MOCKING,
    },
    'server environment',
  );

  cachedServerEnv = {
    apiBaseUrl: parsed.SERVER_API_BASE_URL,
    apiMocking: parsed.SERVER_API_MOCKING,
  };

  return cachedServerEnv;
}
