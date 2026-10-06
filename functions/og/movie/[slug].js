import {
  fetchMovieBySlugOrId,
  getMovieRenderedSocialImage
} from '../../_seo-utils.js';

async function fetchFallbackImage(env, request) {
  return env.ASSETS.fetch(new URL('/og-preview.jpg', request.url).toString());
}

export function onRequestHead() {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: 'GET',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

export async function onRequestGet(context) {
  const { env, params, request } = context;
  const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const slug = String(rawSlug || '').replace(/\.jpg$/i, '');

  try {
    const movie = await fetchMovieBySlugOrId(env, { slug });
    const imageUrl = getMovieRenderedSocialImage(movie);

    if (!movie || !imageUrl) {
      return fetchFallbackImage(env, request);
    }

    const imageResponse = await fetch(imageUrl, {
      headers: {
        Accept: 'image/jpeg,image/*;q=0.8,*/*;q=0.5'
      }
    });

    if (!imageResponse.ok) {
      return fetchFallbackImage(env, request);
    }

    return new Response(imageResponse.body, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg'
      }
    });
  } catch (error) {
    console.error('Movie social image proxy failed:', error);
    return fetchFallbackImage(env, request);
  }
}
