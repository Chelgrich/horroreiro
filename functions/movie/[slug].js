import {
  createMovieHtmlResponse,
  fetchMovieBySlugOrId
} from '../_seo-utils.js';

export async function onRequestGet(context) {
  const { env, params, request } = context;
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  try {
    const movie = await fetchMovieBySlugOrId(env, { slug });

    return createMovieHtmlResponse({
      env,
      request,
      movie,
      status: movie ? 200 : 404
    });
  } catch (error) {
    console.error('Movie SEO route failed:', error);
    return env.ASSETS.fetch(new URL('/movie.html', request.url));
  }
}
