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

  async function initMoviePage(bindings) {
    const routeParams = typeof bindings.getRouteParams === 'function'
      ? bindings.getRouteParams()
      : getMoviePageRouteParams();

    if (!routeParams) {
      bindings.renderNotFound();
      bindings.onShellReady?.();
      return;
    }

    await bindings.restoreSession();

    bindings.trackEmailConfirmedLoginIfNeeded?.();

    await bindings.ensureDetailModulesLoaded();

    const restoredMovie = await bindings.restoreFromSessionCache(routeParams);
    const warmMovie = restoredMovie
      ? null
      : bindings.hydrateFromCatalogSnapshot(routeParams) || null;
    const hasWarmDom = Boolean(bindings.hasWarmStartedDom());

    if (!restoredMovie && !hasWarmDom) {
      bindings.renderSkeleton();
    }

    bindings.onShellReady?.();

    try {
      await bindings.loadByRouteParams(routeParams, {
        warmMovie,
        skipRenderIfCacheFresh: Boolean(restoredMovie)
      });
    } catch (error) {
      bindings.onLoadError?.(error);

      const fallbackMovie = bindings.getCurrentMovie() || warmMovie;

      if (!fallbackMovie) {
        bindings.renderNotFound();
        return;
      }

      bindings.renderMoviePage(fallbackMovie);
      bindings.renderReviewsStatus('Не удалось обновить рецензии. Попробуй обновить страницу.');
      bindings.renderCommentsStatus('Не удалось обновить комментарии. Попробуй обновить страницу.');
    }

    bindings.bindSharedAuthStateListener({
      onAfterAuthSync: async () => {
        try {
          await bindings.loadByRouteParams(routeParams, {
            skipUserStateFetch: true,
            skipRenderIfCacheFresh: true
          });
        } catch (error) {
          bindings.onAuthSyncError?.(error);
          bindings.renderNotFound();
        }
      }
    });
  }

  async function loadDeferredMoviePageSections(movie, bindings, { shouldRender = true } = {}) {
    if (!movie?.id) {
      return;
    }

    const movieId = String(movie.id);
    const shouldKeepRendering = () => String(bindings.getCurrentMovieId() || '') === movieId;
    const deferredTasks = [];

    deferredTasks.push(bindings.loadSimilarMovies(movie, 4, { shouldRender }));

    const reviewsTask = bindings.fetchReviews(movie.id)
      .then(() => {
        if (shouldRender && shouldKeepRendering()) {
          bindings.renderReviewsSection(movie);
        }
      })
      .catch(error => {
        bindings.onReviewsLoadError?.(error);

        if (shouldRender && shouldKeepRendering()) {
          bindings.renderReviewsStatus('Не удалось обновить рецензии. Попробуй обновить страницу.');
        }
      });

    deferredTasks.push(
      Promise.allSettled([reviewsTask, bindings.fetchComments(movie.id)]).then(([, comments]) => {
        if (comments.status === 'rejected') {
          bindings.onCommentsLoadError?.(comments.reason);

          if (shouldRender && shouldKeepRendering()) {
            bindings.renderCommentsStatus('Не удалось обновить комментарии. Попробуй обновить страницу.');
          }
        } else if (shouldRender && shouldKeepRendering()) {
          bindings.renderCommentsSection(movie);
        }
      })
    );

    await Promise.allSettled(deferredTasks);

    if (shouldKeepRendering()) {
      bindings.syncCatalogSnapshot(movie.id, {
        syncReviews: true,
        syncMovie: movie
      });
      bindings.persistSessionCache();
    }
  }

  async function loadMoviePageByRouteParams(routeParams, bindings, {
    warmMovie = null,
    skipUserStateFetch = false,
    skipRenderIfCacheFresh = false
  } = {}) {
    let movie = await bindings.fetchPayloadByRouteParams(routeParams, { skipUserStateFetch });
    const isMoviePayloadLoadedByRpc = Boolean(movie);

    if (!movie) {
      movie = await bindings.fetchMovieByRouteParams(routeParams);
    }

    if (!movie) {
      if (warmMovie) {
        bindings.removeMovieFromCatalogSnapshot(warmMovie.id);
      }

      bindings.removeSessionCacheForMovie(bindings.getCurrentMovie() || warmMovie);
      bindings.renderNotFound();
      return null;
    }

    const loadTasks = [];

    if (
      bindings.getAreDirectorsAvailable() !== false &&
      !Array.isArray(movie.movie_people)
    ) {
      loadTasks.push(bindings.ensureDirectorItemsLoaded(movie));
    }

    if (!Array.isArray(movie.movie_companies)) {
      const initialRows = bindings.getInitialCompanyRows(movie);
      if (initialRows) {
        movie.movie_companies = initialRows;
      } else if (bindings.getAreCompaniesAvailable() !== false) {
        loadTasks.push(bindings.ensureCompanyItemsLoaded(movie).catch(bindings.onCompanyLoadError));
      }
    }

    if (!isMoviePayloadLoadedByRpc) {
      loadTasks.push(bindings.fetchRatingStats(movie.id));

      loadTasks.push(bindings.fetchPosterImages(movie.id));
    }

    if (!isMoviePayloadLoadedByRpc && !skipUserStateFetch) {
      loadTasks.push(bindings.fetchCurrentUserRating(movie.id));

      loadTasks.push(bindings.fetchCurrentUserWatchlist(movie.id));
    }

    if (String(bindings.getCurrentMovieId() || '') !== String(movie.id || '')) {
      bindings.resetComposerState();
    }

    bindings.setCurrentMovie(movie);

    await Promise.all(loadTasks);

    if (bindings.getCurrentMovie() !== movie) {
      return movie;
    }

    const cacheEntry = bindings.createSessionCacheEntry(movie);
    const cacheSignature = cacheEntry?.signature || '';
    const activeCacheSignature = String(bindings.getActiveSessionCacheSignature() || '');
    const hasRestoredSocial = skipRenderIfCacheFresh && bindings.hasRenderedMoviePage();
    const shouldSkipRender = Boolean(
      hasRestoredSocial &&
      activeCacheSignature &&
      cacheSignature &&
      activeCacheSignature === cacheSignature
    );

    if (cacheSignature || activeCacheSignature) {
      bindings.setActiveSessionCacheSignature(cacheSignature || activeCacheSignature);
    }

    if (!shouldSkipRender) {
      bindings.renderMoviePage(movie, {
        socialLoading: !hasRestoredSocial || skipUserStateFetch,
        similarLoading: true
      });
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
