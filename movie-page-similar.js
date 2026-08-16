export function createMoviePageSimilarController(context = {}) {
  const {
    escapeHtml = value => String(value ?? ''),
    buildMoviePageUrl = () => '#',
    getCatalogMovieById = () => null,
    getCatalogMovieMeta = () => ({ genresText: '', countriesText: '' }),
    getMovieAverageRating = () => 0,
    getMovieVotesCount = () => 0,
    getMoviePreferredPosterUrl = () => '',
    getPosterImageAttributeHtml = imageUrl => `src="${escapeHtml(imageUrl)}"`,
    getVotesLabel = () => 'оценок',
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

  function getMoviePageSimilarSelectedMovies(selectedMovieIds = []) {
    return normalizeManualSimilarMovieIds(selectedMovieIds)
      .map(movieId => getCatalogMovieById(movieId))
      .filter(Boolean);
  }

  function getMoviePageSimilarEditorStatusHtml({
    status = '',
    statusType = ''
  } = {}) {
    if (!status) {
      return '';
    }

    const statusClassName = statusType ? ` is-${statusType}` : '';

    return `
    <div class="movie-page-similar-editor-status${statusClassName}" aria-live="polite">
      ${escapeHtml(status)}
    </div>
  `;
  }

  function getMoviePageSimilarEditorSuggestionsHtml(movie, {
    movies = [],
    selectedMovieIds = [],
    query = '',
    isSaving = false,
    limit = 8
  } = {}) {
    const trimmedQuery = String(query || '').trim();

    if (!trimmedQuery) {
      return `
      <div class="movie-page-similar-editor-hint">
        Начни вводить название, оригинальное название или режиссёра.
      </div>
    `;
    }

    if (!Array.isArray(movies) || movies.length === 0) {
      return `
      <div class="movie-page-similar-editor-hint">
        Загружаю каталог для поиска...
      </div>
    `;
    }

    const suggestions = getMoviePageSimilarSearchSuggestions({
      movie,
      movies,
      selectedMovieIds,
      query,
      limit
    });

    if (suggestions.length === 0) {
      return `
      <div class="movie-page-similar-editor-hint">
        Ничего не найдено.
      </div>
    `;
    }

    return `
    <div class="movie-page-similar-editor-suggestions" role="listbox" aria-label="Найденные фильмы">
      ${suggestions.map(suggestion => `
        <button
          type="button"
          class="movie-page-similar-suggestion"
          data-movie-page-similar-add="${escapeHtml(suggestion.id)}"
          role="option"
          ${isSaving ? 'disabled' : ''}
        >
          ${escapeHtml(getManualSimilarMovieLabel(suggestion))}
        </button>
      `).join('')}
    </div>
  `;
  }

  function getMoviePageSimilarEditorListHtml({
    selectedMovieIds = [],
    draggedMovieId = '',
    isSaving = false
  } = {}) {
    const selectedMovies = getMoviePageSimilarSelectedMovies(selectedMovieIds);

    if (selectedMovies.length === 0) {
      return `
      <div class="movie-page-similar-editor-empty">
        Похожие фильмы пока не выбраны.
      </div>
    `;
    }

    return `
    <div class="movie-page-similar-editor-list" data-movie-page-similar-editor-list="true">
      ${selectedMovies.map((movie, index) => {
        const movieId = String(movie.id);
        const isFirst = index === 0;
        const isLast = index === selectedMovies.length - 1;
        const isDragging = String(draggedMovieId || '') === movieId;

        return `
          <div
            class="movie-page-similar-editor-item${isDragging ? ' is-dragging' : ''}"
            data-movie-page-similar-editor-item="${escapeHtml(movieId)}"
            draggable="${isSaving ? 'false' : 'true'}"
          >
            <button
              type="button"
              class="movie-page-similar-drag-handle"
              aria-label="Перетащить ${escapeHtml(getManualSimilarMovieLabel(movie))}"
              title="Перетащить"
              ${isSaving ? 'disabled' : ''}
            >
              ≡
            </button>

            <div class="movie-page-similar-editor-item-main">
              <div class="movie-page-similar-editor-item-title">
                ${escapeHtml(movie.title || getManualSimilarMovieLabel(movie))}
              </div>
              <div class="movie-page-similar-editor-item-meta">
                ${escapeHtml([movie.original_title, movie.year].filter(Boolean).join(' · '))}
              </div>
            </div>

            <div class="movie-page-similar-editor-item-actions">
              <button
                type="button"
                class="movie-page-similar-editor-icon-button"
                data-movie-page-similar-move="${escapeHtml(movieId)}"
                data-movie-page-similar-direction="-1"
                aria-label="Поднять выше"
                title="Поднять выше"
                ${isFirst || isSaving ? 'disabled' : ''}
              >
                ↑
              </button>
              <button
                type="button"
                class="movie-page-similar-editor-icon-button"
                data-movie-page-similar-move="${escapeHtml(movieId)}"
                data-movie-page-similar-direction="1"
                aria-label="Опустить ниже"
                title="Опустить ниже"
                ${isLast || isSaving ? 'disabled' : ''}
              >
                ↓
              </button>
              <button
                type="button"
                class="movie-page-similar-editor-icon-button movie-page-similar-editor-remove-button"
                data-movie-page-similar-remove="${escapeHtml(movieId)}"
                aria-label="Убрать из похожих"
                title="Убрать"
                ${isSaving ? 'disabled' : ''}
              >
                ×
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  }

  function getMoviePageSimilarEditorHtml(movie, state = {}) {
    const {
      isAdmin = false,
      isManualSimilarAvailable = true,
      query = '',
      isSaving = false
    } = state;

    if (!isAdmin || !movie?.id) {
      return '';
    }

    if (!isManualSimilarAvailable) {
      return `
      <div class="movie-page-similar-editor">
        <div class="movie-page-similar-editor-hint">
          Таблица ручных похожих недоступна.
        </div>
      </div>
    `;
    }

    return `
    <div class="movie-page-similar-editor" data-movie-page-similar-editor="true">
      <div class="movie-page-similar-editor-search">
        <label class="movie-page-similar-editor-label" for="moviePageSimilarSearch">
          Быстро добавить
        </label>
        <input
          id="moviePageSimilarSearch"
          type="search"
          class="movie-page-similar-editor-input"
          placeholder="Название, оригинальное название, режиссёр"
          value="${escapeHtml(query)}"
          autocomplete="off"
          spellcheck="false"
          data-movie-page-similar-search="true"
          ${isSaving ? 'disabled' : ''}
        >
        ${getMoviePageSimilarEditorSuggestionsHtml(movie, state)}
      </div>

      <div class="movie-page-similar-editor-selected">
        <div class="movie-page-similar-editor-label">Порядок похожих</div>
        ${getMoviePageSimilarEditorListHtml(state)}
      </div>

      ${getMoviePageSimilarEditorStatusHtml(state)}
    </div>
  `;
  }

  function getMoviePageSimilarSectionHtml(similarMovies, movie = null, state = {}) {
    const { isLoading = false } = state;
    const hasSimilarMovies = Array.isArray(similarMovies) && similarMovies.length > 0;
    const editorHtml = isLoading ? '' : getMoviePageSimilarEditorHtml(movie, state);

    if (!hasSimilarMovies && !editorHtml) {
      if (isLoading) {
        return `
  <section class="movie-page-similar-block" aria-labelledby="moviePageSimilarTitle">
    <h2 id="moviePageSimilarTitle" class="movie-page-subtitle">Похожие фильмы</h2>
    <div class="movie-page-similar-empty-state">
      Загружаю похожие фильмы...
    </div>
  </section>
      `;
      }

      return '';
    }

    return `
  <section class="movie-page-similar-block" aria-labelledby="moviePageSimilarTitle">
  <h2 id="moviePageSimilarTitle" class="movie-page-subtitle">Похожие фильмы</h2>
  ${editorHtml}
  ${
    hasSimilarMovies
      ? `
        <div class="movie-page-similar-grid">
          ${similarMovies.map(similarMovie => getMoviePageSimilarCardHtml(similarMovie)).join('')}
        </div>
      `
      : `
        <div class="movie-page-similar-empty-state">
          Похожие фильмы пока не выбраны.
        </div>
      `
  }
    </section>
  `;
  }

  function getMoviePageSimilarCardHtml(movie) {
    const meta = getCatalogMovieMeta(movie);
    const genres = meta.genresText;
    const countries = meta.countriesText;
    const averageRating = getMovieAverageRating(movie.id);
    const votesCount = getMovieVotesCount(movie.id);
    const posterUrl = getMoviePreferredPosterUrl(movie);

    return `
    <article class="movie-page-similar-card" data-movie-id="${escapeHtml(movie.id)}">
      <a href="${escapeHtml(buildMoviePageUrl(movie))}" class="movie-page-similar-poster-link" aria-label="Перейти к фильму ${escapeHtml(movie.title)}">
        <div class="movie-page-similar-poster-wrapper">
          ${
            posterUrl
              ? `
                <img
                  class="movie-page-similar-poster"
                  ${getPosterImageAttributeHtml(posterUrl, 'similar')}
                  alt="Постер фильма ${escapeHtml(movie.title)}"
                  loading="lazy"
                  decoding="async"
                >
              `
              : `<div class="movie-poster-placeholder">Нет постера</div>`
          }
        </div>
      </a>

      <div class="movie-page-similar-content">
        <h3 class="movie-page-similar-title">
          <a href="${escapeHtml(buildMoviePageUrl(movie))}" class="movie-title-link">${escapeHtml(movie.title)}</a>
        </h3>

        ${
          movie.original_title
            ? `<div class="movie-page-similar-original-title">${escapeHtml(movie.original_title)}</div>`
            : ''
        }

        <div class="movie-page-similar-meta">Год: ${movie.year ?? '-'}</div>
        <div class="movie-page-similar-meta">Режиссёр: ${movie.director ? escapeHtml(movie.director) : '-'}</div>
        <div class="movie-page-similar-meta">Жанры: ${genres ? escapeHtml(genres) : '-'}</div>
        <div class="movie-page-similar-meta">Страны: ${countries ? escapeHtml(countries) : '-'}</div>

        <div class="movie-rating-summary movie-page-similar-rating-summary">
          <div class="movie-rating-summary-main">
            <span class="movie-rating-value">${averageRating.toFixed(1)}</span>
            <span class="movie-rating-meta">(${votesCount} ${getVotesLabel(votesCount)})</span>
          </div>
        </div>
      </div>
    </article>
  `;
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
    getMoviePageSimilarSelectedMovies,
    getMoviePageSimilarEditorStatusHtml,
    getMoviePageSimilarEditorSuggestionsHtml,
    getMoviePageSimilarEditorListHtml,
    getMoviePageSimilarEditorHtml,
    getMoviePageSimilarSectionHtml,
    getMoviePageSimilarCardHtml,
    getMoviePageSimilarIdsAfterMove,
    getMoviePageSimilarIdsAfterDrop
  };
}
