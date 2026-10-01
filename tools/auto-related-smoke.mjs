import { strict as assert } from 'node:assert';

import { readAutoRelatedConfig } from './auto-related/config.mjs';
import { fetchJsonWithRetry } from './auto-related/http-client.mjs';
import { extractImdbId, extractTmdbMovieId } from './auto-related/ids.mjs';
import {
  buildEvidenceRowsFromMatches,
  buildMovieMatchIndex,
  getMatchIndexSummary,
  matchRecommendationCandidates
} from './auto-related/matching.mjs';
import { getProviderRecommendations } from './auto-related/providers.mjs';
import { mergeEvidenceRowsForScoring, scoreRelatedMovies } from './auto-related/scoring.mjs';
import { SupabaseAutoRelatedAdapter } from './auto-related/supabase-adapter.mjs';
import { syncOneAutoRelatedMovie } from './auto-related/sync-runner.mjs';
import { TmdbRecommendationProvider } from './auto-related/tmdb-provider.mjs';
import { TraktRelatedProvider } from './auto-related/trakt-provider.mjs';

function createJsonResponse(body, { status = 200, headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get(name) {
        return headers[String(name || '').toLowerCase()] || '';
      }
    },
    async text() {
      return JSON.stringify(body);
    }
  };
}

async function checkTmdbProvider() {
  const requestedUrls = [];
  const requestedHeaders = [];
  const config = readAutoRelatedConfig({
    TMDB_READ_ACCESS_TOKEN: 'test-tmdb-token',
    AUTO_RELATED_TMDB_PAGES: '2'
  });

  const provider = new TmdbRecommendationProvider(config, {
    async fetchJson(url, options) {
      requestedUrls.push(url);
      requestedHeaders.push(options.headers);

      return {
        total_pages: 2,
        results: [
          {
            id: requestedUrls.length === 1 ? 100 : 200,
            overview: 'must not leak',
            title: 'must not leak'
          }
        ]
      };
    }
  });

  const candidates = await provider.getRecommendations({
    id: 'source',
    tmdb_url: 'https://www.themoviedb.org/movie/12345-test'
  });

  assert.equal(candidates.length, 2);
  assert.deepEqual(candidates[0], {
    externalIds: { tmdb: 100 },
    provider: 'tmdb_recommendations',
    rank: 1
  });
  assert.deepEqual(candidates[1], {
    externalIds: { tmdb: 200 },
    provider: 'tmdb_recommendations',
    rank: 2
  });
  assert.equal(requestedHeaders[0].Authorization, 'Bearer test-tmdb-token');
  assert(requestedUrls[0].includes('/movie/12345/recommendations'));
  assert(!JSON.stringify(candidates).includes('must not leak'));
}

async function checkTraktProvider() {
  const requestedUrls = [];
  const requestedHeaders = [];
  const config = readAutoRelatedConfig({
    TRAKT_API_KEY: 'test-trakt-key'
  });

  const provider = new TraktRelatedProvider(config, {
    async fetchJson(url, options) {
      requestedUrls.push(url);
      requestedHeaders.push(options.headers);

      if (url.includes('/search/tmdb/')) {
        return [{ movie: { ids: { trakt: 777, tmdb: 12345, imdb: 'tt1234567' } } }];
      }

      return [
        { ids: { trakt: 888, tmdb: 54321, imdb: 'tt7654321' }, title: 'must not leak' },
        { ids: { trakt: 999 }, overview: 'must not leak' }
      ];
    }
  });

  const candidates = await provider.getRecommendations({
    tmdb_url: 'https://www.themoviedb.org/movie/12345-test'
  });

  assert.equal(candidates.length, 2);
  assert.deepEqual(candidates[0], {
    externalIds: { tmdb: 54321, imdb: 'tt7654321', trakt: 888 },
    provider: 'trakt_related',
    rank: 1
  });
  assert.deepEqual(candidates[1], {
    externalIds: { trakt: 999 },
    provider: 'trakt_related',
    rank: 2
  });
  assert.equal(requestedHeaders[0]['trakt-api-key'], 'test-trakt-key');
  assert.equal(requestedHeaders[0]['trakt-api-version'], '2');
  assert(requestedUrls[0].includes('/search/tmdb/12345'));
  assert(requestedUrls[1].includes('/movies/777/related'));
  assert(!JSON.stringify(candidates).includes('must not leak'));
}

async function checkRetryAfter() {
  const calls = [];
  const sleeps = [];

  const payload = await fetchJsonWithRetry('https://provider.test/resource', {
    async fetchImpl(url) {
      calls.push(url);

      if (calls.length === 1) {
        return createJsonResponse({ error: 'rate limited' }, {
          status: 429,
          headers: { 'retry-after': '2' }
        });
      }

      return createJsonResponse({ ok: true });
    },
    maxAttempts: 2,
    sleep: async delayMs => {
      sleeps.push(delayMs);
    },
    timeoutMs: 100
  });

  assert.deepEqual(payload, { ok: true });
  assert.equal(calls.length, 2);
  assert.deepEqual(sleeps, [2000]);
}

async function checkProviderAggregation() {
  const result = await getProviderRecommendations(
    { tmdb_id: 12345, trakt_id: 777 },
    [
      {
        name: 'ok_provider',
        async getRecommendations() {
          return [{ externalIds: { tmdb: 1 }, provider: 'ok_provider', rank: 1 }];
        }
      },
      {
        name: 'broken_provider',
        async getRecommendations() {
          throw Object.assign(new Error('temporary failure'), { status: 503 });
        }
      }
    ]
  );

  assert.equal(result.candidates.length, 1);
  assert.deepEqual(result.errors, [
    {
      provider: 'broken_provider',
      message: 'temporary failure',
      status: 503
    }
  ]);
}

function checkCandidateMatching() {
  const index = buildMovieMatchIndex(
    [
      {
        id: 'movie-a',
        imdb_url: 'https://www.imdb.com/title/tt1111111/',
        title: 'A',
        tmdb_url: 'https://www.themoviedb.org/movie/100-a'
      },
      {
        id: 'movie-b',
        imdb_url: 'https://www.imdb.com/title/tt2222222/',
        title: 'B',
        tmdb_url: 'https://www.themoviedb.org/movie/200-b'
      },
      {
        id: 'movie-c',
        imdb_url: 'https://www.imdb.com/title/tt3333333/',
        title: 'C',
        tmdb_url: 'https://www.themoviedb.org/movie/300-c'
      },
      {
        id: 'movie-d',
        imdb_url: 'https://www.imdb.com/title/tt3333333/',
        title: 'D',
        tmdb_url: 'https://www.themoviedb.org/movie/400-d'
      }
    ],
    [
      {
        movie_id: 'movie-b',
        trakt_id: 900
      }
    ]
  );

  assert.deepEqual(getMatchIndexSummary(index), {
    movies: 4,
    tmdbIds: 4,
    imdbIds: 2,
    traktIds: 1,
    ambiguousTmdbIds: 0,
    ambiguousImdbIds: 1,
    ambiguousTraktIds: 0
  });

  const result = matchRecommendationCandidates(
    [
      { externalIds: { tmdb: 200 }, provider: 'tmdb_recommendations', rank: 3 },
      { externalIds: { trakt: 900 }, provider: 'trakt_related', rank: 4 },
      { externalIds: { imdb: 'tt3333333' }, provider: 'trakt_related', rank: 5 },
      { externalIds: { tmdb: 100 }, provider: 'tmdb_recommendations', rank: 1 },
      { externalIds: { tmdb: 999999 }, provider: 'tmdb_recommendations', rank: 8 }
    ],
    index,
    { sourceMovieId: 'movie-a' }
  );

  assert.equal(result.matches.length, 2);
  assert.deepEqual(
    buildEvidenceRowsFromMatches('movie-a', result.matches),
    [
      {
        source_movie_id: 'movie-a',
        target_movie_id: 'movie-b',
        provider: 'tmdb_recommendations',
        provider_rank: 3
      },
      {
        source_movie_id: 'movie-a',
        target_movie_id: 'movie-b',
        provider: 'trakt_related',
        provider_rank: 4
      }
    ]
  );
  assert(result.unmatched.some(item => item.reason === 'ambiguous_external_id'));
  assert(result.unmatched.some(item => item.reason === 'self_match'));
  assert(result.unmatched.some(item => item.reason === 'not_in_catalog'));
}

async function checkSupabaseAdapter() {
  const requests = [];
  const config = readAutoRelatedConfig({
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
    SUPABASE_URL: 'https://example.supabase.co'
  });

  const adapter = new SupabaseAutoRelatedAdapter(config, {
    async fetchImpl(url, options) {
      requests.push({
        body: options.body || '',
        headers: options.headers || {},
        method: options.method || 'GET',
        url: url.toString()
      });

      const parsedUrl = new URL(url);

      if (parsedUrl.pathname.endsWith('/movies')) {
        const range = options.headers.Range;
        return createJsonResponse(range === '0-1'
          ? [{ id: 'movie-a' }, { id: 'movie-b' }]
          : []);
      }

      if (parsedUrl.pathname.endsWith('/movie_recommendation_sync_state')) {
        return createJsonResponse([{ movie_id: 'movie-a', tmdb_id: 100 }]);
      }

      if (parsedUrl.pathname.endsWith('/movie_recommendation_evidence')) {
        return createJsonResponse([
          {
            provider: 'tmdb_recommendations',
            provider_rank: 3,
            source_movie_id: 'movie-a',
            target_movie_id: 'movie-b'
          }
        ]);
      }

      if (parsedUrl.pathname.endsWith('/rpc/replace_movie_recommendation_provider_evidence')) {
        return createJsonResponse([{ source_movie_id: 'movie-a', target_movie_id: 'movie-b' }]);
      }

      if (parsedUrl.pathname.endsWith('/rpc/replace_movie_related_rows')) {
        return createJsonResponse([{ movie_id: 'movie-a', related_movie_id: 'movie-b' }]);
      }

      return createJsonResponse([{ movie_id: 'movie-a' }]);
    }
  });

  adapter.pageSize = 2;

  const movies = await adapter.fetchMovieMatchRows();
  const syncStates = await adapter.fetchRecommendationSyncStates();
  const evidence = await adapter.fetchRecommendationEvidenceForMovie('movie-a');
  await adapter.upsertRecommendationSyncState({
    movie_id: 'movie-a',
    tmdb_id: 100,
    trakt_matched_count: 2
  });
  await adapter.replaceProviderEvidence('movie-a', 'tmdb_recommendations', [
    {
      provider_rank: 1,
      target_movie_id: 'movie-b'
    }
  ]);
  await adapter.replaceRelatedRows('movie-a', [
    {
      confidence: 'normal',
      position: 0,
      related_movie_id: 'movie-b',
      score: 0.05
    }
  ]);

  assert.equal(movies.length, 2);
  assert.equal(syncStates.length, 1);
  assert.equal(evidence.length, 1);
  assert(requests.every(request => request.headers.Authorization === 'Bearer service-role-key'));
  assert(requests.some(request => request.url.includes('select=id%2Cslug%2Ctitle')));
  assert(requests.some(request => request.url.includes('on_conflict=movie_id')));
  assert(requests.some(request =>
    request.url.includes('/rpc/replace_movie_recommendation_provider_evidence') &&
    JSON.parse(request.body).p_provider === 'tmdb_recommendations'
  ));
  assert(requests.some(request =>
    request.url.includes('/rpc/replace_movie_related_rows') &&
    JSON.parse(request.body).p_rows[0].confidence === 'normal'
  ));
}

function checkRelatedScoring() {
  const mergedEvidence = mergeEvidenceRowsForScoring(
    [
      {
        provider: 'tmdb_recommendations',
        provider_rank: 20,
        source_movie_id: 'source-movie',
        target_movie_id: 'old-target'
      },
      {
        provider: 'trakt_related',
        provider_rank: 2,
        source_movie_id: 'reverse-target',
        target_movie_id: 'source-movie'
      }
    ],
    [
      {
        provider: 'tmdb_recommendations',
        provider_rank: 1,
        source_movie_id: 'source-movie',
        target_movie_id: 'direct-target'
      },
      {
        provider: 'trakt_related',
        provider_rank: 4,
        source_movie_id: 'source-movie',
        target_movie_id: 'direct-target'
      }
    ],
    ['tmdb_recommendations', 'trakt_related']
  );
  const scored = scoreRelatedMovies({
    config: readAutoRelatedConfig({
      AUTO_RELATED_MAX_RELATED: '8',
      AUTO_RELATED_MIN_RELATED: '4'
    }),
    evidenceRows: mergedEvidence,
    sourceMovieId: 'source-movie'
  });

  assert.equal(mergedEvidence.some(row => row.target_movie_id === 'old-target'), false);
  assert.equal(scored[0].related_movie_id, 'direct-target');
  assert.equal(scored[0].confidence, 'strong');
  assert(scored.some(row => row.related_movie_id === 'reverse-target'));
}

async function checkSingleMovieSyncRunner() {
  const calls = [];
  const adapter = {
    async fetchMovieMatchRows() {
      return [
        {
          id: 'source-movie',
          imdb_url: 'https://www.imdb.com/title/tt1111111/',
          slug: 'source-slug',
          title: 'Source',
          tmdb_url: 'https://www.themoviedb.org/movie/100-source',
          year: 2026
        },
        {
          id: 'target-movie',
          imdb_url: 'https://www.imdb.com/title/tt2222222/',
          slug: 'target-slug',
          title: 'Target',
          tmdb_url: 'https://www.themoviedb.org/movie/200-target',
          year: 2026
        }
      ];
    },
    async fetchRecommendationSyncStates() {
      return [];
    },
    async fetchRecommendationEvidenceForMovie() {
      return [
        {
          provider: 'tmdb_recommendations',
          provider_rank: 3,
          source_movie_id: 'reverse-source',
          target_movie_id: 'source-movie'
        }
      ];
    },
    async replaceProviderEvidence(sourceMovieId, provider, evidenceRows) {
      calls.push({
        evidenceRows,
        provider,
        sourceMovieId,
        type: 'replace'
      });
    },
    async upsertRecommendationSyncState(row) {
      calls.push({
        row,
        type: 'sync-state'
      });
    },
    async replaceRelatedRows(sourceMovieId, relatedRows) {
      calls.push({
        relatedRows,
        sourceMovieId,
        type: 'related'
      });
      return relatedRows;
    }
  };
  const providers = [
    {
      name: 'tmdb_recommendations',
      async getRecommendations() {
        return [
          { externalIds: { tmdb: 200 }, provider: 'tmdb_recommendations', rank: 1 },
          { externalIds: { tmdb: 999999 }, provider: 'tmdb_recommendations', rank: 2 }
        ];
      }
    },
    {
      name: 'trakt_related',
      async resolveTraktId() {
        return 777;
      },
      async getRecommendations(movie) {
        assert.equal(movie.trakt_id, 777);
        return [
          { externalIds: { imdb: 'tt2222222', trakt: 888 }, provider: 'trakt_related', rank: 1 }
        ];
      }
    }
  ];

  const dryRunResult = await syncOneAutoRelatedMovie({
    adapter,
    config: readAutoRelatedConfig({ AUTO_RELATED_MOVIES: 'false' }),
    now: new Date('2026-10-01T00:00:00Z'),
    providers,
    slug: 'source-slug'
  });

  assert.equal(dryRunResult.dryRun, true);
  assert.equal(dryRunResult.evidenceRows.length, 2);
  assert(dryRunResult.relatedRows.length >= 1);
  assert.equal(dryRunResult.relatedWritten, false);
  assert.equal(dryRunResult.syncStateWritten, false);
  assert.equal(calls.length, 0);

  await assert.rejects(
    () => syncOneAutoRelatedMovie({
      adapter,
      config: readAutoRelatedConfig({ AUTO_RELATED_MOVIES: 'false' }),
      providers,
      slug: 'source-slug',
      write: true
    }),
    /AUTO_RELATED_MOVIES=true/
  );

  const writeResult = await syncOneAutoRelatedMovie({
    adapter,
    config: readAutoRelatedConfig({ AUTO_RELATED_MOVIES: 'true' }),
    now: new Date('2026-10-01T00:00:00Z'),
    providers,
    slug: 'source-slug',
    write: true
  });

  assert.equal(writeResult.dryRun, false);
  assert.equal(writeResult.syncStatePatch.trakt_id, 777);
  assert.equal(calls.filter(call => call.type === 'replace').length, 2);
  assert.equal(calls.filter(call => call.type === 'related').length, 1);
  assert.equal(calls.find(call => call.provider === 'tmdb_recommendations').evidenceRows.length, 1);
  assert.equal(calls.find(call => call.provider === 'trakt_related').evidenceRows.length, 1);
  assert.equal(calls.find(call => call.type === 'related').relatedRows[0].related_movie_id, 'target-movie');
  assert.equal(calls.find(call => call.type === 'sync-state').row.movie_id, 'source-movie');
}

assert.equal(extractTmdbMovieId('https://www.themoviedb.org/movie/4692608-aaron-winsal'), 4692608);
assert.equal(extractImdbId('https://www.imdb.com/title/tt1234567/?ref_=fn'), 'tt1234567');

await checkTmdbProvider();
await checkTraktProvider();
await checkRetryAfter();
await checkProviderAggregation();
checkCandidateMatching();
await checkSupabaseAdapter();
checkRelatedScoring();
await checkSingleMovieSyncRunner();

console.log('Auto-related provider smoke passed.');
