function doesNumberMatchCatalogRange(value, from, to) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return false;
  }

  if (from !== null && numericValue < from) {
    return false;
  }

  if (to !== null && numericValue > to) {
    return false;
  }

  return true;
}

function getCatalogFilterStateSnapshot({
  selectedGenre = '',
  selectedSubgenre = '',
  selectedFormat = '',
  selectedCountry = '',
  ratingRange = { from: null, to: null, hasRange: false },
  yearRange = { from: null, to: null, hasRange: false },
  runtimeRange = { from: null, to: null, hasRange: false },
  selectedWatchlist = '',
  selectedWatched = '',
  searchQuery = '',
  searchQueryWords = [],
  hasCurrentUser = false,
  hasProfileActivityFilter = false,
  profileActivityMovieIds = new Set(),
  reviewedOnly = false
} = {}) {
  return {
    selectedGenre,
    selectedSubgenre,
    selectedFormat,
    selectedCountry,
    ratingFrom: ratingRange.from,
    ratingTo: ratingRange.to,
    hasRatingRange: Boolean(ratingRange.hasRange),
    yearFrom: yearRange.from,
    yearTo: yearRange.to,
    hasYearRange: Boolean(yearRange.hasRange),
    runtimeFrom: runtimeRange.from,
    runtimeTo: runtimeRange.to,
    hasRuntimeRange: Boolean(runtimeRange.hasRange),
    selectedWatchlist,
    hasWatchlistFilter: selectedWatchlist === 'in_watchlist' || selectedWatchlist === 'not_in_watchlist',
    selectedWatched,
    hasWatchedFilter: selectedWatched === 'watched' || selectedWatched === 'unwatched',
    searchQuery,
    searchQueryWords,
    hasSearchQuery: Array.isArray(searchQueryWords) && searchQueryWords.length > 0,
    hasCurrentUser: Boolean(hasCurrentUser),
    hasProfileActivityFilter: Boolean(hasProfileActivityFilter),
    profileActivityMovieIds,
    reviewedOnly: Boolean(reviewedOnly)
  };
}

function getContextMovieMeta(context, movie) {
  return context.getCatalogMovieMeta(movie);
}

function isReviewedMovie(context, movieId) {
  return Boolean(context.catalogReviewedMovieIds?.has(String(movieId)));
}

function getMovieAverageRating(context, movieId) {
  return Number(context.getMovieAverageRating?.(movieId) || 0);
}

function getCatalogMovieYearFilterValue(context, movie) {
  return context.getCatalogMovieYearFilterValue?.(movie) ?? null;
}

function getCurrentUserMovieState(context, movieId) {
  return context.getCurrentUserMovieState?.(movieId) || {
    isInWatchlist: false,
    isWatched: false
  };
}

function doesMovieMatchSearch(context, movie, filterState) {
  return context.movieMatchesSearch(movie, filterState.searchQuery, filterState.searchQueryWords);
}

function doesMovieMatchCatalogFilters(movie, filterState, context, meta = getContextMovieMeta(context, movie)) {
  if (
    filterState.hasSearchQuery &&
    !doesMovieMatchSearch(context, movie, filterState)
  ) {
    return false;
  }

  if (
    filterState.hasProfileActivityFilter &&
    !filterState.profileActivityMovieIds?.has(String(movie.id))
  ) {
    return false;
  }

  if (filterState.selectedGenre && !meta.genreNames.has(filterState.selectedGenre)) {
    return false;
  }

  if (filterState.selectedSubgenre && !meta.subgenreKeys.has(filterState.selectedSubgenre)) {
    return false;
  }

  if (filterState.selectedFormat && !meta.formatKeys.has(filterState.selectedFormat)) {
    return false;
  }

  if (filterState.selectedCountry && !meta.countryNames.has(filterState.selectedCountry)) {
    return false;
  }

  if (filterState.hasRatingRange) {
    const averageRating = getMovieAverageRating(context, movie.id);
    const matchesRating = doesNumberMatchCatalogRange(
      averageRating,
      filterState.ratingFrom,
      filterState.ratingTo
    );

    if (!matchesRating) {
      return false;
    }
  }

  const movieYearFilterValue = filterState.hasYearRange
    ? getCatalogMovieYearFilterValue(context, movie)
    : null;

  if (
    filterState.hasYearRange &&
    (
      movieYearFilterValue === null ||
      !doesNumberMatchCatalogRange(
        movieYearFilterValue,
        filterState.yearFrom,
        filterState.yearTo
      )
    )
  ) {
    return false;
  }

  if (
    filterState.hasRuntimeRange &&
    (
      movie.runtime_minutes === null ||
      !doesNumberMatchCatalogRange(movie.runtime_minutes, filterState.runtimeFrom, filterState.runtimeTo)
    )
  ) {
    return false;
  }

  if (filterState.reviewedOnly && !isReviewedMovie(context, movie.id)) {
    return false;
  }

  let currentUserMovieState = null;

  if (filterState.hasCurrentUser && filterState.hasWatchlistFilter) {
    currentUserMovieState = getCurrentUserMovieState(context, movie.id);

    if (
      filterState.selectedWatchlist === 'in_watchlist'
        ? !currentUserMovieState.isInWatchlist
        : currentUserMovieState.isInWatchlist
    ) {
      return false;
    }
  }

  if (filterState.hasCurrentUser && filterState.hasWatchedFilter) {
    currentUserMovieState = currentUserMovieState || getCurrentUserMovieState(context, movie.id);

    if (
      filterState.selectedWatched === 'watched'
        ? !currentUserMovieState.isWatched
        : currentUserMovieState.isWatched
    ) {
      return false;
    }
  }

  return true;
}

function getCatalogFilterMatches(movie, filterState, context, meta = getContextMovieMeta(context, movie)) {
  const currentUserMovieState = (
    filterState.hasCurrentUser &&
    (filterState.hasWatchlistFilter || filterState.hasWatchedFilter)
  )
    ? getCurrentUserMovieState(context, movie.id)
    : null;
  const averageRating = filterState.hasRatingRange
    ? getMovieAverageRating(context, movie.id)
    : 0;
  const movieYearFilterValue = filterState.hasYearRange
    ? getCatalogMovieYearFilterValue(context, movie)
    : null;

  return {
    profileActivity: (
      !filterState.hasProfileActivityFilter ||
      filterState.profileActivityMovieIds?.has(String(movie.id))
    ),
    search: (
      !filterState.hasSearchQuery ||
      doesMovieMatchSearch(context, movie, filterState)
    ),
    genre: !filterState.selectedGenre || meta.genreNames.has(filterState.selectedGenre),
    subgenre: !filterState.selectedSubgenre || meta.subgenreKeys.has(filterState.selectedSubgenre),
    format: !filterState.selectedFormat || meta.formatKeys.has(filterState.selectedFormat),
    country: !filterState.selectedCountry || meta.countryNames.has(filterState.selectedCountry),
    rating: (
      !filterState.hasRatingRange ||
      doesNumberMatchCatalogRange(averageRating, filterState.ratingFrom, filterState.ratingTo)
    ),
    year: (
      !filterState.hasYearRange ||
      (
        movieYearFilterValue !== null &&
        doesNumberMatchCatalogRange(
          movieYearFilterValue,
          filterState.yearFrom,
          filterState.yearTo
        )
      )
    ),
    runtime: (
      !filterState.hasRuntimeRange ||
      (
        movie.runtime_minutes !== null &&
        doesNumberMatchCatalogRange(movie.runtime_minutes, filterState.runtimeFrom, filterState.runtimeTo)
      )
    ),
    reviews: !filterState.reviewedOnly || isReviewedMovie(context, movie.id),
    watchlist: (
      !filterState.hasCurrentUser ||
      !filterState.hasWatchlistFilter ||
      (
        filterState.selectedWatchlist === 'in_watchlist'
          ? currentUserMovieState.isInWatchlist
          : !currentUserMovieState.isInWatchlist
      )
    ),
    watched: (
      !filterState.hasCurrentUser ||
      !filterState.hasWatchedFilter ||
      (
        filterState.selectedWatched === 'watched'
          ? currentUserMovieState.isWatched
          : !currentUserMovieState.isWatched
      )
    )
  };
}

function matchesCatalogFilterCountScope(matches, ignoredFilterKey) {
  return (
    matches.search &&
    matches.profileActivity &&
    (ignoredFilterKey === 'genre' || matches.genre) &&
    (ignoredFilterKey === 'subgenre' || matches.subgenre) &&
    (ignoredFilterKey === 'format' || matches.format) &&
    (ignoredFilterKey === 'country' || matches.country) &&
    (ignoredFilterKey === 'year' || matches.year) &&
    (ignoredFilterKey === 'runtime' || matches.runtime) &&
    matches.rating &&
    matches.reviews &&
    matches.watchlist &&
    matches.watched
  );
}

function filterCatalogMovies(movies, filterState, context) {
  return (Array.isArray(movies) ? movies : []).filter(movie => {
    const meta = getContextMovieMeta(context, movie);

    return doesMovieMatchCatalogFilters(movie, filterState, context, meta);
  });
}

function addCount(counts, value) {
  if (!value) {
    return;
  }

  counts.set(value, (counts.get(value) || 0) + 1);
}

function getDynamicFilterOptionCounts(movies, filterState, context) {
  const counts = {
    genreCounts: new Map(),
    subgenreCounts: new Map(),
    formatCounts: new Map(),
    countryCounts: new Map()
  };

  (Array.isArray(movies) ? movies : []).forEach(movie => {
    const meta = getContextMovieMeta(context, movie);
    const matches = getCatalogFilterMatches(movie, filterState, context, meta);

    if (matchesCatalogFilterCountScope(matches, 'genre')) {
      meta.filterableGenreNames.forEach(genreName => {
        addCount(counts.genreCounts, genreName);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'subgenre')) {
      meta.subgenreKeys.forEach(subgenreKey => {
        addCount(counts.subgenreCounts, subgenreKey);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'format')) {
      meta.formatKeys.forEach(formatKey => {
        addCount(counts.formatCounts, formatKey);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'country')) {
      meta.countryNames.forEach(countryName => {
        addCount(counts.countryCounts, countryName);
      });
    }
  });

  return counts;
}

function getFilterModalActiveChips(chips = []) {
  return (Array.isArray(chips) ? chips : []).filter(chip => chip.key !== 'profile-activity');
}

export {
  doesMovieMatchCatalogFilters,
  doesNumberMatchCatalogRange,
  filterCatalogMovies,
  getCatalogFilterMatches,
  getCatalogFilterStateSnapshot,
  getDynamicFilterOptionCounts,
  getFilterModalActiveChips,
  matchesCatalogFilterCountScope
};
