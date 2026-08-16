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

  function focusMoviePageSimilarSearch(rootElement, selectionStart = null) {
    requestAnimationFrame(() => {
      const searchInputElement = rootElement?.querySelector('[data-movie-page-similar-search="true"]');

      if (!searchInputElement) {
        return;
      }

      searchInputElement.focus();

      if (
        Number.isFinite(selectionStart) &&
        typeof searchInputElement.setSelectionRange === 'function'
      ) {
        searchInputElement.setSelectionRange(selectionStart, selectionStart);
      }
    });
  }

  function getBindingSelectedMovieIds(bindings = {}) {
    const selectedMovieIds = typeof bindings.getSelectedMovieIds === 'function'
      ? bindings.getSelectedMovieIds()
      : bindings.selectedMovieIds;

    return normalizeManualSimilarMovieIds(selectedMovieIds);
  }

  function getBindingDraggedMovieId(bindings = {}) {
    if (typeof bindings.getDraggedMovieId === 'function') {
      return String(bindings.getDraggedMovieId() || '');
    }

    return String(bindings.draggedMovieId || '');
  }

  function isBindingSaving(bindings = {}) {
    if (typeof bindings.getIsSaving === 'function') {
      return Boolean(bindings.getIsSaving());
    }

    return Boolean(bindings.isSaving);
  }

  function getBindingMovie(bindings = {}) {
    if (typeof bindings.getMovie === 'function') {
      return bindings.getMovie();
    }

    return bindings.movie || null;
  }

  function isBindingAdmin(bindings = {}) {
    if (typeof bindings.getIsAdmin === 'function') {
      return Boolean(bindings.getIsAdmin());
    }

    return Boolean(bindings.isAdmin);
  }

  function getBindingSelectedMovies(bindings = {}) {
    if (typeof bindings.getSelectedMovies === 'function') {
      const selectedMovies = bindings.getSelectedMovies();
      return Array.isArray(selectedMovies) ? selectedMovies : [];
    }

    return Array.isArray(bindings.selectedMovies) ? bindings.selectedMovies : [];
  }

  function setBindingSelectedMovieIds(bindings = {}, movieIds = []) {
    if (typeof bindings.setSelectedMovieIds === 'function') {
      bindings.setSelectedMovieIds(normalizeManualSimilarMovieIds(movieIds));
    }
  }

  function setBindingSelectedMovies(bindings = {}, movies = []) {
    if (typeof bindings.setSelectedMovies === 'function') {
      bindings.setSelectedMovies(Array.isArray(movies) ? movies : []);
    }
  }

  function setBindingSaving(bindings = {}, isSaving = false) {
    if (typeof bindings.setIsSaving === 'function') {
      bindings.setIsSaving(Boolean(isSaving));
    }
  }

  function setBindingQuery(bindings = {}, query = '') {
    if (typeof bindings.setQuery === 'function') {
      bindings.setQuery(String(query || ''));
    }
  }

  function setBindingStatus(bindings = {}, message = '', type = '') {
    if (typeof bindings.setStatus === 'function') {
      bindings.setStatus(message, type);
    }
  }

  function setBindingDraggedMovieId(bindings = {}, movieId = null) {
    if (typeof bindings.onDraggedMovieIdChange === 'function') {
      bindings.onDraggedMovieIdChange(movieId);
    }
  }

  function renderBindingSection(bindings = {}, movieId = '') {
    if (typeof bindings.renderSection === 'function') {
      bindings.renderSection(movieId);
    }
  }

  async function saveMoviePageSimilarEditorIds(
    nextMovieIds,
    bindings = {},
    successMessage = 'Похожие фильмы сохранены.'
  ) {
    const movie = getBindingMovie(bindings);
    const movieId = String(movie?.id || '');

    if (!isBindingAdmin(bindings) || !movieId || isBindingSaving(bindings)) {
      return;
    }

    const normalizedMovieIds = normalizeManualSimilarMovieIds(nextMovieIds, movieId);
    const previousMovieIds = getBindingSelectedMovieIds(bindings);
    const previousMovies = getBindingSelectedMovies(bindings);

    setBindingSelectedMovieIds(bindings, normalizedMovieIds);
    setBindingSelectedMovies(
      bindings,
      normalizedMovieIds
        .map(similarMovieId => getCatalogMovieById(similarMovieId))
        .filter(Boolean)
    );
    setBindingSaving(bindings, true);
    setBindingStatus(bindings, 'Сохраняю похожие фильмы...');
    renderBindingSection(bindings, movieId);

    try {
      if (typeof bindings.replaceManualSimilarMovies !== 'function') {
        throw new Error('Не удалось сохранить похожие фильмы.');
      }

      await bindings.replaceManualSimilarMovies(movieId, normalizedMovieIds);

      const savedMovieIds = typeof bindings.getManualSimilarMovieIds === 'function'
        ? normalizeManualSimilarMovieIds(bindings.getManualSimilarMovieIds(movieId), movieId)
        : normalizedMovieIds;
      const savedMovies = typeof bindings.fetchSimilarCardMoviesByIds === 'function'
        ? await bindings.fetchSimilarCardMoviesByIds(savedMovieIds)
        : savedMovieIds
          .map(similarMovieId => getCatalogMovieById(similarMovieId))
          .filter(Boolean);

      setBindingSelectedMovieIds(bindings, savedMovieIds);
      setBindingSelectedMovies(bindings, savedMovies);
      setBindingQuery(bindings, '');
      setBindingStatus(bindings, successMessage, 'success');
    } catch (error) {
      if (typeof bindings.onSaveError === 'function') {
        bindings.onSaveError(error);
      }

      setBindingSelectedMovieIds(bindings, previousMovieIds);
      setBindingSelectedMovies(bindings, previousMovies);
      setBindingStatus(
        bindings,
        error?.message || 'Не удалось сохранить похожие фильмы.',
        'error'
      );
    } finally {
      setBindingSaving(bindings, false);
      setBindingDraggedMovieId(bindings, null);
      renderBindingSection(bindings, movieId);
    }
  }

  function bindMoviePageSimilarEditorEvents(movie, bindings = {}) {
    const {
      rootElement = null
    } = bindings;
    const editor = rootElement?.querySelector('[data-movie-page-similar-editor="true"]');

    if (!editor || !movie?.id) {
      return;
    }

    editor
      .querySelector('[data-movie-page-similar-search="true"]')
      ?.addEventListener('input', event => {
        const searchInputElement = event.currentTarget;
        const selectionStart = searchInputElement.selectionStart;

        setBindingQuery(bindings, searchInputElement.value);
        setBindingStatus(bindings);
        renderBindingSection(bindings, movie.id);
        focusMoviePageSimilarSearch(rootElement, selectionStart);
      });

    editor.addEventListener('click', event => {
      const addButton = event.target.closest('[data-movie-page-similar-add]');
      const removeButton = event.target.closest('[data-movie-page-similar-remove]');
      const moveButton = event.target.closest('[data-movie-page-similar-move]');

      if (addButton) {
        saveMoviePageSimilarEditorIds(
          [...getBindingSelectedMovieIds(bindings), addButton.dataset.moviePageSimilarAdd],
          bindings,
          'Похожий фильм добавлен.'
        );
        return;
      }

      if (removeButton) {
        const movieId = removeButton.dataset.moviePageSimilarRemove;

        saveMoviePageSimilarEditorIds(
          getBindingSelectedMovieIds(bindings)
            .filter(similarMovieId => String(similarMovieId) !== String(movieId)),
          bindings,
          'Похожий фильм убран.'
        );
        return;
      }

      if (moveButton) {
        saveMoviePageSimilarEditorIds(
          getMoviePageSimilarIdsAfterMove(
            getBindingSelectedMovieIds(bindings),
            moveButton.dataset.moviePageSimilarMove,
            Number(moveButton.dataset.moviePageSimilarDirection || 0)
          ),
          bindings,
          'Порядок похожих обновлён.'
        );
      }
    });

    editor.addEventListener('dragstart', event => {
      const item = event.target.closest('[data-movie-page-similar-editor-item]');

      if (!item || isBindingSaving(bindings)) {
        event.preventDefault();
        return;
      }

      const draggedMovieId = item.dataset.moviePageSimilarEditorItem;

      setBindingDraggedMovieId(bindings, draggedMovieId);

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', draggedMovieId);
      }

      item.classList.add('is-dragging');
    });

    editor.addEventListener('dragend', event => {
      event.target
        .closest('[data-movie-page-similar-editor-item]')
        ?.classList.remove('is-dragging');
      setBindingDraggedMovieId(bindings, null);
    });

    editor.addEventListener('dragover', event => {
      if (!getBindingDraggedMovieId(bindings)) {
        return;
      }

      const item = event.target.closest('[data-movie-page-similar-editor-item]');

      if (!item) {
        return;
      }

      event.preventDefault();

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    });

    editor.addEventListener('drop', event => {
      const targetItem = event.target.closest('[data-movie-page-similar-editor-item]');
      const sourceMovieId = getBindingDraggedMovieId(bindings) ||
        event.dataTransfer?.getData('text/plain');
      const targetMovieId = targetItem?.dataset.moviePageSimilarEditorItem;

      if (!sourceMovieId || !targetMovieId || sourceMovieId === targetMovieId) {
        return;
      }

      event.preventDefault();

      const targetRect = targetItem.getBoundingClientRect();
      const shouldPlaceAfter = event.clientY > targetRect.top + (targetRect.height / 2);

      saveMoviePageSimilarEditorIds(
        getMoviePageSimilarIdsAfterDrop(
          getBindingSelectedMovieIds(bindings),
          sourceMovieId,
          targetMovieId,
          shouldPlaceAfter
        ),
        bindings,
        'Порядок похожих обновлён.'
      );
    });
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
    getMoviePageSimilarIdsAfterDrop,
    saveMoviePageSimilarEditorIds,
    focusMoviePageSimilarSearch,
    bindMoviePageSimilarEditorEvents
  };
}
