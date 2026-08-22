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

## 2026-08-22 - Trim poster gallery display payloads

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the movie detail RPC/fallback payload audit.
  - Kept `MOVIE_DETAIL_SELECT` intact because its fields are used by the public movie header, SEO, external links, and metadata.
  - Added `MOVIE_POSTER_IMAGE_DISPLAY_SELECT` for public poster gallery and Russian-poster preference reads.
  - Removed unused `movie_poster_images.id` from single-movie and batch poster-gallery display fetches.
  - Added smoke coverage so display poster reads do not drift back to the wider row payload.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `7.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with catalog payload and any remaining movie detail fallback edges.

## 2026-08-22 - Add explicit people select profiles

- Files:
  - `app.js`
  - `director-page.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the Supabase payload/select audit with public person pages, movie detail director links, and the `/directors` admin list.
  - Added `PEOPLE_PUBLIC_SELECT`, `PEOPLE_ADMIN_SELECT`, and `PEOPLE_MOVIE_LINK_SELECT`.
  - Replaced public `/name/*` fallback `people.select('*')` reads with the public select profile.
  - Replaced movie detail `movie_people -> people (*)` link reads with the compact director-link select.
  - Replaced admin people list/modal reads and post-save returned rows with the admin select profile.
  - Added smoke coverage so public/admin people reads do not drift back to wildcard selects.
- Checks:
  - `node --check app.js`
  - `node --check director-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `7.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with movie detail RPC fallback and catalog payload.

## 2026-08-22 - Trim profile activity row payloads

- Files:
  - `user-page.js`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the Supabase payload/select audit with the profile page.
  - Removed unused `updated_at` from profile rating rows; rating rails still sort by `created_at`.
  - Removed unused `id` from profile review rows; review rails still keep `created_at`/`updated_at` for newest-activity sorting.
  - Documented the compact activity row payload expected by the profile page.
- Checks:
  - `node --check user-page.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `7.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with person/director and movie detail payloads.

## 2026-08-22 - Split notification movie payloads

- Files:
  - `app.js`
  - `notifications-page.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Started the Supabase payload/select audit with the notifications page.
  - Added `MOVIE_NOTIFICATION_LINK_SELECT` for non-digest notification movie links (`id`, `slug`, `title`, `year`).
  - Kept `MOVIE_USER_PAGE_CARD_SELECT` for new-movie digest cards where `poster_url` and `original_title` are actually rendered.
  - Split notification movie fetching so poster preference enrichment runs only for digest card movies.
  - Added smoke coverage for the link-vs-digest select boundary.
- Checks:
  - `node --check app.js`
  - `node --check notifications-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with catalog/profile/person/detail payloads.

## 2026-08-22 - Close movie editor optimization contour

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Finished the movie editor contour audit and marked backlog item 2 complete for the current optimization stage.
  - Moved poster-file feedback text handling into lazy `movie-editor.js`.
  - Kept the remaining `app.js` movie-modal code as shell bridge: mount/bind/open/close, custom-select refresh, draft state assignment, Supabase callbacks, and page/cache/render callbacks.
  - Added smoke coverage so poster-file feedback UI does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Start backlog item 3: Supabase payload/select audit for catalog, profile rails/taste, notifications, person/director payload, and movie detail RPC fallback.

## 2026-08-22 - Move movie editor status submitting UI state

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal submit disabled-state handling and status-message writes into lazy `movie-editor.js`.
  - Kept `app.js` responsible for the boolean `isMovieFormSubmitting`, the external add button state, poster draft rerender bridge, and a minimal status fallback if the lazy editor itself fails to load.
  - Reused the common form-status helper for the missing-movie update path instead of writing to `formMessage` inline.
  - Added smoke guards so modal button/file/list disabled logic stays outside `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Audit the remaining movie-modal DOM event bridge and decide whether the movie editor backlog item is complete enough to move to payload/select audit.

## 2026-08-22 - Move movie editor form fill reset helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal create reset and edit fill DOM state into lazy `movie-editor.js`.
  - Expanded the movie editor form element/context bridge so the lazy editor owns title/button/message, format/tag, poster-file, and genre/country field assignment.
  - Kept `app.js` responsible for `editingMovieId`, poster/manual-similar draft state, async gallery/similar loading, custom select refresh, and opening the modal.
  - Added smoke guards so form fill/reset UI state does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup by auditing the remaining thin modal DOM bridge and deciding whether the second backlog item is complete.

## 2026-08-20 - Move movie editor poster event helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal poster draft click, drag-start, drag-end, drag-over, and drop DOM event mechanics into lazy `movie-editor.js`.
  - Kept `app.js` responsible for applying returned draft/drag state, dirty flags, object URL cleanup, and rerendering.
  - Added smoke guards so poster-specific DOM selector and dataTransfer logic do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `6.8 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining form fill/reset UI state and the thin modal DOM bridge.

## 2026-08-20 - Move movie editor poster draft list renderer

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie-modal poster draft list HTML renderer into lazy `movie-editor.js`.
  - Reduced `app.js` poster draft rendering to a thin DOM assignment that passes current draft/submitting/drag state into the editor controller.
  - Removed the now-unused poster preview wrapper from `app.js` and added a smoke guard for the poster draft renderer boundary.
  - Documented the PowerShell `rg` quoting trap for patterns containing literal quotes or `|` alternatives.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `6.6 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup by moving the remaining poster/manual-similar event bridge or form fill/reset UI state where it can be isolated safely.

## 2026-08-20 - Move movie editor submit event wrapper

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal submit duplicate guard, create/update routing, submitting-state reset, and save error wrapping into lazy `movie-editor.js`.
  - Kept `app.js` responsible for native form submit prevention, loading the lazy editor controller, and passing concrete create/update callbacks.
  - Added a smoke guard so the submit event wrapper stays in the lazy editor module.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `6.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Finish the movie editor contour by auditing the remaining modal DOM bridge and editor UI state in `app.js`.

## 2026-08-20 - Move movie editor manual similar draft helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal manual-similar draft set/add/remove helpers, selectable/selected movie calculations, and list/options HTML helpers into lazy `movie-editor.js`.
  - Kept `app.js` responsible for modal DOM event bridge, local dirty flag assignment, and Supabase fetch/write callbacks.
  - Added a smoke guard so manual-similar draft/render helpers stay in the lazy editor module.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `6.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with submit event routing and the remaining thin modal DOM bridge.

## 2026-08-20 - Move movie editor poster draft helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie poster draft entry creation, preview helpers, object URL cleanup, file entry creation, move/remove operations, and movie-row-to-draft conversion into lazy `movie-editor.js`.
  - Reduced `app.js` poster editor handling to state assignment, dirty/submitting flags, DOM rendering, and event bridge callbacks.
  - Made edit-form filling load the movie editor controller before preparing poster draft state.
  - Documented the UTF-8/mojibake patching fallback that avoided retyping garbled Russian strings from PowerShell output.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `6.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining manual-similar draft/UI bridge and submit event routing.

## 2026-08-20 - Move movie editor update submit orchestration

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie update submit flow into lazy `movie-editor.js`, including validation, relation/manual-similar/poster diffing, poster upload resolution, movie row update, related writes, old poster cleanup, and post-save handoff.
  - Reduced `app.js` update handling to a thin wrapper that locates the current movie and passes state/render/write callbacks into the editor controller.
  - Tightened smoke guards so update-submit diff/write/post-save helpers do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `6.0 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining modal DOM bridge and editor UI state.

## 2026-08-20 - Move movie editor create submit orchestration

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie creation submit flow into lazy `movie-editor.js`, including draft validation, poster upload resolution, row insert, relation/gallery writes, and post-save handoff.
  - Reduced `app.js` create handling to a thin event wrapper that passes page, cache, relation, and status callbacks into the editor controller.
  - Tightened smoke guards so create-submit insert/post-save calls do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.4 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with update-submit orchestration.

## 2026-08-20 - Move movie editor post-save orchestration

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie create/update post-save page synchronization decisions into lazy `movie-editor.js`.
  - Kept concrete catalog/detail rerender, cache, redirect, and status callbacks in `app.js`, but removed the post-save branching from submit orchestration.
  - Tightened smoke guards so create/update mutation stamps and detail reload calls do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining modal submit wrapper/DOM bridge and editor UI state.

## 2026-08-20 - Move movie editor related write sequencing

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved create/update sequencing for movie relations, director links, manual similar movies, and poster galleries into lazy `movie-editor.js`.
  - Kept low-level write callbacks in `app.js`, but replaced the long submit-side `replace...` blocks with editor orchestration calls.
  - Tightened smoke guards so related-data write sequencing does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with post-save UI/cache synchronization and remaining modal submit orchestration.

## 2026-08-20 - Move movie editor row writes

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `movies` row insert/update writes from `app.js` submit functions into lazy `movie-editor.js`.
  - Passed Supabase write dependencies through the movie editor controller context, keeping service-role-free client writes only.
  - Kept relation, director, manual-similar, poster-gallery, and post-save page/cache synchronization in `app.js` for later smaller passes.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with relation/manual-similar/gallery write sequencing and post-save synchronization.

## 2026-08-20 - Move movie editor save-plan helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy editor save-plan helpers for create/update submit decisions.
  - Replaced manual `app.js` checks for saving manual similar movies, poster galleries, no-op updates, movie-field updates, and old poster cleanup with `movie-editor.js` plan results.
  - Tightened smoke guards around the movie editor save-plan boundary.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.0 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with Supabase write sequencing and post-save synchronization in a later pass.

## 2026-08-20 - Move movie editor relation and poster save prep

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie edit relation-change detection for genres, countries, and linked directors into lazy `movie-editor.js`.
  - Added lazy editor helpers for pending poster upload detection and resolved poster save results, so `app.js` no longer manually splits poster entries during add/update submit.
  - Tightened smoke guards for the movie editor boundary and marked the editor backlog item as in progress.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup by moving more add/update submit orchestration and Supabase write sequencing out of `app.js`.

## 2026-08-16 - Close movie detail orchestration backlog

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Removed remaining unused movie-page shell wrapper functions from `app.js`.
  - Switched movie detail skeleton/header/view-model rendering calls to use the lazy shell controller directly while keeping the poster-gallery callback bridge needed by interactions.
  - Tightened smoke guards and marked the movie detail orchestration backlog item as completed/maintenance-only.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `4.6 KiB` brotli below the saved baseline.
- Follow-up:
  - Start backlog item 2: movie editor module/orchestration cleanup.

## 2026-08-16 - Move movie user-state mutation orchestration to lazy module

- Files:
  - `_headers`
  - `app.js`
  - `movie-user-state.js`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-user-state.js` for rating/watchlist mutation orchestration: duplicate-request guards, rating validation, watchlist add/remove branching, local mutation stamp/snapshot sync, rerender callbacks, feedback callbacks, and optional scroll preservation.
  - Kept `app.js` as the shared data bridge for rating/watchlist request sets, Supabase writes, local rating/watchlist arrays, index/stat updates, and catalog/detail rerenders.
  - Registered the module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-user-state.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `36.3 KiB` raw / `4.5 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with final detail bridge cleanup before moving to the movie editor contour.

## 2026-08-16 - Move movie detail init flow to orchestrator

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie detail init/auth-sync orchestration into lazy `movie-page-orchestrator.js`, including session restore handoff, detail-module warmup, session/catalog cache restore, skeleton display, load-error fallback, and auth-sync reload handling.
  - Kept `app.js` as the bridge for lazy module loading, current movie state, render/status callbacks, cache helpers, and Supabase/data callbacks.
  - Tightened smoke guards so init/startup orchestration stays out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `35.3 KiB` raw / `4.4 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with rating/watchlist mutations, then final bridge cleanup.

## 2026-08-16 - Move movie detail page-load decision tree to orchestrator

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie detail load decision tree into lazy `movie-page-orchestrator.js`: RPC/fallback selection, auxiliary load task selection, cache-signature skip-render decisions, and deferred-section kickoff.
  - Kept `app.js` as a callback bridge for Supabase fetchers, current movie state, cache read/write, and render/status functions.
  - Tightened smoke guards so the page-load orchestration does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `34.7 KiB` raw / `4.4 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with init/auth fallback handling or rating/watchlist mutations in a later pass.

## 2026-08-16 - Move movie page route and deferred orchestration to lazy module

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-page-orchestrator.js` for movie detail route-param parsing and deferred section orchestration.
  - Moved similar/review/comment deferred loading coordination out of `app.js` while keeping Supabase fetchers, state, cache persistence, and render/status callbacks there.
  - Registered the module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `34.3 KiB` raw / `4.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with the main route/data load bridge or rating/watchlist mutations in a later pass.

## 2026-08-16 - Move movie similar loading to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved deferred manual similar loading, stale-request protection, admin/public branching, and section rerender orchestration into lazy `movie-page-similar.js`.
  - Kept `app.js` as a thin bridge for movie-page state, Supabase/data fetch callbacks, and session-cache persistence.
  - Tightened smoke guards so similar loading orchestration does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `34.1 KiB` raw / `4.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with route/data rendering or rating/watchlist mutations in a later pass.

## 2026-08-16 - Move movie similar save orchestration to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved manual similar optimistic save, status, rollback, and final rerender orchestration into lazy `movie-page-similar.js`.
  - Kept manual similar state storage, the section wrapper, and the Supabase write callback in `app.js`.
  - Tightened smoke guards so manual similar save orchestration stays out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `33.9 KiB` raw / `4.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with the remaining similar load/state bridge or route/data orchestration in a later pass.

## 2026-08-16 - Move movie similar editor events to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved manual similar editor input, click, drag, drop, and focus handling into lazy `movie-page-similar.js`.
  - Kept current similar state, section wrapper, and Supabase save path in `app.js` as the remaining bridge.
  - Tightened smoke guards so manual similar event helpers stay out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `32.7 KiB` raw / `4.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with the manual-similar save/state bridge or route/data orchestration in a later pass.

## 2026-08-16 - Move movie similar rendering to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved manual similar editor/status/suggestions/list HTML, similar section HTML, and similar card HTML into lazy `movie-page-similar.js`.
  - Left the section wrapper, drag/search/click DOM handlers, and Supabase save path in `app.js` as the next safe orchestration boundary.
  - Tightened smoke guards so similar render helpers stay out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `28.5 KiB` raw / `3.7 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with manual-similar save/events or route/data orchestration in a later pass.

## 2026-08-16 - Record optimization backlog

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added the six open optimization contours to the architecture context as the active backlog.
  - Captured the working rule that future passes should close one contour at a time unless the user changes the order.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Start with the first backlog item, movie detail orchestration, on the next implementation pass.

## 2026-08-16 - Move movie similar helpers to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-page-similar.js` for pure manual-similar search suggestions and selected-movie ordering helpers.
  - Kept manual similar editor HTML, DOM events, Supabase writes, and section rendering in `app.js`.
  - Registered the new lazy module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: `movie-page-similar.js` stays outside startup profiles; current startup profiles remain about `18.9 KiB` raw / `2.7 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue with the remaining movie detail orchestration after this smaller similar-helper split is verified.

## 2026-08-16 - Split movie detail cache and selects

- Files:
  - `app.js`
  - `movie-detail-cache.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-detail-cache.js` for movie detail session-cache keys, signatures, entry creation, read/write, expiry, and removal.
  - Kept shared state restoration in `app.js`, where rating/watchlist/review/comment/similar arrays still live.
  - Split the old combined movie detail/admin edit select into `MOVIE_DETAIL_SELECT` for public detail fallback loading and `MOVIE_EDITOR_SELECT` for the admin movie modal.
  - Registered the new lazy module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-detail-cache.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles decreased by about `18.2 KiB` raw / `2.7 KiB` brotli.
- Follow-up:
  - Continue with the manual-similar editor/orchestration slice after verifying this cache/select split on dev.

## 2026-08-16 - Move poster draft helpers to movie editor

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie poster draft ordering, save-entry cloning, pending poster upload resolution, and primary/additional poster split helpers from `app.js` into the lazy movie editor controller.
  - Kept the movie modal DOM bridge, poster draft rendering state, Supabase writes, and post-save cache synchronization in `app.js`.
  - Made movie modal opening await the lazy editor controller so poster drag/drop handlers can rely on the controller being present.
  - Added a smoke guard that prevents these poster draft order/save helpers from drifting back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles decreased by about `16.1 KiB` raw / `2.5 KiB` brotli.
- Follow-up:
  - Continue moving low-risk movie editor helpers out of `app.js` in small slices.

## 2026-08-15 - Server profile activity ranks

- Files:
  - `_routes.json`
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `user-page.js`
  - `functions/profile-activity-ranks/[userId].js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a Cloudflare Function that calculates public profile activity medal ranks server-side with the Supabase service role and returns only aggregate counts/ranks for the requested profile.
  - Updated profile pages to use the server rank endpoint first and keep the old client aggregate rank calculation only as a fallback.
  - Documented why profile ranks must not depend on client-readable raw activity aggregates: RLS can make other users invisible and incorrectly show multiple profiles as first place.
  - Added `/profile-activity-ranks/*` to Cloudflare `_routes.json`; without this include, dev/prod returned the catalog shell instead of the endpoint JSON.
  - Limited the old client aggregate fallback to local development so dev/prod do not show potentially false rank medals when the server endpoint is unavailable.
  - Let the rank endpoint fall back from service role to `SUPABASE_ANON_KEY` for dev environments where public activity rows are RLS-readable but no server secret is configured.
  - Documented the local PowerShell `&&` separator trap after hitting it during commit preparation.
- Checks:
  - `node --check app.js`
  - `node --check user-page.js`
  - `node --check "functions/profile-activity-ranks/[userId].js"`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Mock endpoint rank check: user with 1 action ranks `2`, user with 2 actions ranks `1`.
  - Real Supabase rank check with publishable key: `profile000` ratings `177` => place `2`; `profile001` ratings `212` => place `1`.
  - `git diff --check`
- Follow-up:
  - Verify on dev that `profile001` ranks above `profile000` for watched/rated count after deploy.

## 2026-08-15 - Cache poster image attributes

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added bounded in-memory caches for Supabase poster transform URLs, poster image data, and generated poster image attribute HTML.
  - Reduced repeated URL parsing, `srcset` assembly, and escaping on hot render paths for catalog cards, profile rails, similar movies, and movie detail gallery switches.
  - Kept the existing poster quality floor and fallback behavior unchanged.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Poster cache guard: confirmed `POSTER_IMAGE_MIN_QUALITY` still floors transformed poster quality at 90 and the new poster caches are bounded.
  - `git diff --check`
- Follow-up:
  - Continue with the next optimization layer after this hot-path cache is verified and pushed.

## 2026-08-14 - Split secondary page styles

- Files:
  - `boot-loader.js`
  - `secondary-pages.css`
  - `following-page.css`
  - `notifications-page.css`
  - `editor-page.css`
  - `director-page.css`
  - `directors-admin-page.css`
  - `director-form.css`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Split the monolithic `secondary-pages.css` into a shared secondary-page base plus page-only CSS for following, notifications, editor, public person pages, directors admin, and the shared person edit modal.
  - Updated `boot-loader.js` so secondary pages load only the CSS needed by the current shell before app startup.
  - Registered the new CSS files in the Cloudflare app-assets allowlist, cache headers, asset-size report, and smoke guards.
- Checks:
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - CSS brace-balance check for `secondary-pages.css`, `following-page.css`, `notifications-page.css`, `editor-page.css`, `director-page.css`, `directors-admin-page.css`, and `director-form.css`.
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Browser smoke: local `/following.html`, `/notifications.html`, `/editor.html`, `/name.html?slug=test-director`, and `/directors.html` reached `app-ready`, loaded their expected CSS files, and had no app console errors.
- Follow-up:
  - Continue with the next approved optimization item after this split is verified and pushed.

## 2026-08-14 - Lazy-load movie detail interactions

- Files:
  - `app.js`
  - `movie-page-interactions.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie detail trailer modal rendering/open-close behavior and poster gallery switching/load animation out of startup `app.js` into lazy `movie-page-interactions.js`.
  - Kept `app.js` as the movie-page orchestrator: it now lazy-loads the interactions controller, passes narrow dependencies, and asks it to bind detail header events.
  - Registered the new lazy asset in Cloudflare app-assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-interactions.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
- Follow-up:
  - Continue the next optimization layer with careful, smaller moves around remaining movie detail helpers.

## 2026-08-14 - Document local workflow traps

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a local workflow traps section for recurring Codex/PowerShell issues: mojibake in terminal output, safer handling of long multiline commands, `-LiteralPath` for paths with square brackets, `rg -g "*.js"` instead of bare globs, and browser-console fallback guidance.
- Checks:
  - `git diff --check`
- Follow-up:
  - Add future recurring trap resolutions here as soon as they are discovered.

## 2026-08-14 - Lazy-load public person page

- Files:
  - `app.js`
  - `director-page.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/name/*` public person/director page route parsing, Supabase payload loading, legacy director fallback, rendering, photo transforms, and movie-grid binding out of startup `app.js` into lazy `director-page.js`.
  - Left shared people helpers, director add/edit modal, movie-card helpers, and `/directors` admin bridge in `app.js`.
  - Registered the new lazy asset in Cloudflare app-assets, cache headers, asset-size reporting, and smoke checks.
- Checks:
  - `node --check app.js`
  - `node --check director-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Browser smoke: local `/name.html?slug=test-director` and `/name.html?slug=noy-lyuk` reached `app-ready`, loaded without app console errors, and rendered the expected not-found/real director states.
- Follow-up:
  - None.

## 2026-08-09 - Lazy-load editor center page

- Files:
  - `app.js`
  - `editor-page.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/editor` completeness summary rendering, auth states, and toolbar click handling out of startup `app.js` into lazy `editor-page.js`.
  - Kept shared admin data fetchers and export/audit actions in `app.js`, passed to the editor controller through a small context.
  - Registered the new lazy asset in the Cloudflare asset allowlist, cache headers, size report, and smoke checks.
- Checks:
  - `node --check app.js`
  - `node --check editor-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: local `/editor.html` reached `app-ready`, showed the editor auth gate, and reported no app console errors.
- Follow-up:
  - None.

## 2026-08-09 - Prevent catalog poster preference flash

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Prevented the catalog from hydrating an anonymous DOM/session snapshot before Supabase session restoration when an auth token is present in local storage.
  - Bumped the catalog snapshot version so older snapshots with default posters are discarded after deployment.
  - This keeps the first visible catalog render aligned with the current user's `prefer_russian_posters` setting instead of briefly showing default posters and then swapping them.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: local catalog reached `app-ready`, rendered 40 cards after data load, and reported no app console errors.
- Follow-up:
  - None.

## 2026-08-09 - Add Russian poster preference

- Files:
  - `app.js`
  - `shared-layout.js`
  - `styles.css`
  - `movie-page-shell.js`
  - `user-page.js`
  - `notifications-page.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a profile settings checkbox for "Русские постеры", stored in `profiles.prefer_russian_posters`.
  - Added shared poster selection helpers so catalog cards, detail poster gallery, similar cards, profile rails, notification digest rails, and person film grids use the second uploaded poster as primary when the setting is enabled.
  - Added batch loading of `movie_poster_images` only when the preference is enabled, plus snapshot invalidation by poster preference to avoid restoring stale catalog DOM.
  - Kept the movie editor order unchanged; after editing a movie poster gallery, the updated second poster is picked up from the existing poster-image cache/reload path.
- Checks:
  - `node --check app.js`
  - `node --check shared-layout.js`
  - `node --check user-page.js`
  - `node --check notifications-page.js`
  - `node --check movie-page-shell.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: local catalog, movie detail fallback, and notifications page reached `app-ready`; the profile settings modal included the Russian posters checkbox; no app console errors were reported.
- Follow-up:
  - Apply `alter table public.profiles add column if not exists prefer_russian_posters boolean not null default false;` in Supabase before using the setting.

## 2026-08-09 - Split lazy page and movie detail modules

- Files:
  - `app.js`
  - `notifications-page.js`
  - `user-page.js`
  - `movie-editor.js`
  - `movie-page-shell.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/notifications` rendering, preferences, read/dwell behavior, clear-all, and digest rail logic into lazy `notifications-page.js`.
  - Moved `/user/*` page data composition, stats/taste calculations, and profile page rendering into lazy `user-page.js`.
  - Added lazy `movie-editor.js` for movie form draft reading, validation, insert payload building, and update changed-field diffing while keeping Supabase writes in `app.js`.
  - Added lazy `movie-page-shell.js` for movie detail view-model, header, and skeleton HTML helpers while keeping route loading, poster gallery events, social bridge, and manual similar editor in `app.js`.
  - Added `MOVIE_SIMILAR_CARD_SELECT` so movie detail similar cards no longer fetch the full catalog payload when the catalog cache is cold.
  - Registered new lazy assets in the Cloudflare asset allowlist, `_headers`, size report, and smoke checks.
  - Saved the reduced asset-size baseline after startup JS dropped by about 11.2 KiB brotli across page profiles.
- Checks:
  - `node --check app.js`
  - `node --check notifications-page.js`
  - `node --check user-page.js`
  - `node --check movie-editor.js`
  - `node --check movie-page-shell.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
  - `git diff --check`
  - Browser smoke: local catalog, movie detail, user page, and notifications page reached `app-ready` without console errors.
- Follow-up:
  - None.

## 2026-08-06 - Add notifications clear-all action

- Files:
  - `app.js`
  - `secondary-pages.css`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a "Очистить всё" ghost action next to "Отметить все прочитанными" on the notifications page.
  - Clears the current user's notification deliveries after confirmation and resets the unread badge locally.
  - Kept the new action visually lightweight with a transparent background and inline close icon.
  - Added a smoke guard for the clear-all notification action wiring.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: `/notifications` started without console errors.
- Follow-up:
  - None.

## 2026-08-05 - Show direct comment replies by default

- Files:
  - `movie-social.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed the movie detail comment tree so direct replies to top-level comments render immediately by default.
  - Kept deeper comment branches behind the existing "Раскрыть ветку" toggle.
  - Added a smoke guard for the direct-reply default visibility rule.
- Checks:
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: `/movie/soulm8yt-2026` rendered without console errors.
- Follow-up:
  - None.

## 2026-08-03 - Fix review reply button on movie detail

- Files:
  - `movie-social.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the review reply click handling into the reviews section listener, where the "Ответить" button is actually rendered.
  - Removed the unreachable review-reply branch from the comments section listener.
  - Added a smoke guard so review reply buttons cannot drift back to the wrong listener silently.
- Checks:
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Local browser smoke for `/movie/taro-2024`
- Follow-up:
  - None.

## 2026-07-28 - Restore movie detail similar handlers

- Files:
  - `app.js`
  - `movie-social.js`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored the manual similar movies detail section renderer and editor event handlers to `app.js` after the social-module extraction accidentally moved them into `movie-social.js`.
  - Kept `movie-social.js` scoped to reviews/comments by removing manual similar movie helpers from it.
  - Added smoke guards so manual similar detail handlers must remain in `app.js` and cannot silently drift into `movie-social.js` again.
  - Restored local reviews/comments section renderers inside `movie-social.js` and switched the exported controller methods to safe arrow properties to avoid recursive API calls.
- Checks:
  - `node --check app.js`
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
  - `git diff --check`
  - Local browser smoke for `/movie/taro-2024`
- Follow-up:
  - None.

## 2026-07-28 - Extract movie detail social block

- Files:
  - `app.js`
  - `movie-social.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie detail reviews, comments, likes, reply composers, social anchors, and social section rerenders into lazy-loaded `movie-social.js`.
  - Kept `app.js` as the bridge for shared social arrays, availability flags, session cache, catalog reviewed-state sync, and fallback loading sections.
  - Added `movie-social.js` to versioned app-assets, cache headers, size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-28 - Resize director admin avatars proportionally

- Files:
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-baseline.json`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed `/directors` admin avatar transforms to request `width` with `resize=contain`, avoiding both server-side square center-crop and Supabase width-only responses that keep the original image height.
  - Kept browser-side top cropping inside the circular avatar after the proportional thumbnail resize.
- Checks:
  - `npm run build:directors`
  - `node --check assets\directors-admin-app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - None.

## 2026-07-28 - Preserve director admin avatar aspect before crop

- Files:
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-baseline.json`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed `/directors` admin avatar Supabase image transforms to request width-only thumbnails instead of square `height` + `resize=cover` crops, so the browser can crop photos from the top inside the circular avatar.
  - Added a smoke guard to keep director admin avatar transforms aspect-ratio preserving.
- Checks:
  - `npm run build:directors`
  - `node --check assets\directors-admin-app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - None.

## 2026-07-28 - Top-align director avatar crops

- Files:
  - `secondary-pages.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored the `/directors` card row alignment and changed circular photo cropping so uploaded person photos anchor to the top inside the avatar circle.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
- Follow-up:
  - None.

## 2026-07-28 - Align directors admin avatars to top

- Files:
  - `secondary-pages.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored top alignment for circular person photos/placeholders in `/directors` cards so thumbnails line up with the first text row instead of vertically centering against the full text block.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
- Follow-up:
  - None.

## 2026-07-28 - Fix notifications avatar helper after following split

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored `/notifications` rendering for authenticated users by replacing the stale `getFollowingPageAvatarHtml` call left after moving `/following` into a lazy module.
  - Added a smoke guard so `app.js` cannot depend on that following-page local helper again.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - Verify authenticated `/notifications` in browser after deploy.

## 2026-07-28 - Cache repeated profile and movie lookups

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added an in-memory movie row cache keyed by select payload for repeated `movies by ids` queries used by profile rails, notifications, and related previews.
  - Added a public profile handle cache on top of the existing public profile id cache.
  - Clear movie row caches on local mutations so edited cards do not keep stale payloads.
  - Skip the deferred movie detail social/similar refresh when a fresh session-cached detail page is already rendered.
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
