import { headers } from 'next/headers';

export async function getRequestNonce(): Promise<string | undefined> {
  const requestHeaders = await headers();
  return requestHeaders.get('x-nonce') ?? undefined;
}
