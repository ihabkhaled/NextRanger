import { handleGatewayRequest } from './gateway-handler';

/** All BFF traffic enters here and delegates to the gateway handler. */
async function forwardToGateway(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await context.params;

  return handleGatewayRequest(request, path);
}

export {
  forwardToGateway as DELETE,
  forwardToGateway as GET,
  forwardToGateway as POST,
  forwardToGateway as PUT,
};
