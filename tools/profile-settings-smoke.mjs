import assert from 'node:assert/strict';
import { createProfileSettingsController } from '../profile-settings-controller.js';
import { createProfileSettingsActions } from '../profile-settings-actions.js';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

function element() {
  const classes = new Set();
  const events = {};
  return { value: '', checked: false, disabled: false, hidden: false, textContent: '', innerHTML: '', style: {}, dataset: {}, events,
    classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name), toggle(name, force) { if (force ?? !classes.has(name)) classes.add(name); else classes.delete(name); } },
    addEventListener: (type, handler) => { (events[type] ||= []).push(handler); },
    setAttribute(name, value) { this[name] = value; }, removeAttribute(name) { if (name === 'style') this.style = {}; else delete this[name]; },
    focus() {}, select() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    getBoundingClientRect: () => ({ width: 280 }), setPointerCapture() {}, releasePointerCapture() {}
  };
}
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
const elements = new Map();
const get = id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
const avatarPreview = element();
const otherAvatar = element();
const avatarStatus = element();
const avatarInput = element();
const avatarDelete = element();
const documentEvents = {};
const cropFields = new Map();
const cropField = selector => { if (!cropFields.has(selector)) cropFields.set(selector, element()); return cropFields.get(selector); };
const sourceImages = [];
const revokedUrls = [];
const canvases = [];
let objectUrlNumber = 0;
const previous = { document: globalThis.document, requestAnimationFrame: globalThis.requestAnimationFrame, Image: globalThis.Image };
const previousObjectUrls = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
URL.createObjectURL = () => `blob:fixture-${++objectUrlNumber}`;
URL.revokeObjectURL = url => { revokedUrls.push(url); };
globalThis.Image = class { constructor() { this.naturalWidth = 512; this.naturalHeight = 256; sourceImages.push(this); } };
globalThis.requestAnimationFrame = callback => callback(123);
globalThis.document = {
  body: { appendChild() {} },
  createElement(tag) {
    if (tag === 'canvas') {
      const canvas = { getContext: () => ({ fillRect() {}, translate() {}, drawImage() {} }),
        toBlob: (callback, type) => callback({ type, size: 123 }) };
      canvases.push(canvas); return canvas;
    }
    return { ...element(), querySelector: cropField, querySelectorAll: () => [cropField('close')] };
  },
  getElementById: get,
  addEventListener: (type, handler) => { (documentEvents[type] ||= []).push(handler); },
  querySelectorAll: selector => ({ '.profile-settings-avatar-preview': [avatarPreview],
    '[data-profile-avatar-media-slot]': [avatarPreview, otherAvatar],
    '[data-user-page-avatar-status="true"]': [avatarStatus], '[data-user-page-avatar-input="true"]': [avatarInput],
    '[data-user-page-avatar-delete="true"]': [avatarDelete] })[selector] || [],
  addEventListener: (type, handler) => { (documentEvents[type] ||= []).push(handler); },
  body: { appendChild() {} }
};
globalThis.requestAnimationFrame = callback => { callback(); return 1; };
let user = { id: 'alice', email: 'fixture@example.test' };
let profile = { display_name: 'Alice', avatar_url: 'old-avatar' };
let pendingActions;
let saveResult = { ok: true };
const writes = [];
const patches = [];
const actions = {
  saveDisplayName: async options => { writes.push(options); return saveResult; },
  savePosterPreference: async options => { writes.push(options); return {}; }
};
try {
  const controller = createProfileSettingsController({ getCurrentUser: () => user, getCurrentProfile: () => profile,
    shouldUseAuthenticatedUi: () => Boolean(user), getCurrentDisplayName: () => profile.display_name,
    normalizeDisplayNameValue: value => value.toLowerCase(), isValidDisplayNameValue: value => /^[A-Za-z0-9_]{3,24}$/.test(value),
    doesProfilePreferRussianPosters: value => Boolean(value?.prefer_russian_posters),
    getPublicProfileAvatarUrl: value => value?.avatar_url || '', getUserPageAvatarMediaHtml: value => `<avatar>${value?.avatar_url}</avatar>`,
    isRussianPostersColumnAvailable: () => true, markMissingProfileOptionalColumn() {},
    loadProfileSettingsActions: () => pendingActions || actions,
    applyProfileSettingsPatch: options => { patches.push(options); profile = { ...profile, ...options.patch }; return true; },
    refreshPosterPreferenceDependentUi: async () => {}, setPageAvatarSubmitting() {},
    closeAuthPopoverMenu() {}, syncBodyScrollLock() {}, armDeleteMovieButton() {}, getReadableAuthErrorMessage: error => error.message
  });
  controller.open();
  assert(controller.isOpen());
  assert.equal(get('displayNameInput').value, 'Alice');
  assert(avatarPreview.innerHTML.includes('old-avatar'));
  assert.equal(otherAvatar.innerHTML, '', 'Settings must not overwrite another public profile avatar');
  assert.equal(get('displayNameForm').events.submit.length, 1);
  const submit = get('displayNameForm').events.submit[0];
  get('displayNameInput').value = '!';
  await submit({ preventDefault() {} });
  assert.equal(writes.length, 0, 'Invalid input cannot reach persistence');
  get('displayNameInput').value = 'Updated';
  await submit({ preventDefault() {} });
  assert.equal(patches.at(-1).userId, 'alice');
  assert.equal(profile.display_name, 'Updated');
  assert.equal(get('displayNameInput').disabled, false);
  const lazy = deferred(); pendingActions = lazy.promise;
  get('displayNameInput').value = 'OldActor';
  const saving = submit({ preventDefault() {} });
  const writesBeforeSwitch = writes.length;
  user = { id: 'bob' }; profile = { display_name: 'Bob' };
  controller.syncAuthState();
  lazy.resolve(actions); await saving;
  assert.equal(writes.length, writesBeforeSwitch, 'A lazy controller action cannot switch its captured actor');
  assert.equal(controller.isOpen(), false);
  assert.equal(get('profilePasswordCurrent').value, '');
  controller.open(); pendingActions = null;
  get('displayNameInput').value = 'RetryName';
  saveResult = { ok: false, reason: 'display-name-unavailable' };
  await submit({ preventDefault() {} });
  assert.equal(get('displayNameInput').disabled, false, 'Rejected writes release busy state');
  assert.equal(profile.display_name, 'Bob');
  saveResult = { ok: true };
  await submit({ preventDefault() {} });
  assert.equal(profile.display_name, 'RetryName');
  profile.avatar_url = 'https://example.test/old.jpg';
  const removedFiles = [];
  let failAvatarWrite = true;
  let avatarUploads = 0;
  actions.uploadAvatarBlob = async (blob, userId) => {
    assert.equal(userId, 'bob'); assert.equal(blob.type, 'image/jpeg'); avatarUploads += 1;
    return 'https://example.test/new.jpg';
  };
  actions.updateProfileAvatarUrl = async options => {
    assert.equal(options.userId, 'bob'); if (failAvatarWrite) throw Error('Ambiguous response');
  };
  actions.deleteAvatarFileByUrl = async url => { removedFiles.push(url); };
  const changeAvatar = get('displayNameModal').events.change[0];
  avatarInput.files = [{ name: 'picture.png', type: 'image/png', size: 100 }];
  const selecting = changeAvatar({ target: { closest: () => avatarInput } });
  sourceImages.at(-1).onload(); await selecting;
  const zoom = cropField('[data-avatar-crop-zoom="true"]');
  zoom.value = '2'; zoom.events.input[0]();
  const frame = cropField('[data-avatar-crop-frame="true"]');
  frame.events.pointerdown[0]({ pointerId: 1, clientX: 0, clientY: 0 });
  frame.events.pointermove[0]({ clientX: 5000, clientY: -5000 });
  frame.events.pointerup[0]({ pointerId: 1 });
  assert(cropField('[data-avatar-crop-image="true"]').style.transform.includes('translate(420px, -140px)'), 'Drag offsets must remain within the cropped source');
  const saveAvatar = cropField('[data-avatar-crop-save="true"]').events.click[0];
  await saveAvatar();
  assert.equal(canvases.at(-1).width, 256); assert.equal(canvases.at(-1).height, 256);
  assert.equal(profile.avatar_url, 'https://example.test/old.jpg');
  assert.equal(removedFiles.length, 0, 'An ambiguous profile response must not delete either avatar file');
  assert.equal(avatarInput.disabled, false, 'Failed avatar writes release busy state');
  failAvatarWrite = false;
  await saveAvatar();
  assert.equal(avatarUploads, 2); assert.equal(profile.avatar_url, 'https://example.test/new.jpg');
  assert.deepEqual(removedFiles, ['https://example.test/old.jpg']);
  assert(revokedUrls.includes('blob:fixture-1'), 'Successful close releases the selected image URL');
  const lateSelection = changeAvatar({ target: { closest: () => avatarInput } });
  controller.close();
  sourceImages.at(-1).onload(); await lateSelection;
  assert.equal(controller.isOpen(), false, 'Cancelled image decoding cannot reopen the crop dialog');
  const passwordVerification = deferred();
  let passwordWrites = 0;
  actions.verifyProfilePassword = options => { assert.equal(options.userId, 'bob'); return passwordVerification.promise; };
  actions.updateProfilePassword = async () => { passwordWrites += 1; return {}; };
  controller.open();
  get('profilePasswordCurrent').value = 'old-test-password';
  get('profilePasswordNew').value = 'new-test-password';
  get('profilePasswordConfirm').value = 'new-test-password';
  const changingPassword = get('profilePasswordForm').events.submit[0]({ preventDefault() {} });
  await Promise.resolve();
  user = { id: 'carol' }; profile = { display_name: 'Carol' }; controller.syncAuthState();
  passwordVerification.resolve({ error: null }); await changingPassword;
  assert.equal(passwordWrites, 0, 'Password verification cannot advance an operation for a departed viewer');
  assert.equal(get('profilePasswordCurrent').value, '');
  assert.equal(get('profilePasswordNew').value, '');
  controller.open();
  avatarInput.files = [{ name: 'late.png', type: 'image/png', size: 100 }];
  const escapedSelection = changeAvatar({ target: { closest: () => avatarInput } });
  const lateImage = sourceImages.at(-1);
  documentEvents.keydown[0]({ key: 'Escape' });
  lateImage.onload(); await escapedSelection;
  assert.equal(controller.isOpen(), false, 'Escape must cancel pending image metadata as well as the settings dialog');
  assert(revokedUrls.includes(lateImage.src), 'Cancelled image metadata releases its object URL');
  controller.close(); assert.equal(controller.isOpen(), false);
} finally {
  Object.assign(globalThis, previous); URL.createObjectURL = previousObjectUrls.create; URL.revokeObjectURL = previousObjectUrls.revoke;
}

let activeUser = { id: 'first' };
const available = deferred();
let authWrites = 0;
const guardedActions = createProfileSettingsActions({
  supabaseClient: { from: () => ({ select() { return this; }, eq() { return this; }, neq() { return this; }, limit: () => available.promise }),
    auth: { updateUser: async () => { authWrites += 1; return { error: null }; } } },
  ensureActiveSessionForWrite: () => activeUser, normalizeDisplayNameValue: value => value,
  withAuthRequestTimeout: promise => promise, withAuthProfileRequestTimeout: promise => promise
});
const oldNameWrite = guardedActions.saveDisplayName({ currentUser: activeUser, nextDisplayName: 'FreshName' });
activeUser = { id: 'second' };
available.resolve({ data: [], error: null });
await assert.rejects(oldNameWrite);
assert.equal(authWrites, 0, 'Availability completion must not update a replacement account');
await assert.rejects(guardedActions.updateProfilePassword({ userId: 'first', nextPassword: 'test-password' }));
assert.equal(authWrites, 0, 'A stale actor cannot reach the Auth password write');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const patchStart = app.indexOf('function applyProfileSettingsPatch(');
const cachedProfiles = [];
const patchContext = vm.createContext({ currentUser: { id: 'viewer', user_metadata: { other: 'retained' } },
  currentUserProfile: { default_display_name: 'fixture', role: 'user' },
  cachePublicProfileRows: rows => cachedProfiles.push(...rows), invalidateUserPageDataCache() {},
  userPageController: { syncOwnProfileIdentity() {} }, updateAuthUI() {} });
vm.runInContext(app.slice(patchStart, app.indexOf('\n}', patchStart) + 2), patchContext);
assert.equal(patchContext.applyProfileSettingsPatch({ userId: 'departed', patch: { display_name: 'Wrong' } }), false);
assert.equal(cachedProfiles.length, 0);
assert.equal(patchContext.applyProfileSettingsPatch({ userId: 'viewer', patch: { display_name: 'Confirmed' } }), true);
assert.equal(patchContext.currentUser.user_metadata.display_name, 'Confirmed');
assert.equal(patchContext.currentUser.user_metadata.other, 'retained');
assert.equal(cachedProfiles.at(-1).id, 'viewer');
assert.equal(cachedProfiles.at(-1).role, 'user');
console.log('Profile settings smoke passed.');
