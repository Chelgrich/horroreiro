# Horroreiro Architecture Context

Last updated: 2026-07-11.

## Purpose

Horroreiro is a dark-mode horror movie catalog with user ratings, watchlists, reviews, comments, profile pages, notifications, manual similar movies, and person/director pages. It is deployed on Cloudflare Pages with Supabase as backend.

## Read Order For New Work

1. `AGENTS.md`
2. `docs/CODEX_CONTEXT.md`
3. `docs/RECENT_CHANGES.md`
4. `docs/DATA_MODEL.md`
5. Exact source files for the requested feature.

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
  - marks `app-styles-ready` or `app-load-failed`.
- `app-script-loader.js`
  - waits for `window.__ENV_READY__`;
  - loads `shared-layout.js`;
  - mounts shared header, auth modal, display-name modal, footer;
  - conditionally loads `custom-select.js` for catalog/movie pages;
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
- Do not reintroduce long-lived immutable caching on `app.js`, `styles.css`, `shared-layout.js`, `app-page-runtime.js`, `custom-select.js`, `letterboxd-import.js`, or `assets/directors-admin-app.js`.

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
- catalog state, filters, pagination, URL params, presets;
- movie modal add/edit;
- movie detail rendering;
- ratings/watchlist/reviews/comments;
- notifications page and read tracking;
- user profile pages and rails;
- following page;
- people/director detail page;
- bridging legacy app data into the `/directors` Preact island.

`shared-layout.js` owns reusable DOM shells:

- header/account menu;
- auth modal;
- display/profile settings modal;
- movie add/edit modal structure;
- footer.

`styles.css` is the global design system and all page styles. It uses CSS variables heavily. Avoid local one-off colors if a token exists.

`custom-select.js` owns custom select behavior used by catalog and movie modal selects.

`letterboxd-import.js` is lazy-loaded only when importing Letterboxd ratings.

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
- poster gallery with ordering/deletion;
- trailer modal;
- aggregator links;
- ratings/watchlist;
- manual similar movies;
- reviews rail;
- comments tree with spoiler/profanity flags;
- admin edit/delete actions.

Important risk:

- Reviews/comments have admin moderation paths. Admin edits should not accidentally rewrite original timestamps if only moderation flags change.
- Comment replies to reviews are rendered in the comments feed with a reference snippet, not nested under the review.

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
