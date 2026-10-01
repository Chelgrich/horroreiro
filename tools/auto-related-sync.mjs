import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  formatAutoRelatedSyncSummary,
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
    '',
    'Options:',
    '  --slug VALUE       Movie slug to sync.',
    '  --movie-id VALUE   Movie UUID to sync.',
    '  --write            Persist provider evidence and sync state.',
    '  --force            Allow writes without AUTO_RELATED_MOVIES=true.',
    '  --full             Print full evidence rows and sync-state patch.',
    '  --help             Show this help.'
  ].join('\n'));
}

function parseArgs(argv) {
  const options = {
    force: false,
    full: false,
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

if (!options.movieId && !options.slug) {
  printHelp();
  throw new Error('Pass --slug or --movie-id.');
}

await loadLocalEnvFile();

const result = await syncOneAutoRelatedMovie(options);
const output = options.full ? result : formatAutoRelatedSyncSummary(result);

console.log(JSON.stringify(output, null, 2));
