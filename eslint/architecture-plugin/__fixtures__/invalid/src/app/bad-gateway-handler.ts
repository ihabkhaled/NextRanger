// FIXTURE: deliberate violation for no-inline-declarations in app route helpers.
const GATEWAY_TIMEOUT = 5_000;

function badProxy(): Response {
  void GATEWAY_TIMEOUT;
  return Response.json({ ok: true });
}

export function badGatewayHandler(): Response {
  return badProxy();
}
