import assert from 'node:assert/strict';
import { createAuthSessionController } from '../auth-session-controller.js';

function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
function fixture() {
  let user = null;
  let callback;
  let subscriptions = 0;
  let pendingRecovery = false;
  let recoveryEntry = false;
  let sessionResult = { data: { session: null }, error: null };
  let profileWait = null;
  const tasks = [];
  const identities = [];
  const profiles = [];
  const collections = [];
  const recoveries = [];
  const controller = createAuthSessionController({
    supabaseClient: { auth: {
      getSession: () => sessionResult,
      onAuthStateChange: handler => { subscriptions += 1; callback = handler; }
    } },
    withAuthRequestTimeout: promise => promise,
    getCurrentUser: () => user,
    setCurrentSessionUser: value => { user = value; identities.push(value?.id || null); },
    loadCurrentSessionData: async isCurrent => {
      const id = user?.id || null;
      if (profileWait) await profileWait;
      if (isCurrent()) profiles.push(id);
    },
    reloadUserCollections: async () => { collections.push(user?.id || null); },
    hasPendingRecovery: () => pendingRecovery,
    isRecoveryEntryPage: () => recoveryEntry,
    clearLocalRecoverySession: async () => { recoveries.push('clear'); },
    onPasswordRecovery: () => { pendingRecovery = true; recoveries.push('form'); },
    trackEmailConfirmedLoginIfNeeded() {},
    scheduleTask: task => { tasks.push(task); }
  });
  return { controller, tasks, identities, profiles, collections, recoveries,
    get user() { return user; }, get subscriptions() { return subscriptions; },
    emit: (event, id) => callback(event, id ? { user: { id } } : null),
    setSession: result => { sessionResult = result; },
    pauseProfiles: promise => { profileWait = promise; },
    setRecovery: (pending, entry) => { pendingRecovery = pending; recoveryEntry = entry; },
    async flush() { for (let i = 0; tasks.length; i += 1) { assert(i < 20, 'Auth refresh must not loop'); await tasks.shift()(); } }
  };
}

const queued = fixture();
let pageRefreshes = 0;
queued.controller.bindSharedAuthStateListener({ onAfterAuthSync: () => { pageRefreshes += 1; } });
queued.controller.bindSharedAuthStateListener({ onAfterAuthSync: () => { pageRefreshes += 1; } });
assert.equal(queued.subscriptions, 1);
queued.emit('SIGNED_IN', 'old');
const oldScope = queued.controller.captureSession();
queued.emit('SIGNED_OUT');
queued.emit('SIGNED_IN', 'new');
assert.equal(queued.user.id, 'new', 'Accepted identity changes must not wait behind API requests');
assert.equal(oldScope.isCurrent(), false);
await queued.flush();
assert.equal(queued.user.id, 'new', 'Old queued callbacks must not restore departed identities');
assert.deepEqual(queued.profiles, ['new']);
assert.deepEqual(queued.collections, ['new']);
assert.equal(pageRefreshes, 1);
queued.emit('TOKEN_REFRESHED', 'new'); queued.emit('SIGNED_IN', 'new');
assert.equal(queued.tasks.length, 0, 'Refocus/token refresh must not reload unchanged collections');

const restoring = fixture();
const initialRead = deferred(); restoring.setSession(initialRead.promise);
const restored = restoring.controller.restoreSession();
restoring.emit('SIGNED_IN', 'latest'); await restoring.flush();
initialRead.resolve({ data: { session: { user: { id: 'stale' } } }, error: null });
assert.equal((await restored).id, 'latest', 'An old initial session read cannot undo a live sign-in');
const staleError = fixture(); const failedRead = deferred(); staleError.setSession(failedRead.promise);
const oldFailure = staleError.controller.restoreSession();
staleError.emit('SIGNED_IN', 'active'); await staleError.flush();
failedRead.resolve({ data: null, error: Error('Old read failed') });
assert.equal((await oldFailure).id, 'active', 'An old getSession error cannot sign out a newer viewer');
const concurrent = fixture();
const firstRead = deferred(), secondRead = deferred();
concurrent.setSession(firstRead.promise); const firstRestore = concurrent.controller.restoreSession();
concurrent.setSession(secondRead.promise); const secondRestore = concurrent.controller.restoreSession();
let firstSettled = false; firstRestore.then(() => { firstSettled = true; });
firstRead.resolve({ data: { session: { user: { id: 'stale' } } }, error: null });
await new Promise(setImmediate);
assert.equal(firstSettled, false, 'A superseded restore waits for the latest restore, not an old ready promise');
secondRead.resolve({ data: { session: { user: { id: 'latest' } } }, error: null });
assert.equal((await firstRestore).id, 'latest');
assert.equal((await secondRestore).id, 'latest');

const sameActor = fixture();
sameActor.controller.bindSharedAuthStateListener();
sameActor.emit('SIGNED_IN', 'same');
const oldSameActorScope = sameActor.controller.captureSession();
sameActor.emit('SIGNED_OUT'); sameActor.emit('SIGNED_IN', 'same');
assert.equal(oldSameActorScope.isCurrent(), false, 'ID equality cannot revive an old session generation');
await sameActor.flush();

const recovery = fixture();
recovery.controller.bindSharedAuthStateListener();
recovery.emit('SIGNED_IN', 'normal');
recovery.setRecovery(true, false); recovery.emit('PASSWORD_RECOVERY', 'recovering');
assert.equal(recovery.user, null, 'Foreign recovery must quarantine an accepted normal identity immediately');
await recovery.flush();
assert.equal(recovery.recoveries.filter(value => value === 'form').length, 0);
assert.equal(recovery.recoveries.filter(value => value === 'clear').length, 1);
assert(!recovery.collections.includes('normal'));
recovery.setRecovery(true, true); recovery.emit('PASSWORD_RECOVERY', 'recovering');
assert(recovery.recoveries.includes('form'));
const replacedCleanup = fixture(); replacedCleanup.controller.bindSharedAuthStateListener();
replacedCleanup.setRecovery(true, false); replacedCleanup.emit('PASSWORD_RECOVERY', 'foreign');
replacedCleanup.setRecovery(false, false); replacedCleanup.emit('SIGNED_IN', 'new');
await replacedCleanup.flush();
assert.equal(replacedCleanup.user.id, 'new');
assert.equal(replacedCleanup.recoveries.length, 0, 'A queued old recovery cleanup must not erase a replacement session');
const recoveryRead = fixture(); const recoveryResponse = deferred(); recoveryRead.setSession(recoveryResponse.promise);
const recoveryRestore = recoveryRead.controller.restoreSession();
recoveryRead.setRecovery(true, true); recoveryRead.emit('PASSWORD_RECOVERY', 'recovering');
recoveryResponse.resolve({ data: { session: { user: { id: 'recovering' } } }, error: null });
assert.equal(await recoveryRestore, null, 'Recovery supersedes an old normal restore without waiting on itself');

const latePage = fixture();
latePage.controller.bindSharedAuthStateListener(); latePage.emit('SIGNED_IN', 'viewer'); await latePage.flush();
let lateRefreshes = 0;
latePage.controller.bindSharedAuthStateListener({ onAfterAuthSync: async () => {
  lateRefreshes += 1;
  latePage.setSession({ data: { session: { user: { id: 'viewer' } } }, error: null });
  assert.equal((await latePage.controller.restoreSession()).id, 'viewer');
} });
await latePage.flush();
assert.equal(lateRefreshes, 1, 'A late page handler must receive missed auth work without recursive waiting');

const superseded = fixture(); superseded.controller.bindSharedAuthStateListener();
const delayedProfile = deferred(); superseded.pauseProfiles(delayedProfile.promise);
superseded.emit('SIGNED_IN', 'old');
const running = superseded.tasks.shift()();
superseded.emit('SIGNED_IN', 'new'); delayedProfile.resolve();
await running; await superseded.flush();
assert.deepEqual(superseded.profiles, ['new']);
assert.deepEqual(superseded.collections, ['new']);
console.log('Auth session smoke passed.');
