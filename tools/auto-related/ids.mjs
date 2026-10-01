const TMDB_MOVIE_PATH_PATTERN = /\/movie\/(\d+)(?:[/?#-]|$)/i;
const TMDB_SHORT_MOVIE_PATTERN = /^(\d+)(?:[/?#-]|$)/;
const IMDB_ID_PATTERN = /^tt\d{5,12}$/i;
const IMDB_URL_PATTERN = /\/title\/(tt\d{5,12})(?:[/?#]|$)/i;

export function normalizePositiveInteger(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isSafeInteger(numericValue) || numericValue <= 0) {
    return null;
  }

  return numericValue;
}

export function normalizeImdbId(value) {
  const normalizedValue = String(value || '').trim();

  if (!IMDB_ID_PATTERN.test(normalizedValue)) {
    return '';
  }

  return normalizedValue.toLowerCase();
}

export function extractImdbId(value) {
  const rawValue = String(value || '').trim();
  const directId = normalizeImdbId(rawValue);

  if (directId) {
    return directId;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(rawValue);
  } catch (error) {
    const looseMatch = rawValue.match(IMDB_URL_PATTERN);
    return normalizeImdbId(looseMatch?.[1]);
  }

  const host = parsedUrl.hostname.replace(/^www\./i, '').toLowerCase();

  if (host !== 'imdb.com') {
    return '';
  }

  const match = parsedUrl.pathname.match(IMDB_URL_PATTERN);
  return normalizeImdbId(match?.[1]);
}

export function extractTmdbMovieId(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return null;
  }

  const directId = normalizePositiveInteger(rawValue);

  if (directId) {
    return directId;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(rawValue);
  } catch (error) {
    const shortMatch = rawValue.match(TMDB_SHORT_MOVIE_PATTERN);
    return normalizePositiveInteger(shortMatch?.[1]);
  }

  const host = parsedUrl.hostname.replace(/^www\./i, '').toLowerCase();

  if (host !== 'themoviedb.org' && host !== 'tmdb.org') {
    return null;
  }

  const match = parsedUrl.pathname.match(TMDB_MOVIE_PATH_PATTERN);
  return normalizePositiveInteger(match?.[1]);
}

export function getMovieExternalIds(movie = {}) {
  return {
    tmdb: normalizePositiveInteger(movie.tmdb_id) || extractTmdbMovieId(movie.tmdb_url),
    imdb: normalizeImdbId(movie.imdb_id) || extractImdbId(movie.imdb_url),
    trakt: normalizePositiveInteger(movie.trakt_id)
  };
}

export function normalizeRecommendationCandidate(candidate = {}) {
  const tmdbId = normalizePositiveInteger(candidate.externalIds?.tmdb);
  const traktId = normalizePositiveInteger(candidate.externalIds?.trakt);
  const imdbId = normalizeImdbId(candidate.externalIds?.imdb);
  const rank = normalizePositiveInteger(candidate.rank);
  const provider = String(candidate.provider || '').trim();

  if (!rank || !provider) {
    return null;
  }

  if (!tmdbId && !traktId && !imdbId) {
    return null;
  }

  return {
    externalIds: {
      ...(tmdbId ? { tmdb: tmdbId } : {}),
      ...(imdbId ? { imdb: imdbId } : {}),
      ...(traktId ? { trakt: traktId } : {})
    },
    rank,
    provider
  };
}
