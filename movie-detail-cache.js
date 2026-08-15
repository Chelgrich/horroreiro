export function createMovieDetailCacheController(context = {}) {
  const {
    storage = globalThis.sessionStorage,
    cacheKey = '',
    version = 1,
    buildVersion = '',
    maxAgeMs = 30 * 60 * 1000,
    maxEntries = 6,
    getDataMutationStamp = () => '',
    isDataMutationStampFresh = () => true,
    getStableStringHash = value => String(value || '').length.toString(36),
    getCurrentUserId = () => null,
    getIsAdmin = () => false,
    getMovieStateSnapshot = () => ({}),
    onCacheError = () => {}
  } = context;

  function getRouteCacheKey(routeParams) {
    if (!routeParams) {
      return '';
    }

    if (routeParams.slug) {
      return `slug:${String(routeParams.slug)}`;
    }

    if (routeParams.id) {
      return `id:${String(routeParams.id)}`;
    }

    return '';
  }

  function getMovieCacheKeys(movie) {
    const keys = [];

    if (movie?.slug) {
      keys.push(`slug:${String(movie.slug)}`);
    }

    if (movie?.id) {
      keys.push(`id:${String(movie.id)}`);
    }

    return [...new Set(keys)];
  }

  function readCache() {
    try {
      const rawCache = storage?.getItem(cacheKey);

      if (!rawCache) {
        return null;
      }

      const cache = JSON.parse(rawCache);

      if (
        cache?.version !== version ||
        cache?.buildVersion !== buildVersion ||
        !cache?.entries ||
        typeof cache.entries !== 'object'
      ) {
        storage?.removeItem(cacheKey);
        return null;
      }

      return cache;
    } catch (error) {
      onCacheError('read', error);
      storage?.removeItem(cacheKey);
      return null;
    }
  }

  function getEntrySignature(entry) {
    if (!entry) {
      return '';
    }

    const signature = JSON.stringify({
      version: entry.version,
      buildVersion: entry.buildVersion,
      dataMutationStamp: entry.dataMutationStamp || '',
      userId: entry.userId || null,
      isAdmin: Boolean(entry.isAdmin),
      movie: entry.movie || null,
      movieRatingStats: entry.movieRatingStats || null,
      movieRatings: entry.movieRatings || [],
      movieWatchlist: entry.movieWatchlist || [],
      movieReviews: entry.movieReviews || [],
      movieComments: entry.movieComments || [],
      posterImages: entry.posterImages || [],
      similarMovieId: entry.similarMovieId || '',
      similarMovieIds: entry.similarMovieIds || [],
      similarMovies: entry.similarMovies || []
    });

    return `${signature.length}:${getStableStringHash(signature)}`;
  }

  function createEntry(movie) {
    if (!movie?.id) {
      return null;
    }

    const snapshot = getMovieStateSnapshot(movie) || {};
    const entry = {
      version,
      buildVersion,
      dataMutationStamp: getDataMutationStamp(),
      savedAt: Date.now(),
      userId: getCurrentUserId(),
      isAdmin: Boolean(getIsAdmin()),
      movie,
      movieRatingStats: snapshot.movieRatingStats || null,
      movieRatings: Array.isArray(snapshot.movieRatings) ? snapshot.movieRatings : [],
      movieWatchlist: Array.isArray(snapshot.movieWatchlist) ? snapshot.movieWatchlist : [],
      movieReviews: Array.isArray(snapshot.movieReviews) ? snapshot.movieReviews : [],
      movieComments: Array.isArray(snapshot.movieComments) ? snapshot.movieComments : [],
      posterImages: Array.isArray(snapshot.posterImages) ? snapshot.posterImages : [],
      similarMovieId: String(snapshot.similarMovieId || ''),
      similarMovieIds: Array.isArray(snapshot.similarMovieIds) ? snapshot.similarMovieIds : [],
      similarMovies: Array.isArray(snapshot.similarMovies) ? snapshot.similarMovies : []
    };

    entry.signature = getEntrySignature(entry);
    return entry;
  }

  function writeEntry(entry) {
    try {
      if (!entry?.movie?.id) {
        return '';
      }

      const cache = readCache() || {
        version,
        buildVersion,
        entries: {}
      };
      const nextEntry = {
        ...entry,
        savedAt: Date.now(),
        signature: entry.signature || getEntrySignature(entry)
      };

      getMovieCacheKeys(entry.movie).forEach(key => {
        cache.entries[key] = nextEntry;
      });

      const sortedEntries = Object.entries(cache.entries)
        .sort((firstEntry, secondEntry) =>
          Number(secondEntry[1]?.savedAt || 0) - Number(firstEntry[1]?.savedAt || 0)
        );

      cache.entries = Object.fromEntries(sortedEntries.slice(0, maxEntries));

      storage?.setItem(
        cacheKey,
        JSON.stringify({
          version,
          buildVersion,
          entries: cache.entries
        })
      );

      return nextEntry.signature;
    } catch (error) {
      onCacheError('write', error);
      return '';
    }
  }

  function removeForMovie(movie) {
    try {
      const cache = readCache();

      if (!cache) {
        return;
      }

      getMovieCacheKeys(movie).forEach(key => {
        delete cache.entries[key];
      });

      storage?.setItem(cacheKey, JSON.stringify(cache));
    } catch (error) {
      onCacheError('remove', error);
    }
  }

  function getEntry(routeParams) {
    const routeCacheKey = getRouteCacheKey(routeParams);
    const cache = readCache();
    const entry = routeCacheKey ? cache?.entries?.[routeCacheKey] : null;
    const entryAge = Date.now() - Number(entry?.savedAt || 0);

    if (
      !entry?.movie?.id ||
      !isDataMutationStampFresh(entry.dataMutationStamp) ||
      entryAge > maxAgeMs ||
      String(entry.userId || '') !== String(getCurrentUserId() || '') ||
      Boolean(entry.isAdmin) !== Boolean(getIsAdmin())
    ) {
      return null;
    }

    return entry;
  }

  return {
    getRouteCacheKey,
    getMovieCacheKeys,
    readCache,
    getEntrySignature,
    createEntry,
    writeEntry,
    removeForMovie,
    getEntry
  };
}
