import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const host = '127.0.0.1';
const port = 4181;

const jsFiles = [
  'boot-loader.js',
  'app-script-loader.js',
  'shared-layout.js',
  'custom-select.js',
  'app.js'
];

const routes = [
  { path: '/', expected: 'id="movies"', label: 'catalog' },
  { path: '/movie/test-movie', expected: 'id="moviePage"', label: 'movie detail' },
  { path: '/user/profile000', expected: 'id="userPage"', label: 'user profile' },
  { path: '/notifications', expected: 'id="notificationsPage"', label: 'notifications' },
  { path: '/following', expected: 'id="followingPage"', label: 'following' }
];

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkJavaScriptSyntax() {
  jsFiles.forEach(file => {
    const result = spawnSync(process.execPath, ['--check', file], {
      cwd: rootDir,
      encoding: 'utf8'
    });

    assert(
      result.status === 0,
      `${file}: syntax check failed\n${result.stderr || result.stdout}`
    );
  });
}

function getSpaFallbackPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') {
    return 'index.html';
  }

  if (pathname === '/movie.html' || pathname.startsWith('/movie/')) {
    return 'movie.html';
  }

  if (pathname === '/user.html' || pathname.startsWith('/user/')) {
    return 'user.html';
  }

  if (pathname === '/notifications' || pathname === '/notifications.html') {
    return 'notifications.html';
  }

  if (pathname === '/following' || pathname === '/following.html') {
    return 'following.html';
  }

  return pathname.replace(/^\/+/, '') || 'index.html';
}

async function readStaticFile(pathname) {
  const relativePath = normalize(getSpaFallbackPath(pathname)).replace(/^(\.\.[/\\])+/, '');
  const absolutePath = join(rootDir, relativePath);

  return {
    body: await readFile(absolutePath),
    contentType: contentTypes[extname(absolutePath)] || 'application/octet-stream'
  };
}

function createSmokeServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', `http://${host}:${port}`);
      const file = await readStaticFile(url.pathname);

      response.writeHead(200, { 'content-type': file.contentType });
      response.end(file.body);
    } catch (error) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(String(error?.message || error));
    }
  });
}

async function fetchText(path) {
  const response = await fetch(`http://${host}:${port}${path}`);

  assert(response.ok, `${path}: expected 200, got ${response.status}`);
  return response.text();
}

async function checkRoutes() {
  const server = createSmokeServer();

  await new Promise(resolve => server.listen(port, host, resolve));

  try {
    for (const route of routes) {
      const html = await fetchText(route.path);

      assert(
        html.includes(route.expected),
        `${route.label}: missing ${route.expected}`
      );
      assert(
        html.includes('boot-loader.js') && html.includes('app-script-loader.js'),
        `${route.label}: boot scripts are missing`
      );
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

checkJavaScriptSyntax();
await checkRoutes();

console.log('Smoke check passed.');
