# Horroreiro Data Model Context

Last updated: 2026-11-19.

This document describes the client-visible data model and operational assumptions. Supabase schema SQL has often been applied manually through the Supabase UI; do not assume old setup SQL files exist or are still authoritative.

## Supabase Areas

### Movies

Primary table: `movies`.

Important editable fields include:

- title/original title/year/release ordering;
- runtime minutes;
- synopsis;
- director text field;
- poster URL and poster gallery;
- trailer URL;
- aggregator URLs: Kinopoisk, IMDb, Letterboxd, Boxd.it, Rotten Tomatoes, TMDB;
- production, distribution, Russian distribution;
- formats;
- perceived tags/subgenres;
- search aliases.

Related movie data:

- `movie_genres`
- `genres`
- `movie_countries`
- `countries`
- poster gallery rows, used by detail gallery and admin poster editor;
- manual similar movie rows.
- planned automatic related movie rows, after applying `movie-auto-related-setup.sql`:
  - `movie_recommendation_sync_state`;
  - `movie_recommendation_evidence`;
  - `movie_recommendation_overrides`;
  - `movie_related`.

Catalog lookup and relation writes:

- `horroreiro_save_movie(p_movie_id uuid, p_fields jsonb, p_relations jsonb, p_create boolean)` is the movie editor write boundary. SECURITY INVOKER, fixed empty search path, authenticated EXECUTE, and an `auth.uid()`/`is_admin()` guard preserve table RLS. Allowed field keys are explicit; updates cannot alter ID, owner, timestamps, ratings, or unrelated classification fields.
- A save locks/serializes the small admin save path and commits movie fields, existing director trigger, company links, genre/country links, reciprocal manual-similar links, and gallery rows together. Omitted fields/relations are preserved; arrays replace those links (empty clears). Relation keys: `genres`, `countries`, `similar` (movie UUID strings), `posters` (additional image URLs). Company links follow movie company arrays; directors follow `movies.director`.
- Creation uses a client-generated UUID retained for retries. An existing create ID returns its saved `{id, slug}` without applying the payload again. Updating an absent movie raises an error. Use `tools/supabase-movie-save-smoke.sql` for rollback-only admin/user/idempotency/atomicity checks.
- Storage uploads remain outside PostgreSQL. Files are uploaded before saving rows and reused per File on retries. Old or abandoned objects are retained until a separate reference-aware cleanup; an ambiguous write response must never trigger file deletion.
- Browser roles lack TRUNCATE/REFERENCES/TRIGGER on `movies`, `companies`, `movie_companies`, `movie_manual_similar`, and `movie_poster_images`; server privileges are preserved.

- `genres`, `countries`, `movie_genres`, and `movie_countries` are publicly readable by `anon` and `authenticated`. Browser INSERT/UPDATE/DELETE is restricted to `(select public.is_admin())` through separate RLS policies; ownership of a movie alone does not authorize editing its links.
- Client roles do not have TRUNCATE, REFERENCES, or TRIGGER privileges on these tables. Server-side `service_role` access is preserved.

Poster gallery display reads use `MOVIE_POSTER_IMAGE_DISPLAY_SELECT` (`movie_id`, `image_url`, `position`). Public display, detail gallery, and Russian-poster preference do not need `movie_poster_images.id`.

Client movie select profiles:

- `MOVIE_CATALOG_SELECT`: catalog cards and full catalog cache; do not include import-only fields such as `letterboxd_short_url`.
- `MOVIE_DETAIL_SELECT`: public movie detail fallback payload.
- `MOVIE_EDITOR_SELECT`: admin movie add/edit modal payload.
- `MOVIE_LETTERBOXD_IMPORT_MATCH_SELECT`: compact Letterboxd import matching index (`id`, labels/year, `letterboxd_url`, `letterboxd_short_url`); use this instead of loading the full catalog for ratings import.
- `MOVIE_USER_PAGE_CARD_SELECT`: profile rails and notification new-movie digest cards.
- `MOVIE_NOTIFICATION_LINK_SELECT`: lightweight movie links in non-digest notifications.
- `MOVIE_USER_PAGE_TASTE_SELECT`: profile taste statistics.
- `MOVIE_SIMILAR_CARD_SELECT`: movie detail manual similar cards; use this instead of full catalog payload when only similar-card fields are needed.

Automatic related movies:

- `movie-auto-related-setup.sql` creates the first storage/RLS layer for future automatic related movies. It is not wired into the UI yet.
- `movie-auto-related-rpc-setup.sql` creates `replace_movie_recommendation_provider_evidence`, the atomic RPC that replaces evidence rows for one `source_movie_id + provider` after a successful provider fetch.
- `movie-auto-related-materialization-rpc-setup.sql` creates `replace_movie_related_rows`, the atomic RPC that replaces materialized `movie_related` rows for one movie after local scoring.
- `movie_related` is the only planned public read table in this contour. It should contain materialized local results and is safe for `anon`/`authenticated` `select`.
- `movie_recommendation_sync_state`, `movie_recommendation_evidence`, and `movie_recommendation_overrides` are admin-only through RLS. They are for server/admin sync diagnostics and must not be used as public page payloads.
- `movie_recommendation_overrides.action = hide` excludes one directed automatic related pair from materialized `movie_related` rows. `action = include` is supported by scoring/materialization as a forced manual automatic recommendation, but the current `/editor` UI exposes only hide/remove.
- Current `movie_manual_similar` remains the live public source for related movies until the automatic pipeline is explicitly implemented and switched on.
- External providers must be called only by server/CLI sync code with server-side env secrets. Movie detail pages must not call TMDb or Trakt directly.
- Provider/sync modules live under `tools/auto-related/` and are tested with `npm run smoke:auto-related`.
- `tools/auto-related/matching.mjs` strictly matches provider candidates to local movies by normalized TMDb/IMDb/Trakt IDs and treats duplicate external IDs as ambiguous, not as a match.
- `tools/auto-related/scoring.mjs` scores local evidence with RRF only. Direct signals use `directRankCutoff`; reverse signals use `reverseRankCutoff` with `reverseWeight`; fallback cutoffs are used only when strict scoring returns fewer than the configured minimum.
- `tools/auto-related/supabase-adapter.mjs` uses server-only Supabase REST/RPC access for movie match index reads, sync state upserts, evidence reads, atomic evidence replacement, and materialized related-row replacement. It must not be imported by browser code.
- `tools/auto-related/sync-runner.mjs` is the server/CLI-only single-movie, batch sync, periodic refresh, and coverage-report layer. It is dry-run by default through `npm run auto-related:sync`; real writes require `--write` plus `AUTO_RELATED_MOVIES=true` unless an operator intentionally passes `--force`. Dry-runs include `relatedRows` so scoring can be reviewed before writes. Batch mode uses `--limit` to process least recently synced movies from one shared match index and `--delay-ms` to pace external provider calls. `--unsynced-only` restricts a batch to movies without recommendation sync state and is the safe mode for one-time full backfill cron jobs. `npm run auto-related:refresh` is the maintenance wrapper for periodic refreshes: it defaults to 30 least recently synced movies, 1000ms delay, dry-run mode, and a coverage report. `--report` prints current coverage/distribution totals and can be appended to sync runs for cron logs. Write syncs refresh the source movie's materialized rows and the touched target movies' reverse materializations.
- `functions/admin/auto-related/[movieId].js` exposes `POST /admin/auto-related/:movieId` for admin-only post-save syncs. The endpoint verifies the user token with the anon key, checks `profiles.role = admin` with the service role key, and then runs server-side provider sync/materialization. Browser code must only call this endpoint; it must not import provider, adapter, or service-role logic.
- `functions/admin/auto-related/diagnostics.js` exposes `GET /admin/auto-related/diagnostics` for admin-only diagnostics in `/editor`. It reads `movie_recommendation_sync_state`, `movie_recommendation_evidence`, and `movie_related` server-side with the service role and returns only aggregate coverage plus limited movie/pair review lists.
- `functions/admin/auto-related/overrides.js` exposes `POST /admin/auto-related/overrides` for admin-only directed override writes. It writes/removes `movie_recommendation_overrides` and immediately rematerializes the source movie from stored evidence plus overrides without calling external providers.

Runtime display:

- Runtime is displayed as compact time in public UI, not raw minutes.
- Additional genres/subgenres are normalized to lowercase after the first displayed value where needed.
- If the current profile has `prefer_russian_posters = true`, public poster displays treat the first `movie_poster_images` row as the primary poster when it exists; otherwise they fall back to `movies.poster_url`. Stored poster order is not rewritten by this display preference.

Movie data enrichment:

- Use `docs/MOVIE_DATA_ENRICHMENT_GUIDE.md` before changing movie year, additional genres, countries, production, distribution, or Russian distribution.
- Existing values may be overwritten when better-confirmed sources show they are wrong, incomplete, or based only on aggregator assumptions.
- Do not add filler values for production, countries, or additional genres just for completeness.
- Do not write `Ужасы` into additional genres; horror is the catalog baseline. Movies whose horror status is not confirmed should be reported in a separate review list instead of silently reclassified.
- `Не применимо` is an intentional empty marker for movie fields where the value should stop appearing in completeness contours but remain hidden from public movie cards, external links, trailer embeds, and SEO fallback output.

### Ratings And Watchlist

Complete catalog/profile collections use ordered pages through `fetchAllSupabaseRowsResult`; a single Supabase SELECT is capped at 1000 rows. Movie lookups for these collections use at most 200 IDs per query. Never treat a failed later page as a complete collection, or publish a personal collection after its captured user ID changes.

Tables:

- `movie_ratings`
- `movie_watchlist`

Rules:

- Ratings are 1-10 internally.
- Letterboxd import multiplies 5-star ratings by 2.
- Import must match movies strictly by Letterboxd/Boxd URL, not by title fallback.
- Import does not overwrite existing site ratings.
- Import writes ratings in batches of at most 200 rows to fit the bounded same-origin API transport. Confirmed batches are applied locally even if a later batch fails; retrying the file skips already committed ratings and retains `ignoreDuplicates` protection.
- Removing a rating must not imply adding the movie to watchlist.
- Watchlist should only change by explicit eye/watchlist action.

### Reviews

Table:

- `movie_reviews`

Related likes:

- review likes table, created/applied through SQL previously.

Rules:

- Reviews require authenticated user and movie rating.
- Review text length is constrained in UI before publish.
- Reviews can have spoiler/profanity flags.
- Admin can edit/delete/moderate others' reviews.
- Admin moderation should not rewrite original review timestamps when only admin changes flags/content moderation metadata.
- Review author/avatar link to user profile.

### Comments

Table:

- `movie_comments`

Rules:

- Comments can be left independently of rating.
- Replies are nested with limited tree display.
- Replies to reviews require the commenter to have rated/watched the movie.
- Replies to reviews are shown in the comments feed with a reference snippet to the review.
- Spoiler/profanity flags hide content behind a reveal cover.
- If referenced review contains spoiler/profanity, the snippet should not expose hidden text.
- Admin can delete/moderate any comment.
- Own comments with replies cannot be edited.

### Profiles

Profile data is tied to Supabase Auth users.

Shared role/profile, rating aggregate/fallback, personal rating and watchlist reads reject completions whose captured auth generation changed, including logout/account change followed by return to the same ID. Identity changes clear the current role/profile before fresh reads; these client guards preserve session isolation and do not replace server RLS.

Important profile fields:

- `default_display_name`
- display name / nickname
- avatar
- `prefer_russian_posters`, default `false`, controls whether the second uploaded movie poster is displayed as primary for that user when available;
- role/admin status

Profile authorization boundary:

- Profiles are created by the existing `auth.users` trigger `public.handle_new_user()` (SECURITY DEFINER, owned by `postgres`), with `role = 'user'`. Browsers cannot INSERT profiles.
- `authenticated` has column-level UPDATE only for `display_name`, `avatar_url`, and `prefer_russian_posters`; the existing own-ID RLS policy still restricts which row may be edited. Trigger-derived normalized/default name fields are not directly writable by the browser.
- `role`, ID, creation timestamp, and profile sequence are server-managed. Role assignment requires a privileged SQL operator or server-side `service_role`; being an admin in the browser does not grant profile role writes.
- Public SELECT remains available. No client role has DELETE, TRUNCATE, REFERENCES, or TRIGGER access to profiles; `service_role` retains profile management.
- Hosted migration `restrict_profile_and_catalog_writes` enforces these profile and catalog boundaries. It changes grants/policies, not existing profile roles or catalog data.
- Run `tools/supabase-access-smoke.sql` as a privileged SQL operator to check these boundaries. It requires an ordinary profile, an admin profile, and a movie. It temporarily assigns that movie to the ordinary user to detect owner-policy regressions; this, the fixtures, and profile no-op updates are rolled back inside a subtransaction. Other sessions never see the ownership change. Do not wrap it in a SECURITY DEFINER function.

- Avatar Storage upload and `profiles.avatar_url` update are separate operations. An ambiguous profile response must retain the uploaded file, since that row may already reference it; only confirmed replacement/clear can remove the previous avatar. Settings writes capture the viewer ID and recheck it before each subsequent Auth/profile/Storage operation. The UI clears password inputs and invalidates pending local work on account transitions; server RLS remains the authorization boundary.

Profile page uses:

- activity counts;
- rankings;
- taste summary: additional genre, subgenre, country, year;
- rails for ratings/watchlist/reviews;
- profile-filtered catalog URLs: `profile=<handle>&activity=ratings|watchlist|reviews`.

Profile page activity row payloads:

- ratings need `movie_id`, `rating`, and `created_at`;
- watchlist rows need `movie_id` and `created_at`;
- review rails need `movie_id`, `created_at`, and `updated_at`;
- movie card/taste details are loaded through the dedicated movie select profiles above, not by widening activity table selects.

Profile activity ranks:

- Displayed medal places for ratings/watchlist/reviews should come from `/profile-activity-ranks/:userId` when available.
- The endpoint calculates ranks server-side and returns only aggregate counts/ranks for the target profile. It prefers the service role key and falls back to the publishable/anon key if the environment has no server secret and public activity rows are RLS-readable.
- Client-side aggregate rank calculation is a fallback only; RLS can hide other users' activity rows from the browser and make fallback ranks incomplete.

Admin-only server operation:

- `functions/admin/users/[userId]/password.js` can set a user password with service role.

### Following And Notifications

Tables:

- `user_profile_follows`
- `user_follow_notification_preferences`
- `notification_preferences`
- `notification_events`
- `notification_deliveries`

Notification types include:

- new movies summary;
- review like;
- comment like;
- comment reply;
- review reply/comment;
- followed rating;
- followed watchlist;
- followed review;
- profile followed.

Rules:

- Account menu/header unread badge reads notification deliveries.
- Followed activity is configurable per followed profile.
- Notifications should avoid nested link conflicts; marking read is interaction/dwell based rather than blind click on card.

### People

Tables:

- `people`
- `movie_people`

Current supported role:

- `director`

Important people fields:

- `name_ru` (public Russian name; source for matching movie director field);
- `name` (original/native name);
- aliases;
- slug;
- birth date;
- death date;
- birth place;
- photo URL;
- gender (`М` / `Ж`);
- `tmdb_url`.

Rules:

- Public person page path: `/name/<slug>`.
- Admin people list path remains `/directors`.
- Client person reads use explicit select profiles:
  - `PEOPLE_PUBLIC_SELECT` for public `/name/*` fallback data;
  - `PEOPLE_ADMIN_SELECT` for `/directors` list rows and person edit modal data;
  - `PEOPLE_MOVIE_LINK_SELECT` for clickable director names on movie detail pages.
- When saving movie director names, synchronize people by `name_ru`.
- Add `movie_people` rows for new director links.
- Remove stale links when a director is removed from the movie field.
- Delete orphan people rows when no movie references remain, if safe.
- Movie `tmdb_url` is used for future matching/enrichment and is shown only on movie detail pages, not in catalog cards.

### Companies

Tables:

- `companies`
- `movie_companies`

Current supported roles:

- `production`
- `distribution`
- `russian_distribution`

Important company fields:

- `name` (company display name);
- `name_key` (normalized unique match key);
- `slug`;
- `country`.

Rules:

- Admin role list paths:
  - `/production`
  - `/distributors`
  - `/russian-distributors`
- Shared company detail path: `/company/<slug>`.
- Apply `movie-companies-setup.sql` before using these pages in a fresh Supabase environment.
- Movie modal fields `production`, `distribution`, and `russian_distribution` remain the source edited by admins.
- On movie create/update, synchronize those arrays into `companies` and `movie_companies`.
- Movie detail pages use `movie_companies -> companies` to link production/distribution/Russian distribution names to `/company/<slug>` for all visitors; linked rows display the canonical `companies.name`, while original movie array values are only the fallback when no link row exists.
- Matching is by normalized company name, not by role; one company can have several role sections on its detail page.
- Remove stale `movie_companies` rows when a company value is removed from a movie.
- Delete orphan company rows when no movie references remain.
- Company detail pages hide `country` when empty and hide any role section that has no movies.
- Company detail pages are public read-only.
- Company role list pages (`/production`, `/distributors`, `/russian-distributors`) and company edit actions are admin-only.
- RLS must allow public `select` on `companies` and `movie_companies` for `anon` and `authenticated`; writes stay restricted to admins.

### Storage

Known storage buckets:

- movie poster/images bucket(s), used by movie poster gallery;
- `people`, used by person photos.

Client code must not use service role secrets. Storage writes should follow existing Supabase client patterns and RLS policies.

## RPCs And Server Helpers

Known RPC:

- `create_notification_test_suite`, admin/test utility for generating notification test data.
- `get_movie_page_payload`, movie detail payload with rating/watchlist/poster data where available; client falls back to separate `MOVIE_DETAIL_SELECT` queries for public detail pages. The admin edit modal uses `MOVIE_EDITOR_SELECT`.
- `get_person_page_payload`, public person/director page payload where available; client falls back to legacy director-name matching.

Cloudflare Functions:

- `/env`: exposes public Supabase URL/anon key and `APP_BUILD_VERSION`.
- `/supabase/rest/v1/*` and `/supabase/auth/v1/*`: same-origin transport for deployed browser requests to the configured project. It forwards the same publishable API key and user JWT, never the service role; existing table grants/RLS and Auth checks are unchanged. SDK URL/session storage keys remain the original project values. Auth/REST responses are never cached, site cookies are not forwarded, and incoming cross-origin requests are rejected.
- `/app-assets/:version`: allowlisted current-deploy asset proxy with no-store cache headers.
- `/profile-activity-ranks/:userId`: public aggregate helper for profile medal ranks; calculates server-side and does not expose raw rating/watchlist/review rows.
- `/admin/users/:userId/password`: admin password set endpoint.
- dynamic route functions for app pages and SEO/sitemap.

## Operational Notes

### Internal movie research

- `year_research_staging` and `production_research_staging` hold operational research results, not public movie page data. Both have RLS enabled with no client policies (deny by default).
- Neither `PUBLIC`, `anon`, nor `authenticated` may access these tables, including `TRUNCATE`. Only privileged SQL operators and server-side `service_role` callers may read/write them.
- `save_year_research(uuid,integer,integer,date,text,text,jsonb,text)`, `save_production_research(uuid,text[],text,text,text)`, and `get_empty_production_movies(integer,integer)` are internal RPCs. Their `EXECUTE` grants are revoked from `PUBLIC`, `anon`, and `authenticated`, and retained for `service_role`. They use `SECURITY DEFINER`, so table RLS alone does not protect them.
- Applied to production project `uogzcozbnosfguyfbvhe` through hosted migration `restrict_internal_research_access` on 2026-11-15. No browser callers exist in this repository; future research tools must use server credentials, never a browser key.
- An advisor `rls_enabled_no_policy` notice on these two tables is intentional. Do not add public policies to silence it.

Reusable SQL self-check (run as a privileged operator; must complete without an assertion error):

```sql
do $$
begin
  assert not exists (
    select 1
    from (values ('public.year_research_staging'), ('public.production_research_staging')) t(name)
    cross join (values ('anon'), ('authenticated')) r(name)
    where has_table_privilege(r.name, t.name, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN')
      or not (select relrowsecurity from pg_class where oid = t.name::regclass)
      or not has_table_privilege('service_role', t.name, 'SELECT')
      or not has_table_privilege('service_role', t.name, 'INSERT')
  ), 'Research table access regression';
  assert not exists (
    select 1
    from (values
      ('public.save_year_research(uuid,integer,integer,date,text,text,jsonb,text)'),
      ('public.save_production_research(uuid,text[],text,text,text)'),
      ('public.get_empty_production_movies(integer,integer)')
    ) f(signature)
    where has_function_privilege('anon', f.signature, 'EXECUTE')
      or has_function_privilege('authenticated', f.signature, 'EXECUTE')
      or not has_function_privilege('service_role', f.signature, 'EXECUTE')
  ), 'Research RPC access regression';
end $$;
```

### General maintenance

- If Supabase errors mention missing tables/columns, many client features degrade by setting availability flags.
- When adding fields edited in the movie modal, also update:
  - insert/update payloads;
  - detail rendering;
  - export database;
  - completeness audit if relevant;
  - SEO fallback if public.
- When adding people fields, update:
  - person modal;
  - `/directors` admin island/adapters;
  - public `/name` detail;
  - data sync from movie save if role-related.
- When adding company fields or roles, update:
  - `movie-companies-setup.sql`;
  - `COMPANY_*_SELECT` and `COMPANY_ROLES` in `app.js`;
  - `company-pages.js`;
  - movie save sync in `movie-editor.js`/`app.js`;
  - Cloudflare route includes/functions when a new role gets its own page.
