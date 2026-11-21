import { versionedClientAssets } from '../../client-assets.js';
import { cloneNoStoreResponse } from '../_response-utils.js';

const ALLOWED_APP_ASSETS = new Set(versionedClientAssets);

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const filename = String(url.searchParams.get('file') || '').trim();

  if (!ALLOWED_APP_ASSETS.has(filename)) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }

  const response = await env.ASSETS.fetch(new URL(`/${filename}`, request.url).toString());
  const currentBuild = env.CF_PAGES_COMMIT_SHA || env.APP_BUILD_VERSION || 'dev';
  if (response.status !== 200 || !filename.endsWith('.js') || params?.version !== currentBuild) {
    return cloneNoStoreResponse(response);
  }

  const body = await response.arrayBuffer();
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', body));
  const digest = Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
  // A gateway can compress the same script after the application has hashed it.
  const etag = `W/"${digest}"`;
  const cacheHeaders = new Headers({ 'Cache-Control': 'private, no-cache', ETag: etag });
  const vary = response.headers.get('Vary');
  if (vary) cacheHeaders.set('Vary', vary);

  const validators = request.headers.get('If-None-Match')?.trim() || '';
  if (validators === '*' || validators.split(',').some(tag => tag.trim().replace(/^W\//, '') === etag.slice(2))) {
    return new Response(null, { status: 304, headers: cacheHeaders });
  }

  const headers = new Headers(response.headers);
  cacheHeaders.forEach((value, name) => headers.set(name, value));
  headers.set('Content-Length', String(body.byteLength));
  return new Response(request.method === 'HEAD' ? null : body, { headers });
}

export const onRequestHead = onRequestGet;
