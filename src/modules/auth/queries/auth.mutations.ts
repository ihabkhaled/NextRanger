import { useAppMutation } from '@/packages/query';

import { login } from '../services/auth.service';
import type { AuthSessionSnapshot, LoginFormValues } from '../types/auth.types';

export function useLoginMutation(): ReturnType<
  typeof useAppMutation<AuthSessionSnapshot, Error, LoginFormValues>
> {
  return useAppMutation<AuthSessionSnapshot, Error, LoginFormValues>({
    mutationFn: login,
  });
}
