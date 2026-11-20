import { createPortableRuntime, createRequestFromNodeMessage } from '../server/runtime.js';
import { fetchMovieBySlugOrId } from '../functions/_seo-utils.js';
import { handleMovieSocialImageRequest } from '../server/movie-social-image.js';
import sharp from 'sharp';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { Readable } from 'node:stream';

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
await expectText('/', '<meta name="app-build-version" content="portable-smoke">', 'early stylesheet build hint');

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
const sdkResponse = await expectText('/assets/vendor/supabase-2.119.0.js', 'createClient', 'self-hosted Supabase SDK');
assert(sdkResponse.headers.get('cache-control')?.includes('immutable'), 'Pinned SDK must be browser-cacheable');
assert((await fetchPortable('/supabase/rest/v1/movies')).status === 503, 'Unconfigured proxy must fail closed');

// Use fake secrets so a failed assertion never reads real deployment credentials.
const fixtureRoot = await mkdtemp(join(tmpdir(), 'horroreiro-static-'));
try {
  const privatePaths = [
    '/deploy/yandex/production.env.local', '/.env', '/AGENTS.md', '/package.json',
    '/server/private.js', '/functions/private.js', '/node_modules/test/private.json',
    '/unexpected.js', '/assets/unpublished.js'
  ];
  for (const path of privatePaths) {
    const file = join(fixtureRoot, path.slice(1));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, 'fake-private-content');
  }
  await writeFile(join(fixtureRoot, 'app.js'), 'public-app-fixture');
  await mkdir(join(fixtureRoot, 'private-icons'));
  await writeFile(join(fixtureRoot, 'private-icons', 'tmdb.svg'), 'fake-private-content');
  await symlink(join(fixtureRoot, 'private-icons'), join(fixtureRoot, 'icons'), 'junction');
  const fixtureRuntime = createPortableRuntime({ rootDir: fixtureRoot });
  for (const path of [...privatePaths, '/icons/tmdb.svg', '/%ZZ', '/server%2Fprivate.js']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await fixtureRuntime.handleRequest(new Request(`http://portable.test${path}`, { method }));
      assert(response.status === 404, `private static ${method} ${path}: expected 404, got ${response.status}`);
    }
  }
  const publicFixture = await fixtureRuntime.handleRequest(new Request('http://portable.test/app.js'));
  assert(publicFixture.status === 200 && await publicFixture.text() === 'public-app-fixture', 'public app asset must remain accessible');
} finally {
  assert(dirname(fixtureRoot) === resolve(tmpdir()) && basename(fixtureRoot).startsWith('horroreiro-static-'), 'unexpected fixture cleanup target');
  await rm(fixtureRoot, { recursive: true, force: true });
}
for (const path of ['/boot-loader.js', '/app-script-loader.js', '/styles.css', '/icons/tmdb.svg', '/assets/og/astral-20261006-a.jpg', '/og-preview.jpg']) {
  const response = await fetchPortable(path);
  assert(response.status === 200, `public static ${path}: expected 200, got ${response.status}`);
}
const wordmarkResponse = await fetchPortable('/icons/horroreiro-wordmark.svg');
assert(wordmarkResponse.status === 200 && wordmarkResponse.headers.get('content-type')?.startsWith('image/svg+xml'),
  'The local wordmark must be served as a public SVG');
const wordmark = await wordmarkResponse.text();
assert(wordmark.includes('<path ') && !/<text\b|font-family|@font-face/.test(wordmark),
  'The wordmark must use outlines with no runtime font dependency');

function nodeMessage(chunks, headers = {}) {
  return Object.assign(Readable.from(chunks), { method: 'POST', url: '/env', headers: { host: 'portable.test', ...headers } });
}
const smallBody = '{"movieId":"test"}';
const smallRequest = await createRequestFromNodeMessage(nodeMessage([Buffer.from(smallBody)]));
assert(await smallRequest.text() === smallBody, 'small HTTP bodies must be preserved');
const maxBody = await createRequestFromNodeMessage(nodeMessage([Buffer.alloc(64 * 1024)]));
assert((await maxBody.arrayBuffer()).byteLength === 64 * 1024, '64 KiB HTTP bodies must be accepted');
let bodyChunks = 0;
let bodyRejected = false;
try {
  await createRequestFromNodeMessage(nodeMessage((function* () {
    for (let i = 0; i < 128; i += 1) { bodyChunks += 1; yield Buffer.alloc(1024); }
  })()));
} catch (error) {
  bodyRejected = error.statusCode === 413;
}
assert(bodyRejected && bodyChunks < 70, 'oversized streamed HTTP bodies must stop early with 413');
let declaredBodyRead = false;
bodyRejected = false;
try {
  await createRequestFromNodeMessage(nodeMessage((function* () {
    declaredBodyRead = true;
    yield Buffer.from('unneeded');
  })(), { 'content-length': String(1024 * 1024) }));
} catch (error) {
  bodyRejected = error.statusCode === 413;
}
assert(bodyRejected && !declaredBodyRead, 'oversized declared HTTP bodies must be rejected before reading');

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
  globalThis.fetch = async url => {
    movieReads += 1;
    if (failNextRead) {
      failNextRead = false;
      return new Response('Unavailable', { status: 503 });
    }
    const params = new URL(url).searchParams;
    assert(params.get('select').includes('movie_companies'), 'company links must be part of the public movie read');
    assert(params.get('select').includes('movie_poster_images(image_url)') && params.get('movie_poster_images.limit') === '1',
      'the first public gallery image must be part of the same movie read');
    return Response.json(movieExists ? [{
      id: 'movie-cache-id', slug: 'cached-movie', title: movieTitle, synopsis: 'A <public> synopsis',
      poster_url: 'https://poster.test/early.webp', trailer_url: 'https://youtu.be/abcde12345_',
      movie_poster_images: [{ image_url: 'https://poster.test/russian.webp' }],
      movie_companies: [{ role: 'production', position: 0, companies: { id: 'company-id', name: 'Company "$&" <Other>', slug: 'company' } }]
    }] : []);
  };

  const cachedRuntime = createPortableRuntime({ env: cacheEnv });
  const responses = await Promise.all(Array.from({ length: 20 }, (_, i) => (
    cachedRuntime.handleRequest(new Request('http://portable.test/movie/cached-movie', {
      method: i % 2 ? 'HEAD' : 'GET'
    }))
  )));
  assert(responses.every(response => response.status === 200), 'cached movie GET/HEAD must succeed');
  assert(movieReads === 1, `20 concurrent movie GET/HEAD requests made ${movieReads} Supabase reads instead of 1`);
  const browserMovieResponse = await cachedRuntime.handleRequest(new Request('http://portable.test/movie/cached-movie'));
  const browserMovieHtml = await browserMovieResponse.text();
  const companySnapshot = browserMovieHtml.match(/<meta name="movie-company-links" content="([^"]+)">/)?.[1];
  assert(companySnapshot?.includes('Company') && companySnapshot.includes('&lt;Other&gt;') &&
    companySnapshot.includes('$&amp;'), 'relation-only companies must reach browser HTML with literal, escaped labels');
  assert(browserMovieHtml.includes('#moviePage:has(> .movie-page-server-fallback[data-server-rendered]) > .movie-page-stack-skeleton'), 'server movie intro must take the place of the startup skeleton');
  assert(/class="movie-page-title-main"[^>]*>[\s\S]*?class="movie-page-synopsis-text">A &lt;public&gt; synopsis/.test(browserMovieHtml), 'description must be escaped and in the shared intro');
  assert(/<img class="movie-page-poster"[^>]*data-original-poster-src="https:\/\/poster.test\/early.webp"/.test(browserMovieHtml), 'server poster must carry its original URL for reuse');
  assert(browserMovieHtml.includes('data-server-poster-alternate="https://poster.test/russian.webp"') &&
    !/<img class="movie-page-poster"[^>]*\ssrc=/.test(browserMovieHtml),
    'when both posters exist, browser HTML must allow selection before starting the first image request');
  assert(/class="secondary-button movie-page-rate-trigger movie-page-trailer-button" disabled/.test(browserMovieHtml), 'server trailer slot must be reserved and disabled');
  const telegramMovieResponse = await cachedRuntime.handleRequest(new Request('http://portable.test/movie/cached-movie', {
    headers: { 'User-Agent': 'TelegramBot (like TwitterBot)' }
  }));
  for (const response of [browserMovieResponse, telegramMovieResponse]) {
    assert(response.headers.get('vary')?.toLowerCase().split(/\s*,\s*/).includes('user-agent'), 'Different movie HTML representations must vary by User-Agent');
  }
  const telegramHtml = await telegramMovieResponse.text();
  assert(telegramHtml.includes('property="og:title"') && telegramHtml.includes('property="og:image"'), 'Telegram must receive metadata in the initial HTML');
  assert(!telegramHtml.includes('<script'), 'Telegram preview HTML must work without JavaScript');
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

  globalThis.fetch = async url => new URL(url).searchParams.get('select').includes('movie_companies')
    ? Response.json({ code: 'PGRST200' }, { status: 400 })
    : Response.json([{ id: 'legacy-id', slug: 'legacy-movie', title: 'Legacy movie' }]);
  const legacyHtml = await (await cachedRuntime.handleRequest(new Request('http://portable.test/movie/legacy-movie'))).text();
  assert(legacyHtml.includes('data-server-rendered="true"') && !legacyHtml.includes('name="movie-company-links"'),
    'A project without the optional company relation must still render the early movie intro');

  const poster = await sharp({ create: { width: 32, height: 48, channels: 3, background: '#402020' } }).webp().toBuffer();
  globalThis.fetch = async url => String(url).includes('/rest/v1/')
    ? Response.json([{ slug: 'preview-smoke', title: 'Preview smoke', poster_url: `${cacheEnv.SUPABASE_URL}/storage/v1/object/public/posters/preview.webp` }])
    : new Response(poster, { headers: { 'Content-Type': 'image/webp' } });
  const previewResponse = await cachedRuntime.handleRequest(new Request('http://portable.test/og/movie/preview-smoke.jpg'));
  const previewBuffer = Buffer.from(await previewResponse.arrayBuffer());
  const previewMetadata = await sharp(previewBuffer).metadata();
  assert(previewResponse.status === 200 && previewResponse.headers.get('content-type') === 'image/jpeg', 'social preview must return JPEG');
  assert(previewMetadata.width === 1200 && previewMetadata.height === 630 && !previewMetadata.isProgressive, 'social preview must remain a 1200x630 baseline JPEG');
} finally {
  globalThis.fetch = originalFetch;
  Date.now = originalNow;
}

const fallbackImage = 'safe-fallback-image';
const previewEnv = {
  ...cacheEnv,
  ASSETS: { fetch: async () => new Response(fallbackImage, { headers: { 'Content-Type': 'image/jpeg' } }) }
};
let previewCase = 0;
async function expectPreviewFallback(posterUrl, fetchPoster, label) {
  const slug = `unsafe-preview-${++previewCase}`;
  let posterReads = 0;
  globalThis.fetch = async (url, options) => {
    const parsed = new URL(url);
    if (parsed.origin === cacheEnv.SUPABASE_URL && parsed.pathname === '/rest/v1/movies') {
      return Response.json([{ slug, title: label, poster_url: posterUrl }]);
    }
    posterReads += 1;
    return fetchPoster(url, options);
  };
  const response = await withMutedConsoleError(() => handleMovieSocialImageRequest({
    env: previewEnv, params: { slug }, request: new Request(`http://portable.test/og/movie/${slug}.jpg`)
  }));
  assert(response.status === 200 && await response.text() === fallbackImage, `${label}: safe fallback missing`);
  return posterReads;
}

try {
  const posterUrl = `${cacheEnv.SUPABASE_URL}/storage/v1/object/public/posters/bounded.webp`;
  let chunksRead = 0;
  let cancelled = false;
  const chunk = new Uint8Array(1024 * 1024);
  await expectPreviewFallback(posterUrl, () => new Response(new ReadableStream({
    pull(controller) {
      if (chunksRead++ < 64) controller.enqueue(chunk);
      else controller.close();
    },
    cancel() { cancelled = true; }
  })), 'oversized streamed poster');
  assert(cancelled && chunksRead <= 12, `oversized poster: consumed ${chunksRead} MiB chunks without early cancellation`);

  cancelled = false;
  await expectPreviewFallback(posterUrl, () => new Response(new ReadableStream({
    cancel() { cancelled = true; }
  }), { headers: { 'Content-Length': String(16 * 1024 * 1024) } }), 'oversized declared poster');
  assert(cancelled, 'oversized Content-Length must cancel the poster body');

  for (const url of [
    'http://169.254.169.254/latest/meta-data/', 'http://127.0.0.1/private',
    'https://untrusted.test/poster.jpg', `${cacheEnv.SUPABASE_URL}/rest/v1/profiles`,
    `${cacheEnv.SUPABASE_URL}/storage/v1/object/public/avatars/test.jpg`
  ]) {
    const reads = await expectPreviewFallback(url, () => { throw new Error('Forbidden poster fetch'); }, 'untrusted poster URL');
    assert(reads === 0, 'untrusted poster URL must be rejected before fetch');
  }
  let redirectsRejected = false;
  await expectPreviewFallback(posterUrl, (url, options) => {
    redirectsRejected = options.redirect === 'error';
    return new Response(null, { status: 302, headers: { Location: 'http://169.254.169.254/' } });
  }, 'redirecting poster');
  assert(redirectsRejected, 'poster redirects must not be followed');

  const started = performance.now();
  let deadline;
  try {
    await Promise.race([
      expectPreviewFallback(posterUrl, (url, options) => new Response(new ReadableStream({
        start(controller) {
          options.signal?.addEventListener('abort', () => controller.error(options.signal.reason), { once: true });
        }
      })), 'stalled poster body'),
      new Promise((_, reject) => { deadline = setTimeout(() => reject(new Error('Poster body deadline missing')), 8000); })
    ]);
  } finally {
    clearTimeout(deadline);
  }
  assert(performance.now() - started < 8000, 'poster deadline must cover body consumption');

  const largePixels = await sharp({ create: { width: 3000, height: 3000, channels: 3, background: '#402020' } }).png().toBuffer();
  await expectPreviewFallback(posterUrl, () => new Response(largePixels), 'excessive poster pixel count');
} finally {
  globalThis.fetch = originalFetch;
}

console.log('Portable runtime smoke passed (20 concurrent movie GET/HEAD requests: 1 Supabase read).');
