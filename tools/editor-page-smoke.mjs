import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers/promises';
import { createEditorPageController } from '../editor-page.js';

globalThis.document = { title: '' };

const diagnostics = [];
let user = { id: 'editor' };
let pageWrites = 0;
const slot = { outerHTML: '' };
const editorPage = {
  set innerHTML(html) { this.html = html; pageWrites++; },
  querySelector(selector) {
    assert.equal(selector, '[data-editor-diagnostics-loading]');
    return this.html.includes('data-editor-diagnostics-loading') ? slot : null;
  }
};
const controller = createEditorPageController({
  editorPage,
  getCurrentUser: () => user,
  getIsAdmin: () => Boolean(user),
  captureSession: () => {
    const viewer = user;
    return { isCurrent: () => user === viewer };
  },
  shouldUseAuthenticatedUi: () => Boolean(user),
  hasWarmStartedPageDom: () => false,
  escapeHtml: String,
  fetchAdminCompletenessMovieRows: async () => [],
  fetchAdminMoviePosterImageRows: async () => [],
  fetchAdminAutoRelatedDiagnostics: () => new Promise((resolve, reject) => diagnostics.push({ resolve, reject })),
  groupRowsByMovieId: () => new Map()
});

const firstLoad = controller.loadEditorPage();
await setImmediate();
assert.match(editorPage.html, /editor-page-summary-grid/, 'Pending diagnostics must not block the summary');
assert.match(editorPage.html, /data-editor-diagnostics-loading/);
assert(editorPage.html.indexOf('editor-page-issue-grid') < editorPage.html.indexOf('data-editor-diagnostics-loading'));
await firstLoad;

const refresh = controller.loadEditorPage();
await refresh;
const writesWithSummary = pageWrites;
diagnostics[0].resolve({});
await setImmediate();
assert.equal(slot.outerHTML, '', 'An older refresh must not replace current diagnostics');

diagnostics[1].reject(new Error('diagnostics unavailable'));
await setImmediate();
assert.match(slot.outerHTML, /diagnostics unavailable/);
assert.equal(pageWrites, writesWithSummary, 'Diagnostics must update their own block');

await controller.loadEditorPage();
diagnostics[2].resolve({});
await setImmediate();
assert.match(slot.outerHTML, /editor-page-auto-related-summary-grid/);

await controller.loadEditorPage();
user = null;
await controller.loadEditorPage();
diagnostics[3].reject(new Error('signed out'));
await setImmediate();
assert.match(editorPage.html, /data-editor-action="login"/);
assert.match(slot.outerHTML, /editor-page-auto-related-summary-grid/, 'Late diagnostics must be ignored after sign-out');

console.log('Editor page smoke passed.');
