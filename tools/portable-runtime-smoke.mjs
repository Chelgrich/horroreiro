import { createPortableRuntime } from '../server/runtime.js';
import { fetchMovieBySlugOrId } from '../functions/_seo-utils.js';
import sharp from 'sharp';

const runtime = createPortableRuntime({
  env: {
    APP_BUILD_VERSION: 'portable-smoke',
    SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    SUPABASE_URL: ''
  }
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchPortable(path, options = {}) {
  return runtime.handleRequest(new Request(`http://portable.test${path}`, options));
}

async function expectText(path, expectedFragment, label) {
  const response = await fetchPortable(path);
  const text = await response.text();

  assert(response.status === 200, `${label}: expected 200, got ${response.status}`);
  assert(text.includes(expectedFragment), `${label}: missing ${expectedFragment}`);

  return response;
}

async function withMutedConsoleError(callback) {
  const originalConsoleError = console.error;

  console.error = () => {};

  try {
    return await callback();
  } finally {
    console.error = originalConsoleError;
  }
}

await expectText('/', 'id="movies"', 'catalog route');
await expectText('/movie.html', 'id="moviePage"', 'movie shell route');
await expectText('/user/profile000', 'id="userPage"', 'user detail route');
await expectText('/following', 'id="followingPage"', 'following route');
await expectText('/notifications', 'id="notificationsPage"', 'notifications route');
await expectText('/editor', 'id="editorPage"', 'editor route');
await expectText('/directors', 'id="directorsAdminPage"', 'directors route');
await expectText('/name/test-director', 'id="directorPage"', 'person route');
await expectText('/production', 'id="companyAdminPage"', 'production route');
await expectText('/distributors', 'id="companyAdminPage"', 'distributors route');
await expectText('/russian-distributors', 'id="companyAdminPage"', 'russian distributors route');
await expectText('/company/test-company', 'id="companyPage"', 'company route');

const envResponse = await fetchPortable('/env');
const envText = await envResponse.text();
assert(envResponse.status === 200, `/env: expected 200, got ${envResponse.status}`);
assert(envText.includes('window.__ENV__'), '/env: missing env payload');
assert(envText.includes('portable-smoke'), '/env: missing build version');

const assetResponse = await fetchPortable('/app-assets/portable-smoke?file=app.js');
const assetText = await assetResponse.text();
assert(assetResponse.status === 200, `/app-assets: expected 200, got ${assetResponse.status}`);
assert(assetResponse.headers.get('cache-control')?.includes('no-store'), '/app-assets: expected no-store');
assert(assetText.includes('initCatalogPage'), '/app-assets: app.js payload looks wrong');

const missingAssetResponse = await fetchPortable('/app-assets/portable-smoke?file=missing.js');
assert(missingAssetResponse.status === 404, `/app-assets missing: expected 404, got ${missingAssetResponse.status}`);

const sitemapResponse = await withMutedConsoleError(() => fetchPortable('/sitemap.xml'));
const sitemapText = await sitemapResponse.text();
assert(sitemapResponse.status === 200, `/sitemap.xml: expected 200, got ${sitemapResponse.status}`);
assert(sitemapText.includes('<urlset'), '/sitemap.xml: missing urlset');

// A crawler's concurrent GET/HEAD requests should share one public movie read.
const originalFetch = globalThis.fetch;
const originalNow = Date.now;
let now = 1000000;
let movieReads = 0;
let movieTitle = 'Cached movie';
let movieExists = true;
let failNextRead = false;
const cacheEnv = { SUPABASE_URL: 'https://seo-cache.test', SUPABASE_ANON_KEY: 'public-test-key' };

try {
  Date.now = () => now;
  globalThis.fetch = async () => {
    movieReads += 1;
    if (failNextRead) {
      failNextRead = false;
      return new Response('Unavailable', { status: 503 });
    }
    return Response.json(movieExists ? [{ id: 'movie-cache-id', slug: 'cached-movie', title: movieTitle }] : []);
  };

  const cachedRuntime = createPortableRuntime({ env: cacheEnv });
  const responses = await Promise.all(Array.from({ length: 20 }, (_, i) => (
    cachedRuntime.handleRequest(new Request('http://portable.test/movie/cached-movie', {
      method: i % 2 ? 'HEAD' : 'GET'
    }))
  )));
  assert(responses.every(response => response.status === 200), 'cached movie GET/HEAD must succeed');
  assert(movieReads === 1, `20 concurrent movie GET/HEAD requests made ${movieReads} Supabase reads instead of 1`);
  assert((await responses[0].text()).includes(movieTitle), 'cached movie must preserve SEO content');

  movieTitle = 'Updated movie';
  await fetchMovieBySlugOrId(cacheEnv, { slug: 'cached-movie' });
  assert(movieReads === 1, 'warm SEO read must reuse cached data');
  now += 60001;
  const refreshedMovie = await fetchMovieBySlugOrId(cacheEnv, { slug: 'cached-movie' });
  assert(movieReads === 2 && refreshedMovie.title === movieTitle, 'SEO movie must refresh after one minute');

  await fetchMovieBySlugOrId({ ...cacheEnv, SUPABASE_ANON_KEY: 'other-key' }, { slug: 'cached-movie' });
  await fetchMovieBySlugOrId({ ...cacheEnv, SUPABASE_URL: 'https://other-project.test' }, { slug: 'cached-movie' });
  assert(movieReads === 4, 'SEO cache must isolate projects and API keys');

  movieExists = false;
  assert(await fetchMovieBySlugOrId(cacheEnv, { slug: 'new-movie' }) === null, 'missing movie must remain missing');
  movieExists = true;
  const addedMovie = await fetchMovieBySlugOrId(cacheEnv, { slug: 'new-movie' });
  assert(addedMovie?.title === movieTitle && movieReads === 6, 'a newly added movie must not be hidden by a cached miss');

  failNextRead = true;
  let readFailed = false;
  try {
    await fetchMovieBySlugOrId(cacheEnv, { slug: 'retry-movie' });
  } catch {
    readFailed = true;
  }
  assert(readFailed, 'Supabase failures must still propagate');
  await fetchMovieBySlugOrId(cacheEnv, { slug: 'retry-movie' });
  assert(movieReads === 8, 'a failed read must not poison the cache');

  await fetchMovieBySlugOrId(cacheEnv, { slug: 'oldest-movie' });
  for (let i = 0; i < 100; i += 1) {
    await fetchMovieBySlugOrId(cacheEnv, { slug: `bounded-movie-${i}` });
  }
  const readsBeforeEvictionCheck = movieReads;
  await fetchMovieBySlugOrId(cacheEnv, { slug: 'oldest-movie' });
  assert(movieReads === readsBeforeEvictionCheck + 1, 'SEO cache must evict old entries at its size limit');

} finally {
  globalThis.fetch = originalFetch;
  Date.now = originalNow;
}

console.log('Portable runtime smoke passed (20 concurrent movie GET/HEAD requests: 1 Supabase read).');
