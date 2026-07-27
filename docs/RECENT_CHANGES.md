# Recent Changes

Keep this file current. Add a short entry after each behavior, architecture, data, routing, dependency, or important UI change.

Format:

```text
## YYYY-MM-DD - short title
- Files:
- Summary:
- Checks:
- Follow-up:
```

## 2026-07-28 - Cache repeated profile and movie lookups

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added an in-memory movie row cache keyed by select payload for repeated `movies by ids` queries used by profile rails, notifications, and related previews.
  - Added a public profile handle cache on top of the existing public profile id cache.
  - Clear movie row caches on local mutations so edited cards do not keep stale payloads.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - Keep larger movie social splitting as a separate high-risk contour.

## 2026-07-28 - Tighten payloads and director thumbnails

- Files:
  - `app.js`
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Removed detail-only `tmdb_url` from the catalog movie payload and aligned catalog external-link detection with the visible aggregator buttons.
  - Replaced `notification_events (*)` with an explicit notification event select.
  - Added a session-level public profile cache and reused it for movie reviews/comments, notifications, and followed profiles.
  - Switched `/directors` admin avatars from original photos to 48px-oriented Supabase transformed thumbnails with original-image fallback.
  - Added smoke guards for the catalog TMDB payload and notification event wildcard select.
- Checks:
  - `npm run build:directors`
  - `node --check app.js`
  - `node --check assets\directors-admin-app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
- Follow-up:
  - Continue with larger social/detail splitting only after keeping route-level behavior stable.

## 2026-07-28 - Lazy-load following page

- Files:
  - `app.js`
  - `following-page.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `README.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/following` rendering, data loading, notification preference toggles, unfollow actions, and page-local events into lazy-loaded `following-page.js`.
  - Kept shared auth/profile/Supabase context in `app.js`, reducing startup payload for catalog, movie, profile, notifications, editor, and person pages.
  - Added cache header, app-assets allowlist, size reporting, and smoke-check coverage for the new lazy module.
- Checks:
  - `node --check app.js`
  - `node --check following-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
- Follow-up:
  - Continue route-by-route JS splitting after this first low-risk slice.

## 2026-07-27 - Combine font stylesheet requests

- Files:
  - `index.html`
  - `movie.html`
  - `user.html`
  - `following.html`
  - `notifications.html`
  - `editor.html`
  - `name.html`
  - `directors.html`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Replaced the two Google Fonts stylesheet requests with one combined request for `PT Sans` and `Unbounded` across all page shells.
  - Added a smoke-check guard to keep future HTML shells on the combined font stylesheet path.
- Checks:
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `rg -n "fonts.googleapis.com/css2" -g "*.html"`
- Follow-up:
  - None.

## 2026-07-26 - Lazy-load movie modal custom selects

- Files:
  - `app.js`
  - `app-script-loader.js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `README.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Stopped loading `custom-select.js` upfront on movie detail pages; it remains an upfront dependency for catalog filters.
  - Added on-demand classic-script loading before the movie add/edit modal opens, preserving custom select behavior for admin editing.
  - Updated startup size reporting and smoke-check guards so movie startup stays free of `custom-select.js`.
- Checks:
  - `node --check app.js`
  - `node --check app-script-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
- Follow-up:
  - None.

## 2026-07-26 - Split secondary page styles

- Files:
  - `styles.css`
  - `secondary-pages.css`
  - `boot-loader.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `README.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved secondary page-only CSS for following, notifications, editor, public person pages, and directors admin into `secondary-pages.css`.
  - Updated the boot loader to load `secondary-pages.css` only on those page types, leaving catalog/profile/movie startup with a smaller global stylesheet.
  - Added asset proxy, cache header, size report, and smoke-check coverage for the new stylesheet.
- Checks:
  - `node --check app.js`
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - CSS brace check for `styles.css`, `movie-page.css`, and `secondary-pages.css`.
- Follow-up:
  - None.

## 2026-07-26 - Fix movie detail stylesheet bootstrap

- Files:
  - `boot-loader.js`
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Fixed page detection in `boot-loader.js` so `movie-page.css` is selected from the current URL before `<body data-app-page>` exists.
  - Changed person photo transforms to request explicit 2:3 image dimensions from Supabase render URLs.
  - Added a smoke-check guard for movie-page stylesheet bootstrap.
- Checks:
  - `node --check app.js`
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - Boot-loader route mock: catalog loads only `styles.css`, movie routes load `styles.css` and `movie-page.css`.
- Follow-up:
  - None.

## 2026-07-26 - Split movie styles and defer detail work

- Files:
  - `app.js`
  - `boot-loader.js`
  - `styles.css`
  - `movie-page.css`
  - `person-placeholders.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Split movie detail-only CSS into `movie-page.css` and load it only for movie detail shells before app startup.
  - Moved large person placeholder SVG silhouettes into lazy-loaded `person-placeholders.js`.
  - Changed movie detail loading so the primary movie section can render before reviews, comments, and similar movies finish loading.
  - Added catalog DOM render signatures to skip identical card-grid rebuilds.
  - Switched movie review/comment interactions to delegated section handlers and removed the old per-element binding helpers.
  - Optimized person detail photos through Supabase image render URLs with original-image fallback.
  - Removed an obsolete trigger-filter option from catalog filter state.
- Checks:
  - `node --check app.js`
  - `node --check person-placeholders.js`
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-25 - Optimize admin actions and cleanup checks

- Files:
  - `app.js`
  - `admin-actions.js`
  - `styles.css`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved heavy downloadable admin action builders for audits and database export into lazy-loaded `admin-actions.js`.
  - Added the lazy admin module to versioned asset serving, cache headers, syntax checks, and size reporting while keeping it out of startup profiles.
  - Switched editor/completeness audit movie loading to a lean completeness-only Supabase select; full movie rows remain for database export.
  - Consolidated duplicated review/comment like CSS and added a smoke-check guard against dated one-time root artifacts.
  - Removed stale untracked root JSON artifacts from previous enrichment/export runs.
- Checks:
  - `node --check app.js`
  - `node --check admin-actions.js`
  - `node --check shared-layout.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-16 - Add intentional empty movie field marker

- Files:
  - `app.js`
  - `functions/_seo-utils.js`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `Не применимо` as a service marker for movie fields that are intentionally empty.
  - Completeness contours treat the marker as filled, while public movie details, aggregator links, trailer embeds, and SEO fallback output hide it.
  - Movie edit forms preserve the marker so it remains visible to admins.
- Checks:
  - `node --check app.js`
  - `node --check functions\_seo-utils.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-16 - Update editor completeness contours

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added editor completeness contours for empty distribution and empty Russian distribution fields.
  - Removed runtime and missing similar movies from the editor completeness grid and TXT completeness audit.
  - Made editor summary counters and the priority list count every remaining completeness contour.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-13 - Add movie data enrichment guide

- Files:
  - `AGENTS.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/MOVIE_DATA_ENRICHMENT_GUIDE.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a dedicated guide for verifying and filling movie year, additional genres, countries, production, distribution, and Russian distribution.
  - Linked the guide from the project context read order and data model notes so future enrichment work uses the stricter source/quality rules.
  - Clarified that `Ужасы` must not be written to additional genres and non-horror candidates should be reported in a separate manual-review list.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-12 - Handle deceased people on person pages

- Files:
  - `app.js`
  - `styles.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Person page age calculation now explicitly uses death date as the age reference when `death_date` is filled.
  - Person photos and photo placeholders become grayscale via CSS when a death date is present.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-12 - Keep editor issue cards natural height

- Files:
  - `styles.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Prevented editor center issue cards from stretching to match the tallest card in the same grid row.
  - Empty or short issue blocks now keep their natural height while the grid layout stays intact.
- Checks:
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-12 - Exclude missing similar links from editor summary

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Kept the editor center "Без похожих" issue block visible as a working checklist.
  - Excluded missing manual similar links from the top editor summary counters.
  - Excluded missing manual similar links from the "Приоритет на проверку" list and its ordering.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-11 - Align rating widget hover states

- Files:
  - `styles.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Made detail-page rating widgets use the same hover, focus-visible, and active motion as external aggregator icon links.
- Checks:
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-11 - Limit TMDB movie link to detail page

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
- Summary:
  - Added build-version cache busting to local aggregator SVG icon URLs so replaced immutable icons update after deploy.
  - Removed TMDB from catalog movie-card aggregator links.
  - Normalized detail-page aggregator order to Kinopoisk, IMDb, Letterboxd, Rotten Tomatoes, TMDB.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-11 - Add TMDB movie aggregator link

- Files:
  - `app.js`
  - `shared-layout.js`
  - `functions/_seo-utils.js`
  - `icons/tmdb.svg`
  - `docs/DATA_MODEL.md`
- Summary:
  - Added editable movie `tmdb_url` support as an optional Supabase column.
  - Added TMDB to movie detail external aggregator links and movie SEO `sameAs`.
  - Added TMDB as the third field in the second external-links row; trailer moves to the next row.
- Checks:
  - `node --check app.js`
  - `node --check shared-layout.js`
  - `node --check functions\_seo-utils.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - Apply `alter table public.movies add column if not exists tmdb_url text;` in Supabase before entering TMDB links.

## 2026-07-11 - Add persistent Codex context docs

- Files:
  - `AGENTS.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
  - `tools/smoke-check.mjs`
- Summary:
  - Added a repository-local context system so Codex can quickly recover architecture/project context after conversation compaction.
  - Added a smoke-check guard that requires `docs/RECENT_CHANGES.md` to be updated when key source files are dirty.
- Checks:
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - Keep this journal updated after future file edits.

## 2026-07-10 - Serve core app assets through versioned Function

- Files:
  - `boot-loader.js`
  - `app-script-loader.js`
  - `app.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `_routes.json`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-baseline.json`
- Summary:
  - Fixed production cache mismatch where `/env` and HTML were fresh but `app.js/styles.css/shared-layout.js` could remain stale behind Cloudflare cache.
  - Production now loads core JS/CSS and lazy feature modules through `/app-assets/<APP_BUILD_VERSION>?file=<asset>`.
  - Core app assets are no-store/revalidate instead of immutable.
  - Pushed to both `dev` and `main` because `horroreiro.ru` follows `main`.
- Checks:
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Production checks for `/env`, `/directors`, `/app-assets/...`, account menu visibility, and director links.
- Follow-up:
  - Do not restore immutable caching on core app assets unless filenames become content-hashed.

## 2026-07-10 - Hide admin menu items from regular users

- Files:
  - `shared-layout.js`
  - `styles.css`
- Summary:
  - Marked editor/audit/export/test menu items as admin-only.
  - Added explicit CSS hiding for `.auth-popover-item[hidden]` because the base item style uses `display: flex`.
- Checks:
  - `node --check shared-layout.js`
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - Browser check for non-admin hidden menu state.
- Follow-up:
  - Admin-only visibility should be tested with both `hidden` and computed `display`.

## 2026-07-10 - Render `/directors` admin with Preact island

- Files:
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `vite.config.mjs`
  - `package.json`
  - `package-lock.json`
  - `app.js`
  - `_headers`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `README.md`
- Summary:
  - Added the first Preact/Vite island for `/directors`.
  - Moved admin directors list rendering/filter UI out of string-heavy `app.js`; legacy app still supplies data, auth state, utilities, and edit actions.
  - Added `npm run build:directors`; generated bundle is committed.
- Checks:
  - `npm run build:directors`
  - `node --check app.js`
  - `node --check assets/directors-admin-app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - local browser check for `/directors.html` auth state.
- Follow-up:
  - Any edit to `src/directors-admin-app.jsx` requires rebuilding `assets/directors-admin-app.js`.
