/* =========================================================
JS-БЛОК 1. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ СО СТРАНИЦЫ
Сохраняет ссылки на DOM-элементы, с которыми работает приложение.
========================================================== */
const movieModal = document.getElementById('movieModal');
const movieModalBackdrop = document.getElementById('movieModalBackdrop');
const closeMovieModalButton = document.getElementById('closeMovieModalButton');

const authControls = document.getElementById('authControls');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerButton = document.getElementById('registerButton');
const logoutButton = document.getElementById('logoutButton');
const authToast = document.getElementById('authToast');
const authMessage = document.getElementById('authMessage');

const adminPanel = document.getElementById('adminPanel');
const userPanel = document.getElementById('userPanel');
const openAddMovieButton = document.getElementById('openAddMovieButton');

const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const genreFilter = document.getElementById('genreFilter');
const countryFilter = document.getElementById('countryFilter');
const ratingFilter = document.getElementById('ratingFilter');
const yearFilter = document.getElementById('yearFilter');
const watchlistFilter = document.getElementById('watchlistFilter');
const watchlistFilterRow = document.getElementById('watchlistFilterRow');
const watchedFilter = document.getElementById('watchedFilter');
const watchedFilterRow = document.getElementById('watchedFilterRow');
const viewMode = document.getElementById('viewMode');
const sortMode = document.getElementById('sortMode');
const openFiltersButton = document.getElementById('openFiltersButton');
const filtersModal = document.getElementById('filtersModal');
const filtersModalBackdrop = document.getElementById('filtersModalBackdrop');
const closeFiltersModalButton = document.getElementById('closeFiltersModalButton');
const resetFiltersTopButton = document.getElementById('resetFiltersTopButton');
const filtersModalStatus = document.getElementById('filtersModalStatus');
const activeFiltersBar = document.getElementById('activeFiltersBar');
const quickPresetsBar = document.getElementById('quickPresetsBar');

const container = document.getElementById('movies');
const moviesSectionTitle = document.querySelector('.movies-section .section-title');
const moviesResultCount = document.getElementById('moviesResultCount');
const initialViewModeRow = viewMode?.closest('.form-row');
let catalogViewToggleButton = null;

if (initialViewModeRow) {
  initialViewModeRow.style.display = 'none';
}

const movieForm = document.getElementById('movieForm');
const formTitle = document.getElementById('formTitle');
const formMessage = document.getElementById('formMessage');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');

const titleInput = document.getElementById('title');
const originalTitleInput = document.getElementById('originalTitle');
const yearInput = document.getElementById('year');
const releaseMonthInput = document.getElementById('releaseMonth');
const releaseYearInput = document.getElementById('releaseYear');
const sortOrderInput = document.getElementById('sortOrder');
const directorInput = document.getElementById('director');
const posterFileInput = document.getElementById('posterFile');
const posterFileName = document.getElementById('posterFileName');
const kinopoiskUrlInput = document.getElementById('kinopoiskUrl');
const imdbUrlInput = document.getElementById('imdbUrl');
const letterboxdUrlInput = document.getElementById('letterboxdUrl');
const rottentomatoesUrlInput = document.getElementById('rottentomatoesUrl');
const genresInput = document.getElementById('genresInput');
const countriesInput = document.getElementById('countriesInput');
const searchAliasesInput = document.getElementById('searchAliases');

/* =========================================================
JS-БЛОК 2. ПОДКЛЮЧЕНИЕ К SUPABASE
Создаёт клиент Supabase для работы с базой, auth и storage.
========================================================== */
const SUPABASE_URL = window.__ENV__?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY;
const APP_BUILD_VERSION = window.__ENV__?.APP_BUILD_VERSION || 'dev';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Не заданы переменные окружения SUPABASE_URL и SUPABASE_ANON_KEY');
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* =========================================================
JS-БЛОК 3. ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ
Хранит данные каталога, пользователя и состояние интерфейса.
========================================================== */
const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
const CATALOG_STATE_STORAGE_KEY = 'horroreiro_catalog_state';
const EMAIL_CONFIRMATION_PENDING_KEY = 'horroreiro_email_confirmation_pending';
const EMAIL_CONFIRMATION_TRACKED_KEY = 'horroreiro_email_confirmation_tracked';
const CATALOG_SCROLL_POSITION_KEY = 'horroreiro_catalog_scroll_position';
const CATALOG_ANCHOR_MOVIE_ID_KEY = 'horroreiro_catalog_anchor_movie_id';

let currentUser = null;
let currentUserRole = null;
let isAdmin = false;
let allMovies = [];
let allMovieRatings = [];
let allMovieWatchlist = [];
let editingMovieId = null;
let isModalOpen = false;
let moviesLoadedSuccessfully = false;
let authMessageTimer = null;
let isAuthSubmitting = false;
let isMovieFormSubmitting = false;
let ratingRequestInFlight = new Set();
let feedbackAnimationTimers = new Map();
let watchlistRequestInFlight = new Set();
let mobileRatingModal = null;
let mobileRatingModalTitle = null;
let mobileRatingModalStars = null;
let mobileRatingModalMeta = null;
let mobileRatingModalRemoveButton = null;
let mobileRatingModalMovieId = null;
let authStateSyncRequestId = 0;
let loadedPosterUrls = new Set();
let lastCatalogAnchorMovieId = null;
let shouldFadeCatalogAfterSkeleton = false;
let catalogFadeCleanupTimerId = null;

function applyBuildVersionSoftResetIfNeeded() {
  const savedBuildVersion = localStorage.getItem(APP_VERSION_STORAGE_KEY);

  if (savedBuildVersion === APP_BUILD_VERSION) {
    return false;
  }

  try {
    sessionStorage.clear();

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('horroreiro_') && key !== APP_VERSION_STORAGE_KEY) {
        localStorage.removeItem(key);
      }
    });

    localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_BUILD_VERSION);
  } catch (error) {
    console.warn('Ошибка при soft-reset версии сборки:', error);
  }

  return true;
}

/* =========================================================
JS-БЛОК 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ОБЩЕГО НАЗНАЧЕНИЯ
Мелкие утилиты, используемые в разных частях приложения.
========================================================== */
function parseCommaSeparated(value) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function parseMultilineValues(value) {
  const uniqueValues = new Map();

  String(value || '')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
    .forEach(item => {
      const normalizedItem = normalizeSearchText(item);

      if (!uniqueValues.has(normalizedItem)) {
        uniqueValues.set(normalizedItem, item);
      }
    });

  return Array.from(uniqueValues.values());
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .trim()
    .replace(/\s+/g, ' ');
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function highlightSearchMatches(text, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);
  const safeText = escapeHtml(text);

  if (!normalizedQuery) {
    return safeText;
  }

  const words = [...new Set(
    normalizedQuery
      .split(' ')
      .map(word => escapeRegExp(word))
      .filter(Boolean)
  )].sort((a, b) => b.length - a.length);

  let result = safeText;

  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });

  return result;
}

function saveCatalogScrollPosition() {
  try {
    sessionStorage.setItem(
      CATALOG_SCROLL_POSITION_KEY,
      String(window.scrollY || window.pageYOffset || 0)
    );
  } catch (error) {
    console.warn('Ошибка сохранения позиции каталога:', error);
  }
}

function saveCatalogAnchorMovieId() {
  try {
    if ((window.scrollY || window.pageYOffset || 0) <= 8) {
      sessionStorage.removeItem(CATALOG_ANCHOR_MOVIE_ID_KEY);
      return;
    }

    const movieCards = Array.from(container.querySelectorAll('[data-movie-id]'));

    if (movieCards.length === 0) {
      sessionStorage.removeItem(CATALOG_ANCHOR_MOVIE_ID_KEY);
      return;
    }

    const firstVisibleCard = movieCards.find(card => {
      const rect = card.getBoundingClientRect();
      return rect.bottom > 96;
    });

    const anchorMovieId = firstVisibleCard?.dataset.movieId || movieCards[0].dataset.movieId;

    if (anchorMovieId) {
      sessionStorage.setItem(CATALOG_ANCHOR_MOVIE_ID_KEY, String(anchorMovieId));
    }
  } catch (error) {
    console.warn('Ошибка сохранения якоря каталога:', error);
  }
}

function scheduleCatalogAnchorRestore(movieId) {
  if (!movieId) {
    return;
  }

  requestAnimationFrame(() => {
    restoreCatalogAnchorMoviePosition(movieId);
  });
}

function restoreCatalogScrollPosition() {
  try {
    const savedAnchorMovieId = sessionStorage.getItem(CATALOG_ANCHOR_MOVIE_ID_KEY);
    const savedScrollPosition = sessionStorage.getItem(CATALOG_SCROLL_POSITION_KEY);

    if (savedAnchorMovieId) {
      scheduleCatalogAnchorRestore(savedAnchorMovieId);

      sessionStorage.removeItem(CATALOG_ANCHOR_MOVIE_ID_KEY);
      sessionStorage.removeItem(CATALOG_SCROLL_POSITION_KEY);
      return;
    }

    if (savedScrollPosition === null) {
      return;
    }

    const scrollY = Number(savedScrollPosition);

    if (!Number.isFinite(scrollY) || scrollY < 0) {
      sessionStorage.removeItem(CATALOG_SCROLL_POSITION_KEY);
      return;
    }

    requestAnimationFrame(() => {
      scrollWindowToPosition(scrollY);
    });

    sessionStorage.removeItem(CATALOG_SCROLL_POSITION_KEY);
  } catch (error) {
    console.warn('Ошибка восстановления позиции каталога:', error);
  }
}

function debounce(callback, delay = 200) {
  let timeoutId = null;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

let catalogRenderFrameId = null;

function scheduleCatalogRender(renderCallback = renderMovies) {
  if (catalogRenderFrameId !== null) {
    cancelAnimationFrame(catalogRenderFrameId);
  }

  catalogRenderFrameId = requestAnimationFrame(() => {
    catalogRenderFrameId = null;
    renderCallback();
  });
}

function saveCatalogStateAndRender(renderCallback = renderMovies) {
  saveCatalogState();
  scheduleCatalogRender(renderCallback);
}

function renderCatalogAndRestoreScrollPosition() {
  renderMovies();
  restoreCatalogScrollPosition();
}

function rerenderCatalogPreservingPosition() {
  saveCatalogScrollPosition();
  saveCatalogAnchorMovieId();
  saveCatalogStateAndRender(renderCatalogAndRestoreScrollPosition);
}

function createDebouncedCatalogRender(delay) {
  return debounce(renderCatalogAndRestoreScrollPosition, delay);
}

function prepareCatalogStateForDeferredRender() {
  saveCatalogScrollPosition();
  saveCatalogAnchorMovieId();
  saveCatalogState();
}

function applyCatalogViewModeChange() {
  syncCatalogViewToggleButton();
  rerenderCatalogPreservingPosition();
}

function saveCatalogState() {
  try {
    localStorage.setItem(
      CATALOG_STATE_STORAGE_KEY,
      JSON.stringify({
        searchQuery: searchInput.value,
        genre: genreFilter.value,
        country: countryFilter.value,
        rating: ratingFilter.value,
        year: yearFilter.value,
        watchlist: currentUser ? watchlistFilter.value : '',
        watched: currentUser ? watchedFilter.value : '',
        viewMode: viewMode.value,
        sortMode: sortMode.value
      })
    );
  } catch (error) {
    console.warn('Ошибка сохранения состояния каталога:', error);
  }
}

function applySavedCatalogState() {
  try {
    const rawCatalogState = localStorage.getItem(CATALOG_STATE_STORAGE_KEY);

    if (rawCatalogState) {
      const catalogState = JSON.parse(rawCatalogState);

      searchInput.value = catalogState.searchQuery || '';
      genreFilter.value = catalogState.genre || '';
      countryFilter.value = catalogState.country || '';
      ratingFilter.value = catalogState.rating || '';
      yearFilter.value = catalogState.year || '';
      watchlistFilter.value = currentUser ? (catalogState.watchlist || '') : '';
      watchedFilter.value = currentUser ? (catalogState.watched || '') : '';
      viewMode.value = catalogState.viewMode || 'list';
      sortMode.value = catalogState.sortMode || 'default';
    }

    if (searchClearBtn) {
      searchClearBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
    }

    refreshCustomSelectGroup([
      genreFilter,
      countryFilter,
      ratingFilter,
      yearFilter,
      watchlistFilter,
      watchedFilter,
      viewMode,
      sortMode
    ]);

    syncCatalogViewToggleButton();
    updateFiltersButtonLabel();
    syncQuickPresetButtons();
  } catch (error) {
    console.warn('Ошибка восстановления состояния каталога:', error);
  }
}

function updatePosterFileUi() {
  if (!posterFileInput || !posterFileName) {
    return;
  }

  const selectedFile = posterFileInput.files && posterFileInput.files[0]
    ? posterFileInput.files[0]
    : null;

  posterFileName.textContent = selectedFile
    ? selectedFile.name
    : 'Файл не выбран';
}

function ensureActiveSessionForWrite() {
  if (!currentUser?.id) {
    throw new Error('Сессия пользователя не найдена. Обнови страницу и войди снова.');
  }

  return currentUser;
}

async function withPendingRequestTimeout(promise, timeoutMs, timeoutMessage) {
  let timeoutId = null;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function throwIfSupabaseError(error) {
  if (error) {
    throw error;
  }
}

function normalizeOptionalUrl(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return '';
  }

  // Если пользователь вставил ссылку без протокола, пробуем добавить https://
  if (!/^https?:\/\//i.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  return trimmedValue;
}

function areStringArraysEqual(firstArray, secondArray) {
  if (firstArray.length !== secondArray.length) {
    return false;
  }

  return firstArray.every((item, index) => item === secondArray[index]);
}

function normalizeAdditionalGenreNames(value) {
  const genreNames = parseCommaSeparated(value);

  // "Ужасы" всегда должен быть базовым жанром фильма.
  // Если пользователь его не указал вручную, добавляем автоматически.
  if (!genreNames.some(name => normalizeSearchText(name) === 'ужасы')) {
    return ['Ужасы', ...genreNames];
  }

  return genreNames;
}

function getMonthName(month) {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return months[month - 1] || '';
}

function trackGoal(goalName) {
  if (typeof ym !== 'function') {
    return;
  }

  ym(108369182, 'reachGoal', goalName);
}

function hasNonDefaultFilterValues() {
  return Boolean(
    genreFilter.value ||
    countryFilter.value ||
    ratingFilter.value !== '' ||
    yearFilter.value ||
    (currentUser && watchlistFilter.value) ||
    (currentUser && watchedFilter.value)
  );
}

function trackFiltersUsageIfNeeded() {
  if (!hasNonDefaultFilterValues()) {
    return;
  }

  trackGoal('use_filters');
}

function trackSortUsageIfNeeded() {
  if (!sortMode.value || sortMode.value === 'default') {
    return;
  }

  trackGoal('use_sort');
}

function syncCatalogViewToggleButton() {
  if (!catalogViewToggleButton || !viewMode) {
    return;
  }

  const isListMode = viewMode.value === 'list';

  catalogViewToggleButton.textContent = isListMode
    ? 'С разбивкой по месяцам'
    : 'Общим списком';

  catalogViewToggleButton.setAttribute(
    'aria-label',
    isListMode
      ? 'Переключить отображение на режим с разбивкой по месяцам'
      : 'Переключить отображение на общий список'
  );
}

function initCatalogViewToggleButton() {
  if (!moviesSectionTitle || !viewMode) {
    return;
  }

  const existingViewModeRow = viewMode.closest('.form-row');

  if (existingViewModeRow) {
    existingViewModeRow.style.display = 'none';
  }

  let moviesSectionHeader = moviesSectionTitle.closest('.movies-section-header');

  if (!moviesSectionHeader) {
    moviesSectionHeader = document.createElement('div');
    moviesSectionHeader.className = 'movies-section-header';

    const currentParent = moviesSectionTitle.parentElement;

    currentParent.parentNode.insertBefore(moviesSectionHeader, currentParent);
    moviesSectionHeader.appendChild(currentParent);
  }

  if (!catalogViewToggleButton) {
    catalogViewToggleButton = document.createElement('button');
    catalogViewToggleButton.type = 'button';
    catalogViewToggleButton.className = 'secondary-button catalog-view-toggle';

    catalogViewToggleButton.addEventListener('click', () => {
      viewMode.value = viewMode.value === 'list' ? 'releases' : 'list';

      refreshCustomSelect(viewMode);
      applyCatalogViewModeChange();
    });

    moviesSectionHeader.appendChild(catalogViewToggleButton);
  }

  syncCatalogViewToggleButton();
}

function isEmailConfirmationRedirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return (
    searchParams.get('type') === 'signup' ||
    hashParams.get('type') === 'signup' ||
    searchParams.has('token_hash') ||
    searchParams.has('code') ||
    hashParams.has('access_token')
  );
}

function clearEmailConfirmationParamsFromUrl() {
  const url = new URL(window.location.href);
  let wasChanged = false;

  if (url.searchParams.has('type')) {
    url.searchParams.delete('type');
    wasChanged = true;
  }

  if (url.searchParams.has('token_hash')) {
    url.searchParams.delete('token_hash');
    wasChanged = true;
  }

  if (url.searchParams.has('code')) {
    url.searchParams.delete('code');
    wasChanged = true;
  }

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));

  if (hashParams.has('type')) {
    hashParams.delete('type');
    wasChanged = true;
  }

  if (hashParams.has('access_token')) {
    hashParams.delete('access_token');
    wasChanged = true;
  }

  if (hashParams.has('refresh_token')) {
    hashParams.delete('refresh_token');
    wasChanged = true;
  }

  if (hashParams.has('expires_at')) {
    hashParams.delete('expires_at');
    wasChanged = true;
  }

  if (hashParams.has('expires_in')) {
    hashParams.delete('expires_in');
    wasChanged = true;
  }

  if (hashParams.has('token_type')) {
    hashParams.delete('token_type');
    wasChanged = true;
  }

  if (wasChanged) {
    const nextHash = hashParams.toString();
    url.hash = nextHash ? `#${nextHash}` : '';
    window.history.replaceState({}, document.title, url.toString());
  }
}

function trackEmailConfirmedLoginIfNeeded() {
  if (!currentUser?.id) {
    return;
  }

  if (!localStorage.getItem(EMAIL_CONFIRMATION_PENDING_KEY)) {
    return;
  }

  if (!isEmailConfirmationRedirect()) {
    return;
  }

  const trackedUserId = localStorage.getItem(EMAIL_CONFIRMATION_TRACKED_KEY);

  if (trackedUserId === currentUser.id) {
    clearEmailConfirmationParamsFromUrl();
    return;
  }

  trackGoal('email_confirmed_login');
  localStorage.setItem(EMAIL_CONFIRMATION_TRACKED_KEY, currentUser.id);
  localStorage.removeItem(EMAIL_CONFIRMATION_PENDING_KEY);
  clearEmailConfirmationParamsFromUrl();
}

async function loadCurrentUserRole() {
  if (!currentUser) {
    currentUserRole = null;
    updateAdminStatus();
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      console.error('Ошибка загрузки роли пользователя:', error);
      currentUserRole = null;
    } else {
      currentUserRole = data?.role || null;
    }
  } catch (error) {
    console.error('Ошибка loadCurrentUserRole:', error);
    currentUserRole = null;
  }

  updateAdminStatus();
}

function updateAdminStatus() {
  isAdmin = Boolean(currentUser && currentUserRole === 'admin');
}

function getCurrentUserMovieState(movieId) {
  if (!currentUser) {
    return {
      hasWatchlistRecord: false,
      isWatched: false,
      isInWatchlist: false
    };
  }

  const hasWatchlistRecord = allMovieWatchlist.some(item => (
    item.movie_id === movieId && item.user_id === currentUser.id
  ));
  const isWatched = getCurrentUserRating(movieId) !== null;

  return {
    hasWatchlistRecord,
    isWatched,
    isInWatchlist: hasWatchlistRecord && !isWatched
  };
}

function isMovieInCurrentUserWatchlist(movieId) {
  return getCurrentUserMovieState(movieId).isInWatchlist;
}

function hasMovieWatchlistRecord(movieId) {
  return getCurrentUserMovieState(movieId).hasWatchlistRecord;
}

function updateLocalWatchlistState(movieId, shouldExist) {
  if (!currentUser) {
    return;
  }

  const existingRecordIndex = allMovieWatchlist.findIndex(item => (
    item.movie_id === movieId && item.user_id === currentUser.id
  ));

  if (shouldExist) {
    if (existingRecordIndex === -1) {
      allMovieWatchlist.push({
        movie_id: movieId,
        user_id: currentUser.id
      });
    }

    return;
  }

  if (existingRecordIndex !== -1) {
    allMovieWatchlist.splice(existingRecordIndex, 1);
  }
}

/* =========================================================
JS-БЛОК 5. ПОИСК ПО КАТАЛОГУ
Проверяет, соответствует ли фильм текущему текстовому запросу.
========================================================== */
function textMatchesSearchQuery(text, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return true;
  }

  const normalizedText = normalizeSearchText(text);
  const queryWords = normalizedQuery.split(' ').filter(Boolean);

  return queryWords.every(word => normalizedText.includes(word));
}

function getMatchedSearchAlias(movie, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return null;
  }

  const hasVisibleMatch = [
    movie.title,
    movie.original_title,
    movie.director
  ].some(value => textMatchesSearchQuery(value, searchQuery));

  if (hasVisibleMatch) {
    return null;
  }

  return (movie.search_aliases || []).find(alias => textMatchesSearchQuery(alias, searchQuery)) || null;
}

function movieMatchesSearch(movie, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = normalizeSearchText([
    movie.title,
    movie.original_title,
    movie.director,
    ...(movie.search_aliases || [])
  ].join(' '));

  const queryWords = normalizedQuery.split(' ').filter(Boolean);

  return queryWords.every(word => searchableText.includes(word));
}

/* =========================================================
JS-БЛОК 6. РАБОТА С СООБЩЕНИЯМИ АВТОРИЗАЦИИ
Показывает, очищает и автоматически скрывает статусы auth-блока.
========================================================== */
function showAuthMessage(text, type = 'info', autoHide = false) {
  if (!authMessage || !authToast) {
    return;
  }

  if (authMessageTimer) {
    clearTimeout(authMessageTimer);
    authMessageTimer = null;
  }

  authMessage.textContent = text;
  authToast.classList.remove('is-hidden', 'is-error', 'is-success', 'is-visible');
  authMessage.classList.remove('is-error', 'is-success');

  if (type === 'error') {
    authToast.classList.add('is-error');
    authMessage.classList.add('is-error');
  }

  if (type === 'success') {
    authToast.classList.add('is-success');
    authMessage.classList.add('is-success');
  }

  requestAnimationFrame(() => {
    authToast.classList.add('is-visible');
  });

  if (autoHide) {
    authMessageTimer = setTimeout(() => {
      authToast.classList.remove('is-visible');

      setTimeout(() => {
        authToast.classList.add('is-hidden');
        authToast.classList.remove('is-error', 'is-success');
        authMessage.classList.remove('is-error', 'is-success');
        authMessage.textContent = '';
      }, 250);
    }, 2600);
  }
}

function clearAuthMessage() {
  if (!authMessage || !authToast) {
    return;
  }

  if (authMessageTimer) {
    clearTimeout(authMessageTimer);
    authMessageTimer = null;
  }

  authToast.classList.remove('is-visible', 'is-error', 'is-success');
  authToast.classList.add('is-hidden');
  authMessage.classList.remove('is-error', 'is-success');
  authMessage.textContent = '';
}

function setAuthSubmittingState(isSubmitting) {
  isAuthSubmitting = isSubmitting;

  if (loginEmail) {
    loginEmail.disabled = isSubmitting;
  }

  if (loginPassword) {
    loginPassword.disabled = isSubmitting;
  }

  const loginSubmitButton = loginForm?.querySelector('button[type="submit"]');

  if (loginSubmitButton) {
    loginSubmitButton.disabled = isSubmitting;
  }

  if (registerButton) {
    registerButton.disabled = isSubmitting;
  }

  if (logoutButton) {
    logoutButton.disabled = isSubmitting;
  }
}

/* =========================================================
JS-БЛОК 7. УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ И ФОРМОЙ
Открывает/закрывает модалку и переключает форму между режимами
создания и редактирования фильма.
========================================================== */
function syncBodyScrollLock() {
  const shouldLockScroll = (
    isModalOpen ||
    (filtersModal && filtersModal.style.display === 'block') ||
    (mobileRatingModal && mobileRatingModal.classList.contains('is-visible'))
  );

  document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
}

function openMovieModal() {
  movieModal.style.display = 'block';
  isModalOpen = true;
  syncBodyScrollLock();

  requestAnimationFrame(() => {
    titleInput.focus();
  });
}

function closeMovieModal() {
  movieModal.style.display = 'none';
  isModalOpen = false;
  syncBodyScrollLock();
}

function openFiltersModal() {
  if (!filtersModal) {
    return;
  }

  filtersModal.style.display = 'block';
  syncBodyScrollLock();
}

function closeFiltersModal() {
  if (!filtersModal) {
    return;
  }

  filtersModal.style.display = 'none';
  syncBodyScrollLock();
}

function setMovieFormSubmittingState(isSubmitting) {
  isMovieFormSubmitting = isSubmitting;

  submitButton.disabled = isSubmitting;
  cancelEditButton.disabled = isSubmitting;
  closeMovieModalButton.disabled = isSubmitting;

  if (openAddMovieButton) {
    openAddMovieButton.disabled = isSubmitting;
  }
}

function setMovieFormStatus(message) {
  formMessage.textContent = message;
}

function resetFormToCreateMode() {
  editingMovieId = null;
  movieForm.reset();
  posterFileInput.value = '';
  updatePosterFileUi(); // после сброса снова показываем "Файл не выбран"
  formTitle.textContent = 'Добавить фильм';
  submitButton.textContent = 'Добавить фильм';
  cancelEditButton.style.display = 'none';
  formMessage.textContent = '';

  refreshCustomSelect(releaseMonthInput);
}

function fillFormForEdit(movie) {
  editingMovieId = movie.id;

  // Безопасно заполняем поля и сразу видим в консоли, какого элемента не хватает
  const setInputValue = (inputElement, value, inputName) => {
    if (!inputElement) {
      console.error(`Не найден элемент формы: ${inputName}`);
      return;
    }

    inputElement.value = value ?? '';
  };

  setInputValue(titleInput, movie.title, 'titleInput');
  setInputValue(originalTitleInput, movie.original_title, 'originalTitleInput');
  setInputValue(yearInput, movie.year, 'yearInput');
  setInputValue(releaseMonthInput, movie.release_month, 'releaseMonthInput');
  setInputValue(releaseYearInput, movie.release_year, 'releaseYearInput');
  setInputValue(sortOrderInput, movie.sort_order, 'sortOrderInput');
  setInputValue(directorInput, movie.director, 'directorInput');
  setInputValue(kinopoiskUrlInput, movie.kinopoisk_url, 'kinopoiskUrlInput');
  setInputValue(imdbUrlInput, movie.imdb_url, 'imdbUrlInput');
  setInputValue(letterboxdUrlInput, movie.letterboxd_url, 'letterboxdUrlInput');
  setInputValue(rottentomatoesUrlInput, movie.rottentomatoes_url, 'rottentomatoesUrlInput');

  if (posterFileInput) {
    posterFileInput.value = '';
  }

  updatePosterFileUi();

  const genres = movie.movie_genres
    .map(item => item.genres.name)
    .filter(name => normalizeSearchText(name) !== 'ужасы')
    .join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');

  setInputValue(genresInput, genres, 'genresInput');
  setInputValue(countriesInput, countries, 'countriesInput');
  setInputValue(searchAliasesInput, (movie.search_aliases || []).join('\n'), 'searchAliasesInput');

  formTitle.textContent = `Редактирование: ${movie.title}`;
  submitButton.textContent = 'Сохранить изменения';
  cancelEditButton.style.display = 'inline-block';
  formMessage.textContent = '';

  refreshCustomSelect(releaseMonthInput);

  openMovieModal();
}

/* =========================================================
JS-БЛОК 8. УПРАВЛЕНИЕ AUTH-ИНТЕРФЕЙСОМ
Показывает или скрывает форму входа и админские элементы
в зависимости от статуса пользователя.
========================================================== */
function updateAuthUI() {
  const isLoggedIn = Boolean(currentUser);

  loginForm.style.display = isLoggedIn ? 'none' : 'flex';
  userPanel.style.display = isLoggedIn ? 'flex' : 'none';
  adminPanel.style.display = isAdmin ? 'flex' : 'none';

  if (authControls) {
    authControls.classList.remove('auth-controls-pending');
  }

  let didResetUserOnlyCatalogFilters = false;

  if (watchlistFilterRow && watchlistFilter) {
    watchlistFilterRow.style.display = isLoggedIn ? 'flex' : 'none';

    if (!isLoggedIn) {
      didResetUserOnlyCatalogFilters = didResetUserOnlyCatalogFilters || watchlistFilter.value !== '';
      watchlistFilter.value = '';
      refreshCustomSelect(watchlistFilter);
    }
  }

  if (watchedFilterRow && watchedFilter) {
    watchedFilterRow.style.display = isLoggedIn ? 'flex' : 'none';

    if (!isLoggedIn) {
      didResetUserOnlyCatalogFilters = didResetUserOnlyCatalogFilters || watchedFilter.value !== '';
      watchedFilter.value = '';
      refreshCustomSelect(watchedFilter);
    }
  }

  if (didResetUserOnlyCatalogFilters) {
    saveCatalogState();
  }

  if (!isAdmin) {
    resetFormToCreateMode();
    closeMovieModal();
  }

  syncQuickPresetButtons();
}

/* =========================================================
JS-БЛОК 8A. ПОДКЛЮЧЕНИЕ МОДУЛЯ КАСТОМНЫХ SELECT
Собирает все select-элементы в одном месте и передаёт их
во внешний менеджер кастомных select.
========================================================== */
const filterCustomSelectElements = [
  genreFilter,
  countryFilter,
  ratingFilter,
  yearFilter,
  watchlistFilter,
  watchedFilter,
  viewMode,
  sortMode
].filter(Boolean);

const modalCustomSelectElements = [
  releaseMonthInput
].filter(Boolean);

const customSelectElements = [
  ...filterCustomSelectElements,
  ...modalCustomSelectElements
];

const customSelectManager = createCustomSelectManager({
  selectElements: customSelectElements,
  normalizeSearchText
});

const {
  initCustomSelects,
  refreshCustomSelect,
  closeAllCustomSelects,
  bindGlobalEvents: bindCustomSelectGlobalEvents
} = customSelectManager;

function refreshCustomSelectGroup(selectElements) {
  selectElements.forEach(selectElement => {
    refreshCustomSelect(selectElement);
  });
}

/* =========================================================
JS-БЛОК 9. ЗАГРУЗКА СПРАВОЧНИКОВ ДЛЯ ФИЛЬТРОВ
Получает жанры и страны из базы и заполняет select-поля.
========================================================== */
async function loadGenres() {
  const { data, error } = await supabaseClient
    .from('genres')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Ошибка загрузки жанров:', error);
    return;
  }

  genreFilter.innerHTML = '<option value="">Все доп. жанры</option>';

  data
  .filter(item => normalizeSearchText(item.name) !== 'ужасы')
  .forEach(item => {
    const option = document.createElement('option');
    option.value = item.name;
    option.textContent = item.name;
    genreFilter.appendChild(option);
  });

  refreshCustomSelect(genreFilter);
}

async function loadCountries() {
  const { data, error } = await supabaseClient
    .from('countries')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Ошибка загрузки стран:', error);
    return;
  }

  countryFilter.innerHTML = '<option value="">Все</option>';

  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.name;
    option.textContent = item.name;
    countryFilter.appendChild(option);
  });

  refreshCustomSelect(countryFilter);
}

function loadYearFilterOptions() {
  const years = [
    ...new Set(
      allMovies
        .map(movie => movie.year)
        .filter(Boolean)
    )
  ].sort((a, b) => b - a);

  yearFilter.innerHTML = '<option value="">Все годы</option>';

  years.forEach(year => {
    const option = document.createElement('option');
    option.value = String(year);
    option.textContent = String(year);
    yearFilter.appendChild(option);
  });

  refreshCustomSelect(yearFilter);
}

/* =========================================================
JS-БЛОК 10. ЗАГРУЗКА ДАННЫХ КАТАЛОГА
Получает фильмы и пользовательские оценки из Supabase.
========================================================== */
async function fetchMovies() {
  const { data, error } = await supabaseClient
    .from('movies')
    .select(`
      id,
      title,
      original_title,
      year,
      director,
      search_aliases,
      rating,
      poster_url,
      kinopoisk_url,
      imdb_url,
      letterboxd_url,
      rottentomatoes_url,
      release_year,
      release_month,
      sort_order,
      movie_genres (
        position,
        genres (name)
      ),
      movie_countries (
        countries (name)
      )
    `)
    .order('title', { ascending: true })
    .order('position', { foreignTable: 'movie_genres', ascending: true });

  if (error) {
    moviesLoadedSuccessfully = false;
    console.error('Ошибка загрузки фильмов:', error);
    container.innerHTML = 'Ошибка загрузки фильмов. Открой консоль F12.';
    return;
  }

  allMovies = data || [];
  moviesLoadedSuccessfully = true;
  loadYearFilterOptions();
}

async function fetchMovieRatings() {
  const { data, error } = await supabaseClient
    .from('movie_ratings')
    .select('movie_id, user_id, rating');

  if (error) {
    console.error('Ошибка загрузки оценок фильмов:', error);
    allMovieRatings = [];
    return;
  }

  allMovieRatings = data || [];
}

async function fetchMovieWatchlist() {
  if (!currentUser) {
    allMovieWatchlist = [];
    return;
  }

  const { data, error } = await supabaseClient
    .from('movie_watchlist')
    .select('movie_id, user_id')
    .eq('user_id', currentUser.id);

  if (error) {
    console.error('Ошибка загрузки watchlist:', error);
    allMovieWatchlist = [];
    return;
  }

  allMovieWatchlist = data || [];
}

async function reloadCatalogData({ showSkeleton = false } = {}) {
  shouldFadeCatalogAfterSkeleton = showSkeleton;

  if (showSkeleton) {
    renderMoviesSkeleton(getCatalogSkeletonCardsCount());
  }

  await Promise.all([
    loadGenres(),
    loadCountries(),
    fetchMovies(),
    fetchMovieRatings(),
    fetchMovieWatchlist()
  ]);

  initCustomSelects();
}

function preserveWindowScrollPosition(callback) {
  const currentScrollY = window.scrollY;

  callback();

  requestAnimationFrame(() => {
    scrollWindowToPosition(currentScrollY);
  });
}

function scrollWindowToPosition(top) {
  window.scrollTo({
    top,
    behavior: 'auto'
  });
}

function scrollWindowByDelta(topDelta) {
  window.scrollBy({
    top: topDelta,
    behavior: 'auto'
  });
}

function restoreCatalogAnchorMoviePosition(movieId) {
  if (!movieId) {
    return;
  }

  const anchoredCard = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!anchoredCard) {
    return;
  }

  const anchoredCardTop = anchoredCard.getBoundingClientRect().top;
  const targetTop = Math.max(96, window.innerHeight * 0.18);
  const scrollDelta = anchoredCardTop - targetTop;

  if (scrollDelta !== 0) {
    scrollWindowByDelta(scrollDelta);
  }
}

const FULL_CATALOG_RERENDER_PRESETS = {
  preservePosition: {
    preserveScroll: true,
    restoreAnchor: true
  },
  preserveScrollOnly: {
    preserveScroll: true,
    restoreAnchor: false
  },
  resetView: {
    preserveScroll: false,
    restoreAnchor: false
  }
};

const MOVIE_MUTATION_RERENDER_PRESETS = {
  watchlistToggle: movieId => {
    rerenderCatalogWithFallback(movieId, shouldRenderFullCatalogAfterWatchlistChange());
  },
  ratingChange: movieId => {
    rerenderCatalogWithFallback(
      movieId,
      shouldRenderFullCatalogAfterRatingChange(),
      false,
      false
    );
  }
};

function rerenderCatalogAfterDataReload(
  anchorMovieId = null,
  rerenderPreset = FULL_CATALOG_RERENDER_PRESETS.preservePosition
) {
  const { preserveScroll = true, restoreAnchor = true } = rerenderPreset;
  const nextAnchorMovieId = restoreAnchor
    ? (anchorMovieId ?? lastCatalogAnchorMovieId)
    : null;
  const shouldRunCatalogFade = shouldFadeCatalogAfterSkeleton;

  shouldFadeCatalogAfterSkeleton = false;

  if (catalogFadeCleanupTimerId) {
    clearTimeout(catalogFadeCleanupTimerId);
    catalogFadeCleanupTimerId = null;
  }

  if (!shouldRunCatalogFade) {
    container.classList.remove('is-catalog-fading');
  }

  if (shouldRunCatalogFade) {
    container.classList.add('is-catalog-fading');
    container.classList.remove('is-catalog-visible');
  }

  if (preserveScroll) {
    preserveWindowScrollPosition(renderMovies);
  } else {
    renderMovies();
  }

  if (shouldRunCatalogFade) {
    requestAnimationFrame(() => {
      container.classList.add('is-catalog-visible');
    });

    catalogFadeCleanupTimerId = setTimeout(() => {
      container.classList.remove('is-catalog-fading');
      catalogFadeCleanupTimerId = null;
    }, 260);
  }

  if (!nextAnchorMovieId) {
    return;
  }

  scheduleCatalogAnchorRestore(nextAnchorMovieId);
}

function shouldRenderFullCatalogAfterWatchlistChange() {
  return Boolean(watchlistFilter.value);
}

function shouldRenderFullCatalogAfterRatingChange() {
  return Boolean(
    watchedFilter.value ||
    watchlistFilter.value ||
    ratingFilter.value !== ''
  );
}

/* =========================================================
JS-БЛОК 11. РАСЧЁТ И ЧТЕНИЕ ОЦЕНОК
Собирает оценки фильма, считает средний рейтинг и находит
оценку текущего пользователя.
========================================================== */
function getMovieRatings(movieId) {
  return allMovieRatings.filter(item => item.movie_id === movieId);
}

function getMovieAverageRating(movieId) {
  const ratings = getMovieRatings(movieId);

  if (ratings.length === 0) {
    return 0;
  }

  const sum = ratings.reduce((acc, item) => acc + Number(item.rating || 0), 0);
  const average = sum / ratings.length;

  return Number(average.toFixed(1));
}

function getCurrentUserRating(movieId) {
  if (!currentUser) {
    return null;
  }

  const userRatingRow = allMovieRatings.find(item => (
    item.movie_id === movieId && item.user_id === currentUser.id
  ));

  return userRatingRow ? Number(userRatingRow.rating) : null;
}

function isMovieWatchedByCurrentUser(movieId) {
  return getCurrentUserMovieState(movieId).isWatched;
}

function clearSearchInput() {
  if (!searchInput.value) {
    return;
  }

  searchInput.value = '';
  lastSearchQuery = '';

  if (searchClearBtn) {
    searchClearBtn.style.display = 'none';
  }

  saveCatalogState();
}

function resetFilterControls({ preserveSearch = false } = {}) {
  if (!preserveSearch) {
    clearSearchInput();
  }

  genreFilter.value = '';
  countryFilter.value = '';
  ratingFilter.value = '';
  yearFilter.value = '';
  watchlistFilter.value = '';
  watchedFilter.value = '';

  refreshCustomSelectGroup(
    filterCustomSelectElements.filter(selectElement => selectElement !== sortMode)
  );

  saveCatalogState();
}

function resetCatalogFiltersAndRerender({ preserveSearch = false } = {}) {
  resetFilterControls({ preserveSearch });
  saveCatalogStateAndRenderFilters();
}

function clearSearchAndRerenderPreservingPosition() {
  clearSearchInput();
  rerenderCatalogPreservingPosition();
}

function getActiveQuickPresetKey() {
  const hasSearchQuery = searchInput.value.trim() !== '';
  const hasGenreFilter = Boolean(genreFilter.value);
  const hasCountryFilter = Boolean(countryFilter.value);
  const hasYearFilter = Boolean(yearFilter.value);

  if (hasSearchQuery || hasGenreFilter || hasCountryFilter || hasYearFilter) {
    return null;
  }

  if (
    ratingFilter.value === '7' &&
    (!currentUser || (!watchlistFilter.value && !watchedFilter.value))
  ) {
    return 'top-rated';
  }

  if (
    ratingFilter.value === '3' &&
    (!currentUser || (!watchlistFilter.value && !watchedFilter.value))
  ) {
    return 'low-rated';
  }

  if (
    currentUser &&
    watchlistFilter.value === 'in_watchlist' &&
    !watchedFilter.value &&
    ratingFilter.value === ''
  ) {
    return 'watchlist';
  }

  if (
    currentUser &&
    watchedFilter.value === 'watched' &&
    !watchlistFilter.value &&
    ratingFilter.value === ''
  ) {
    return 'watched';
  }

  if (
    currentUser &&
    watchedFilter.value === 'unwatched' &&
    !watchlistFilter.value &&
    ratingFilter.value === ''
  ) {
    return 'unwatched';
  }

  return null;
}

function syncQuickPresetButtons() {
  if (!quickPresetsBar) {
    return;
  }

  const activePresetKey = getActiveQuickPresetKey();

  quickPresetsBar.querySelectorAll('.quick-preset-button').forEach(button => {
    const presetKey = button.dataset.quickPreset;
    const requiresAuth = button.dataset.requiresAuth === 'true';
    const shouldHide = requiresAuth && !currentUser;

    button.style.display = shouldHide ? 'none' : 'inline-flex';
    button.classList.toggle('is-active', !shouldHide && presetKey === activePresetKey);
  });
}

function applyQuickPreset(presetKey) {
  resetFilterControls();
  sortMode.value = 'default';

  if (presetKey === 'top-rated') {
    ratingFilter.value = '7';
  }

  if (presetKey === 'low-rated') {
    ratingFilter.value = '3';
  }

  if (presetKey === 'watchlist' && currentUser) {
    watchlistFilter.value = 'in_watchlist';
  }

  if (presetKey === 'watched' && currentUser) {
    watchedFilter.value = 'watched';
  }

  if (presetKey === 'unwatched' && currentUser) {
    watchedFilter.value = 'unwatched';
  }

  refreshCustomSelectGroup([
    ratingFilter,
    watchlistFilter,
    watchedFilter,
    sortMode
  ]);

  syncCatalogViewToggleButton();
  saveCatalogStateAndRender();
}

function getActiveFilterChips() {
  const chips = [];

  if (watchlistFilter.value === 'in_watchlist') {
    chips.push({ label: 'Смотреть позже: только в списке', key: 'watchlist' });
  }

  if (watchlistFilter.value === 'not_in_watchlist') {
    chips.push({ label: 'Смотреть позже: скрыть из списка', key: 'watchlist' });
  }

  if (watchedFilter.value === 'watched') {
    chips.push({ label: 'Просмотренные: только просмотренные', key: 'watched' });
  }

  if (watchedFilter.value === 'unwatched') {
    chips.push({ label: 'Просмотренные: скрыть просмотренные', key: 'watched' });
  }

  if (genreFilter.value) {
    chips.push({ label: `Жанр: ${genreFilter.value}`, key: 'genre' });
  }

  if (yearFilter.value) {
    chips.push({ label: `Год: ${yearFilter.value}`, key: 'year' });
  }

  if (countryFilter.value) {
    chips.push({ label: `Страна: ${countryFilter.value}`, key: 'country' });
  }

  if (ratingFilter.value !== '') {
    const isLowRatedPresetActive = getActiveQuickPresetKey() === 'low-rated';

    chips.push({
      label: isLowRatedPresetActive
        ? `Рейтинг: до ${ratingFilter.value}`
        : `Рейтинг: от ${ratingFilter.value}`,
      key: 'rating'
    });
  }

  return chips;
}

function updateFiltersModalStatus() {
  if (!filtersModalStatus || !resetFiltersTopButton) {
    return;
  }

  const activeFiltersCount = getActiveFilterChips().length;
  const hasActiveFilters = activeFiltersCount > 0;

  filtersModalStatus.textContent = hasActiveFilters
    ? `Активно фильтров: ${activeFiltersCount}`
    : 'Активных фильтров нет';

  filtersModalStatus.style.display = 'block';
  filtersModalStatus.classList.toggle('is-active', hasActiveFilters);
  resetFiltersTopButton.style.display = hasActiveFilters ? 'inline-flex' : 'none';
}

function updateFiltersButtonLabel() {
  if (!openFiltersButton) {
    updateFiltersModalStatus();
    return;
  }

  const activeFiltersCount = getActiveFilterChips().length;
  const hasActiveFilters = activeFiltersCount > 0;

  openFiltersButton.textContent = hasActiveFilters
    ? `Фильтровать (${activeFiltersCount})`
    : 'Фильтровать';

  openFiltersButton.classList.toggle('is-active', hasActiveFilters);
  updateFiltersModalStatus();
}

function clearFilterChip(filterKey) {
  if (filterKey === 'watchlist') {
    watchlistFilter.value = '';
    refreshCustomSelect(watchlistFilter);
  }

  if (filterKey === 'watched') {
    watchedFilter.value = '';
    refreshCustomSelect(watchedFilter);
  }

  if (filterKey === 'genre') {
    genreFilter.value = '';
    refreshCustomSelect(genreFilter);
  }

  if (filterKey === 'year') {
    yearFilter.value = '';
    refreshCustomSelect(yearFilter);
  }

  if (filterKey === 'country') {
    countryFilter.value = '';
    refreshCustomSelect(countryFilter);
  }

  if (filterKey === 'rating') {
    ratingFilter.value = '';
    refreshCustomSelect(ratingFilter);
  }

  saveCatalogStateAndRenderFilters();

  // Если модалка фильтров была открыта, после снятия фильтра закрываем её,
  // чтобы внешняя очистка состояния ощущалась завершённым действием.
  if (filtersModal && filtersModal.style.display === 'block') {
    closeFiltersModal();
  }
}

function renderActiveFilterChips() {
  if (!activeFiltersBar) {
    updateFiltersButtonLabel();
    return;
  }

  const chips = getActiveFilterChips();

  updateFiltersButtonLabel();

  if (chips.length === 0) {
    activeFiltersBar.style.display = 'none';
    activeFiltersBar.innerHTML = '';
    return;
  }

  activeFiltersBar.style.display = 'flex';
  activeFiltersBar.innerHTML = chips.map(chip => `
    <div class="active-filter-chip">
      <span>${chip.label}</span>
      <button
        type="button"
        class="active-filter-chip-remove"
        data-filter-key="${chip.key}"
        aria-label="Убрать фильтр"
        title="Убрать фильтр"
      >
        ×
      </button>
    </div>
  `).join('');

  activeFiltersBar.querySelectorAll('.active-filter-chip-remove').forEach(button => {
    button.addEventListener('click', () => {
      clearFilterChip(button.dataset.filterKey);
    });
  });
}

/* =========================================================
JS-БЛОК 12. РАБОТА С POSTER STORAGE
Загружает новый постер, определяет storage-путь и удаляет
старый файл при замене.
========================================================== */
function extractPosterStoragePath(publicUrl) {
  if (!publicUrl) {
    return null;
  }

  const marker = '/storage/v1/object/public/posters/';

  if (!publicUrl.includes(marker)) {
    return null;
  }

  const path = publicUrl.split(marker)[1];

  return path || null;
}

async function uploadPosterFile(file) {
  if (!file) {
    return null;
  }

  // Нормализуем расширение, чтобы в имени файла не оказывался мусор.
  const rawExtension = String(file.name || 'jpg').split('.').pop() || 'jpg';
  const fileExtension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;
  const storagePath = fileName; // bucket уже posters, поэтому без лишнего вложенного префикса

  const { error: uploadError } = await supabaseClient.storage
    .from('posters')
    .upload(storagePath, file, {
      upsert: false
    });

  throwIfSupabaseError(uploadError);

  const { data } = supabaseClient.storage
    .from('posters')
    .getPublicUrl(storagePath);

  return data?.publicUrl || null;
}

async function deletePosterFileByUrl(publicUrl) {
  const storagePath = extractPosterStoragePath(publicUrl);

  if (!storagePath) {
    return;
  }

  const { error } = await supabaseClient.storage
    .from('posters')
    .remove([storagePath]);

  throwIfSupabaseError(error);
}

/* =========================================================
JS-БЛОК 13. ПОДГОТОВКА ЖАНРОВ И СТРАН
Гарантирует наличие жанров и стран в справочниках перед
созданием связей many-to-many.
========================================================== */
async function ensureGenres(names) {
  if (names.length === 0) {
    return [];
  }

  const rowsToUpsert = names.map(name => ({ name }));

  const { error: upsertError } = await supabaseClient
    .from('genres')
    .upsert(rowsToUpsert, { onConflict: 'name' });

  throwIfSupabaseError(upsertError);

  const { data, error } = await supabaseClient
    .from('genres')
    .select('id, name')
    .in('name', names);

  throwIfSupabaseError(error);

  return data;
}

async function ensureCountries(names) {
  if (names.length === 0) {
    return [];
  }

  const rowsToUpsert = names.map(name => ({ name }));

  const { error: upsertError } = await supabaseClient
    .from('countries')
    .upsert(rowsToUpsert, { onConflict: 'name' });

  throwIfSupabaseError(upsertError);

  const { data, error } = await supabaseClient
    .from('countries')
    .select('id, name')
    .in('name', names);

  throwIfSupabaseError(error);

  return data;
}

/* =========================================================
JS-БЛОК 14. ОБНОВЛЕНИЕ СВЯЗЕЙ ФИЛЬМА
Удаляет старые связи фильма и создаёт новые связи
с жанрами и странами.
========================================================== */
async function replaceMovieRelations(movieId, genreNames, countryNames) {
  const genreRows = await ensureGenres(genreNames);
  const countryRows = await ensureCountries(countryNames);

  const { error: deleteGenresError } = await supabaseClient
    .from('movie_genres')
    .delete()
    .eq('movie_id', movieId);

  throwIfSupabaseError(deleteGenresError);

  const { error: deleteCountriesError } = await supabaseClient
    .from('movie_countries')
    .delete()
    .eq('movie_id', movieId);

  throwIfSupabaseError(deleteCountriesError);

  if (genreRows.length > 0) {
    const movieGenreRows = genreRows.map((genre, index) => ({
      movie_id: movieId,
      genre_id: genre.id,
      position: index
    }));

    const { error } = await supabaseClient
      .from('movie_genres')
      .insert(movieGenreRows);

    throwIfSupabaseError(error);
  }

  if (countryRows.length > 0) {
    const movieCountryRows = countryRows.map(country => ({
      movie_id: movieId,
      country_id: country.id
    }));

    const { error } = await supabaseClient
      .from('movie_countries')
      .insert(movieCountryRows);

    throwIfSupabaseError(error);
  }
}

/* =========================================================
JS-БЛОК 15. ДОБАВЛЕНИЕ ФИЛЬМА
Создаёт новый фильм и привязывает к нему жанры и страны.
========================================================== */
async function addMovie(event) {
  event.preventDefault();

  if (isMovieFormSubmitting) {
    return; // защита от повторного запуска, пока предыдущее сохранение ещё не завершилось
  }

  setMovieFormSubmittingState(true);
  setMovieFormStatus('Сохраняю...');

  const title = titleInput.value.trim();
  const originalTitle = originalTitleInput.value.trim();
  const year = yearInput.value.trim();
  const releaseMonth = releaseMonthInput.value.trim();
  const releaseYear = releaseYearInput.value.trim();
  const sortOrder = sortOrderInput.value.trim();
  const director = directorInput.value.trim();
  const posterFile = posterFileInput.files && posterFileInput.files[0]
    ? posterFileInput.files[0]
    : null;
  const kinopoiskUrl = normalizeOptionalUrl(kinopoiskUrlInput.value);
  const imdbUrl = normalizeOptionalUrl(imdbUrlInput.value);
  const letterboxdUrl = normalizeOptionalUrl(letterboxdUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);
  const searchAliases = parseMultilineValues(searchAliasesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  try {
    ensureActiveSessionForWrite();

    let finalPosterUrl = null;

    if (posterFile) {
      setMovieFormStatus('Загружаю постер...');
      finalPosterUrl = await withPendingRequestTimeout(
        uploadPosterFile(posterFile),
        20000,
        'Превышено время ожидания загрузки постера.'
      );
    }

    setMovieFormStatus('Сохраняю...');

    const { data: insertedMovie, error: insertMovieError } = await withPendingRequestTimeout(
      supabaseClient
        .from('movies')
        .insert({
          title,
          original_title: originalTitle || null,
          year: year ? Number(year) : null,
          director: director || null,
          search_aliases: searchAliases,
          rating: 0,
          poster_url: finalPosterUrl,
          kinopoisk_url: kinopoiskUrl || null,
          imdb_url: imdbUrl || null,
          letterboxd_url: letterboxdUrl || null,
          rottentomatoes_url: rottentomatoesUrl || null,
          release_month: releaseMonth ? Number(releaseMonth) : null,
          release_year: releaseYear ? Number(releaseYear) : null,
          sort_order: sortOrder ? Number(sortOrder) : null,
          owner_id: currentUser.id
        })
        .select('id') // сразу забираем id созданной записи, без повторного поиска по title
        .single(),
      15000,
      'Превышено время ожидания сохранения фильма.'
    );

    throwIfSupabaseError(insertMovieError);

    await withPendingRequestTimeout(
      replaceMovieRelations(insertedMovie.id, genreNames, countryNames),
      15000,
      'Превышено время ожидания сохранения жанров и стран.'
    );

    setMovieFormStatus('Обновляю каталог...');
    await withPendingRequestTimeout(
      reloadCatalogData({ showSkeleton: true }),
      15000,
      'Превышено время ожидания обновления каталога.'
      ); // сначала дожидаемся полной синхронизации состояния каталога

      rerenderCatalogAfterDataReload(insertedMovie.id);
      resetFormToCreateMode();
      closeMovieModal();
  } catch (error) {
    console.error('Ошибка при добавлении фильма:', error);
    setMovieFormStatus(`Ошибка при добавлении фильма: ${error.message || 'смотри консоль F12.'}`);
  } finally {
    setMovieFormSubmittingState(false);
  }
}

/* =========================================================
JS-БЛОК 16. РЕДАКТИРОВАНИЕ ФИЛЬМА
Обновляет фильм и пересобирает его связи и постер.
========================================================== */
async function updateMovie(event) {
  event.preventDefault();

  if (isMovieFormSubmitting) {
    return;
  }

  setMovieFormSubmittingState(true);
  setMovieFormStatus('Сохраняю изменения...');

  const title = titleInput.value.trim();
  const originalTitle = originalTitleInput.value.trim();
  const year = yearInput.value.trim();
  const releaseMonth = releaseMonthInput.value.trim();
  const releaseYear = releaseYearInput.value.trim();
  const sortOrder = sortOrderInput.value.trim();
  const director = directorInput.value.trim();
  const posterFile = posterFileInput.files && posterFileInput.files[0]
    ? posterFileInput.files[0]
    : null;
  const kinopoiskUrl = normalizeOptionalUrl(kinopoiskUrlInput.value);
  const imdbUrl = normalizeOptionalUrl(imdbUrlInput.value);
  const letterboxdUrl = normalizeOptionalUrl(letterboxdUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);
  const searchAliases = parseMultilineValues(searchAliasesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  const existingMovie = allMovies.find(movie => movie.id === editingMovieId);

  if (!existingMovie) {
    formMessage.textContent = 'Не удалось найти фильм для редактирования.';
    setMovieFormSubmittingState(false);
    return;
  }

  const oldPosterUrl = existingMovie.poster_url ?? null;

  const existingGenreNames = existingMovie.movie_genres
    .map(item => item.genres.name)
    .filter(Boolean);

  const existingCountryNames = existingMovie.movie_countries
    .map(item => item.countries.name)
    .filter(Boolean);

  const normalizedExistingGenres = [...existingGenreNames].sort((a, b) => a.localeCompare(b, 'ru'));
  const normalizedNewGenres = [...genreNames].sort((a, b) => a.localeCompare(b, 'ru'));

  const normalizedExistingCountries = [...existingCountryNames].sort((a, b) => a.localeCompare(b, 'ru'));
  const normalizedNewCountries = [...countryNames].sort((a, b) => a.localeCompare(b, 'ru'));

  const relationsChanged = (
    !areStringArraysEqual(normalizedExistingGenres, normalizedNewGenres) ||
    !areStringArraysEqual(normalizedExistingCountries, normalizedNewCountries)
  );

  try {
    ensureActiveSessionForWrite();

    let finalPosterUrl = existingMovie.poster_url ?? null;
    let uploadedNewPoster = false;

    if (posterFile) {
      setMovieFormStatus('Загружаю постер...');
      finalPosterUrl = await withPendingRequestTimeout(
        uploadPosterFile(posterFile),
        20000,
        'Превышено время ожидания загрузки постера.'
      );
      uploadedNewPoster = true;
    }

    const changedFields = {};

    // Передаём в update только реально изменившиеся поля.
    // Это уменьшает payload и снижает риск зависаний на большом запросе.
    if (title !== (existingMovie.title ?? '')) {
      changedFields.title = title;
    }

    if ((originalTitle || null) !== (existingMovie.original_title ?? null)) {
      changedFields.original_title = originalTitle || null;
    }

    if ((year ? Number(year) : null) !== (existingMovie.year ?? null)) {
      changedFields.year = year ? Number(year) : null;
    }

    if ((director || null) !== (existingMovie.director ?? null)) {
      changedFields.director = director || null;
    }

    if (!areStringArraysEqual(searchAliases, existingMovie.search_aliases || [])) {
      changedFields.search_aliases = searchAliases;
    }

    if (finalPosterUrl !== (existingMovie.poster_url ?? null)) {
      changedFields.poster_url = finalPosterUrl;
    }

    if ((kinopoiskUrl || null) !== (existingMovie.kinopoisk_url ?? null)) {
      changedFields.kinopoisk_url = kinopoiskUrl || null;
    }

    if ((imdbUrl || null) !== (existingMovie.imdb_url ?? null)) {
      changedFields.imdb_url = imdbUrl || null;
    }

    if ((letterboxdUrl || null) !== (existingMovie.letterboxd_url ?? null)) {
      changedFields.letterboxd_url = letterboxdUrl || null;
    }

    if ((rottentomatoesUrl || null) !== (existingMovie.rottentomatoes_url ?? null)) {
      changedFields.rottentomatoes_url = rottentomatoesUrl || null;
    }

    if ((releaseMonth ? Number(releaseMonth) : null) !== (existingMovie.release_month ?? null)) {
      changedFields.release_month = releaseMonth ? Number(releaseMonth) : null;
    }

    if ((releaseYear ? Number(releaseYear) : null) !== (existingMovie.release_year ?? null)) {
      changedFields.release_year = releaseYear ? Number(releaseYear) : null;
    }

    if ((sortOrder ? Number(sortOrder) : null) !== (existingMovie.sort_order ?? null)) {
      changedFields.sort_order = sortOrder ? Number(sortOrder) : null;
    }

    if (Object.keys(changedFields).length > 0) {
      setMovieFormStatus('Сохраняю изменения...');

      const { error: updateMovieError } = await withPendingRequestTimeout(
        supabaseClient
          .from('movies')
          .update(changedFields)
          .eq('id', editingMovieId),
        15000,
        'Превышено время ожидания обновления фильма.'
      );

      throwIfSupabaseError(updateMovieError);
    }

    if (relationsChanged) {
      await withPendingRequestTimeout(
        replaceMovieRelations(editingMovieId, genreNames, countryNames),
        15000,
        'Превышено время ожидания обновления жанров и стран.'
      );
    }

    if (uploadedNewPoster && oldPosterUrl && oldPosterUrl !== finalPosterUrl) {
      try {
        await deletePosterFileByUrl(oldPosterUrl);
      } catch (deletePosterError) {
        console.error('Не удалось удалить старый постер:', deletePosterError);
      }
    }

    if (Object.keys(changedFields).length === 0 && !relationsChanged) {
      setMovieFormStatus('Изменений нет.');
      closeMovieModal();
      resetFormToCreateMode();
      return;
    }

    setMovieFormStatus('Обновляю каталог...');
    await withPendingRequestTimeout(
      reloadCatalogData({ showSkeleton: true }),
      15000,
      'Превышено время ожидания обновления каталога.'
      );

      rerenderCatalogAfterDataReload(editingMovieId);
      closeMovieModal();
      resetFormToCreateMode();
  } catch (error) {
    console.error('Ошибка при редактировании фильма:', error);
    setMovieFormStatus(`Ошибка при редактировании фильма: ${error.message || 'смотри консоль F12.'}`);
  } finally {
    setMovieFormSubmittingState(false);
  }
}

/* =========================================================
JS-БЛОК 17. ЕДИНАЯ ТОЧКА СОХРАНЕНИЯ ФОРМЫ
Выбирает между добавлением нового фильма и редактированием
существующего.
========================================================== */
async function saveMovie(event) {
  if (editingMovieId) {
    await updateMovie(event);
  } else {
    await addMovie(event);
  }
}

/* =========================================================
JS-БЛОК 18. УДАЛЕНИЕ ФИЛЬМА
Удаляет фильм из базы и обновляет каталог.
========================================================== */
async function deleteMovie(movieId, movieTitle) {
  const isConfirmed = confirm(`Удалить фильм "${movieTitle}"?`);

  if (!isConfirmed) {
    return;
  }

  try {
    const { error } = await supabaseClient
      .from('movies')
      .delete()
      .eq('id', movieId);

      throwIfSupabaseError(error);

    if (editingMovieId === movieId) {
      resetFormToCreateMode();
    }

    await reloadCatalogData({ showSkeleton: true });
    rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);

    setMovieFormStatus(`Фильм "${movieTitle}" удалён.`);
  } catch (error) {
    console.error('Ошибка при удалении фильма:', error);
    setMovieFormStatus('Ошибка при удалении фильма. Смотри консоль F12.');
  }
}

/* =========================================================
JS-БЛОК 19. АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ
Восстанавливает сессию, выполняет вход, регистрацию и выход.
========================================================== */
async function restoreSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error('Ошибка получения сессии:', error);
    await applyCurrentSessionUser(null);
    return null;
  }

  const sessionUser = data.session?.user ?? null;

  await applyCurrentSessionUser(sessionUser);
  return sessionUser;
}

async function applyCurrentSessionUser(user) {
  currentUser = user ?? null;
  await loadCurrentUserRole();
  updateAuthUI();
}

function syncCatalogAfterAuthChange() {
  lastCatalogAnchorMovieId = null;
  rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.resetView);
}

function getReadableAuthErrorMessage(error, fallbackMessage) {
  const errorText = String(error?.message || '').toLowerCase();

  if (
    errorText.includes('email not confirmed') ||
    errorText.includes('email_not_confirmed')
  ) {
    return 'Почта ещё не подтверждена. Открой письмо от сервиса, подтверди e-mail и затем попробуй снова.';
  }

  if (
    errorText.includes('user already registered') ||
    errorText.includes('already registered') ||
    errorText.includes('email rate limit exceeded') ||
    errorText.includes('over_email_send_rate_limit')
  ) {
    if (
      errorText.includes('email rate limit exceeded') ||
      errorText.includes('over_email_send_rate_limit')
    ) {
      return 'Слишком много писем отправлено за короткое время. Подожди немного и попробуй снова.';
    }

    return 'Этот e-mail уже зарегистрирован. Попробуй войти или восстановить доступ позже.';
  }

  if (
    errorText.includes('password should be at least') ||
    errorText.includes('weak password')
  ) {
    return 'Пароль слишком простой. Используй более длинный и надёжный пароль.';
  }

  if (
    errorText.includes('invalid login credentials') ||
    errorText.includes('invalid email') ||
    errorText.includes('anonymous sign-ins are disabled')
  ) {
    return fallbackMessage;
  }

  return error?.message || fallbackMessage;
}

async function login(event) {
  event.preventDefault();

  if (isAuthSubmitting) {
    return;
  }

  setAuthSubmittingState(true);
  showAuthMessage('Выполняю вход...');

  try {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Ошибка входа:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Ошибка входа. Проверь e-mail и пароль.'),
        'error'
      );
      return;
    }

    loginPassword.value = '';

    showAuthMessage('Вход выполнен.', 'success', true);
  } finally {
    setAuthSubmittingState(false);
  }
}

async function register() {
  if (isAuthSubmitting) {
    return;
  }

  setAuthSubmittingState(true);
  showAuthMessage('Регистрирую аккаунт...');

  try {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      showAuthMessage('Введи email и пароль для регистрации.', 'error');
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('Ошибка регистрации:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Ошибка регистрации. Проверь e-mail и пароль.'),
        'error'
      );
      return;
    }

    loginPassword.value = '';
    loginEmail.focus();

    showAuthMessage(
      'Если аккаунт уже существует — попробуй войти. Если нет — проверь почту для завершения регистрации.',
      'success'
    );

    localStorage.setItem(EMAIL_CONFIRMATION_PENDING_KEY, '1');
    localStorage.removeItem(EMAIL_CONFIRMATION_TRACKED_KEY);
    trackGoal('register');
  } finally {
    setAuthSubmittingState(false);
  }
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error('Ошибка выхода:', error);
    showAuthMessage('Не удалось выйти.', 'error');
    return;
  }

  window.location.replace(window.location.pathname + window.location.search);
}

/* =========================================================
JS-БЛОК 20. ПОЛЬЗОВАТЕЛЬСКИЕ ОЦЕНКИ
Позволяет авторизованному пользователю поставить или обновить
свою оценку фильму.
========================================================== */
function triggerTemporaryFeedbackAnimation(element, baseKey, type = 'success', duration = 360) {
  if (!element) {
    return;
  }

  const timerKey = `${baseKey}:${type}`;
  const previousTimerId = feedbackAnimationTimers.get(timerKey);

  if (previousTimerId) {
    clearTimeout(previousTimerId);
  }

  element.classList.remove('is-feedback-success', 'is-feedback-remove');

  void element.offsetWidth;

  element.classList.add(type === 'remove' ? 'is-feedback-remove' : 'is-feedback-success');

  const timerId = setTimeout(() => {
    element.classList.remove('is-feedback-success', 'is-feedback-remove');
    feedbackAnimationTimers.delete(timerKey);
  }, duration);

  feedbackAnimationTimers.set(timerKey, timerId);
}

function showMovieRatingFeedback(movieId, type = 'success') {
  const card = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!card) {
    return;
  }

  const starsContainer = card.querySelector('.movie-user-rating-stars');
  const mobileTrigger = card.querySelector('.movie-user-rating-mobile-trigger');
  const ratingValueElement = card.querySelector('.movie-rating-value');

  triggerTemporaryFeedbackAnimation(starsContainer, `rating-stars-${movieId}`, type);
  triggerTemporaryFeedbackAnimation(mobileTrigger, `rating-mobile-${movieId}`, type);
  triggerTemporaryFeedbackAnimation(ratingValueElement, `rating-value-${movieId}`, type);
}

function showMovieWatchlistFeedback(movieId, type = 'success') {
  const card = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!card) {
    return;
  }

  const watchlistButton = card.querySelector('[data-watchlist-toggle="true"]');

  triggerTemporaryFeedbackAnimation(watchlistButton, `watchlist-btn-${movieId}`, type);
}

function armDeleteMovieButton(buttonElement, onConfirm) {
  if (!buttonElement) {
    return;
  }

  if (buttonElement.dataset.deleteArmed === 'true') {
    onConfirm();
    return;
  }

  const originalText = buttonElement.textContent;

  buttonElement.dataset.deleteArmed = 'true';
  buttonElement.textContent = 'Подтвердить';
  buttonElement.classList.add('is-delete-confirm');

  const resetDeleteButton = () => {
    buttonElement.dataset.deleteArmed = 'false';
    buttonElement.textContent = originalText;
    buttonElement.classList.remove('is-delete-confirm');
    buttonElement.removeEventListener('blur', resetDeleteButton);
    clearTimeout(resetTimerId);
  };

  const resetTimerId = setTimeout(() => {
    resetDeleteButton();
  }, 3200);

  buttonElement.addEventListener('blur', resetDeleteButton, { once: true });
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
  const scrollYBeforeMutation = window.scrollY;

  if (requestSet.has(String(movieId))) {
    return;
  }

  requestSet.add(String(movieId));

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
    requestSet.delete(String(movieId));

    if (actionSucceeded) {
      rerender();

      if (typeof onSuccess === 'function') {
        onSuccess();
      }

      if (preserveWindowScroll) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollYBeforeMutation,
            behavior: 'auto'
          });
        });
      }
    }
  }
}

function rerenderCatalogWithFallback(
  movieId,
  shouldRenderFullCatalog,
  preserveCardTop = true,
  animateStateAppearance = true
) {
  if (shouldRenderFullCatalog) {
    rerenderCatalogAfterDataReload(movieId);
  } else {
    rerenderMovieCard(movieId, { preserveCardTop, animateStateAppearance });
  }
}

async function addMovieToWatchlist(movieId) {
  if (!currentUser) {
    return;
  }

  const { error } = await supabaseClient
    .from('movie_watchlist')
    .upsert(
      {
        movie_id: movieId,
        user_id: currentUser.id
      },
      {
        onConflict: 'movie_id,user_id',
        ignoreDuplicates: true
      }
    );

  if (error) {
    throw error;
  }

  updateLocalWatchlistState(movieId, true);
}

async function removeMovieFromWatchlist(movieId) {
  if (!currentUser) {
    return;
  }

  const { error } = await supabaseClient
    .from('movie_watchlist')
    .delete()
    .eq('movie_id', movieId)
    .eq('user_id', currentUser.id);

  if (error) {
    throw error;
  }

  updateLocalWatchlistState(movieId, false);
}

async function toggleMovieWatchlist(movieId) {
  if (!currentUser) {
    return;
  }

  if (isMovieWatchedByCurrentUser(movieId)) {
    return;
  }

  const shouldRemoveFromWatchlist = hasMovieWatchlistRecord(movieId);

  await runMovieMutationWithUiSync({
    movieId,
    requestSet: watchlistRequestInFlight,
    mutation: async () => {
      if (shouldRemoveFromWatchlist) {
        await removeMovieFromWatchlist(movieId);
      } else {
        await addMovieToWatchlist(movieId);
      }
    },
    rerender: () => {
      MOVIE_MUTATION_RERENDER_PRESETS.watchlistToggle(movieId);
    },
    onSuccess: () => {
      if (shouldRemoveFromWatchlist) {
        showMovieWatchlistFeedback(movieId, 'remove');
      } else {
        showMovieWatchlistFeedback(movieId);
      }
    },
    onError: error => {
      console.error('Ошибка переключения watchlist:', error);
    },
    preserveWindowScroll: true
  });
}

async function removeUserMovieRating(movieId) {
  if (!currentUser) {
    return;
  }

  await runMovieMutationWithUiSync({
    movieId,
    requestSet: ratingRequestInFlight,
    mutation: async () => {
      const { error } = await supabaseClient
        .from('movie_ratings')
        .delete()
        .eq('movie_id', movieId)
        .eq('user_id', currentUser.id);

      if (error) {
        throw error;
      }

      allMovieRatings = allMovieRatings.filter(item => !(
        item.movie_id === movieId && item.user_id === currentUser.id
      ));

      updateLocalWatchlistState(movieId, true);
    },
    rerender: () => {
      MOVIE_MUTATION_RERENDER_PRESETS.ratingChange(movieId);
    },
    onSuccess: () => {
      showMovieRatingFeedback(movieId, 'remove');
    },
    onError: error => {
      console.error('Ошибка удаления оценки фильма:', error);
    }
  });
}

function isMobileRatingLayout() {
  return window.matchMedia('(max-width: 680px)').matches;
}

function ensureMobileRatingModal() {
  if (mobileRatingModal) {
    return;
  }

  mobileRatingModal = document.createElement('div');
  mobileRatingModal.className = 'mobile-rating-modal';
  mobileRatingModal.style.display = 'none';

  mobileRatingModal.innerHTML = `
    <div class="mobile-rating-modal-backdrop" data-mobile-rating-close="true"></div>
    <div
      class="mobile-rating-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobileRatingModalTitle"
    >
      <div class="mobile-rating-modal-header">
        <div class="mobile-rating-modal-title-wrap">
          <h3 id="mobileRatingModalTitle" class="mobile-rating-modal-title"></h3>
        </div>
        <button
          type="button"
          class="mobile-rating-modal-close secondary-button secondary-button-compact"
          data-mobile-rating-close="true"
        >
          Закрыть
        </button>
      </div>

      <div class="mobile-rating-modal-meta" id="mobileRatingModalMeta"></div>

      <div class="mobile-rating-modal-stars" id="mobileRatingModalStars"></div>

      <div class="mobile-rating-modal-actions">
        <button
          type="button"
          class="mobile-rating-modal-remove secondary-button secondary-button-compact"
          id="mobileRatingModalRemoveButton"
        >
          Удалить оценку
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(mobileRatingModal);

  mobileRatingModalTitle = mobileRatingModal.querySelector('#mobileRatingModalTitle');
  mobileRatingModalStars = mobileRatingModal.querySelector('#mobileRatingModalStars');
  mobileRatingModalMeta = mobileRatingModal.querySelector('#mobileRatingModalMeta');
  mobileRatingModalRemoveButton = mobileRatingModal.querySelector('#mobileRatingModalRemoveButton');

  mobileRatingModal.querySelectorAll('[data-mobile-rating-close="true"]').forEach(button => {
    button.addEventListener('click', () => {
      closeMobileRatingModal();
    });
  });

  mobileRatingModalRemoveButton.addEventListener('click', () => {
    if (mobileRatingModalMovieId === null) {
      return;
    }

    const movieIdToRemove = mobileRatingModalMovieId;

    closeMobileRatingModal();
    removeUserMovieRating(movieIdToRemove);
  });
}

function closeMobileRatingModal() {
  if (!mobileRatingModal) {
    return;
  }

  mobileRatingModal.classList.remove('is-visible');

  setTimeout(() => {
    if (!mobileRatingModal.classList.contains('is-visible')) {
      mobileRatingModal.style.display = 'none';
      syncBodyScrollLock();
    }
  }, 220);

  mobileRatingModalMovieId = null;
}

function openMobileRatingModal(movie) {
  if (!currentUser || !isMobileRatingLayout()) {
    return;
  }

  ensureMobileRatingModal();

  const movieId = movie.id;
  const currentUserRating = getCurrentUserRating(movieId);
  const hasCurrentUserRating = currentUserRating !== null;

  mobileRatingModalMovieId = movieId;
  mobileRatingModalTitle.textContent = movie.title;
  mobileRatingModalMeta.innerHTML = hasCurrentUserRating
  ? `Ваша оценка: <strong class="rating-value">${currentUserRating}/10</strong>`
  : 'Оценка ещё не поставлена';

  mobileRatingModalStars.innerHTML = `
    <div class="mobile-rating-stars-grid">
      ${Array.from({ length: 10 }, (_, index) => {
        const value = index + 1;
        const isActive = hasCurrentUserRating && value <= currentUserRating;

        return `
          <button
            type="button"
            class="mobile-rating-star-btn ${isActive ? 'is-active' : ''}"
            data-mobile-rating-value="${value}"
            aria-label="Оценка ${value} из 10"
          >
            ★
          </button>
        `;
      }).join('')}
    </div>

    <div class="mobile-rating-scale" aria-hidden="true">
      ${Array.from({ length: 10 }, (_, index) => {
        const value = index + 1;
        const isActive = hasCurrentUserRating && value <= currentUserRating;

        return `
          <span class="mobile-rating-scale-item ${isActive ? 'is-active' : ''}">${value}</span>
        `;
      }).join('')}
    </div>
  `;

  mobileRatingModalRemoveButton.style.display = hasCurrentUserRating ? 'inline-flex' : 'none';

  const mobileRatingButtons = mobileRatingModalStars.querySelectorAll('[data-mobile-rating-value]');
  const mobileRatingScaleItems = mobileRatingModalStars.querySelectorAll('.mobile-rating-scale-item');

  const applyMobileRatingHoverState = (activeValue, mode = 'selected') => {
    mobileRatingButtons.forEach(button => {
      const buttonValue = Number(button.dataset.mobileRatingValue);
      const isFilled = buttonValue <= activeValue;

      button.classList.toggle('is-hovered', mode === 'hover' && isFilled);
      button.classList.toggle('is-active', mode === 'selected' && isFilled);
    });

    mobileRatingScaleItems.forEach(item => {
      const itemValue = Number(item.textContent);
      const isFilled = itemValue <= activeValue;

      item.classList.toggle('is-hovered', mode === 'hover' && isFilled);
      item.classList.toggle('is-active', mode === 'selected' && isFilled);
    });
  };

  mobileRatingButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      const hoverValue = Number(button.dataset.mobileRatingValue);
      applyMobileRatingHoverState(hoverValue, 'hover');
    });

    button.addEventListener('click', () => {
      const ratingValue = Number(button.dataset.mobileRatingValue);

      closeMobileRatingModal();
      saveUserMovieRating(movieId, ratingValue);
    });
  });

  const selectedValue = currentUserRating ?? 0;

  mobileRatingModalStars.addEventListener('mouseleave', () => {
    applyMobileRatingHoverState(selectedValue, 'selected');
  });

  mobileRatingModal.style.display = 'block';

  requestAnimationFrame(() => {
    mobileRatingModal.classList.add('is-visible');
    syncBodyScrollLock();
  });
}

async function saveUserMovieRating(movieId, ratingValue) {
  if (!currentUser) {
    return;
  }

  // Оценка переводит фильм в просмотренные, но не удаляет саму
  // watchlist-запись: при снятии оценки фильм должен вернуться туда.
  const normalizedRating = Number(ratingValue);

  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 10
  ) {
    return;
  }

  await runMovieMutationWithUiSync({
    movieId,
    requestSet: ratingRequestInFlight,
    mutation: async () => {
      const { error } = await supabaseClient
        .from('movie_ratings')
        .upsert(
          {
            movie_id: movieId,
            user_id: currentUser.id,
            rating: normalizedRating
          },
          {
            onConflict: 'movie_id,user_id'
          }
        );

      if (error) {
        throw error;
      }

      allMovieRatings = allMovieRatings.filter(item => !(
        item.movie_id === movieId && item.user_id === currentUser.id
      ));

      allMovieRatings.push({
        movie_id: movieId,
        user_id: currentUser.id,
        rating: normalizedRating
      });

      if (typeof ym === 'function') {
        const lastRatedMovie = sessionStorage.getItem('last_rated_movie');

        if (lastRatedMovie !== String(movieId)) {
          ym(108369182, 'reachGoal', 'rate_movie');
          sessionStorage.setItem('last_rated_movie', String(movieId));
        }
      }
    },
    rerender: () => {
      MOVIE_MUTATION_RERENDER_PRESETS.ratingChange(movieId);
    },
    onSuccess: () => {
      showMovieRatingFeedback(movieId);
    },
    onError: error => {
      console.error('Ошибка сохранения оценки фильма:', error);
    }
  });
}

/* =========================================================
JS-БЛОК 21. ОТРИСОВКА КАТАЛОГА ФИЛЬМОВ
Применяет поиск, фильтры и сортировку, затем выводит карточки.
========================================================== */
function renderMoviesSkeleton(cardsCount = 8) {
  container.innerHTML = Array.from({ length: cardsCount }, () => `
    <article class="movie-card movie-card-skeleton">
      <div class="movie-poster-wrapper movie-poster-wrapper-skeleton">
        <div class="movie-poster-skeleton" aria-hidden="true"></div>
      </div>

      <div class="movie-text-skeleton movie-text-skeleton-title"></div>
      <div class="movie-text-skeleton"></div>
      <div class="movie-text-skeleton"></div>
      <div class="movie-text-skeleton"></div>
      <div class="movie-text-skeleton"></div>

      <div class="movie-rating-block">
        <div class="movie-text-skeleton movie-rating-skeleton"></div>
      </div>
    </article>
  `).join('');
}

function getCatalogSkeletonCardsCount() {
  const renderedCardsCount = container.querySelectorAll('.movie-card').length;

  if (renderedCardsCount > 0) {
    return renderedCardsCount;
  }

  const estimatedCardsCount = Number(getFilteredMovies()?.length || 0);

  if (estimatedCardsCount > 0) {
    return Math.min(estimatedCardsCount, 12);
  }

  return 8;
}

function getVotesLabel(votesCount) {
  if (votesCount === 1) {
    return 'оценка';
  }

  if (votesCount >= 2 && votesCount <= 4) {
    return 'оценки';
  }

  return 'оценок';
}

function sortMovies(movies, selectedSortMode) {
  if (selectedSortMode === 'oldest') {
    movies.sort((a, b) => {
      const yearA = a.release_year ?? Infinity;
      const yearB = b.release_year ?? Infinity;

      if (yearA !== yearB) {
        return yearA - yearB;
      }

      const monthA = a.release_month ?? Infinity;
      const monthB = b.release_month ?? Infinity;

      if (monthA !== monthB) {
        return monthA - monthB;
      }

      const orderA = a.sort_order ?? Infinity;
      const orderB = b.sort_order ?? Infinity;

      return orderA - orderB;
    });
    return;
  }

  movies.sort((a, b) => {
    const yearA = a.release_year ?? -Infinity;
    const yearB = b.release_year ?? -Infinity;

    if (yearB !== yearA) {
      return yearB - yearA;
    }

    const monthA = a.release_month ?? -Infinity;
    const monthB = b.release_month ?? -Infinity;

    if (monthB !== monthA) {
      return monthB - monthA;
    }

    const orderA = a.sort_order ?? -Infinity;
    const orderB = b.sort_order ?? -Infinity;

    return orderB - orderA;
  });
}

function getUserRatingControlsHtml(currentUserRating) {
  if (!currentUser) {
    return '';
  }

  const hasCurrentUserRating = currentUserRating !== null;

  return `
    <div class="movie-user-rating">
      <div class="movie-user-rating-label">Ваша оценка</div>

      <div class="movie-user-rating-desktop">
        <div class="movie-user-rating-stars" data-current-rating="${currentUserRating ?? 0}">
          ${Array.from({ length: 10 }, (_, index) => {
            const value = index + 1;
            const isActive = hasCurrentUserRating && value <= currentUserRating;

            return `
              <button
                type="button"
                class="rating-star-btn ${isActive ? 'is-active' : ''}"
                data-rating-value="${value}"
                aria-label="Оценка ${value} из 10"
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
        >
          ${hasCurrentUserRating ? `${currentUserRating}/10 <span class="movie-user-rating-mobile-star">★</span>` : 'Оценить'}
        </button>
      </div>
    </div>
  `;
}

function getMovieExternalIconSrc(type) {
  const icons = {
    kinopoisk: '/icons/kp.svg',
    imdb: '/icons/imdb.svg',
    letterboxd: '/icons/lb.svg',
    rottentomatoes: '/icons/rt.svg'
  };

  return icons[type] || '';
}

function getMovieExternalLinksHtml(movie) {
  const links = [
    {
      url: movie.kinopoisk_url,
      label: 'Кинопоиск',
      type: 'kinopoisk',
      className: 'is-kinopoisk'
    },
    {
      url: movie.imdb_url,
      label: 'IMDb',
      type: 'imdb',
      className: 'is-imdb'
    },
    {
      url: movie.letterboxd_url,
      label: 'Letterboxd',
      type: 'letterboxd',
      className: 'is-letterboxd'
    },
    {
      url: movie.rottentomatoes_url,
      label: 'Rotten Tomatoes',
      type: 'rottentomatoes',
      className: 'is-rottentomatoes'
    }
  ].filter(item => item.url);

  if (links.length === 0) {
    return '';
  }

  return `
    <div class="movie-external-links" aria-label="Ссылки на карточки фильма">
      ${links.map(link => `
        <a
          href="${link.url}"
          class="movie-external-link ${link.className}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${link.label}"
          title="${link.label}"
        >
        <img
          src="${getMovieExternalIconSrc(link.type)}"
          alt=""
          class="movie-external-link-icon"
          loading="lazy"
        >
        </a>
      `).join('')}
    </div>
  `;
}



function getPosterHtml(movie, userMovieState, matchedSearchAlias = null) {
  return `
    <div class="movie-poster-block">
      <div class="movie-poster-wrapper">
      ${
        movie.poster_url
          ? `
            <div class="movie-poster-skeleton ${loadedPosterUrls.has(movie.poster_url) ? 'is-hidden' : ''}" aria-hidden="true"></div>
            <img
              class="movie-poster ${loadedPosterUrls.has(movie.poster_url) ? 'is-loaded' : ''}"
              src="${movie.poster_url}"
              alt="Постер фильма ${movie.title}"
              loading="lazy"
              decoding="async"
            >
          `
          : `<div class="movie-poster-placeholder">Нет постера</div>`
      }

      ${
        matchedSearchAlias
          ? `
            <div class="movie-search-alias-hint">
              <span class="movie-search-alias-hint-label">Альт:</span>
              ${highlightSearchMatches(matchedSearchAlias, searchInput.value)}
            </div>
          `
          : ''
      }

      ${
        currentUser && !userMovieState.isWatched
        ? `
          <button
            type="button"
            class="movie-watchlist-btn ${userMovieState.isInWatchlist ? 'is-active' : ''}"
            data-watchlist-toggle="true"
            aria-label="${userMovieState.isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
            title="${userMovieState.isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
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
    </div>
  `;
}

function renderEmptyState() {
  const searchQuery = searchInput.value.trim();
  const hasSearchQuery = searchQuery !== '';
  const activeFilterChips = getActiveFilterChips();
  const hasActiveFilters = activeFilterChips.length > 0;
  const filtersSummary = activeFilterChips
    .map(chip => chip.label)
    .join(', ');

  const emptyStateTitle = hasSearchQuery || hasActiveFilters
    ? 'Ничего не найдено'
    : 'Каталог пока пуст';

  let emptyStateText = 'В каталоге пока нет фильмов.';

  if (hasSearchQuery && hasActiveFilters) {
    emptyStateText = `
      По запросу «${searchQuery}» ничего не найдено.
      Сейчас выдачу также ограничивают фильтры: ${filtersSummary}.
      Попробуй очистить поиск или ослабить фильтры.
    `;
  } else if (hasSearchQuery) {
    emptyStateText = `
      По запросу «${searchQuery}» ничего не найдено.
      Попробуй изменить формулировку поиска.
    `;
  } else if (hasActiveFilters) {
    emptyStateText = `
      Сейчас выдачу ограничивают фильтры: ${filtersSummary}.
      Попробуй снять часть ограничений.
    `;
  }

  const emptyStateActions = hasSearchQuery || hasActiveFilters
    ? `
      <div class="empty-state-actions">
        ${
          hasSearchQuery
            ? `
              <button
                type="button"
                class="secondary-button secondary-button-compact empty-state-reset-btn"
                data-empty-state-action="reset-search"
              >
                Очистить поиск
              </button>
            `
            : ''
        }
        ${
          hasActiveFilters
            ? `
              <button
                type="button"
                class="secondary-button secondary-button-compact empty-state-reset-btn"
                data-empty-state-action="reset-filters"
              >
                Сбросить фильтры
              </button>
            `
            : ''
        }
        ${
          hasSearchQuery || hasActiveFilters
            ? `
              <button
                type="button"
                class="secondary-button secondary-button-compact empty-state-reset-btn"
                data-empty-state-action="reset-all"
              >
                Сбросить всё
              </button>
            `
            : ''
        }
      </div>
    `
    : '';

  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon" aria-hidden="true">◌</div>
      <div class="empty-state-title">${emptyStateTitle}</div>
      <div class="empty-state-text">
        ${emptyStateText}
      </div>
      ${emptyStateActions}
    </div>
  `;

  const emptyStateElement = container.querySelector('.empty-state');

  if (emptyStateElement) {
    emptyStateElement.addEventListener('click', event => {
      const actionButton = event.target.closest('[data-empty-state-action]');

      if (!actionButton) {
        return;
      }

      const action = actionButton.dataset.emptyStateAction;

      if (action === 'reset-search') {
        clearSearchAndRerenderPreservingPosition();
      }

      if (action === 'reset-filters') {
        resetCatalogFiltersAndRerender({ preserveSearch: true });
      }

      if (action === 'reset-all') {
        resetCatalogFiltersAndRerender();
      }
    });
  }
}

function bindPosterLoadState(posterImage, posterSkeleton) {
  if (!posterImage || !posterSkeleton) {
    return;
  }

  const handlePosterReady = () => {
    const loadedPosterUrl = posterImage.currentSrc || posterImage.src;

    if (loadedPosterUrl) {
      loadedPosterUrls.add(loadedPosterUrl);
    }

    posterImage.classList.add('is-loaded');
    posterSkeleton.classList.add('is-hidden');
  };

  if (posterImage.complete) {
    handlePosterReady();
    return;
  }

  posterImage.addEventListener('load', handlePosterReady, { once: true });
  posterImage.addEventListener('error', () => {
    posterSkeleton.classList.add('is-hidden');
  }, { once: true });
}

function bindMovieRatingControls({
  movieId,
  currentUserRating,
  starsContainer,
  voteButtons
}) {
  if (!starsContainer || voteButtons.length === 0) {
    return;
  }

  const scaleItems = starsContainer.parentElement?.querySelectorAll('.movie-user-rating-scale-item') || [];
  const isRatingBusy = () => ratingRequestInFlight.has(String(movieId));

  const syncRatingBusyState = () => {
    const isBusy = isRatingBusy();

    starsContainer.classList.toggle('is-busy', isBusy);

    voteButtons.forEach(button => {
      button.disabled = isBusy;
    });
  };

  const applyStarState = (activeValue, mode = 'selected') => {
    voteButtons.forEach(button => {
      const buttonValue = Number(button.dataset.ratingValue);
      const isFilled = buttonValue <= activeValue;

      button.classList.toggle('is-hovered', mode === 'hover' && isFilled);
      button.classList.toggle('is-active', mode === 'selected' && isFilled);
    });

    scaleItems.forEach(item => {
      const itemValue = Number(item.textContent);
      const isFilled = itemValue <= activeValue;

      item.classList.toggle('is-hovered', mode === 'hover' && isFilled);
      item.classList.toggle('is-active', mode === 'selected' && isFilled);
    });
  };

  syncRatingBusyState();

  voteButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      if (isRatingBusy()) {
        return;
      }

      const hoverValue = Number(button.dataset.ratingValue);
      applyStarState(hoverValue, 'hover');
    });

    button.addEventListener('click', () => {
      if (isRatingBusy()) {
        return;
      }

      const ratingValue = Number(button.dataset.ratingValue);
      saveUserMovieRating(movieId, ratingValue);
    });
  });

  starsContainer.addEventListener('mouseleave', () => {
    const selectedValue = currentUserRating ?? 0;
    applyStarState(selectedValue, 'selected');
  });
}

function syncOpenExternalLinksLayouts() {
  const overlayHorizontalPadding = 24;
  const oneRowWidth = (36 * 4) + (6 * 3);

  container.querySelectorAll('[data-external-links-collapsible].is-open').forEach(panel => {
    const externalLinksGrid = panel.querySelector('.movie-external-links');

    if (!externalLinksGrid) {
      return;
    }

    const availableWidth = panel.clientWidth - overlayHorizontalPadding;

    externalLinksGrid.classList.toggle('is-two-rows', availableWidth < oneRowWidth);
  });
}

function createMovieCard(movie) {
  const card = document.createElement('article');
  const movieId = movie.id;
  const currentUserRating = getCurrentUserRating(movieId);
  const userMovieState = getCurrentUserMovieState(movieId);
  const matchedSearchAlias = getMatchedSearchAlias(movie, searchInput.value);

  card.className = 'movie-card';

  if (userMovieState.isWatched) {
    card.classList.add('movie-card-rated');
  } else if (userMovieState.isInWatchlist) {
    card.classList.add('movie-card-watchlist');
  }
  card.dataset.movieId = String(movieId);

  const genres = movie.movie_genres.map(item => item.genres.name).join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');
  const averageRating = getMovieAverageRating(movieId);
  const votesCount = getMovieRatings(movieId).length;

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
      >
        Удалить оценку
      </button>
    </div>
  `;

  const userRatingControlsHtml = getUserRatingControlsHtml(currentUserRating);
  const posterHtml = getPosterHtml(movie, userMovieState, matchedSearchAlias);
  const externalLinksHtml = getMovieExternalLinksHtml(movie);
  const hasExternalLinks = externalLinksHtml !== '';
  const externalLinksBlockHtml = hasExternalLinks
    ? `
      <div class="movie-external-links-collapsible" data-external-links-collapsible>
        ${externalLinksHtml}
      </div>
    `
    : '';

    card.innerHTML = `
    ${posterHtml}
  
    <h5 class="movie-title">${highlightSearchMatches(movie.title, searchInput.value)}</h5>
  
    ${movie.original_title ? `<p>Оригинальное название: ${highlightSearchMatches(movie.original_title, searchInput.value)}</p>` : ''}
    <p>Год: ${movie.year ?? '-'}</p>
    <p>Режиссёр: ${movie.director ? highlightSearchMatches(movie.director, searchInput.value) : '-'}</p>
    <p>Жанры: ${genres || '-'}</p>
    <p>Страны: ${countries || '-'}</p>

    <div class="movie-rating-block">
    ${
      hasExternalLinks
        ? `
          <button
            type="button"
            class="movie-external-links-toggle secondary-button secondary-button-compact"
            data-external-links-toggle="true"
            aria-expanded="false"
          >
            Ссылки на фильм
          </button>
        `
        : ''
    }
    ${externalLinksBlockHtml}
    ${ratingSummaryHtml}
    ${userRatingControlsHtml}
  </div>

  <div class="movie-card-actions">
    ${isAdmin ? `
      <button type="button" class="edit-movie-btn">Редактировать</button>
      <button type="button" class="delete-movie-btn secondary-button">Удалить</button>
    ` : ''}
  </div>
  `;

  const actionsBlock = card.querySelector('.movie-card-actions');
  const editBtn = card.querySelector('.edit-movie-btn');
  const deleteBtn = card.querySelector('.delete-movie-btn');
  const starsContainer = card.querySelector('.movie-user-rating-stars');
  const voteButtons = card.querySelectorAll('.rating-star-btn');
  const removeRatingBtn = card.querySelector('.remove-rating-inline-btn');
  const watchlistToggleBtn = card.querySelector('[data-watchlist-toggle="true"]');
  const externalLinksToggleBtn = card.querySelector('[data-external-links-toggle="true"]');
  const externalLinksCollapsible = card.querySelector('[data-external-links-collapsible]');
  const openMobileRatingBtn = card.querySelector('[data-open-mobile-rating="true"]');
  const isRatingBusy = ratingRequestInFlight.has(String(movieId));
  const isWatchlistBusy = watchlistRequestInFlight.has(String(movieId));
  const posterImage = card.querySelector('.movie-poster');
  const posterSkeleton = card.querySelector('.movie-poster-skeleton');

  bindPosterLoadState(posterImage, posterSkeleton);

  if (actionsBlock && !editBtn && !deleteBtn) {
    actionsBlock.remove();
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      fillFormForEdit(movie);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      armDeleteMovieButton(deleteBtn, () => {
        deleteMovie(movieId, movie.title);
      });
    });
  }

  bindMovieRatingControls({
    movieId,
    currentUserRating,
    starsContainer,
    voteButtons
  });

  if (removeRatingBtn) {
    removeRatingBtn.disabled = isRatingBusy || currentUserRating === null;

    if (currentUserRating !== null) {
      removeRatingBtn.addEventListener('click', () => {
        removeUserMovieRating(movieId);
      });
    }
  }

  if (watchlistToggleBtn) {
    watchlistToggleBtn.disabled = isWatchlistBusy;

    watchlistToggleBtn.addEventListener('click', () => {
      toggleMovieWatchlist(movieId);
    });
  }

  if (openMobileRatingBtn) {
    openMobileRatingBtn.disabled = isRatingBusy;

    openMobileRatingBtn.addEventListener('click', () => {
      openMobileRatingModal(movie);
    });
  }

  if (externalLinksToggleBtn && externalLinksCollapsible) {
    externalLinksToggleBtn.addEventListener('click', () => {
      const isExpanded = externalLinksToggleBtn.getAttribute('aria-expanded') === 'true';

      const openedCard = container.querySelector('.movie-card.has-open-external-links');

      if (openedCard && openedCard !== card) {
        const openedToggle = openedCard.querySelector('[data-external-links-toggle="true"]');
        const openedPanel = openedCard.querySelector('[data-external-links-collapsible]');
        const openedGrid = openedCard.querySelector('.movie-external-links');

        if (openedToggle) {
          openedToggle.setAttribute('aria-expanded', 'false');
          openedToggle.textContent = 'Ссылки на фильм';
        }

        if (openedPanel) {
          openedPanel.classList.remove('is-open');
        }

        if (openedGrid) {
          setTimeout(() => {
            openedGrid.classList.remove('is-two-rows');
          }, 180);
        }

        openedCard.classList.remove('has-open-external-links');
      }

      const grid = card.querySelector('.movie-external-links');

      if (isExpanded) {
        externalLinksToggleBtn.setAttribute('aria-expanded', 'false');
        externalLinksToggleBtn.textContent = 'Ссылки на фильм';
        externalLinksCollapsible.classList.remove('is-open');
        card.classList.remove('has-open-external-links');

        if (grid) {
          setTimeout(() => {
            grid.classList.remove('is-two-rows');
          }, 180);
        }

        return;
      }

      if (grid) {
        grid.classList.remove('is-two-rows');
      }

      externalLinksToggleBtn.setAttribute('aria-expanded', 'true');
      externalLinksToggleBtn.textContent = 'Свернуть';
      externalLinksCollapsible.classList.add('is-open');
      card.classList.add('has-open-external-links');

      requestAnimationFrame(syncOpenExternalLinksLayouts);
    });
  }

  return card;
}

function rerenderMovieCard(
  movieId,
  { preserveCardTop = true, animateStateAppearance = true } = {}
) {
  lastCatalogAnchorMovieId = String(movieId);

  const existingCard = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!existingCard) {
    rerenderCatalogAfterDataReload(movieId);
    return;
  }

  const movie = allMovies.find(item => String(item.id) === String(movieId));

  if (!movie) {
    rerenderCatalogAfterDataReload(movieId);
    return;
  }

  const previousCardTop = existingCard.getBoundingClientRect().top;
  const wasExternalLinksExpanded = existingCard.classList.contains('has-open-external-links');
  const newCard = createMovieCard(movie);

  if (
    animateStateAppearance &&
    (
      newCard.classList.contains('movie-card-rated') ||
      newCard.classList.contains('movie-card-watchlist')
    )
  ) {
    newCard.classList.add('is-state-appearing');
  }

  if (wasExternalLinksExpanded) {
    const newExternalLinksToggle = newCard.querySelector('[data-external-links-toggle="true"]');
    const newExternalLinksCollapsible = newCard.querySelector('[data-external-links-collapsible]');

    if (newExternalLinksToggle) {
      newExternalLinksToggle.setAttribute('aria-expanded', 'true');
      newExternalLinksToggle.textContent = 'Свернуть';
    }

    if (newExternalLinksCollapsible) {
      newExternalLinksCollapsible.classList.add('is-open');
    }

    newCard.classList.add('has-open-external-links');
  }

  existingCard.replaceWith(newCard);

  if (wasExternalLinksExpanded) {
    requestAnimationFrame(syncOpenExternalLinksLayouts);
  }

  if (!preserveCardTop) {
    return;
  }

  const nextCardTop = newCard.getBoundingClientRect().top;
  const scrollDelta = nextCardTop - previousCardTop;

  if (Math.abs(scrollDelta) >= 4) {
    window.scrollBy({
      top: scrollDelta,
      behavior: 'auto'
    });
  }
}

function getFilteredMovies() {
  const selectedGenre = genreFilter.value;
  const selectedCountry = countryFilter.value;
  const minRating = ratingFilter.value;
  const selectedYear = yearFilter.value;
  const selectedWatchlist = watchlistFilter.value;
  const selectedWatched = watchedFilter.value;
  const selectedSortMode = sortMode.value;
  const searchQuery = searchInput.value;
  const hasSearchQuery = searchQuery.trim() !== '';

  let filteredMovies = [...allMovies];

  if (hasSearchQuery) {
    filteredMovies = filteredMovies.filter(movie =>
      movieMatchesSearch(movie, searchQuery)
    );
  }

  if (selectedGenre) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.movie_genres.some(item => item.genres.name === selectedGenre)
    );
  }

  if (selectedCountry) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.movie_countries.some(item => item.countries.name === selectedCountry)
    );
  }

  if (minRating !== '') {
    const isLowRatedPresetActive = getActiveQuickPresetKey() === 'low-rated';

    filteredMovies = filteredMovies.filter(movie => {
      const averageRating = getMovieAverageRating(movie.id);

      return isLowRatedPresetActive
        ? averageRating > 0 && averageRating <= Number(minRating)
        : averageRating >= Number(minRating);
    });
  }

  if (selectedYear) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.year !== null &&
      Number(movie.year) === Number(selectedYear)
    );
  }

  const hasCurrentUser = Boolean(currentUser);

  if (hasCurrentUser && selectedWatchlist === 'in_watchlist') {
    filteredMovies = filteredMovies.filter(movie =>
      isMovieInCurrentUserWatchlist(movie.id)
    );
  }

  if (hasCurrentUser && selectedWatchlist === 'not_in_watchlist') {
    filteredMovies = filteredMovies.filter(movie =>
      !isMovieInCurrentUserWatchlist(movie.id)
    );
  }

  if (hasCurrentUser && selectedWatched === 'watched') {
    filteredMovies = filteredMovies.filter(movie =>
      isMovieWatchedByCurrentUser(movie.id)
    );
  }

  if (hasCurrentUser && selectedWatched === 'unwatched') {
    filteredMovies = filteredMovies.filter(movie =>
      !isMovieWatchedByCurrentUser(movie.id)
    );
  }

  sortMovies(filteredMovies, selectedSortMode);

  return filteredMovies;
}

function sortMoviesWithinMonth(movies, monthSortMode, monthSortDirection = 'desc') {
  const sortedMovies = [...movies];
  const directionMultiplier = monthSortDirection === 'asc' ? 1 : -1;

  if (monthSortMode === 'rating') {
    sortedMovies.sort((a, b) => {
      const ratingA = getMovieAverageRating(a.id);
      const ratingB = getMovieAverageRating(b.id);

      if (ratingA !== ratingB) {
        return (ratingA - ratingB) * directionMultiplier;
      }

      const votesA = getMovieRatings(a.id).length;
      const votesB = getMovieRatings(b.id).length;

      if (votesA !== votesB) {
        return (votesA - votesB) * directionMultiplier;
      }

      const orderA = a.sort_order ?? Infinity;
      const orderB = b.sort_order ?? Infinity;

      return monthSortDirection === 'asc'
        ? orderA - orderB
        : orderB - orderA;
    });

    return sortedMovies;
  }

  sortedMovies.sort((a, b) => {
    const orderA = a.sort_order ?? Infinity;
    const orderB = b.sort_order ?? Infinity;

    return monthSortDirection === 'asc'
      ? orderA - orderB
      : orderB - orderA;
  });

  return sortedMovies;
}

function createMonthSection(month, movies, initialReleaseDirection = 'desc') {
  const monthSection = document.createElement('section');
  const monthHeader = document.createElement('div');
  const monthTitle = document.createElement('h4');
  const monthControls = document.createElement('div');
  const dateSortButton = document.createElement('button');
  const ratingSortButton = document.createElement('button');
  const monthCards = document.createElement('div');

  monthSection.className = 'movies-month-section';
  monthHeader.className = 'movies-month-header';
  monthTitle.className = 'movies-month-title';
  monthControls.className = 'month-sort-controls';
  monthCards.className = 'movies-month-cards';

  monthTitle.textContent = getMonthName(month);

  dateSortButton.type = 'button';
  dateSortButton.className = 'month-sort-btn';

  ratingSortButton.type = 'button';
  ratingSortButton.className = 'month-sort-btn';

  monthControls.appendChild(dateSortButton);
  monthControls.appendChild(ratingSortButton);
  monthHeader.appendChild(monthTitle);
  monthHeader.appendChild(monthControls);
  monthSection.appendChild(monthHeader);
  monthSection.appendChild(monthCards);

  const monthSortState = {
    activeMode: 'release',
    directions: {
      release: initialReleaseDirection,
      rating: 'desc'
    }
  };

  const syncSortButtonsUi = () => {
    const dateDirection = monthSortState.directions.release;
    const ratingDirection = monthSortState.directions.rating;

    dateSortButton.classList.toggle('is-active', monthSortState.activeMode === 'release');
    ratingSortButton.classList.toggle('is-active', monthSortState.activeMode === 'rating');

    dateSortButton.textContent = `По дате ${dateDirection === 'desc' ? '↓' : '↑'}`;
    ratingSortButton.textContent = `По рейтингу ${ratingDirection === 'desc' ? '↓' : '↑'}`;

    dateSortButton.setAttribute(
      'aria-label',
      `Сортировка по дате: ${dateDirection === 'desc' ? 'по убыванию' : 'по возрастанию'}`
    );

    ratingSortButton.setAttribute(
      'aria-label',
      `Сортировка по рейтингу: ${ratingDirection === 'desc' ? 'по убыванию' : 'по возрастанию'}`
    );
  };

  const renderMonthCards = () => {
    const activeSortDirection = monthSortState.directions[monthSortState.activeMode];
    const sortedMonthMovies = sortMoviesWithinMonth(
      movies,
      monthSortState.activeMode,
      activeSortDirection
    );

    monthCards.innerHTML = '';

    sortedMonthMovies.forEach(movie => {
      monthCards.appendChild(createMovieCard(movie));
    });

    syncSortButtonsUi();
  };

  dateSortButton.addEventListener('click', () => {
    if (monthSortState.activeMode === 'release') {
      monthSortState.directions.release = monthSortState.directions.release === 'desc' ? 'asc' : 'desc';
    } else {
      monthSortState.activeMode = 'release';
    }

    renderMonthCards();
  });

  ratingSortButton.addEventListener('click', () => {
    if (monthSortState.activeMode === 'rating') {
      monthSortState.directions.rating = monthSortState.directions.rating === 'desc' ? 'asc' : 'desc';
    } else {
      monthSortState.activeMode = 'rating';
    }

    renderMonthCards();
  });

  renderMonthCards();

  return monthSection;
}

function createMoviesYearTitle(year) {
  const yearTitle = document.createElement('h3');
  yearTitle.className = 'movies-year-title';
  yearTitle.textContent = year;

  return yearTitle;
}

function renderMovies() {
  if (!moviesLoadedSuccessfully) {
    return;
  }

  container.classList.remove('is-catalog-visible');

  renderActiveFilterChips();
  syncQuickPresetButtons();

  const filteredMovies = getFilteredMovies();

  if (moviesResultCount) {
    moviesResultCount.textContent = `Найдено: ${filteredMovies.length}`;
  }

  if (filteredMovies.length === 0) {
    renderEmptyState();
    return;
  }

  container.innerHTML = '';

  if (viewMode.value === 'list') {
    const moviesFragment = document.createDocumentFragment();

    filteredMovies.forEach(movie => {
      moviesFragment.appendChild(createMovieCard(movie));
    });

    container.appendChild(moviesFragment);
  } else {
    let lastYear = null;
    let currentMonth = null;
    let currentMonthMovies = [];
    const moviesFragment = document.createDocumentFragment();
    const defaultMonthReleaseDirection = sortMode.value === 'oldest' ? 'asc' : 'desc';

    const flushCurrentMonth = () => {
      if (!currentMonth || currentMonthMovies.length === 0) {
        return;
      }

      moviesFragment.appendChild(
        createMonthSection(
          currentMonth,
          currentMonthMovies,
          defaultMonthReleaseDirection
        )
      );
      currentMonth = null;
      currentMonthMovies = [];
    };
    
    filteredMovies.forEach(movie => {
      const year = movie.release_year;
      const month = movie.release_month;
    
      if (year !== lastYear) {
        flushCurrentMonth();
        moviesFragment.appendChild(createMoviesYearTitle(year));
        lastYear = year;
      }

      if (month !== currentMonth) {
        flushCurrentMonth();
        currentMonth = month;
      }

      currentMonthMovies.push(movie);
    });

    flushCurrentMonth();
    container.appendChild(moviesFragment);
  }
}

/* =========================================================
JS-БЛОК 22. ОБРАБОТЧИКИ СОБЫТИЙ ИНТЕРФЕЙСА
Навешивает события на форму, фильтры, auth и модальное окно.
========================================================== */
loginForm.addEventListener('submit', login);
loginEmail.addEventListener('input', clearAuthMessage);
loginPassword.addEventListener('input', clearAuthMessage);
registerButton.addEventListener('click', register);
logoutButton.addEventListener('click', logout);

openAddMovieButton.addEventListener('click', () => {
  resetFormToCreateMode();
  openMovieModal();
});

if (openFiltersButton) {
  openFiltersButton.addEventListener('click', () => {
    openFiltersModal();
  });
}

closeMovieModalButton.addEventListener('click', () => {
  closeMovieModal();
});

if (closeFiltersModalButton) {
  closeFiltersModalButton.addEventListener('click', () => {
    closeFiltersModal();
  });
}

movieModalBackdrop.addEventListener('click', () => {
  closeMovieModal();
});

if (filtersModalBackdrop) {
  filtersModalBackdrop.addEventListener('click', () => {
    closeFiltersModal();
  });
}

const debouncedRenderMovies = createDebouncedCatalogRender(200);

let lastSearchQuery = '';

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  // 👇 управление крестиком
  if (searchClearBtn) {
    searchClearBtn.style.display = query ? 'flex' : 'none';
  }

  if (query && query !== lastSearchQuery) {
    trackGoal('search_used');
    lastSearchQuery = query;
  }

  if (!query) {
    lastSearchQuery = '';
  }

  prepareCatalogStateForDeferredRender();
  debouncedRenderMovies();
});

searchInput.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !searchInput.value) {
    return;
  }

  event.preventDefault();
  clearSearchAndRerenderPreservingPosition();
});

if (searchClearBtn) {
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchClearBtn.style.display = 'none';
    clearSearchAndRerenderPreservingPosition();
  });
}

const debouncedRenderMoviesForFilters = createDebouncedCatalogRender(120);

function saveCatalogStateAndRenderFilters() {
  prepareCatalogStateForDeferredRender();
  debouncedRenderMoviesForFilters();
}

const handleFiltersChange = () => {
  trackFiltersUsageIfNeeded();
  saveCatalogStateAndRenderFilters();
};

genreFilter.addEventListener('change', handleFiltersChange);
countryFilter.addEventListener('change', handleFiltersChange);
ratingFilter.addEventListener('change', handleFiltersChange);
yearFilter.addEventListener('change', handleFiltersChange);
watchlistFilter.addEventListener('change', handleFiltersChange);
watchedFilter.addEventListener('change', handleFiltersChange);
viewMode.addEventListener('change', () => {
  applyCatalogViewModeChange();
});
sortMode.addEventListener('change', () => {
  trackSortUsageIfNeeded();
  rerenderCatalogPreservingPosition();
});

if (quickPresetsBar) {
  quickPresetsBar.addEventListener('click', event => {
    const quickPresetButton = event.target.closest('[data-quick-preset]');

    if (!quickPresetButton) {
      return;
    }

    applyQuickPreset(quickPresetButton.dataset.quickPreset);
  });
}

if (resetFiltersTopButton) {
  resetFiltersTopButton.addEventListener('click', () => {
    resetCatalogFiltersAndRerender();
  });
}

posterFileInput.addEventListener('change', updatePosterFileUi);

movieForm.addEventListener('submit', saveMovie);

cancelEditButton.addEventListener('click', () => {
  resetFormToCreateMode();
  closeMovieModal();
});

document.addEventListener('click', event => {
  if (event.target.closest('[data-external-links-toggle="true"]') || event.target.closest('[data-external-links-collapsible]')) {
    return;
  }

  const openedCard = container.querySelector('.movie-card.has-open-external-links');

  if (!openedCard) {
    return;
  }

  const toggle = openedCard.querySelector('[data-external-links-toggle="true"]');
  const panel = openedCard.querySelector('[data-external-links-collapsible]');
  const grid = openedCard.querySelector('.movie-external-links');

  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Ссылки на фильм';
  }

  if (panel) {
    panel.classList.remove('is-open');
  }

  if (grid) {
    setTimeout(() => {
      grid.classList.remove('is-two-rows');
    }, 180);
  }

  openedCard.classList.remove('has-open-external-links');
});

window.addEventListener('resize', syncOpenExternalLinksLayouts);

window.addEventListener('pagehide', event => {
  if (event.persisted) {
    return;
  }

  saveCatalogScrollPosition();
  saveCatalogAnchorMovieId();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') {
    return;
  }

  closeMobileRatingModal();
  closeAllCustomSelects();

  if (isModalOpen) {
    closeMovieModal();
    return;
  }

  if (filtersModal && filtersModal.style.display === 'block') {
    closeFiltersModal();
  }
});

/* =========================================================
JS-БЛОК 23. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
Восстанавливает сессию, подписывается на auth-изменения,
загружает данные и запускает первую отрисовку.
========================================================== */
async function init() {
  renderMoviesSkeleton();

  const wasResetApplied = applyBuildVersionSoftResetIfNeeded();

  if (wasResetApplied) {
    window.location.replace(window.location.pathname + window.location.search);
    return;
  }

  const restoredUser = await restoreSession();
  trackEmailConfirmedLoginIfNeeded();

  bindCustomSelectGlobalEvents();

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      return;
    }

    const nextUserId = session?.user?.id ?? null;
    const currentUserId = currentUser?.id ?? null;
    const shouldSkipAuthSync = (
      nextUserId === currentUserId &&
      event !== 'SIGNED_OUT' &&
      event !== 'SIGNED_IN'
    );

    if (shouldSkipAuthSync) {
      return;
    }

    const currentRequestId = ++authStateSyncRequestId;

    setTimeout(async () => {
      await applyCurrentSessionUser(session?.user ?? null);
      trackEmailConfirmedLoginIfNeeded();

      if (currentRequestId !== authStateSyncRequestId) {
        return;
      }

      await fetchMovieWatchlist();

      if (currentRequestId !== authStateSyncRequestId) {
        return;
      }

      applySavedCatalogState();
      syncCatalogAfterAuthChange();
    }, 0);
  });

  await reloadCatalogData({ showSkeleton: true });
  initCatalogViewToggleButton();
  applySavedCatalogState();

  if (restoredUser) {
    syncCatalogAfterAuthChange();
  } else {
    renderMovies();
  }

  updateFiltersButtonLabel(); // на старте синхронизируем подпись кнопки
  restoreCatalogScrollPosition();
}

/* =========================================================
JS-БЛОК 24. ЗАПУСК ПРИЛОЖЕНИЯ
Точка входа.
========================================================== */
init();