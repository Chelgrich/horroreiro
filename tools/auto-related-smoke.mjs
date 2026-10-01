import { strict as assert } from 'node:assert';

import { readAutoRelatedConfig } from './auto-related/config.mjs';
import { fetchJsonWithRetry } from './auto-related/http-client.mjs';
import { extractTmdbMovieId } from './auto-related/ids.mjs';
import { getProviderRecommendations } from './auto-related/providers.mjs';
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

assert.equal(extractTmdbMovieId('https://www.themoviedb.org/movie/4692608-aaron-winsal'), 4692608);

await checkTmdbProvider();
await checkTraktProvider();
await checkRetryAfter();
await checkProviderAggregation();

console.log('Auto-related provider smoke passed.');
