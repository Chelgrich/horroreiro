export function createMoviePageSimilarController(context = {}) {
  const {
    normalizeManualSimilarMovieIds = movieIds => (Array.isArray(movieIds) ? movieIds : []),
    normalizeSearchText = value => String(value || '').trim().toLowerCase(),
    getManualSimilarMovieLabel = movie => String(movie?.title || '')
  } = context;

  function doesMovieMatchManualSimilarSearch(movie, normalizedQuery) {
    if (!normalizedQuery) {
      return false;
    }

    const searchValues = [
      getManualSimilarMovieLabel(movie),
      movie?.original_title,
      movie?.director,
      movie?.year,
      ...(Array.isArray(movie?.search_aliases) ? movie.search_aliases : [])
    ];

    return searchValues.some(value => normalizeSearchText(value).includes(normalizedQuery));
  }

  function getMoviePageSimilarSearchSuggestions({
    movie = null,
    movies = [],
    selectedMovieIds = [],
    query = '',
    limit = 8
  } = {}) {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery || !Array.isArray(movies) || movies.length === 0) {
      return [];
    }

    const excludedMovieIds = new Set([
      String(movie?.id || ''),
      ...normalizeManualSimilarMovieIds(selectedMovieIds).map(movieId => String(movieId))
    ].filter(Boolean));

    return movies
      .filter(item => (
        item?.id &&
        !excludedMovieIds.has(String(item.id)) &&
        doesMovieMatchManualSimilarSearch(item, normalizedQuery)
      ))
      .slice()
      .sort((firstMovie, secondMovie) => (
        getManualSimilarMovieLabel(firstMovie).localeCompare(
          getManualSimilarMovieLabel(secondMovie),
          'ru'
        )
      ))
      .slice(0, limit);
  }

  function getMoviePageSimilarIdsAfterMove(movieIds = [], movieId, direction) {
    const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);
    const normalizedMovieId = String(movieId || '');
    const currentIndex = normalizedMovieIds.indexOf(normalizedMovieId);
    const nextIndex = currentIndex + Number(direction || 0);

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= normalizedMovieIds.length
    ) {
      return normalizedMovieIds;
    }

    const nextMovieIds = normalizedMovieIds.slice();
    const [movedMovieId] = nextMovieIds.splice(currentIndex, 1);

    nextMovieIds.splice(nextIndex, 0, movedMovieId);
    return nextMovieIds;
  }

  function getMoviePageSimilarIdsAfterDrop(
    movieIds = [],
    sourceMovieId,
    targetMovieId,
    shouldPlaceAfter = false
  ) {
    const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);
    const sourceId = String(sourceMovieId || '');
    const targetId = String(targetMovieId || '');

    if (!sourceId || !targetId || sourceId === targetId) {
      return normalizedMovieIds;
    }

    const nextMovieIds = normalizedMovieIds.filter(movieId => String(movieId) !== sourceId);
    const targetIndex = nextMovieIds.indexOf(targetId);

    if (targetIndex < 0) {
      return normalizedMovieIds;
    }

    nextMovieIds.splice(targetIndex + (shouldPlaceAfter ? 1 : 0), 0, sourceId);
    return nextMovieIds;
  }

  return {
    doesMovieMatchManualSimilarSearch,
    getMoviePageSimilarSearchSuggestions,
    getMoviePageSimilarIdsAfterMove,
    getMoviePageSimilarIdsAfterDrop
  };
}
