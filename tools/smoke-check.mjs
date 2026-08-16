import { createServer } from 'node:http';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  'director-page.js',
  'editor-page.js',
  'following-page.js',
  'letterboxd-import.js',
  'movie-editor.js',
  'movie-detail-cache.js',
  'movie-page-interactions.js',
  'movie-page-orchestrator.js',
  'movie-page-similar.js',
  'movie-page-shell.js',
  'movie-social.js',
  'movie-user-state.js',
  'notifications-page.js',
  'person-placeholders.js',
  'user-page.js',
  'assets/directors-admin-app.js'
];
const syntaxFiles = [
  ...clientJsFiles,
  ...lazyJsFiles,
  'vite.config.mjs',
  'functions/app-assets/[version].js',
  'functions/profile-activity-ranks/[userId].js',
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
  'director-form.css',
  'director-page.js',
  'director-page.css',
  'directors-admin-page.css',
  'editor-page.css',
  'editor-page.js',
  'following-page.css',
  'following-page.js',
  'letterboxd-import.js',
  'movie-editor.js',
  'movie-detail-cache.js',
  'movie-page-interactions.js',
  'movie-page-orchestrator.js',
  'movie-page-similar.js',
  'movie-page-shell.js',
  'movie-social.js',
  'movie-user-state.js',
  'notifications-page.css',
  'notifications-page.js',
  'movie-page.css',
  'secondary-pages.css',
  'package-lock.json',
  'package.json',
  'person-placeholders.js',
  'shared-layout.js',
  'styles.css',
  'user-page.js',
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
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('director-page.js')),
    'asset-size-report.mjs: director-page.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('following-page.js')),
    'asset-size-report.mjs: following-page.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-social.js')),
    'asset-size-report.mjs: movie-social.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-user-state.js')),
    'asset-size-report.mjs: movie-user-state.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-editor.js')),
    'asset-size-report.mjs: movie-editor.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-detail-cache.js')),
    'asset-size-report.mjs: movie-detail-cache.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-page-interactions.js')),
    'asset-size-report.mjs: movie-page-interactions.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-page-orchestrator.js')),
    'asset-size-report.mjs: movie-page-orchestrator.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-page-similar.js')),
    'asset-size-report.mjs: movie-page-similar.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('movie-page-shell.js')),
    'asset-size-report.mjs: movie-page-shell.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('notifications-page.js')),
    'asset-size-report.mjs: notifications-page.js must stay lazy-loaded outside startup profiles'
  );
  assert(
    Object.values(report.startup || {}).every(profile => !profile.files?.includes('user-page.js')),
    'asset-size-report.mjs: user-page.js must stay lazy-loaded outside startup profiles'
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
    bootLoader.includes('const secondaryPageStylesheets = {') &&
      bootLoader.includes("following: ['secondary-pages.css', 'following-page.css']") &&
      bootLoader.includes("notifications: ['secondary-pages.css', 'notifications-page.css']") &&
      bootLoader.includes("editor: ['secondary-pages.css', 'editor-page.css']") &&
      bootLoader.includes("director: ['secondary-pages.css', 'director-page.css', 'director-form.css']") &&
      bootLoader.includes("directors: ['secondary-pages.css', 'directors-admin-page.css', 'director-form.css']") &&
      bootLoader.includes('assets.push(...secondaryPageStylesheets[page])'),
    'boot-loader.js: secondary page stylesheets must be selected by page type'
  );

  const headersText = await readText('_headers');

  [
    '/app.js',
    '/custom-select.js',
    '/director-form.css',
    '/director-page.js',
    '/director-page.css',
    '/directors-admin-page.css',
    '/app-page-runtime.js',
    '/admin-actions.js',
    '/editor-page.css',
    '/following-page.js',
    '/following-page.css',
    '/letterboxd-import.js',
    '/movie-editor.js',
    '/movie-detail-cache.js',
    '/movie-page-interactions.js',
    '/movie-page-orchestrator.js',
    '/movie-page-similar.js',
    '/movie-page-shell.js',
    '/movie-social.js',
    '/movie-user-state.js',
    '/notifications-page.css',
    '/notifications-page.js',
    '/person-placeholders.js',
    '/user-page.js',
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
    'director-form.css',
    'director-page.js',
    'director-page.css',
    'directors-admin-page.css',
    'editor-page.css',
    'following-page.js',
    'following-page.css',
    'letterboxd-import.js',
    'movie-editor.js',
    'movie-detail-cache.js',
    'movie-page-interactions.js',
    'movie-page-orchestrator.js',
    'movie-page-similar.js',
    'movie-page-shell.js',
    'movie-social.js',
    'movie-user-state.js',
    'notifications-page.css',
    'notifications-page.js',
    'person-placeholders.js',
    'user-page.js',
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
  const movieEditorJs = await readText('movie-editor.js');
  const movieDetailCacheJs = await readText('movie-detail-cache.js');
  const directorPageJs = await readText('director-page.js');
  const moviePageInteractionsJs = await readText('movie-page-interactions.js');
  const moviePageOrchestratorJs = await readText('movie-page-orchestrator.js');
  const moviePageSimilarJs = await readText('movie-page-similar.js');
  const moviePageShellJs = await readText('movie-page-shell.js');
  const movieSocialJs = await readText('movie-social.js');
  const movieUserStateJs = await readText('movie-user-state.js');
  const notificationsPageJs = await readText('notifications-page.js');
  const userPageJs = await readText('user-page.js');
  const directorsAdminSource = await readText('src/directors-admin-app.jsx');

  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('following-page.js'))"),
    'app.js: /following page must lazy-load following-page.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-social.js'))"),
    'app.js: movie detail social block must lazy-load movie-social.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-user-state.js'))"),
    'app.js: movie user state mutations must lazy-load movie-user-state.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-editor.js'))"),
    'app.js: movie editor helpers must lazy-load movie-editor.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-detail-cache.js'))"),
    'app.js: movie detail cache helpers must lazy-load movie-detail-cache.js'
  );
  assert(
    appJs.includes('const MOVIE_DETAIL_SELECT = `') &&
      appJs.includes('const MOVIE_EDITOR_SELECT = `') &&
      !appJs.includes('const MOVIE_BASE_SELECT = `') &&
      appJs.includes('return fetchMovieById(movieId, MOVIE_EDITOR_SELECT)'),
    'app.js: public movie detail select and admin movie editor select must stay split'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-page-shell.js'))"),
    'app.js: movie detail shell must lazy-load movie-page-shell.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-page-interactions.js'))"),
    'app.js: movie detail interactions must lazy-load movie-page-interactions.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-page-orchestrator.js'))"),
    'app.js: movie detail orchestrator must lazy-load movie-page-orchestrator.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('movie-page-similar.js'))"),
    'app.js: movie detail similar helpers must lazy-load movie-page-similar.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('director-page.js'))"),
    'app.js: /name page must lazy-load director-page.js'
  );
  assert(
    !appJs.includes('async function fetchDirectorPageData(') &&
      !appJs.includes('function renderDirectorMoviesGrid(') &&
      directorPageJs.includes('async function fetchDirectorPageData(') &&
      directorPageJs.includes('function renderDirectorMoviesGrid('),
    'director-page.js: public person page data/rendering must stay outside app.js'
  );
  assert(
    moviePageShellJs.includes('function getMoviePageHeaderHtml(') &&
      moviePageShellJs.includes('function getMoviePageSkeletonHtml(') &&
      moviePageShellJs.includes('function buildMoviePageViewModel(') &&
      !appJs.includes('function getMoviePageSubgenreLabel(') &&
      !appJs.includes('function getMoviePageFormatsLabel(') &&
      !appJs.includes('function buildMoviePageViewModel(') &&
      !appJs.includes('function getMoviePagePosterGalleryIndex(') &&
      !appJs.includes('function getMoviePagePosterGalleryButtonHtml(') &&
      !appJs.includes('function getMoviePagePosterColumnHtml(') &&
      !appJs.includes('function getMoviePageMainColumnHtml(') &&
      !appJs.includes('function getMoviePageHeaderHtml(') &&
      !appJs.includes('function getMoviePageSkeletonHtml('),
    'movie-page-shell.js: movie page header renderer must stay outside app.js'
  );
  assert(
    movieEditorJs.includes('function buildMovieChangedFields(') &&
      !appJs.includes('function buildMovieChangedFields('),
    'movie-editor.js: movie update diff helper must stay outside app.js'
  );
  assert(
    movieEditorJs.includes('function getMoviePosterImagesDraftAfterDrop(') &&
      movieEditorJs.includes('function resolveMoviePosterImageDraftEntries(') &&
      movieEditorJs.includes('function splitMoviePosterImageEntriesForSave(') &&
      !appJs.includes('function getMoviePosterImagesDraftAfterDrop(') &&
      !appJs.includes('function resolveMoviePosterImageDraftEntries(') &&
      !appJs.includes('function splitMoviePosterImageEntriesForSave('),
    'movie-editor.js: movie poster draft order/save helpers must stay outside app.js'
  );
  assert(
    movieDetailCacheJs.includes('function readCache(') &&
      movieDetailCacheJs.includes('function writeEntry(') &&
      movieDetailCacheJs.includes('function getEntrySignature(') &&
      !appJs.includes('function readMoviePageSessionCache(') &&
      !appJs.includes('function getMoviePageSessionCacheSignature('),
    'movie-detail-cache.js: movie detail session cache read/write/signature helpers must stay outside app.js'
  );
  assert(
    moviePageInteractionsJs.includes('function openMovieTrailerModal(') &&
      moviePageInteractionsJs.includes('function updateMoviePagePosterGallery(') &&
      !appJs.includes('function openMovieTrailerModal(') &&
      !appJs.includes('function updateMoviePagePosterGallery('),
    'movie-page-interactions.js: movie detail trailer and poster gallery handlers must stay outside app.js'
  );
  assert(
    moviePageOrchestratorJs.includes('function getMoviePageRouteParams(') &&
      moviePageOrchestratorJs.includes('async function initMoviePage(') &&
      moviePageOrchestratorJs.includes('async function loadMoviePageByRouteParams(') &&
      moviePageOrchestratorJs.includes('async function loadDeferredMoviePageSections(') &&
      !appJs.includes('const pathSlugMatch = window.location.pathname.match') &&
      !appJs.includes('const restoredMovie = restoreMoviePageFromSessionCache(routeParams);') &&
      !appJs.includes('skipRenderIfCacheFresh: Boolean(restoredMovie)') &&
      !appJs.includes('const isMoviePayloadLoadedByRpc = Boolean(movie)') &&
      !appJs.includes('const shouldSkipRender = (') &&
      !appJs.includes('Promise.allSettled(deferredTasks)'),
    'movie-page-orchestrator.js: movie detail init flow, route parsing, page-load decision tree, and deferred section loading must stay outside app.js'
  );
  assert(
    moviePageSimilarJs.includes('function getMoviePageSimilarIdsAfterMove(') &&
      moviePageSimilarJs.includes('function getMoviePageSimilarSearchSuggestions(') &&
      moviePageSimilarJs.includes('function getMoviePageSimilarEditorHtml(') &&
      moviePageSimilarJs.includes('function getMoviePageSimilarCardHtml(') &&
      moviePageSimilarJs.includes('function bindMoviePageSimilarEditorEvents(') &&
      moviePageSimilarJs.includes('async function saveMoviePageSimilarEditorIds(') &&
      moviePageSimilarJs.includes('async function loadMoviePageSimilarMovies(') &&
      moviePageSimilarJs.includes('function focusMoviePageSimilarSearch(') &&
      !appJs.includes('function doesMovieMatchManualSimilarSearch(') &&
      !appJs.includes('function getMoviePageSimilarEditorHtml(') &&
      !appJs.includes('function getMoviePageSimilarCardHtml(') &&
      !appJs.includes('function handleMoviePageSimilar') &&
      !appJs.includes('async function saveMoviePageSimilarEditorIds(') &&
      !appJs.includes('const requestId = ++moviePageSimilarRequestId') &&
      !appJs.includes('function focusMoviePageSimilarSearch(') &&
      !appJs.includes('function getMoviePageSimilarIdsAfterMove('),
    'movie-page-similar.js: manual similar search/order/render/event/load/save helpers must stay outside app.js'
  );
  assert(
    movieUserStateJs.includes('async function runMovieMutationWithUiSync(') &&
      movieUserStateJs.includes('async function toggleMovieWatchlist(') &&
      movieUserStateJs.includes('async function removeUserMovieRating(') &&
      movieUserStateJs.includes('async function saveUserMovieRating(') &&
      !appJs.includes('async function runMovieMutationWithUiSync(') &&
      !appJs.includes('const shouldRemoveFromWatchlist = hasMovieWatchlistRecord(movieId);') &&
      !appJs.includes('const normalizedRating = Number(ratingValue);'),
    'movie-user-state.js: movie rating/watchlist mutation orchestration must stay outside app.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('notifications-page.js'))"),
    'app.js: /notifications page must lazy-load notifications-page.js'
  );
  assert(
    appJs.includes("import(getLazyFeatureModuleUrl('user-page.js'))"),
    'app.js: /user page must lazy-load user-page.js'
  );
  assert(
    appJs.includes('function getMoviePageSimilarSectionHtml(') &&
      appJs.includes('getMoviePageSimilarController().bindMoviePageSimilarEditorEvents') &&
      appJs.includes('getMoviePageSimilarController().loadMoviePageSimilarMovies') &&
      appJs.includes('replaceManualSimilarMovies,'),
    'app.js: movie detail manual similar section wrapper plus data callbacks must stay as the current bridge'
  );
  assert(
    !movieSocialJs.includes('getMoviePageSimilar') &&
      !movieSocialJs.includes('moviePageSimilar'),
    'movie-social.js: manual similar implementation should stay outside movie-social.js'
  );
  assert(
    movieSocialJs.includes('function renderMoviePageReviewsSection(') &&
      movieSocialJs.includes('function renderMoviePageCommentsSection(') &&
      movieSocialJs.includes('renderMoviePageReviewsSection: (movie, options = {}) =>') &&
      movieSocialJs.includes('renderMoviePageCommentsSection: movie =>'),
    'movie-social.js: social render API must call local render functions without recursive method shorthand'
  );
  assert(
    movieSocialJs.includes('function handleMovieReviewReplyButtonClick(') &&
      movieSocialJs.includes('reviewReplyButton && reviewsSection.contains(reviewReplyButton)') &&
      !movieSocialJs.includes('reviewReplyButton && commentsSection.contains(reviewReplyButton)'),
    'movie-social.js: review reply buttons must be handled by the reviews section listener'
  );
  assert(
    movieSocialJs.includes('function shouldMovieCommentShowChildThreadByDefault(') &&
      movieSocialJs.includes('return getMovieCommentDepth(comment) === 0;') &&
      movieSocialJs.includes('const isChildThreadVisible = isMovieCommentChildThreadVisible(comment);') &&
      movieSocialJs.includes('childComments.length > 0 && isChildThreadVisible'),
    'movie-social.js: direct replies to top-level comments must render without manual thread expansion'
  );
  assert(
    !appJs.includes('function getMoviePageReviewFormHtml(') &&
      !appJs.includes('function setMovieReviewFormMessage(') &&
      !appJs.includes('async function fetchMovieReviewLikes('),
    'app.js: movie review/comment implementation should stay in movie-social.js'
  );
  assert(
    !appJs.includes('function renderFollowingPageLoading()'),
    'app.js: following page renderer should stay in following-page.js'
  );
  assert(
    !appJs.includes('function renderNotificationsPageLoading()') &&
      notificationsPageJs.includes('function renderNotificationsPageLoading()'),
    'app.js: notifications page renderer should stay in notifications-page.js'
  );
  assert(
    !appJs.includes('function renderUserPageLoading()') &&
      userPageJs.includes('function renderUserPageLoading()'),
    'app.js: user page renderer should stay in user-page.js'
  );
  assert(
    !appJs.includes('getFollowingPageAvatarHtml('),
    'app.js: notifications must not call following-page.js local avatar helpers'
  );
  assert(
    !appJs.includes('notification_events (*)'),
    'app.js: notification page should select explicit notification event fields'
  );
  assert(
    notificationsPageJs.includes('data-notifications-clear-all="true"') &&
      notificationsPageJs.includes('async function clearAllNotifications()') &&
      notificationsPageJs.includes(".from('notification_deliveries')") &&
      notificationsPageJs.includes('.delete()'),
    'notifications-page.js: notifications page must keep the clear-all delivery action wired'
  );
  assert(
    directorsAdminSource.includes("transformedUrl.searchParams.set('width'") &&
      directorsAdminSource.includes("transformedUrl.searchParams.set('resize', 'contain')") &&
      !directorsAdminSource.includes("transformedUrl.searchParams.set('height'") &&
      !directorsAdminSource.includes("transformedUrl.searchParams.set('resize', 'cover')"),
    'src/directors-admin-app.jsx: director admin avatar transforms must use width + resize=contain without square cover crop'
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
    '/profile-activity-ranks/*',
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

  const attributeSafetyTargets = [
    ...clientJsFiles.filter(item => item !== 'custom-select.js'),
    ...lazyJsFiles
  ];

  for (const file of attributeSafetyTargets) {
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

async function checkMovieCommentThreadRenderingContract() {
  const comments = [
    {
      id: 'root-comment',
      movie_id: 'movie-1',
      user_id: 'user-1',
      parent_comment_id: null,
      depth: 0,
      comment_text: 'Root visible comment',
      created_at: '2026-08-05T12:00:00Z',
      has_spoilers: false,
      has_profanity: false,
      profiles: { display_name: 'Root User', default_display_name: 'Root User', public_handle: 'root' },
      likes_count: 0,
      liked_by_current_user: false
    },
    {
      id: 'second-level-comment',
      movie_id: 'movie-1',
      user_id: 'user-2',
      parent_comment_id: 'root-comment',
      depth: 1,
      comment_text: 'Direct reply must be visible by default',
      created_at: '2026-08-05T12:01:00Z',
      has_spoilers: false,
      has_profanity: false,
      profiles: { display_name: 'Reply User', default_display_name: 'Reply User', public_handle: 'reply' },
      likes_count: 0,
      liked_by_current_user: false
    },
    {
      id: 'third-level-comment',
      movie_id: 'movie-1',
      user_id: 'user-3',
      parent_comment_id: 'second-level-comment',
      depth: 2,
      comment_text: 'Third level stays collapsed',
      created_at: '2026-08-05T12:02:00Z',
      has_spoilers: false,
      has_profanity: false,
      profiles: { display_name: 'Nested User', default_display_name: 'Nested User', public_handle: 'nested' },
      likes_count: 0,
      liked_by_current_user: false
    }
  ];
  const { createMovieSocialController } = await import(
    `${pathToFileURL(join(rootDir, 'movie-social.js')).href}?smoke=${Date.now()}`
  );
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
  const controller = createMovieSocialController({
    escapeHtml,
    getAllMovieComments: () => comments,
    getAreMovieCommentsAvailable: () => true,
    getAreMovieCommentLikesAvailable: () => true,
    getCurrentUser: () => null,
    getIsAdmin: () => false,
    getPublicProfileHandle: profile => profile?.public_handle || '',
    buildUserPageUrl: handle => `/user/${handle}`,
    getUserPageAvatarLetter: value => String(value || '?').trim().charAt(0).toUpperCase()
  });
  const html = controller.getMoviePageCommentsSectionHtml({
    id: 'movie-1',
    slug: 'contract-movie',
    title: 'Contract Movie',
    year: 2026
  });

  assert(
    html.includes('Direct reply must be visible by default'),
    'movie-social.js: direct replies to top-level comments must be rendered by default'
  );
  assert(
    !html.includes('Third level stays collapsed'),
    'movie-social.js: third-level comment replies must stay collapsed by default'
  );
  assert(
    html.includes('data-movie-comment-toggle-thread="comment:second-level-comment"'),
    'movie-social.js: second-level comments with children must expose a deeper-thread toggle'
  );
}

checkJavaScriptSyntax();
checkAssetSizeReport();
checkContextJournalUpdated();
await checkNoTemporaryRootArtifacts();
await checkStaticGuards();
await checkMovieCommentThreadRenderingContract();
await checkRoutes();

console.log('Smoke check passed.');
