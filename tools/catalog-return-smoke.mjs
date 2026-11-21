import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as cache from '../catalog-return-cache.js';
import { createCatalogCardController } from '../catalog-cards.js';
import { createMovieUserStateController } from '../movie-user-state.js';

const source = (await readFile(new URL('../app.js', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
function functionSource(name) {
  const start = source.lastIndexOf('\n', source.indexOf(`function ${name}(`)) + 1;
  const end = source.indexOf('\n}\n', start) + 2;
  assert.ok(start > 0 && end > start, `Missing function ${name}`);
  return source.slice(start, end);
}

// Cold date-sorted data should settle while the rating request is still outstanding.
let completeStats;
let statsReads = 0;
let completeReviews;
let reviewReads = 0;
const movieReads = [];
let linkReads = 0;
let revisionResponse = { data: { revision: 'first' } };
const initialLoadSandbox = vm.createContext({
  container: { querySelector: () => null }, moviesLoadedSuccessfully: false, shouldFadeCatalogAfterSkeleton: false,
  currentUser: null, catalogMovieIndexRevision: null, AbortController, setTimeout, clearTimeout,
  catalogLinksDeferredDuringRestore: true,
  requestAnimationFrame: callback => callback(), window: { setTimeout: callback => callback() },
  loadCatalogPageMovieLinks: () => { linkReads += 1; },
  supabaseClient: { from: table => {
    assert.equal(table, 'catalog_movie_index_revision');
    return { select: column => {
      assert.equal(column, 'revision');
      return { abortSignal: () => ({ single: async () => revisionResponse }) };
    } };
  } },
  fetchMovies: async ({ indexRevision }) => {
    movieReads.push(indexRevision);
    initialLoadSandbox.catalogMovieIndexRevision = indexRevision;
  },
  fetchCatalogReviewSummary: () => {
    reviewReads += 1;
    return new Promise(resolve => { completeReviews = resolve; });
  },
  fetchMovieRatingStats: () => {
    statsReads += 1;
    return new Promise(resolve => { completeStats = resolve; });
  },
  shouldAwaitUserStateForCatalogLoad: () => false, shouldUseAuthenticatedUi: () => false,
  fetchCatalogUserState: async () => {}, refreshDynamicFilterOptions() {}, persistCatalogSessionSnapshot() {}
});
for (const name of ['readCatalogMovieIndexRevision', 'refreshCatalogMovieIndex', 'reloadCatalogData', 'scheduleCatalogPageMovieLinks']) {
  vm.runInContext(functionSource(name), initialLoadSandbox);
}
initialLoadSandbox.scheduleCatalogPageMovieLinks();
assert.equal(linkReads, 0, 'Restored movie links must wait for the current movie index');
const coldResult = await Promise.race([
  initialLoadSandbox.reloadCatalogData({ deferRatingStats: true, deferReviewSummary: true }),
  new Promise(resolve => setImmediate(() => resolve(null)))
]);
assert.ok(coldResult, 'A cold date-sorted catalog must load without waiting for aggregate ratings');
initialLoadSandbox.scheduleCatalogPageMovieLinks();
assert.equal(linkReads, 1, 'The current catalog can load its links after revalidation');
assert.deepEqual(movieReads, ['first']);
const unchanged = { allowMovieIndexReuse: true, deferRatingStats: true, deferReviewSummary: true };
await initialLoadSandbox.reloadCatalogData(unchanged);
assert.deepEqual(movieReads, ['first'], 'Matching revision keeps the index');
revisionResponse = { data: { revision: 'second' } };
await initialLoadSandbox.reloadCatalogData(unchanged);
await initialLoadSandbox.reloadCatalogData({ ...unchanged, allowMovieIndexReuse: false });
revisionResponse = { error: new Error('Revision unavailable') };
await initialLoadSandbox.reloadCatalogData(unchanged);
assert.deepEqual(movieReads, ['first', 'second', 'second', null], 'Changes, manual reload or failure read the index');
assert.equal(statsReads, 0, 'Aggregate network traffic must start after the first independent render');
assert.equal(reviewReads, 0, 'The review read must also start after the first independent render');
let blockingFinished = false;
const blockingLoad = initialLoadSandbox.reloadCatalogData().then(() => { blockingFinished = true; });
await new Promise(resolve => setImmediate(resolve));
assert.equal(blockingFinished, false, 'Rating-dependent and existing blocking callers must still wait');
assert.equal(statsReads, 1);
assert.equal(reviewReads, 1);
completeStats(false);
await new Promise(resolve => setImmediate(resolve));
assert.equal(blockingFinished, false, 'A review-dependent load must await the review IDs');
completeReviews();
await blockingLoad;

const reviewUpdates = [];
const reviewSandbox = vm.createContext({
  initialCatalogReviewSummaryPending: true, moviesLoadedSuccessfully: true, reviewedOnlyFilter: false,
  fetchCatalogReviewSummary: () => new Promise(resolve => { completeReviews = resolve; }),
  isCatalogPage: () => true, areInitialCatalogRatingStatsPending: () => false,
  refreshDynamicFilterOptions: () => reviewUpdates.push('filters'),
  preserveWindowScrollPosition: render => render(),
  renderMovies: () => reviewUpdates.push('render'),
  refreshCatalogDomSnapshotDataSignature: () => reviewUpdates.push('signature'),
  persistCatalogSessionSnapshot: () => reviewUpdates.push('snapshot')
});
for (const name of ['isCatalogFilterDataPending', 'loadDeferredInitialCatalogReviewSummary']) {
  vm.runInContext(functionSource(name), reviewSandbox);
}
const backgroundReviews = reviewSandbox.loadDeferredInitialCatalogReviewSummary();
assert.equal(reviewSandbox.isCatalogFilterDataPending(), false);
reviewSandbox.reviewedOnlyFilter = true;
assert.equal(reviewSandbox.isCatalogFilterDataPending(), true);
completeReviews();
await backgroundReviews;
assert.equal(reviewSandbox.isCatalogFilterDataPending(), false);
assert.deepEqual(reviewUpdates, ['filters', 'render', 'snapshot']);
reviewUpdates.length = 0;
reviewSandbox.initialCatalogReviewSummaryPending = true;
const unfilteredReviews = reviewSandbox.loadDeferredInitialCatalogReviewSummary();
reviewSandbox.reviewedOnlyFilter = false;
completeReviews();
await unfilteredReviews;
assert.deepEqual(reviewUpdates, ['signature', 'snapshot'], 'An unchecked review filter must keep its rendered cards');

let ratingsPending = true;
const ratingValue = {};
const ratingMeta = {};
const ratingCard = {
  dataset: { movieId: 'movie' },
  querySelector: selector => selector === '.movie-rating-value' ? ratingValue : ratingMeta
};
const { updateMovieCardRating } = createCatalogCardController({
  areRatingStatsPending: () => ratingsPending,
  getMovieAverageRating: () => 7.4, getMovieVotesCount: () => 3, getVotesLabel: () => 'votes'
});
updateMovieCardRating(ratingCard);
assert.equal(ratingValue.textContent, '—', 'Missing aggregates are pending, not zero');
ratingsPending = false;
updateMovieCardRating(ratingCard);
assert.equal(ratingValue.textContent, '7.4');
assert.equal(ratingMeta.textContent, '(3 votes)');

// Browser rAF callbacks receive a timestamp, never a DOM root.
const frames = [];
let layouts = 0;
const layoutRoot = { querySelectorAll: () => { layouts += 1; return []; } };
const layoutSandbox = vm.createContext({
  container: layoutRoot,
  bindRestoredCatalogPosterLoadStates() {}, bindCatalogEmptyStateEvents() {},
  requestAnimationFrame: callback => frames.push(callback)
});
for (const name of ['syncOpenExternalLinksLayouts', 'bindRestoredCatalogDomState']) {
  vm.runInContext(functionSource(name), layoutSandbox);
}
layoutSandbox.bindRestoredCatalogDomState();
for (const callback of frames.splice(0)) callback(1234.5);
assert.equal(layouts, 1, 'Warm catalog layout must use its DOM root rather than the rAF timestamp');
const linkWrites = [];
const makeLink = (className, href) => ({
  className,
  getAttribute: () => href,
  setAttribute: (_name, value) => linkWrites.push([className, value])
});
const linksHolder = (children, pending = false) => ({
  querySelector: selector => selector === '.movie-external-links'
    ? { children }
    : pending ? {} : null
});
const linksCard = { querySelector: () => linksHolder([makeLink('is-imdb', '/old'), makeLink('is-rt', '/same')]) };
const { updateMovieCardLinks } = createCatalogCardController({
  replaceChildrenKeepingMounted: () => assert.fail('Matching providers must stay mounted')
});
updateMovieCardLinks(linksCard, linksHolder([], true));
updateMovieCardLinks(linksCard, linksHolder([makeLink('is-imdb', '/old'), makeLink('is-rt', '/same')]));
assert.deepEqual(linkWrites, [], 'A pending read and identical results must leave restored links alone');
updateMovieCardLinks(linksCard, linksHolder([makeLink('is-imdb', '/new'), makeLink('is-rt', '/same')]));
assert.deepEqual(linkWrites, [['is-imdb', '/new']], 'Only the edited provider URL must change');

const oldCard = { getBoundingClientRect: () => ({ top: 10 }), querySelector: () => null,
  classList: { contains: name => name === 'has-open-external-links' },
  replaceWith() { assert.fail('A card updated in place must remain mounted'); } };
const newCard = { classList: { contains: () => false, add() {} },
  querySelector: () => ({ setAttribute() {}, classList: { add() {} } }) };
Object.assign(layoutSandbox, {
  getCatalogMovieById: () => ({ id: 'movie' }), createMovieCard: () => newCard,
  getCatalogCardController: () => ({ updateMountedMovieCard: (first, second) => {
    assert.equal(first, oldCard);
    assert.equal(second, newCard);
    return true;
  } }),
  persistCatalogDomSnapshot() {}
});
layoutRoot.querySelector = () => oldCard;
vm.runInContext(functionSource('rerenderMovieCard'), layoutSandbox);
layoutSandbox.rerenderMovieCard('movie', { preserveCardTop: false });
for (const callback of frames.splice(0)) callback(2345.6);
assert.equal(layouts, 2, 'An expanded card rerender must also discard the rAF timestamp');

let catalogMarkup = '<article>already mounted</article>';
let replacedMarkupCount = 0;
const warmDomSandbox = vm.createContext({
  container: {
    get innerHTML() { return catalogMarkup; },
    classList: { remove() {} }
  },
  document: { createElement: () => ({ set innerHTML(value) { this.content = value; } }) },
  replaceCatalogCards(value) { catalogMarkup = value; replacedMarkupCount += 1; },
  viewMode: { value: 'list' }, currentUser: null, lastCatalogDomRenderSignature: '',
  readCatalogDomSnapshot: () => ({
    containerHtml: '<article>already mounted</article>',
    dataSignatureHash: 'data', renderStateSignature: 'controls', moviesResultCountText: '1'
  }),
  canUseCatalogSnapshotForPosterPreference: () => true,
  getCatalogDataSignatureHash: () => 'data', getCatalogRenderStateSignature: () => 'controls',
  getCatalogDerivedState: () => ({ pageMovies: [] }), getCatalogDomRenderSignature: () => 'rendered',
  renderActiveFilterChips() {}, syncQuickPresetButtons() {}, showMoviesResultCount() {},
  updateCatalogStructuredData() {}, renderCatalogPagination() {}, setCatalogBusyState() {},
  recordCatalogDomSnapshotRender() {}, bindRestoredCatalogDomState() {}, loadCatalogPagePosters() {}
});
vm.runInContext(functionSource('hydrateCatalogDomFromSessionSnapshot'), warmDomSandbox);
assert.equal(warmDomSandbox.hydrateCatalogDomFromSessionSnapshot({}), true);
assert.equal(replacedMarkupCount, 0, 'Runtime must keep the matching poster nodes mounted by warm startup');
catalogMarkup = '';
assert.equal(warmDomSandbox.hydrateCatalogDomFromSessionSnapshot({}), true);
assert.equal(replacedMarkupCount, 1, 'Runtime must still restore a snapshot when its markup is missing');

// The actual lazy entry and write bridge must work directly from a cold catalog.
let writeError = null;
let ratingRenders = 0;
const messages = [];
const ratingSandbox = vm.createContext({
  window: {}, console: { error() {} },
  movieUserStateController: null, movieUserStateControllerPromise: null,
  loadUserStateModule: async () => ({ createMovieUserStateController }),
  currentUser: { id: 'fixture-user' }, allMovieRatings: [], initialCatalogRatingLoad: null,
  ratingRequestInFlight: new Set(), watchlistRequestInFlight: new Set(),
  supabaseClient: { from: () => ({ upsert: async () => ({ error: writeError }) }) },
  syncCatalogSessionSnapshotMovieState() {}, isMovieWatchedByCurrentUser: () => false,
  hasMovieWatchlistRecord: () => false,
  getCurrentUserRating: () => ratingSandbox.allMovieRatings[0]?.rating ?? null,
  addMovieToWatchlist() {}, removeMovieFromWatchlist() {}, deleteCurrentUserMovieRating() {},
  rebuildMovieRatingIndexes() {}, updateLocalMovieRatingStats() {},
  MOVIE_MUTATION_RERENDER_PRESETS: { watchlistToggle() {}, ratingChange: () => { ratingRenders += 1; } },
  showMovieRatingFeedback() {}, showMovieWatchlistFeedback() {},
  showAppMessage: (...args) => messages.push(args)
});
for (const name of ['getMovieUserStateControllerContext', 'ensureMovieUserStateControllerLoaded', 'getMovieUserStateControllerForRating', 'waitForInitialCatalogRatingState', 'upsertCurrentUserMovieRating', 'saveUserMovieRating']) {
  vm.runInContext(functionSource(name).replace("import(getLazyFeatureModuleUrl('movie-user-state.js'))", 'loadUserStateModule()'), ratingSandbox);
}
await ratingSandbox.saveUserMovieRating('movie', 8);
assert.equal(ratingSandbox.allMovieRatings[0].rating, 8, 'Rating must save before any detail-page module is loaded');
assert.equal(ratingRenders, 1);
writeError = new TypeError('Failed to fetch');
await ratingSandbox.saveUserMovieRating('movie', 7);
assert.equal(ratingSandbox.allMovieRatings[0].rating, 8, 'Failed writes must retain the previous rating');
assert.equal(ratingRenders, 1, 'A failed write must not report success');
assert.equal(messages.length, 1, 'A failed rating must show feedback rather than silently do nothing');
assert.equal(messages[0][1], 'error');
assert.equal(ratingSandbox.ratingRequestInFlight.size, 0, 'Failed writes must allow a retry');
let finishUserState;
let isCurrent = true;
ratingSandbox.initialCatalogRatingLoad = {
  isCurrent: () => isCurrent,
  ready: new Promise(resolve => { finishUserState = resolve; })
};
writeError = null;
const earlyWrite = ratingSandbox.saveUserMovieRating('movie', 9);
await new Promise(resolve => setImmediate(resolve));
assert.equal(ratingSandbox.allMovieRatings[0].rating, 8, 'An early write must wait for rating state');
isCurrent = false;
finishUserState();
await earlyWrite;
assert.equal(ratingSandbox.allMovieRatings[0].rating, 8, 'An early write must not cross a session change');
const storage = () => {
  const values = new Map();
  return { get length() { return values.size; }, key: index => [...values.keys()][index],
    getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
const sessionStorage = storage();
let stamp = 'before';
let rating = 9;
const sandbox = vm.createContext({
  console, sessionStorage, catalogReturnCacheTools: cache,
  CATALOG_SESSION_SNAPSHOT_KEY: 'data', CATALOG_SESSION_SNAPSHOT_VERSION: 9,
  CATALOG_SESSION_SNAPSHOT_MAX_AGE_MS: 1800000, APP_BUILD_VERSION: 'build',
  catalogSessionSnapshotDataHashCache: new WeakMap(),
  isDataMutationStampFresh: value => value === stamp,
  getDataMutationStamp: () => stamp,
  markLocalDataMutation: () => { stamp = 'after'; },
  currentUser: { id: 'user' }, movieRatingStatsByMovieId: new Map(),
  getCurrentUserRating: () => rating, currentUserWatchlistMovieIds: new Set(['movie']),
  getMoviePageSocialSnapshot: () => ({ movieReviews: [], movieComments: [] }),
  isCatalogPage: () => true, moviesLoadedSuccessfully: true,
  viewMode: { value: 'list' }, shouldPreferRussianPosters: () => false,
  sortMode: { value: 'default' }, currentCatalogPage: 1,
  catalogProfileActivityHandle: '', catalogProfileActivityKey: '', catalogProfileActivityUserId: '',
  catalogProfileActivityDisplayName: '', catalogProfileActivityRatingsByMovieId: new Map(),
  profileMovieIds: new Set(),
  getCatalogFilterStateSnapshot: () => ({ profileActivityMovieIds: sandbox.profileMovieIds }),
  container: { innerHTML: '<article>old cards</article>', querySelector: () => null },
  moviesSectionTitle: null, moviesResultCount: null, quickPresetsBar: null,
  activeFiltersBar: null, catalogPaginationTop: null, catalogPaginationBottom: null,
  lastCatalogDomRenderSignature: 'rendered',
  catalogDomSnapshotRenderState: null,
  getCatalogDerivedState: () => ({}), getCatalogDomRenderSignature: () => 'rendered',
  getCatalogRenderStateSignature: () => 'filters',
  createCatalogSessionSnapshotPayload: () => JSON.parse(sessionStorage.getItem('data'))
});
for (const name of ['readCatalogSessionSnapshot', 'writeCatalogSessionSnapshot', 'getCatalogDataSignatureHash', 'getCatalogRenderStateSignature', 'syncCatalogSessionSnapshotMovieState', 'recordCatalogDomSnapshotRender', 'createCatalogDomSnapshotPayload']) {
  vm.runInContext(functionSource(name), sandbox);
}
function seed() {
  sessionStorage.setItem('data', JSON.stringify({
    version: 9, buildVersion: 'build', dataMutationStamp: stamp, savedAt: Date.now(),
    userId: 'user', movies: [{ id: 'movie' }], movieRatings: [], movieWatchlist: []
  }));
}
seed();
const controller = createMovieUserStateController({
  markLocalDataMutation: sandbox.markLocalDataMutation,
  syncCatalogSnapshot: sandbox.syncCatalogSessionSnapshotMovieState
});
const snapshotMutation = { movieId: 'movie', requestSet: new Set(), rerender() {}, mutation: async () => {} };
await controller.runMovieMutationWithUiSync(snapshotMutation);
let snapshot = sandbox.readCatalogSessionSnapshot();
assert.ok(snapshot, 'A successful rating/watchlist mutation must retain the validated catalog data');
assert.equal(stamp, 'after');
assert.equal(snapshot.dataMutationStamp, 'after');
assert.equal(snapshot.movieRatings[0].rating, 9);
assert.equal(snapshot.movieWatchlist[0].movie_id, 'movie');

// Never resurrect an already invalid snapshot while advancing the local stamp.
stamp = 'unrelated-change';
await controller.runMovieMutationWithUiSync(snapshotMutation);
assert.equal(sandbox.readCatalogSessionSnapshot(), null);
seed();
const expired = JSON.parse(sessionStorage.getItem('data'));
expired.savedAt -= 1800001;
sessionStorage.setItem('data', JSON.stringify(expired));
await controller.runMovieMutationWithUiSync(snapshotMutation);
assert.equal(sandbox.readCatalogSessionSnapshot(), null, 'A mutation cannot extend the life of an expired catalog');
seed();
const beforeFailure = sessionStorage.getItem('data');
await assert.rejects(controller.runMovieMutationWithUiSync({ ...snapshotMutation, mutation: async () => { throw Error('failed'); } }));
assert.equal(sessionStorage.getItem('data'), beforeFailure);

snapshot = sandbox.readCatalogSessionSnapshot();
sandbox.recordCatalogDomSnapshotRender(snapshot);
const dom = sandbox.createCatalogDomSnapshotPayload(snapshot);
assert.equal(dom.dataMutationStamp, stamp, 'New DOM snapshots must pass the early warm-start mutation check');
assert.equal(dom.containerHtml, '<article>old cards</article>');
sandbox.lastCatalogDomRenderSignature = '';
assert.ok(sandbox.createCatalogDomSnapshotPayload(snapshot), 'An identical background refresh must retain the existing DOM, including expanded cards');
const renderedState = sandbox.catalogDomSnapshotRenderState;
sandbox.catalogDomSnapshotRenderState = { ...renderedState, dataSignatureHash: 'previous-data' };
assert.equal(sandbox.createCatalogDomSnapshotPayload(snapshot), null, 'Background data changes cannot certify old DOM as current');
sandbox.catalogDomSnapshotRenderState = { ...renderedState, renderStateSignature: 'previous-filters' };
assert.equal(sandbox.createCatalogDomSnapshotPayload(snapshot), null, 'A pending filter render cannot save the previous cards');
sandbox.catalogDomSnapshotRenderState = renderedState;
for (const key of ['catalogProfileActivityHandle', 'catalogProfileActivityKey', 'catalogProfileActivityDisplayName']) {
  sandbox[key] = 'other';
  assert.equal(sandbox.createCatalogDomSnapshotPayload(snapshot), null, `Pending ${key} changes cannot certify old cards`);
  sandbox[key] = '';
}
sandbox.profileMovieIds.add('movie');
assert.equal(sandbox.createCatalogDomSnapshotPayload(snapshot), null, 'Matched profile movie IDs must be serialized');
sandbox.profileMovieIds.clear();
sandbox.catalogProfileActivityRatingsByMovieId.set('movie', 8);
assert.equal(sandbox.createCatalogDomSnapshotPayload(snapshot), null, 'Displayed profile ratings must be part of render provenance');
sandbox.catalogProfileActivityRatingsByMovieId.clear();
assert.equal(sandbox.createCatalogDomSnapshotPayload({ ...snapshot, dataSignatureHash: '', movies: [{ id: 'different' }] }), null, 'An idle callback must not attach an old data hash to newly rendered DOM');

// A deferred user refresh may invalidate the render signature even if no visible
// cards changed. The real departure handler must finish the render before saving.
const departure = source.match(/window.addEventListener\('pagehide', event => \{([\s\S]*?)\n  \}\);/);
assert.ok(departure, 'Missing catalog departure handler');
sandbox.saveCatalogScrollPosition = () => {};
sandbox.saveCatalogAnchorMovieId = () => {};
sandbox.lastCatalogDomRenderSignature = '';
sandbox.catalogDomSnapshotRenderState = null;
let savedDom;
let renders = 0;
let expanded = true;
const toggle = { getAttribute: () => expanded ? 'true' : 'false' };
const expandedCard = { dataset: { movieId: 'movie' }, querySelector: () => toggle };
sandbox.container.querySelector = selector => selector.startsWith('.movie-card-skeleton') ? null : expandedCard;
sandbox.toggleCatalogExternalLinksPanel = () => { expanded = true; };
sandbox.renderMovies = () => {
  renders += 1;
  expanded = false;
  sandbox.container.innerHTML = '<article>current cards</article>';
  sandbox.lastCatalogDomRenderSignature = 'rendered';
  sandbox.recordCatalogDomSnapshotRender();
};
sandbox.persistCatalogSessionSnapshot = options => {
  assert.equal(options.persistDomSnapshotImmediately, true);
  savedDom = sandbox.createCatalogDomSnapshotPayload();
};
vm.runInContext(`(event => {${departure[1]} })({persisted: false})`, sandbox);
assert.equal(savedDom.containerHtml, '<article>current cards</article>');
assert.equal(renders, 1);
assert.equal(expanded, true, 'Finishing a pending render must preserve the expanded external links');
vm.runInContext(`(event => {${departure[1]} })({persisted: false})`, sandbox);
assert.equal(renders, 1, 'An already current DOM must be serialized without replacing cards');
vm.runInContext(`(event => {${departure[1]} })({persisted: true})`, sandbox);
assert.equal(renders, 1, 'Native back/forward cache must keep the live document intact');

// Run the actual early bootstrap, rather than repeating its validation in the test.
const warmSource = await readFile(new URL('../catalog-warm-start.js', import.meta.url), 'utf8');
function warmStart(payload, currentStamp, { scrollPosition = null, hasAnchor = false } = {}) {
  const localStorage = storage();
  localStorage.setItem('horroreiro_data_mutation_stamp', currentStamp);
  localStorage.setItem('sb-project-auth-token', JSON.stringify({ user: { id: 'user' } }));
  const saved = storage();
  saved.setItem('horroreiro_catalog_dom_snapshot', JSON.stringify(payload));
  if (scrollPosition !== null) saved.setItem('horroreiro_catalog_scroll_position', scrollPosition);
  if (hasAnchor) saved.setItem('horroreiro_catalog_anchor_movie_id', 'movie');
  const classes = new Set();
  const movies = { innerHTML: '', removeAttribute() {} };
  const frames = [];
  const scrolls = [];
  let anchorScrolls = 0;
  vm.runInNewContext(warmSource, {
    localStorage, sessionStorage: saved, requestAnimationFrame: callback => frames.push(callback),
    window: { __ENV__: { APP_BUILD_VERSION: 'build' }, addEventListener() {}, scrollTo: (x, y) => scrolls.push(y) },
    document: { body: { dataset: { appPage: 'catalog' } },
      documentElement: { classList: { add: value => classes.add(value) } },
      getElementById: id => id === 'movies' ? movies : null, querySelector: () => null,
      querySelectorAll: () => [{ dataset: { movieId: 'movie' }, scrollIntoView: () => { anchorScrolls += 1; } }] }
  });
  while (frames.length) frames.shift()();
  return { started: classes.has('app-catalog-warm-started'), scrolls, anchorScrolls };
}
assert.equal(warmStart(dom, stamp).started, true);
assert.equal(warmStart(dom, 'newer').started, false);
const exactWarmScroll = warmStart(dom, stamp, { scrollPosition: '386', hasAnchor: true });
assert.deepEqual(exactWarmScroll.scrolls, [386, 386], 'Early warm restore must preserve the saved offset rather than realign a card');
assert.equal(exactWarmScroll.anchorScrolls, 0);
assert.deepEqual(warmStart(dom, stamp, { scrollPosition: '0', hasAnchor: true }).scrolls, [0, 0], 'An explicitly saved zero is valid');
assert.equal(warmStart(dom, stamp, { hasAnchor: true }).anchorScrolls, 2, 'Anchor remains a fallback without a saved offset');
for (const scrollPosition of ['', '   ', 'bad', '-1', 'Infinity']) {
  assert.equal(warmStart(dom, stamp, { scrollPosition, hasAnchor: true }).anchorScrolls, 2, `Invalid offset ${JSON.stringify(scrollPosition)} must use the anchor`);
}
assert.deepEqual(warmStart(dom, stamp).scrolls, [], 'Absent position must not force scroll to zero');

const restoreStorage = storage();
const appScrolls = [];
const appAnchors = [];
const restoreSandbox = vm.createContext({
  console, sessionStorage: restoreStorage,
  CATALOG_SCROLL_POSITION_KEY: 'scroll', CATALOG_ANCHOR_MOVIE_ID_KEY: 'anchor',
  requestAnimationFrame: callback => callback(), shouldSkipWindowScrollRestore: () => false,
  scrollWindowToPosition: y => appScrolls.push(y), scheduleCatalogAnchorRestore: id => appAnchors.push(id)
});
vm.runInContext(functionSource('restoreCatalogScrollPosition'), restoreSandbox);
restoreStorage.setItem('scroll', '386');
restoreStorage.setItem('anchor', 'movie');
restoreSandbox.restoreCatalogScrollPosition();
assert.deepEqual(appScrolls, [386], 'Full app must agree with early warm restoration');
assert.deepEqual(appAnchors, []);
assert.equal(restoreStorage.getItem('anchor'), null);
restoreStorage.setItem('anchor', 'movie');
restoreSandbox.restoreCatalogScrollPosition();
assert.deepEqual(appAnchors, ['movie']);
restoreStorage.setItem('scroll', '   ');
restoreStorage.setItem('anchor', 'movie');
restoreSandbox.restoreCatalogScrollPosition();
assert.deepEqual(appScrolls, [386]);
assert.deepEqual(appAnchors, ['movie', 'movie']);
console.log('Catalog return smoke passed.');
