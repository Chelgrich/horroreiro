import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createCatalogCardController } from '../catalog-cards.js';
import { createCatalogRenderController } from '../catalog-render.js';
import { doesMovieMatchCatalogFilters } from '../catalog-filters.js';
import { createAdminActionTools } from '../admin-actions.js';
import { createMovieUserStateController } from '../movie-user-state.js';
import { createMoviePageOrchestratorController } from '../movie-page-orchestrator.js';
import { createMoviePageShellController } from '../movie-page-shell.js';
import { createProfileSettingsActions } from '../profile-settings-actions.js';
import { createMovieEditorController } from '../movie-editor.js';

// Missing internal wiring must not look like successful persistence or empty data.
let successCount = 0;
let syncCount = 0;
const requestSet = new Set();
const failures = [];
const context = {
  getCurrentUser: () => ({ id: 'user' }),
  getCurrentUserRating: () => null,
  getRatingRequestSet: () => requestSet,
  getWatchlistRequestSet: () => requestSet,
  isMovieWatchedByCurrentUser: () => false,
  hasMovieWatchlistRecord: () => false,
  syncCatalogSnapshot: () => { syncCount += 1; },
  rerenderRatingChange: () => { successCount += 1; },
  rerenderWatchlistToggle: () => { successCount += 1; },
  showRatingFeedback: () => { successCount += 1; },
  showWatchlistFeedback: () => { successCount += 1; },
  onSaveRatingError: error => failures.push(error),
  onRemoveRatingError: error => failures.push(error),
  onWatchlistToggleError: error => failures.push(error)
};
const mutations = createMovieUserStateController(context);
await mutations.saveUserMovieRating('movie', 8);
await mutations.removeUserMovieRating('movie');
await mutations.toggleMovieWatchlist('movie');
assert.equal(successCount, 0, 'Missing write adapters must never report success');
assert.equal(syncCount, 0, 'Missing write adapters must not advance snapshots');
assert.equal(failures.length, 3);
assert(failures.every(error => error instanceof TypeError));
assert.equal(requestSet.size, 0, 'Failed mutations must release the retry guard');
await assert.rejects(mutations.runMovieMutationWithUiSync({ movieId: 'movie', requestSet }), TypeError);

assert.throws(() => createCatalogCardController({}).createMovieCardRenderContext(), TypeError);
assert.throws(() => createCatalogRenderController({}).sortMoviesWithinMonth(
  [{ id: 'one' }, { id: 'two' }], 'rating'
), TypeError, 'Missing ratings must not silently become zero during sorting');
for (const filterState of [
  { hasRatingRange: true, ratingFrom: 7, ratingTo: 10 },
  { hasYearRange: true, yearFrom: 2020, yearTo: 2030 },
  { reviewedOnly: true },
  { hasCurrentUser: true, hasWatchlistFilter: true, selectedWatchlist: 'in_watchlist' }
]) {
  assert.throws(() => doesMovieMatchCatalogFilters({ id: 'movie' }, filterState, {}, {}), TypeError);
}
assert.equal(doesMovieMatchCatalogFilters({ id: 'movie' }, { hasRatingRange: true, ratingFrom: 7, ratingTo: 10 }, {
  getMovieAverageRating: () => 8
}, {}), true, 'Valid rating filters retain their behavior');
assert.throws(() => createAdminActionTools({}).buildManualSimilarAuditReport(), TypeError);

const page = createMoviePageOrchestratorController({ location: { pathname: '/movie/fixture', search: '' } });
await assert.rejects(page.initMoviePage({}), TypeError, 'Missing session/data initialization cannot silently succeed');

const movie = { id: 'movie' };
const companyRows = [{ role: 'production' }];
const initialCompanyRows = createMoviePageShellController().getInitialMovieCompanyRows;
const companySnapshot = JSON.stringify({ id: movie.id, source: [null, null, null], rows: companyRows });
assert.equal(initialCompanyRows({ id: 'wrong' }, companySnapshot), null);
assert.equal(initialCompanyRows({ ...movie, production: ['Changed'] }, companySnapshot), null);
assert.equal(initialCompanyRows(movie, 'invalid JSON'), null);

const movieStartup = await readFile(new URL('../movie-warm-start.js', import.meta.url), 'utf8');
function firstPosterPreference(userId, hint) {
  const localStorage = { horroreiro_movie_poster_preference: JSON.stringify(hint) };
  if (userId) localStorage['sb-fixture-auth-token'] = JSON.stringify({ user: { id: userId } });
  localStorage.getItem = key => localStorage[key] ?? null;
  const context = vm.createContext({ localStorage, POSTER_PREFERENCE_KEY: 'horroreiro_movie_poster_preference' });
  for (const name of ['parseJson', 'readPosterPreference']) {
    const start = movieStartup.indexOf(`  function ${name}(`);
    vm.runInContext(movieStartup.slice(start, movieStartup.indexOf('\n  }', start) + 4), context);
  }
  return context.readPosterPreference();
}
const savedPosterPreference = { userId: 'viewer', preferRussianPosters: true };
assert.equal(firstPosterPreference('viewer', savedPosterPreference), true);
assert.equal(firstPosterPreference('viewer', { ...savedPosterPreference, preferRussianPosters: false }), false);
assert.equal(firstPosterPreference('other-viewer', savedPosterPreference), null);
assert.equal(firstPosterPreference(null, savedPosterPreference), false);
let currentMovie;
const moviePageEvents = [];
const moviePageBindings = {
  fetchPayloadByRouteParams: async () => movie,
  getAreDirectorsAvailable: () => false,
  getAreCompaniesAvailable: () => true,
  getInitialCompanyRows: value => initialCompanyRows(value, companySnapshot),
  ensureCompanyItemsLoaded() { throw Error('Unexpected separate company request'); },
  getCurrentMovieId: () => currentMovie?.id,
  getCurrentMovie: () => currentMovie,
  setCurrentMovie: value => { currentMovie = value; },
  resetComposerState() {},
  createSessionCacheEntry: () => null,
  getActiveSessionCacheSignature: () => '',
  renderMoviePage: value => moviePageEvents.push(['render', value.movie_companies]),
  loadDeferredSections: async () => {},
  onCompanyLoadError: error => moviePageEvents.push(['error', error])
};
await page.loadMoviePageByRouteParams({ slug: 'fixture' }, moviePageBindings);
assert.deepEqual(moviePageEvents, [['render', companyRows]], 'Server company links are ready at first render');

const refreshResponse = Promise.withResolvers();
const refreshedMovie = { id: movie.id, production: ['Changed'] };
moviePageEvents.length = 0;
const refresh = page.loadMoviePageByRouteParams({ slug: 'fixture' }, {
  ...moviePageBindings,
  fetchPayloadByRouteParams: async () => refreshedMovie,
  ensureCompanyItemsLoaded: async value => { value.movie_companies = await refreshResponse.promise; }
});
await Promise.resolve();
assert.deepEqual(moviePageEvents, [], 'A stale company snapshot must not produce an incomplete render');
refreshResponse.resolve([]);
await refresh;
assert.deepEqual(moviePageEvents, [['render', []]]);

const heldReviews = Promise.withResolvers();
const socialEvents = [];
const socialLoad = page.loadDeferredMoviePageSections(movie, {
  getCurrentMovieId: () => movie.id,
  loadSimilarMovies: async () => {},
  fetchReviews: () => heldReviews.promise,
  fetchComments: async () => { socialEvents.push('fetch comments'); },
  renderReviewsSection: () => socialEvents.push('render reviews'),
  renderCommentsSection: () => socialEvents.push('render comments'),
  syncCatalogSnapshot() {},
  persistSessionCache() {}
});
await Promise.resolve();
assert.deepEqual(socialEvents, ['fetch comments'], 'Comments fetch in parallel and wait for review layout before painting');
heldReviews.resolve();
await socialLoad;
assert.deepEqual(socialEvents, ['fetch comments', 'render reviews', 'render comments']);

const partialReturn = [];
await page.loadMoviePageByRouteParams({ slug: 'fixture' }, {
  ...moviePageBindings,
  createSessionCacheEntry: () => ({ signature: 'same' }),
  getActiveSessionCacheSignature: () => 'same',
  setActiveSessionCacheSignature() {},
  hasRenderedMoviePage: () => false,
  renderMoviePage: (_, options) => partialReturn.push(options.socialLoading),
  loadDeferredSections: async () => { partialReturn.push('reload social'); }
}, { skipRenderIfCacheFresh: true });
assert.deepEqual(partialReturn, [true, 'reload social'], 'An incomplete warm restore must finish loading social data');

let avatarWrites = 0;
const settings = createProfileSettingsActions({
  supabaseClient: { storage: { from: () => { avatarWrites += 1; throw Error('unexpected write'); } } }
});
// Call the real write with no session adapter: it must fail before touching Storage.
await assert.rejects(settings.uploadAvatarBlob({ type: 'image/jpeg' }), TypeError);
assert.equal(avatarWrites, 0);
const missingSubmit = await createMovieEditorController({}).submitMovieFormEvent({
  setSubmittingState() {}, setStatus() {}
});
assert(missingSubmit.error instanceof TypeError, 'A missing movie create adapter must not report a successful form submission');

const loader = await readFile(new URL('../app-script-loader.js', import.meta.url), 'utf8');
const startup = vm.createContext({ window: {}, markAppStarted() {} });
for (const name of ['mountSharedLayout', 'runAppRuntime']) {
  const start = loader.indexOf(`  function ${name}(`);
  const end = loader.indexOf('\n  function ', start + 1);
  vm.runInContext(loader.slice(start, end), startup);
}
assert.throws(() => startup.mountSharedLayout(), /mountSharedHeader/);
startup.window.HorroreiroApp = { init() { throw Error('Legacy init must not replace a missing runtime'); } };
assert.throws(() => startup.runAppRuntime(), /run/);

const preloads = [];
const scripts = [];
const advanceLoader = () => new Promise(resolve => setImmediate(resolve));
const layoutMethods = ['mountSharedHeader', 'mountSharedAuthModal', 'mountSharedDisplayNameModal', 'mountSharedFooter'];
vm.runInNewContext(loader, {
  window: {
    __APP_ENV__: { APP_BUILD_VERSION: 'confirmed-build' },
    location: new URL('https://fixture.test/'),
    addEventListener() {},
    SharedLayout: Object.fromEntries(layoutMethods.map(name => [name, () => {}]))
  },
  document: {
    createElement: tag => ({ tag }),
    head: { appendChild: link => preloads.push(link) },
    body: { dataset: { appPage: 'catalog' }, appendChild: script => scripts.push(script) }
  }
});
await advanceLoader();
const appScriptUrl = '/app-assets/confirmed-build?file=app.js';
const sdkScriptUrl = '/assets/vendor/supabase-2.119.0.js';
assert.deepEqual(preloads.map(link => [link.rel, link.as, link.href]), [
  ['preload', 'script', sdkScriptUrl], ['preload', 'script', appScriptUrl]
]);
scripts.find(script => script.src.endsWith('file=shared-layout.js')).onload();
await advanceLoader();
scripts.find(script => script.src.endsWith('file=custom-select.js')).onload();
scripts.find(script => script.src.endsWith('file=app-page-runtime.js')).onload();
await advanceLoader();
assert.equal(scripts.at(-1).src, sdkScriptUrl, 'Only the SDK executes while it is pending');
assert(!scripts.some(script => script.src === appScriptUrl));
scripts.at(-1).onload();
await advanceLoader();
assert.equal(scripts.at(-1).src, appScriptUrl, 'App executes using its preload URL after the SDK');

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const versionKey = 'horroreiro_app_build_version';
function bootWithStoredVersion(savedBuildVersion, { denyRead = false, denyWrite = false, isFallback = false } = {}) {
  const storage = { horroreiro_fixture: 'existing preference', 'sb-fixture-auth-token': 'synthetic-session' };
  if (savedBuildVersion) storage[versionKey] = savedBuildVersion;
  Object.defineProperties(storage, {
    getItem: { value(key) { if (denyRead) throw Error('Storage blocked'); return this[key] ?? null; } },
    setItem: { value(key, value) { if (denyWrite) throw Error('Storage blocked'); this[key] = value; } },
    removeItem: { value(key) { delete this[key]; } }
  });
  const replacements = [];
  const initializedUrls = [];
  const location = new URL('https://fixture.test/?page=2#anchor');
  location.replace = target => replacements.push(target);
  const session = new Map([['horroreiro_stylesheet_cache_v1', 'current styles'], ['horroreiro_catalog_dom_snapshot', 'old snapshot']]);
  const ctx = vm.createContext({
    appEnv: { isFallback }, APP_BUILD_VERSION: 'next-build', APP_VERSION_STORAGE_KEY: versionKey, localStorage: storage,
    sessionStorage: session, console: { warn() {} }, window: { location },
    loadProfileUtils() {}, loadAuthSessionController() {}, loadAuthUiController() {}, loadAccountHeaderController() {},
    bindWindowScrollIntentTracker() {}, bindCustomSelectGlobalEvents() {}, initCustomSelects() {},
    initCurrentPageLinkGuard() {}, bindSharedUiEvents() {}, bindSecondaryPageSnapshotEvents() {},
    getAuthUiController: () => ({ initializeRedirect: url => initializedUrls.push(url) })
  });
  for (const name of ['rememberAppBuildVersion', 'initSharedApp']) {
    const start = appSource.lastIndexOf('\n', appSource.indexOf(`function ${name}(`)) + 1;
    vm.runInContext(appSource.slice(start, appSource.indexOf('\n}', start) + 2), ctx);
  }
  return { init: ctx.initSharedApp, storage, replacements, initializedUrls, session };
}
const firstVisit = bootWithStoredVersion(null);
assert.equal(await firstVisit.init(), true, 'A missing saved build initializes without navigating again');
assert.equal(firstVisit.storage[versionKey], 'next-build');
assert.equal(firstVisit.storage.horroreiro_fixture, 'existing preference');
assert.deepEqual(firstVisit.replacements, []);
assert.deepEqual(firstVisit.initializedUrls, ['https://fixture.test/?page=2#anchor']);
const upgrade = bootWithStoredVersion('previous-build');
assert.equal(await upgrade.init(), true, 'A new build must continue startup in the current document');
assert.deepEqual(upgrade.replacements, []);
assert.deepEqual(upgrade.initializedUrls, ['https://fixture.test/?page=2#anchor']);
assert.equal(upgrade.storage[versionKey], 'next-build');
assert.equal(upgrade.storage.horroreiro_fixture, 'existing preference');
assert.equal(upgrade.session.get('horroreiro_stylesheet_cache_v1'), 'current styles');
assert.equal(upgrade.session.get('horroreiro_catalog_dom_snapshot'), 'old snapshot');
assert.equal(upgrade.storage['sb-fixture-auth-token'], 'synthetic-session');
for (const savedBuild of [null, 'previous-build']) {
  const fallback = bootWithStoredVersion(savedBuild, { isFallback: true });
  assert.equal(await fallback.init(), true, 'A fallback environment cannot trigger an upgrade reset');
  assert.equal(fallback.storage[versionKey], savedBuild ?? undefined);
  assert.equal(fallback.storage.horroreiro_fixture, 'existing preference');
  assert.deepEqual(fallback.replacements, []);
}
for (const options of [{ denyRead: true }, { denyWrite: true }]) {
  const blocked = bootWithStoredVersion('previous-build', options);
  assert.equal(await blocked.init(), true, 'Storage failure cannot block startup or repeat navigation');
  assert.deepEqual(blocked.replacements, []);
}
console.log('Module contract smoke passed.');
