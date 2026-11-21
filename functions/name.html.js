import { fetchNoStoreAsset } from './_response-utils.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug')?.trim();
  if (slug && slug !== '.' && slug !== '..') return Response.redirect(new URL(`/name/${encodeURIComponent(slug)}`, url), 301);

  return fetchNoStoreAsset(env, request, '/name.html');
}
