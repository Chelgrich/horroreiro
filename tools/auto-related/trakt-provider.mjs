import { AUTO_RELATED_PROVIDERS } from './config.mjs';
import { fetchJsonWithRetry } from './http-client.mjs';
import {
  getMovieExternalIds,
  normalizeImdbId,
  normalizePositiveInteger,
  normalizeRecommendationCandidate
} from './ids.mjs';

function buildTraktUrl(config, path, query = {}) {
  const url = new URL(`${config.traktBaseUrl}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function normalizeTraktMovieIds(value = {}) {
  const ids = value.ids || value.movie?.ids || value;

  return {
    tmdb: normalizePositiveInteger(ids?.tmdb),
    imdb: normalizeImdbId(ids?.imdb),
    trakt: normalizePositiveInteger(ids?.trakt)
  };
}

export class TraktRelatedProvider {
  constructor(config = {}, options = {}) {
    this.config = config;
    this.fetchJson = options.fetchJson || fetchJsonWithRetry;
    this.name = AUTO_RELATED_PROVIDERS.traktRelated;
  }

  isConfigured() {
    return Boolean(this.config.traktApiKey);
  }

  getHeaders() {
    return {
      'trakt-api-key': this.config.traktApiKey,
      'trakt-api-version': '2'
    };
  }

  async resolveTraktId(movie = {}) {
    if (!this.isConfigured()) {
      return null;
    }

    const sourceIds = getMovieExternalIds(movie);

    if (sourceIds.trakt) {
      return sourceIds.trakt;
    }

    const lookupCandidates = [
      sourceIds.tmdb ? { type: 'tmdb', id: sourceIds.tmdb } : null,
      sourceIds.imdb ? { type: 'imdb', id: sourceIds.imdb } : null
    ].filter(Boolean);

    for (const lookup of lookupCandidates) {
      const payload = await this.fetchJson(
        buildTraktUrl(this.config, `/search/${lookup.type}/${encodeURIComponent(lookup.id)}`, {
          type: 'movie',
          limit: 1
        }),
        {
          headers: this.getHeaders(),
          maxAttempts: this.config.maxAttempts,
          provider: this.name,
          retryDelaysMs: this.config.retryDelaysMs,
          timeoutMs: this.config.timeoutMs
        }
      );

      const firstResult = Array.isArray(payload) ? payload[0] : null;
      const traktId = normalizeTraktMovieIds(firstResult).trakt;

      if (traktId) {
        return traktId;
      }
    }

    return null;
  }

  async getRecommendations(movie = {}) {
    if (!this.isConfigured()) {
      return [];
    }

    const sourceTraktId = await this.resolveTraktId(movie);

    if (!sourceTraktId) {
      return [];
    }

    const payload = await this.fetchJson(
      buildTraktUrl(this.config, `/movies/${encodeURIComponent(sourceTraktId)}/related`, {
        limit: this.config.traktRelatedLimit,
        page: 1
      }),
      {
        headers: this.getHeaders(),
        maxAttempts: this.config.maxAttempts,
        provider: this.name,
        retryDelaysMs: this.config.retryDelaysMs,
        timeoutMs: this.config.timeoutMs
      }
    );

    const results = Array.isArray(payload) ? payload : [];
    const candidates = [];

    results.forEach((result, index) => {
      const externalIds = normalizeTraktMovieIds(result);

      if (externalIds.trakt === sourceTraktId) {
        return;
      }

      const candidate = normalizeRecommendationCandidate({
        externalIds,
        provider: this.name,
        rank: index + 1
      });

      if (candidate) {
        candidates.push(candidate);
      }
    });

    return candidates;
  }
}

export function createTraktRelatedProvider(config, options) {
  return new TraktRelatedProvider(config, options);
}
