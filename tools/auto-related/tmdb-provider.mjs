import { AUTO_RELATED_PROVIDERS } from './config.mjs';
import { fetchJsonWithRetry } from './http-client.mjs';
import {
  getMovieExternalIds,
  normalizePositiveInteger,
  normalizeRecommendationCandidate
} from './ids.mjs';

function buildTmdbRecommendationsUrl(config, tmdbId, page) {
  const url = new URL(`${config.tmdbBaseUrl}/movie/${encodeURIComponent(tmdbId)}/recommendations`);
  url.searchParams.set('page', String(page));
  return url.toString();
}

export class TmdbRecommendationProvider {
  constructor(config = {}, options = {}) {
    this.config = config;
    this.fetchJson = options.fetchJson || fetchJsonWithRetry;
    this.name = AUTO_RELATED_PROVIDERS.tmdbRecommendations;
  }

  isConfigured() {
    return Boolean(this.config.tmdbReadAccessToken);
  }

  async getRecommendations(movie = {}) {
    if (!this.isConfigured()) {
      return [];
    }

    const sourceIds = getMovieExternalIds(movie);

    if (!sourceIds.tmdb) {
      return [];
    }

    const candidates = [];
    let nextRank = 1;

    for (let page = 1; page <= this.config.tmdbPages; page += 1) {
      const url = buildTmdbRecommendationsUrl(this.config, sourceIds.tmdb, page);
      const payload = await this.fetchJson(url, {
        headers: {
          Authorization: `Bearer ${this.config.tmdbReadAccessToken}`
        },
        maxAttempts: this.config.maxAttempts,
        provider: this.name,
        retryDelaysMs: this.config.retryDelaysMs,
        timeoutMs: this.config.timeoutMs
      });

      const results = Array.isArray(payload?.results) ? payload.results : [];

      for (const result of results) {
        const tmdbId = normalizePositiveInteger(result?.id);

        if (!tmdbId || tmdbId === sourceIds.tmdb) {
          continue;
        }

        const candidate = normalizeRecommendationCandidate({
          externalIds: { tmdb: tmdbId },
          provider: this.name,
          rank: nextRank
        });

        nextRank += 1;

        if (candidate) {
          candidates.push(candidate);
        }
      }

      const totalPages = normalizePositiveInteger(payload?.total_pages) || page;

      if (page >= totalPages) {
        break;
      }
    }

    return candidates;
  }
}

export function createTmdbRecommendationProvider(config, options) {
  return new TmdbRecommendationProvider(config, options);
}
