export function cloneNoStoreResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export async function fetchNoStoreAsset(env, request, pathname) {
  const response = await env.ASSETS.fetch(new URL(pathname, request.url).toString());

  return cloneNoStoreResponse(response);
}
