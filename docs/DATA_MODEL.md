# Horroreiro Data Model Context

Last updated: 2026-07-13.

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

Runtime display:

- Runtime is displayed as compact time in public UI, not raw minutes.
- Additional genres/subgenres are normalized to lowercase after the first displayed value where needed.

Movie data enrichment:

- Use `docs/MOVIE_DATA_ENRICHMENT_GUIDE.md` before changing movie year, additional genres, countries, production, distribution, or Russian distribution.
- Existing values may be overwritten when better-confirmed sources show they are wrong, incomplete, or based only on aggregator assumptions.
- Do not add filler values for production, countries, or additional genres just for completeness.
- Do not write `Ужасы` into additional genres; horror is the catalog baseline. Movies whose horror status is not confirmed should be reported in a separate review list instead of silently reclassified.

### Ratings And Watchlist

Tables:

- `movie_ratings`
- `movie_watchlist`

Rules:

- Ratings are 1-10 internally.
- Letterboxd import multiplies 5-star ratings by 2.
- Import must match movies strictly by Letterboxd/Boxd URL, not by title fallback.
- Import does not overwrite existing site ratings.
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

Important profile fields:

- `default_display_name`
- display name / nickname
- avatar
- role/admin status

Profile page uses:

- activity counts;
- rankings;
- taste summary: additional genre, subgenre, country, year;
- rails for ratings/watchlist/reviews;
- profile-filtered catalog URLs: `profile=<handle>&activity=ratings|watchlist|reviews`.

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
- When saving movie director names, synchronize people by `name_ru`.
- Add `movie_people` rows for new director links.
- Remove stale links when a director is removed from the movie field.
- Delete orphan people rows when no movie references remain, if safe.
- Movie `tmdb_url` is used for future matching/enrichment and is shown only on movie detail pages, not in catalog cards.

### Storage

Known storage buckets:

- movie poster/images bucket(s), used by movie poster gallery;
- `people`, used by person photos.

Client code must not use service role secrets. Storage writes should follow existing Supabase client patterns and RLS policies.

## RPCs And Server Helpers

Known RPC:

- `create_notification_test_suite`, admin/test utility for generating notification test data.

Cloudflare Functions:

- `/env`: exposes public Supabase URL/anon key and `APP_BUILD_VERSION`.
- `/app-assets/:version`: allowlisted current-deploy asset proxy with no-store cache headers.
- `/admin/users/:userId/password`: admin password set endpoint.
- dynamic route functions for app pages and SEO/sitemap.

## Operational Notes

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
