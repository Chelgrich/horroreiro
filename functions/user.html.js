import { fetchNoStoreAsset } from './_response-utils.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle')?.trim();
  if (/^[A-Za-z0-9_-]{3,80}$/.test(handle || '')) return Response.redirect(new URL(`/user/${encodeURIComponent(handle)}`, url), 301);

  return fetchNoStoreAsset(env, request, '/user.html');
}
