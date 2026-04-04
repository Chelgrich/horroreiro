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
const monthFilter = document.getElementById('monthFilter');
const yearFilter = document.getElementById('yearFilter');
const watchlistFilter = document.getElementById('watchlistFilter');
const watchlistFilterRow = document.getElementById('watchlistFilterRow');
const watchedFilter = document.getElementById('watchedFilter');
const watchedFilterRow = document.getElementById('watchedFilterRow');
const sortMode = document.getElementById('sortMode');
const openFiltersButton = document.getElementById('openFiltersButton');
const filtersModal = document.getElementById('filtersModal');
const filtersModalBackdrop = document.getElementById('filtersModalBackdrop');
const closeFiltersModalButton = document.getElementById('closeFiltersModalButton');
const resetFiltersTopButton = document.getElementById('resetFiltersTopButton');
const filtersModalStatus = document.getElementById('filtersModalStatus');
const activeFiltersBar = document.getElementById('activeFiltersBar');

const container = document.getElementById('movies');

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
let isMovieFormSubmitting = false;
let ratingRequestInFlight = new Set();
let ratingFeedbackTimers = new Map();
let watchlistFeedbackTimers = new Map();
let watchlistRequestInFlight = new Set();
let mobileRatingModal = null;
let mobileRatingModalBackdrop = null;
let mobileRatingModalDialog = null;
let mobileRatingModalTitle = null;
let mobileRatingModalStars = null;
let mobileRatingModalMeta = null;
let mobileRatingModalRemoveButton = null;
let mobileRatingModalMovieId = null;

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
  monthFilter,
  yearFilter,
  watchlistFilter,
  watchedFilter,
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
        .map(movie => movie.release_year)
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

function resetFilterControls() {
  searchInput.value = '';
  genreFilter.value = '';
  countryFilter.value = '';
  ratingFilter.value = '';
  monthFilter.value = '';
  yearFilter.value = '';
  watchlistFilter.value = '';
  watchedFilter.value = '';

  filterCustomSelectElements
    .filter(selectElement => selectElement !== sortMode)
    .forEach(selectElement => {
      refreshCustomSelect(selectElement);
    });
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

  if (monthFilter.value) {
    const selectedOption = monthFilter.options[monthFilter.selectedIndex];
    chips.push({ label: `Месяц: ${selectedOption?.textContent || monthFilter.value}`, key: 'month' });
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

  if (filterKey === 'month') {
    monthFilter.value = '';
    refreshCustomSelect(monthFilter);
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

  renderMovies();

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
    let finalPosterUrl = posterUrl || null;

    if (posterFile) {
      formMessage.textContent = 'Загружаю постер...';
      finalPosterUrl = await uploadPosterFile(posterFile);
    }

    formMessage.textContent = 'Сохраняю...';

    const { data: insertedMovie, error: insertMovieError } = await supabaseClient
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
      .single();

    if (insertMovieError) {
      throw insertMovieError;
    }

    await replaceMovieRelations(insertedMovie.id, genreNames, countryNames);

    formMessage.textContent = 'Обновляю каталог...';
    await reloadCatalogData(); // сначала дожидаемся полной синхронизации состояния каталога

    resetFormToCreateMode();
    closeMovieModal();
  } catch (error) {
    console.error('Ошибка при добавлении фильма:', error);
    formMessage.textContent = 'Ошибка при добавлении фильма. Смотри консоль F12.';
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
    let finalPosterUrl = posterUrl || null;
    let uploadedNewPoster = false;

    if (posterFile) {
      formMessage.textContent = 'Загружаю постер...';
      finalPosterUrl = await uploadPosterFile(posterFile);
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

      const { error: updateMovieError } = await supabaseClient
        .from('movies')
        .update(changedFields)
        .eq('id', editingMovieId);

      if (updateMovieError) {
        throw updateMovieError;
      }
    }

    if (relationsChanged) {
      await replaceMovieRelations(editingMovieId, genreNames, countryNames);
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
    await reloadCatalogData();

    closeMovieModal();
    resetFormToCreateMode();
  } catch (error) {
    console.error('Ошибка при редактировании фильма:', error);
    formMessage.textContent = 'Ошибка при редактировании фильма. Смотри консоль F12.';
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
    return;
  }

  await applyCurrentSessionUser(data.session?.user ?? null);
}

async function applyCurrentSessionUser(user) {
  currentUser = user ?? null;
  await loadCurrentUserRole();
  updateAuthUI();
}

async function login(event) {
  event.preventDefault();

  showAuthMessage('Выполняю вход...');

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

  await applyCurrentSessionUser(data.user ?? null);
  loginPassword.value = '';
  renderMovies();

  showAuthMessage('Вход выполнен.', 'success', true);

  if (typeof ym === 'function') {
    ym(108369182, 'reachGoal', 'email_confirmed_login');
  }
}

async function register() {
  showAuthMessage('Регистрирую аккаунт...');

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

  if (typeof ym === 'function') {
    ym(108369182, 'reachGoal', 'register');
  }
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error('Ошибка выхода:', error);
    showAuthMessage('Не удалось выйти.', 'error');
    return;
  }

  await applyCurrentSessionUser(null);
  renderMovies();
  showAuthMessage('Вы вышли из аккаунта.', 'success', true);
}

/* =========================================================
JS-БЛОК 20. ПОЛЬЗОВАТЕЛЬСКИЕ ОЦЕНКИ
Позволяет авторизованному пользователю поставить или обновить
свою оценку фильму.
========================================================== */
function showMovieRatingFeedback(movieId, text, type = 'success') {
  const card = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!card) {
    return;
  }

  const ratingBlock = card.querySelector('.movie-rating-block');

  if (!ratingBlock) {
    return;
  }

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

async function addMovieToWatchlist(movieId) {
  if (!currentUser) {
    return;
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

    if (watchlistFilter.value) {
      renderMovies();
    } else {
      rerenderMovieCard(movieId);
    }

    showMovieWatchlistFeedback(movieId, 'Добавлено в смотреть позже');
  } catch (error) {
    console.error('Ошибка добавления фильма в watchlist:', error);
  }
}

async function removeMovieFromWatchlist(movieId) {
  if (!currentUser) {
    return;
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

    if (watchlistFilter.value) {
      renderMovies();
    } else {
      rerenderMovieCard(movieId);
    }

    showMovieWatchlistFeedback(movieId, 'Удалено из смотреть позже', 'remove');
  } catch (error) {
    console.error('Ошибка удаления фильма из watchlist:', error);
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

  watchlistRequestInFlight.add(movieKey);

  if (isMovieWatchedByCurrentUser(movieId)) {
    return;
  }

  try {
    if (hasMovieWatchlistRecord(movieId)) {
      await removeMovieFromWatchlist(movieId);
    } else {
      await addMovieToWatchlist(movieId);
    }
  } finally {
    watchlistRequestInFlight.delete(movieKey);

    if (watchlistFilter.value) {
      renderMovies();
    } else {
      rerenderMovieCard(movieId);
    }
  }
}

async function removeUserMovieRating(movieId) {
  if (!currentUser) {
    return;
  }

  const movieKey = String(movieId);

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

    await Promise.all([
      fetchMovieRatings(),
      fetchMovieWatchlist()
    ]);

    if (typeof ym === 'function') {
      ym(108369182, 'reachGoal', 'rate_movie');
    }

    showMovieRatingFeedback(movieId, 'Оценка удалена', 'remove');
  } catch (error) {
    console.error('Ошибка удаления оценки фильма:', error);
  } finally {
    ratingRequestInFlight.delete(movieKey);

    if (watchedFilter.value || ratingFilter.value !== '') {
      renderMovies();
    } else {
      rerenderMovieCard(movieId);
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
          class="mobile-rating-modal-close secondary-button"
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
          class="mobile-rating-modal-remove secondary-button"
          id="mobileRatingModalRemoveButton"
        >
          Удалить оценку
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(mobileRatingModal);

  mobileRatingModalBackdrop = mobileRatingModal.querySelector('.mobile-rating-modal-backdrop');
  mobileRatingModalDialog = mobileRatingModal.querySelector('.mobile-rating-modal-dialog');
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

  mobileRatingModalStars.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const value = index + 1;
    const isActive = currentUserRating !== null && value <= currentUserRating;

    return `
      <button
        type="button"
        class="mobile-rating-star-btn ${isActive ? 'is-active' : ''}"
        data-mobile-rating-value="${value}"
        aria-label="Оценка ${value} из 10"
        title="${value}"
      >
        ★
      </button>
    `;
  }).join('');

  mobileRatingModalRemoveButton.style.display = currentUserRating !== null ? 'inline-flex' : 'none';

  mobileRatingModalStars.querySelectorAll('[data-mobile-rating-value]').forEach(button => {
    button.addEventListener('click', () => {
      const ratingValue = Number(button.dataset.mobileRatingValue);

      closeMobileRatingModal();
      saveUserMovieRating(movie.id, ratingValue);
    });
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

    await Promise.all([
      fetchMovieRatings(),
      fetchMovieWatchlist()
    ]);

    showMovieRatingFeedback(movieId, `Оценка сохранена: ${normalizedRating}/10`);
  } catch (error) {
    console.error('Ошибка сохранения оценки фильма:', error);
  } finally {
    ratingRequestInFlight.delete(movieKey);

    if (watchedFilter.value || watchlistFilter.value || ratingFilter.value !== '') {
      renderMovies();
    } else {
      rerenderMovieCard(movieId);
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
  if (selectedSortMode === 'alphabet') {
    movies.sort((a, b) =>
      String(a.title || '').localeCompare(String(b.title || ''), 'ru')
    );
    return;
  }

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
                title="${value}"
              >
                ★
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="movie-user-rating-mobile">
        <button
          type="button"
          class="movie-user-rating-mobile-trigger secondary-button ${currentUserRating !== null ? 'is-rated' : ''}"
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
              <div class="movie-poster-skeleton" aria-hidden="true"></div>
              <img
                class="movie-poster"
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
  const hasSearchQuery = searchInput.value.trim() !== '';
  const hasActiveFilters = getActiveFilterChips().length > 0;

  const emptyStateTitle = hasSearchQuery || hasActiveFilters
    ? 'Ничего не найдено'
    : 'Каталог пока пуст';

  const emptyStateText = hasSearchQuery || hasActiveFilters
    ? 'Попробуй изменить фильтры, очистить поиск или сбросить параметры отбора.'
    : 'Когда здесь появятся фильмы, они отобразятся в этом разделе.';

  const emptyStateActions = hasSearchQuery || hasActiveFilters
    ? `
      <div class="empty-state-actions">
        <button
          type="button"
          class="secondary-button empty-state-reset-btn"
          id="emptyStateResetButton"
        >
          Сбросить фильтры
        </button>
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

  const emptyStateResetButton = document.getElementById('emptyStateResetButton');

  if (emptyStateResetButton) {
    emptyStateResetButton.addEventListener('click', () => {
      resetFilterControls();
      renderMovies();
    });
  }
}

function bindPosterLoadState(posterImage, posterSkeleton) {
  if (!posterImage || !posterSkeleton) {
    return;
  }

  const handlePosterReady = () => {
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
            class="remove-rating-inline-btn secondary-button"
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

  <h3>${movie.title}</h3>

  <p>Оригинальное название: ${movie.original_title ?? '-'}</p>
  <p>Год: ${movie.year ?? '-'}</p>
  <p>Режиссёр: ${movie.director ?? '-'}</p>
  <p>Жанры: ${genres || '-'}</p>
  <p>Страны: ${countries || '-'}</p>

  <div class="movie-rating-block">
  ${
    externalLinksHtml
      ? `
        <button
          type="button"
          class="movie-external-links-toggle secondary-button"
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
    const externalLinksGrid = externalLinksCollapsible.querySelector('.movie-external-links');

    const syncExternalLinksLayout = () => {
      if (!externalLinksGrid) {
        return;
      }

      const overlayHorizontalPadding = 24;
      const oneRowWidth = (36 * 4) + (6 * 3);
      const availableWidth = externalLinksCollapsible.clientWidth - overlayHorizontalPadding;

      externalLinksGrid.classList.toggle('is-two-rows', availableWidth < oneRowWidth);
    };

    externalLinksToggleBtn.addEventListener('click', () => {
      const isExpanded = externalLinksToggleBtn.getAttribute('aria-expanded') === 'true';

      container.querySelectorAll('[data-external-links-toggle="true"]').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Ссылки на фильм';
      });

      container.querySelectorAll('[data-external-links-collapsible]').forEach(panel => {
        panel.classList.remove('is-open');
      });

      container.querySelectorAll('.movie-card').forEach(movieCard => {
        movieCard.classList.remove('has-open-external-links');
      });

      container.querySelectorAll('.movie-external-links').forEach(grid => {
        grid.classList.remove('is-two-rows');
      });

      if (!isExpanded) {
        externalLinksToggleBtn.setAttribute('aria-expanded', 'true');
        externalLinksToggleBtn.textContent = 'Свернуть';
        externalLinksCollapsible.classList.add('is-open');
        card.classList.add('has-open-external-links');

        requestAnimationFrame(syncExternalLinksLayout);
      }
    });

    window.addEventListener('resize', () => {
      if (!externalLinksCollapsible.classList.contains('is-open')) {
        return;
      }

      syncExternalLinksLayout();
    });
  }

  return card;
}

function rerenderMovieCard(movieId) {
  const existingCard = container.querySelector(`[data-movie-id="${movieId}"]`);

  if (!existingCard) {
    renderMovies();
    return;
  }

  const movie = allMovies.find(item => String(item.id) === String(movieId));

  if (!movie) {
    renderMovies();
    return;
  }

  const newCard = createMovieCard(movie);
  existingCard.replaceWith(newCard);
}

function getFilteredMovies() {
  const selectedGenre = genreFilter.value;
  const selectedCountry = countryFilter.value;
  const minRating = ratingFilter.value;
  const selectedMonth = monthFilter.value;
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

  if (selectedMonth) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.release_month !== null &&
      Number(movie.release_month) === Number(selectedMonth)
    );
  }

  if (selectedYear) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.release_year !== null &&
      Number(movie.release_year) === Number(selectedYear)
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

function renderMovies() {
  if (!moviesLoadedSuccessfully) {
    return;
  }

  const hasActiveFilters =
  searchInput.value.trim() !== '' ||
  genreFilter.value ||
  countryFilter.value ||
  ratingFilter.value !== '' ||
  monthFilter.value ||
  yearFilter.value ||
  (currentUser && watchlistFilter.value) ||
  (currentUser && watchedFilter.value);

  renderActiveFilterChips();

  if (hasActiveFilters && typeof ym === 'function') {
    ym(108369182, 'reachGoal', 'use_filters');
  }

  const filteredMovies = getFilteredMovies();

  if (filteredMovies.length === 0) {
    renderEmptyState();
    return;
  }

  container.innerHTML = '';

  filteredMovies.forEach(movie => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
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

const debouncedRenderMovies = debounce(renderMovies, 200);

searchInput.addEventListener('input', debouncedRenderMovies);
genreFilter.addEventListener('change', renderMovies);
countryFilter.addEventListener('change', renderMovies);
ratingFilter.addEventListener('change', renderMovies);
monthFilter.addEventListener('change', renderMovies);
yearFilter.addEventListener('change', renderMovies);
watchlistFilter.addEventListener('change', renderMovies);
watchedFilter.addEventListener('change', renderMovies);
sortMode.addEventListener('change', () => {
  if (typeof ym === 'function') {
    ym(108369182, 'reachGoal', 'use_sort');
  }

  renderMovies();
});

if (resetFiltersTopButton) {
  resetFiltersTopButton.addEventListener('click', () => {
    resetFilterControls();
    renderMovies();
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

  container.querySelectorAll('[data-external-links-toggle="true"]').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Ссылки на фильм';
  });

  container.querySelectorAll('[data-external-links-collapsible]').forEach(panel => {
    panel.classList.remove('is-open');
  });

  container.querySelectorAll('.movie-card').forEach(movieCard => {
    movieCard.classList.remove('has-open-external-links');
  });
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

  bindCustomSelectGlobalEvents();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    await applyCurrentSessionUser(session?.user ?? null);
    renderMovies();
  });

  await reloadCatalogData();
  updateFiltersButtonLabel(); // на старте синхронизируем подпись кнопки
}

/* =========================================================
JS-БЛОК 24. ЗАПУСК ПРИЛОЖЕНИЯ
Точка входа.
========================================================== */
init();