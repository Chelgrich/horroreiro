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
