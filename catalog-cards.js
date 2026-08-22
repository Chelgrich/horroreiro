export function createCatalogCardController(context = {}) {
  const {
    document: documentRef = globalThis.document,
    getDefaultSearchQuery = () => '',
    getSearchQueryWords = () => [],
    createSearchHighlighter = () => value => escapeHtml(value),
    escapeHtml = value => String(value ?? ''),
    getHasCurrentUser = () => false,
    getIsAdmin = () => false,
    getCurrentUserRating = () => null,
    getCurrentUserMovieState = () => ({ isWatched: false, isInWatchlist: false }),
    getCatalogMovieMeta = movie => ({ cardRender: movie?.cardRender || {} }),
    getMatchedSearchAlias = () => null,
    getMovieAverageRating = () => 0,
    getMovieVotesCount = () => 0,
    getVotesLabel = () => '',
    getCatalogProfileRatingHtml = () => '',
    getMoviePreferredPosterUrl = movie => String(movie?.poster_url || '').trim(),
    isPosterLoaded = () => false,
    getPosterImageAttributeHtml = () => '',
    bindPosterLoadState = () => {},
    isRatingRequestInFlight = () => false,
    isWatchlistRequestInFlight = () => false
  } = context;

  const userRatingControlsHtmlCache = new Map();

  function hasCurrentUser() {
    return Boolean(getHasCurrentUser());
  }

  function createMovieCardRenderContext(searchQuery = getDefaultSearchQuery()) {
    return {
      searchQuery,
      queryWords: getSearchQueryWords(searchQuery),
      highlightText: createSearchHighlighter(searchQuery)
    };
  }

  function getHighlightedCatalogText(value, renderContext, fallbackHtml = escapeHtml(value)) {
    return renderContext.queryWords.length > 0
      ? renderContext.highlightText(value)
      : fallbackHtml;
  }

  function getUserRatingControlsHtml(currentUserRating, isRatingBusy = false) {
    if (!hasCurrentUser()) {
      return '';
    }

    const hasCurrentUserRating = currentUserRating !== null;
    const normalizedRating = currentUserRating ?? 0;
    const cacheKey = `${normalizedRating}:${isRatingBusy ? 'busy' : 'idle'}`;

    if (userRatingControlsHtmlCache.has(cacheKey)) {
      return userRatingControlsHtmlCache.get(cacheKey);
    }

    const controlsHtml = `
      <div class="movie-user-rating">
        <div class="movie-user-rating-label">Ваша оценка</div>

        <div class="movie-user-rating-desktop">
          <div class="movie-user-rating-stars ${isRatingBusy ? 'is-busy' : ''}" data-current-rating="${normalizedRating}">
            ${Array.from({ length: 10 }, (_, index) => {
              const value = index + 1;
              const isActive = hasCurrentUserRating && value <= currentUserRating;

              return `
                <button
                  type="button"
                  class="rating-star-btn ${isActive ? 'is-active' : ''}"
                  data-rating-value="${value}"
                  aria-label="Оценка ${value} из 10"
                  ${isRatingBusy ? 'disabled' : ''}
                >
                  ★
                </button>
              `;
            }).join('')}
          </div>

          <div class="movie-user-rating-scale" aria-hidden="true">
            ${Array.from({ length: 10 }, (_, index) => `
              <span class="movie-user-rating-scale-item">${index + 1}</span>
            `).join('')}
          </div>
        </div>

        <div class="movie-user-rating-mobile">
          <button
            type="button"
            class="movie-user-rating-mobile-trigger secondary-button secondary-button-compact ${hasCurrentUserRating ? 'is-rated' : ''}"
            data-open-mobile-rating="true"
            ${isRatingBusy ? 'disabled' : ''}
          >
            ${hasCurrentUserRating ? `${currentUserRating}/10 <span class="movie-user-rating-mobile-star">★</span>` : 'Оценить'}
          </button>
        </div>
      </div>
    `;

    userRatingControlsHtmlCache.set(cacheKey, controlsHtml);

    return controlsHtml;
  }

  function getMovieCardDetailsHtml(movie, renderContext, cardRenderMeta) {
    if (renderContext.queryWords.length === 0) {
      return cardRenderMeta.staticDetailsHtml;
    }

    const titleHtml = getHighlightedCatalogText(movie.title, renderContext, cardRenderMeta.escapedTitle);
    const originalTitleHtml = movie.original_title
      ? getHighlightedCatalogText(movie.original_title, renderContext, cardRenderMeta.escapedOriginalTitle)
      : '';
    const directorHtml = movie.director
      ? getHighlightedCatalogText(movie.director, renderContext, cardRenderMeta.escapedDirector)
      : '-';

    return `
      <h5 class="movie-title">
        <a href="${cardRenderMeta.escapedPageUrl}" class="movie-title-link">${titleHtml}</a>
      </h5>

      ${originalTitleHtml ? `<p>Оригинальное название: ${originalTitleHtml}</p>` : ''}
      <p>Год: ${escapeHtml(movie.year ?? '-')}</p>
      <p>Режиссёр: ${directorHtml}</p>
      <p>Жанры: ${cardRenderMeta.escapedGenres}</p>
      <p>Страны: ${cardRenderMeta.escapedCountries}</p>
      ${cardRenderMeta.escapedRuntime ? `<p>Время: ${cardRenderMeta.escapedRuntime}</p>` : ''}
    `;
  }

  function getPosterHtml(
    movie,
    userMovieState,
    matchedSearchAlias = null,
    renderContext = createMovieCardRenderContext(),
    isWatchlistBusy = false,
    cardRenderMeta = getCatalogMovieMeta(movie).cardRender,
    renderOptions = {}
  ) {
    const posterUrl = getMoviePreferredPosterUrl(movie);
    const hasLoadedPoster = posterUrl && isPosterLoaded(posterUrl);
    const isPriorityPoster = Boolean(renderOptions.isPriorityPoster);
    const matchedSearchAliasHtml = matchedSearchAlias
      ? getHighlightedCatalogText(matchedSearchAlias, renderContext)
      : '';

    return `
      <div class="movie-poster-block">
        <a href="${cardRenderMeta.escapedPageUrl}" class="movie-poster-link" aria-label="${cardRenderMeta.escapedPageLabel}">
          <div class="movie-poster-wrapper">
            ${
              posterUrl
                ? `
                  <div class="movie-poster-skeleton ${hasLoadedPoster ? 'is-hidden' : ''}" aria-hidden="true"></div>
                  <img
                    class="movie-poster ${hasLoadedPoster ? 'is-loaded' : ''}"
                    ${getPosterImageAttributeHtml(posterUrl, 'catalog')}
                    alt="${cardRenderMeta.escapedPosterAlt}"
                    loading="${isPriorityPoster ? 'eager' : 'lazy'}"
                    decoding="async"
                    ${isPriorityPoster ? 'fetchpriority="high"' : ''}
                  >
                `
                : `<div class="movie-poster-placeholder">Нет постера</div>`
            }

            ${
              matchedSearchAlias
                ? `
                  <div class="movie-search-alias-hint">
                    <span class="movie-search-alias-hint-label">Альт:</span>
                    ${matchedSearchAliasHtml}
                  </div>
                `
                : ''
            }

            ${
              hasCurrentUser() && !userMovieState.isWatched
                ? `
                  <button
                    type="button"
                    class="movie-watchlist-btn ${userMovieState.isInWatchlist ? 'is-active' : ''}"
                    data-watchlist-toggle="true"
                    aria-label="${userMovieState.isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
                    title="${userMovieState.isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
                    ${isWatchlistBusy ? 'disabled' : ''}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                `
                : ''
            }

            ${
              userMovieState.isWatched
                ? `
                  <div class="movie-watched-icon" aria-label="Просмотрено" title="Просмотрено">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5L9.5 17L19 7.5"></path>
                    </svg>
                  </div>
                `
                : ''
            }
          </div>
        </a>
      </div>
    `;
  }

  function createMovieCard(
    movie,
    renderContext = createMovieCardRenderContext(),
    renderOptions = {}
  ) {
    const card = documentRef.createElement('article');
    const movieId = movie.id;
    const currentUserRating = getCurrentUserRating(movieId);
    const userMovieState = getCurrentUserMovieState(movieId) || {};
    const meta = getCatalogMovieMeta(movie);
    const cardRenderMeta = meta.cardRender;
    const matchedSearchAlias = getMatchedSearchAlias(
      movie,
      renderContext.searchQuery,
      renderContext.queryWords
    );

    card.className = 'movie-card';

    if (userMovieState.isWatched) {
      card.classList.add('movie-card-rated');
    } else if (userMovieState.isInWatchlist) {
      card.classList.add('movie-card-watchlist');
    }
    card.dataset.movieId = String(movieId);

    const averageRating = getMovieAverageRating(movieId);
    const votesCount = getMovieVotesCount(movieId);
    const isRatingBusy = isRatingRequestInFlight(movieId);
    const isWatchlistBusy = isWatchlistRequestInFlight(movieId);

    const ratingSummaryHtml = `
      <div class="movie-rating-summary">
        <div class="movie-rating-summary-main">
          <span class="movie-rating-value">${averageRating.toFixed(1)}</span>
          <span class="movie-rating-meta">
            (${votesCount} ${getVotesLabel(votesCount)})
          </span>
        </div>
        <button
          type="button"
          class="remove-rating-inline-btn secondary-button secondary-button-compact ${currentUserRating === null ? 'is-hidden-placeholder' : ''}"
          data-remove-rating="true"
          ${currentUserRating === null ? 'tabindex="-1" aria-hidden="true"' : ''}
          ${isRatingBusy || currentUserRating === null ? 'disabled' : ''}
        >
          Удалить оценку
        </button>
      </div>
    `;

    const userRatingControlsHtml = getUserRatingControlsHtml(currentUserRating, isRatingBusy);
    const profileRatingHtml = getCatalogProfileRatingHtml(movieId);
    const posterHtml = getPosterHtml(
      movie,
      userMovieState,
      matchedSearchAlias,
      renderContext,
      isWatchlistBusy,
      cardRenderMeta,
      renderOptions
    );
    const detailsHtml = getMovieCardDetailsHtml(movie, renderContext, cardRenderMeta);

    card.innerHTML = `
      ${posterHtml}

      ${detailsHtml}

      <div class="movie-rating-block">
        ${cardRenderMeta.externalLinksToggleHtml}
        ${cardRenderMeta.externalLinksBlockHtml}
        ${ratingSummaryHtml}
        ${profileRatingHtml}
        ${userRatingControlsHtml}
      </div>

      ${getIsAdmin() ? `
        <div class="movie-card-actions">
          <button type="button" class="edit-movie-btn">Редактировать</button>
          <button type="button" class="delete-movie-btn secondary-button">Удалить</button>
        </div>
      ` : ''}
    `;

    const posterImage = card.querySelector('.movie-poster');
    const posterSkeleton = card.querySelector('.movie-poster-skeleton');

    bindPosterLoadState(posterImage, posterSkeleton);

    return card;
  }

  return {
    createMovieCardRenderContext,
    createMovieCard
  };
}
