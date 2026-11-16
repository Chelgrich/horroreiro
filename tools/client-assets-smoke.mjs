import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { clientJsAssets, clientCssAssets, clientHtmlAssets, versionedClientAssets } from '../client-assets.js';
import { createPortableRuntime } from '../server/runtime.js';

const root = new URL('../', import.meta.url);
const assets = [...clientJsAssets, ...clientCssAssets, ...clientHtmlAssets];
assert.equal(new Set(assets).size, assets.length, 'Asset registry must not have duplicates');
const runtime = createPortableRuntime({ rootDir: fileURLToPath(root) });
for (const file of assets) {
  await access(new URL(file, root));
  assert(!file.includes('..') && !file.startsWith('/'));
  const response = await runtime.handleRequest(new Request(`https://fixture.invalid/${file}`));
  assert.equal(response.status, 200, `Registered file must be published: ${file}`);
}
for (const file of versionedClientAssets) {
  const response = await runtime.handleRequest(new Request(`https://fixture.invalid/app-assets/build?file=${encodeURIComponent(file)}`));
  assert.equal(response.status, 200, `Versioned file must be published: ${file}`);
  assert.match(response.headers.get('cache-control'), /no-store/);
}
for (const file of ['client-assets.js', 'package.json', 'server/runtime.js', '../app.js']) {
  const response = await runtime.handleRequest(new Request(`https://fixture.invalid/app-assets/build?file=${encodeURIComponent(file)}`));
  assert.equal(response.status, 404, `Registry must not broaden private file access: ${file}`);
}
assert.equal((await runtime.handleRequest(new Request('https://fixture.invalid/client-assets.js'))).status, 404);
for (const sourceFile of ['app.js', 'app-script-loader.js']) {
  const source = await readFile(new URL(sourceFile, root), 'utf8');
  for (const [, file] of source.matchAll(/(?:getLazyFeatureModuleUrl|loadLazyStylesheet|loadScript)\('([^']+)'/g)) {
    assert(assets.includes(file), `Loader references an unregistered asset: ${file}`);
  }
}
const headers = spawnSync(process.execPath, ['tools/sync-client-headers.mjs', '--check'], { cwd: root, encoding: 'utf8' });
assert.equal(headers.status, 0, headers.stderr || headers.stdout);
console.log('Client asset registry smoke passed.');
