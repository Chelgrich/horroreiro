import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  formatAutoRelatedBatchSummary,
  formatAutoRelatedSyncSummary,
  syncAutoRelatedMoviesBatch,
  syncOneAutoRelatedMovie
} from './auto-related/sync-runner.mjs';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const defaultEnvFile = join(projectRoot, 'deploy', 'yandex', 'production.env.local');

function parseEnvValue(value) {
  const trimmedValue = String(value || '').trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

async function loadLocalEnvFile(filePath = defaultEnvFile) {
  let text = '';

  try {
    text = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        loaded: false,
        path: filePath
      };
    }

    throw error;
  }

  let loadedCount = 0;

  text.split(/\r?\n/).forEach(line => {
    const normalizedLine = line.trim();

    if (!normalizedLine || normalizedLine.startsWith('#')) {
      return;
    }

    const separatorIndex = normalizedLine.indexOf('=');

    if (separatorIndex <= 0) {
      return;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim();
    const value = parseEnvValue(normalizedLine.slice(separatorIndex + 1));

    if (!key || process.env[key] !== undefined) {
      return;
    }

    process.env[key] = value;
    loadedCount += 1;
  });

  return {
    loaded: true,
    loadedCount,
    path: filePath
  };
}

function printHelp() {
  console.log([
    'Usage:',
    '  npm run auto-related:sync -- --slug movie-slug',
    '  npm run auto-related:sync -- --movie-id movie-uuid --write',
    '  npm run auto-related:sync -- --limit 20 --write --force',
    '',
    'Options:',
    '  --slug VALUE        Movie slug to sync.',
    '  --movie-id VALUE    Movie UUID to sync.',
    '  --limit VALUE       Batch-sync the least recently synced movies.',
    '  --delay-ms VALUE    Delay between batch items. Default: 1000 for batch, 0 for single.',
    '  --write             Persist provider evidence, sync state, and materialized related rows.',
    '  --force             Allow writes without AUTO_RELATED_MOVIES=true.',
    '  --full              Print full evidence rows and sync-state patch.',
    '  --help              Show this help.'
  ].join('\n'));
}

function parseNonNegativeIntegerOption(name, value, fallback) {
  const numericValue = Number(value);

  if (!Number.isSafeInteger(numericValue) || numericValue < 0) {
    throw new Error(`${name} must be a non-negative integer.`);
  }

  return numericValue || fallback;
}

function parseArgs(argv) {
  const options = {
    delayMs: null,
    force: false,
    full: false,
    limit: 0,
    movieId: '',
    slug: '',
    write: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--full') {
      options.full = true;
    } else if (arg === '--limit') {
      options.limit = parseNonNegativeIntegerOption('--limit', argv[index + 1], 0);
      index += 1;
    } else if (arg === '--delay-ms') {
      options.delayMs = parseNonNegativeIntegerOption('--delay-ms', argv[index + 1], 0);
      index += 1;
    } else if (arg === '--slug') {
      options.slug = String(argv[index + 1] || '').trim();
      index += 1;
    } else if (arg === '--movie-id') {
      options.movieId = String(argv[index + 1] || '').trim();
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.limit && (options.movieId || options.slug)) {
  printHelp();
  throw new Error('Use either --limit for batch sync or --slug/--movie-id for one movie, not both.');
}

if (!options.limit && !options.movieId && !options.slug) {
  printHelp();
  throw new Error('Pass --slug, --movie-id, or --limit.');
}

await loadLocalEnvFile();

const result = options.limit
  ? await syncAutoRelatedMoviesBatch({
    ...options,
    delayMs: options.delayMs ?? 1000
  })
  : await syncOneAutoRelatedMovie({
    ...options,
    delayMs: options.delayMs ?? 0
  });
const output = options.full
  ? result
  : options.limit
    ? formatAutoRelatedBatchSummary(result)
    : formatAutoRelatedSyncSummary(result);

console.log(JSON.stringify(output, null, 2));
