import {
  getMovieExternalIds,
  normalizeImdbId,
  normalizePositiveInteger,
  normalizeRecommendationCandidate
} from './ids.mjs';

function createEmptyIndex() {
  return {
    byMovieId: new Map(),
    byTmdbId: new Map(),
    byImdbId: new Map(),
    byTraktId: new Map(),
    ambiguous: {
      tmdb: new Set(),
      imdb: new Set(),
      trakt: new Set()
    }
  };
}

function setUniqueIdMapValue(map, ambiguousSet, key, movie) {
  if (!key) {
    return;
  }

  if (ambiguousSet.has(key)) {
    return;
  }

  const existingMovie = map.get(key);

  if (!existingMovie) {
    map.set(key, movie);
    return;
  }

  if (String(existingMovie.id) !== String(movie.id)) {
    map.delete(key);
    ambiguousSet.add(key);
  }
}

function normalizeMovieMatchRow(movie = {}, syncState = {}) {
  const movieIds = getMovieExternalIds(movie);

  return {
    id: String(movie.id || '').trim(),
    slug: String(movie.slug || '').trim(),
    title: String(movie.title || '').trim(),
    original_title: String(movie.original_title || '').trim(),
    year: movie.year ?? null,
    tmdb: normalizePositiveInteger(syncState.tmdb_id) || movieIds.tmdb,
    imdb: normalizeImdbId(syncState.imdb_id) || movieIds.imdb,
    trakt: normalizePositiveInteger(syncState.trakt_id) || movieIds.trakt
  };
}

export function buildMovieMatchIndex(movieRows = [], syncStateRows = []) {
  const index = createEmptyIndex();
  const syncStateByMovieId = new Map(
    (syncStateRows || [])
      .filter(row => row?.movie_id)
      .map(row => [String(row.movie_id), row])
  );

  (movieRows || []).forEach(movie => {
    const normalizedMovie = normalizeMovieMatchRow(movie, syncStateByMovieId.get(String(movie?.id || '')));

    if (!normalizedMovie.id) {
      return;
    }

    index.byMovieId.set(normalizedMovie.id, normalizedMovie);
    setUniqueIdMapValue(index.byTmdbId, index.ambiguous.tmdb, normalizedMovie.tmdb, normalizedMovie);
    setUniqueIdMapValue(index.byImdbId, index.ambiguous.imdb, normalizedMovie.imdb, normalizedMovie);
    setUniqueIdMapValue(index.byTraktId, index.ambiguous.trakt, normalizedMovie.trakt, normalizedMovie);
  });

  return index;
}

export function matchRecommendationCandidate(candidate, index, options = {}) {
  const normalizedCandidate = normalizeRecommendationCandidate(candidate);
  const sourceMovieId = String(options.sourceMovieId || '').trim();

  if (!normalizedCandidate) {
    return {
      candidate,
      reason: 'invalid_candidate',
      status: 'unmatched'
    };
  }

  const { externalIds } = normalizedCandidate;
  const matchAttempts = [
    externalIds.tmdb ? ['tmdb', externalIds.tmdb, index.byTmdbId, index.ambiguous.tmdb] : null,
    externalIds.imdb ? ['imdb', externalIds.imdb, index.byImdbId, index.ambiguous.imdb] : null,
    externalIds.trakt ? ['trakt', externalIds.trakt, index.byTraktId, index.ambiguous.trakt] : null
  ].filter(Boolean);

  const ambiguousAttempt = matchAttempts.find(([, key, , ambiguousSet]) => ambiguousSet.has(key));

  if (ambiguousAttempt) {
    return {
      candidate: normalizedCandidate,
      externalIdType: ambiguousAttempt[0],
      externalIdValue: ambiguousAttempt[1],
      reason: 'ambiguous_external_id',
      status: 'unmatched'
    };
  }

  for (const [externalIdType, externalIdValue, map] of matchAttempts) {
    const movie = map.get(externalIdValue);

    if (!movie) {
      continue;
    }

    if (sourceMovieId && String(movie.id) === sourceMovieId) {
      return {
        candidate: normalizedCandidate,
        externalIdType,
        externalIdValue,
        movie,
        reason: 'self_match',
        status: 'unmatched'
      };
    }

    return {
      candidate: normalizedCandidate,
      externalIdType,
      externalIdValue,
      movie,
      status: 'matched'
    };
  }

  return {
    candidate: normalizedCandidate,
    reason: 'not_in_catalog',
    status: 'unmatched'
  };
}

export function matchRecommendationCandidates(candidates = [], index, options = {}) {
  const matchesByProviderAndMovie = new Map();
  const unmatched = [];

  (candidates || []).forEach(candidate => {
    const match = matchRecommendationCandidate(candidate, index, options);

    if (match.status !== 'matched') {
      unmatched.push(match);
      return;
    }

    const key = `${match.candidate.provider}:${match.movie.id}`;
    const existingMatch = matchesByProviderAndMovie.get(key);

    if (!existingMatch || match.candidate.rank < existingMatch.candidate.rank) {
      matchesByProviderAndMovie.set(key, match);
    }
  });

  return {
    matches: [...matchesByProviderAndMovie.values()]
      .sort((firstMatch, secondMatch) =>
        firstMatch.candidate.provider.localeCompare(secondMatch.candidate.provider) ||
        firstMatch.candidate.rank - secondMatch.candidate.rank ||
        String(firstMatch.movie.id).localeCompare(String(secondMatch.movie.id))
      ),
    unmatched
  };
}

export function buildEvidenceRowsFromMatches(sourceMovieId, matches = []) {
  const normalizedSourceMovieId = String(sourceMovieId || '').trim();

  if (!normalizedSourceMovieId) {
    throw new Error('sourceMovieId is required to build evidence rows.');
  }

  return (matches || []).map(match => ({
    source_movie_id: normalizedSourceMovieId,
    target_movie_id: match.movie.id,
    provider: match.candidate.provider,
    provider_rank: match.candidate.rank
  }));
}

export function getMatchIndexSummary(index) {
  return {
    movies: index.byMovieId.size,
    tmdbIds: index.byTmdbId.size,
    imdbIds: index.byImdbId.size,
    traktIds: index.byTraktId.size,
    ambiguousTmdbIds: index.ambiguous.tmdb.size,
    ambiguousImdbIds: index.ambiguous.imdb.size,
    ambiguousTraktIds: index.ambiguous.trakt.size
  };
}
