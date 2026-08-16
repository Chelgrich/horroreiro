export function createMoviePageOrchestratorController(context = {}) {
  const {
    location = globalThis.window?.location || { pathname: '', search: '' }
  } = context;

  function getMoviePageRouteParams() {
    const searchParams = new URLSearchParams(location.search);
    const pathSlugMatch = location.pathname.match(/\/movie\/([^/]+)\/?$/);
    const pathMovieSlug = pathSlugMatch ? decodeURIComponent(pathSlugMatch[1] || '').trim() : '';
    const rawMovieSlug = searchParams.get('slug');
    const rawMovieId = searchParams.get('id');

    const movieSlug = String(rawMovieSlug || '').trim();
    const movieId = String(rawMovieId || '').trim();

    if (pathMovieSlug) {
      return { slug: pathMovieSlug, id: null };
    }

    if (movieSlug) {
      return { slug: movieSlug, id: null };
    }

    if (movieId) {
      return { slug: null, id: movieId };
    }

    return null;
  }

  async function initMoviePage(bindings = {}) {
    const routeParams = typeof bindings.getRouteParams === 'function'
      ? bindings.getRouteParams()
      : getMoviePageRouteParams();

    if (!routeParams) {
      bindings.renderNotFound?.();
      return;
    }

    if (typeof bindings.restoreSession === 'function') {
      await bindings.restoreSession();
    }

    bindings.trackEmailConfirmedLoginIfNeeded?.();

    if (typeof bindings.ensureDetailModulesLoaded === 'function') {
      await bindings.ensureDetailModulesLoaded();
    }

    const restoredMovie = typeof bindings.restoreFromSessionCache === 'function'
      ? bindings.restoreFromSessionCache(routeParams)
      : null;
    const warmMovie = restoredMovie
      ? null
      : bindings.hydrateFromCatalogSnapshot?.(routeParams) || null;

    if (!restoredMovie) {
      bindings.renderSkeleton?.();
    }

    try {
      await bindings.loadByRouteParams?.(routeParams, {
        warmMovie,
        skipRenderIfCacheFresh: Boolean(restoredMovie)
      });
    } catch (error) {
      bindings.onLoadError?.(error);

      const fallbackMovie = bindings.getCurrentMovie?.() || warmMovie;

      if (!fallbackMovie) {
        bindings.renderNotFound?.();
        return;
      }

      bindings.renderMoviePage?.(fallbackMovie);
      bindings.renderReviewsStatus?.('Не удалось обновить рецензии. Попробуй обновить страницу.');
      bindings.renderCommentsStatus?.('Не удалось обновить комментарии. Попробуй обновить страницу.');
    }

    bindings.bindSharedAuthStateListener?.({
      onAfterAuthSync: async () => {
        try {
          await bindings.loadByRouteParams?.(routeParams, {
            skipUserStateFetch: true,
            skipRenderIfCacheFresh: true
          });
        } catch (error) {
          bindings.onAuthSyncError?.(error);
          bindings.renderNotFound?.();
        }
      }
    });
  }

  async function loadDeferredMoviePageSections(movie, bindings = {}, { shouldRender = true } = {}) {
    if (!movie?.id) {
      return;
    }

    const movieId = String(movie.id);
    const shouldKeepRendering = () => String(bindings.getCurrentMovieId?.() || '') === movieId;
    const deferredTasks = [];

    if (typeof bindings.loadSimilarMovies === 'function') {
      deferredTasks.push(bindings.loadSimilarMovies(movie, 4, { shouldRender }));
    }

    if (typeof bindings.fetchReviews === 'function') {
      deferredTasks.push(
        bindings.fetchReviews(movie.id)
          .then(() => {
            if (shouldRender && shouldKeepRendering()) {
              bindings.renderReviewsSection?.(movie);
            }
          })
          .catch(error => {
            bindings.onReviewsLoadError?.(error);

            if (shouldRender && shouldKeepRendering()) {
              bindings.renderReviewsStatus?.(
                'Не удалось обновить рецензии. Попробуй обновить страницу.'
              );
            }
          })
      );
    }

    if (typeof bindings.fetchComments === 'function') {
      deferredTasks.push(
        bindings.fetchComments(movie.id)
          .then(() => {
            if (shouldRender && shouldKeepRendering()) {
              bindings.renderCommentsSection?.(movie);
            }
          })
          .catch(error => {
            bindings.onCommentsLoadError?.(error);

            if (shouldRender && shouldKeepRendering()) {
              bindings.renderCommentsStatus?.(
                'Не удалось обновить комментарии. Попробуй обновить страницу.'
              );
            }
          })
      );
    }

    await Promise.allSettled(deferredTasks);

    if (shouldKeepRendering()) {
      bindings.syncCatalogSnapshot?.(movie.id, {
        syncReviews: true,
        syncMovie: movie
      });
      bindings.persistSessionCache?.();
    }
  }

  async function loadMoviePageByRouteParams(routeParams, bindings = {}, {
    warmMovie = null,
    skipUserStateFetch = false,
    skipRenderIfCacheFresh = false
  } = {}) {
    let movie = typeof bindings.fetchPayloadByRouteParams === 'function'
      ? await bindings.fetchPayloadByRouteParams(routeParams, { skipUserStateFetch })
      : null;
    const isMoviePayloadLoadedByRpc = Boolean(movie);

    if (!movie && typeof bindings.fetchMovieByRouteParams === 'function') {
      movie = await bindings.fetchMovieByRouteParams(routeParams);
    }

    if (!movie) {
      if (warmMovie) {
        bindings.removeMovieFromCatalogSnapshot?.(warmMovie.id);
      }

      bindings.removeSessionCacheForMovie?.(bindings.getCurrentMovie?.() || warmMovie);
      bindings.renderNotFound?.();
      return null;
    }

    const loadTasks = [];

    if (
      bindings.getAreDirectorsAvailable?.() !== false &&
      !Array.isArray(movie.movie_people) &&
      typeof bindings.ensureDirectorItemsLoaded === 'function'
    ) {
      loadTasks.push(bindings.ensureDirectorItemsLoaded(movie));
    }

    if (!isMoviePayloadLoadedByRpc) {
      if (typeof bindings.fetchRatingStats === 'function') {
        loadTasks.push(bindings.fetchRatingStats(movie.id));
      }

      if (typeof bindings.fetchPosterImages === 'function') {
        loadTasks.push(bindings.fetchPosterImages(movie.id));
      }
    }

    if (!isMoviePayloadLoadedByRpc && !skipUserStateFetch) {
      if (typeof bindings.fetchCurrentUserRating === 'function') {
        loadTasks.push(bindings.fetchCurrentUserRating(movie.id));
      }

      if (typeof bindings.fetchCurrentUserWatchlist === 'function') {
        loadTasks.push(bindings.fetchCurrentUserWatchlist(movie.id));
      }
    }

    if (String(bindings.getCurrentMovieId?.() || '') !== String(movie.id || '')) {
      bindings.resetComposerState?.();
    }

    bindings.setCurrentMovie?.(movie);

    await Promise.all(loadTasks);

    const cacheEntry = typeof bindings.createSessionCacheEntry === 'function'
      ? bindings.createSessionCacheEntry(movie)
      : null;
    const cacheSignature = cacheEntry?.signature || '';
    const activeCacheSignature = String(bindings.getActiveSessionCacheSignature?.() || '');
    const shouldSkipRender = Boolean(
      skipRenderIfCacheFresh &&
      activeCacheSignature &&
      cacheSignature &&
      activeCacheSignature === cacheSignature &&
      bindings.hasRenderedMoviePage?.()
    );

    if (cacheSignature || activeCacheSignature) {
      bindings.setActiveSessionCacheSignature?.(cacheSignature || activeCacheSignature);
    }

    if (!shouldSkipRender) {
      bindings.renderMoviePage?.(movie, {
        socialLoading: true,
        similarLoading: true
      });
    } else {
      return movie;
    }

    if (typeof bindings.loadDeferredSections === 'function') {
      await bindings.loadDeferredSections(movie, { shouldRender: true });
    }

    return movie;
  }

  return {
    getMoviePageRouteParams,
    initMoviePage,
    loadMoviePageByRouteParams,
    loadDeferredMoviePageSections
  };
}
