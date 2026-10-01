import {
  formatAutoRelatedSyncSummary,
  syncOneAutoRelatedMovie
} from './auto-related/sync-runner.mjs';

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

const result = await syncOneAutoRelatedMovie(options);
const output = options.full ? result : formatAutoRelatedSyncSummary(result);

console.log(JSON.stringify(output, null, 2));
