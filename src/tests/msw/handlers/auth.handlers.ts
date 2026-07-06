import { delay, http, HttpResponse } from 'msw';

import { buildLoginMockResponse } from '@/modules/auth';

const LOGIN_PATH = '*/api/gateway/auth/login';

export const authHandlers = [
  http.post(LOGIN_PATH, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const response = buildLoginMockResponse(body);

    if (!response) {
      return HttpResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    return HttpResponse.json(response);
  }),
];

/** Override: login resolves slowly so pending UI states can be asserted. */
export function loginDelayedHandler(delayMs: number): (typeof authHandlers)[number] {
  return http.post(LOGIN_PATH, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    await delay(delayMs);

    return HttpResponse.json(buildLoginMockResponse(body));
  });
}
