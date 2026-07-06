import { httpClient } from '@/packages/axios';
import { parseSchema } from '@/packages/zod';
import { buildGatewayPath } from '@/shared/api/api-routes.constants';

import type { LoginApiRequest, LoginApiResponse } from '../api/auth.api.types';
import { AUTH_ENDPOINTS } from '../constants/auth.constants';
import { loginApiResponseSchema } from '../schemas/auth.schema';

/**
 * HTTP contract layer. The session cookie is set by the gateway response —
 * no auth material is returned to JavaScript beyond the display snapshot.
 */
export async function postLoginToGateway(request: LoginApiRequest): Promise<LoginApiResponse> {
  const response = await httpClient.post<unknown>(buildGatewayPath(AUTH_ENDPOINTS.login), request);

  return parseSchema(loginApiResponseSchema, response.data, 'login response');
}
