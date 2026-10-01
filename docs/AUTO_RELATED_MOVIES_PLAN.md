# Automatic Related Movies Plan

Status: planned architecture, not implemented.

This document captures the target design for an automatic related-movies pipeline. It must not be treated as a description of current database tables until the implementation and Supabase changes are actually applied.

## Goal

Build an automatic layer for the movie detail "Похожие фильмы" block while preserving the current manual related-movie workflow.

The first version should:

- use external recommendation graphs only as signals;
- never analyze synopsis, overview, keywords, reviews, tagline, endings, character names, or embeddings;
- match candidates only to movies already present in Horroreiro;
- avoid any external API request while opening a movie page;
- keep working when one provider is temporarily unavailable;
- keep manual related movies as the most trusted layer.

Initial providers:

- TMDb Movie Recommendations;
- Trakt Related Movies.

TMDb Similar is intentionally excluded from v1.

## Current Project Fit

Current state:

- movies live in Supabase `movies`;
- public movie detail similar cards currently use manual rows from `movie_manual_similar`;
- `movie-page-similar.js` owns lazy manual-similar rendering, events, loading, and optimistic save orchestration;
- `app.js` keeps manual-similar state and Supabase callback bridges;
- movie records already support editable `tmdb_url`;
- external API secrets must stay server-only.

The automatic system should be added as a separate materialized contour. Do not replace or weaken `movie_manual_similar` during the first implementation stage.

## Provider Rules

Use a provider abstraction before writing provider-specific code:

```text
RecommendationProvider.getRecommendations(movie) -> RecommendationCandidate[]
```

Candidate shape:

```text
{
  externalIds: {
    tmdb?: number,
    imdb?: string,
    trakt?: number
  },
  rank: number,
  provider: string
}
```

Planned providers:

- `TmdbRecommendationProvider`;
- `TraktRelatedProvider`.

This keeps the business logic independent from Trakt and allows adding or removing providers without rewriting scoring.

Current skeleton modules live under `tools/auto-related/` and are server/CLI-only:

- `config.mjs`;
- `ids.mjs`;
- `http-client.mjs`;
- `tmdb-provider.mjs`;
- `trakt-provider.mjs`;
- `providers.mjs`;
- `matching.mjs`;
- `supabase-adapter.mjs`.

They are not wired to the public UI yet. `supabase-adapter.mjs` is prepared for server-side REST/RPC reads and writes after the setup SQL files are applied.

## TMDb

Use application-level authentication with the API Read Access Token as a Bearer token. User authorization is not needed for these server-side reads.

Environment variable:

```text
TMDB_READ_ACCESS_TOKEN
```

Requests:

```text
GET /movie/{tmdb_id}/recommendations?page=1
GET /movie/{tmdb_id}/recommendations?page=2
```

Store only technical matching/rank data:

```text
tmdb_id
rank
```

Do not store overview, genre ids, popularity, vote average, keywords, or plot-like data for this algorithm.

TMDb has disabled its old 40 requests per 10 seconds limit, but still documents upper limits around 40 requests per second and requires clients to respect `429` responses. Our pipeline should still run well below that through provider-level throttling.

Official references:

- https://developer.themoviedb.org/docs/authentication-application
- https://developer.themoviedb.org/docs/rate-limiting

## Trakt

Use Trakt only through the provider abstraction. Public endpoints can work with application API headers and do not require per-user OAuth unless a specific endpoint says otherwise.

Environment variable:

```text
TRAKT_API_KEY
```

Headers should include the required Trakt API headers, including `trakt-api-key`. Do not build user OAuth for v1 unless a chosen endpoint explicitly requires it.

Planned lookups:

```text
GET /search/tmdb/{tmdb_id}?type=movie&limit=1
GET /search/imdb/{imdb_id}?type=movie&limit=1
```

Planned related endpoint:

```text
GET /movies/{trakt_id}/related?limit=50&page=1
```

Store only:

```text
trakt_id
tmdb_id
imdb_id
rank
```

Trakt has changed API limits/rules over time, so Horroreiro must not depend on Trakt for page rendering or final business correctness. If Trakt fails, cached Trakt evidence remains untouched and the TMDb provider can still refresh independently.

Official reference:

- https://docs.trakt.tv/docs/authentication-oauth

## External IDs

Preferred movie identifiers:

```text
tmdb_id
imdb_id
trakt_id
```

`trakt_id` may be nullable. Missing Trakt ID is not a movie error and must not block TMDb recommendations.

Current `tmdb_url` can be used to derive `tmdb_id` in the first pass, but the implementation should consider storing normalized ids separately from display/edit URLs once the schema work starts.

## Planned Tables

The first setup SQL is `movie-auto-related-setup.sql`. Apply it manually in Supabase before implementing provider sync code. It creates storage/RLS only and does not change the current public manual related-movie behavior. `movie-auto-related-rpc-setup.sql` adds the atomic provider-evidence replacement RPC used by the server/CLI adapter.

### Evidence

Directed evidence table:

```text
movie_recommendation_evidence
```

Suggested fields:

```text
id
source_movie_id
target_movie_id
provider
provider_rank
fetched_at
```

Providers:

```text
trakt_related
tmdb_recommendations
manual
```

Uniqueness:

```text
provider + source_movie_id + target_movie_id
```

Indexes:

```text
source_movie_id
target_movie_id
provider
fetched_at
```

Evidence is directed: `A -> B` and `B -> A` are different signals.

### Materialized Result

Fast page read table:

```text
movie_related
```

Suggested fields:

```text
movie_id
related_movie_id
score
position
confidence
calculated_at
```

Uniqueness:

```text
movie_id + related_movie_id
```

Index:

```text
movie_id + position
```

Movie pages should read only local materialized results, ordered by position. They must not call `api.trakt.tv` or `api.themoviedb.org`.

### Overrides

Future manual overrides:

```text
movie_recommendation_override
```

Suggested fields:

```text
movie_id
related_movie_id
action
created_at
```

Actions:

```text
include
hide
```

`hide` has highest priority. Manual `include` should guarantee inclusion unless hidden.

## Scoring

Use rank fusion only.

Initial config:

```text
RRF_K=20
TRAKT_WEIGHT=1.0
TMDB_WEIGHT=1.0
REVERSE_WEIGHT=0.6
MAX_RELATED=8
MIN_RELATED=4
```

Formula:

```text
RRF(rank) = 1 / (K + rank)

score(A, B) =
  sum(direct_provider_weight * RRF(direct_rank))
  + REVERSE_WEIGHT * sum(reverse_provider_weight * RRF(reverse_rank))
```

Provider consensus and reciprocal signals naturally raise score through multiple contributions. Do not add an extra artificial consensus bonus in v1.

Initial candidate cutoffs:

```text
direct rank <= 25
reverse rank <= 15
```

Fallback if fewer than four candidates:

```text
direct rank <= 50
reverse rank <= 25
```

Then:

```text
ORDER BY score DESC
LIMIT 8
```

If only two good candidates exist, show two. Do not fill the block with weak matches.

Confidence for admin/debug only:

- `strong`: both providers signal the pair, or both directions exist;
- `normal`: one direct signal with rank <= 10;
- `fallback`: other candidates that pass cutoffs;
- `manual`: materialized manual recommendation.

## Manual Relations

Existing `movie_manual_similar` rows must remain intact.

Manual relations should either be mirrored into evidence with `provider = manual` or merged as a higher-priority source during materialization. In either case:

- manual related movies are never deleted by automatic sync;
- manual items are guaranteed to appear unless explicitly hidden by a future override;
- automatic results fill remaining slots after manual results;
- if manual items exceed `MAX_RELATED`, preserve current position-based behavior.

## Sync Flow

New movie flow:

1. Resolve external ids.
2. Resolve nullable `trakt_id` if possible.
3. Fetch Trakt related and TMDb recommendations for the new movie.
4. Match external candidates to existing Horroreiro movies.
5. Upsert directed evidence for `new_movie -> existing_movie`.
6. Recalculate `movie_related(new_movie)`.
7. Recalculate old movies touched by reverse evidence so the new movie can appear in their related blocks immediately.

Periodic refresh:

- refresh 25-30 least recently refreshed movies per day;
- allow admin/CLI refresh for one movie;
- allow admin/CLI refresh-all for maintenance/backfill.

Backfill must be restart-safe: repeated runs must not create duplicates, clear good cached data after failures, or require always starting from the first movie.

## Failure, Cache, And Rate Limits

External fetch policy:

- timeout around 10 seconds;
- max three attempts;
- respect `Retry-After` on `429`;
- exponential backoff for `5xx` and network failures;
- provider-specific concurrency limit, roughly 2-5 movies at once;
- never `Promise.all()` the whole catalog.

Atomic provider update:

```text
fetch successful
  -> validate response
  -> replace old provider edges for that source movie
  -> recalculate affected materialized rows

fetch failed
  -> leave previous provider edges untouched
  -> record error/status
```

Suggested sync diagnostics:

```text
recommendations_last_synced_at
recommendations_last_success_at
recommendations_last_error
trakt_last_success_at
tmdb_last_success_at
```

These may live on a per-movie sync table instead of `movies`.

## Admin Diagnostics

Add admin-only inspection after the pipeline works:

```text
Related movie
score
confidence
evidence
```

Example:

```text
Candidate
score: 0.081
confidence: strong
Trakt direct: #3
TMDb direct: #6
Trakt reverse: #8
```

Useful aggregate metrics:

- movies with 0 related;
- movies with 1-3 related;
- movies with 4+ related;
- pairs confirmed by both providers;
- reciprocal pairs;
- average related count per movie.

## Feature Flag

First implementation should be behind a server/admin feature flag:

```text
AUTO_RELATED_MOVIES=true|false
```

Until quality is verified, keep the current public manual block as-is or make the automatic block admin-visible only.

## Acceptance Criteria

- New movie with TMDb ID can receive related movies from the existing catalog after sync.
- New movie can appear in related blocks of older movies through reverse evidence.
- Movie page opening performs no external API requests.
- Repeated sync creates no duplicates.
- Failed provider refresh does not delete previous good recommendations.
- Missing Trakt ID does not block TMDb recommendations.
- Existing manual relations remain available.
- No overview/synopsis/keywords/plot/review/embedding data is fetched or analyzed.
- Public result contains at most 8 movies.

## Implementation Order

1. Supabase migration and RLS plan.
2. Provider abstraction and shared fetch/retry/rate-limit helper.
3. TMDb provider.
4. Trakt provider.
5. External ID resolver.
6. Evidence storage.
7. RRF scoring/materialization.
8. Single-movie CLI/admin sync.
9. Full backfill.
10. Refresh touched reverse edges after movie creation/edit.
11. Periodic refresh.
12. Admin diagnostics.
13. Public UI switch after quality review.
