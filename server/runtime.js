import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { onRequest as envOnRequest } from '../functions/env.js';
import { onRequestGet as appAssetsOnRequestGet } from '../functions/app-assets/[version].js';
import { onRequestPost as adminPasswordOnRequestPost } from '../functions/admin/users/[userId]/password.js';
import { onRequestGet as companyHtmlOnRequestGet } from '../functions/company.html.js';
import { onRequestGet as companySlugOnRequestGet } from '../functions/company/[slug].js';
import { onRequestGet as directorsHtmlOnRequestGet } from '../functions/directors.html.js';
import { onRequestGet as directorsOnRequestGet } from '../functions/directors.js';
import { onRequestGet as distributorsHtmlOnRequestGet } from '../functions/distributors.html.js';
import { onRequestGet as distributorsOnRequestGet } from '../functions/distributors.js';
import { onRequestGet as editorHtmlOnRequestGet } from '../functions/editor.html.js';
import { onRequestGet as editorOnRequestGet } from '../functions/editor.js';
import { onRequestGet as followingHtmlOnRequestGet } from '../functions/following.html.js';
import { onRequestGet as followingOnRequestGet } from '../functions/following.js';
import { onRequestGet as indexHtmlOnRequestGet } from '../functions/index.html.js';
import { onRequestGet as indexOnRequestGet } from '../functions/index.js';
import { onRequestGet as movieHtmlOnRequestGet } from '../functions/movie.html.js';
import { onRequestGet as movieSlugOnRequestGet } from '../functions/movie/[slug].js';
import { onRequestGet as nameHtmlOnRequestGet } from '../functions/name.html.js';
import { onRequestGet as nameSlugOnRequestGet } from '../functions/name/[slug].js';
import { onRequestGet as notificationsHtmlOnRequestGet } from '../functions/notifications.html.js';
import { onRequestGet as notificationsOnRequestGet } from '../functions/notifications.js';
import { onRequestGet as productionHtmlOnRequestGet } from '../functions/production.html.js';
import { onRequestGet as productionOnRequestGet } from '../functions/production.js';
import { onRequestGet as profileActivityRanksOnRequestGet } from '../functions/profile-activity-ranks/[userId].js';
import { onRequestGet as russianDistributorsHtmlOnRequestGet } from '../functions/russian-distributors.html.js';
import { onRequestGet as russianDistributorsOnRequestGet } from '../functions/russian-distributors.js';
import { onRequestGet as sitemapOnRequestGet } from '../functions/sitemap.xml.js';
import { onRequestGet as userHtmlOnRequestGet } from '../functions/user.html.js';
import { onRequestGet as userHandleOnRequestGet } from '../functions/user/[handle].js';

const defaultRootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

const revalidatedStaticAssets = new Set([
  '/admin-actions.js',
  '/app-page-runtime.js',
  '/app-script-loader.js',
  '/app.js',
  '/assets/directors-admin-app.js',
  '/boot-loader.js',
  '/catalog-cards.js',
  '/catalog-filters.js',
  '/catalog-page.css',
  '/catalog-pagination.js',
  '/catalog-presets.js',
  '/catalog-render.js',
  '/catalog-return-cache.js',
  '/catalog-url-state.js',
  '/catalog-warm-start.js',
  '/company-page.css',
  '/company-pages.js',
  '/custom-select.js',
  '/director-form.css',
  '/director-page.css',
  '/director-page.js',
  '/directors-admin-page.css',
  '/editor-page.css',
  '/editor-page.js',
  '/following-page.css',
  '/following-page.js',
  '/letterboxd-import.js',
  '/movie-detail-cache.js',
  '/movie-editor.css',
  '/movie-editor.js',
  '/movie-page-interactions.js',
  '/movie-page-orchestrator.js',
  '/movie-page-shell.js',
  '/movie-page-similar.js',
  '/movie-page.css',
  '/movie-social.js',
  '/movie-user-state.js',
  '/movie-warm-start.js',
  '/notifications-page.css',
  '/notifications-page.js',
  '/page-warm-start.js',
  '/person-placeholders.js',
  '/profile-data-actions.js',
  '/profile-follow-actions.js',
  '/profile-settings-actions.js',
  '/profile-utils.js',
  '/secondary-pages.css',
  '/shared-layout.js',
  '/styles.css',
  '/user-page.css',
  '/user-page.js'
]);

const exactGetRoutes = new Map([
  ['/', indexOnRequestGet],
  ['/index.html', indexHtmlOnRequestGet],
  ['/company.html', companyHtmlOnRequestGet],
  ['/directors', directorsOnRequestGet],
  ['/directors.html', directorsHtmlOnRequestGet],
  ['/distributors', distributorsOnRequestGet],
  ['/distributors.html', distributorsHtmlOnRequestGet],
  ['/editor', editorOnRequestGet],
  ['/editor.html', editorHtmlOnRequestGet],
  ['/following', followingOnRequestGet],
  ['/following.html', followingHtmlOnRequestGet],
  ['/movie.html', movieHtmlOnRequestGet],
  ['/name.html', nameHtmlOnRequestGet],
  ['/notifications', notificationsOnRequestGet],
  ['/notifications.html', notificationsHtmlOnRequestGet],
  ['/production', productionOnRequestGet],
  ['/production.html', productionHtmlOnRequestGet],
  ['/russian-distributors', russianDistributorsOnRequestGet],
  ['/russian-distributors.html', russianDistributorsHtmlOnRequestGet],
  ['/sitemap.xml', sitemapOnRequestGet],
  ['/user.html', userHtmlOnRequestGet]
]);

function normalizeAssetPathname(pathname) {
  const assetPath = pathname === '/' ? '/index.html' : pathname;
  const relativePath = decodeURIComponent(assetPath.replace(/^\/+/, ''));

  return relativePath || 'index.html';
}

function isPathInsideRoot(rootDir, filePath) {
  const rootPrefix = rootDir.endsWith(sep) ? rootDir : `${rootDir}${sep}`;

  return filePath === rootDir || filePath.startsWith(rootPrefix);
}

function getCacheControlForStaticPath(pathname) {
  if (pathname.endsWith('.html') || pathname === '/') {
    return 'no-store, no-cache, must-revalidate, max-age=0';
  }

  if (
    pathname.startsWith('/icons/') ||
    pathname === '/favicon.ico' ||
    pathname === '/insidious.webp' ||
    pathname === '/og-preview.jpg'
  ) {
    return 'public, max-age=31536000, immutable';
  }

  if (revalidatedStaticAssets.has(pathname)) {
    return 'public, max-age=0, must-revalidate';
  }

  return 'public, max-age=0, must-revalidate';
}

function createStaticAssetFetcher(rootDir) {
  return async input => {
    const request = input instanceof Request ? input : new Request(input);
    const { pathname } = new URL(request.url);
    const relativePath = normalizeAssetPathname(pathname);
    const filePath = resolve(rootDir, relativePath);

    if (!isPathInsideRoot(rootDir, filePath)) {
      return new Response('Not found', {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    try {
      const fileStats = await stat(filePath);

      if (!fileStats.isFile()) {
        throw Object.assign(new Error('Not a file'), { code: 'ENOENT' });
      }

      const file = await readFile(filePath);
      const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';

      return new Response(file, {
        headers: {
          'Cache-Control': getCacheControlForStaticPath(pathname),
          'Content-Type': contentType
        }
      });
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        console.error('Portable runtime static asset failed:', error);
      }

      return new Response('Not found', {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }
  };
}

function getBuildVersion(env) {
  return (
    env.CF_PAGES_COMMIT_SHA ||
    env.APP_BUILD_VERSION ||
    env.COMMIT_REF ||
    env.GIT_COMMIT ||
    'dev'
  );
}

function methodNotAllowed(allow = 'GET') {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: allow,
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

function getSingleSegmentParam(pathname, prefix) {
  if (!pathname.startsWith(prefix)) {
    return '';
  }

  const value = pathname.slice(prefix.length);

  if (!value || value.includes('/')) {
    return '';
  }

  return decodeURIComponent(value);
}

function getAdminPasswordUserId(pathname) {
  const match = pathname.match(/^\/admin\/users\/([^/]+)\/password$/);

  return match ? decodeURIComponent(match[1]) : '';
}

export function createPortableRuntime(options = {}) {
  const rootDir = resolve(options.rootDir || defaultRootDir);
  const baseEnv = {
    ...process.env,
    ...(options.env || {})
  };
  const buildVersion = getBuildVersion(baseEnv);
  const env = {
    ...baseEnv,
    APP_BUILD_VERSION: baseEnv.APP_BUILD_VERSION || buildVersion,
    ASSETS: {
      fetch: createStaticAssetFetcher(rootDir)
    },
    CF_PAGES_COMMIT_SHA: baseEnv.CF_PAGES_COMMIT_SHA || buildVersion
  };

  function createContext(request, params = {}) {
    return {
      env,
      params,
      request
    };
  }

  async function invokeGetHandler(handler, request, params = {}) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return methodNotAllowed('GET, HEAD');
    }

    return handler(createContext(request, params));
  }

  async function handleRequest(request) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/env') {
      return envOnRequest(createContext(request));
    }

    if (pathname.startsWith('/app-assets/')) {
      return invokeGetHandler(appAssetsOnRequestGet, request, {
        version: getSingleSegmentParam(pathname, '/app-assets/')
      });
    }

    const adminPasswordUserId = getAdminPasswordUserId(pathname);
    if (adminPasswordUserId) {
      if (request.method !== 'POST') {
        return methodNotAllowed('POST');
      }

      return adminPasswordOnRequestPost(createContext(request, {
        userId: adminPasswordUserId
      }));
    }

    const profileActivityRanksUserId = getSingleSegmentParam(pathname, '/profile-activity-ranks/');
    if (profileActivityRanksUserId) {
      return invokeGetHandler(profileActivityRanksOnRequestGet, request, {
        userId: profileActivityRanksUserId
      });
    }

    const movieSlug = getSingleSegmentParam(pathname, '/movie/');
    if (movieSlug) {
      return invokeGetHandler(movieSlugOnRequestGet, request, {
        slug: movieSlug
      });
    }

    const userHandle = getSingleSegmentParam(pathname, '/user/');
    if (userHandle) {
      return invokeGetHandler(userHandleOnRequestGet, request, {
        handle: userHandle
      });
    }

    const nameSlug = getSingleSegmentParam(pathname, '/name/');
    if (nameSlug) {
      return invokeGetHandler(nameSlugOnRequestGet, request, {
        slug: nameSlug
      });
    }

    const companySlug = getSingleSegmentParam(pathname, '/company/');
    if (companySlug) {
      return invokeGetHandler(companySlugOnRequestGet, request, {
        slug: companySlug
      });
    }

    const exactHandler = exactGetRoutes.get(pathname);
    if (exactHandler) {
      return invokeGetHandler(exactHandler, request);
    }

    if (['GET', 'HEAD'].includes(request.method)) {
      return env.ASSETS.fetch(request);
    }

    return methodNotAllowed('GET, HEAD');
  }

  return {
    env,
    handleRequest,
    rootDir
  };
}

export async function createRequestFromNodeMessage(nodeRequest) {
  const protocol = nodeRequest.headers['x-forwarded-proto'] || 'http';
  const host = nodeRequest.headers.host || '127.0.0.1';
  const requestUrl = new URL(nodeRequest.url || '/', `${protocol}://${host}`);
  const headers = new Headers();

  Object.entries(nodeRequest.headers || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => headers.append(key, item));
    } else if (value !== undefined) {
      headers.set(key, String(value));
    }
  });

  const method = nodeRequest.method || 'GET';
  const init = {
    headers,
    method
  };

  if (method !== 'GET' && method !== 'HEAD') {
    const chunks = [];

    for await (const chunk of nodeRequest) {
      chunks.push(Buffer.from(chunk));
    }

    const body = Buffer.concat(chunks);

    if (body.length) {
      init.body = body;
    }
  }

  return new Request(requestUrl.toString(), init);
}

export async function writeResponseToNodeMessage(nodeResponse, response, options = {}) {
  const headers = {};

  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  nodeResponse.writeHead(response.status, response.statusText, headers);

  if (options.head) {
    nodeResponse.end();
    return;
  }

  const body = Buffer.from(await response.arrayBuffer());
  nodeResponse.end(body);
}
