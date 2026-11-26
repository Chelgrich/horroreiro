const MAX_BODY_BYTES = 64 * 1024;
const REQUEST_HEADERS = ['authorization', 'apikey', 'content-type', 'accept', 'prefer', 'range', 'range-unit', 'accept-profile', 'content-profile', 'x-client-info', 'x-supabase-api-version'];
const RESPONSE_HEADERS = ['content-type', 'content-range', 'range-unit', 'preference-applied', 'retry-after', 'www-authenticate'];
const PERF_READ_PATHS = new Set([
  '/rest/v1/movies', '/rest/v1/movie_rating_stats', '/rest/v1/movie_poster_images',
  '/rest/v1/rpc/get_profile_activity_preview', '/rest/v1/rpc/get_profile_activity_summary'
]);

function failure(status, message) {
  return new Response(JSON.stringify({ message }), { status, headers: {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store'
  } });
}

async function readBody(request) {
  if (!request.body) return undefined;
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw Object.assign(new Error('Body too large'), { status: 413 });
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return body;
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname.slice('/supabase'.length);
  if (!/^\/(rest|auth)\/v1(?:\/|$)/.test(path)) return failure(404, 'Not found');
  if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return failure(405, 'Method not allowed');
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return failure(503, 'Database connection is not configured');
  if ((request.headers.get('origin') && request.headers.get('origin') !== url.origin) ||
      request.headers.get('apikey') !== env.SUPABASE_ANON_KEY) return failure(403, 'Forbidden');

  try {
    // Fixed configured upstream; caller credentials keep Supabase RLS/Auth in control.
    const upstream = new URL(env.SUPABASE_URL);
    if (upstream.protocol !== 'https:') return failure(503, 'Invalid database connection');
    upstream.pathname = path;
    upstream.search = url.search;
    const headers = new Headers();
    for (const name of REQUEST_HEADERS) {
      if (request.headers.has(name)) headers.set(name, request.headers.get(name));
    }
    const measure = request.method === 'GET' && request.headers.get('x-horroreiro-perf') === '1' && PERF_READ_PATHS.has(path);
    const upstreamStartedAt = measure ? performance.now() : 0;
    const response = await fetch(upstream, {
      method: request.method, headers, body: await readBody(request),
      redirect: 'error', signal: AbortSignal.timeout(15000)
    });
    const upstreamHeadersMs = measure ? Math.round(performance.now() - upstreamStartedAt) : 0;
    const responseHeaders = new Headers({ 'Cache-Control': 'no-store' });
    for (const name of RESPONSE_HEADERS) {
      if (response.headers.has(name)) responseHeaders.set(name, response.headers.get(name));
    }
    if (measure) responseHeaders.set('Server-Timing', `supabase_headers;dur=${upstreamHeadersMs}`);
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch (error) {
    return error?.status === 413
      ? failure(413, 'Request body is too large')
      : failure(502, 'Database connection is temporarily unavailable');
  }
}
