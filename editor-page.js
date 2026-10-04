const EDITOR_CENTER_PREVIEW_LIMIT = 12;
const EDITOR_CENTER_SUMMARY_EXCLUDED_ISSUE_KEYS = new Set();

export function createEditorPageController(context = {}) {
  const {
    editorPage = null,
    getCurrentUser = () => null,
    getIsAdmin = () => false,
    hasWarmStartedPageDom = () => false,
    shouldUseAuthenticatedUi = () => false,
    restoreSession = async () => null,
    trackEmailConfirmedLoginIfNeeded = () => {},
    bindSharedAuthStateListener = () => {},
    openAuthModal = () => {},
    escapeHtml = value => String(value ?? ''),
    fetchAdminAutoRelatedDiagnostics = async () => null,
    saveAdminAutoRelatedOverride = async () => null,
    syncAdminAutoRelatedMovie = async () => null,
    showAppMessage = () => {},
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
  let currentEditorPageData = null;
  const syncingAutoRelatedMovieIds = new Set();
  let isSyncingAutoRelatedBatch = false;

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
    posterRows = [],
    autoRelatedDiagnostics = null
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
      autoRelatedDiagnostics,
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
      posterRows,
      autoRelatedDiagnostics
    ] = await Promise.all([
      fetchAdminCompletenessMovieRows(),
      fetchAdminMoviePosterImageRows(),
      fetchAdminAutoRelatedDiagnostics().catch(error => ({
        error: error.message || 'Не удалось загрузить диагностику автопохожих.'
      }))
    ]);

    return buildEditorCenterData({
      movies,
      posterRows,
      autoRelatedDiagnostics
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

  function formatEditorAutoRelatedInteger(value) {
    const number = Number(value || 0);

    return String(Number.isFinite(number) ? number : 0);
  }

  function formatEditorAutoRelatedAverage(value) {
    const number = Number(value || 0);

    return Number.isFinite(number) ? number.toFixed(1) : '0.0';
  }

  function formatEditorAutoRelatedDateTime(value) {
    const date = new Date(value || '');

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short'
    });
  }

  function formatEditorAutoRelatedScore(value) {
    const number = Number(value || 0);

    return Number.isFinite(number) ? number.toFixed(4) : '0.0000';
  }

  function getEditorAutoRelatedProviderLabel(provider) {
    const normalizedProvider = String(provider || '').trim().toLowerCase();

    if (normalizedProvider === 'tmdb' || normalizedProvider.startsWith('tmdb_')) {
      return 'TMDb';
    }

    if (normalizedProvider === 'trakt' || normalizedProvider.startsWith('trakt_')) {
      return 'Trakt';
    }

    return provider || 'Источник';
  }

  function formatEditorAutoRelatedProviderCounts(provider = {}) {
    const hasMatchedCount = provider.matchedCount !== null && provider.matchedCount !== undefined && provider.matchedCount !== '';
    const hasExternalCount = provider.externalCount !== null && provider.externalCount !== undefined && provider.externalCount !== '';
    const matchedCount = Number(provider.matchedCount);
    const externalCount = Number(provider.externalCount);
    const hasValidMatchedCount = hasMatchedCount && Number.isFinite(matchedCount);
    const hasValidExternalCount = hasExternalCount && Number.isFinite(externalCount);

    if (hasValidMatchedCount && hasValidExternalCount) {
      return `${matchedCount}/${externalCount}`;
    }

    if (hasValidMatchedCount) {
      return String(matchedCount);
    }

    if (hasValidExternalCount) {
      return `0/${externalCount}`;
    }

    return provider.hasRun ? '0/0' : 'нет запуска';
  }

  function getEditorAutoRelatedProviderClass(provider = {}) {
    if (provider.error) {
      return 'is-error';
    }

    if (!provider.hasRun) {
      return 'is-muted';
    }

    return 'is-ok';
  }

  function renderEditorAutoRelatedProviderPills(providers = []) {
    const normalizedProviders = Array.isArray(providers) ? providers : [];

    if (!normalizedProviders.length) {
      return '';
    }

    return `
      <div class="editor-page-auto-related-provider-row" aria-label="Статус провайдеров">
        ${normalizedProviders.map(provider => {
          const providerLabel = getEditorAutoRelatedProviderLabel(provider.provider);
          const countsLabel = formatEditorAutoRelatedProviderCounts(provider);
          const statusParts = [
            provider.successAt ? `успех ${formatEditorAutoRelatedDateTime(provider.successAt)}` : '',
            provider.statusCode ? `HTTP ${provider.statusCode}` : '',
            provider.error || ''
          ].filter(Boolean);
          const title = statusParts.length ? statusParts.join(' · ') : 'Провайдер ещё не запускался';

          return `
            <span class="editor-page-auto-related-provider-pill ${escapeHtml(getEditorAutoRelatedProviderClass(provider))}" title="${escapeHtml(title)}">
              <span>${escapeHtml(providerLabel)}</span>
              <strong>${escapeHtml(countsLabel)}</strong>
            </span>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderEditorAutoRelatedEvidenceRows(rows = [], directionLabel = '') {
    if (!rows.length) {
      return '';
    }

    return rows
      .map(row => {
        const providerLabel = getEditorAutoRelatedProviderLabel(row.provider);
        const rankLabel = row.rank ? ` #${row.rank}` : '';
        const prefix = directionLabel ? `${directionLabel} ` : '';

        return `${prefix}${providerLabel}${rankLabel}`;
      })
      .join(', ');
  }

  function renderEditorAutoRelatedEvidenceSummary(evidence = {}) {
    const parts = [
      renderEditorAutoRelatedEvidenceRows(evidence.direct, ''),
      renderEditorAutoRelatedEvidenceRows(evidence.reverse, 'обратно')
    ].filter(Boolean);

    return parts.length ? parts.join(' · ') : 'нет evidence';
  }

  function isAutoRelatedMovieSyncing(movieId) {
    return syncingAutoRelatedMovieIds.has(String(movieId || '').trim());
  }

  function renderEditorAutoRelatedSyncButton(movieId, label = 'Синхронизировать', { canSync = true } = {}) {
    const normalizedMovieId = String(movieId || '').trim();

    if (!normalizedMovieId) {
      return '';
    }

    const isSyncing = isAutoRelatedMovieSyncing(normalizedMovieId);
    const isDisabled = !canSync || isSyncing;

    return `
      <button
        type="button"
        class="secondary-button editor-page-auto-related-sync-button"
        data-editor-action="auto-related-sync"
        data-movie-id="${escapeHtml(normalizedMovieId)}"
        ${!canSync ? 'title="Синхронизация доступна только в Node/Yandex runtime."' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
        ${escapeHtml(isSyncing ? 'Синхронизируем...' : label)}
      </button>
    `;
  }

  function renderEditorAutoRelatedPairSyncButton(pair = {}, { canSync = true } = {}) {
    const sourceMovieId = String(pair.source?.id || '').trim();
    const targetMovieId = String(pair.target?.id || '').trim();

    if (!sourceMovieId && !targetMovieId) {
      return '';
    }

    const isSyncing = [sourceMovieId, targetMovieId].some(isAutoRelatedMovieSyncing);
    const isDisabled = !canSync || isSyncing;

    return `
      <button
        type="button"
        class="secondary-button editor-page-auto-related-sync-button"
        data-editor-action="auto-related-sync-pair"
        data-source-movie-id="${escapeHtml(sourceMovieId)}"
        data-target-movie-id="${escapeHtml(targetMovieId)}"
        ${!canSync ? 'title="Синхронизация доступна только в Node/Yandex runtime."' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
        ${escapeHtml(isSyncing ? 'Синхронизируем...' : 'Синхр. пару')}
      </button>
    `;
  }

  function renderEditorAutoRelatedOverrideButton(pair = {}) {
    const sourceMovieId = String(pair.source?.id || '').trim();
    const targetMovieId = String(pair.target?.id || '').trim();
    const overrideAction = String(pair.overrideAction || '').trim();

    if (!sourceMovieId || !targetMovieId) {
      return '';
    }

    if (overrideAction === 'hide') {
      return `
        <button
          type="button"
          class="secondary-button editor-page-auto-related-override-button"
          data-editor-action="auto-related-override-remove"
          data-source-movie-id="${escapeHtml(sourceMovieId)}"
          data-target-movie-id="${escapeHtml(targetMovieId)}"
          title="Убрать directed-исключение для этой пары."
        >
          Убрать исключение
        </button>
      `;
    }

    return `
      <button
        type="button"
        class="secondary-button editor-page-auto-related-override-button is-danger"
        data-editor-action="auto-related-override-hide"
        data-source-movie-id="${escapeHtml(sourceMovieId)}"
        data-target-movie-id="${escapeHtml(targetMovieId)}"
        title="Исключить эту directed-пару из автопохожих."
      >
        Исключить
      </button>
    `;
  }

  function renderEditorAutoRelatedLowCoverageItem(item = {}, { canSync = true } = {}) {
    const metaParts = [
      `${formatEditorAutoRelatedInteger(item.relatedCount)} похожих`,
      item.lastSuccessAt
        ? `успех ${formatEditorAutoRelatedDateTime(item.lastSuccessAt)}`
        : item.lastSyncedAt
          ? `синхр. ${formatEditorAutoRelatedDateTime(item.lastSyncedAt)}`
          : 'ещё не синхронизирован'
    ];

    return `
      <article class="editor-page-auto-related-item">
        <a class="editor-page-auto-related-item-link" href="${escapeHtml(item.path || '')}">
        <span class="editor-page-auto-related-title">${escapeHtml(item.label || '')}</span>
        <span class="editor-page-auto-related-meta">${escapeHtml(metaParts.join(' · '))}</span>
        ${renderEditorAutoRelatedProviderPills(item.providers)}
        ${item.syncError ? `<span class="editor-page-auto-related-error">${escapeHtml(item.syncError)}</span>` : ''}
        </a>
        ${renderEditorAutoRelatedSyncButton(item.id, 'Синхронизировать', { canSync })}
      </article>
    `;
  }

  function renderEditorAutoRelatedPairDiagnostic(pair = {}, { canSync = true } = {}) {
    const metaItems = [
      pair.confidence || 'confidence?',
      Number.isFinite(Number(pair.score)) ? `score ${formatEditorAutoRelatedScore(pair.score)}` : '',
      Number.isFinite(Number(pair.position)) ? `#${formatEditorAutoRelatedInteger(pair.position)}` : '',
      pair.overrideAction ? `override: ${pair.overrideAction}` : ''
    ].filter(Boolean);

    return `
      <article class="editor-page-auto-related-pair">
        <div class="editor-page-auto-related-pair-links">
          <a href="${escapeHtml(pair.source?.path || '')}">${escapeHtml(pair.source?.label || '')}</a>
          <span>→</span>
          <a href="${escapeHtml(pair.target?.path || '')}">${escapeHtml(pair.target?.label || '')}</a>
        </div>
        <div class="editor-page-auto-related-pair-meta">
          ${metaItems.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
        <p>${escapeHtml(renderEditorAutoRelatedEvidenceSummary(pair.evidence))}</p>
        <div class="editor-page-auto-related-actions">
          ${renderEditorAutoRelatedOverrideButton(pair)}
          ${renderEditorAutoRelatedPairSyncButton(pair, { canSync })}
          ${renderEditorAutoRelatedSyncButton(pair.source?.id, 'Синхр. источник', { canSync })}
          ${renderEditorAutoRelatedSyncButton(pair.target?.id, 'Синхр. цель', { canSync })}
        </div>
      </article>
    `;
  }

  function renderEditorAutoRelatedPanel(title, subtitle, contentHtml) {
    return `
      <article class="editor-page-auto-related-panel">
        <div class="editor-page-auto-related-panel-header">
          <h3>${escapeHtml(title)}</h3>
          <span>${escapeHtml(subtitle)}</span>
        </div>
        ${contentHtml}
      </article>
    `;
  }

  function getEditorAutoRelatedWeakPairMovieIds(diagnosticPairs = []) {
    return [
      ...new Set((Array.isArray(diagnosticPairs) ? diagnosticPairs : [])
        .flatMap(pair => [
          String(pair?.source?.id || '').trim(),
          String(pair?.target?.id || '').trim()
        ])
        .filter(Boolean))
    ];
  }

  function renderEditorAutoRelatedDiagnostics(diagnostics) {
    if (!diagnostics) {
      return '';
    }

    if (diagnostics.error) {
      return `
        <section class="editor-page-block editor-page-auto-related-block">
          <div class="editor-page-section-header">
            <h2>Автопохожие</h2>
            <span>диагностика недоступна</span>
          </div>
          <p class="editor-page-empty-state">${escapeHtml(diagnostics.error)}</p>
        </section>
      `;
    }

    const summary = diagnostics.summary || {};
    const distribution = summary.relatedDistribution || {};
    const confidenceCounts = summary.relatedConfidenceCounts || {};
    const confidenceText = Object.entries(confidenceCounts)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' · ') || 'нет данных';
    const lowCoverageMovies = diagnostics.lowCoverageMovies || [];
    const diagnosticPairs = diagnostics.diagnosticPairs || [];
    const hiddenPairs = diagnostics.hiddenPairs || [];
    const weakPairMovieIds = getEditorAutoRelatedWeakPairMovieIds(diagnosticPairs);
    const canRunProviderSync = Boolean(diagnostics.capabilities?.canRunProviderSync);
    const canBatchSyncLowCoverage = canRunProviderSync && lowCoverageMovies.some(item => item.id);
    const canBatchSyncWeakPairs = canRunProviderSync && weakPairMovieIds.length > 0;

    return `
      <section class="editor-page-block editor-page-auto-related-block">
        <div class="editor-page-section-header">
          <h2>Автопохожие</h2>
          <span>серверная диагностика materialized-связей</span>
          <div class="editor-page-auto-related-header-actions">
            <button
              type="button"
              class="secondary-button editor-page-auto-related-batch-button"
              data-editor-action="auto-related-sync-low-coverage"
              ${!canBatchSyncLowCoverage || isSyncingAutoRelatedBatch ? 'disabled' : ''}
              ${!canRunProviderSync ? 'title="Синхронизация доступна только в Node/Yandex runtime."' : ''}
            >
              ${escapeHtml(isSyncingAutoRelatedBatch ? 'Синхронизируем...' : 'Синхр. на проверку')}
            </button>
            <button
              type="button"
              class="secondary-button editor-page-auto-related-batch-button"
              data-editor-action="auto-related-sync-weak-pairs"
              ${!canBatchSyncWeakPairs || isSyncingAutoRelatedBatch ? 'disabled' : ''}
              ${!canRunProviderSync ? 'title="Синхронизация доступна только в Node/Yandex runtime."' : ''}
            >
              ${escapeHtml(isSyncingAutoRelatedBatch ? 'Синхронизируем...' : 'Синхр. слабые пары')}
            </button>
          </div>
        </div>
        <div class="editor-page-auto-related-summary-grid" aria-label="Диагностика автопохожих">
          <article class="editor-page-auto-related-stat">
            <span>${escapeHtml(formatEditorAutoRelatedInteger(summary.moviesSyncedSuccessfully))}/${escapeHtml(formatEditorAutoRelatedInteger(summary.movies))}</span>
            <p>Синхронизировано успешно</p>
          </article>
          <article class="editor-page-auto-related-stat">
            <span>${escapeHtml(formatEditorAutoRelatedInteger(distribution.zero))}</span>
            <p>Без автопохожих</p>
          </article>
          <article class="editor-page-auto-related-stat">
            <span>${escapeHtml(formatEditorAutoRelatedInteger(distribution.oneToThree))}</span>
            <p>1-3 автопохожих</p>
          </article>
          <article class="editor-page-auto-related-stat">
            <span>${escapeHtml(formatEditorAutoRelatedAverage(summary.averageRelatedCount))}</span>
            <p>Среднее на фильм</p>
          </article>
          <article class="editor-page-auto-related-stat">
            <span>${escapeHtml(formatEditorAutoRelatedInteger(summary.bothProvidersDirectedPairs))}</span>
            <p>Пары от TMDb + Trakt</p>
          </article>
          <article class="editor-page-auto-related-stat">
            <span>${escapeHtml(formatEditorAutoRelatedInteger(summary.failedSyncStates))}</span>
            <p>Ошибок синхронизации</p>
          </article>
        </div>
        <p class="editor-page-auto-related-note">
          Evidence: ${escapeHtml(formatEditorAutoRelatedInteger(summary.evidenceRows))} · materialized: ${escapeHtml(formatEditorAutoRelatedInteger(summary.relatedRows))} · confidence: ${escapeHtml(confidenceText)}
        </p>
        <div class="editor-page-auto-related-columns">
          ${renderEditorAutoRelatedPanel(
            'На проверку',
            'меньше 4 похожих или ошибка sync',
            lowCoverageMovies.length
              ? `<div class="editor-page-auto-related-list">${lowCoverageMovies.map(item => renderEditorAutoRelatedLowCoverageItem(item, { canSync: canRunProviderSync })).join('')}</div>`
              : '<p class="editor-page-issue-empty">Готово.</p>'
          )}
          ${renderEditorAutoRelatedPanel(
            'Слабые пары',
            'первые 24 по confidence/score',
            diagnosticPairs.length
              ? `<div class="editor-page-auto-related-list">${diagnosticPairs.map(pair => renderEditorAutoRelatedPairDiagnostic(pair, { canSync: canRunProviderSync })).join('')}</div>`
              : '<p class="editor-page-issue-empty">Пары не найдены.</p>'
          )}
          ${renderEditorAutoRelatedPanel(
            'Исключённые пары',
            'первые 24 directed-исключения',
            hiddenPairs.length
              ? `<div class="editor-page-auto-related-list">${hiddenPairs.map(pair => renderEditorAutoRelatedPairDiagnostic(pair, { canSync: canRunProviderSync })).join('')}</div>`
              : '<p class="editor-page-issue-empty">Исключений нет.</p>'
          )}
        </div>
      </section>
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
    currentEditorPageData = data;
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

      ${renderEditorAutoRelatedDiagnostics(data.autoRelatedDiagnostics)}

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

    if (!hasWarmStartedPageDom()) {
      renderEditorPageLoading();
    }

    try {
      const data = await fetchEditorCenterData();
      renderEditorPage(data);
    } catch (error) {
      console.error('Ошибка загрузки центра редактора:', error);
      renderEditorPageError();
    }
  }

  async function initEditorPage() {
    if (!hasWarmStartedPageDom()) {
      renderEditorPageLoading();
    }
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

    if (action === 'auto-related-sync') {
      void syncEditorAutoRelatedMovie(actionButton.dataset.movieId);
      return true;
    }

    if (action === 'auto-related-sync-pair') {
      void syncEditorAutoRelatedMovieIds([
        actionButton.dataset.sourceMovieId,
        actionButton.dataset.targetMovieId
      ], 'Синхронизация пары завершена');
      return true;
    }

    if (action === 'auto-related-sync-visible' || action === 'auto-related-sync-low-coverage') {
      void syncVisibleEditorAutoRelatedLowCoverageMovies();
      return true;
    }

    if (action === 'auto-related-sync-weak-pairs') {
      void syncVisibleEditorAutoRelatedWeakPairMovies();
      return true;
    }

    if (action === 'auto-related-override-hide' || action === 'auto-related-override-remove') {
      void saveEditorAutoRelatedOverride({
        action: action === 'auto-related-override-hide' ? 'hide' : 'remove',
        movieId: actionButton.dataset.sourceMovieId,
        relatedMovieId: actionButton.dataset.targetMovieId
      });
      return true;
    }

    return false;
  }

  async function syncEditorAutoRelatedMovie(movieId, { notify = true, refresh = true } = {}) {
    const normalizedMovieId = String(movieId || '').trim();

    if (!normalizedMovieId || isAutoRelatedMovieSyncing(normalizedMovieId)) {
      return null;
    }

    syncingAutoRelatedMovieIds.add(normalizedMovieId);

    if (currentEditorPageData) {
      renderEditorPage(currentEditorPageData);
    }

    try {
      const result = await syncAdminAutoRelatedMovie(normalizedMovieId);

      syncingAutoRelatedMovieIds.delete(normalizedMovieId);
      if (notify) {
        showAppMessage('Автопохожие синхронизированы.', 'success', true);
      }

      if (refresh) {
        await loadEditorPage();
      }

      return result;
    } catch (error) {
      console.error('Ошибка синхронизации автопохожих:', error);
      if (notify) {
        showAppMessage(`Не удалось синхронизировать автопохожие: ${error.message || 'смотри консоль F12.'}`, 'error', true);
      }

      if (refresh && currentEditorPageData) {
        renderEditorPage(currentEditorPageData);
      }

      return null;
    } finally {
      syncingAutoRelatedMovieIds.delete(normalizedMovieId);

      if (!refresh && currentEditorPageData) {
        renderEditorPage(currentEditorPageData);
      }
    }
  }

  async function syncEditorAutoRelatedMovieIds(movieIds, completeMessage = 'Синхронизация завершена') {
    if (isSyncingAutoRelatedBatch) {
      return;
    }

    const normalizedMovieIds = [
      ...new Set((Array.isArray(movieIds) ? movieIds : [])
        .map(movieId => String(movieId || '').trim())
        .filter(Boolean))
    ];

    if (!normalizedMovieIds.length) {
      return;
    }

    isSyncingAutoRelatedBatch = true;

    if (currentEditorPageData) {
      renderEditorPage(currentEditorPageData);
    }

    let successCount = 0;

    try {
      for (const movieId of normalizedMovieIds) {
        const result = await syncEditorAutoRelatedMovie(movieId, {
          notify: false,
          refresh: false
        });

        if (result) {
          successCount += 1;
        }
      }

      showAppMessage(`${completeMessage}: ${successCount} из ${normalizedMovieIds.length}.`, successCount ? 'success' : 'error', true);
      isSyncingAutoRelatedBatch = false;
      await loadEditorPage();
    } finally {
      isSyncingAutoRelatedBatch = false;
    }
  }

  async function syncVisibleEditorAutoRelatedLowCoverageMovies() {
    const movieIds = (currentEditorPageData?.autoRelatedDiagnostics?.lowCoverageMovies || [])
      .map(item => item?.id);

    await syncEditorAutoRelatedMovieIds(movieIds, 'Синхронизация контура проверки завершена');
  }

  async function syncVisibleEditorAutoRelatedWeakPairMovies() {
    const movieIds = getEditorAutoRelatedWeakPairMovieIds(
      currentEditorPageData?.autoRelatedDiagnostics?.diagnosticPairs || []
    );

    await syncEditorAutoRelatedMovieIds(movieIds, 'Синхронизация слабых пар завершена');
  }

  async function saveEditorAutoRelatedOverride({
    action,
    movieId,
    relatedMovieId
  } = {}) {
    try {
      await saveAdminAutoRelatedOverride({
        action,
        movieId,
        relatedMovieId
      });

      showAppMessage(action === 'hide'
        ? 'Пара исключена из автопохожих.'
        : 'Исключение автопохожих снято.', 'success', true);
      await loadEditorPage();
    } catch (error) {
      console.error('Ошибка обновления override автопохожих:', error);
      showAppMessage(`Не удалось обновить правило автопохожих: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  }

  return {
    initEditorPage,
    loadEditorPage,
    handleEditorPageClick
  };
}
