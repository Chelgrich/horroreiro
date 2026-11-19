import {
  createMovieHtmlResponse,
  fetchMovieBySlugOrId
} from '../_seo-utils.js';
import { fetchNoStoreAsset } from '../_response-utils.js';

export async function onRequestHead(context) {
  const response = await onRequestGet(context);

  return new Response(null, {
    status: response.status,
    headers: response.headers
  });
}

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
    return fetchNoStoreAsset(env, request, '/movie.html');
  }
}
