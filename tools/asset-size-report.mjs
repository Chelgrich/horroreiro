import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

const assetGroups = {
  js: [
    'boot-loader.js',
    'app-script-loader.js',
    'shared-layout.js',
    'custom-select.js',
    'app-page-runtime.js',
    'app.js',
    'letterboxd-import.js',
    'assets/directors-admin-app.js'
  ],
  css: [
    'styles.css'
  ],
  html: [
    'index.html',
    'movie.html',
    'user.html',
    'following.html',
    'notifications.html',
    'editor.html',
    'name.html',
    'directors.html'
  ]
};

const startupProfiles = {
  catalog: [
    'boot-loader.js',
    'app-script-loader.js',
    'shared-layout.js',
    'custom-select.js',
    'app-page-runtime.js',
    'app.js'
  ],
  movie: [
    'boot-loader.js',
    'app-script-loader.js',
    'shared-layout.js',
    'custom-select.js',
    'app-page-runtime.js',
    'app.js'
  ],
  profile: [
    'boot-loader.js',
    'app-script-loader.js',
    'shared-layout.js',
    'app-page-runtime.js',
    'app.js'
  ],
  notifications: [
    'boot-loader.js',
    'app-script-loader.js',
    'shared-layout.js',
    'app-page-runtime.js',
    'app.js'
  ],
  directors: [
    'boot-loader.js',
    'app-script-loader.js',
    'shared-layout.js',
    'app-page-runtime.js',
    'app.js',
    'assets/directors-admin-app.js'
  ]
};

const brotliOptions = {
  params: {
    [constants.BROTLI_PARAM_QUALITY]: 11
  }
};

function parseArgs(argv) {
  const args = {
    json: false,
    comparePath: '',
    savePath: ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--json') {
      args.json = true;
    } else if (arg === '--compare') {
      args.comparePath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--save') {
      args.savePath = argv[index + 1] || '';
      index += 1;
    }
  }

  return args;
}

function formatBytes(bytes) {
  const numericBytes = Number(bytes || 0);

  if (!Number.isFinite(numericBytes) || numericBytes === 0) {
    return '0 B';
  }

  const sign = numericBytes < 0 ? '-' : '';
  const absoluteBytes = Math.abs(numericBytes);

  if (absoluteBytes < 1024) {
    return `${sign}${absoluteBytes} B`;
  }

  const kib = absoluteBytes / 1024;

  if (kib < 1024) {
    return `${sign}${kib.toFixed(1)} KiB`;
  }

  return `${sign}${(kib / 1024).toFixed(2)} MiB`;
}

function getMetricDelta(nextValue, previousValue) {
  const next = Number(nextValue || 0);
  const previous = Number(previousValue || 0);
  const delta = next - previous;
  const percent = previous ? (delta / previous) * 100 : 0;

  return {
    bytes: delta,
    percent: Number(percent.toFixed(2))
  };
}

function sumMetrics(items) {
  return items.reduce((totals, item) => ({
    raw: totals.raw + Number(item.raw || 0),
    gzip: totals.gzip + Number(item.gzip || 0),
    brotli: totals.brotli + Number(item.brotli || 0)
  }), {
    raw: 0,
    gzip: 0,
    brotli: 0
  });
}

async function measureFile(file) {
  const buffer = await readFile(join(rootDir, file));
  const gzipBuffer = gzipSync(buffer, { level: 9 });
  const brotliBuffer = brotliCompressSync(buffer, brotliOptions);

  return {
    file,
    raw: buffer.byteLength,
    gzip: gzipBuffer.byteLength,
    brotli: brotliBuffer.byteLength
  };
}

function getUniqueFiles() {
  return [...new Set(Object.values(assetGroups).flat())];
}

function getAssetByFile(assetMap, file) {
  const asset = assetMap.get(file);

  if (!asset) {
    throw new Error(`Missing asset measurement for ${file}`);
  }

  return asset;
}

async function buildReport() {
  const assets = await Promise.all(getUniqueFiles().map(measureFile));
  const assetMap = new Map(assets.map(asset => [asset.file, asset]));
  const groups = Object.fromEntries(
    Object.entries(assetGroups).map(([groupName, files]) => [
      groupName,
      sumMetrics(files.map(file => getAssetByFile(assetMap, file)))
    ])
  );
  const startup = Object.fromEntries(
    Object.entries(startupProfiles).map(([profileName, files]) => [
      profileName,
      {
        files,
        ...sumMetrics(files.map(file => getAssetByFile(assetMap, file)))
      }
    ])
  );

  return {
    assets: assets.sort((first, second) => second.raw - first.raw),
    groups,
    startup
  };
}

async function readBaseline(comparePath) {
  if (!comparePath) {
    return null;
  }

  const absolutePath = join(rootDir, comparePath);
  const baseline = JSON.parse(await readFile(absolutePath, 'utf8'));

  return {
    path: relative(rootDir, absolutePath),
    data: baseline
  };
}

function buildComparison(report, baseline) {
  if (!baseline?.data) {
    return null;
  }

  const compareMetrics = (nextMetrics, previousMetrics) => ({
    raw: getMetricDelta(nextMetrics?.raw, previousMetrics?.raw),
    gzip: getMetricDelta(nextMetrics?.gzip, previousMetrics?.gzip),
    brotli: getMetricDelta(nextMetrics?.brotli, previousMetrics?.brotli)
  });

  return {
    path: baseline.path,
    groups: Object.fromEntries(
      Object.entries(report.groups).map(([key, metrics]) => [
        key,
        compareMetrics(metrics, baseline.data.groups?.[key])
      ])
    ),
    startup: Object.fromEntries(
      Object.entries(report.startup).map(([key, metrics]) => [
        key,
        compareMetrics(metrics, baseline.data.startup?.[key])
      ])
    )
  };
}

function formatMetricRow(label, metrics) {
  return [
    label.padEnd(16),
    formatBytes(metrics.raw).padStart(11),
    formatBytes(metrics.gzip).padStart(11),
    formatBytes(metrics.brotli).padStart(11)
  ].join('  ');
}

function formatHeaderRow(label = 'name') {
  return [
    label.padEnd(16),
    'raw'.padStart(11),
    'gzip'.padStart(11),
    'brotli'.padStart(11)
  ].join('  ');
}

function formatDelta(delta) {
  const sign = delta.bytes > 0 ? '+' : '';

  return `${sign}${formatBytes(delta.bytes)} (${sign}${delta.percent}%)`;
}

function printReport(report, comparison = null) {
  console.log('Asset size report');
  console.log('');
  console.log('Totals');
  console.log(formatHeaderRow('group'));
  Object.entries(report.groups).forEach(([groupName, metrics]) => {
    console.log(formatMetricRow(groupName, metrics));
  });

  console.log('');
  console.log('Startup JS profiles');
  console.log(formatHeaderRow('profile'));
  Object.entries(report.startup).forEach(([profileName, metrics]) => {
    console.log(formatMetricRow(profileName, metrics));
  });

  console.log('');
  console.log('Largest files');
  console.log(formatHeaderRow('file'));
  report.assets.slice(0, 8).forEach(asset => {
    console.log(formatMetricRow(asset.file, asset));
  });

  if (!comparison) {
    return;
  }

  console.log('');
  console.log(`Compared to ${comparison.path}`);
  Object.entries(comparison.startup).forEach(([profileName, metrics]) => {
    console.log(`${profileName.padEnd(16)} brotli ${formatDelta(metrics.brotli)} raw ${formatDelta(metrics.raw)}`);
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = await buildReport();
  const baseline = await readBaseline(args.comparePath);
  const comparison = buildComparison(report, baseline);

  if (args.savePath) {
    await writeFile(
      join(rootDir, args.savePath),
      `${JSON.stringify(report, null, 2)}\n`,
      'utf8'
    );
  }

  if (args.json) {
    console.log(JSON.stringify(comparison ? { ...report, comparison } : report, null, 2));
    return;
  }

  printReport(report, comparison);
}

await main();
