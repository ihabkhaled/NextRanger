export const GATEWAY_JSON_HEADERS = {
  'content-type': 'application/json',
} as const;

export const GATEWAY_HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  badGateway: 502,
} as const;
