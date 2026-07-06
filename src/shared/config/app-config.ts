import { publicEnv } from '@/packages/env';

export interface AppConfig {
  readonly appName: string;
  readonly appEnv: 'local' | 'test' | 'staging' | 'production';
  readonly appUrl: string;
  readonly isProduction: boolean;
}

/** Derived, validated application configuration. */
export const appConfig: AppConfig = {
  appName: 'Strict Next Ranger',
  appEnv: publicEnv.appEnv,
  appUrl: publicEnv.appUrl,
  isProduction: publicEnv.appEnv === 'production',
};
