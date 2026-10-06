import sharp from 'sharp';

import {
  MOVIE_SOCIAL_IMAGE_HEIGHT,
  MOVIE_SOCIAL_IMAGE_WIDTH,
  fetchMovieBySlugOrId
} from '../functions/_seo-utils.js';

const IMAGE_CACHE = new Map();
const IMAGE_CACHE_LIMIT = 80;

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

async function fetchPosterBuffer(url) {
  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8,*/*;q=0.5'
    }
  });

  if (!response.ok) {
    return null;
  }

  return Buffer.from(await response.arrayBuffer());
}

async function createMovieSocialImage(posterBuffer) {
  const background = await sharp(posterBuffer)
    .resize(MOVIE_SOCIAL_IMAGE_WIDTH, MOVIE_SOCIAL_IMAGE_HEIGHT, {
      fit: 'cover',
      position: 'centre'
    })
    .blur(22)
    .modulate({ brightness: 0.38, saturation: 0.85 })
    .jpeg({
      quality: 90,
      progressive: false,
      mozjpeg: false
    })
    .toBuffer();

  const foreground = await sharp(posterBuffer)
    .resize(MOVIE_SOCIAL_IMAGE_WIDTH, MOVIE_SOCIAL_IMAGE_HEIGHT, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: false
    })
    .png()
    .toBuffer();

  return sharp(background)
    .composite([{ input: foreground, gravity: 'centre' }])
    .jpeg({
      quality: 90,
      progressive: false,
      mozjpeg: false
    })
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

    if (!movie?.poster_url) {
      return getFallbackImageResponse(env, request, method);
    }

    const cacheKey = `${slug}:${movie.poster_url}`;
    const cachedBuffer = IMAGE_CACHE.get(cacheKey);

    if (cachedBuffer) {
      return createImageResponse(cachedBuffer, method);
    }

    const posterBuffer = await fetchPosterBuffer(movie.poster_url);

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
