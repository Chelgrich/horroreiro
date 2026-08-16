import { fetchNoStoreAsset } from '../_response-utils.js';

const ALLOWED_APP_ASSETS = new Set([
  'app.js',
  'app-page-runtime.js',
  'admin-actions.js',
  'assets/directors-admin-app.js',
  'custom-select.js',
  'director-page.js',
  'director-form.css',
  'director-page.css',
  'directors-admin-page.css',
  'editor-page.js',
  'editor-page.css',
  'following-page.js',
  'following-page.css',
  'letterboxd-import.js',
  'movie-editor.js',
  'movie-detail-cache.js',
  'movie-page-interactions.js',
  'movie-page-similar.js',
  'movie-page-shell.js',
  'movie-social.js',
  'notifications-page.js',
  'notifications-page.css',
  'movie-page.css',
  'person-placeholders.js',
  'secondary-pages.css',
  'shared-layout.js',
  'styles.css',
  'user-page.js'
]);

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const filename = String(url.searchParams.get('file') || '').trim();

  if (!ALLOWED_APP_ASSETS.has(filename)) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }

  return fetchNoStoreAsset(env, request, `/${filename}`);
}
