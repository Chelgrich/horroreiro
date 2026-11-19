import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createAccountHeaderController } from '../account-header-controller.js';

function element() {
  const attrs = new Map();
  const classes = new Set();
  return {
    dataset: {}, style: {}, events: {}, hidden: false, disabled: false,
    classList: {
      remove: name => classes.delete(name), contains: name => classes.has(name),
      toggle(name, force = !classes.has(name)) {
        if (force) classes.add(name);
        else classes.delete(name);
        return force;
      }
    },
    setAttribute: (name, value) => attrs.set(name, value),
    getAttribute: name => attrs.get(name),
    removeAttribute: name => attrs.delete(name),
    addEventListener(type, handler) {
      assert(!this.events[type], 'Bind the menu event once');
      this.events[type] = handler;
    },
    prepend(child) { this.image = child; child.remove = () => { this.image = null; }; }
  };
}

const elements = new Map();
function get(id) {
  if (!elements.has(id)) elements.set(id, element());
  return elements.get(id);
}
globalThis.document = element();
document.getElementById = get;
document.createElement = element;
document.visibilityState = 'visible';
const intervals = new Map();
let nextTimer = 0;
globalThis.setInterval = (fn, delay) => {
  assert.equal(delay, 60000);
  intervals.set(++nextTimer, fn);
  return nextTimer;
};
globalThis.clearInterval = id => intervals.delete(id);
const button = get('openAuthModalButton');
button.querySelector = () => get('svg');
const menu = get('authPopoverMenu');
const profile = get('profileSummaryButton');
const adminAction = get('databaseExportButton');
const adminLink = get('productionAdminSummaryButton');
adminAction.dataset.adminOnlyMenuItem = 'true';
adminLink.dataset.adminOnlyMenuItem = 'true';
let logins = 0;
let logouts = 0;
let exports = 0;
let picks = 0;
const refreshes = [];
let onRefresh = () => {};
let profileUrl = '/user/a';
get('letterboxdRatingsFileInput').click = () => { picks += 1; };
const controller = createAccountHeaderController({
  openLogin: () => { logins += 1; }, logout: () => { logouts += 1; },
  isSameCurrentPageUrl: href => href === '/user/a',
  restoreCurrentPageLink(link) { delete link.dataset.currentPageLink; },
  disableCurrentPageLink(link) { link.dataset.currentPageLink = 'true'; link.setAttribute('aria-current', 'page'); },
  links: { profileSummaryButton: () => profileUrl, productionAdminSummaryButton: () => '/production' },
  actions: { databaseExportButton: { run: () => { exports += 1; }, label: 'Export', busyLabel: 'Exporting' } },
  refreshUnread(options) {
    refreshes.push(options);
    return onRefresh(options);
  },
  unreadRefreshInterval: 60000,
  onImportPickerOpen() {}, onImportFileChange() {}, onImportPickerCancel() {}
});
const sync = state => controller.sync({ userId: null, isAdmin: false, showAddMovie: false, displayName: '', avatarUrl: '',
  unreadCount: 0, settingsOpen: false, ready: true, ...state });
get('authControls').classList.toggle('auth-controls-pending', true);
sync({ ready: false });
assert(get('authControls').classList.contains('auth-controls-pending'));
button.events.click();
assert.equal(logins, 1);
assert(profile.hidden);
assert.equal(intervals.size, 0, 'Guests do not poll');
sync({ userId: 'a', isAdmin: true, displayName: '<Alice>', avatarUrl: 'https://fixture.test/a.jpg', unreadCount: 102 });
assert(!get('authControls').classList.contains('auth-controls-pending'));
assert.equal(get('displayNameText').textContent, '<Alice>');
assert.equal(button.image.getAttribute('src'), 'https://fixture.test/a.jpg');
assert.equal(get('notificationsMenuBadge').textContent, '99+');
assert.equal(intervals.size, 1);
intervals.values().next().value();
assert.deepEqual(refreshes, [{ force: true }]);
controller.syncBadge(103);
assert.equal(get('authNotificationBadge').title.endsWith('103'), true);
document.visibilityState = 'hidden';
document.events.visibilitychange();
assert.equal(intervals.size, 0, 'Hidden tabs do not poll');
document.visibilityState = 'visible';
document.events.visibilitychange();
assert.equal(intervals.size, 1);
assert.deepEqual(refreshes, [{ force: true }, undefined]);
assert.equal(profile.getAttribute('aria-current'), 'page');
assert(!adminLink.hidden);
button.events.click();
assert(menu.classList.contains('is-open'));
profile.events.click({ ctrlKey: true });
assert(menu.classList.contains('is-open'));
document.events.click({ target: { closest: () => null } });
assert.equal(button.getAttribute('aria-expanded'), 'false');
adminAction.events.click();
assert.equal(exports, 1);
controller.setActionBusy('databaseExportButton', true);
adminAction.events.click();
assert.equal(exports, 1);
get('importLetterboxdRatingsButton').events.click();
assert.equal(picks, 1);

button.events.click();
profileUrl = '/user/b';
sync({ userId: 'b', displayName: 'Bob' });
assert(!menu.classList.contains('is-open'), 'Switching directly from admin to user closes the old menu');
assert(adminLink.hidden && adminAction.hidden);
assert.equal(adminLink.getAttribute('href'), undefined);
assert.equal(profile.getAttribute('href'), '/user/b');
assert.equal(profile.getAttribute('aria-current'), undefined);
assert.equal(button.image, null);
assert.equal(get('svg').style.display, '');
assert(get('notificationsMenuBadge').hidden);
get('logoutMenuButton').events.click();
assert.equal(logouts, 1);
sync();
assert(profile.hidden && get('authNotificationBadge').hidden);
assert.equal(get('displayNameText').textContent, '');
assert.equal(intervals.size, 0, 'Logout stops polling');

// Exercise the real unread request and identity transition with interleaved responses.
const source = (await readFile(new URL('../app.js', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
const bindings = ['setCurrentSessionUser', 'resetNotificationsUnreadCount', 'refreshNotificationsUnreadCount']
  .map(name => source.match(new RegExp(`(?:async )?function ${name}\\([^]*?\\n\\}`))[0]).join('\n');
const pending = [];
const badges = [];
const ctx = vm.createContext({
  currentUser: null, currentUserRole: null, currentUserProfile: null, profileFollowActions: null, profileSettingsController: null,
  notificationsPageController: null,
  notificationsUnreadCount: 0, notificationsUnreadUserId: '', notificationsUnreadRefreshPromise: null,
  notificationsUnreadFetchedAt: 0, areNotificationsUnavailable: false, NOTIFICATIONS_UNREAD_REFRESH_INTERVAL_MS: 60000,
  updateAdminStatus() {}, rebuildMovieRatingIndexes() {}, rebuildCurrentUserWatchlistIndex() {},
  syncAccountHeader: () => badges.push(ctx.notificationsUnreadCount),
  shouldUseAuthenticatedUi: () => Boolean(ctx.currentUser),
  accountHeaderController: { syncBadge: count => { badges.push(count); controller.syncBadge(count); } },
  isNotificationsUnavailableError: () => true,
  supabaseClient: {
    from: () => ({ select: () => ({ eq: (_column, id) => ({ is: () => new Promise(resolve => pending.push({ id, resolve })) }) }) })
  }
});
vm.runInContext(bindings, ctx);
ctx.setCurrentSessionUser({ id: 'a' });
const old = ctx.refreshNotificationsUnreadCount();
ctx.setCurrentSessionUser({ id: 'b' });
ctx.setCurrentSessionUser({ id: 'a' });
const current = ctx.refreshNotificationsUnreadCount();
pending[0].resolve({ error: { message: 'stale missing table' } });
assert.equal(await old, 0);
assert.equal(ctx.areNotificationsUnavailable, false);
const deduplicated = ctx.refreshNotificationsUnreadCount();
assert.equal(pending.length, 2, 'Old completion cannot clear the new in-flight request');
pending[1].resolve({ count: 7, error: null });
assert.equal(await current, 7);
assert.equal(await deduplicated, 7);
const late = ctx.refreshNotificationsUnreadCount({ force: true });
ctx.setCurrentSessionUser({ id: 'b' });
assert.equal(badges.at(-1), 0, 'Old count clears before loading the next viewer');
pending[2].resolve({ count: 12, error: null });
assert.equal(await late, 0);
assert.equal(badges.at(-1), 0, 'Old successful request cannot publish into the next viewer');
sync({ userId: 'b' });
assert(get('authNotificationBadge').hidden);
onRefresh = ctx.refreshNotificationsUnreadCount;
const tick = intervals.values().next().value;
tick();
assert.equal(pending[3].id, 'b');
pending[3].resolve({ count: 1, error: null });
await ctx.notificationsUnreadRefreshPromise;
assert(!get('authNotificationBadge').hidden, 'A background count refresh reveals the badge without a page reload');
assert.equal(get('notificationsMenuBadge').textContent, '1');
console.log('Account header smoke passed.');
