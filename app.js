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
const posterUrlInput = document.getElementById('posterUrl');
const posterFileInput = document.getElementById('posterFile');
const posterFileName = document.getElementById('posterFileName');
const kinopoiskUrlInput = document.getElementById('kinopoiskUrl');
const imdbUrlInput = document.getElementById('imdbUrl');
const letterboxdUrlInput = document.getElementById('letterboxdUrl');
const rottentomatoesUrlInput = document.getElementById('rottentomatoesUrl');
const genresInput = document.getElementById('genresInput');
const countriesInput = document.getElementById('countriesInput');

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
let ratingFeedbackTimers = new Map();
let watchlistFeedbackTimers = new Map();
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

function restoreCatalogScrollPosition() {
  try {
    const savedAnchorMovieId = sessionStorage.getItem(CATALOG_ANCHOR_MOVIE_ID_KEY);
    const savedScrollPosition = sessionStorage.getItem(CATALOG_SCROLL_POSITION_KEY);

    if (savedAnchorMovieId) {
      requestAnimationFrame(() => {
        restoreCatalogAnchorMoviePosition(savedAnchorMovieId);
      });

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
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
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

    if (!rawCatalogState) {
      return;
    }

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

    [
      genreFilter,
      countryFilter,
      ratingFilter,
      yearFilter,
      watchlistFilter,
      watchedFilter,
      viewMode,
      sortMode
    ].forEach(selectElement => {
      refreshCustomSelect(selectElement);
    });

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
  if (!sortMode || !sortMode.value || sortMode.value === 'default') {
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

  if (!moviesSectionTitle.parentElement.classList.contains('movies-section-header')) {
    const moviesSectionHeader = document.createElement('div');
    moviesSectionHeader.className = 'movies-section-header';

    moviesSectionTitle.parentNode.insertBefore(moviesSectionHeader, moviesSectionTitle);
    moviesSectionHeader.appendChild(moviesSectionTitle);
  }

  const moviesSectionHeader = moviesSectionTitle.parentElement;

  if (!catalogViewToggleButton) {
    catalogViewToggleButton = document.createElement('button');
    catalogViewToggleButton.type = 'button';
    catalogViewToggleButton.className = 'secondary-button catalog-view-toggle';

    catalogViewToggleButton.addEventListener('click', () => {
      viewMode.value = viewMode.value === 'list' ? 'releases' : 'list';

      if (typeof refreshCustomSelect === 'function') {
        refreshCustomSelect(viewMode);
      }

      syncCatalogViewToggleButton();
      saveCatalogState();
      triggerCatalogRender();
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

function isMovieInCurrentUserWatchlist(movieId) {
  if (!currentUser) {
    return false;
  }

  return (
    allMovieWatchlist.some(item => (
      item.movie_id === movieId && item.user_id === currentUser.id
    )) &&
    !isMovieWatchedByCurrentUser(movieId)
  );
}

function hasMovieWatchlistRecord(movieId) {
  if (!currentUser) {
    return false;
  }

  return allMovieWatchlist.some(item => (
    item.movie_id === movieId && item.user_id === currentUser.id
  ));
}

/* =========================================================
JS-БЛОК 5. ПОИСК ПО КАТАЛОГУ
Проверяет, соответствует ли фильм текущему текстовому запросу.
========================================================== */
function movieMatchesSearch(movie, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = normalizeSearchText([
    movie.title,
    movie.original_title,
    movie.director
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
function openMovieModal() {
  movieModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  isModalOpen = true;

  requestAnimationFrame(() => {
    titleInput.focus();
  });
}

function closeMovieModal() {
  movieModal.style.display = 'none';
  document.body.style.overflow = '';
  isModalOpen = false;
}

function openFiltersModal() {
  if (!filtersModal) {
    return;
  }

  filtersModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeFiltersModal() {
  if (!filtersModal) {
    return;
  }

  filtersModal.style.display = 'none';
  document.body.style.overflow = isModalOpen ? 'hidden' : '';
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

function resetFormToCreateMode() {
  editingMovieId = null;
  movieForm.reset();
  posterFileInput.value = '';
  updatePosterFileUi(); // после сброса снова показываем "Файл не выбран"
  formTitle.textContent = 'Добавить фильм';
  submitButton.textContent = 'Добавить фильм';
  cancelEditButton.style.display = 'none';
  formMessage.textContent = '';

  if (typeof refreshCustomSelect === 'function') {
    refreshCustomSelect(releaseMonthInput);
  }
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
  setInputValue(posterUrlInput, movie.poster_url, 'posterUrlInput');
  setInputValue(kinopoiskUrlInput, movie.kinopoisk_url, 'kinopoiskUrlInput');
  setInputValue(imdbUrlInput, movie.imdb_url, 'imdbUrlInput');
  setInputValue(letterboxdUrlInput, movie.letterboxd_url, 'letterboxdUrlInput');
  setInputValue(rottentomatoesUrlInput, movie.rottentomatoes_url, 'rottentomatoesUrlInput');

  if (posterFileInput) {
    posterFileInput.value = '';
  }

  updatePosterFileUi();

  const genres = movie.movie_genres.map(item => item.genres.name).join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');

  setInputValue(genresInput, genres, 'genresInput');
  setInputValue(countriesInput, countries, 'countriesInput');

  formTitle.textContent = `Редактирование: ${movie.title}`;
  submitButton.textContent = 'Сохранить изменения';
  cancelEditButton.style.display = 'inline-block';
  formMessage.textContent = '';

  if (typeof refreshCustomSelect === 'function') {
    refreshCustomSelect(releaseMonthInput);
  }

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

  if (watchlistFilterRow && watchlistFilter) {
    watchlistFilterRow.style.display = isLoggedIn ? 'flex' : 'none';

    if (!isLoggedIn) {
      watchlistFilter.value = '';
      refreshCustomSelect(watchlistFilter);
    }
  }

  if (watchedFilterRow && watchedFilter) {
    watchedFilterRow.style.display = isLoggedIn ? 'flex' : 'none';

    if (!isLoggedIn) {
      watchedFilter.value = '';
      refreshCustomSelect(watchedFilter);
    }
  }

  if (!isAdmin) {
    resetFormToCreateMode();
    closeMovieModal();
  }
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
    .select('movie_id, user_id');

  if (error) {
    console.error('Ошибка загрузки watchlist:', error);
    allMovieWatchlist = [];
    return;
  }

  allMovieWatchlist = data || [];
}

async function reloadCatalogData() {
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
    window.scrollTo({
      top: currentScrollY,
      behavior: 'auto'
    });
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
    window.scrollBy({
      top: scrollDelta,
      behavior: 'auto'
    });
  }
}

function rerenderCatalogAfterDataReload(anchorMovieId = null) {
  const nextAnchorMovieId = anchorMovieId ?? lastCatalogAnchorMovieId;

  preserveWindowScrollPosition(() => {
    renderMovies();
  });

  requestAnimationFrame(() => {
    restoreCatalogAnchorMoviePosition(nextAnchorMovieId);
  });
}

function triggerCatalogRender() {
  renderMovies();
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
  return getCurrentUserRating(movieId) !== null;
}

function clearSearchInput() {
  if (!searchInput.value) {
    return;
  }

  searchInput.value = '';
  lastSearchQuery = '';
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

  filterCustomSelectElements
    .filter(selectElement => selectElement !== sortMode)
    .forEach(selectElement => {
      refreshCustomSelect(selectElement);
    });

  saveCatalogState();
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
    viewMode.value === 'releases' &&
    sortMode.value === 'default' &&
    ratingFilter.value === '' &&
    (!currentUser || (!watchlistFilter.value && !watchedFilter.value))
  ) {
    return 'releases';
  }

  if (
    viewMode.value === 'list' &&
    sortMode.value === 'default' &&
    ratingFilter.value === '7' &&
    (!currentUser || (!watchlistFilter.value && !watchedFilter.value))
  ) {
    return 'top-rated';
  }

  if (
    currentUser &&
    viewMode.value === 'list' &&
    sortMode.value === 'default' &&
    watchlistFilter.value === 'in_watchlist' &&
    !watchedFilter.value &&
    ratingFilter.value === ''
  ) {
    return 'watchlist';
  }

  if (
    currentUser &&
    viewMode.value === 'list' &&
    sortMode.value === 'default' &&
    watchedFilter.value === 'watched' &&
    !watchlistFilter.value &&
    ratingFilter.value === ''
  ) {
    return 'watched';
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
  viewMode.value = 'list';
  sortMode.value = 'default';

  if (presetKey === 'releases') {
    viewMode.value = 'releases';
  }

  if (presetKey === 'top-rated') {
    ratingFilter.value = '7';
  }

  if (presetKey === 'watchlist' && currentUser) {
    watchlistFilter.value = 'in_watchlist';
  }

  if (presetKey === 'watched' && currentUser) {
    watchedFilter.value = 'watched';
  }

  [
    ratingFilter,
    watchlistFilter,
    watchedFilter,
    viewMode,
    sortMode
  ].forEach(selectElement => {
    refreshCustomSelect(selectElement);
  });

  syncCatalogViewToggleButton();
  saveCatalogState();
  triggerCatalogRender();
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
    chips.push({ label: `Рейтинг: от ${ratingFilter.value}`, key: 'rating' });
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

  saveCatalogState();
  debouncedRenderMoviesForFilters();

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

  if (uploadError) {
    throw uploadError;
  }

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

  if (error) {
    throw error;
  }
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

  if (upsertError) {
    throw upsertError;
  }

  const { data, error } = await supabaseClient
    .from('genres')
    .select('id, name')
    .in('name', names);

  if (error) {
    throw error;
  }

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

  if (upsertError) {
    throw upsertError;
  }

  const { data, error } = await supabaseClient
    .from('countries')
    .select('id, name')
    .in('name', names);

  if (error) {
    throw error;
  }

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

  if (deleteGenresError) {
    throw deleteGenresError;
  }

  const { error: deleteCountriesError } = await supabaseClient
    .from('movie_countries')
    .delete()
    .eq('movie_id', movieId);

  if (deleteCountriesError) {
    throw deleteCountriesError;
  }

  if (genreRows.length > 0) {
    const movieGenreRows = genreRows.map((genre, index) => ({
      movie_id: movieId,
      genre_id: genre.id,
      position: index
    }));

    const { error } = await supabaseClient
      .from('movie_genres')
      .insert(movieGenreRows);

    if (error) {
      throw error;
    }
  }

  if (countryRows.length > 0) {
    const movieCountryRows = countryRows.map(country => ({
      movie_id: movieId,
      country_id: country.id
    }));

    const { error } = await supabaseClient
      .from('movie_countries')
      .insert(movieCountryRows);

    if (error) {
      throw error;
    }
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
  formMessage.textContent = 'Сохраняю...';

  const title = titleInput.value.trim();
  const originalTitle = originalTitleInput.value.trim();
  const year = yearInput.value.trim();
  const releaseMonth = releaseMonthInput.value.trim();
  const releaseYear = releaseYearInput.value.trim();
  const sortOrder = sortOrderInput.value.trim();
  const director = directorInput.value.trim();
  const posterUrl = posterUrlInput.value.trim();
  const posterFile = posterFileInput.files && posterFileInput.files[0]
    ? posterFileInput.files[0]
    : null;
  const kinopoiskUrl = normalizeOptionalUrl(kinopoiskUrlInput.value);
  const imdbUrl = normalizeOptionalUrl(imdbUrlInput.value);
  const letterboxdUrl = normalizeOptionalUrl(letterboxdUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  try {
    ensureActiveSessionForWrite();

    let finalPosterUrl = posterUrl || null;

    if (posterFile) {
      formMessage.textContent = 'Загружаю постер...';
      finalPosterUrl = await withPendingRequestTimeout(
        uploadPosterFile(posterFile),
        20000,
        'Превышено время ожидания загрузки постера.'
      );
    }

    formMessage.textContent = 'Сохраняю...';

    const { data: insertedMovie, error: insertMovieError } = await withPendingRequestTimeout(
      supabaseClient
        .from('movies')
        .insert({
          title,
          original_title: originalTitle || null,
          year: year ? Number(year) : null,
          director: director || null,
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

    if (insertMovieError) {
      throw insertMovieError;
    }

    await withPendingRequestTimeout(
      replaceMovieRelations(insertedMovie.id, genreNames, countryNames),
      15000,
      'Превышено время ожидания сохранения жанров и стран.'
    );

    formMessage.textContent = 'Обновляю каталог...';
    await withPendingRequestTimeout(
      reloadCatalogData(),
      15000,
      'Превышено время ожидания обновления каталога.'
      ); // сначала дожидаемся полной синхронизации состояния каталога

      rerenderCatalogAfterDataReload(insertedMovie.id);
      resetFormToCreateMode();
      closeMovieModal();
  } catch (error) {
    console.error('Ошибка при добавлении фильма:', error);
    formMessage.textContent = `Ошибка при добавлении фильма: ${error.message || 'смотри консоль F12.'}`;
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
  formMessage.textContent = 'Сохраняю изменения...';

  const title = titleInput.value.trim();
  const originalTitle = originalTitleInput.value.trim();
  const year = yearInput.value.trim();
  const releaseMonth = releaseMonthInput.value.trim();
  const releaseYear = releaseYearInput.value.trim();
  const sortOrder = sortOrderInput.value.trim();
  const director = directorInput.value.trim();
  const posterUrl = posterUrlInput.value.trim();
  const posterFile = posterFileInput.files && posterFileInput.files[0]
    ? posterFileInput.files[0]
    : null;
  const kinopoiskUrl = normalizeOptionalUrl(kinopoiskUrlInput.value);
  const imdbUrl = normalizeOptionalUrl(imdbUrlInput.value);
  const letterboxdUrl = normalizeOptionalUrl(letterboxdUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);

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

    let finalPosterUrl = posterUrl || null;
    let uploadedNewPoster = false;

    if (posterFile) {
      formMessage.textContent = 'Загружаю постер...';
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
      formMessage.textContent = 'Сохраняю изменения...';

      const { error: updateMovieError } = await withPendingRequestTimeout(
        supabaseClient
          .from('movies')
          .update(changedFields)
          .eq('id', editingMovieId),
        15000,
        'Превышено время ожидания обновления фильма.'
      );

      if (updateMovieError) {
        throw updateMovieError;
      }
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
      formMessage.textContent = 'Изменений нет.';
      closeMovieModal();
      resetFormToCreateMode();
      return;
    }

    formMessage.textContent = 'Обновляю каталог...';
    await withPendingRequestTimeout(
      reloadCatalogData(),
      15000,
      'Превышено время ожидания обновления каталога.'
      );

      rerenderCatalogAfterDataReload(editingMovieId);
      closeMovieModal();
      resetFormToCreateMode();
  } catch (error) {
    console.error('Ошибка при редактировании фильма:', error);
    formMessage.textContent = `Ошибка при редактировании фильма: ${error.message || 'смотри консоль F12.'}`;
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

    if (error) {
      throw error;
    }

    if (editingMovieId === movieId) {
      resetFormToCreateMode();
    }

    await reloadCatalogData();
    rerenderCatalogAfterDataReload(movieId);

    formMessage.textContent = `Фильм "${movieTitle}" удалён.`;
  } catch (error) {
    console.error('Ошибка при удалении фильма:', error);
    formMessage.textContent = 'Ошибка при удалении фильма. Смотри консоль F12.';
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
    await syncCatalogAfterAuthChange();
    return;
  }

  await applyCurrentSessionUser(data.session?.user ?? null);
  await syncCatalogAfterAuthChange();
}

async function applyCurrentSessionUser(user) {
  currentUser = user ?? null;
  await loadCurrentUserRole();
  updateAuthUI();
}

async function syncCatalogAfterAuthChange() {
  await fetchMovieWatchlist();
  rerenderCatalogAfterDataReload();
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

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Ошибка входа:', error);
    
      const errorText = String(error.message || '').toLowerCase();
    
      if (
        errorText.includes('email not confirmed') ||
        errorText.includes('email_not_confirmed')
      ) {
        showAuthMessage(
          'Почта ещё не подтверждена. Открой письмо от сервиса, подтверди e-mail и затем попробуй войти снова.',
          'error'
        );
        return;
      }
    
      showAuthMessage('Ошибка входа. Проверь e-mail и пароль.', 'error');
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
      showAuthMessage('Ошибка регистрации. Проверь email и пароль.', 'error');
      return;
    }

    loginPassword.value = '';
    loginEmail.focus();

    showAuthMessage(
      'Регистрация почти завершена. Открой письмо, подтверди e-mail и только потом входи в аккаунт. Без подтверждения почты вход не сработает.',
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

  showAuthMessage('Вы вышли из аккаунта.', 'success', true);
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

function showMovieRatingFeedback(movieId, text, type = 'success') {
  const card = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!card) {
    return;
  }

  const ratingBlock = card.querySelector('.movie-rating-block');

  if (!ratingBlock) {
    return;
  }

  const starsContainer = card.querySelector('.movie-user-rating-stars');
  const mobileTrigger = card.querySelector('.movie-user-rating-mobile-trigger');
  const ratingValueElement = card.querySelector('.movie-rating-value');

  triggerTemporaryFeedbackAnimation(starsContainer, `rating-stars-${movieId}`, type);
  triggerTemporaryFeedbackAnimation(mobileTrigger, `rating-mobile-${movieId}`, type);
  triggerTemporaryFeedbackAnimation(ratingValueElement, `rating-value-${movieId}`, type);

  let feedbackElement = ratingBlock.querySelector('.movie-rating-feedback');

  if (!feedbackElement) {
    feedbackElement = document.createElement('div');
    feedbackElement.className = 'movie-rating-feedback';
    ratingBlock.appendChild(feedbackElement);
  }

  feedbackElement.textContent = text;
  feedbackElement.classList.remove('is-success', 'is-remove', 'is-visible');
  feedbackElement.classList.add(type === 'remove' ? 'is-remove' : 'is-success');

  requestAnimationFrame(() => {
    feedbackElement.classList.add('is-visible');
  });

  if (ratingFeedbackTimers.has(movieId)) {
    clearTimeout(ratingFeedbackTimers.get(movieId));
  }

  const timeoutId = setTimeout(() => {
    feedbackElement.classList.remove('is-visible');

    const cleanupTimeoutId = setTimeout(() => {
      if (feedbackElement.parentNode) {
        feedbackElement.remove();
      }

      ratingFeedbackTimers.delete(movieId);
    }, 220);

    ratingFeedbackTimers.set(movieId, cleanupTimeoutId);
  }, 1600);

  ratingFeedbackTimers.set(movieId, timeoutId);
}

function showMovieWatchlistFeedback(movieId, text, type = 'success') {
  const card = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!card) {
    return;
  }

  const ratingBlock = card.querySelector('.movie-rating-block');

  if (!ratingBlock) {
    return;
  }

  const watchlistButton = card.querySelector('[data-watchlist-toggle="true"]');

  triggerTemporaryFeedbackAnimation(watchlistButton, `watchlist-btn-${movieId}`, type);

  let feedbackElement = ratingBlock.querySelector('.movie-watchlist-feedback');

  if (!feedbackElement) {
    feedbackElement = document.createElement('div');
    feedbackElement.className = 'movie-watchlist-feedback';
    ratingBlock.appendChild(feedbackElement);
  }

  feedbackElement.textContent = text;
  feedbackElement.classList.remove('is-success', 'is-remove', 'is-visible');
  feedbackElement.classList.add(type === 'remove' ? 'is-remove' : 'is-success');

  requestAnimationFrame(() => {
    feedbackElement.classList.add('is-visible');
  });

  if (watchlistFeedbackTimers.has(movieId)) {
    clearTimeout(watchlistFeedbackTimers.get(movieId));
  }

  const timeoutId = setTimeout(() => {
    feedbackElement.classList.remove('is-visible');

    const cleanupTimeoutId = setTimeout(() => {
      if (feedbackElement.parentNode) {
        feedbackElement.remove();
      }

      watchlistFeedbackTimers.delete(movieId);
    }, 220);

    watchlistFeedbackTimers.set(movieId, cleanupTimeoutId);
  }, 1600);

  watchlistFeedbackTimers.set(movieId, timeoutId);
}

function rerenderCatalogWithFallback(movieId, shouldRenderFullCatalog) {
  if (shouldRenderFullCatalog) {
    rerenderCatalogAfterDataReload(movieId);
  } else {
    rerenderMovieCard(movieId);
  }
}

function rerenderCatalogAfterWatchlistChange(movieId) {
  rerenderCatalogWithFallback(movieId, Boolean(watchlistFilter.value));
}

async function addMovieToWatchlist(movieId) {
  if (!currentUser) {
    return false;
  }

  try {
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

    await fetchMovieWatchlist();
    return true;
  } catch (error) {
    console.error('Ошибка добавления фильма в watchlist:', error);
    return false;
  }
}

async function removeMovieFromWatchlist(movieId) {
  if (!currentUser) {
    return false;
  }

  try {
    const { error } = await supabaseClient
      .from('movie_watchlist')
      .delete()
      .eq('movie_id', movieId)
      .eq('user_id', currentUser.id);

    if (error) {
      throw error;
    }

    await fetchMovieWatchlist();
    return true;
  } catch (error) {
    console.error('Ошибка удаления фильма из watchlist:', error);
    return false;
  }
}

async function toggleMovieWatchlist(movieId) {
  if (!currentUser) {
    return;
  }

  const movieKey = String(movieId);

  if (watchlistRequestInFlight.has(movieKey)) {
    return;
  }

  if (isMovieWatchedByCurrentUser(movieId)) {
    return;
  }

  const shouldRemoveFromWatchlist = hasMovieWatchlistRecord(movieId);
  let watchlistActionSucceeded = false;

  watchlistRequestInFlight.add(movieKey);

  try {
    if (shouldRemoveFromWatchlist) {
      watchlistActionSucceeded = await removeMovieFromWatchlist(movieId);
    } else {
      watchlistActionSucceeded = await addMovieToWatchlist(movieId);
    }
  } finally {
    watchlistRequestInFlight.delete(movieKey);

    if (watchlistActionSucceeded) {
      rerenderCatalogAfterWatchlistChange(movieId);

      if (shouldRemoveFromWatchlist) {
        showMovieWatchlistFeedback(movieId, 'Удалено из смотреть позже', 'remove');
      } else {
        showMovieWatchlistFeedback(movieId, 'Добавлено в смотреть позже');
      }
    }
  }
}

function rerenderCatalogAfterRatingChange(movieId) {
  rerenderCatalogWithFallback(
    movieId,
    Boolean(watchedFilter.value || watchlistFilter.value || ratingFilter.value !== '')
  );
}

async function removeUserMovieRating(movieId) {
  if (!currentUser) {
    return;
  }

  const movieKey = String(movieId);
  let ratingActionSucceeded = false;

  if (ratingRequestInFlight.has(movieKey)) {
    return;
  }

  ratingRequestInFlight.add(movieKey);

  try {
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

    await Promise.all([
      fetchMovieRatings(),
      fetchMovieWatchlist()
    ]);

    ratingActionSucceeded = true;
  } catch (error) {
    console.error('Ошибка удаления оценки фильма:', error);
  } finally {
    ratingRequestInFlight.delete(movieKey);

    if (ratingActionSucceeded) {
      rerenderCatalogAfterRatingChange(movieId);
      showMovieRatingFeedback(movieId, 'Оценка удалена', 'remove');
    }
  }
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
    }
  }, 220);

  document.body.style.overflow = isModalOpen || (filtersModal && filtersModal.style.display === 'block')
    ? 'hidden'
    : '';
  mobileRatingModalMovieId = null;
}

function openMobileRatingModal(movie) {
  if (!currentUser || !isMobileRatingLayout()) {
    return;
  }

  ensureMobileRatingModal();

  const currentUserRating = getCurrentUserRating(movie.id);

  mobileRatingModalMovieId = movie.id;
  mobileRatingModalTitle.textContent = movie.title;
  mobileRatingModalMeta.innerHTML = currentUserRating !== null
  ? `Ваша оценка: <strong class="rating-value">${currentUserRating}/10</strong>`
  : 'Оценка ещё не поставлена';

  mobileRatingModalStars.innerHTML = `
    <div class="mobile-rating-stars-grid">
      ${Array.from({ length: 10 }, (_, index) => {
        const value = index + 1;
        const isActive = currentUserRating !== null && value <= currentUserRating;

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
        const isActive = currentUserRating !== null && value <= currentUserRating;

        return `
          <span class="mobile-rating-scale-item ${isActive ? 'is-active' : ''}">${value}</span>
        `;
      }).join('')}
    </div>
  `;

  mobileRatingModalRemoveButton.style.display = currentUserRating !== null ? 'inline-flex' : 'none';

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
      saveUserMovieRating(movie.id, ratingValue);
    });
  });

  const selectedValue = currentUserRating ?? 0;

  mobileRatingModalStars.addEventListener('mouseleave', () => {
    applyMobileRatingHoverState(selectedValue, 'selected');
  });

  mobileRatingModal.style.display = 'block';

  requestAnimationFrame(() => {
    mobileRatingModal.classList.add('is-visible');
  });

  document.body.style.overflow = 'hidden';
}

async function saveUserMovieRating(movieId, ratingValue) {
  if (!currentUser) {
    return;
  }

  const normalizedRating = Number(ratingValue);
  const movieKey = String(movieId);
  let ratingActionSucceeded = false;

  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 10
  ) {
    return;
  }

  if (ratingRequestInFlight.has(movieKey)) {
    return;
  }

  ratingRequestInFlight.add(movieKey);

  try {
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
  
      await Promise.all([
        fetchMovieRatings(),
        fetchMovieWatchlist()
      ]);
  
      if (typeof ym === 'function') {
      const lastRatedMovie = sessionStorage.getItem('last_rated_movie');
    
      if (lastRatedMovie !== String(movieId)) {
        ym(108369182, 'reachGoal', 'rate_movie');
        sessionStorage.setItem('last_rated_movie', String(movieId));
      }
    }

    ratingActionSucceeded = true;
  } catch (error) {
    console.error('Ошибка сохранения оценки фильма:', error);
  } finally {
    ratingRequestInFlight.delete(movieKey);

    if (ratingActionSucceeded) {
      rerenderCatalogAfterRatingChange(movieId);
      showMovieRatingFeedback(movieId, `Оценка сохранена: ${normalizedRating}/10`);
    }
  }
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

  return `
    <div class="movie-user-rating">
      <div class="movie-user-rating-label">Ваша оценка</div>

      <div class="movie-user-rating-desktop">
        <div class="movie-user-rating-stars" data-current-rating="${currentUserRating ?? 0}">
          ${Array.from({ length: 10 }, (_, index) => {
            const value = index + 1;
            const isActive = currentUserRating !== null && value <= currentUserRating;

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
          class="movie-user-rating-mobile-trigger secondary-button secondary-button-compact ${currentUserRating !== null ? 'is-rated' : ''}"
          data-open-mobile-rating="true"
        >
          ${currentUserRating !== null ? `${currentUserRating}/10 <span class="movie-user-rating-mobile-star">★</span>` : 'Оценить'}
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



function getPosterHtml(movie, isWatchedByCurrentUser, isInWatchlist) {
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
          currentUser && !isWatchedByCurrentUser
            ? `
              <button
                type="button"
                class="movie-watchlist-btn ${isInWatchlist ? 'is-active' : ''}"
                data-watchlist-toggle="true"
                aria-label="${isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
                title="${isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
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
          isWatchedByCurrentUser
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

  const emptyStateTitle = hasSearchQuery || hasActiveFilters
    ? 'Ничего не найдено'
    : 'Каталог пока пуст';

  let emptyStateText = 'В каталоге пока нет фильмов.';

  if (hasSearchQuery && hasActiveFilters) {
    const filtersSummary = activeFilterChips
      .map(chip => chip.label)
      .join(', ');

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
    const filtersSummary = activeFilterChips
      .map(chip => chip.label)
      .join(', ');

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
        searchInput.value = '';
        saveCatalogState();
        renderMovies();
      }

      if (action === 'reset-filters') {
        resetFilterControls({ preserveSearch: true });
        renderMovies();
      }
    });
  }
}

function bindPosterLoadState(posterImage, posterSkeleton) {
  if (!posterImage || !posterSkeleton) {
    return;
  }

  const handlePosterReady = () => {
    if (posterImage.currentSrc || posterImage.src) {
      loadedPosterUrls.add(posterImage.currentSrc || posterImage.src);
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

  const syncRatingBusyState = () => {
    const isBusy = ratingRequestInFlight.has(String(movieId));

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
      if (ratingRequestInFlight.has(String(movieId))) {
        return;
      }

      const hoverValue = Number(button.dataset.ratingValue);
      applyStarState(hoverValue, 'hover');
    });

    button.addEventListener('click', () => {
      if (ratingRequestInFlight.has(String(movieId))) {
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
  container.querySelectorAll('[data-external-links-collapsible].is-open').forEach(panel => {
    const externalLinksGrid = panel.querySelector('.movie-external-links');

    if (!externalLinksGrid) {
      return;
    }

    const overlayHorizontalPadding = 24;
    const oneRowWidth = (36 * 4) + (6 * 3);
    const availableWidth = panel.clientWidth - overlayHorizontalPadding;

    externalLinksGrid.classList.toggle('is-two-rows', availableWidth < oneRowWidth);
  });
}

function createMovieCard(movie) {
  const card = document.createElement('article');
  const currentUserRating = getCurrentUserRating(movie.id);
  const isWatchedByCurrentUser = currentUserRating !== null;
  const isInWatchlist = isMovieInCurrentUserWatchlist(movie.id);

  card.className = 'movie-card';

  if (isWatchedByCurrentUser) {
    card.classList.add('movie-card-rated');
  } else if (isInWatchlist) {
    card.classList.add('movie-card-watchlist');
  }
  card.dataset.movieId = String(movie.id);

  const genres = movie.movie_genres.map(item => item.genres.name).join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');
  const averageRating = getMovieAverageRating(movie.id);
  const votesCount = getMovieRatings(movie.id).length;

  const ratingSummaryHtml = `
  <div class="movie-rating-summary">
    <div class="movie-rating-summary-main">
      <span class="movie-rating-value">${averageRating.toFixed(1)}</span>
      <span class="movie-rating-meta">
        (${votesCount} ${getVotesLabel(votesCount)})
      </span>
    </div>
    ${
      currentUserRating !== null
        ? `
          <button
            type="button"
            class="remove-rating-inline-btn secondary-button secondary-button-compact"
            data-remove-rating="true"
          >
            Удалить оценку
          </button>
        `
        : ''
    }
  </div>
`;

const userRatingControlsHtml = getUserRatingControlsHtml(currentUserRating);
const posterHtml = getPosterHtml(movie, isWatchedByCurrentUser, isInWatchlist);
const externalLinksHtml = getMovieExternalLinksHtml(movie);
const externalLinksBlockHtml = externalLinksHtml
  ? `
    <div class="movie-external-links-collapsible" data-external-links-collapsible>
      ${externalLinksHtml}
    </div>
  `
  : '';

card.innerHTML = `
  ${posterHtml}

  <h5 class="movie-title">${highlightSearchMatches(movie.title, searchInput.value)}</h5>

  <p>Оригинальное название: ${movie.original_title ? highlightSearchMatches(movie.original_title, searchInput.value) : '-'}</p>
  <p>Год: ${movie.year ?? '-'}</p>
  <p>Режиссёр: ${movie.director ? highlightSearchMatches(movie.director, searchInput.value) : '-'}</p>
  <p>Жанры: ${genres || '-'}</p>
  <p>Страны: ${countries || '-'}</p>

  <div class="movie-rating-block">
  ${
    externalLinksHtml
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
  const isRatingBusy = ratingRequestInFlight.has(String(movie.id));
  const isWatchlistBusy = watchlistRequestInFlight.has(String(movie.id));
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
      deleteMovie(movie.id, movie.title);
    });
  }

  bindMovieRatingControls({
    movieId: movie.id,
    currentUserRating,
    starsContainer,
    voteButtons
  });

  if (removeRatingBtn) {
    removeRatingBtn.disabled = isRatingBusy;

    removeRatingBtn.addEventListener('click', () => {
      removeUserMovieRating(movie.id);
    });
  }

  if (watchlistToggleBtn) {
    watchlistToggleBtn.disabled = isWatchlistBusy;
  
    watchlistToggleBtn.addEventListener('click', () => {
      toggleMovieWatchlist(movie.id);
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

        if (openedToggle) {
          openedToggle.setAttribute('aria-expanded', 'false');
          openedToggle.textContent = 'Ссылки на фильм';
        }

        if (openedPanel) {
          openedPanel.classList.remove('is-open');
        }

        openedCard.classList.remove('has-open-external-links');
      }

      const grid = card.querySelector('.movie-external-links');

      if (isExpanded) {
        setTimeout(() => {
          if (grid) grid.classList.remove('is-two-rows');
        }, 180);
      } else {
        if (grid) grid.classList.remove('is-two-rows');
      }

      if (!isExpanded) {
        externalLinksToggleBtn.setAttribute('aria-expanded', 'true');
        externalLinksToggleBtn.textContent = 'Свернуть';
        externalLinksCollapsible.classList.add('is-open');
        card.classList.add('has-open-external-links');

        requestAnimationFrame(syncOpenExternalLinksLayouts);
      }
    });
  }

  return card;
}

function rerenderMovieCard(movieId) {
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
    newCard.classList.contains('movie-card-rated') ||
    newCard.classList.contains('movie-card-watchlist')
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

  const nextCardTop = newCard.getBoundingClientRect().top;
  const scrollDelta = nextCardTop - previousCardTop;

  if (scrollDelta !== 0) {
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

  let filteredMovies = [...allMovies];

  if (searchQuery.trim() !== '') {
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
    filteredMovies = filteredMovies.filter(movie =>
      getMovieAverageRating(movie.id) >= Number(minRating)
    );
  }

  if (selectedYear) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.year !== null &&
      Number(movie.year) === Number(selectedYear)
    );
  }

  if (currentUser && selectedWatchlist === 'in_watchlist') {
    filteredMovies = filteredMovies.filter(movie =>
      isMovieInCurrentUserWatchlist(movie.id)
    );
  }

  if (currentUser && selectedWatchlist === 'not_in_watchlist') {
    filteredMovies = filteredMovies.filter(movie =>
      !isMovieInCurrentUserWatchlist(movie.id)
    );
  }

  if (currentUser && selectedWatched === 'watched') {
    filteredMovies = filteredMovies.filter(movie =>
      isMovieWatchedByCurrentUser(movie.id)
    );
  }

  if (currentUser && selectedWatched === 'unwatched') {
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

function createMonthSection(month, movies) {
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
      release: 'desc',
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
    const sortedMonthMovies = sortMoviesWithinMonth(
      movies,
      monthSortState.activeMode,
      monthSortState.directions[monthSortState.activeMode]
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

  const hasActiveFilters =
  searchInput.value.trim() !== '' ||
  genreFilter.value ||
  countryFilter.value ||
  ratingFilter.value !== '' ||
  yearFilter.value ||
  (currentUser && watchlistFilter.value) ||
  (currentUser && watchedFilter.value);

  renderActiveFilterChips();

  const filteredMovies = getFilteredMovies();

  if (filteredMovies.length === 0) {
    renderEmptyState();
    return;
  }

  container.innerHTML = '';

  if (viewMode.value === 'list') {
    const moviesFragment = document.createDocumentFragment();

    filteredMovies.forEach(movie => {
      const card = createMovieCard(movie);
      moviesFragment.appendChild(card);
    });

    container.appendChild(moviesFragment);
    return;
  }

  let lastYear = null;
  let currentMonth = null;
  let currentMonthMovies = [];
  const moviesFragment = document.createDocumentFragment();

  const flushCurrentMonth = () => {
    if (!currentMonth || currentMonthMovies.length === 0) {
      return;
    }

    moviesFragment.appendChild(
      createMonthSection(currentMonth, currentMonthMovies)
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

const debouncedRenderMovies = debounce(triggerCatalogRender, 200);

let lastSearchQuery = '';

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  if (query && query !== lastSearchQuery) {
    trackGoal('search_used');
    lastSearchQuery = query;
  }

  if (!query) {
    lastSearchQuery = '';
  }

  saveCatalogState();
  debouncedRenderMovies();
});

searchInput.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !searchInput.value) {
    return;
  }

  event.preventDefault();
  clearSearchInput();
  triggerCatalogRender();
});

const debouncedRenderMoviesForFilters = debounce(triggerCatalogRender, 120);

const handleFiltersChange = () => {
  trackFiltersUsageIfNeeded();
  saveCatalogState();
  debouncedRenderMoviesForFilters();
};

genreFilter.addEventListener('change', handleFiltersChange);
countryFilter.addEventListener('change', handleFiltersChange);
ratingFilter.addEventListener('change', handleFiltersChange);
yearFilter.addEventListener('change', handleFiltersChange);
watchlistFilter.addEventListener('change', handleFiltersChange);
watchedFilter.addEventListener('change', handleFiltersChange);
viewMode.addEventListener('change', () => {
  syncCatalogViewToggleButton();
  saveCatalogState();
  triggerCatalogRender();
});
sortMode.addEventListener('change', () => {
  trackSortUsageIfNeeded();
  saveCatalogState();
  triggerCatalogRender();
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
    resetFilterControls();
    triggerCatalogRender();
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

  if (!openedCard) return;

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

window.addEventListener('pagehide', () => {
  saveCatalogAnchorMovieId();
  saveCatalogScrollPosition();
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
    window.location.reload();
    return;
  }

  await restoreSession();
  trackEmailConfirmedLoginIfNeeded();

  bindCustomSelectGlobalEvents();

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      return;
    }

    const nextUserId = session?.user?.id ?? null;
    const currentUserId = currentUser?.id ?? null;

    if (nextUserId === currentUserId) {
      return;
    }

    const currentRequestId = ++authStateSyncRequestId;

    await applyCurrentSessionUser(session?.user ?? null);
    trackEmailConfirmedLoginIfNeeded();

    if (currentRequestId !== authStateSyncRequestId) {
      return;
    }

    await reloadCatalogData();

    if (currentRequestId !== authStateSyncRequestId) {
      return;
    }

    applySavedCatalogState();
    await syncCatalogAfterAuthChange();
  });

  await reloadCatalogData();
  initCatalogViewToggleButton();
  applySavedCatalogState();
  await syncCatalogAfterAuthChange();
  updateFiltersButtonLabel(); // на старте синхронизируем подпись кнопки
  restoreCatalogScrollPosition();
}

/* =========================================================
JS-БЛОК 24. ЗАПУСК ПРИЛОЖЕНИЯ
Точка входа.
========================================================== */
init();