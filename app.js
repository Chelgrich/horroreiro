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
const sortMode = document.getElementById('sortMode');
const resetFiltersBtn = document.getElementById('resetFilters');

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
const genresInput = document.getElementById('genresInput');
const countriesInput = document.getElementById('countriesInput');

/* =========================================================
JS-БЛОК 2. ПОДКЛЮЧЕНИЕ К SUPABASE
Создаёт клиент Supabase для работы с базой, auth и storage.
========================================================== */
const SUPABASE_URL = window.__ENV__?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY;

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
let currentUser = null;
let currentUserRole = null;
let isAdmin = false;
let allMovies = [];
let allMovieRatings = [];
let editingMovieId = null;
let isModalOpen = false;
let moviesLoadedSuccessfully = false;
let authMessageTimer = null;

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

function updateAdminStatus() {
  isAdmin = Boolean(currentUser && currentUserRole === 'admin');
}

async function loadCurrentUserRole() {
  if (!currentUser) {
    currentUserRole = null;
    updateAdminStatus();
    return;
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .maybeSingle();

  if (error) {
    console.error('Ошибка загрузки роли пользователя:', error);
    currentUserRole = null;
    updateAdminStatus();
    return;
  }

  currentUserRole = data?.role ?? 'user';
  updateAdminStatus();
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
  if (!authMessage) {
    return;
  }

  if (authMessageTimer) {
    clearTimeout(authMessageTimer);
    authMessageTimer = null;
  }

  authMessage.textContent = text;
  authMessage.classList.remove('is-hidden', 'is-error', 'is-success');

  if (type === 'error') {
    authMessage.classList.add('is-error');
  }

  if (type === 'success') {
    authMessage.classList.add('is-success');
  }

  if (autoHide) {
    authMessageTimer = setTimeout(() => {
      authMessage.classList.add('is-hidden');

      setTimeout(() => {
        authMessage.textContent = '';
        authMessage.classList.remove('is-hidden', 'is-error', 'is-success');
      }, 300);
    }, 2000);
  }
}

function clearAuthMessage() {
  if (!authMessage) {
    return;
  }

  if (authMessageTimer) {
    clearTimeout(authMessageTimer);
    authMessageTimer = null;
  }

  authMessage.textContent = '';
  authMessage.classList.remove('is-hidden', 'is-error', 'is-success');
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

function resetFormToCreateMode() {
  editingMovieId = null;
  movieForm.reset();
  posterFileInput.value = '';
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

  titleInput.value = movie.title ?? '';
  originalTitleInput.value = movie.original_title ?? '';
  yearInput.value = movie.year ?? '';
  releaseMonthInput.value = movie.release_month ?? '';
  releaseYearInput.value = movie.release_year ?? '';
  sortOrderInput.value = movie.sort_order ?? '';
  directorInput.value = movie.director ?? '';
  posterUrlInput.value = movie.poster_url ?? '';
  posterFileInput.value = '';

  const genres = movie.movie_genres.map(item => item.genres.name).join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');

  genresInput.value = genres;
  countriesInput.value = countries;

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

  genreFilter.innerHTML = '<option value="">Все</option>';

  data.forEach(item => {
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

/* =========================================================
JS-БЛОК 12. РАБОТА С POSTER STORAGE
Загружает новый постер, определяет storage-путь и удаляет
старый файл при замене.
========================================================== */
async function uploadPosterFile(file) {
  if (!file) {
    return null;
  }

  const fileExtension = file.name.includes('.')
    ? file.name.split('.').pop().toLowerCase()
    : 'jpg';

  const safeExtension = fileExtension.replace(/[^a-z0-9]/g, '') || 'jpg';
  const fileName = `${crypto.randomUUID()}.${safeExtension}`;
  const filePath = `movies/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from('posters')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabaseClient.storage
    .from('posters')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

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

  const genreNames = parseCommaSeparated(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
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
        release_month: releaseMonth ? Number(releaseMonth) : null,
        release_year: releaseYear ? Number(releaseYear) : null,
        sort_order: sortOrder ? Number(sortOrder) : null,
        owner_id: currentUser.id
      })
      .select()
      .single();

    if (insertMovieError) {
      throw insertMovieError;
    }

    await replaceMovieRelations(insertedMovie.id, genreNames, countryNames);

    formMessage.textContent = 'Фильм успешно добавлен.';
    closeMovieModal();
    resetFormToCreateMode();

    await Promise.all([
      loadGenres(),
      loadCountries(),
      fetchMovies(),
      fetchMovieRatings()
    ]);

    renderMovies();
  } catch (error) {
    console.error('Ошибка при добавлении фильма:', error);
    formMessage.textContent = 'Ошибка при добавлении фильма. Смотри консоль F12.';
  }
}

/* =========================================================
JS-БЛОК 16. РЕДАКТИРОВАНИЕ ФИЛЬМА
Обновляет фильм и пересобирает его связи и постер.
========================================================== */
async function updateMovie(event) {
  event.preventDefault();

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

  const genreNames = parseCommaSeparated(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    return;
  }

  const existingMovie = allMovies.find(movie => movie.id === editingMovieId);
  const oldPosterUrl = existingMovie ? existingMovie.poster_url : null;

  try {
    let finalPosterUrl = posterUrl || null;
    let uploadedNewPoster = false;

    if (posterFile) {
      formMessage.textContent = 'Загружаю постер...';
      finalPosterUrl = await uploadPosterFile(posterFile);
      uploadedNewPoster = true;
    }

    formMessage.textContent = 'Сохраняю изменения...';

    const { error: updateMovieError } = await supabaseClient
      .from('movies')
      .update({
        title,
        original_title: originalTitle || null,
        year: year ? Number(year) : null,
        director: director || null,
        poster_url: finalPosterUrl,
        release_month: releaseMonth ? Number(releaseMonth) : null,
        release_year: releaseYear ? Number(releaseYear) : null,
        sort_order: sortOrder ? Number(sortOrder) : null
      })
      .eq('id', editingMovieId);

    if (updateMovieError) {
      throw updateMovieError;
    }

    await replaceMovieRelations(editingMovieId, genreNames, countryNames);

    if (uploadedNewPoster && oldPosterUrl && oldPosterUrl !== finalPosterUrl) {
      try {
        await deletePosterFileByUrl(oldPosterUrl);
      } catch (deletePosterError) {
        console.error('Не удалось удалить старый постер:', deletePosterError);
      }
    }

    formMessage.textContent = 'Фильм успешно обновлён.';
    closeMovieModal();
    resetFormToCreateMode();

    await Promise.all([
      loadGenres(),
      loadCountries(),
      fetchMovies(),
      fetchMovieRatings()
    ]);

    renderMovies();
  } catch (error) {
    console.error('Ошибка при редактировании фильма:', error);
    formMessage.textContent = 'Ошибка при редактировании фильма. Смотри консоль F12.';
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

    await Promise.all([
      fetchMovies(),
      fetchMovieRatings()
    ]);

    renderMovies();

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
    currentUser = null;
    updateAdminStatus();
    updateAuthUI();
    return;
  }

  currentUser = data.session?.user ?? null;
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
    showAuthMessage('Ошибка входа. Проверь email и пароль.', 'error');
    return;
  }

  currentUser = data.user ?? null;
  await loadCurrentUserRole();
  loginPassword.value = '';
  updateAuthUI();
  renderMovies();

  showAuthMessage('Вход выполнен.', 'success', true);
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

  showAuthMessage(
    'Аккаунт создан. Если включено подтверждение почты, заверши его в письме.',
    'success',
    true
  );
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error('Ошибка выхода:', error);
    showAuthMessage('Не удалось выйти.', 'error');
    return;
  }

  currentUser = null;
  currentUserRole = null;
  isAdmin = false;
  updateAuthUI();
  renderMovies();
  showAuthMessage('Вы вышли из аккаунта.', 'success', true);
}

/* =========================================================
JS-БЛОК 20. ПОЛЬЗОВАТЕЛЬСКИЕ ОЦЕНКИ
Позволяет авторизованному пользователю поставить или обновить
свою оценку фильму.
========================================================== */
async function saveUserMovieRating(movieId, ratingValue) {
  if (!currentUser) {
    return;
  }

  const normalizedRating = Number(ratingValue);

  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 10
  ) {
    return;
  }

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

    await fetchMovieRatings();
    renderMovies();
  } catch (error) {
    console.error('Ошибка сохранения оценки фильма:', error);
  }
}

/* =========================================================
JS-БЛОК 21. ОТРИСОВКА КАТАЛОГА ФИЛЬМОВ
Применяет поиск, фильтры и сортировку, затем выводит карточки.
========================================================== */
function renderMovies() {
  if (!moviesLoadedSuccessfully) {
    return;
  }

  const selectedGenre = genreFilter.value;
  const selectedCountry = countryFilter.value;
  const minRating = ratingFilter.value;
  const selectedMonth = monthFilter.value;
  const selectedYear = yearFilter.value;
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

  if (selectedSortMode === 'alphabet') {
    filteredMovies.sort((a, b) =>
      String(a.title || '').localeCompare(String(b.title || ''), 'ru')
    );
  } else if (selectedSortMode === 'oldest') {
    filteredMovies.sort((a, b) => {
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
  } else {
    filteredMovies.sort((a, b) => {
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

  if (filteredMovies.length === 0) {
    container.innerHTML = 'По выбранным фильтрам ничего не найдено.';
    return;
  }

  container.innerHTML = '';

  filteredMovies.forEach(movie => {
    const card = document.createElement('article');
    card.className = 'movie-card';

    const genres = movie.movie_genres.map(item => item.genres.name).join(', ');
    const countries = movie.movie_countries.map(item => item.countries.name).join(', ');
    const averageRating = getMovieAverageRating(movie.id);
    const votesCount = getMovieRatings(movie.id).length;
    const currentUserRating = getCurrentUserRating(movie.id);

    const ratingSummaryHtml = `
      <div class="movie-rating-summary">
        <span class="movie-rating-value">${averageRating.toFixed(1)}</span>
        <span class="movie-rating-meta">
          (${votesCount} ${
            votesCount === 1
              ? 'оценка'
              : votesCount >= 2 && votesCount <= 4
                ? 'оценки'
                : 'оценок'
          })
        </span>
      </div>
    `;

    const userRatingControlsHtml = currentUser ? `
      <div class="movie-user-rating">
        <div class="movie-user-rating-label">Ваша оценка</div>
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
    ` : '';

    const posterHtml = `
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
      </div>
    `;

    card.innerHTML = `
      ${posterHtml}
      <h3>${movie.title}</h3>
      <p>Оригинальное название: ${movie.original_title ?? '-'}</p>
      <p>Год: ${movie.year ?? '-'}</p>
      <p>Режиссёр: ${movie.director ?? '-'}</p>
      <p>Жанры: ${genres || '-'}</p>
      <p>Страны: ${countries || '-'}</p>

      <div class="movie-rating-block">
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

    container.appendChild(card);

    const actionsBlock = card.querySelector('.movie-card-actions');
    const editBtn = card.querySelector('.edit-movie-btn');
    const deleteBtn = card.querySelector('.delete-movie-btn');
    const starsContainer = card.querySelector('.movie-user-rating-stars');
    const voteButtons = card.querySelectorAll('.rating-star-btn');
    const posterImage = card.querySelector('.movie-poster');
    const posterSkeleton = card.querySelector('.movie-poster-skeleton');

    if (posterImage && posterSkeleton) {
      const handlePosterReady = () => {
        posterImage.classList.add('is-loaded');
        posterSkeleton.classList.add('is-hidden');
      };

      if (posterImage.complete) {
        handlePosterReady();
      } else {
        posterImage.addEventListener('load', handlePosterReady, { once: true });
        posterImage.addEventListener('error', () => {
          posterSkeleton.classList.add('is-hidden');
        }, { once: true });
      }
    }

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

    if (starsContainer && voteButtons.length > 0) {
      const applyStarState = (activeValue, mode = 'selected') => {
        voteButtons.forEach(button => {
          const buttonValue = Number(button.dataset.ratingValue);
          const isFilled = buttonValue <= activeValue;

          button.classList.toggle('is-hovered', mode === 'hover' && isFilled);
          button.classList.toggle('is-active', mode === 'selected' && isFilled);
        });
      };

      voteButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          const hoverValue = Number(button.dataset.ratingValue);
          applyStarState(hoverValue, 'hover');
        });

        button.addEventListener('click', () => {
          const ratingValue = Number(button.dataset.ratingValue);
          saveUserMovieRating(movie.id, ratingValue);
        });
      });

      starsContainer.addEventListener('mouseleave', () => {
        const selectedValue = currentUserRating ?? 0;
        applyStarState(selectedValue, 'selected');
      });
    }
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

closeMovieModalButton.addEventListener('click', () => {
  closeMovieModal();
});

movieModalBackdrop.addEventListener('click', () => {
  closeMovieModal();
});

const debouncedRenderMovies = debounce(renderMovies, 200);

searchInput.addEventListener('input', debouncedRenderMovies);
genreFilter.addEventListener('change', renderMovies);
countryFilter.addEventListener('change', renderMovies);
ratingFilter.addEventListener('change', renderMovies);
monthFilter.addEventListener('change', renderMovies);
yearFilter.addEventListener('change', renderMovies);
sortMode.addEventListener('change', renderMovies);

resetFiltersBtn.addEventListener('click', () => {
  searchInput.value = '';
  genreFilter.value = '';
  countryFilter.value = '';
  ratingFilter.value = '';
  monthFilter.value = '';
  yearFilter.value = '';

  filterCustomSelectElements
    .filter(selectElement => selectElement !== sortMode)
    .forEach(selectElement => {
      refreshCustomSelect(selectElement);
    });

  renderMovies();
});

movieForm.addEventListener('submit', saveMovie);

cancelEditButton.addEventListener('click', () => {
  resetFormToCreateMode();
  closeMovieModal();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') {
    return;
  }

  closeAllCustomSelects();

  if (isModalOpen) {
    closeMovieModal();
  }
});

/* =========================================================
JS-БЛОК 23. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
Восстанавливает сессию, подписывается на auth-изменения,
загружает данные и запускает первую отрисовку.
========================================================== */
async function init() {
  container.innerHTML = 'Загрузка...';

  await restoreSession();

  bindCustomSelectGlobalEvents();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user ?? null;
    await loadCurrentUserRole();
    updateAuthUI();
    renderMovies();
  });

  await Promise.all([
    loadGenres(),
    loadCountries(),
    fetchMovies(),
    fetchMovieRatings()
  ]);

  initCustomSelects();
  renderMovies();
}

/* =========================================================
JS-БЛОК 24. ЗАПУСК ПРИЛОЖЕНИЯ
Точка входа.
========================================================== */
init();