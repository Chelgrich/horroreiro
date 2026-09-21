import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const defaultEnvExamplePath = 'deploy/yandex/serverless-container.env.example';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseArgs(argv) {
  const options = {
    allowDirty: false,
    envExamplePath: defaultEnvExamplePath,
    expectedVersion: ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--allow-dirty') {
      options.allowDirty = true;
    } else if (arg === '--expected-version') {
      options.expectedVersion = argv[index + 1] || '';
      index += 1;
    } else if (arg.startsWith('--expected-version=')) {
      options.expectedVersion = arg.slice('--expected-version='.length);
    } else if (arg === '--env-example') {
      options.envExamplePath = argv[index + 1] || defaultEnvExamplePath;
      index += 1;
    } else if (arg.startsWith('--env-example=')) {
      options.envExamplePath = arg.slice('--env-example='.length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  node tools/container-release-preflight.mjs --expected-version <full-git-sha>

Options:
  --expected-version <sha>     Full git SHA intended for APP_BUILD_VERSION.
  --env-example <path>         Env template to validate. Defaults to ${defaultEnvExamplePath}.
  --allow-dirty                Allow a dirty working tree for local iteration only.`);
}

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8'
  });

  assert(result.status === 0, `git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);

  return String(result.stdout || '').trim();
}

async function readText(relativePath) {
  return readFile(join(rootDir, relativePath), 'utf8');
}

async function assertFileExists(relativePath) {
  try {
    await access(join(rootDir, relativePath));
  } catch (error) {
    throw new Error(`missing required release file: ${relativePath}`);
  }
}

function parseEnvExample(text) {
  const values = new Map();

  text.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    values.set(
      trimmed.slice(0, separatorIndex).trim(),
      trimmed.slice(separatorIndex + 1).trim()
    );
  });

  return values;
}

function assertEnvExampleSafe(text, values, expectedVersion) {
  const requiredKeys = [
    'NODE_ENV',
    'HOST',
    'PORT',
    'APP_BUILD_VERSION',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  requiredKeys.forEach(key => {
    assert(values.has(key), `env example: missing ${key}`);
  });

  assert(values.get('NODE_ENV') === 'production', 'env example: NODE_ENV must be production');
  assert(values.get('HOST') === '0.0.0.0', 'env example: HOST must be 0.0.0.0');
  assert(values.get('PORT') === '8080', 'env example: PORT must be 8080');

  if (expectedVersion) {
    assert(
      values.get('APP_BUILD_VERSION') === '<full-git-sha>',
      'env example: keep APP_BUILD_VERSION as <full-git-sha>; do not commit a real release SHA'
    );
  }

  const suspiciousValues = [...values.entries()]
    .filter(([, value]) => value && !/^<[^>]+>$/.test(value))
    .filter(([, value]) => /(eyJ[a-zA-Z0-9_-]{20,}|sb_secret_|service[_-]?role)/i.test(value));

  assert(
    suspiciousValues.length === 0,
    `env example appears to contain a real secret in ${suspiciousValues.map(([key]) => key).join(', ')}`
  );
}

async function checkReleaseFiles() {
  const requiredFiles = [
    '.dockerignore',
    'Dockerfile',
    'package.json',
    'server/runtime.js',
    'server/server.mjs',
    'functions/env.js',
    'functions/app-assets/[version].js',
    'tools/deployed-runtime-smoke.mjs',
    'tools/docker-runtime-smoke.mjs',
    'tools/portable-runtime-smoke.mjs',
    'docs/YANDEX_STAGING_PLAN.md',
    'docs/DEPLOYMENT_INVENTORY.md'
  ];

  await Promise.all(requiredFiles.map(assertFileExists));
}

async function checkDockerBoundary() {
  const dockerfile = await readText('Dockerfile');
  const dockerignore = await readText('.dockerignore');

  [
    'FROM node:24-alpine',
    'ENV NODE_ENV=production',
    'ENV HOST=0.0.0.0',
    'ENV PORT=8080',
    'USER node',
    'EXPOSE 8080',
    'CMD ["node", "server/server.mjs"]'
  ].forEach(fragment => {
    assert(dockerfile.includes(fragment), `Dockerfile: missing "${fragment}"`);
  });

  [
    '.git',
    '.env',
    'node_modules',
    'docs',
    'src',
    'tools'
  ].forEach(fragment => {
    assert(dockerignore.includes(fragment), `.dockerignore: missing "${fragment}"`);
  });

  assert(!/yandex|yc |cloudflare pages/i.test(dockerfile), 'Dockerfile should stay provider-independent');
}

async function checkPackageScripts() {
  const packageJson = JSON.parse(await readText('package.json'));
  const scripts = packageJson.scripts || {};

  assert(scripts['smoke:portable'] === 'node tools/portable-runtime-smoke.mjs', 'package.json: missing smoke:portable');
  assert(scripts['smoke:docker:required'] === 'node tools/docker-runtime-smoke.mjs --require-docker', 'package.json: missing smoke:docker:required');
  assert(scripts['smoke:deployed'] === 'node tools/deployed-runtime-smoke.mjs', 'package.json: missing smoke:deployed');
  assert(scripts['release:container:preflight'] === 'node tools/container-release-preflight.mjs', 'package.json: missing release:container:preflight');
}

function checkGitState(options) {
  const currentSha = runGit(['rev-parse', 'HEAD']);
  const dirtyStatus = runGit(['status', '--porcelain', '--untracked-files=all']);

  if (!options.allowDirty) {
    assert(!dirtyStatus, 'working tree is dirty; commit/stash changes or pass --allow-dirty for local iteration only');
  }

  if (options.expectedVersion) {
    assert(
      options.expectedVersion === currentSha,
      `--expected-version must match HEAD (${currentSha}), got ${options.expectedVersion}`
    );
  }

  return currentSha;
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const currentSha = checkGitState(options);

await checkReleaseFiles();
await checkDockerBoundary();
await checkPackageScripts();

const envExampleText = await readText(options.envExamplePath);
const envValues = parseEnvExample(envExampleText);

assertEnvExampleSafe(envExampleText, envValues, options.expectedVersion);

console.log(`Container release preflight passed for ${currentSha}.`);
console.log(`Use APP_BUILD_VERSION=${currentSha} for the Serverless Container revision.`);
