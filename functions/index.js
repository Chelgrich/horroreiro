function cloneNoStoreResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const response = await env.ASSETS.fetch(new URL('/index.html', request.url).toString());

  return cloneNoStoreResponse(response);
}
