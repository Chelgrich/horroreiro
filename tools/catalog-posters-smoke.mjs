import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const functions = [
  'normalizeMoviePosterImageRows', 'setMoviePosterImagesCache', 'getMoviePosterImages',
  'getNormalizedMovieIdsFromMovies', 'fetchMoviePosterImagesForMovie', 'fetchMoviePosterImagesForMovies',
  'loadMoviePosterImagesChunk', 'fetchAllSupabaseRows', 'fetchAllSupabaseRowsResult',
  'fetchMoviePosterImagesForMoviesSafe', 'ensurePreferredPosterImagesForMovies', 'getMoviePreferredPosterUrl',
  'createCatalogPosterOptions', 'loadCatalogPagePosters', 'loadCatalogPageDetails', 'replaceCatalogCards', 'renderMovies', 'goToCatalogPage',
  'preservePaintedPoster'
].map(name => {
  const start = source.lastIndexOf('\n', source.indexOf(`function ${name}(`)) + 1;
  const end = source.indexOf('\n}', start) + 2;
  assert(start > 0 && end > start, `Missing function ${name}`);
  return source.slice(start, end);
}).join('\n');

const baseline = Array.from({ length: 670 }, (_, i) => ({ id: String(i), poster_url: `base-${i}` }));
const flush = () => new Promise(setImmediate);
function fixture() {
  const requests = [];
  let pause;
  let fail = false;
  let prefer = true;
  let generation = 0;
  let galleryPrefix = 'ru-';
  const rendered = [];
  const posterUpdates = [];
  const cards = { children: [], classList: { remove() {} },
    querySelector(selector) { return selector.includes('pending') && this.children.find(card => card.pending); },
    querySelectorAll() { return this.children; },
    replaceChildren(children) { this.children = children; rendered.push(children); }
  };
  const ctx = vm.createContext({
    console: { warn() {} },
    catalogPosterView: null, moviePosterImagesTableAvailable: true, moviePosterImagesByMovieId: new Map(),
    moviePosterImagesLoadedByMovieId: new Set(), moviePosterImagesLoadPromisesByMovieId: new Map(),
    MOVIE_POSTER_IMAGE_DISPLAY_SELECT: 'movie_id, image_url, position', CATALOG_PRIORITY_POSTER_COUNT: 8,
    SUPABASE_ID_QUERY_CHUNK_SIZE: Number(source.match(/SUPABASE_ID_QUERY_CHUNK_SIZE = (\d+)/)[1]),
    shouldPreferRussianPosters: () => prefer,
    getAuthSessionController: () => ({ captureSession() {
      const version = generation;
      return { isCurrent: () => generation === version };
    } }),
    isMoviePosterImagesTableUnavailableError: () => false,
    throwIfSupabaseError(error) { if (error) throw error; },
    supabaseClient: { from(table) {
      assert.equal(table, 'movie_poster_images');
      let ids; let from; let to;
      return { select() { return this; }, eq(_key, value) { ids = [value]; return this; },
        in(_key, value) { ids = [...value]; return this; }, order() { return this; },
        range(start, end) { from = start; to = end; return this; },
        then(resolve) {
          requests.push(ids);
          const data = ids.filter(id => id !== '5').map(id => ({ movie_id: id, image_url: galleryPrefix + id, position: 0 }));
          const result = fail ? { error: { message: 'Offline' } } : { data: data.slice(from, to + 1) };
          if (pause) pause(() => resolve(result));
          else resolve(result);
        }
      };
    } },
    getCatalogCardController: () => ({ preserveMovieCardPoster() {}, updateMovieCardPoster(card, movie) {
      posterUpdates.push(movie.id);
      card.poster = ctx.getMoviePreferredPosterUrl(movie);
      card.pending = false;
    } }),
    getCatalogRenderController: () => ({ createCatalogMoviesFragment({ pageMovies, getCardRenderOptions }) {
      const fragment = pageMovies.map(movie => {
        const pending = getCardRenderOptions(movie).deferPoster;
        return { dataset: { movieId: movie.id }, pending, poster: pending ? null : ctx.getMoviePreferredPosterUrl(movie) };
      });
      fragment.querySelectorAll = () => fragment;
      return fragment;
    } }),
    moviesLoadedSuccessfully: true, container: cards, currentCatalogPage: 1, lastCatalogDomRenderSignature: '',
    searchInput: { value: '' }, viewMode: { value: 'list' }, sortMode: { value: 'default' },
    getCatalogDerivedState: () => ({
      filteredTotal: baseline.length,
      paginationState: { currentPage: ctx.currentCatalogPage },
      pageMovies: baseline.slice((ctx.currentCatalogPage - 1) * 40, ctx.currentCatalogPage * 40)
    }),
    getCatalogDomRenderSignature: ({ paginationState }) => `${paginationState.currentPage}:${prefer}`,
    getCatalogPaginationSlots() {}, renderActiveFilterChips() {}, syncQuickPresetButtons() {},
    isCatalogFilterDataPending: () => false,
    createMovieCardRenderContext() {}, saveCatalogState() {}, showMoviesResultCount() {}, getMoviesResultCountText() {},
    setCatalogBusyState() {}, updateCatalogStructuredData() {}, renderCatalogPagination() {},
    scheduleCatalogPageMovieLinks() {},
    recordCatalogDomSnapshotRender() {}, persistCatalogDomSnapshot() {},
    requestAnimationFrame() {}
  });
  vm.runInContext(functions, ctx);
  return { ctx, requests, cards, rendered, posterUpdates,
    pause: fn => { pause = fn; }, fail: value => { fail = value; },
    prefer: value => { prefer = value; generation += 1; }, prefix: value => { galleryPrefix = value; } };
}

const normal = fixture();
const bulk = fixture();
await bulk.ctx.fetchMoviePosterImagesForMovies(baseline.slice(0, 205).map(movie => movie.id));
assert.deepEqual(bulk.requests.map(ids => ids.length), [100, 100, 5]);
normal.ctx.renderMovies();
assert.equal(normal.cards.children[0].poster, null, 'Hold the poster slot until preference data arrives');
await flush();
assert.deepEqual(normal.requests, [baseline.slice(0, 40).map(movie => movie.id)]);
assert.equal(normal.cards.children[0].poster, 'ru-0');
assert.equal(normal.cards.children[5].poster, 'base-5');
assert.equal(normal.rendered.length, 1, 'Updating a poster must not rebuild the grid');
normal.ctx.goToCatalogPage(2);
await flush();
assert.deepEqual(normal.requests.map(ids => ids.length), [40, 40]);
assert.deepEqual(normal.requests[1], baseline.slice(40, 80).map(movie => movie.id));
normal.ctx.goToCatalogPage(1);
await flush();
assert.equal(normal.requests.length, 2, 'Returning to page one reuses loaded and empty galleries');
assert.equal(normal.cards.children[5].poster, 'base-5');

const rapid = fixture();
const completions = [];
rapid.pause(complete => completions.push(complete));
rapid.ctx.renderMovies();
rapid.ctx.renderMovies();
rapid.ctx.goToCatalogPage(2);
await flush();
assert.equal(rapid.requests.length, 2, 'Repeat renders share the in-flight query');
completions[0]();
await flush();
assert.deepEqual(rapid.posterUpdates, [], 'Late results must not patch the new page');
completions[1]();
await flush();
assert.equal(rapid.cards.children[0].poster, 'ru-40');

const disabled = fixture();
disabled.prefer(false);
disabled.ctx.renderMovies();
await flush();
assert.equal(disabled.requests.length, 0);
assert.equal(disabled.cards.children[0].poster, 'base-0');

const changedSession = fixture();
let finishPreviousSession;
changedSession.pause(complete => { finishPreviousSession = complete; });
changedSession.ctx.renderMovies();
await flush();
changedSession.prefer(false);
changedSession.ctx.renderMovies();
finishPreviousSession();
await flush();
assert.equal(changedSession.cards.children[0].poster, 'base-0');
assert.equal(changedSession.posterUpdates.length, 0, 'An earlier session cannot patch the new viewer\'s posters');

const offline = fixture();
offline.fail(true);
offline.ctx.renderMovies();
await flush();
assert.equal(offline.cards.children[0].poster, 'base-0');
offline.fail(false);
offline.ctx.renderMovies();
await flush();
assert.equal(offline.requests.length, 2);
assert.equal(offline.cards.children[0].poster, 'ru-0');

const forced = fixture();
let old;
forced.pause(complete => { old = complete; });
forced.ctx.renderMovies();
await flush();
forced.pause(null);
forced.prefix('new-');
await forced.ctx.fetchMoviePosterImagesForMovie('0', { force: true });
old();
await flush();
assert.equal(forced.ctx.getMoviePosterImages('0')[0].image_url, 'new-0', 'Older batch cannot overwrite a forced update');

const handoff = vm.createContext({ container: null, moviePage: null });
vm.runInContext(functions, handoff);
const wrapper = {};
const classes = new Set();
const painted = {
  complete: true, naturalWidth: 240, parentNode: wrapper, dataset: { originalPosterSrc: 'original' },
  classList: { add: name => classes.add(name), remove: (...names) => names.forEach(name => classes.delete(name)) },
  setAttribute() {}, removeAttribute() {},
  remove() { this.parentNode = null; }
};
let reused;
assert.equal(handoff.preservePaintedPoster(painted, {
  dataset: { originalPosterSrc: 'original' }, alt: 'Updated title',
  hasAttribute: () => false, replaceWith: node => { reused = node; }
}), true);
assert.equal(reused, painted, 'Identical sources keep the decoded image node');
assert.equal(painted.alt, 'Updated title');

let onLoad;
const decoded = Promise.withResolvers();
handoff.preservePaintedPoster(painted, {
  parentNode: wrapper, dataset: { originalPosterSrc: 'new' },
  hasAttribute: () => false,
  after(node) { assert.equal(node, painted); },
  addEventListener(_name, fn) { onLoad = fn; }, removeEventListener() {},
  decode: () => decoded.promise
});
onLoad();
assert(classes.has('poster-handoff-preview'));
assert.equal(painted.parentNode, wrapper, 'The previous poster stays visible during download and decode');
decoded.resolve();
await decoded.promise;
assert.equal(painted.parentNode, null, 'The previous poster is removed once the replacement can paint');
console.log('Catalog poster reads: first page 1×40 IDs, next page 1×40 IDs, return 0, preference off 0.');
