import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as cache from '../catalog-return-cache.js';
import { createMovieUserStateController } from '../movie-user-state.js';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
function functionSource(name) {
  const start = source.lastIndexOf('\n', source.indexOf(`function ${name}(`)) + 1;
  const end = source.indexOf('\n}', start) + 2;
  assert.ok(start > 0 && end > start, `Missing function ${name}`);
  return source.slice(start, end);
}
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
  getCurrentUserRating: () => rating, currentUserWatchlistMovieIds: new Set(['movie']), allMovieReviews: [],
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
await controller.runMovieMutationWithUiSync({ movieId: 'movie', mutation: async () => {} });
let snapshot = sandbox.readCatalogSessionSnapshot();
assert.ok(snapshot, 'A successful rating/watchlist mutation must retain the validated catalog data');
assert.equal(stamp, 'after');
assert.equal(snapshot.dataMutationStamp, 'after');
assert.equal(snapshot.movieRatings[0].rating, 9);
assert.equal(snapshot.movieWatchlist[0].movie_id, 'movie');

// Never resurrect an already invalid snapshot while advancing the local stamp.
stamp = 'unrelated-change';
await controller.runMovieMutationWithUiSync({ movieId: 'movie', mutation: async () => {} });
assert.equal(sandbox.readCatalogSessionSnapshot(), null);
seed();
const expired = JSON.parse(sessionStorage.getItem('data'));
expired.savedAt -= 1800001;
sessionStorage.setItem('data', JSON.stringify(expired));
await controller.runMovieMutationWithUiSync({ movieId: 'movie', mutation: async () => {} });
assert.equal(sandbox.readCatalogSessionSnapshot(), null, 'A mutation cannot extend the life of an expired catalog');
seed();
const beforeFailure = sessionStorage.getItem('data');
await assert.rejects(controller.runMovieMutationWithUiSync({ movieId: 'movie', mutation: async () => { throw Error('failed'); } }));
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
sandbox.container.querySelector = selector => selector === '.movie-card-skeleton' ? null : expandedCard;
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
function warmStart(payload, currentStamp) {
  const localStorage = storage();
  localStorage.setItem('horroreiro_data_mutation_stamp', currentStamp);
  localStorage.setItem('sb-project-auth-token', JSON.stringify({ user: { id: 'user' } }));
  const saved = storage();
  saved.setItem('horroreiro_catalog_dom_snapshot', JSON.stringify(payload));
  const classes = new Set();
  const movies = { innerHTML: '', removeAttribute() {} };
  vm.runInNewContext(warmSource, {
    localStorage, sessionStorage: saved, requestAnimationFrame() {},
    window: { __ENV__: { APP_BUILD_VERSION: 'build' }, addEventListener() {} },
    document: { body: { dataset: { appPage: 'catalog' } },
      documentElement: { classList: { add: value => classes.add(value) } },
      getElementById: id => id === 'movies' ? movies : null, querySelector: () => null }
  });
  return classes.has('app-catalog-warm-started');
}
assert.equal(warmStart(dom, stamp), true);
assert.equal(warmStart(dom, 'newer'), false);
console.log('Catalog return smoke passed.');
