import { parseSchema, z } from '@/packages/zod';

import { parsePublicSiteOrigin } from './public-site-origin';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['local', 'test', 'staging', 'production']).default('local'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_CONTACT_EMAIL: z.email().optional(),
});

/**
 * NEXT_PUBLIC_* values must be referenced with static dot-access so Next.js
 * can inline them into the client bundle at build time.
 */
const rawPublicEnv = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
};

const parsed = parseSchema(publicEnvSchema, rawPublicEnv, 'public environment');
const appUrl = parsePublicSiteOrigin(parsed.NEXT_PUBLIC_APP_URL, parsed.NEXT_PUBLIC_APP_ENV);

export interface PublicEnv {
  readonly appEnv: 'local' | 'test' | 'staging' | 'production';
  readonly appUrl: string;
  readonly contactEmail: string | null;
}

/**
 * Validated client-safe environment. Never contains secrets.
 */
export const publicEnv: PublicEnv = {
  appEnv: parsed.NEXT_PUBLIC_APP_ENV,
  appUrl,
  contactEmail: parsed.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
};
