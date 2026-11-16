import { readFile, writeFile } from 'node:fs/promises';
import { clientJsAssets, clientCssAssets, getClientAssetCacheControl } from '../client-assets.js';

const file = new URL('../_headers', import.meta.url);
const source = await readFile(file, 'utf8');
const block = '# BEGIN CLIENT ASSETS\n' + [...clientJsAssets, ...clientCssAssets]
  .map(file => `/${file}\n  Cache-Control: ${getClientAssetCacheControl(file)}\n`)
  .join('\n') + '# END CLIENT ASSETS';
const next = source.replace(/# BEGIN CLIENT ASSETS[\s\S]*?# END CLIENT ASSETS/, block);
if (!source.includes('# BEGIN CLIENT ASSETS')) throw Error('Missing generated client asset header block');
if (process.argv.includes('--check')) {
  if (next.replaceAll('\r\n', '\n') !== source.replaceAll('\r\n', '\n')) {
    throw Error('Client asset headers are stale. Run node tools/sync-client-headers.mjs');
  }
} else {
  await writeFile(file, next);
}
