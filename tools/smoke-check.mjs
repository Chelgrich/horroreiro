import { createServer } from 'node:http';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const host = '127.0.0.1';
const port = 4181;

const clientJsFiles = [
  'boot-loader.js',
  'app-script-loader.js',
  'shared-layout.js',
  'custom-select.js',
  'app-page-runtime.js',
  'app.js'
];
const lazyJsFiles = [
  'admin-actions.js',
  'following-page.js',
  'letterboxd-import.js',
  'person-placeholders.js',
  'assets/directors-admin-app.js'
];
const syntaxFiles = [
  ...clientJsFiles,
  ...lazyJsFiles,
  'vite.config.mjs',
  'functions/app-assets/[version].js',
  'tools/asset-size-report.mjs'
];

const contextJournalFile = 'docs/RECENT_CHANGES.md';
const contextSensitiveExactFiles = new Set([
  'AGENTS.md',
  'README.md',
  '_headers',
  '_routes.json',
  'app-page-runtime.js',
  'app-script-loader.js',
  'app.js',
  'boot-loader.js',
  'custom-select.js',
  'docs/CODEX_CONTEXT.md',
  'docs/DATA_MODEL.md',
  'following-page.js',
  'letterboxd-import.js',
  'movie-page.css',
  'secondary-pages.css',
  'package-lock.json',
  'package.json',
  'person-placeholders.js',
  'shared-layout.js',
  'styles.css',
  'vite.config.mjs'
]);
const contextSensitivePrefixes = [
  'assets/',
  'functions/',
  'src/',
  'tools/'
];
const temporaryRootArtifactPattern = /^(?:horroreiro-|tmdb-).*\d{4}-\d{2}-\d{2}.*\.(?:json|txt|csv)$/i;

const pageFiles = {
  'index.html': 'catalog',
  'movie.html': 'movie',
  'user.html': 'user',
  'following.html': 'following',
  'notifications.html': 'notifications',
  'editor.html': 'editor',
  'name.html': 'director',
  'directors.html': 'directors'
};

const routes = [
  { path: '/', expected: 'id="movies"', label: 'catalog' },
  { path: '/movie/test-movie', expected: 'id="moviePage"', label: 'movie detail' },
  { path: '/user/profile000', expected: 'id="userPage"', label: 'user profile' },
  { path: '/notifications', expected: 'id="notificationsPage"', label: 'notifications' },
  { path: '/following', expected: 'id="followingPage"', label: 'following' },
  { path: '/editor', expected: 'id="editorPage"', label: 'editor center' },
  { path: '/name/test-director', expected: 'id="directorPage"', label: 'director detail' },
  { path: '/directors', expected: 'id="directorsAdminPage"', label: 'directors admin' }
];

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkJavaScriptSyntax() {
  syntaxFiles.forEach(file => {
    const result = spawnSync(process.execPath, ['--check', file], {
      cwd: rootDir,
      encoding: 'utf8'
    });

    assert(
      result.status === 0,
      `${file}: syntax check failed\n${result.stderr || result.stdout}`
    );
  });
}

function checkAssetSizeReport() {
  const result = spawnSync(process.execPath, ['tools/asset-size-report.mjs', '--json'], {
    cwd: rootDir,
    encoding: 'utf8'
  });

  assert(
    result.status === 0,
    `asset-size-report.mjs: failed\n${result.stderr || result.stdout}`
  );

  const report = JSON.parse(result.stdout || '{}');

  assert(report.groups?.js?.raw > 0, 'asset-size-report.mjs: missing JS total');
  assert(report.groups?.css?.raw > 0, 'asset-size-report.mjs: missing CSS total');
  assert(report.startup?.catalog?.brotli > 0, 'asset-size-report.mjs: missing catalog startup profile');
  assert(
    report.startup?.catalog?.files?.includes('custom-select.js'),
    'asset-size-report.mjs: catalog startup profile must include custom-select.js'
  );
  assert(
    !report.startup?.movie?.files?.includes('custom-select.js'),
    'asset-size-report.mjs: movie startup profile must lazy-load custom-select.js'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('following-page.js')),
    'asset-size-report.mjs: following-page.js must stay lazy-loaded outside startup profiles'
  );
}

async function checkNoTemporaryRootArtifacts() {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const temporaryArtifacts = entries
    .filter(entry => entry.isFile() && temporaryRootArtifactPattern.test(entry.name))
    .map(entry => entry.name);

  assert(
    temporaryArtifacts.length === 0,
    `temporary root artifacts should be moved or removed: ${temporaryArtifacts.join(', ')}`
  );
}

async function readText(relativePath) {
  return readFile(join(rootDir, relativePath), 'utf8');
}

async function fileExists(relativePath) {
  try {
    await access(join(rootDir, relativePath));
    return true;
  } catch (error) {
    return false;
  }
}

function getDirtyFiles() {
  const result = spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], {
    cwd: rootDir,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    return [];
  }

  return (result.stdout || '')
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .filter(Boolean)
    .map(line => {
      const rawPath = line.slice(3).trim();
      const renameTarget = rawPath.includes(' -> ')
        ? rawPath.split(' -> ').pop()
        : rawPath;

      return renameTarget.replace(/^"|"$/g, '').replace(/\\/g, '/');
    })
    .filter(Boolean);
}

function isContextSensitiveFile(file) {
  const normalizedFile = String(file || '').replace(/\\/g, '/');

  if (!normalizedFile || normalizedFile === contextJournalFile) {
    return false;
  }

  if (normalizedFile.endsWith('.html')) {
    return true;
  }

  return (
    contextSensitiveExactFiles.has(normalizedFile) ||
    contextSensitivePrefixes.some(prefix => normalizedFile.startsWith(prefix))
  );
}

function checkContextJournalUpdated() {
  const dirtyFiles = getDirtyFiles();

  if (dirtyFiles.length === 0) {
    return;
  }

  const sensitiveFiles = dirtyFiles.filter(isContextSensitiveFile);

  if (sensitiveFiles.length === 0) {
    return;
  }

  assert(
    dirtyFiles.includes(contextJournalFile),
    `docs context is stale: update ${contextJournalFile} for source changes such as ${sensitiveFiles.slice(0, 5).join(', ')}`
  );
}

function getSpaFallbackPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') {
    return 'index.html';
  }

  if (pathname === '/movie.html' || pathname.startsWith('/movie/')) {
    return 'movie.html';
  }

  if (pathname === '/user.html' || pathname.startsWith('/user/')) {
    return 'user.html';
  }

  if (pathname === '/notifications' || pathname === '/notifications.html') {
    return 'notifications.html';
  }

  if (pathname === '/editor' || pathname === '/editor.html') {
    return 'editor.html';
  }

  if (pathname === '/directors' || pathname === '/directors.html') {
    return 'directors.html';
  }

  if (pathname === '/name.html' || pathname.startsWith('/name/')) {
    return 'name.html';
  }

  if (pathname === '/following' || pathname === '/following.html') {
    return 'following.html';
  }

  return pathname.replace(/^\/+/, '') || 'index.html';
}

async function readStaticFile(pathname) {
  const relativePath = normalize(getSpaFallbackPath(pathname)).replace(/^(\.\.[/\\])+/, '');
  const absolutePath = join(rootDir, relativePath);

  return {
    body: await readFile(absolutePath),
    contentType: contentTypes[extname(absolutePath)] || 'application/octet-stream'
  };
}

function createSmokeServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', `http://${host}:${port}`);
      const file = await readStaticFile(url.pathname);

      response.writeHead(200, { 'content-type': file.contentType });
      response.end(file.body);
    } catch (error) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(String(error?.message || error));
    }
  });
}

async function fetchText(path) {
  const response = await fetch(`http://${host}:${port}${path}`);

  assert(response.ok, `${path}: expected 200, got ${response.status}`);
  return response.text();
}

async function checkStaticGuards() {
  for (const [file, page] of Object.entries(pageFiles)) {
    const html = await readText(file);

    assert(
      html.includes(`body data-app-page="${page}"`),
      `${file}: missing data-app-page="${page}"`
    );
    assert(
      html.includes('<script src="/boot-loader.js'),
      `${file}: missing boot-loader.js`
    );
    assert(
      html.includes('<script src="/app-script-loader.js'),
      `${file}: missing app-script-loader.js`
    );
    const googleFontStylesheetMatches = html.match(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"/g) || [];
    assert(
      googleFontStylesheetMatches.length === 1 &&
        googleFontStylesheetMatches[0].includes('family=PT+Sans') &&
        googleFontStylesheetMatches[0].includes('family=Unbounded'),
      `${file}: Google Fonts should be loaded through one combined stylesheet`
    );
    assert(
      !html.includes('window.__ENV_READY__ = new Promise'),
      `${file}: duplicated inline env boot loader`
    );
    assert(
      !html.includes('Ошибка загрузки versioned scripts'),
      `${file}: duplicated inline app script loader`
    );
  }

  const appScriptLoader = await readText('app-script-loader.js');
  const bootLoader = await readText('boot-loader.js');

  assert(
    appScriptLoader.includes("loadScript('app-page-runtime.js'"),
    'app-script-loader.js: missing app-page-runtime.js load step'
  );
  assert(
    appScriptLoader.includes("const needsCustomSelect = page === 'catalog'"),
    'app-script-loader.js: custom-select.js should be an upfront dependency only for catalog'
  );
  assert(
    bootLoader.includes('/app-assets/') && appScriptLoader.includes('/app-assets/'),
    'boot-loader.js/app-script-loader.js: production assets must use app-assets route'
  );
  assert(
    bootLoader.includes('function getCurrentAppPage') &&
      bootLoader.includes("normalizedPathname.startsWith('/movie/')") &&
      bootLoader.includes("filename === 'movie.html'") &&
      bootLoader.includes("assets.push('movie-page.css')"),
    'boot-loader.js: movie page stylesheet must be selected before body is parsed'
  );
  assert(
    bootLoader.includes("['following', 'notifications', 'editor', 'director', 'directors'].includes(page)") &&
      bootLoader.includes("assets.push('secondary-pages.css')"),
    'boot-loader.js: secondary page stylesheet must be selected by page type'
  );

  const headersText = await readText('_headers');

  [
    '/app.js',
    '/custom-select.js',
    '/app-page-runtime.js',
    '/admin-actions.js',
    '/following-page.js',
    '/letterboxd-import.js',
    '/person-placeholders.js',
    '/assets/directors-admin-app.js',
    '/shared-layout.js',
    '/styles.css',
    '/movie-page.css',
    '/secondary-pages.css'
  ].forEach(assetPath => {
    const escapedAssetPath = assetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    assert(
      new RegExp(`${escapedAssetPath}\\r?\\n\\s+Cache-Control: public, max-age=0, must-revalidate`).test(headersText),
      `_headers: missing revalidation cache header for ${assetPath}`
    );
  });

  const activeTextTargets = [
    '_headers',
    'index.html',
    'movie.html',
    'user.html',
    'following.html',
    'notifications.html',
    'editor.html',
    'name.html',
    'directors.html',
    'app.js',
    'admin-actions.js',
    'following-page.js',
    'letterboxd-import.js',
    'person-placeholders.js',
    'assets/directors-admin-app.js',
    'shared-layout.js',
    'styles.css',
    'movie-page.css',
    'secondary-pages.css',
    'app-script-loader.js',
    'app-page-runtime.js',
    'boot-loader.js'
  ];

  const appJs = await readText('app.js');

  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('following-page.js'))"),
    'app.js: /following page must lazy-load following-page.js'
  );
  assert(
    !appJs.includes('function renderFollowingPageLoading()'),
    'app.js: following page renderer should stay in following-page.js'
  );
  assert(
    !appJs.includes('getFollowingPageAvatarHtml('),
    'app.js: notifications must not call following-page.js local avatar helpers'
  );
  assert(
    !appJs.includes('notification_events (*)'),
    'app.js: notification page should select explicit notification event fields'
  );

  const catalogSelectMatch = appJs.match(/const MOVIE_CATALOG_SELECT = `([\s\S]*?)`;/);
  assert(
    catalogSelectMatch && !catalogSelectMatch[1].includes('tmdb_url'),
    'app.js: catalog payload must not include detail-only tmdb_url'
  );

  for (const file of activeTextTargets) {
    const text = await readText(file);

    assert(
      !text.includes('horror-taxonomy.js') && !text.includes('taxonomy-admin.js'),
      `${file}: references archived taxonomy assets`
    );
  }

  const routesConfig = JSON.parse(await readText('_routes.json'));

  [
    '/',
    '/index.html',
    '/app-assets/*',
    '/movie/*',
    '/movie.html',
    '/user/*',
    '/user.html',
    '/editor',
    '/editor.html',
    '/directors',
    '/directors.html',
    '/following',
    '/following.html',
    '/notifications',
    '/notifications.html',
    '/name/*',
    '/name.html',
    '/sitemap.xml'
  ].forEach(route => {
    assert(routesConfig.include.includes(route), `_routes.json: missing ${route}`);
  });

  assert(!(await fileExists('sitemap.xml')), 'static sitemap.xml should not shadow the dynamic function');
  assert(await fileExists('functions/sitemap.xml.js'), 'missing dynamic sitemap function');
  assert(await fileExists('archive/taxonomy/horror-taxonomy.js'), 'missing archived horror-taxonomy.js');
  assert(await fileExists('archive/taxonomy/taxonomy-admin.js'), 'missing archived taxonomy-admin.js');

  const movieHtml = await readText('movie.html');
  assert(
    movieHtml.includes('MOVIE_PAGE_FALLBACK_START') && movieHtml.includes('MOVIE_PAGE_FALLBACK_END'),
    'movie.html: missing SEO fallback markers'
  );

  assert(await fileExists('tools/asset-size-baseline.json'), 'missing asset size baseline');
  assert(await fileExists('AGENTS.md'), 'missing Codex entrypoint AGENTS.md');
  assert(await fileExists('docs/CODEX_CONTEXT.md'), 'missing Codex architecture context');
  assert(await fileExists('docs/DATA_MODEL.md'), 'missing Codex data model context');
  assert(await fileExists(contextJournalFile), 'missing Codex recent changes journal');

  for (const file of clientJsFiles.filter(item => item !== 'custom-select.js')) {
    const text = await readText(file);
    const unsafeAttributeLines = text
      .split(/\r?\n/)
      .filter(line => /(?:\s|<)(href|src|aria-label|title)="\$\{/.test(line))
      .filter(line => (
        !line.includes('escapeHtml(') &&
        !line.includes('${escaped') &&
        !line.includes('.escaped') &&
        !line.includes('userMovieState.isInWatchlist ?') &&
        !line.includes('canReplyToReview ?')
      ));

    assert(
      unsafeAttributeLines.length === 0,
      `${file}: direct template interpolation in an HTML attribute: ${unsafeAttributeLines[0] || ''}`
    );
  }
}

async function checkRoutes() {
  const server = createSmokeServer();

  await new Promise(resolve => server.listen(port, host, resolve));

  try {
    for (const route of routes) {
      const html = await fetchText(route.path);

      assert(
        html.includes(route.expected),
        `${route.label}: missing ${route.expected}`
      );
      assert(
        html.includes('boot-loader.js') && html.includes('app-script-loader.js'),
        `${route.label}: boot scripts are missing`
      );
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

checkJavaScriptSyntax();
checkAssetSizeReport();
checkContextJournalUpdated();
await checkNoTemporaryRootArtifacts();
await checkStaticGuards();
await checkRoutes();

console.log('Smoke check passed.');
