import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { createMovieSocialController } from '../movie-social.js';
import { createMovieDetailCacheController } from '../movie-detail-cache.js';

const movie = { id: 'movie', title: 'Fixture' };
const review = { id: 'review', movie_id: movie.id, user_id: 'author', review_text: 'Review fixture', profiles: { display_name: 'Author' } };
const comment = { id: 'comment', movie_id: movie.id, user_id: 'author', comment_text: 'Comment fixture', profiles: { display_name: 'Author' } };
let user = null;
let admin = false;
let authorRating = 7;
const rows = { movie_reviews: [review], movie_comments: [comment] };
const errors = {};
const reads = [];
const controller = createMovieSocialController({
  getCurrentUser: () => user,
  getIsAdmin: () => admin,
  getCurrentUserRating: () => 8,
  getMovieUserRating: () => authorRating,
  supabaseClient: {
    from(table) {
      reads.push(table);
      return {
        select() { return this; }, eq() { return this; }, in() { return this; }, order() { return this; },
        then(resolve) { return Promise.resolve({ data: rows[table] || [], error: errors[table] }).then(resolve); }
      };
    }
  }
});

controller.restoreSnapshot(movie.id, { movieReviews: [review], movieComments: [comment] });
assert.match(controller.getMoviePageReviewsSectionHtml(movie), /Review fixture/);
assert.match(controller.getMoviePageCommentsSectionHtml(movie), /Comment fixture/);
assert.deepEqual(controller.getSnapshot('other'), { movieReviews: [], movieComments: [] });
controller.restoreSnapshot('other', { movieReviews: [{ ...review, id: 'other-review', movie_id: 'other' }] });
controller.restoreSnapshot(movie.id, { movieReviews: [], movieComments: [comment] });
assert.equal(controller.getSnapshot(movie.id).movieReviews.length, 0, 'Restoring replaces that movie, not appends duplicates');
assert.equal(controller.getSnapshot('other').movieReviews.length, 1, 'Restoring one movie retains other movie rows');

await controller.fetchMovieReviews(movie.id);
await controller.fetchMovieComments(movie.id);
assert.equal(controller.getSnapshot(movie.id).movieReviews[0].id, review.id, 'Fetch publishes into module-owned state');
assert.equal(controller.getSnapshot(movie.id).movieComments[0].id, comment.id);
assert.doesNotMatch(controller.getMoviePageReviewsSectionHtml(movie), /data-movie-review-edit=/);
user = { id: 'author' };
assert.match(controller.getMoviePageReviewsSectionHtml(movie), /data-movie-review-edit=/, 'Login is read without a sync call');
user = { id: 'other-user' };
assert.doesNotMatch(controller.getMoviePageReviewsSectionHtml(movie), /data-movie-review-edit=/);
admin = true;
assert.match(controller.getMoviePageReviewsSectionHtml(movie), /data-movie-review-edit=/, 'Role changes are read live');
admin = false;
user = null;
authorRating = 9;
assert.match(controller.getMoviePageReviewsSectionHtml(movie), /9\/10/, 'Author rating comes from its current owner');
controller.clearReviews();
assert.equal(controller.getSnapshot(movie.id).movieReviews.length, 0);
assert.equal(controller.getSnapshot(movie.id).movieComments.length, 1, 'Clearing reviews retains comments');

errors.movie_comments = { code: 'missing' };
const unavailable = createMovieSocialController({
  supabaseClient: { from: table => { reads.push(table); return { select() { return this; }, eq() { return this; }, order: async () => ({ error: errors.movie_comments }) }; } },
  isMovieCommentsTableUnavailableError: error => error?.code === 'missing'
});
await unavailable.fetchMovieComments(movie.id);
const readCount = reads.length;
await unavailable.fetchMovieComments(movie.id);
assert.equal(reads.length, readCount, 'Unavailable comments are remembered by the module');

// Exercise a real bound action: mutation -> owned rows -> catalog notification -> cache persistence.
const events = {};
const section = { dataset: {}, querySelectorAll: () => [], contains: () => true,
  addEventListener: (name, handler) => { events[name] = handler; } };
const moviePage = { querySelectorAll: () => [],
  querySelector: selector => selector === '[data-movie-page-reviews-section="true"]' ? section : null };
const previousElement = globalThis.Element;
const previousAnimationFrame = globalThis.requestAnimationFrame;
const previousWindow = globalThis.window;
class DeleteTarget {
  dataset = { movieReviewDelete: review.id };
  closest(selector) { return selector === '[data-movie-review-delete]' ? this : null; }
}
const changed = [];
let mutation;
let persisted = 0;
const actions = createMovieSocialController({
  moviePage,
  getCurrentUser: () => ({ id: 'author' }),
  ensureActiveSessionForWrite: () => ({ id: 'author' }),
  runConfirmedAction: (_message, action) => { mutation = action(); return mutation; },
  onMovieReviewsChanged: (movieId, hasReviews) => {
    assert.equal(actions.getSnapshot(movieId).movieReviews.length, 0, 'Owned rows are updated before notifying catalog');
    changed.push([movieId, hasReviews]);
  },
  persistCurrentMoviePageSessionCache: () => { persisted += 1; },
  supabaseClient: { from: () => ({
    select() { return this; }, delete() { return this; }, eq() { return this; },
    order: async () => ({ data: [] }), then: resolve => Promise.resolve({ error: null }).then(resolve)
  }) }
});
actions.restoreSnapshot(movie.id, { movieReviews: [review] });
try {
  globalThis.Element = DeleteTarget;
  globalThis.requestAnimationFrame = callback => callback();
  globalThis.window = { setTimeout: () => 0 };
  actions.bindMoviePageReviewEvents(movie);
  events.click({ target: new DeleteTarget() });
  await mutation;
  assert.deepEqual(changed, [[movie.id, false]]);
  assert.ok(persisted > 0, 'Social rerender persists the new state');
  actions.renderMoviePageCommentsSection(movie); // Public render functions must not recurse.
} finally {
  globalThis.Element = previousElement;
  globalThis.requestAnimationFrame = previousAnimationFrame;
  globalThis.window = previousWindow;
}

// Run the real app bridge with a controllable lazy import, before and after it resolves.
const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
function functionSource(name) {
  const start = appSource.lastIndexOf('\n', appSource.indexOf(`function ${name}(`)) + 1;
  const end = appSource.indexOf('\n}', start) + 2;
  assert.ok(start > 0 && end > start, `Missing function ${name}`);
  return appSource.slice(start, end);
}
let resolveModule;
const modulePromise = new Promise(resolve => { resolveModule = resolve; });
const cached = { movie, movieReviews: [review], movieComments: [comment] };
const sandbox = vm.createContext({
  movieSocialController: null, movieSocialControllerPromise: null, pendingMovieSocialSnapshot: cached,
  getMovieSocialControllerContext: () => ({}),
  loadSocialModule: () => modulePromise
});
for (const name of ['getMoviePageSocialSnapshot', 'ensureMovieSocialControllerLoaded']) {
  vm.runInContext(functionSource(name).replace("import(getLazyFeatureModuleUrl('movie-social.js'))", 'loadSocialModule()'), sandbox);
}
assert.equal(sandbox.getMoviePageSocialSnapshot(movie.id).movieReviews[0].id, review.id, 'Cache can be persisted before the lazy module loads');
assert.equal(sandbox.getMoviePageSocialSnapshot('other').movieReviews.length, 0);
sandbox.pendingMovieSocialSnapshot = { movie, movieReviews: {}, movieComments: null };
assert.equal(sandbox.getMoviePageSocialSnapshot(movie.id).movieReviews.length, 0, 'Malformed cached rows are ignored');
sandbox.pendingMovieSocialSnapshot = cached;
const detailCache = createMovieDetailCacheController({
  getMovieStateSnapshot: movie => sandbox.getMoviePageSocialSnapshot(movie.id),
  getStableStringHash: value => createHash('sha256').update(value).digest('hex')
});
const cachedSignature = detailCache.createEntry(movie).signature;
const loading = sandbox.ensureMovieSocialControllerLoaded();
resolveModule({ createMovieSocialController });
const loaded = await loading;
assert.equal(sandbox.pendingMovieSocialSnapshot, null, 'The app releases the pending snapshot after handoff');
assert.equal(loaded.getSnapshot(movie.id).movieReviews[0].id, review.id);
assert.equal(sandbox.getMoviePageSocialSnapshot(movie.id).movieComments[0].id, comment.id);
assert.equal(detailCache.createEntry(movie).signature, cachedSignature, 'Lazy handoff must preserve the actual detail-cache signature');
assert.equal(await sandbox.ensureMovieSocialControllerLoaded(), loaded, 'One controller owns subsequent reads');

console.log('Movie social smoke passed: owned state, scoped cache handoff, live identity/role/ratings and unavailable-table fallback.');
