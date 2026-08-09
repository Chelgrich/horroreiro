const EDITOR_CENTER_PREVIEW_LIMIT = 12;
const EDITOR_CENTER_SUMMARY_EXCLUDED_ISSUE_KEYS = new Set();

export function createEditorPageController(context = {}) {
  const {
    editorPage = null,
    getCurrentUser = () => null,
    getIsAdmin = () => false,
    shouldUseAuthenticatedUi = () => false,
    restoreSession = async () => null,
    trackEmailConfirmedLoginIfNeeded = () => {},
    bindSharedAuthStateListener = () => {},
    openAuthModal = () => {},
    escapeHtml = value => String(value ?? ''),
    fetchAdminCompletenessMovieRows = async () => [],
    fetchAdminMoviePosterImageRows = async () => [],
    groupRowsByMovieId = () => new Map(),
    isEmptyTextArrayLikeField = value => !String(value || '').trim(),
    getUniqueMoviePosterUrlCount = () => 0,
    compareManualSimilarAuditMovies = () => 0,
    getManualSimilarMovieLabel = movie => String(movie?.title || ''),
    buildMoviePageUrl = () => '',
    buildMovieCanonicalPath = () => '',
    runCompletenessAudit = async () => {},
    exportDatabase = async () => {}
  } = context;

  function getEditorCenterIssueConfigs() {
    return [
      {
        key: 'production',
        title: 'Без производства',
        label: 'Производство',
        description: 'Пустое поле "Производство" в модалке фильма.'
      },
      {
        key: 'distribution',
        title: 'Без дистрибуции',
        label: 'Дистрибуция',
        description: 'Пустое поле "Дистрибуция" в модалке фильма.'
      },
      {
        key: 'russianDistribution',
        title: 'Без дистрибуции в РФ',
        label: 'Дистрибуция в РФ',
        description: 'Пустое поле "Дистрибуция в России" в модалке фильма.'
      },
      {
        key: 'poster',
        title: 'Один постер',
        label: 'Постеры',
        description: 'В карточке есть только основной poster_url без дополнительных изображений.'
      },
      {
        key: 'kinopoisk',
        title: 'Без Кинопоиска',
        label: 'Кинопоиск',
        description: 'Пустое поле "Кинопоиск".'
      },
      {
        key: 'trailer',
        title: 'Без трейлера',
        label: 'Трейлер',
        description: 'Пустое поле "Трейлер".'
      }
    ];
  }

  function getEditorMovieIssueKeys(movie, {
    posterRowsByMovieId
  } = {}) {
    const issueKeys = [];
    const movieId = String(movie?.id || '').trim();
    const moviePosterRows = posterRowsByMovieId?.get(movieId) || [];

    if (isEmptyTextArrayLikeField(movie?.production)) {
      issueKeys.push('production');
    }

    if (isEmptyTextArrayLikeField(movie?.distribution)) {
      issueKeys.push('distribution');
    }

    if (isEmptyTextArrayLikeField(movie?.russian_distribution)) {
      issueKeys.push('russianDistribution');
    }

    if (String(movie?.poster_url || '').trim() && getUniqueMoviePosterUrlCount(movie, moviePosterRows) === 1) {
      issueKeys.push('poster');
    }

    if (!String(movie?.kinopoisk_url || '').trim()) {
      issueKeys.push('kinopoisk');
    }

    if (!String(movie?.trailer_url || '').trim()) {
      issueKeys.push('trailer');
    }

    return issueKeys;
  }

  function buildEditorCenterData({
    movies = [],
    posterRows = []
  } = {}) {
    const sortedMovies = [...movies].sort(compareManualSimilarAuditMovies);
    const posterRowsByMovieId = groupRowsByMovieId(posterRows);
    const issueConfigs = getEditorCenterIssueConfigs();
    const issueMap = new Map(issueConfigs.map(config => [
      config.key,
      {
        ...config,
        movies: []
      }
    ]));
    const movieIssueEntries = [];

    sortedMovies.forEach(movie => {
      const issueKeys = getEditorMovieIssueKeys(movie, {
        posterRowsByMovieId
      });

      issueKeys.forEach(issueKey => {
        issueMap.get(issueKey)?.movies.push(movie);
      });

      if (issueKeys.length > 0) {
        movieIssueEntries.push({
          movie,
          issueKeys
        });
      }
    });

    return {
      moviesCount: sortedMovies.length,
      updatedAt: new Date(),
      issues: issueConfigs.map(config => issueMap.get(config.key)),
      movieIssueEntries: movieIssueEntries.sort((firstEntry, secondEntry) => (
        secondEntry.issueKeys.length - firstEntry.issueKeys.length ||
        compareManualSimilarAuditMovies(firstEntry.movie, secondEntry.movie)
      ))
    };
  }

  async function fetchEditorCenterData() {
    const [
      movies,
      posterRows
    ] = await Promise.all([
      fetchAdminCompletenessMovieRows(),
      fetchAdminMoviePosterImageRows()
    ]);

    return buildEditorCenterData({
      movies,
      posterRows
    });
  }

  function renderEditorPageLoading() {
    if (!editorPage) {
      return;
    }

    editorPage.innerHTML = '<div class="editor-page-loading-state">Загрузка центра редактора...</div>';
  }

  function renderEditorPageAuthGate() {
    if (!editorPage) {
      return;
    }

    document.title = 'Центр редактора — Хоррорейро';
    editorPage.innerHTML = `
      <div class="editor-page-empty-state editor-page-empty-state-large">
        <p>Войди под администратором, чтобы открыть центр редактора.</p>
        <button type="button" class="secondary-button editor-page-login-button" data-editor-action="login">
          Войти
        </button>
      </div>
    `;
  }

  function renderEditorPageForbidden() {
    if (!editorPage) {
      return;
    }

    document.title = 'Центр редактора — Хоррорейро';
    editorPage.innerHTML = `
      <div class="editor-page-empty-state editor-page-empty-state-large">
        <p>Центр редактора доступен только администратору.</p>
      </div>
    `;
  }

  function renderEditorPageError() {
    if (!editorPage) {
      return;
    }

    editorPage.innerHTML = `
      <div class="editor-page-empty-state editor-page-empty-state-large">
        <p>Не удалось загрузить центр редактора. Попробуй обновить страницу.</p>
        <button type="button" class="secondary-button editor-page-login-button" data-editor-action="refresh">
          Повторить
        </button>
      </div>
    `;
  }

  function formatEditorPageUpdatedAt(date) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getEditorIssueLabelByKey(issueKey) {
    const issueConfig = getEditorCenterIssueConfigs().find(config => config.key === issueKey);

    return issueConfig?.label || issueKey;
  }

  function getEditorMovieIssuesSummary(issueKeys = []) {
    return issueKeys
      .map(getEditorIssueLabelByKey)
      .filter(Boolean)
      .join(', ');
  }

  function getEditorSummaryIssueKeys(issueKeys = []) {
    return issueKeys.filter(issueKey => !EDITOR_CENTER_SUMMARY_EXCLUDED_ISSUE_KEYS.has(issueKey));
  }

  function renderEditorMovieLink(movie, metaText = '') {
    const movieLabel = getManualSimilarMovieLabel(movie);
    const movieUrl = buildMoviePageUrl(movie);
    const path = buildMovieCanonicalPath(movie);

    return `
      <a class="editor-page-movie-link" href="${escapeHtml(movieUrl)}">
        <span class="editor-page-movie-title">${escapeHtml(movieLabel)}</span>
        <span class="editor-page-movie-meta">${escapeHtml(metaText || path)}</span>
      </a>
    `;
  }

  function renderEditorIssuePreviewList(movies = []) {
    if (!movies.length) {
      return '<p class="editor-page-issue-empty">Готово.</p>';
    }

    const visibleMovies = movies.slice(0, EDITOR_CENTER_PREVIEW_LIMIT);
    const hiddenCount = Math.max(0, movies.length - visibleMovies.length);

    return `
      <div class="editor-page-movie-list">
        ${visibleMovies.map(movie => renderEditorMovieLink(movie)).join('')}
        ${hiddenCount > 0 ? `<p class="editor-page-more-note">И ещё ${hiddenCount}</p>` : ''}
      </div>
    `;
  }

  function renderEditorIssueCard(issue) {
    return `
      <article class="editor-page-issue-card${issue.movies.length === 0 ? ' is-complete' : ''}">
        <div class="editor-page-issue-card-header">
          <h2>${escapeHtml(issue.title)}</h2>
          <span>${escapeHtml(String(issue.movies.length))}</span>
        </div>
        <p>${escapeHtml(issue.description)}</p>
        ${renderEditorIssuePreviewList(issue.movies)}
      </article>
    `;
  }

  function renderEditorPriorityList(entries = []) {
    const priorityEntries = entries
      .map(entry => ({
        ...entry,
        summaryIssueKeys: getEditorSummaryIssueKeys(entry.issueKeys)
      }))
      .filter(entry => entry.summaryIssueKeys.length > 1)
      .sort((firstEntry, secondEntry) => (
        secondEntry.summaryIssueKeys.length - firstEntry.summaryIssueKeys.length ||
        compareManualSimilarAuditMovies(firstEntry.movie, secondEntry.movie)
      ))
      .slice(0, EDITOR_CENTER_PREVIEW_LIMIT);

    if (!priorityEntries.length) {
      return '<p class="editor-page-empty-state">Карточек с несколькими хвостами нет.</p>';
    }

    return `
      <div class="editor-page-movie-list editor-page-priority-list">
        ${priorityEntries.map(entry => (
          renderEditorMovieLink(entry.movie, getEditorMovieIssuesSummary(entry.summaryIssueKeys))
        )).join('')}
      </div>
    `;
  }

  function renderEditorPage(data) {
    if (!editorPage) {
      return;
    }

    const summaryIssues = data.issues.filter(issue => !EDITOR_CENTER_SUMMARY_EXCLUDED_ISSUE_KEYS.has(issue.key));
    const totalIssueCount = summaryIssues.reduce((sum, issue) => sum + issue.movies.length, 0);
    const multiIssueCount = data.movieIssueEntries.filter(entry => getEditorSummaryIssueKeys(entry.issueKeys).length > 1).length;

    document.title = 'Центр редактора — Хоррорейро';
    editorPage.innerHTML = `
      <section class="editor-page-toolbar" aria-label="Действия редактора">
        <div>
          <p class="editor-page-kicker">Сводка обновлена в ${escapeHtml(formatEditorPageUpdatedAt(data.updatedAt))}</p>
          <p class="editor-page-toolbar-note">Быстрый контроль заполненности карточек перед крупными обновлениями.</p>
        </div>
        <div class="editor-page-toolbar-actions">
          <button type="button" class="secondary-button" data-editor-action="refresh">Обновить</button>
          <button type="button" class="secondary-button" data-editor-action="completeness-audit">Скачать аудит</button>
          <button type="button" class="secondary-button" data-editor-action="database-export">Экспорт базы</button>
        </div>
      </section>

      <section class="editor-page-summary-grid" aria-label="Сводка">
        <article class="editor-page-stat-card">
          <span>${escapeHtml(String(data.moviesCount))}</span>
          <p>Фильмов в базе</p>
        </article>
        <article class="editor-page-stat-card">
          <span>${escapeHtml(String(totalIssueCount))}</span>
          <p>Всего хвостов</p>
        </article>
        <article class="editor-page-stat-card">
          <span>${escapeHtml(String(multiIssueCount))}</span>
          <p>Карточек с 2+ хвостами</p>
        </article>
      </section>

      <section class="editor-page-block">
        <div class="editor-page-section-header">
          <h2>Приоритет на проверку</h2>
          <span>2+ незакрытых контура</span>
        </div>
        ${renderEditorPriorityList(data.movieIssueEntries)}
      </section>

      <section class="editor-page-block">
        <div class="editor-page-section-header">
          <h2>Контуры заполненности</h2>
          <span>первые ${escapeHtml(String(EDITOR_CENTER_PREVIEW_LIMIT))} карточек в каждом</span>
        </div>
        <div class="editor-page-issue-grid">
          ${data.issues.map(renderEditorIssueCard).join('')}
        </div>
      </section>
    `;
  }

  async function loadEditorPage() {
    if (!editorPage) {
      return;
    }

    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      renderEditorPageAuthGate();
      return;
    }

    if (!getIsAdmin()) {
      renderEditorPageForbidden();
      return;
    }

    renderEditorPageLoading();

    try {
      const data = await fetchEditorCenterData();
      renderEditorPage(data);
    } catch (error) {
      console.error('Ошибка загрузки центра редактора:', error);
      renderEditorPageError();
    }
  }

  async function initEditorPage() {
    renderEditorPageLoading();
    await restoreSession();
    trackEmailConfirmedLoginIfNeeded();
    await loadEditorPage();

    bindSharedAuthStateListener({
      onAfterAuthSync: loadEditorPage
    });
  }

  function handleEditorPageClick(event) {
    const actionButton = event.target?.closest?.('[data-editor-action]');

    if (!actionButton || !editorPage?.contains(actionButton)) {
      return false;
    }

    const action = String(actionButton.dataset.editorAction || '').trim();

    event.preventDefault();

    if (action === 'login') {
      openAuthModal();
      return true;
    }

    if (action === 'refresh') {
      void loadEditorPage();
      return true;
    }

    if (action === 'completeness-audit') {
      void runCompletenessAudit();
      return true;
    }

    if (action === 'database-export') {
      void exportDatabase();
      return true;
    }

    return false;
  }

  return {
    initEditorPage,
    loadEditorPage,
    handleEditorPageClick
  };
}
