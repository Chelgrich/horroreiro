// Explicit publish inventory shared by both hosts and verification tools.
const supabaseBrowserSdk = 'assets/vendor/supabase-2.119.0.js';
export const clientJsAssets = [
  "boot-loader.js",
  "app-script-loader.js",
  supabaseBrowserSdk,
  "shared-layout.js",
  "custom-select.js",
  "app-page-runtime.js",
  "app.js",
  "auth-session-controller.js",
  "admin-actions.js",
  "catalog-cards.js",
  "catalog-filters.js",
  "catalog-pagination.js",
  "catalog-presets.js",
  "catalog-render.js",
  "catalog-return-cache.js",
  "catalog-warm-start.js",
  "catalog-url-state.js",
  "company-pages.js",
  "director-page.js",
  "editor-page.js",
  "following-page.js",
  "letterboxd-import.js",
  "movie-editor.js",
  "movie-detail-cache.js",
  "movie-page-interactions.js",
  "movie-page-orchestrator.js",
  "movie-page-similar.js",
  "movie-page-shell.js",
  "movie-social.js",
  "movie-warm-start.js",
  "movie-user-state.js",
  "notifications-page.js",
  "page-warm-start.js",
  "person-placeholders.js",
  "profile-data-actions.js",
  "profile-follow-actions.js",
  "profile-settings-actions.js",
  "profile-settings-controller.js",
  "profile-utils.js",
  "user-page.js",
  "assets/directors-admin-app.js"
];

export const clientCssAssets = [
  "styles.css",
  "catalog-page.css",
  "movie-editor.css",
  "movie-page.css",
  "user-page.css",
  "secondary-pages.css",
  "following-page.css",
  "notifications-page.css",
  "editor-page.css",
  "company-page.css",
  "director-page.css",
  "directors-admin-page.css",
  "director-form.css"
];

export const clientHtmlAssets = [
  "index.html",
  "movie.html",
  "user.html",
  "following.html",
  "notifications.html",
  "editor.html",
  "companies.html",
  "company.html",
  "name.html",
  "directors.html"
];

export const immutableClientAssets = new Set([supabaseBrowserSdk]);

export const versionedClientAssets = [...clientJsAssets, ...clientCssAssets].filter(file =>
  !['boot-loader.js', 'app-script-loader.js'].includes(file) && !immutableClientAssets.has(file)
);

export function getClientAssetCacheControl(file) {
  return immutableClientAssets.has(file)
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';
}
