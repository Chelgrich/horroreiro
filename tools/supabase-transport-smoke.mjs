import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { onRequest } from '../functions/supabase/[[path]].js';
import { createPortableRuntime } from '../server/runtime.js';
import * as letterboxdTools from '../letterboxd-import.js';

const env = { SUPABASE_URL: 'https://fixture.supabase.co', SUPABASE_ANON_KEY: 'public-fixture', SUPABASE_SERVICE_ROLE_KEY: 'must-not-be-forwarded' };
const boot = await readFile(new URL('../boot-loader.js', import.meta.url), 'utf8');
const prelude = boot.slice(0, boot.indexOf('  window.__ENV_READY__ = new Promise')) + '})();';
let fontLoaded;
const font = { media: 'print', sheet: null, addEventListener: (_name, callback) => { fontLoaded = callback; } };
vm.runInNewContext(prelude, { window: { __ENV_READY__: Promise.resolve() }, document: { querySelector: () => font } });
assert.equal(typeof fontLoaded, 'function', 'Slow external fonts must activate independently of app initialization');
assert.equal(font.media, 'print');
fontLoaded();
assert.equal(font.media, 'all');
font.sheet = {};
font.media = 'print';
vm.runInNewContext(prelude, { window: { __ENV_READY__: Promise.resolve() }, document: { querySelector: () => font } });
assert.equal(font.media, 'all', 'Already cached font styles must also activate');
for (const name of ['index', 'movie', 'user', 'following', 'notifications', 'editor', 'name', 'directors', 'company', 'companies']) {
  const html = await readFile(new URL(`../${name}.html`, import.meta.url), 'utf8');
  assert.match(html, /<link[^>]*data-app-fonts[^>]*media="print"[^>]*fonts\.googleapis\.com/);
  assert.ok(!html.includes('cdn.jsdelivr.net'), 'Startup must not depend on the SDK CDN');
}
const routes = JSON.parse(await readFile(new URL('../_routes.json', import.meta.url), 'utf8'));
assert.ok(routes.include.includes('/supabase/*'), 'Cloudflare rollback must invoke the same transport handler');
const sdk = await readFile(new URL('../assets/vendor/supabase-2.119.0.js', import.meta.url));
assert.equal(createHash('sha256').update(sdk).digest('hex'), '71e670ca67ad5df7fe3d919f119f30267b44df80df27ac3ac63254a0ba2319df', 'Vendored SDK must match the pinned upstream distribution');
const sdkSandbox = vm.createContext({ console, URL, Headers, Request, Response, fetch, AbortController, AbortSignal, setTimeout, clearTimeout });
vm.runInContext(sdk.toString('utf8'), sdkSandbox);
assert.equal(typeof sdkSandbox.supabase.createClient, 'function', 'The local SDK must expose the same browser API');
const originalFetch = globalThis.fetch;
const forwarded = [];
globalThis.fetch = async (url, options) => {
  forwarded.push({ url: String(url), ...options });
  return new Response('[{"id":"fixture"}]', { status: 206, headers: {
    'Content-Type': 'application/json', 'Content-Range': '0-0/3', 'Set-Cookie': 'private=1', 'Access-Control-Allow-Origin': '*'
  } });
};
const request = (path, options) => new Request(`https://site.test/supabase${path}`, options);
try {
  const response = await onRequest({ env, request: request('/rest/v1/movies?select=id&limit=1', { headers: {
    apikey: env.SUPABASE_ANON_KEY, Authorization: 'Bearer user-fixture', Cookie: 'site-cookie=private', Range: '0-0', 'Accept-Profile': 'public'
  } }) });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), '0-0/3');
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  assert.equal(response.headers.get('Set-Cookie'), null);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal(forwarded[0].url, `${env.SUPABASE_URL}/rest/v1/movies?select=id&limit=1`);
  assert.equal(forwarded[0].headers.get('Authorization'), 'Bearer user-fixture');
  assert.equal(forwarded[0].headers.get('apikey'), env.SUPABASE_ANON_KEY);
  assert.equal(forwarded[0].headers.get('Cookie'), null);
  assert.equal(forwarded[0].headers.get('Range'), '0-0');
  assert.equal(forwarded[0].redirect, 'error', 'Never send credentials through upstream redirects');
  assert.ok(!JSON.stringify(forwarded).includes(env.SUPABASE_SERVICE_ROLE_KEY));

  const body = JSON.stringify({ movie_id: 'movie', rating: 8 });
  await onRequest({ env, request: request('/rest/v1/movie_ratings?on_conflict=movie_id%2Cuser_id', {
    method: 'POST', body, headers: { apikey: env.SUPABASE_ANON_KEY, Origin: 'https://site.test', 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' }
  }) });
  assert.equal(new TextDecoder().decode(forwarded.at(-1).body), body);
  assert.equal(forwarded.at(-1).headers.get('Prefer'), 'resolution=merge-duplicates');
  const runtime = createPortableRuntime({ env });
  assert.equal((await runtime.handleRequest(request('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST', body: '{"refresh_token":"fixture"}', headers: { apikey: env.SUPABASE_ANON_KEY }
  }))).status, 206, 'Portable route must reach the same bounded proxy');
  const count = forwarded.length;
  for (const path of ['/admin/users', '//evil.test/rest/v1/movies', '/storage/v1/object/private/file', '/rest/v2/movies']) {
    assert.equal((await onRequest({ env, request: request(path) })).status, 404);
  }
  assert.equal((await onRequest({ env, request: request('/rest/v1/movies', { headers: { Origin: 'https://evil.test', apikey: env.SUPABASE_ANON_KEY } }) })).status, 403);
  assert.equal((await onRequest({ env, request: request('/rest/v1/movies', { headers: { apikey: 'wrong-key' } }) })).status, 403);
  assert.equal((await onRequest({ env, request: request('/rest/v1/movies', { method: 'POST', body: 'x'.repeat(65537), headers: { apikey: env.SUPABASE_ANON_KEY } }) })).status, 413);
  assert.equal(forwarded.length, count, 'Rejected requests must never reach the upstream');
  globalThis.fetch = async () => { throw new TypeError('private upstream detail'); };
  const unavailable = await onRequest({ env, request: request('/rest/v1/movies', { headers: { apikey: env.SUPABASE_ANON_KEY } }) });
  assert.equal(unavailable.status, 502);
  assert.ok(!(await unavailable.text()).includes('private upstream detail'));
} finally {
  globalThis.fetch = originalFetch;
}

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const start = source.indexOf('function fetchSupabaseThroughSite(');
const end = source.indexOf('\n}', start) + 2;
assert.ok(start >= 0 && end > start);
const calls = [];
const sandbox = vm.createContext({ URL, Request, SUPABASE_URL: env.SUPABASE_URL,
  window: { location: { protocol: 'https:', origin: 'https://site.test' } },
  fetch: (...args) => { calls.push(args); return Promise.resolve(new Response('{}')); }
});
vm.runInContext(source.slice(start, end), sandbox);
const options = { method: 'POST', body: 'payload', headers: { Authorization: 'Bearer fixture' } };
await sandbox.fetchSupabaseThroughSite(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, options);
assert.equal(String(calls.at(-1)[0]), 'https://site.test/supabase/auth/v1/token?grant_type=password');
assert.equal(calls.at(-1)[1], options, 'Preserve SDK methods, headers, signals and body');
for (const url of ['https://other.test/rest/v1/movies', `${env.SUPABASE_URL}/storage/v1/object/public/posters/a.jpg`]) {
  await sandbox.fetchSupabaseThroughSite(url, options);
  assert.equal(calls.at(-1)[0], url, 'Only the configured project REST/Auth traffic is rewritten');
}
sandbox.window.location.protocol = 'file:';
await sandbox.fetchSupabaseThroughSite(`${env.SUPABASE_URL}/rest/v1/movies`, options);
assert.equal(calls.at(-1)[0], `${env.SUPABASE_URL}/rest/v1/movies`, 'File preview retains direct requests');
sandbox.window.location.protocol = 'http:';
sandbox.window.location.hostname = 'localhost';
await sandbox.fetchSupabaseThroughSite(`${env.SUPABASE_URL}/rest/v1/movies`, options);
assert.equal(calls.at(-1)[0], `${env.SUPABASE_URL}/rest/v1/movies`, 'Local preview must work without server secrets/env');

// A valid bulk import must fit the bounded transport and survive a later failed batch.
const movies = Array.from({ length: 670 }, (_, index) => ({
  id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
  title: `Fixture ${index}`, letterboxd_url: `https://letterboxd.com/film/fixture-${index}/`
}));
const csv = ['Name,Letterboxd URI,Rating', ...movies.map(movie => `${movie.title},${movie.letterboxd_url},4`)].join('\n');
const saved = new Map();
const batchSizes = [];
let failBatch = 0;
let batchIndex = 0;
let uiSyncs = 0;
const importer = vm.createContext({
  Map, Set, SUPABASE_ID_QUERY_CHUNK_SIZE: 200,
  ensureActiveSessionForWrite: () => ({ id: '10000000-0000-4000-8000-000000000000' }),
  loadLetterboxdImportTools: async () => letterboxdTools,
  fetchLetterboxdImportMatchMovies: async () => movies,
  fetchCurrentUserRatingsForMovieIds: async () => [...saved.values()],
  currentUserRatingsByMovieId: new Map(), reportLetterboxdRatingsImportProgress() {},
  throwIfSupabaseError: error => { if (error) throw error; },
  applyLetterboxdRatingsImportLocally: rows => rows.forEach(row => importer.currentUserRatingsByMovieId.set(row.movie_id, row.rating)),
  syncUiAfterLetterboxdRatingsImport: () => { uiSyncs += 1; },
  supabaseClient: { from: () => ({ upsert(rows, options) {
    assert.equal(options.ignoreDuplicates, true, 'Retries must never overwrite site ratings');
    return { select: async () => {
      const bytes = Buffer.byteLength(JSON.stringify(rows));
      batchSizes.push(bytes);
      if (bytes > 65536 || ++batchIndex === failBatch) return { error: new Error('Network fixture') };
      const added = rows.filter(row => !saved.has(row.movie_id));
      added.forEach(row => saved.set(row.movie_id, row));
      return { data: added };
    } };
  } }) }
});
const importStart = source.lastIndexOf('\n', source.indexOf('function importLetterboxdRatingsFromCsvText(')) + 1;
vm.runInContext(source.slice(importStart, source.indexOf('\n}', importStart) + 2), importer);
let result = await importer.importLetterboxdRatingsFromCsvText(csv);
assert.equal(result.insertedCount, 670);
assert.ok(batchSizes.length > 1 && batchSizes.every(bytes => bytes <= 65536));
saved.clear();
importer.currentUserRatingsByMovieId.clear();
batchIndex = 0;
failBatch = 2;
const beforeUiSync = uiSyncs;
await assert.rejects(importer.importLetterboxdRatingsFromCsvText(csv));
assert.equal(saved.size, 200);
assert.equal(importer.currentUserRatingsByMovieId.size, 200, 'Confirmed earlier batches must update local state');
assert.equal(uiSyncs, beforeUiSync + 1, 'Partial success must reach the UI even when a later batch fails');
failBatch = 0;
result = await importer.importLetterboxdRatingsFromCsvText(csv);
assert.equal(result.insertedCount, 470, 'Retry skips the already committed batch');
assert.equal(saved.size, 670);
console.log('Supabase transport smoke passed: scoped routing, unchanged user privileges, no cookies/cache, body limit and cold client transport.');
