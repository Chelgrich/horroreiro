# Horroreiro Architecture Context

Last updated: 2026-08-20.

## Purpose

Horroreiro is a dark-mode horror movie catalog with user ratings, watchlists, reviews, comments, profile pages, notifications, manual similar movies, and person/director pages. It is deployed on Cloudflare Pages with Supabase as backend.

## Read Order For New Work

1. `AGENTS.md`
2. `docs/CODEX_CONTEXT.md`
3. `docs/RECENT_CHANGES.md`
4. `docs/DATA_MODEL.md`
5. Exact source files for the requested feature.

## Local Workflow Traps

- PowerShell output can show UTF-8 Russian text from `app.js`/docs as mojibake even when the files are valid. Do not retype long Russian strings from garbled terminal output; use `node -e "fs.readFileSync(..., 'utf8')"` for exact text checks or move existing source blocks mechanically.
- Prefer `apply_patch` for edits. For long diagnostic snippets, keep shell commands small or split them into separate `multi_tool_use.parallel` calls instead of relying on large pasted multiline commands.
- Paths containing square brackets are globbed by PowerShell. Use `Get-Content -LiteralPath functions\app-assets\[version].js` and quote the path for Node checks, for example `node --check "functions/app-assets/[version].js"`.
- Do not pass bare `*.js` path globs to `rg` in PowerShell. Use exact files or `rg "pattern" -g "*.js"` to avoid path syntax errors.
- Do not chain PowerShell commands with `&&`; this shell can reject it as an invalid statement separator. Run `git add`, `git commit`, and similar steps as separate tool calls.
- When a browser-console command is needed for the user, prefer a compact single-line IIFE or clear snippet instructions; if clipboard/browser focus blocks access, switch to a textarea/manual-paste path instead of retrying the same command.

## Branches And Deploy

- Active working branch: `dev`.
- Production branch for `horroreiro.ru`: `main`.
- Recent production cache incident showed that `/env` can point to the current commit while old static assets are still served if assets are cached too aggressively. Core app assets now go through `/app-assets/<commit>?file=...` and are returned with `no-store`.
- If the user reports a production-only issue, verify:
  - `https://horroreiro.ru/env`
  - whether prod `APP_BUILD_VERSION` matches the intended commit;
  - whether assets load through `/app-assets/<commit>?file=...`;
  - whether `main` has the fix, not only `dev`.

## Runtime Bootstrap

Page HTML is static shell plus shared scripts:

- `boot-loader.js`
  - loads `/env`;
  - creates `window.__ENV__`;
  - loads versioned `styles.css`;
  - loads page-specific CSS such as `movie-page.css`, shared `secondary-pages.css`, and secondary page-only CSS before app startup when the current shell needs it;
  - marks `app-styles-ready` or `app-load-failed`.
- `app-script-loader.js`
  - waits for `window.__ENV_READY__`;
  - loads `shared-layout.js`;
  - mounts shared header, auth modal, display-name modal, footer;
  - loads `custom-select.js` upfront only for the catalog page;
  - loads `app-page-runtime.js`;
  - loads `app.js`;
  - starts the page runtime and then marks `app-ready`.
- `app-page-runtime.js`
  - dispatches by `document.body.dataset.appPage`;
  - calls `initSharedApp()` first;
  - then calls the page initializer.

Production asset URL strategy:

- Core JS/CSS and lazy feature modules use `/app-assets/<APP_BUILD_VERSION>?file=<asset>`.
- `functions/app-assets/[version].js` allowlists app assets and proxies them from current Pages assets with `no-store`.
- `_headers` sets core app assets to `public, max-age=0, must-revalidate`.
- Do not reintroduce long-lived immutable caching on `app.js`, `styles.css`, `movie-page.css`, `secondary-pages.css`, secondary page-only CSS, `shared-layout.js`, `app-page-runtime.js`, `custom-select.js`, lazy feature modules, or `assets/directors-admin-app.js`.

## Pages

HTML shells:

- `index.html`: catalog, `data-app-page="catalog"`.
- `movie.html`: movie detail, `data-app-page="movie"`.
- `user.html`: profile page, `data-app-page="user"`.
- `following.html`: followed profiles/settings, `data-app-page="following"`.
- `notifications.html`: notification settings/feed, `data-app-page="notifications"`.
- `editor.html`: admin editor center, `data-app-page="editor"`.
- `name.html`: person/director detail, `data-app-page="director"`.
- `directors.html`: admin people/directors list, `data-app-page="directors"`.

Cloudflare Functions route extensionless/detail paths to these shells:

- `/`, `/index.html`
- `/movie/*`, `/movie.html`
- `/user/*`, `/user.html`
- `/following`, `/following.html`
- `/notifications`, `/notifications.html`
- `/editor`, `/editor.html`
- `/directors`, `/directors.html`
- `/name/*`, `/name.html`
- `/sitemap.xml`

All HTML-like app shell responses should be no-store.

## Client Ownership

`app.js` is still the main application file. It owns:

- Supabase client setup;
- auth/user role/profile loading;
- session-memory public profile and movie-by-id row caches for repeated profile, notification, and rail lookups;
- catalog state, filters, pagination, URL params, presets;
- movie modal add/edit bridge and Supabase writes;
- movie detail Supabase payload fetchers, cache/state bridges, and callbacks into lazy detail modules;
- ratings/watchlist data, request state, Supabase write callbacks, and catalog/detail rerender bridges;
- notifications unread badge and shared notification availability;
- shared user profile helpers, avatars, settings, follow controls, and reusable profile movie rails;
- shared movie poster display preference helpers, including the profile-level "Русские постеры" mode that treats the second uploaded poster as primary when available;
- bridging legacy app data into the `/directors` Preact island.

`shared-layout.js` owns reusable DOM shells:

- header/account menu;
- auth modal;
- display/profile settings modal;
- movie add/edit modal structure;
- footer.

`styles.css` is the global design system and shared page styles. It uses CSS variables heavily. Avoid local one-off colors if a token exists.

`movie-page.css` owns movie detail-only styles and is loaded by `boot-loader.js` only for `data-app-page="movie"`.

`secondary-pages.css` owns shared non-catalog/non-movie secondary page shell styles: content shells, loading/empty states, login buttons, and shared title scale rules.

Secondary page-only CSS is loaded by `boot-loader.js` only for the matching shell:

- `following-page.css`: `/following` profile grid, follow cards, and responsive layout.
- `notifications-page.css`: `/notifications` notification settings, feed cards, filters, digest rails, and responsive layout.
- `editor-page.css`: `/editor` admin completeness dashboard.
- `director-page.css`: `/name/*` public person/director page.
- `directors-admin-page.css`: `/directors` admin people list.
- `director-form.css`: shared person edit modal styles used by `/name/*` and `/directors`.

`custom-select.js` owns custom select behavior used by catalog and movie modal selects. It is loaded upfront only for catalog pages; movie detail pages lazy-load it on demand before opening the movie add/edit modal.

`following-page.js` is lazy-loaded only for `/following` and owns followed profile rendering, follow notification toggles, unfollow actions, and that page's auth gate. `app.js` provides shared auth, profile, Supabase, and notification availability context to it.

`notifications-page.js` is lazy-loaded only for `/notifications` and owns notification settings/feed rendering, filters, read/dwell handling, clear-all, mark-all-read, and notification digest movie rails. `app.js` keeps the unread badge, account-menu badge, and shared availability/error state.

`user-page.js` is lazy-loaded only for `/user/*` and owns public profile page data composition, rankings/taste stats, and page rendering. `app.js` keeps reusable profile helpers, avatar/settings actions, follow actions, shared movie rail components, and the `/profile-activity-ranks/:userId` fetch bridge because notifications and other surfaces reuse nearby profile helpers.

Profile ranking note:

- Do not calculate public activity medal places only from client-readable `movie_ratings`, `movie_watchlist`, or `movie_reviews` aggregate rows. RLS can make that aggregate incomplete for other profiles, causing multiple users to show as `#1`. Use the server aggregate endpoint first and keep the old client aggregate only as a local/fallback path.

`letterboxd-import.js` is lazy-loaded only when importing Letterboxd ratings.

`editor-page.js` is lazy-loaded only for `/editor` and owns editor-center completeness summary rendering, auth/forbidden/loading states, and page toolbar click handling. `app.js` provides shared auth, admin state, completeness data fetchers, and download actions.

`director-page.js` is lazy-loaded only for `/name/*` and owns public person/director page route parsing, person-page data fetching, legacy director fallback matching, page rendering, photo transforms, and the director movie grid. `app.js` keeps shared people helpers, movie-card helpers, the director add/edit modal, and `/directors` admin bridge.

`admin-actions.js` is lazy-loaded only for rare admin actions:

- manual similar audit;
- completeness TXT audit;
- full database JSON export;
- notification test-suite error classification.

Keep downloadable/report-heavy builders in `admin-actions.js`.

`person-placeholders.js` is lazy-loaded only for person/director pages and owns the large SVG placeholder silhouettes.

`movie-editor.js` is lazy-loaded by the shared movie add/edit modal and owns form draft reading, validation, create-submit orchestration, insert payload building, movie row insert/update writes, create/update relation/manual-similar/poster-gallery write sequencing, update changed-field/relation diffing, poster draft order helpers, poster upload/save result preparation, create/update save-plan decisions, and post-save page/cache synchronization orchestration. `app.js` keeps the modal DOM bridge, update-submit wrapper, poster/manual-similar editor UI state/rendering, low-level relation/manual-similar/gallery write callbacks, and concrete page/cache/render callbacks passed into the editor controller.

`movie-detail-cache.js` is lazy-loaded only for movie detail pages and owns detail session-cache keys, signatures, entry creation, read/write, expiry, and removal. `app.js` keeps the actual restoration of shared rating/watchlist/review/comment/similar state.

`movie-page-shell.js` is lazy-loaded only for movie detail pages and owns detail view-model/header/skeleton HTML helpers.

`movie-page-interactions.js` is lazy-loaded only for movie detail pages and owns trailer modal rendering/open-close behavior, poster gallery switching/load animation, and detail header event binding for watchlist, mobile rating, and trailer controls. `app.js` keeps payload loading, shared state restoration, user-state mutation bridges, and detail-module callbacks.

`movie-page-orchestrator.js` is lazy-loaded only for movie detail pages and owns movie detail init/auth-sync orchestration, route-param parsing, restore/skeleton/warm-cache startup flow, the movie detail page-load decision tree, cache-signature render skipping decisions, and deferred detail-section loading orchestration for similar, reviews, and comments. `app.js` keeps Supabase payload fetchers, current movie state storage, cache read/write callbacks, and render/status callbacks passed into the orchestrator.

`movie-page-similar.js` is lazy-loaded only for movie detail pages and owns manual-similar search/order helpers, similar section/editor/card HTML rendering, editor DOM event binding, deferred similar loading, and optimistic save/status/rollback orchestration. `app.js` keeps manual similar state storage, the section wrapper, and Supabase/data callbacks.

`movie-user-state.js` is lazy-loaded on first rating/watchlist action and owns rating/watchlist mutation orchestration: duplicate-request guards, rating validation, watchlist add/remove branching, local mutation stamps, catalog snapshot sync, rerender callbacks, feedback callbacks, and optional scroll preservation. `app.js` keeps shared rating/watchlist arrays, request sets used by render busy states, Supabase write callbacks, local index/stat updates, and catalog/detail rerender bridges.

`movie-social.js` is lazy-loaded only for movie detail pages and owns the detail social block:

- reviews and review likes;
- comments, comment replies, comment likes;
- review/comment composer state;
- review rail controls, social anchors, and local social section rerenders.

`app.js` keeps the shared movie review/comment arrays and availability flags because session cache, catalog reviewed-state sync, and notifications also read that state. The movie detail page should call the bridge functions in `app.js`; do not re-add social implementation code there.

## Active Optimization Backlog

Work through this backlog one contour per pass unless the user explicitly changes the order:

1. Movie detail orchestration: completed; keep route/load/init/similar/social/interactions/shell/user-state orchestration in lazy modules. `app.js` should remain a data/state bridge here, with only small maintenance cleanup expected.
2. Movie editor: in progress; continue moving the update-submit wrapper, remaining modal DOM bridge, and editor UI state out of `app.js` after the current helper/relation/poster-save-plan/movie-row/related-write/post-save/create-submit split.
3. Supabase payload/select audit: review catalog, profile rails/taste, notifications, person/director payload, and movie detail RPC fallback so each page fetches only fields it actually needs.
4. Catalog module split: move filters, presets, URL params, pagination, card rendering, and catalog return-state cache out of `app.js` after detail/editor boundaries are steadier.
5. Shared profile/auth helpers: extract reusable profile helpers, avatar/settings actions, follow actions, and poster preference helpers into a shared profile module.
6. CSS: after JS boundaries are cleaner, split or tighten remaining global `styles.css`, especially catalog-only styles and repeated shared values.

## Framework Island

The only current framework island is `/directors`:

- source: `src/directors-admin-app.jsx`;
- build: `npm run build:directors`;
- output committed to: `assets/directors-admin-app.js`;
- config: `vite.config.mjs`;
- mounted by `app.js` through `mountDirectorsAdminApp(...)`;
- data/auth/actions still come from legacy `app.js`.

After editing `src/directors-admin-app.jsx`, run `npm run build:directors` and commit the generated asset.

## Auth And Admin

- User session comes from Supabase Auth.
- Role is loaded into `currentUserRole`; `isAdmin = currentUserRole === 'admin'`.
- Admin-only UI must be hidden both structurally and visually.
- Account menu admin-only items use `data-admin-only-menu-item="true"` and `hidden`.
- CSS must include `.auth-popover-item[hidden] { display: none; }` because `.auth-popover-item` normally has `display: flex`.
- Production admin-only pages should still enforce checks in JS, not just hidden links.

Server-only admin operation:

- `functions/admin/users/[userId]/password.js` sets a user's password through Supabase Auth Admin API and requires server-side service role.
- `functions/profile-activity-ranks/[userId].js` calculates public profile activity ranks server-side and returns only target-user counts/ranks, not raw activity rows. It prefers the service role key when configured and falls back to the publishable/anon key for environments where public activity rows are RLS-readable but no server secret is present.

## Catalog

Catalog features:

- filters persisted in URL params;
- quick presets;
- pagination, 40 cards per page;
- month grouping toggle;
- profile activity slices through `profile=<handle>&activity=ratings|watchlist|reviews`;
- range filters for year, rating, runtime;
- catalog state caching to avoid unnecessary re-render on return from detail page;
- local card updates after rating/watchlist mutations where possible.

Important risk:

- Do not invalidate/re-render the whole catalog unless data actually changed.
- Watchlist state must only change by explicit watchlist action, not by rating removal.

## Movie Detail

Movie detail features:

- detail skeleton while first load is incomplete;
- progressive detail loading: primary movie data renders before lower social/similar sections finish;
- poster gallery with ordering/deletion;
- profile-level Russian poster display mode reorders gallery display only, not the stored movie poster order;
- trailer modal;
- aggregator links;
- ratings/watchlist;
- manual similar movies;
- reviews rail, loaded through `movie-social.js`;
- comments tree with spoiler/profanity flags, loaded through `movie-social.js`;
- admin edit/delete actions.

Important risk:

- Reviews/comments have admin moderation paths. Admin edits should not accidentally rewrite original timestamps if only moderation flags change.
- Comment replies to reviews are rendered in the comments feed with a reference snippet, not nested under the review.

## Movie Data Enrichment

Use `docs/MOVIE_DATA_ENRICHMENT_GUIDE.md` before verifying, enriching, or overwriting these movie card fields:

- year;
- additional genres;
- countries;
- production;
- distribution;
- Russian distribution.

Core principle: prefer fewer confirmed values over broad aggregator-derived values. TMDb, IMDb, Letterboxd, Rotten Tomatoes, and similar aggregators may be used for identification and leads, but disputed production, country, genre, release-year, and distributor decisions require stronger confirmation.

## People / Directors

Terminology:

- Data model is generic people, not directors-only.
- Current role supported in UI is director.
- Public person URLs use `/name/<slug>`.
- Admin list page remains `/directors`.

Behavior:

- Movie director text field contains Russian display names.
- On movie save, director names should synchronize to people rows by `name_ru` and maintain `movie_people` rows with role `director`.
- If a director is removed from a movie and no other movies reference that person, cleanup can delete the orphan person row.
- Person placeholder image depends on `gender` (`М` / `Ж`), but gender is not displayed publicly.
- Movie `tmdb_url` is used for matching/future enrichment and is shown only on movie detail pages, not in catalog cards.

## Notifications And Following

Notifications include:

- daily/new movie summary;
- review likes;
- comment likes;
- replies to comments;
- comments on reviews;
- followed user activity: rating, watchlist, review;
- new follower notifications.

Notifications page:

- settings live on the page;
- unread indicator appears in header/account menu;
- read state is not set by random click; current behavior includes dwell/interaction logic.

Following:

- Positioning is "Отслеживания", not "friends".
- Followed profile settings control which activity types generate notifications.

## SEO And Static Fallbacks

- `movie.html` contains SEO fallback markers.
- `functions/_seo-utils.js` renders server fallback content for dynamic routes/sitemap.
- `sitemap.xml` is dynamic; there must not be a static `sitemap.xml` shadowing it.
- Logo is text; normal pages have their own `h1`.

## Checks

Typical checks:

```powershell
node --check app.js
node --check shared-layout.js
node tools\smoke-check.mjs
npm run size:compare
git diff --check
```

For `/directors` island changes:

```powershell
npm run build:directors
node --check assets/directors-admin-app.js
```

`tools/smoke-check.mjs` also checks that key source edits are accompanied by `docs/RECENT_CHANGES.md` updates while the working tree is dirty.
