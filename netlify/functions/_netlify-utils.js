import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

function getRequestUrl(event, options = {}) {
  const host = event.headers?.host || 'localhost';
  const protocol = event.headers?.['x-forwarded-proto'] || 'https';
  const rawUrl = event.rawUrl || `${protocol}://${host}${event.path || '/'}`;
  const url = new URL(rawUrl);

  if (options.pathname) {
    url.pathname = options.pathname;
  }

  if (options.search !== undefined) {
    url.search = options.search;
  }

  return url.toString();
}

function createRequest(event, options = {}) {
  const method = event.httpMethod || 'GET';
  const headers = new Headers();

  Object.entries(event.headers || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      headers.set(key, String(value));
    }
  });

  const init = {
    headers,
    method
  };

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64')
      : (event.body || '');
  }

  return new Request(getRequestUrl(event, options), init);
}

function getBuildVersion() {
  return (
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.COMMIT_REF ||
    process.env.APP_BUILD_VERSION ||
    process.env.DEPLOY_ID ||
    'dev'
  );
}

async function fetchAsset(url) {
  const pathname = new URL(url).pathname;
  const assetName = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.replace(/^\/+/, ''));
  const filePath = resolve(projectRoot, assetName);
  const rootPrefix = projectRoot.endsWith(sep) ? projectRoot : `${projectRoot}${sep}`;

  if (filePath !== projectRoot && !filePath.startsWith(rootPrefix)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';

    return new Response(file, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Type': contentType
      }
    });
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error('Netlify asset fetch failed:', error);
    }
    return new Response('Not found', { status: 404 });
  }
}

export function createCloudflareLikeContext(event, options = {}) {
  const buildVersion = getBuildVersion();

  return {
    env: {
      ...process.env,
      APP_BUILD_VERSION: process.env.APP_BUILD_VERSION || buildVersion,
      ASSETS: {
        fetch: fetchAsset
      },
      CF_PAGES_COMMIT_SHA: buildVersion
    },
    params: options.params || {},
    request: createRequest(event, options.request || {})
  };
}

export function getQueryParam(event, key) {
  return event.queryStringParameters?.[key] || '';
}

export async function toNetlifyResponse(response) {
  const headers = {};

  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const bodyBuffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || '';
  const isTextBody = /(?:text|json|javascript|xml|html|css|svg)/i.test(contentType);

  return {
    body: isTextBody ? bodyBuffer.toString('utf8') : bodyBuffer.toString('base64'),
    headers,
    isBase64Encoded: !isTextBody,
    statusCode: response.status
  };
}

export function methodNotAllowed() {
  return {
    body: 'Method Not Allowed',
    headers: {
      Allow: 'GET',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8'
    },
    statusCode: 405
  };
}
