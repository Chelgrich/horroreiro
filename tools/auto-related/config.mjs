export const AUTO_RELATED_PROVIDERS = {
  tmdbRecommendations: 'tmdb_recommendations',
  traktRelated: 'trakt_related'
};

export const DEFAULT_AUTO_RELATED_CONFIG = Object.freeze({
  enabled: false,
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  traktBaseUrl: 'https://api.trakt.tv',
  timeoutMs: 10000,
  maxAttempts: 3,
  retryDelaysMs: [1000, 3000, 10000],
  tmdbPages: 2,
  traktRelatedLimit: 50,
  rrfK: 20,
  traktWeight: 1,
  tmdbWeight: 1,
  reverseWeight: 0.6,
  maxRelated: 8,
  minRelated: 4,
  directRankCutoff: 25,
  reverseRankCutoff: 15,
  fallbackDirectRankCutoff: 50,
  fallbackReverseRankCutoff: 25
});

function parseBoolean(value, fallback = false) {
  const normalizedValue = String(value ?? '').trim().toLowerCase();

  if (!normalizedValue) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(normalizedValue);
}

function parsePositiveInteger(value, fallback) {
  const numericValue = Number(value);

  if (!Number.isSafeInteger(numericValue) || numericValue <= 0) {
    return fallback;
  }

  return numericValue;
}

function parsePositiveNumber(value, fallback) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return fallback;
  }

  return numericValue;
}

function parseRetryDelays(value, fallback) {
  const delays = String(value || '')
    .split(',')
    .map(part => parsePositiveInteger(part.trim(), 0))
    .filter(Boolean);

  return delays.length ? delays : fallback;
}

export function readAutoRelatedConfig(env = process.env) {
  const baseConfig = DEFAULT_AUTO_RELATED_CONFIG;
  const tmdbReadAccessToken = String(env.TMDB_READ_ACCESS_TOKEN || env.TMDB_ACCESS_TOKEN || '').trim();
  const traktApiKey = String(env.TRAKT_API_KEY || env.TRAKT_CLIENT_ID || '').trim();

  return {
    ...baseConfig,
    enabled: parseBoolean(env.AUTO_RELATED_MOVIES, baseConfig.enabled),
    tmdbReadAccessToken,
    traktApiKey,
    tmdbBaseUrl: String(env.TMDB_BASE_URL || baseConfig.tmdbBaseUrl).replace(/\/+$/, ''),
    traktBaseUrl: String(env.TRAKT_BASE_URL || baseConfig.traktBaseUrl).replace(/\/+$/, ''),
    timeoutMs: parsePositiveInteger(env.AUTO_RELATED_TIMEOUT_MS, baseConfig.timeoutMs),
    maxAttempts: parsePositiveInteger(env.AUTO_RELATED_MAX_ATTEMPTS, baseConfig.maxAttempts),
    retryDelaysMs: parseRetryDelays(env.AUTO_RELATED_RETRY_DELAYS_MS, baseConfig.retryDelaysMs),
    tmdbPages: parsePositiveInteger(env.AUTO_RELATED_TMDB_PAGES, baseConfig.tmdbPages),
    traktRelatedLimit: parsePositiveInteger(env.AUTO_RELATED_TRAKT_LIMIT, baseConfig.traktRelatedLimit),
    rrfK: parsePositiveNumber(env.AUTO_RELATED_RRF_K, baseConfig.rrfK),
    traktWeight: parsePositiveNumber(env.AUTO_RELATED_TRAKT_WEIGHT, baseConfig.traktWeight),
    tmdbWeight: parsePositiveNumber(env.AUTO_RELATED_TMDB_WEIGHT, baseConfig.tmdbWeight),
    reverseWeight: parsePositiveNumber(env.AUTO_RELATED_REVERSE_WEIGHT, baseConfig.reverseWeight),
    maxRelated: parsePositiveInteger(env.AUTO_RELATED_MAX_RELATED, baseConfig.maxRelated),
    minRelated: parsePositiveInteger(env.AUTO_RELATED_MIN_RELATED, baseConfig.minRelated),
    directRankCutoff: parsePositiveInteger(env.AUTO_RELATED_DIRECT_RANK_CUTOFF, baseConfig.directRankCutoff),
    reverseRankCutoff: parsePositiveInteger(env.AUTO_RELATED_REVERSE_RANK_CUTOFF, baseConfig.reverseRankCutoff),
    fallbackDirectRankCutoff: parsePositiveInteger(env.AUTO_RELATED_FALLBACK_DIRECT_RANK_CUTOFF, baseConfig.fallbackDirectRankCutoff),
    fallbackReverseRankCutoff: parsePositiveInteger(env.AUTO_RELATED_FALLBACK_REVERSE_RANK_CUTOFF, baseConfig.fallbackReverseRankCutoff)
  };
}

export function getAutoRelatedProviderAvailability(config = readAutoRelatedConfig()) {
  return {
    tmdbRecommendations: Boolean(config.tmdbReadAccessToken),
    traktRelated: Boolean(config.traktApiKey)
  };
}
