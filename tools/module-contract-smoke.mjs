import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createCatalogCardController } from '../catalog-cards.js';
import { createCatalogRenderController } from '../catalog-render.js';
import { createMovieUserStateController } from '../movie-user-state.js';
import { createMoviePageOrchestratorController } from '../movie-page-orchestrator.js';
import { createProfileSettingsActions } from '../profile-settings-actions.js';

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

const page = createMoviePageOrchestratorController({ location: { pathname: '/movie/fixture', search: '' } });
await assert.rejects(page.initMoviePage({}), TypeError, 'Missing session/data initialization cannot silently succeed');

let avatarWrites = 0;
const settings = createProfileSettingsActions({
  supabaseClient: { storage: { from: () => { avatarWrites += 1; throw Error('unexpected write'); } } }
});
// Call the real write with no session adapter: it must fail before touching Storage.
await assert.rejects(settings.uploadAvatarBlob({ type: 'image/jpeg' }), TypeError);
assert.equal(avatarWrites, 0);

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
console.log('Module contract smoke passed.');
