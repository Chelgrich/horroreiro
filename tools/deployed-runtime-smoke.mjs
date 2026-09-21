const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_USER_AGENT = 'horroreiro-deployed-runtime-smoke/1.0';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseArgs(argv) {
  const options = {
    allowCrossOriginRedirect: false,
    allowDevVersion: false,
    baseUrl: process.env.DEPLOYED_SMOKE_BASE_URL || '',
    expectedVersion: process.env.DEPLOYED_SMOKE_EXPECTED_VERSION || '',
    timeoutMs: Number(process.env.DEPLOYED_SMOKE_TIMEOUT_MS || DEFAULT_TIMEOUT_MS)
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--allow-cross-origin-redirect') {
      options.allowCrossOriginRedirect = true;
    } else if (arg === '--allow-dev-version') {
      options.allowDevVersion = true;
    } else if (arg === '--base-url') {
      options.baseUrl = argv[index + 1] || '';
      index += 1;
    } else if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.slice('--base-url='.length);
    } else if (arg === '--expected-version') {
      options.expectedVersion = argv[index + 1] || '';
      index += 1;
    } else if (arg.startsWith('--expected-version=')) {
      options.expectedVersion = arg.slice('--expected-version='.length);
    } else if (arg === '--timeout-ms') {
      options.timeoutMs = Number(argv[index + 1] || DEFAULT_TIMEOUT_MS);
      index += 1;
    } else if (arg.startsWith('--timeout-ms=')) {
      options.timeoutMs = Number(arg.slice('--timeout-ms='.length));
    } else if (!arg.startsWith('-') && !options.baseUrl) {
      options.baseUrl = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  node tools/deployed-runtime-smoke.mjs --base-url https://staging.horroreiro.ru [--expected-version <sha>]

Options:
  --base-url <url>                  Deployed site origin or base URL.
  --expected-version <version>      Expected APP_BUILD_VERSION from /env.
  --timeout-ms <number>             Per-request timeout. Defaults to ${DEFAULT_TIMEOUT_MS}.
  --allow-dev-version               Allow APP_BUILD_VERSION=dev for local/manual checks.
  --allow-cross-origin-redirect     Allow redirects to another origin.

Environment fallbacks:
  DEPLOYED_SMOKE_BASE_URL
  DEPLOYED_SMOKE_EXPECTED_VERSION
  DEPLOYED_SMOKE_TIMEOUT_MS`);
}

function normalizeBaseUrl(value) {
  assert(value, 'Missing --base-url');

  const url = new URL(value);
  assert(['http:', 'https:'].includes(url.protocol), '--base-url must be http or https');

  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  url.search = '';
  url.hash = '';

  return url;
}

function buildUrl(baseUrl, path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, baseUrl);
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': DEFAULT_USER_AGENT,
        ...(options.headers || {})
      },
      redirect: 'follow',
      signal: controller.signal
    });

    if (options.readBody === false) {
      try {
        await response.body?.cancel();
      } catch (error) {
        // The response headers are enough for this check.
      }

      return {
        response,
        text: ''
      };
    }

    return {
      response,
      text: await response.text()
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function requestPath(baseUrl, path, options) {
  const url = buildUrl(baseUrl, path);
  let response;
  let text;

  try {
    ({ response, text } = await fetchWithTimeout(url, options));
  } catch (error) {
    throw new Error(`${path}: request failed (${error.name || 'Error'}: ${error.message || error})`);
  }

  const finalUrl = new URL(response.url);

  assert(
    options.allowCrossOriginRedirect || finalUrl.origin === baseUrl.origin,
    `${path}: redirected to another origin (${finalUrl.origin})`
  );

  return {
    response,
    text,
    url
  };
}

function getHeader(response, name) {
  return response.headers.get(name) || '';
}

function expectCacheIncludes(response, fragment, label) {
  const cacheControl = getHeader(response, 'cache-control').toLowerCase();

  assert(
    cacheControl.includes(fragment),
    `${label}: expected Cache-Control to include "${fragment}", got "${cacheControl || '(missing)'}"`
  );
}

function expectHtmlShellCacheIsSafe(response, label) {
  const cacheControl = getHeader(response, 'cache-control').toLowerCase();
  const hasNoStore = cacheControl.includes('no-store');
  const isRevalidated = cacheControl.includes('max-age=0') && cacheControl.includes('must-revalidate');

  assert(
    hasNoStore || isRevalidated,
    `${label}: expected no-store or max-age=0/must-revalidate HTML cache, got "${cacheControl || '(missing)'}"`
  );
}

async function expectText(baseUrl, path, expectedFragment, label, options) {
  const { response, text } = await requestPath(baseUrl, path, options);
  const expectedStatuses = options.expectedStatuses || [200];

  assert(
    expectedStatuses.includes(response.status),
    `${label}: expected ${expectedStatuses.join('/')} status, got ${response.status}`
  );
  assert(text.includes(expectedFragment), `${label}: missing "${expectedFragment}"`);

  return {
    response,
    text
  };
}

function parseEnvPayload(envText) {
  const match = envText.match(/window\.__ENV__\s*=\s*(\{[\s\S]*?\})\s*;?\s*$/);

  assert(match, '/env: missing window.__ENV__ assignment');

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`/env: invalid JSON payload (${error.message})`);
  }
}

async function checkEnv(baseUrl, options) {
  const { response, text } = await expectText(
    baseUrl,
    '/env',
    'window.__ENV__',
    '/env',
    options
  );
  const payload = parseEnvPayload(text);

  expectCacheIncludes(response, 'no-store', '/env');

  assert(typeof payload.SUPABASE_URL === 'string' && payload.SUPABASE_URL, '/env: missing SUPABASE_URL');
  assert(
    typeof payload.SUPABASE_ANON_KEY === 'string' && payload.SUPABASE_ANON_KEY,
    '/env: missing SUPABASE_ANON_KEY'
  );
  assert(
    typeof payload.APP_BUILD_VERSION === 'string' && payload.APP_BUILD_VERSION,
    '/env: missing APP_BUILD_VERSION'
  );
  assert(
    options.allowDevVersion || payload.APP_BUILD_VERSION !== 'dev',
    '/env: APP_BUILD_VERSION is "dev"; pass --allow-dev-version only for local checks'
  );
  assert(
    !/SUPABASE_SERVICE_(?:ROLE_)?KEY|SERVICE_ROLE/i.test(text),
    '/env: service-role key name leaked into public payload'
  );

  if (options.expectedVersion) {
    assert(
      payload.APP_BUILD_VERSION === options.expectedVersion,
      `/env: expected APP_BUILD_VERSION=${options.expectedVersion}, got ${payload.APP_BUILD_VERSION}`
    );
  }

  return payload;
}

async function checkRoutes(baseUrl, options) {
  const routeChecks = [
    { expected: 'id="movies"', label: 'catalog route', path: '/' },
    { expected: 'id="moviePage"', label: 'movie shell route', path: '/movie.html' },
    {
      expected: 'id="moviePage"',
      label: 'movie clean route fallback',
      path: '/movie/deployed-smoke-missing-movie',
      statuses: [200, 404]
    },
    { expected: 'id="userPage"', label: 'user profile route', path: '/user/profile000' },
    { expected: 'id="followingPage"', label: 'following route', path: '/following' },
    { expected: 'id="notificationsPage"', label: 'notifications route', path: '/notifications' },
    { expected: 'id="editorPage"', label: 'editor route', path: '/editor' },
    { expected: 'id="directorsAdminPage"', label: 'directors admin route', path: '/directors' },
    { expected: 'id="directorPage"', label: 'person clean route', path: '/name/deployed-smoke-person' },
    { expected: 'id="companyAdminPage"', label: 'production route', path: '/production' },
    { expected: 'id="companyAdminPage"', label: 'distributors route', path: '/distributors' },
    {
      expected: 'id="companyAdminPage"',
      label: 'russian distributors route',
      path: '/russian-distributors'
    },
    {
      expected: 'id="companyPage"',
      label: 'company clean route fallback',
      path: '/company/deployed-smoke-company',
      statuses: [200, 404]
    }
  ];

  await Promise.all(routeChecks.map(async check => {
    const result = await expectText(baseUrl, check.path, check.expected, check.label, {
      ...options,
      expectedStatuses: check.statuses || [200]
    });

    expectHtmlShellCacheIsSafe(result.response, check.label);
  }));
}

async function checkAssets(baseUrl, version, options) {
  const encodedVersion = encodeURIComponent(version);
  const assetPath = `/app-assets/${encodedVersion}?file=app.js`;
  const assetResult = await requestPath(baseUrl, assetPath, {
    ...options,
    readBody: false
  });

  assert(assetResult.response.status === 200, `app asset: expected 200, got ${assetResult.response.status}`);
  expectCacheIncludes(assetResult.response, 'no-store', 'app asset');

  const bootLoaderResult = await expectText(
    baseUrl,
    `/app-assets/${encodedVersion}?file=app-page-runtime.js`,
    'window.HorroreiroPageRuntime',
    'small app asset',
    options
  );

  expectCacheIncludes(bootLoaderResult.response, 'no-store', 'small app asset');

  const missingAsset = await requestPath(
    baseUrl,
    `/app-assets/${encodedVersion}?file=deployed-smoke-missing.js`,
    {
      ...options,
      readBody: false
    }
  );

  assert(
    missingAsset.response.status === 404,
    `missing app asset: expected 404, got ${missingAsset.response.status}`
  );
  expectCacheIncludes(missingAsset.response, 'no-store', 'missing app asset');

  const styleResult = await expectText(baseUrl, '/styles.css', '--color', 'root stylesheet', options);

  expectCacheIncludes(styleResult.response, 'must-revalidate', 'root stylesheet');
}

async function checkSitemap(baseUrl, options) {
  const { response, text } = await expectText(
    baseUrl,
    '/sitemap.xml',
    '<urlset',
    'sitemap',
    options
  );
  const contentType = getHeader(response, 'content-type').toLowerCase();

  assert(
    contentType.includes('xml'),
    `sitemap: expected XML content-type, got "${contentType || '(missing)'}"`
  );
  assert(text.includes('horroreiro.ru') || text.includes(baseUrl.hostname), 'sitemap: missing site host URLs');
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

assert(
  Number.isFinite(options.timeoutMs) && options.timeoutMs > 0,
  '--timeout-ms must be a positive number'
);

const baseUrl = normalizeBaseUrl(options.baseUrl);
const envPayload = await checkEnv(baseUrl, options);

await checkAssets(baseUrl, envPayload.APP_BUILD_VERSION, options);
await checkRoutes(baseUrl, options);
await checkSitemap(baseUrl, options);

console.log(
  `Deployed runtime smoke passed for ${baseUrl.origin} (${envPayload.APP_BUILD_VERSION}).`
);
