import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const loader = await readFile(new URL('../boot-loader.js', import.meta.url), 'utf8');
const cacheKey = 'horroreiro_stylesheet_cache_v1';
const buildKey = 'horroreiro_app_build_version';
const assets = ['styles.css', 'catalog-page.css'];
const assetName = href => new URL(href, 'https://fixture.test/').searchParams.get('file');
const storage = (seed = []) => {
  const map = new Map(seed);
  return { getItem: key => map.get(key), setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) };
};

function boot({ source = loader, sessionStorage = storage(), build = 'release-a', fail = () => false,
  contentType = 'text/css', file = false, holdEnv = false, storedBuild = build } = {}) {
  const nodes = [];
  const transfers = [];
  const classes = new Set();
  const timers = new Map();
  const env = { APP_BUILD_VERSION: build };
  const window = {
    location: new URL(file ? 'file:///catalog/index.html' : 'https://fixture.test/'),
    sessionStorage,
    setTimeout(callback, ms) { timers.set(ms, callback); return ms; },
    clearTimeout(id) { timers.delete(id); }
  };
  const document = {
    querySelector: () => null,
    querySelectorAll: () => nodes.filter(node => node.dataset.horroreiroStyleCache === 'true'),
    createElement(tag) {
      return { tag, dataset: {}, remove() { nodes.splice(nodes.indexOf(this), 1); } };
    },
    documentElement: { classList: { contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key) } },
    head: { appendChild(node) {
      nodes.push(node);
      if (node.tag === 'script' && !holdEnv) queueMicrotask(() => { window.__ENV__ = env; node.onload(); });
      if (node.tag === 'link') {
        transfers.push({ type: 'link', href: node.href });
        queueMicrotask(() => node.onload({ currentTarget: node }));
      }
    } }
  };
  const fetch = async href => {
    transfers.push({ type: 'fetch', href });
    const failed = fail(href);
    return { ok: !failed, status: failed ? 503 : 200, headers: new Headers({ 'content-type': contentType }),
      text: async () => `/* ${assetName(href)} */ :root { --fixture: 1; }` };
  };
  const localStorage = storage([[buildKey, storedBuild]]);
  vm.runInNewContext(source, { window, document, sessionStorage, localStorage, fetch, URL });
  return { window, transfers, nodes, classes, sessionStorage, localStorage, timers, flush: () => new Promise(setImmediate) };
}

if (process.argv[2]) {
  const result = boot({ source: await readFile(process.argv[2], 'utf8') });
  await result.flush();
  console.log('Baseline stylesheet transfers:', result.transfers.length);
  process.exit(0);
}

const cold = boot();
await cold.window.__ENV_READY__;
assert.equal(cold.transfers.length, 2, 'One transfer per hosted stylesheet');
assert.deepEqual(cold.nodes.filter(node => node.tag === 'style').map(node => node.dataset.asset), assets);
assert(cold.sessionStorage.getItem(cacheKey), 'A cold visit fills the same-tab cache from the original bytes');

const warm = boot({ sessionStorage: cold.sessionStorage });
assert(warm.classes.has('app-styles-ready'), 'Styles restored before the environment request settles');
await warm.window.__ENV_READY__;
assert.equal(warm.transfers.length, 2, 'Background fresh styles use one transfer each');
assert.equal(warm.nodes.filter(node => node.tag === 'style' && node.dataset.horroreiroStyleCache === 'true').length, 0);

const slowEnv = boot({ sessionStorage: cold.sessionStorage, holdEnv: true });
assert(slowEnv.classes.has('app-styles-ready'));
slowEnv.localStorage.setItem(buildKey, 'release-from-another-tab');
slowEnv.timers.get(2500)();
await slowEnv.window.__ENV_READY__;
assert(slowEnv.transfers.every(({ href }) => href.startsWith('/app-assets/release-a?')));
assert.equal(slowEnv.window.__APP_ENV__.APP_BUILD_VERSION, 'release-a');
assert.equal(slowEnv.window.__APP_ENV__.isFallback, true);
slowEnv.window.__ENV__ = { APP_BUILD_VERSION: 'release-b' };
slowEnv.nodes.find(node => node.tag === 'script').onload();
assert.equal(slowEnv.window.__APP_ENV__.APP_BUILD_VERSION, 'release-a');
assert.equal(slowEnv.transfers.length, 2);

const failedEnv = boot({ holdEnv: true, storedBuild: '' });
failedEnv.nodes.find(node => node.tag === 'script').onerror();
await failedEnv.window.__ENV_READY__;
assert.equal(failedEnv.window.__APP_ENV__.isFallback, true);
assert(!failedEnv.classes.has('app-load-failed'));

const newEnv = boot({ sessionStorage: cold.sessionStorage, build: 'release-b', storedBuild: 'release-a' });
await newEnv.window.__ENV_READY__;
assert.equal(newEnv.window.__APP_ENV__.APP_BUILD_VERSION, 'release-b');
assert(!newEnv.window.__APP_ENV__.isFallback);

const retry = boot({ fail: href => assetName(href) === 'catalog-page.css' && !href.includes('_retry=') });
await retry.window.__ENV_READY__;
assert.equal(retry.transfers.length, 3);
assert(retry.transfers.at(-1).href.includes('_retry='));

const fallback = boot({ sessionStorage: cold.sessionStorage, fail: () => true });
await fallback.window.__ENV_READY__;
assert.equal(fallback.nodes.filter(node => node.dataset.horroreiroStyleCache === 'true').length, 2);
assert(!fallback.classes.has('app-load-failed'));

const unavailable = boot({ fail: () => true });
await unavailable.flush();
assert(unavailable.classes.has('app-load-failed'));
assert(!unavailable.classes.has('app-styles-ready'));

const misrouted = boot({ contentType: 'text/html' });
await misrouted.flush();
assert(misrouted.classes.has('app-load-failed'), 'An HTML error page cannot be applied or cached as CSS');
assert(!misrouted.sessionStorage.getItem(cacheKey));

const file = boot({ file: true });
await file.window.__ENV_READY__;
assert(file.transfers.length === 2 && file.transfers.every(transfer => transfer.type === 'link'));

// Inline startup styles must have the same URL semantics as the original files.
for (const asset of new Set(Array.from(loader.matchAll(/'([\w-]+\.css)'/g), match => match[1]))) {
  const css = await readFile(new URL('../' + asset, import.meta.url), 'utf8');
  assert(!/@import\b/i.test(css), `${asset}: startup readiness cannot wait for CSS imports`);
  for (const [, url] of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
    assert(/^(?:data:|https?:\/\/|\/)/i.test(url), `${asset}: use a root-relative or absolute URL in startup CSS`);
  }
}
console.log('Stylesheet boot smoke passed.');
