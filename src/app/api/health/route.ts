import { buildHealthReport } from '@/modules/health';

/** Liveness probe: proves the app boots, routes, and serializes. */
export function GET(): Response {
  return Response.json(buildHealthReport());
}
