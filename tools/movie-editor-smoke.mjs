import assert from 'node:assert/strict';
import { createMovieEditorController } from '../movie-editor.js';

const calls = [];
const elements = { titleInput: { value: 'Atomic fixture' } };
let fail = true;
const controller = createMovieEditorController({
  getElements: () => elements,
  supabaseClient: {
    from() { throw new Error('Movie saves must use one transactional RPC'); },
    async rpc(name, args) {
      calls.push({ name, args });
      if (fail) return { error: { message: 'Lost response' } };
      return { data: { id: args.p_movie_id, slug: 'atomic-fixture', removed_poster_urls: [] } };
    }
  }
});
const options = {
  ensureActiveSessionForWrite: () => ({ id: 'admin-fixture' }),
  buildUniqueMovieSlug: async () => 'atomic-fixture',
  buildClassificationDraft: () => ({ formats: [], tagsPerceived: [] })
};
await assert.rejects(controller.submitMovieCreate(options));
fail = false;
const result = await controller.submitMovieCreate(options);
assert.equal(calls.length, 2);
assert.equal(calls[0].name, 'horroreiro_save_movie');
assert.equal(calls[0].args.p_movie_id, calls[1].args.p_movie_id, 'Ambiguous create retry keeps its ID');
assert.equal(result.insertedMovie.id, calls[0].args.p_movie_id);
assert.deepEqual(calls[0].args.p_relations.genres, []);
assert.deepEqual(calls[0].args.p_relations.posters, []);

controller.resetMovieFormToCreateMode();
await controller.submitMovieCreate(options);
assert.notEqual(calls[2].args.p_movie_id, calls[0].args.p_movie_id, 'New form creates a new movie');

calls.length = 0;
const update = await controller.submitMovieUpdate({
  ...options,
  movieId: 'movie-fixture',
  existingMovie: { id: 'movie-fixture', title: 'Before', genres: [], countries: [] },
  posterImagesChanged: true
});
assert.equal(calls.length, 1);
assert.equal(calls[0].args.p_create, false);
assert.equal(calls[0].args.p_fields.title, 'Atomic fixture');
assert.deepEqual(calls[0].args.p_relations.posters, []);
assert.equal(update.updateSavePlan.hasAnyChanges, true);

// Refresh failures happen after commit; they must not be reported as a failed write.
const statuses = [];
const refresh = await controller.submitMovieCreate({
  ...options,
  setStatus: value => statuses.push(value),
  postSaveOptions: { isCatalogPage: true, reloadCatalogData: async () => { throw new Error('offline'); } }
});
assert.ok(refresh.insertedMovie.id);
assert.ok(refresh.refreshError);
assert.ok(statuses.at(-1).includes('сохранён'));
console.log('Movie editor smoke passed: transactional writes, stable create retry, post-commit refresh failure.');

let rpcCount = 0;
let uploadCount = 0;
let resolveSave;
let timedOut = false;
const timedController = createMovieEditorController({
  getElements: () => elements,
  uploadPosterFile: async () => { uploadCount++; return 'https://fixture.invalid/upload'; },
  withPendingRequestTimeout: (promise, timeoutMs) => {
    if (timeoutMs === 15000 && !timedOut) {
      timedOut = true;
      return Promise.reject(new Error('Simulated timeout with request still running'));
    }
    return promise;
  },
  supabaseClient: {
    rpc(name, args) {
      rpcCount++;
      return new Promise(resolve => { resolveSave = () => resolve({ data: { id: args.p_movie_id } }); });
    }
  }
});
const file = { name: 'fixture.jpg' };
const timedOptions = { ...options, moviePosterImagesDraft: [{ type: 'pending', file }] };
await assert.rejects(timedController.submitMovieCreate(timedOptions), /Simulated timeout/);
resolveSave();
await timedController.submitMovieCreate(timedOptions);
assert.equal(rpcCount, 1, 'Retry must reuse the request still running after timeout');
assert.equal(uploadCount, 1, 'Retry must reuse the successfully uploaded File');
console.log('Movie editor timeout/upload retry smoke passed.');
