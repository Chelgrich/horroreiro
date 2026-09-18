import { createPortableRuntime } from '../server/runtime.js';

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

console.log('Portable runtime smoke passed.');
