import {
  createMovieHtmlResponse,
  fetchMovieBySlugOrId,
  getMovieCanonicalUrl
} from './_seo-utils.js';
import { fetchNoStoreAsset } from './_response-utils.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || '';
  const id = url.searchParams.get('id') || '';

  if (!slug && !id) {
    return fetchNoStoreAsset(env, request, '/movie.html');
  }

  let movie = null;

  try {
    movie = await fetchMovieBySlugOrId(env, { slug, id });
  } catch (error) {
    console.error('Legacy movie SEO route failed:', error);
    return fetchNoStoreAsset(env, request, '/movie.html');
  }

  if (movie?.slug) {
    const canonicalPath = new URL(getMovieCanonicalUrl(movie)).pathname;
    return Response.redirect(new URL(canonicalPath, request.url).toString(), 301);
  }

  return createMovieHtmlResponse({
    env,
    request,
    movie,
    status: movie ? 200 : 404
  });
}
