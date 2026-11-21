import { fetchNoStoreAsset } from './_response-utils.js';

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug')?.trim();
  if (slug && slug !== '.' && slug !== '..') return Response.redirect(new URL(`/company/${encodeURIComponent(slug)}`, url), 301);
  return fetchNoStoreAsset(env, request, '/company.html');
}
