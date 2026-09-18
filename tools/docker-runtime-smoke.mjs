import { spawnSync } from 'node:child_process';
import { createServer } from 'node:net';

const imageTag = 'horroreiro-portable-smoke:latest';
const containerName = `horroreiro-portable-smoke-${Date.now()}`;
const requireDocker = process.argv.includes('--require-docker');

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    ...options
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getFreePort() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer();

    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      server.close(() => {
        resolvePromise(port);
      });
    });
  });
}

async function waitForText(url, expectedText, label) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < 15000) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      if (response.ok && text.includes(expectedText)) {
        return {
          response,
          text
        };
      }

      lastError = new Error(`${label}: got ${response.status}, missing expected text`);
    } catch (error) {
      lastError = error;
    }

    await new Promise(resolvePromise => setTimeout(resolvePromise, 300));
  }

  throw lastError || new Error(`${label}: timed out`);
}

const dockerVersion = run('docker', ['--version']);

if (dockerVersion.status !== 0) {
  const message = 'Docker is not available; skipping Docker runtime smoke.';

  if (requireDocker) {
    throw new Error(message);
  }

  console.log(message);
  process.exit(0);
}

const port = await getFreePort();
const build = run('docker', ['build', '-t', imageTag, '.'], {
  stdio: 'inherit'
});

assert(build.status === 0, 'docker build failed');

let started = false;

try {
  const runContainer = run('docker', [
    'run',
    '--rm',
    '-d',
    '--name',
    containerName,
    '-p',
    `127.0.0.1:${port}:8080`,
    '-e',
    'APP_BUILD_VERSION=docker-smoke',
    '-e',
    'SUPABASE_URL=',
    '-e',
    'SUPABASE_ANON_KEY=',
    '-e',
    'SUPABASE_SERVICE_ROLE_KEY=',
    imageTag
  ]);

  assert(
    runContainer.status === 0,
    `docker run failed\n${runContainer.stderr || runContainer.stdout}`
  );

  started = true;

  await waitForText(`http://127.0.0.1:${port}/env`, 'docker-smoke', '/env');
  await waitForText(`http://127.0.0.1:${port}/`, 'id="movies"', 'catalog');
  await waitForText(
    `http://127.0.0.1:${port}/app-assets/docker-smoke?file=app.js`,
    'initCatalogPage',
    'app asset'
  );
  await waitForText(`http://127.0.0.1:${port}/sitemap.xml`, '<urlset', 'sitemap');

  console.log('Docker runtime smoke passed.');
} finally {
  if (started) {
    run('docker', ['rm', '-f', containerName]);
  }
}
