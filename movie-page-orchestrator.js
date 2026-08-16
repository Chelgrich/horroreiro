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

  return {
    getMoviePageRouteParams,
    loadDeferredMoviePageSections
  };
}
