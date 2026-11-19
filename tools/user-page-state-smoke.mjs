import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createUserPageController } from '../user-page.js';
import { createProfileFollowActions } from '../profile-follow-actions.js';

const previous = { window: globalThis.window, document: globalThis.document, sessionStorage: globalThis.sessionStorage, CSS: globalThis.CSS };
let viewer = { id: 'viewer' };
let profile = { id: 'other', display_name: 'Other', default_display_name: 'other' };
const events = {};
const title = { textContent: '' };
const name = { textContent: 'Other' };
const avatar = { innerHTML: 'other-avatar', classList: { toggle() {} } };
const page = {
  innerHTML: '',
  addEventListener: (type, callback) => { events[type] = callback; },
  querySelector: selector => selector.includes('display-name') ? name : selector.includes('avatar-shell') ? avatar : null
};
const storage = new Map();
let afterAuthSync;
let pendingWrite;
let writeError;
const writes = [];
const messages = [];
const follows = new Set();
const metadata = [];
const documentEvents = {};
const windowEvents = {};
const tooltip = { hidden: true, style: {}, textContent: '',
  setAttribute() {}, getBoundingClientRect: () => ({ width: 200, height: 40 }),
  classList: { add() {}, remove() {}, contains: () => !tooltip.hidden }
};
const context = {
  userPage: page, getCurrentUser: () => viewer,
  hasWarmStartedPageDom: () => false, shouldUseAuthenticatedUi: () => Boolean(viewer),
  shouldPreferRussianPosters: () => false, restoreSession: async () => {},
  trackEmailConfirmedLoginIfNeeded() {}, bindSharedAuthStateListener: options => { afterAuthSync = options.onAfterAuthSync; },
  escapeHtml: value => String(value ?? ''),
  buildCatalogProfileActivityUrl: handle => `/?profile=${handle}`,
  getPublicProfileDisplayName: row => row.display_name,
  getPublicProfileHandle: row => row.default_display_name,
  fetchPublicUserProfileByHandle: async () => profile,
  fetchUserPageActivityRanks: async () => null, isUserPageActivityRankFallbackEnabled: () => false,
  fetchAllSupabaseRowsResult: async () => ({ data: [] }), supabaseClient: {},
  fetchMoviesByIdsWithSelect: async () => [], ensurePreferredPosterImagesForMovies: async () => {},
  throwIfSupabaseError: error => { if (error) throw error; },
  getUserPageAvatarHtml: () => '', getUserPageAvatarMediaHtml: row => `avatar:${row.id}`,
  getUserPageAdminPasswordPanelHtml: () => '', setUserPageDocumentMeta: row => metadata.push(row),
  getUserPageMovieRailHtml: () => '', bindUserPageRailControls() {},
  getDataMutationStamp: () => 'stamp', getPageDependencySnapshot: () => ({}), isPageDependencySnapshotFresh: () => true,
  isCurrentUserFollowingProfile: id => follows.has(id),
  setProfileFollowing: async options => { writes.push(options); await pendingWrite; if (writeError) throw writeError; return true; },
  openAuthModal() {}, showAuthMessage() {}, showAppMessage: (...args) => messages.push(args)
};
function followEvent() {
  return { preventDefault() {}, target: { closest: selector => selector.includes('follow-profile-id') ? { dataset: { userPageFollowProfileId: 'other' } } : null } };
}
try {
  globalThis.CSS = { escape: value => value };
  globalThis.window = { location: { pathname: '/user/other', search: '' }, innerWidth: 1024, innerHeight: 768,
    addEventListener: (type, callback) => { windowEvents[type] = callback; } };
  globalThis.document = { title: '', querySelector: () => title, createElement: () => tooltip, body: { appendChild() {} },
    addEventListener: (type, callback) => { documentEvents[type] = callback; } };
  globalThis.sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  const controller = createUserPageController(context);
  await controller.initUserPage();
  assert.equal(typeof events.click, 'function', 'The profile owner must bind its own actions');
  const rankAttributes = new Map();
  const rankTarget = {
    dataset: { userPageRankTitle: 'Fixture rank' },
    closest: selector => selector.includes('rank-title') ? rankTarget : null,
    getBoundingClientRect: () => ({ left: 100, top: 50, bottom: 80, width: 50 }),
    setAttribute: (key, value) => rankAttributes.set(key, value), removeAttribute: key => rankAttributes.delete(key)
  };
  documentEvents.keydown({ key: 'Enter', target: rankTarget, preventDefault() {} });
  assert.equal(tooltip.hidden, false);
  assert.equal(rankAttributes.get('aria-expanded'), 'true');
  assert.equal(tooltip.textContent, 'Fixture rank');
  windowEvents.scroll();
  assert.equal(tooltip.hidden, true);
  assert.equal(rankAttributes.get('aria-expanded'), 'false');
  documentEvents.click({ target: rankTarget, preventDefault() {} });
  documentEvents.keydown({ key: 'Escape', target: { closest: () => null } });
  assert.equal(tooltip.hidden, true);
  controller.syncOwnProfileIdentity({ id: 'viewer', display_name: 'Viewer changed' });
  assert.equal(name.textContent, 'Other', 'Saving own settings must not rename another profile');
  assert.equal(avatar.innerHTML, 'other-avatar', 'Saving own settings must not replace another profile avatar');

  let resolveWrite;
  pendingWrite = new Promise(resolve => { resolveWrite = resolve; });
  const first = events.click(followEvent());
  await events.click(followEvent());
  assert.equal(writes.length, 1, 'The page owns duplicate-request suppression');
  viewer = { id: 'second' };
  resolveWrite();
  await first;
  assert.equal(messages.length, 0, 'The old viewer must not publish success into the new session');
  assert.equal(writes[0].followerId, 'viewer');
  await events.click(followEvent());
  assert.equal(writes.length, 2, 'A new viewer is not blocked by the old viewer request');
  assert.equal(writes[1].followerId, 'second');
  writeError = new Error('Fixture offline');
  await events.click(followEvent());
  assert.equal(messages.at(-1)[1], 'error');
  writeError = null;
  await events.click(followEvent());
  assert.equal(writes.length, 4, 'A failed write must release the page request guard');

  profile = { id: 'second', display_name: 'Second', default_display_name: 'second' };
  await controller.reloadUserPage();
  controller.syncOwnProfileIdentity({ ...profile, display_name: 'Renamed' });
  assert.equal(name.textContent, 'Renamed');
  assert.equal(avatar.innerHTML, 'avatar:second');
  assert.equal(metadata.at(-1).display_name, 'Renamed');

  // A response from the previous viewer must not overwrite the current page/cache.
  let resolveProfile;
  context.fetchPublicUserProfileByHandle = () => new Promise(resolve => { resolveProfile = resolve; });
  const stale = createUserPageController(context);
  const loading = stale.reloadUserPage();
  await Promise.resolve();
  const htmlBefore = page.innerHTML;
  const cacheBefore = JSON.stringify([...storage]);
  viewer = { id: 'third' };
  resolveProfile({ id: 'obsolete', display_name: 'Obsolete', default_display_name: 'obsolete' });
  await loading;
  assert.equal(page.innerHTML, htmlBefore);
  assert.equal(JSON.stringify([...storage]), cacheBefore);
  const resolvers = [];
  const latest = createUserPageController({ ...context,
    fetchPublicUserProfileByHandle: () => new Promise(resolve => resolvers.push(resolve))
  });
  const olderLoad = latest.reloadUserPage();
  const newerLoad = latest.reloadUserPage();
  resolvers[1]({ id: 'latest', display_name: 'Latest', default_display_name: 'latest' });
  await newerLoad;
  const latestHtml = page.innerHTML;
  const latestCache = JSON.stringify([...storage]);
  resolvers[0]({ id: 'obsolete', display_name: 'Obsolete', default_display_name: 'obsolete' });
  await olderLoad;
  assert.equal(page.innerHTML, latestHtml, 'An older load cannot overwrite a newer result for the same viewer');
  assert.equal(JSON.stringify([...storage]), latestCache);

  let finishRows;
  let rowReads = 0;
  const beforeActivityHtml = page.innerHTML;
  const beforeActivityCache = JSON.stringify([...storage]);
  const rowPromise = new Promise(resolve => { finishRows = resolve; });
  const staleData = createUserPageController({ ...context,
    fetchPublicUserProfileByHandle: async () => profile,
    fetchAllSupabaseRowsResult: async () => { rowReads += 1; await rowPromise; return { data: [] }; }
  });
  const readingData = staleData.reloadUserPage();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(rowReads, 3);
  viewer = { id: 'fourth' };
  finishRows();
  await readingData;
  assert.equal(page.innerHTML, beforeActivityHtml, 'Viewer changes during activity reads must not render stale data');
  assert.equal(JSON.stringify([...storage]), beforeActivityCache);
  assert.equal(typeof afterAuthSync, 'function');
  viewer = { id: 'initial-viewer' };
  let earlyAuthSync;
  let finishInitialProfile;
  const initial = createUserPageController({ ...context,
    bindSharedAuthStateListener: options => { earlyAuthSync = options.onAfterAuthSync; },
    fetchPublicUserProfileByHandle: () => new Promise(resolve => { finishInitialProfile = resolve; })
  });
  const initialLoad = initial.initUserPage();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(typeof earlyAuthSync, 'function', 'Auth changes must be observed before the first pending profile read');
  finishInitialProfile(profile);
  await initialLoad;
} finally {
  Object.assign(globalThis, previous);
}

// Exercise the actual shared write bridge on both sides of its async boundary.
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const start = app.indexOf('async function setProfileFollowing(');
const end = app.indexOf('\n}', start) + 2;
let resolveActions;
let resolveMutation;
const bridgeWrites = [];
const bridge = vm.createContext({ currentUser: { id: 'first' },
  loadProfileFollowActions: () => new Promise(resolve => { resolveActions = resolve; })
});
vm.runInContext(app.slice(start, end), bridge);
let delayMutation = true;
const actions = createProfileFollowActions({ getCurrentUser: () => bridge.currentUser,
  throwIfSupabaseError: error => { if (error) throw error; },
  supabaseClient: { from() {
    const query = { delete: () => query, eq: () => query,
      insert: options => { bridgeWrites.push(options); return query; },
      then: (resolve, reject) => (delayMutation
        ? new Promise(done => { resolveMutation = () => done({ error: null }); })
        : Promise.resolve({ error: null })).then(resolve, reject) };
    return query;
  } }
});
const beforeWrite = bridge.setProfileFollowing({ followerId: 'first', followingId: 'other', isFollowing: true });
bridge.currentUser = { id: 'second' };
resolveActions(actions);
assert.equal(await beforeWrite, false);
assert.equal(bridgeWrites.length, 0, 'A replaced viewer must not start the old viewer write');
bridge.loadProfileFollowActions = () => actions;
bridge.currentUser = { id: 'first' };
const afterWrite = bridge.setProfileFollowing({ followerId: 'first', followingId: 'other', isFollowing: true });
await Promise.resolve();
await Promise.resolve();
bridge.currentUser = { id: 'second' };
resolveMutation();
assert.equal(await afterWrite, false);
assert.equal(actions.isCurrentUserFollowingProfile('other'), false, 'A completed old write must not modify new viewer membership');
delayMutation = false;
assert.equal(await bridge.setProfileFollowing({ followerId: 'second', followingId: 'other', isFollowing: true }), true);
assert(actions.isCurrentUserFollowingProfile('other'));
assert.equal(await bridge.setProfileFollowing({ followerId: 'second', followingId: 'other', isFollowing: false }), true);
assert.equal(actions.isCurrentUserFollowingProfile('other'), false);
console.log('User page state smoke passed.');
