import { parseSchema, z } from '@/packages/zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['local', 'test', 'staging', 'production']).default('local'),
  NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
});

/**
 * NEXT_PUBLIC_* values must be referenced with static dot-access so Next.js
 * can inline them into the client bundle at build time.
 */
const rawPublicEnv = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

const parsed = parseSchema(publicEnvSchema, rawPublicEnv, 'public environment');

export interface PublicEnv {
  readonly appEnv: 'local' | 'test' | 'staging' | 'production';
  readonly appUrl: string;
}

/**
 * Validated client-safe environment. Never contains secrets.
 */
export const publicEnv: PublicEnv = {
  appEnv: parsed.NEXT_PUBLIC_APP_ENV,
  appUrl: parsed.NEXT_PUBLIC_APP_URL,
};
