import assert from 'node:assert/strict';
import { createAuthUiController } from '../auth-ui-controller.js';

function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
function fixture(url = 'https://fixture.test/?keep=yes') {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) {
      const classes = new Set();
      elements.set(id, { value: '', disabled: false, textContent: '', events: {},
        classList: { add: (...names) => names.forEach(name => classes.add(name)),
          remove: (...names) => names.forEach(name => classes.delete(name)), contains: name => classes.has(name),
          toggle(name, force) { if (force ?? !classes.has(name)) classes.add(name); else classes.delete(name); } },
        focus() {}, select() {}, querySelector: () => get('submit'),
        reset() { for (const element of elements.values()) element.value = ''; },
        addEventListener(type, handler) { assert(!this.events[type], 'Bind each event once'); this.events[type] = handler; }
      });
    }
    return elements.get(id);
  };
  const storage = new Map(); const timers = []; const calls = []; const goals = [];
  let user = null; let epoch = 0; let available = true;
  const results = {};
  const auth = Object.fromEntries(['signInWithPassword', 'signUp', 'resetPasswordForEmail', 'getSession',
    'refreshSession', 'updateUser', 'signOut', 'exchangeCodeForSession', 'setSession', 'verifyOtp'].map(name =>
    [name, (...args) => { calls.push([name, ...args]); const result = results[name];
      return typeof result === 'function' ? result(...args) : result ?? { data: {}, error: null }; }]));
  globalThis.document = { getElementById: get, title: 'Fixture' };
  globalThis.window = { location: new URL(url), history: { replaceState: (_state, _title, next) => { window.location = new URL(next); } } };
  globalThis.localStorage = { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  globalThis.requestAnimationFrame = callback => callback();
  globalThis.setTimeout = (callback, delay) => { timers.push({ callback, delay }); return timers.length; };
  const controller = createAuthUiController({ supabaseClient: { auth }, withAuthRequestTimeout: value => value,
    getCurrentUser: () => user, captureSession: () => { const version = epoch; return { isCurrent: () => epoch === version }; },
    isValidDisplayNameValue: name => /^[a-zA-Z0-9_]{3,24}$/.test(name), isDisplayNameAvailable: () => available,
    getReadableAuthErrorMessage: (error, fallback) => error?.message || fallback,
    showToastMessage: (_toast, message, _timer, text, type) => { message.textContent = text; message.type = type; return null; },
    clearToastMessage: (_toast, message) => { message.textContent = ''; },
    showAppMessage: text => { get('appMessage').textContent = text; }, trackGoal: name => goals.push(name),
    syncBodyScrollLock() {}, closeAuthPopoverMenu() {}, closeProfileSettings() {}, onModeChanged() {}
  });
  return { controller, get, storage, timers, calls, goals, results,
    available: value => { available = value; }, replaceSession: value => { user = value; epoch += 1; },
    submit: () => get('loginForm').events.submit({ preventDefault() {} }),
    click: id => get(id).events.click(),
    fill() { get('loginEmail').value = 'fixture@example.test'; get('loginPassword').value = 'fixture-password'; },
    async flush(delay) { for (const timer of timers.splice(0)) if (timer.delay === delay) await timer.callback(); }
  };
}

const globals = Object.fromEntries(['document', 'window', 'localStorage', 'requestAnimationFrame', 'setTimeout'].map(key => [key, globalThis[key]]));
const originalError = console.error;
console.error = () => {};
try {
  let f = fixture(); f.controller.open();
  assert(f.controller.isOpen());
  await f.submit(); assert.equal(f.calls.length, 0, 'Empty login must not reach SDK');
  f.fill(); f.results.signInWithPassword = { error: { message: 'offline' } };
  await f.submit(); assert.equal(f.get('authMessage').textContent, 'offline'); assert(!f.get('submit').disabled);
  f.results.signInWithPassword = {}; await f.submit();
  await f.controller.close(); f.controller.open(); await f.flush(300);
  assert(f.controller.isOpen(), 'Old login timer cannot close a reopened form');
  assert.equal(f.get('loginPassword').value, '', 'Close clears sensitive inputs');

  f = fixture(); f.controller.open(); f.click('registerButton'); f.fill();
  f.get('registerNickname').value = '!'; await f.submit(); assert.equal(f.calls.length, 0);
  f.get('registerNickname').value = 'Alice'; f.available(false); await f.submit(); assert.equal(f.calls.length, 0);
  const availability = deferred(); f.available(availability.promise); const registering = f.submit();
  await f.controller.close(); f.controller.open(); availability.resolve(true); await registering;
  assert.equal(f.calls.length, 0, 'Closed registration cannot advance from availability to signUp');
  assert(!f.get('submit').disabled, 'Invalidation must release old busy controls');
  f.click('registerButton'); f.fill(); f.get('registerNickname').value = ''; f.available(true); await f.submit();
  assert.equal(f.calls.at(-1)[0], 'signUp');
  assert.deepEqual(f.calls.at(-1)[1].options, { emailRedirectTo: 'https://fixture.test', data: { display_name: null } });
  assert(f.storage.has('horroreiro_email_confirmation_pending')); assert.deepEqual(f.goals, ['register']);

  f = fixture(); f.controller.open(); f.fill(); const oldLogin = deferred();
  f.results.signInWithPassword = oldLogin.promise; const oldSubmission = f.submit();
  await f.controller.close(); f.controller.open(); f.fill(); const nextLogin = deferred();
  f.results.signInWithPassword = nextLogin.promise; const nextSubmission = f.submit();
  oldLogin.resolve({ error: { message: 'obsolete' } }); await oldSubmission;
  assert(f.get('submit').disabled, 'Old finally cannot release a new submission');
  assert.notEqual(f.get('authMessage').textContent, 'obsolete');
  nextLogin.resolve({ error: { message: 'current failure' } }); await nextSubmission;
  assert(!f.get('submit').disabled); assert.equal(f.get('authMessage').textContent, 'current failure');

  f = fixture(); f.controller.open(); await f.click('forgotPasswordButton'); assert.equal(f.calls.length, 0);
  f.fill(); await f.click('forgotPasswordButton');
  assert.equal(f.calls.at(-1)[1], 'fixture@example.test');
  assert.equal(new URL(f.calls.at(-1)[2].redirectTo).searchParams.get('auth_action'), 'password-recovery');
  assert(f.controller.hasPendingRecovery()); assert(!f.get('submit').disabled);
  f.results.resetPasswordForEmail = { error: { message: 'offline reset' } };
  await f.click('forgotPasswordButton'); assert.equal(f.get('authMessage').textContent, 'offline reset');
  assert(!f.get('submit').disabled);

  f = fixture(); f.controller.enterRecovery(); f.get('loginPassword').value = 'next-password';
  f.get('loginPasswordConfirm').value = 'different'; await f.submit(); assert.equal(f.calls.length, 0);
  f.get('loginPasswordConfirm').value = 'next-password'; await f.submit();
  assert.deepEqual(f.calls.map(call => call[0]), ['getSession', 'refreshSession']);
  f.results.refreshSession = { data: { session: { user: { id: 'recovery' } } } }; await f.submit();
  assert.equal(f.calls.at(-1)[0], 'updateUser');
  f.replaceSession({ id: 'recovery' }); await f.flush(900);
  assert(!f.calls.some(call => call[0] === 'signOut'), 'Old recovery timer must not sign out a replacement session');

  f = fixture(); f.controller.enterRecovery(); f.fill(); f.get('loginPasswordConfirm').value = f.get('loginPassword').value;
  f.results.getSession = { data: { session: { user: { id: 'recovery' } } } };
  f.results.signOut = () => { f.replaceSession(null); return {}; };
  await f.submit(); await f.flush(900);
  assert.deepEqual(f.calls.map(call => call[0]), ['getSession', 'updateUser', 'signOut']);
  assert.deepEqual(f.calls.at(-1)[1], { scope: 'local' });
  assert(!f.controller.isOpen(), 'Own signout must still close the completed recovery form');
  assert.equal(f.get('loginPassword').value, '');

  f = fixture(); f.controller.enterRecovery(); await f.controller.close();
  assert.deepEqual(f.calls.at(-1), ['signOut', { scope: 'global' }]);
  assert(!f.controller.hasPendingRecovery()); assert(!f.controller.isRecoveryMode());

  f = fixture(); f.controller.enterRecovery(); f.fill(); f.get('loginPasswordConfirm').value = f.get('loginPassword').value;
  const session = deferred(); f.results.getSession = session.promise; const saving = f.submit();
  f.replaceSession({ id: 'new' }); session.resolve({ data: {} }); await saving;
  assert.deepEqual(f.calls.map(call => call[0]), ['getSession'], 'Stale recovery must not refresh or change another session');

  for (const [suffix, method] of [['?keep=yes&code=fixture-code', 'exchangeCodeForSession'],
    ['?keep=yes#access_token=fixture-access&refresh_token=fixture-refresh&anchor=ok', 'setSession'],
    ['?keep=yes&type=signup&token_hash=fixture-hash', 'verifyOtp']]) {
    f = fixture(`https://fixture.test/${suffix}`); await f.controller.initializeRedirect();
    assert.equal(f.calls[0][0], method); assert.equal(window.location.search, '?keep=yes');
    assert(!window.location.href.includes('fixture-')); assert(!window.location.href.includes('token_hash'));
    if (method === 'verifyOtp') assert.equal(f.calls[0][1].type, 'email');
  }
  f = fixture('https://fixture.test/?keep=yes&type=recovery&error=expired'); await f.controller.initializeRedirect();
  assert(f.controller.isOpen()); assert(!f.controller.isRecoveryEntryPage()); assert.equal(window.location.search, '?keep=yes');
  f = fixture('https://fixture.test/?keep=yes&type=recovery&token_hash=fixture-hash');
  f.results.getSession = { data: { session: { user: { id: 'recovery' } } } };
  await f.controller.initializeRedirect(); assert(f.controller.isRecoveryMode()); assert(f.controller.isRecoveryEntryPage());
  assert.equal(f.get('loginEmail').disabled, true); assert(f.get('loginPasswordConfirm').classList.contains('is-visible'));
  f = fixture();
  f.results.getSession = { data: { session: { user: { id: 'recovery' } } } };
  await f.controller.initializeRedirect('https://fixture.test/?keep=yes#access_token=fixture-access&refresh_token=fixture-refresh&type=recovery');
  assert(f.controller.isRecoveryMode(), 'The initial URL survives SDK hash consumption while modules load');
  assert.equal(f.calls[0][0], 'setSession');
  f = fixture('https://fixture.test/?keep=yes&type=signup&token_hash=fixture-hash');
  f.storage.set('horroreiro_email_confirmation_pending', '1'); await f.controller.initializeRedirect();
  f.replaceSession({ id: 'confirmed' }); f.controller.trackEmailConfirmedLoginIfNeeded(); f.controller.trackEmailConfirmedLoginIfNeeded();
  assert.deepEqual(f.goals, ['email_confirmed_login']); assert(!f.storage.has('horroreiro_email_confirmation_pending'));
  console.log('Auth UI smoke passed');
} finally {
  Object.assign(globalThis, globals); console.error = originalError;
}
