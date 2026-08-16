export function createMovieUserStateController(context = {}) {
  function getHostWindow() {
    return context.window || globalThis.window || null;
  }

  function isRequestSetLike(requestSet) {
    return Boolean(
      requestSet &&
      typeof requestSet.has === 'function' &&
      typeof requestSet.add === 'function' &&
      typeof requestSet.delete === 'function'
    );
  }

  async function runMovieMutationWithUiSync({
    movieId,
    requestSet,
    mutation,
    rerender,
    onSuccess,
    onError,
    preserveWindowScroll = false
  }) {
    if (typeof mutation !== 'function') {
      return;
    }

    const movieKey = String(movieId);
    const hasRequestSet = isRequestSetLike(requestSet);
    const hostWindow = getHostWindow();
    const scrollYBeforeMutation = Number(hostWindow?.scrollY || 0);

    if (hasRequestSet && requestSet.has(movieKey)) {
      return;
    }

    if (hasRequestSet) {
      requestSet.add(movieKey);
    }

    let actionSucceeded = false;

    try {
      await mutation();
      actionSucceeded = true;
    } catch (error) {
      if (typeof onError === 'function') {
        onError(error);
        return;
      }

      throw error;
    } finally {
      if (hasRequestSet) {
        requestSet.delete(movieKey);
      }

      if (actionSucceeded) {
        context.markLocalDataMutation?.(`movie-user-state:${movieId}`);
        context.syncCatalogSnapshot?.(movieId);
        rerender?.();
        onSuccess?.();

        if (
          preserveWindowScroll &&
          typeof hostWindow?.requestAnimationFrame === 'function' &&
          typeof hostWindow?.scrollTo === 'function'
        ) {
          hostWindow.requestAnimationFrame(() => {
            hostWindow.scrollTo({
              top: scrollYBeforeMutation,
              behavior: 'auto'
            });
          });
        }
      }
    }
  }

  async function toggleMovieWatchlist(movieId) {
    if (!context.getCurrentUser?.()) {
      return;
    }

    if (context.isMovieWatchedByCurrentUser?.(movieId)) {
      return;
    }

    const shouldRemoveFromWatchlist = Boolean(context.hasMovieWatchlistRecord?.(movieId));

    await runMovieMutationWithUiSync({
      movieId,
      requestSet: context.getWatchlistRequestSet?.(),
      mutation: async () => {
        if (shouldRemoveFromWatchlist) {
          await context.removeFromWatchlist?.(movieId);
        } else {
          await context.addToWatchlist?.(movieId);
        }
      },
      rerender: () => {
        context.rerenderWatchlistToggle?.(movieId);
      },
      onSuccess: () => {
        context.showWatchlistFeedback?.(
          movieId,
          shouldRemoveFromWatchlist ? 'remove' : 'success'
        );
      },
      onError: context.onWatchlistToggleError
    });
  }

  async function removeUserMovieRating(movieId) {
    if (!context.getCurrentUser?.()) {
      return;
    }

    const previousRating = context.getCurrentUserRating?.(movieId);

    await runMovieMutationWithUiSync({
      movieId,
      requestSet: context.getRatingRequestSet?.(),
      mutation: () => context.deleteRating?.(movieId, previousRating),
      rerender: () => {
        context.rerenderRatingChange?.(movieId);
      },
      onSuccess: () => {
        context.showRatingFeedback?.(movieId, 'remove');
      },
      onError: context.onRemoveRatingError
    });
  }

  async function saveUserMovieRating(movieId, ratingValue) {
    if (!context.getCurrentUser?.()) {
      return;
    }

    // Rating a movie must not create, remove, or restore a watchlist row.
    const normalizedRating = Number(ratingValue);

    if (
      !Number.isInteger(normalizedRating) ||
      normalizedRating < 1 ||
      normalizedRating > 10
    ) {
      return;
    }

    const previousRating = context.getCurrentUserRating?.(movieId);

    await runMovieMutationWithUiSync({
      movieId,
      requestSet: context.getRatingRequestSet?.(),
      mutation: () => context.upsertRating?.(movieId, normalizedRating, previousRating),
      rerender: () => {
        context.rerenderRatingChange?.(movieId);
      },
      onSuccess: () => {
        context.showRatingFeedback?.(movieId);
      },
      onError: context.onSaveRatingError
    });
  }

  return {
    runMovieMutationWithUiSync,
    toggleMovieWatchlist,
    removeUserMovieRating,
    saveUserMovieRating
  };
}
