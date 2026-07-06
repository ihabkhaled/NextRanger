import { postLoginToGateway } from '../gateway/auth.gateway';
import { mapLoginFormToApiRequest, mapLoginResponseToSession } from '../mappers/auth.mapper';
import type { AuthSessionSnapshot, LoginFormValues } from '../types/auth.types';

/** Use-case: sign in. Returns the client-safe session snapshot. */
export async function login(values: LoginFormValues): Promise<AuthSessionSnapshot> {
  const response = await postLoginToGateway(mapLoginFormToApiRequest(values));

  return mapLoginResponseToSession(response);
}
