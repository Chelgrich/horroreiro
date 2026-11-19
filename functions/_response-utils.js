export function cloneNoStoreResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export function addAppBuildHint(html, env) {
  const build = env.CF_PAGES_COMMIT_SHA || env.APP_BUILD_VERSION || '';
  if (!/^[a-zA-Z0-9._-]+$/.test(build)) return html;
  return html.replace('<head>', `<head>\n  <meta name="app-build-version" content="${build}">`);
}

export async function fetchNoStoreAsset(env, request, pathname) {
  const response = await env.ASSETS.fetch(new URL(pathname, request.url).toString());

  if (response.ok && pathname.endsWith('.html')) {
    const headers = new Headers(response.headers);
    headers.delete('Content-Length');
    headers.delete('Content-Encoding');
    headers.delete('ETag');
    return cloneNoStoreResponse(new Response(addAppBuildHint(await response.text(), env), {
      status: response.status,
      headers
    }));
  }

  return cloneNoStoreResponse(response);
}
