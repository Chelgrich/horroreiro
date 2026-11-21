import sharp from 'sharp';

import {
  fetchMovieBySlugOrId,
  getMoviePosterSource,
  isPublicMoviePosterUrl
} from '../functions/_seo-utils.js';

const IMAGE_CACHE = new Map();
const IMAGE_CACHE_LIMIT = 80;
const MAX_POSTER_BYTES = 8 * 1024 * 1024;
const MAX_POSTER_PIXELS = 8_000_000;
const POSTER_TIMEOUT_MS = 5000;

function setCacheValue(key, value) {
  if (IMAGE_CACHE.has(key)) {
    IMAGE_CACHE.delete(key);
  }

  IMAGE_CACHE.set(key, value);

  while (IMAGE_CACHE.size > IMAGE_CACHE_LIMIT) {
    const oldestKey = IMAGE_CACHE.keys().next().value;
    IMAGE_CACHE.delete(oldestKey);
  }
}

async function fetchFallbackImage(env, request) {
  return env.ASSETS.fetch(new URL('/og-preview.jpg', request.url).toString());
}

async function getFallbackImageResponse(env, request, method) {
  const response = await fetchFallbackImage(env, request);

  if (method === 'HEAD') {
    return new Response(null, {
      status: response.status,
      headers: response.headers
    });
  }

  return response;
}

async function fetchPosterBuffer(url, env) {
  if (!isPublicMoviePosterUrl(url, env)) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), POSTER_TIMEOUT_MS);
  let response;
  let reader;
  try {
    response = await fetch(url, {
      redirect: 'error',
      signal: controller.signal,
      headers: {
        Accept: 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8,*/*;q=0.5'
      }
    });
    if (!response.ok || !response.body || Number(response.headers.get('content-length')) > MAX_POSTER_BYTES) {
      return null;
    }
    reader = response.body.getReader();
    const chunks = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_POSTER_BYTES) return null;
      chunks.push(value);
    }
    return bytes ? Buffer.concat(chunks, bytes) : null;
  } finally {
    clearTimeout(timeout);
    controller.abort();
    // Cancellation must not delay the fallback if the remote stream misbehaves.
    const cancellation = reader ? reader.cancel() : response?.body?.cancel();
    cancellation?.catch(() => {});
  }
}

function createMovieSocialImage(posterBuffer) {
  return sharp(posterBuffer, { limitInputPixels: MAX_POSTER_PIXELS })
    .autoOrient()
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, progressive: false })
    .toBuffer();
}

function createImageResponse(buffer, method) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    'Content-Type': 'image/jpeg',
    'Content-Length': String(buffer.length)
  };

  return new Response(method === 'HEAD' ? null : buffer, {
    status: 200,
    headers
  });
}

export async function handleMovieSocialImageRequest(context) {
  const { env, params, request } = context;
  const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const slug = String(rawSlug || '').replace(/\.jpg$/i, '');
  const method = request.method;

  if (!['GET', 'HEAD'].includes(method)) {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  try {
    const movie = await fetchMovieBySlugOrId(env, { slug });
    const poster = getMoviePosterSource(movie);

    if (!poster) {
      return getFallbackImageResponse(env, request, method);
    }

    const cacheKey = `${slug}:${poster}`;
    const cachedBuffer = IMAGE_CACHE.get(cacheKey);

    if (cachedBuffer) {
      return createImageResponse(cachedBuffer, method);
    }

    const posterBuffer = await fetchPosterBuffer(poster, env);

    if (!posterBuffer) {
      return getFallbackImageResponse(env, request, method);
    }

    const imageBuffer = await createMovieSocialImage(posterBuffer);
    setCacheValue(cacheKey, imageBuffer);

    return createImageResponse(imageBuffer, method);
  } catch (error) {
    console.error('Portable movie social image failed:', error);
    return getFallbackImageResponse(env, request, method);
  }
}
