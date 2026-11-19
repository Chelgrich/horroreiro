import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
function functionSource(name) {
  const start = source.lastIndexOf('\n', source.indexOf(`function ${name}(`)) + 1;
  const end = source.indexOf('\n}', start) + 2;
  assert.ok(start > 0 && end > start, `Missing function ${name}`);
  return source.slice(start, end);
}

const requests = [];
let failPage = null;
let pausePage = null;
const fixtures = {};
let authGeneration = 0;
const makeRows = count => Array.from({ length: count }, (_, i) => ({
  id: String(i).padStart(5, '0'), movie_id: `movie-${i}`, user_id: 'user-a',
  title: 'Same title', rating: i < 1000 ? 1 : 10, created_at: '2026-01-01', updated_at: '2026-01-01'
}));

function query(table) {
  const filters = [];
  const orders = [];
  let offset = 0;
  let limit = 1000;
  let select;
  let idCount;
  const builder = {
    select(value) { select = value; return this; },
    eq(key, value) { filters.push(row => row[key] === value); return this; },
    in(key, values) { idCount = values.length; filters.push(row => values.includes(row[key])); return this; },
    order(key, options = {}) { if (!options.foreignTable) orders.push([key, options.ascending !== false]); return this; },
    range(from, to) { offset = from; limit = Math.min(1000, to - from + 1); return this; },
    async then(resolve, reject) {
      try {
        requests.push({ table, offset, limit, select, orders, idCount });
        if (pausePage?.table === table && pausePage.offset === offset) await pausePage.wait;
        if (failPage?.table === table && failPage.offset === offset) return resolve({ data: null, error: { message: 'Page failed' } });
        const rows = (fixtures[table] || []).filter(row => filters.every(filter => filter(row)));
        rows.sort((a, b) => {
          for (const [key, ascending] of orders) {
            const compared = String(a[key] ?? '').localeCompare(String(b[key] ?? ''));
            if (compared) return ascending ? compared : -compared;
          }
          return 0;
        });
        return resolve({ data: rows.slice(offset, offset + limit), error: null });
      } catch (error) { return reject(error); }
    }
  };
  return builder;
}

const sandbox = vm.createContext({
  getAuthSessionController: () => ({ captureSession: () => {
    const version = authGeneration;
    return { isCurrent: () => version === authGeneration };
  } }),
  console: { error() {}, warn() {} },
  supabaseClient: { from: query },
  SUPABASE_ID_QUERY_CHUNK_SIZE: 200,
  currentUser: { id: 'user-a' },
  allMovies: [], allMovieRatings: [], allMovieWatchlist: [],
  catalogReviewedMovieIds: new Set(), catalogProfileActivityRatingsByMovieId: new Map(),
  CATALOG_PROFILE_ACTIVITY_KEYS: new Set(['ratings', 'watchlist', 'reviews']),
  moviesLoadedSuccessfully: false, container: null,
  MOVIE_CATALOG_SELECT: 'id,title', MOVIE_LETTERBOXD_IMPORT_MATCH_SELECT: 'id,title',
  letterboxdImportMatchMovies: null, letterboxdImportMatchMoviesPromise: null,
  throwIfSupabaseError(error) { if (error) throw error; },
  isMissingOptionalMovieColumnError: () => false,
  getMovieSelectByPurpose: () => 'id,title',
  ensurePreferredPosterImagesForMovies: async () => {},
  rebuildCatalogMovieMeta() {}, markCatalogDataChanged() {}, rebuildCurrentUserWatchlistIndex() {},
  shouldUseAuthenticatedUi: () => Boolean(sandbox.currentUser),
  setKnownMovieRatingRows: rows => { sandbox.allMovieRatings = rows; },
  applyMovieRatingStatsRows: rows => { sandbox.stats = rows; },
  applyMovieRatingStatsFromRows: rows => { sandbox.stats = rows; },
  normalizeManualSimilarMovieIds: ids => [...new Set(ids)],
  getMovieSelectRowsCacheBucket: () => sandbox.movieCache,
  cacheMovieSelectRows: (select, rows) => rows.forEach(row => sandbox.movieCache.set(row.id, row)),
  movieCache: new Map()
});

const names = ['fetchAllSupabaseRows', 'runMovieSelectWithOptionalColumns', 'fetchMovies',
  'fetchMovieRatingStats', 'fetchFullMovieRatingsFallback', 'fetchCurrentUserRatings',
  'fetchMovieWatchlist', 'fetchCatalogReviewSummary', 'getUniqueMovieIdsFromRows',
  'fetchCatalogProfileActivityMovieIds', 'fetchMoviesByIdsWithSelect', 'fetchLetterboxdImportMatchMovies'];
// The adapter preserves Supabase's {data,error} contract for existing consumers.
if (source.includes('function fetchAllSupabaseRowsResult(')) names.push('fetchAllSupabaseRowsResult');
vm.runInContext(names.map(functionSource).join('\n'), sandbox);

fixtures.movie_ratings = makeRows(2501);
assert.equal(await sandbox.fetchFullMovieRatingsFallback(), true);
assert.equal(sandbox.allMovieRatings.length, 2501, 'Fallback ratings must not stop at the server cap');
assert.equal(new Set(sandbox.allMovieRatings.map(row => row.id)).size, 2501);
assert.ok(requests.every(request => request.orders.length > 0), 'Paged queries need deterministic ordering');

for (const count of [0, 1000, 2000, 2501]) {
  fixtures.movie_ratings = makeRows(count);
  const start = requests.length;
  await sandbox.fetchCurrentUserRatings();
  assert.equal(sandbox.allMovieRatings.length, count, `Current-user ratings: ${count}`);
  assert.equal(requests.length - start, Math.floor(count / 1000) + 1);
}

fixtures.movies = makeRows(2501);
assert.equal(await sandbox.fetchMovies(), true);
assert.equal(sandbox.allMovies.length, 2501, 'Full catalog must be complete');
assert.equal((await sandbox.fetchLetterboxdImportMatchMovies()).length, 2501, 'Import match index must be complete');
fixtures.movie_rating_stats = makeRows(2501);
await sandbox.fetchMovieRatingStats();
assert.equal(sandbox.stats.length, 2501, 'Catalog aggregates must be complete');
fixtures.movie_ratings = makeRows(2501);
fixtures.movie_watchlist = makeRows(2501).map((row, i) => ({ ...row, movie_id: `watch-${i}` }));
fixtures.movie_reviews = makeRows(2501);
await sandbox.fetchMovieWatchlist();
assert.equal(sandbox.allMovieWatchlist.length, 2501);
await sandbox.fetchCatalogReviewSummary();
assert.equal(sandbox.catalogReviewedMovieIds.size, 2501);
for (const activity of ['ratings', 'watchlist', 'reviews']) {
  assert.equal((await sandbox.fetchCatalogProfileActivityMovieIds('user-a', activity)).length, 2501, activity);
}

const previous = sandbox.allMovieRatings;
failPage = { table: 'movie_ratings', offset: 1000 };
await sandbox.fetchCurrentUserRatings();
assert.equal(sandbox.allMovieRatings, previous, 'A failed later page must preserve the last complete collection');
failPage = null;
for (const [table, load, stateKey] of [
  ['movie_watchlist', 'fetchMovieWatchlist', 'allMovieWatchlist'],
  ['movie_reviews', 'fetchCatalogReviewSummary', 'catalogReviewedMovieIds']
]) {
  const before = sandbox[stateKey];
  failPage = { table, offset: 1000 };
  await sandbox[load]();
  assert.equal(sandbox[stateKey], before, `${table}: failed second page must retain complete state`);
}
failPage = null;
let release;
pausePage = { table: 'movie_ratings', offset: 1000, wait: new Promise(resolve => { release = resolve; }) };
const delayed = sandbox.fetchCurrentUserRatings();
await new Promise(resolve => setImmediate(resolve));
sandbox.currentUser = { id: 'user-b' };
const nextUserRatings = [];
sandbox.allMovieRatings = nextUserRatings;
release();
await delayed;
assert.equal(sandbox.allMovieRatings, nextUserRatings, 'An old session must not publish its paged data');
pausePage = null;
sandbox.currentUser = { id: 'user-a' };

pausePage = { table: 'movie_watchlist', offset: 1000, wait: new Promise(resolve => { release = resolve; }) };
const delayedWatchlist = sandbox.fetchMovieWatchlist();
await new Promise(resolve => setImmediate(resolve));
sandbox.currentUser = { id: 'user-b' };
const nextUserWatchlist = [];
sandbox.allMovieWatchlist = nextUserWatchlist;
release();
await delayedWatchlist;
assert.equal(sandbox.allMovieWatchlist, nextUserWatchlist);
pausePage = null;
sandbox.currentUser = { id: 'user-a' };

for (const [table, loader, stateKey] of [
  ['movie_ratings', 'fetchCurrentUserRatings', 'allMovieRatings'],
  ['movie_watchlist', 'fetchMovieWatchlist', 'allMovieWatchlist'],
  ['movie_ratings', 'fetchFullMovieRatingsFallback', 'allMovieRatings'],
  ['movie_rating_stats', 'fetchMovieRatingStats', 'stats']
]) {
  const previousRows = fixtures[table];
  fixtures[table] = makeRows(2501);
  pausePage = { table, offset: 1000, wait: new Promise(resolve => { release = resolve; }) };
  const oldCollection = sandbox[loader]();
  await new Promise(resolve => setImmediate(resolve));
  authGeneration += 1; sandbox.currentUser = { id: 'user-b' };
  authGeneration += 1; sandbox.currentUser = { id: 'user-a' };
  const currentRows = [];
  sandbox[stateKey] = currentRows;
  release(); await oldCollection;
  assert.equal(sandbox[stateKey], currentRows, `${loader} must reject A -> logout/change -> A completions`);
  pausePage = null;
  fixtures[table] = previousRows;
}

const movies = await sandbox.fetchMoviesByIdsWithSelect(fixtures.movies.map(row => row.id));
assert.equal(movies.length, 2501, 'Large profile taste lookups must be split into bounded ID queries');

// A partial batch must not become a seemingly complete movie cache.
sandbox.movieCache.clear();
const originalFrom = sandbox.supabaseClient.from;
let movieBatches = 0;
sandbox.supabaseClient.from = table => {
  const builder = originalFrom(table);
  if (table === 'movies' && ++movieBatches === 2) builder.then = async resolve => resolve({ data: null, error: { message: 'Batch failed' } });
  return builder;
};
await assert.rejects(sandbox.fetchMoviesByIdsWithSelect(fixtures.movies.map(row => row.id)));
assert.equal(sandbox.movieCache.size, 0);
sandbox.supabaseClient.from = originalFrom;

// A missing optional movie column retries the complete lookup with a reduced select.
vm.runInContext(functionSource('getMovieSelectWithoutOptionalColumn'), sandbox);
sandbox.isMissingOptionalMovieColumnError = error => error?.code === '42703';
sandbox.getMissingOptionalMovieColumn = () => 'runtime_minutes';
sandbox.markMissingOptionalMovieColumn = () => {};
const selects = [];
let optionalBatches = 0;
sandbox.supabaseClient.from = table => {
  const builder = originalFrom(table);
  const originalSelect = builder.select;
  const originalThen = builder.then.bind(builder);
  let selected;
  builder.select = function(value) { selected = value; selects.push(value); return originalSelect.call(this, value); };
  builder.then = (resolve, reject) => selected.includes('runtime_minutes') && ++optionalBatches === 2
    ? Promise.resolve(resolve({ data: null, error: { code: '42703', message: 'Missing runtime_minutes' } }))
    : originalThen(resolve, reject);
  return builder;
};
assert.equal((await sandbox.fetchMoviesByIdsWithSelect(fixtures.movies.map(row => row.id), 'id,\n runtime_minutes,\n title')).length, 2501);
assert.equal(selects.filter(select => select.includes('runtime_minutes')).length, 2);
assert.equal(selects.filter(select => !select.includes('runtime_minutes')).length, 13);
sandbox.supabaseClient.from = originalFrom;

let profileSource = await readFile(new URL('../user-page.js', import.meta.url), 'utf8');
// Expose the real private loader inside this isolated VM, without changing its production API.
profileSource = profileSource.replace('export function createUserPageController', 'function createUserPageController')
  .replace('    initUserPage,', '    fetchPublicUserPageData,\n    initUserPage,');
vm.runInContext(profileSource, sandbox);
const profileController = sandbox.createUserPageController({
  fetchUserPageActivityRanks: async () => null,
  throwIfSupabaseError: error => { if (error) throw error; },
  fetchMoviesByIdsWithSelect: async () => [],
  ensurePreferredPosterImagesForMovies: async () => {},
  supabaseClient: sandbox.supabaseClient,
  fetchAllSupabaseRowsResult: sandbox.fetchAllSupabaseRowsResult,
  isUserPageActivityRankFallbackEnabled: () => false
});
const profile = await profileController.fetchPublicUserPageData({ id: 'user-a' });
assert.equal(profile.ratingCount, 2501);
assert.equal(profile.watchlistCount, 2501);
assert.equal(profile.reviewCount, 2501);
assert.ok(requests.every(request => request.orders.length > 0));
assert.ok(requests.every(request => request.orders.some(([key]) => key === (request.table === 'movie_rating_stats' ? 'movie_id' : 'id'))));
assert.ok(requests.every(request => request.idCount === undefined || request.idCount <= 200));
console.log('Collection reads smoke passed: complete catalog/profile/import data, 1000-row boundaries, failure and session isolation.');
