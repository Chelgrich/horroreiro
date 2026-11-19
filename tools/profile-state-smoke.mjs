import assert from 'node:assert/strict';
import { createProfileDataActions } from '../profile-data-actions.js';
import { createProfileFollowActions } from '../profile-follow-actions.js';
import { createFollowingPageController } from '../following-page.js';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

const queries = [];
let result = { data: [], error: null };
const client = { from(table) {
  const query = { table };
  queries.push(query);
  const chain = {
    select: columns => { query.columns = columns; return chain; },
    eq: (key, value) => { query[key] = value; return chain; },
    in: (key, value) => { query[key] = value; return chain; },
    order: () => chain,
    single: () => chain,
    maybeSingle: () => chain,
    insert: row => { query.insert = row; return chain; },
    delete: () => { query.delete = true; return chain; },
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject)
  };
  return chain;
} };
const throwIfSupabaseError = error => { if (error) throw error; };
const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const idBatchSize = appSource.match(/const SUPABASE_ID_QUERY_CHUNK_SIZE = \d+;/)[0];
const idBatches = appSource.match(/async function fetchSupabaseIdBatches\([\s\S]+?\n}/)[0];
const fetchSupabaseIdBatches = vm.runInThisContext(`(() => { ${idBatchSize} ${idBatches} return fetchSupabaseIdBatches; })()`);
const data = createProfileDataActions({ supabaseClient: client, throwIfSupabaseError,
  fetchSupabaseIdBatches, withAuthProfileRequestTimeout: promise => promise });
result = { data: [{ id: 'one', display_name: 'First', default_display_name: 'first' }], error: null };
assert.equal((await data.fetchPublicProfilesByIds(['one', 'one']))[0].display_name, 'First');
result = { data: null, error: Error('Must use the shared cache') };
assert.equal((await data.fetchPublicProfileByHandle('first')).id, 'one');
data.cachePublicProfileRows([{ id: 'one', display_name: 'Updated' }]);
assert.equal((await data.fetchPublicProfilesByIds(['one']))[0].display_name, 'Updated');
assert.equal(queries.length, 1, 'Handle/id reads and settings patches share a module-owned cache');
assert.equal(await data.fetchPublicProfileByHandle('../bad'), null);
await assert.rejects(data.fetchPublicProfilesByIds(['two']), /shared cache/);
result = { data: [{ id: 'two', display_name: 'Second' }], error: null };
assert.deepEqual((await data.fetchPublicProfilesByIds(['two', 'one'])).map(row => row.id), ['two', 'one']);
const publicRead = deferred();
result = publicRead.promise;
const pendingPublicProfile = data.fetchPublicProfilesByIds(['race']);
await Promise.resolve();
data.cachePublicProfileRows([{ id: 'race', display_name: 'Just saved' }]);
publicRead.resolve({ data: [{ id: 'race', display_name: 'Old', default_display_name: 'second', avatar_url: 'https://example.test/avatar.jpg' }], error: null });
const updated = (await pendingPublicProfile)[0];
assert.equal(updated.display_name, 'Just saved', 'An older read must retain a confirmed identity patch');
assert.equal(updated.default_display_name, 'second', 'Reads still fill missing fields');
assert.equal((await data.fetchPublicProfileByHandle('second')).display_name, 'Just saved');
result = { data: null, error: Error('offline') };
await assert.rejects(data.fetchPublicProfileByHandle('missing'), /offline/);
result = { data: { id: 'three', default_display_name: 'missing' }, error: null };
assert.equal((await data.fetchPublicProfileByHandle('missing')).id, 'three', 'Failed reads must allow retry');

let viewer = { id: 'alice' };
const follows = createProfileFollowActions({ supabaseClient: client, throwIfSupabaseError,
  fetchSupabaseIdBatches, getCurrentUser: () => viewer, isNotificationsUnavailableError: () => false });
const uncachedIds = Array.from({ length: 205 }, (_, index) => `uncached-${index}`);
result = { data: [], error: null };
await data.fetchPublicProfilesByIds(uncachedIds);
assert.deepEqual(queries.slice(-3).map(query => query.id.length), [100, 100, 5]);
await follows.fetchFollowNotificationPreferences({ followerId: 'alice', profileIds: uncachedIds });
assert.deepEqual(queries.slice(-3).map(query => query.following_id.length), [100, 100, 5]);
const pending = deferred();
result = pending.promise;
const oldRead = follows.fetchProfileFollowRows({ followerId: 'alice' });
await Promise.resolve();
viewer = { id: 'bob' };
assert.equal(follows.isCurrentUserFollowingProfile('old'), false);
pending.resolve({ data: [{ following_id: 'old' }], error: null });
await oldRead;
assert.equal(follows.isCurrentUserFollowingProfile('old'), false, 'Old viewer reads cannot replace current membership');
result = { data: [{ following_id: 'friend' }], error: null };
await follows.fetchProfileFollowRows({ followerId: 'bob', includeCreatedAt: true });
assert(follows.isCurrentUserFollowingProfile('friend'));
const late = deferred();
result = late.promise;
const staleRead = follows.fetchProfileFollowRows({ followerId: 'bob' });
await Promise.resolve();
result = { data: null, error: null };
assert.equal(await follows.setProfileFollowing({ followerId: 'bob', followingId: 'friend', isFollowing: false }), true);
late.resolve({ data: [{ following_id: 'friend' }], error: null });
await staleRead;
assert.equal(follows.isCurrentUserFollowingProfile('friend'), false, 'A pending read cannot undo a confirmed unfollow');
const beforeStaleWrite = queries.length;
assert.equal(await follows.setProfileFollowing({ followerId: 'alice', followingId: 'other', isFollowing: true }), false);
assert.equal(queries.length, beforeStaleWrite, 'A stale actor must not start a write');
const writing = deferred();
result = writing.promise;
const oldWrite = follows.setProfileFollowing({ followerId: 'bob', followingId: 'other', isFollowing: true });
await Promise.resolve();
viewer = { id: 'carol' };
writing.resolve({ data: null, error: null });
assert.equal(await oldWrite, false);
assert.equal(follows.isCurrentUserFollowingProfile('other'), false);
result = { data: null, error: Error('offline') };
await assert.rejects(follows.setProfileFollowing({ followerId: 'carol', followingId: 'other', isFollowing: true }), /offline/);
assert.equal(follows.isCurrentUserFollowingProfile('other'), false);
result = { data: null, error: null };
assert.equal(await follows.setProfileFollowing({ followerId: 'carol', followingId: 'other', isFollowing: true }), true);
assert(follows.isCurrentUserFollowingProfile('other'));
viewer = null;
follows.resetCurrentUserFollows();
viewer = { id: 'carol' };
assert.equal(follows.isCurrentUserFollowingProfile('other'), false, 'Logout clears even a return to the same viewer');
// The page must not render a departed viewer's private follow/preferences result.
const previousDocument = globalThis.document;
globalThis.document = { title: '' };
try {
  const events = {};
  const page = { innerHTML: '', addEventListener: (type, handler) => { events[type] = handler; } };
  const pageRead = deferred();
  let rows = pageRead.promise;
  let authHandler;
  const messages = [];
  const pageWrites = [];
  let actionsWait = null;
  const pageActions = {
    fetchProfileFollowRows: () => rows,
    fetchFollowNotificationPreferences: async () => ({ preferencesByProfileId: new Map(), arePreferencesAvailable: true }),
    setProfileFollowing: options => { pageWrites.push(options); return true; },
    updateFollowNotificationPreference: options => { pageWrites.push(options); return { ok: true }; }
  };
  viewer = { id: 'alice' };
  const controller = createFollowingPageController({ followingPage: page, getCurrentUser: () => viewer,
    shouldUseAuthenticatedUi: () => Boolean(viewer), hasWarmStartedPageDom: () => false,
    restoreSession: async () => {}, trackEmailConfirmedLoginIfNeeded() {},
    bindSharedAuthStateListener: handlers => { authHandler = handlers.onAfterAuthSync; },
    loadProfileFollowActions: () => actionsWait || pageActions,
    fetchPublicProfilesByIds: async ids => ids.map(id => ({ id, display_name: id })),
    escapeHtml: String, buildUserPageUrl: String, getUserPageAvatarLetter: () => 'A',
    getPublicProfileDisplayName: profile => profile.display_name, getPublicProfileAvatarUrl: () => '',
    getPublicProfileHandle: profile => profile.id, showAppMessage: message => { messages.push(message); },
    setNotificationsUnavailable() {}, openAuthModal() {}
  });
  const initializing = controller.initFollowingPage();
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
  assert.equal(typeof authHandler, 'function', 'Auth changes must be observed during the first read');
  viewer = null;
  await authHandler();
  const gate = page.innerHTML;
  pageRead.resolve([{ following_id: 'alice-private-follow' }]);
  await initializing;
  assert.equal(page.innerHTML, gate, 'An old read must not replace the anonymous gate');
  viewer = { id: 'bob' };
  rows = [];
  await controller.loadFollowingPage();
  const waiting = deferred();
  actionsWait = waiting.promise;
  events.click({ preventDefault() {}, target: { closest: selector => selector.includes('unfollow')
    ? { dataset: { followingPageUnfollowProfileId: 'friend' } } : null } });
  viewer = { id: 'carol' };
  waiting.resolve(pageActions);
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
  assert.equal(pageWrites.length, 0, 'A lazy action must not switch its captured actor');
  assert.equal(messages.length, 0, 'A departed viewer must not publish success feedback');
  actionsWait = null;
  rows = [{ following_id: 'friend' }];
  await authHandler();
  assert(page.innerHTML.includes('data-following-page-unfollow-profile-id="friend"'));
  events.click({ preventDefault() {}, target: { closest: selector => selector.includes('unfollow')
    ? { dataset: { followingPageUnfollowProfileId: 'friend' } } : null } });
  await new Promise(setImmediate);
  assert.deepEqual(pageWrites.pop(), { followerId: 'carol', followingId: 'friend', isFollowing: false });
  assert.equal(messages.length, 1, 'Successful current-viewer unfollows retain feedback');
  const preferenceWait = deferred();
  pageActions.updateFollowNotificationPreference = options => { pageWrites.push(options); return preferenceWait.promise; };
  events.change({ target: { closest: () => ({ dataset: { followingId: 'friend', followNotificationKey: 'notify_reviews' }, checked: false }) } });
  await Promise.resolve();
  viewer = null;
  await authHandler();
  const loggedOutPage = page.innerHTML;
  preferenceWait.resolve({ ok: false, error: Error('Old request failed') });
  await new Promise(setImmediate);
  assert.equal(page.innerHTML, loggedOutPage);
  assert.equal(messages.length, 1, 'A departed viewer preference error must stay silent');
} finally {
  globalThis.document = previousDocument;
}
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const roleStart = app.indexOf('async function loadCurrentUserRole(');
const roleRead = deferred();
const cachedRoles = [];
const roleContext = vm.createContext({ currentUser: { id: 'alice' }, currentUserRole: 'user', currentUserProfile: { display_name: 'Bob' },
  getAuthSessionController: () => ({ captureSession: () => ({ isCurrent: () => true }) }),
  loadProfileDataActions: async () => ({ fetchCurrentUserProfile: () => roleRead.promise,
    cachePublicProfileRows: profiles => cachedRoles.push(...profiles) }), updateAdminStatus() {}, console });
vm.runInContext(app.slice(roleStart, app.indexOf('\n}', roleStart) + 2), roleContext);
const loadingRole = roleContext.loadCurrentUserRole();
await Promise.resolve();
roleContext.currentUser = { id: 'bob' };
roleRead.resolve({ role: 'admin', display_name: 'Alice' });
await loadingRole;
assert.equal(roleContext.currentUserRole, 'user');
assert.equal(roleContext.currentUserProfile.display_name, 'Bob');
assert.equal(cachedRoles.length, 0, 'The role bridge must not cache an old profile under a replacement viewer ID');
console.log('Profile state smoke passed.');
