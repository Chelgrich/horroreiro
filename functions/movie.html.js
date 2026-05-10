import {
  createMovieHtmlResponse,
  fetchMovieBySlugOrId,
  getMovieCanonicalUrl
} from './_seo-utils.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || '';
  const id = url.searchParams.get('id') || '';

  if (!slug && !id) {
    return env.ASSETS.fetch(request);
  }

  let movie = null;

  try {
    movie = await fetchMovieBySlugOrId(env, { slug, id });
  } catch (error) {
    console.error('Legacy movie SEO route failed:', error);
    return env.ASSETS.fetch(request);
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
