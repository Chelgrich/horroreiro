/* =========================================================
JS-БЛОК 1. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ СО СТРАНИЦЫ
Сохраняет ссылки на DOM-элементы, с которыми работает приложение.
========================================================== */
const movieModal = document.getElementById('movieModal');
const movieModalBackdrop = document.getElementById('movieModalBackdrop');
const closeMovieModalButton = document.getElementById('closeMovieModalButton');

const authControls = document.getElementById('authControls');
const displayNameWrap = document.getElementById('displayNameWrap');
const displayNameButton = document.getElementById('displayNameButton');
const displayNameText = document.getElementById('displayNameText');
const displayNameModal = document.getElementById('displayNameModal');
const displayNameModalBackdrop = document.getElementById('displayNameModalBackdrop');
const closeDisplayNameModalButton = document.getElementById('closeDisplayNameModalButton');
const displayNameForm = document.getElementById('displayNameForm');
const displayNameInput = document.getElementById('displayNameInput');
const saveDisplayNameButton = document.getElementById('saveDisplayNameButton');
const cancelDisplayNameButton = document.getElementById('cancelDisplayNameButton');
const displayNameMessage = document.getElementById('displayNameMessage');

const openAuthModalButton = document.getElementById('openAuthModalButton');
const authPopoverMenu = document.getElementById('authPopoverMenu');
const logoutMenuButton = document.getElementById('logoutMenuButton');
const authModal = document.getElementById('authModal');
const authModalBackdrop = document.getElementById('authModalBackdrop');
const closeAuthModalButton = document.getElementById('closeAuthModalButton');
const authModalTitle = document.getElementById('authModalTitle');
const loginForm = document.getElementById('loginForm');
const authFormLinks = document.getElementById('authFormLinks');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerNicknameInput = document.getElementById('registerNickname');
const registerNicknameHint = document.getElementById('registerNicknameHint');
const loginPasswordConfirm = document.getElementById('loginPasswordConfirm');
const registerButton = document.getElementById('registerButton');
const forgotPasswordButton = document.getElementById('forgotPasswordButton');
const authToast = document.getElementById('authToast');
const authMessage = document.getElementById('authMessage');

const adminPanel = document.getElementById('adminPanel');
const openAddMovieButton = document.getElementById('openAddMovieButton');
let taxonomyJsonExportButton = null;
let taxonomyImportButton = null;
let taxonomyImportFileInput = null;
let isTaxonomyImportInProgress = false;

const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const genreFilter = document.getElementById('genreFilter');
const subgenreFilter = document.getElementById('subgenreFilter');
const formatFilter = document.getElementById('formatFilter');
const countryFilter = document.getElementById('countryFilter');
const ratingFilter = document.getElementById('ratingFilter');
const yearFilter = document.getElementById('yearFilter');
const triggerFiltersSelect = document.getElementById('triggerFiltersSelect');
const triggerFiltersToggle = document.getElementById('triggerFiltersToggle');
const triggerFiltersTriggerText = document.getElementById('triggerFiltersTriggerText');
const triggerFiltersDropdown = document.getElementById('triggerFiltersDropdown');
const triggerFiltersGroup = document.getElementById('triggerFiltersGroup');
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
const moviePage = document.getElementById('moviePage');
const moviePageAdminActions = document.getElementById('moviePageAdminActions');
const moviePageEditButton = document.getElementById('moviePageEditButton');
const moviePageDeleteButton = document.getElementById('moviePageDeleteButton');
const moviesSectionTitle = document.querySelector('.movies-section .section-title');
const moviesResultCount = document.getElementById('moviesResultCount');
let catalogViewToggleButton = null;

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
const synopsisInput = document.getElementById('synopsis');
const movieFormatsInput = document.getElementById('movieFormats');
const movieModifiersInput = document.getElementById('movieModifiers');
const movieBroadFamiliesInput = document.getElementById('movieBroadFamilies');
const tagsPerceivedInput = document.getElementById('tagsPerceived');
const tagsCanonInput = document.getElementById('tagsCanon');
const movieTriggersInput = document.getElementById('movieTriggers');
const movieTaxonomyPrimaryPreview = document.getElementById('movieTaxonomyPrimaryPreview');
const movieTaxonomySecondaryPreview = document.getElementById('movieTaxonomySecondaryPreview');
const movieTaxonomyWarningsPreview = document.getElementById('movieTaxonomyWarningsPreview');

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
const PASSWORD_RECOVERY_PENDING_KEY = 'horroreiro_password_recovery_pending';
const CATALOG_SCROLL_POSITION_KEY = 'horroreiro_catalog_scroll_position';
const CATALOG_ANCHOR_MOVIE_ID_KEY = 'horroreiro_catalog_anchor_movie_id';

let currentUser = null;
let currentUserRole = null;
let currentUserProfile = null;
let isAdmin = false;
let isAuthModalOpen = false;
let isAuthPopoverOpen = false;
let isDisplayNameModalOpen = false;
let isDisplayNameSubmitting = false;
let isAuthRegisterMode = false;
let isPasswordRecoveryMode = false;
let isPasswordRecoveryEntryPage = false;
let allMovies = [];
let allMovieRatings = [];
let allMovieWatchlist = [];
let allMovieReviews = [];
let reviewRequestInFlight = new Set();
let expandedSpoilerReviewIds = new Set();
let expandedMovieReviewTextIds = new Set();
let editingMovieReviewId = null;
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
let allGenreNames = [];
let allCountryNames = [];
let lastCatalogAnchorMovieId = null;
let currentMoviePageMovieId = null;
let currentMoviePageMovieData = null;
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

function buildMovieTaxonomyDraftFromForm() {
  const formats = parseMultilineValues(movieFormatsInput?.value || '');
  const modifiers = parseMultilineValues(movieModifiersInput?.value || '');
  const broadFamilies = parseMultilineValues(movieBroadFamiliesInput?.value || '');
  const tagsPerceived = parseMultilineValues(tagsPerceivedInput?.value || '');
  const tagsCanon = parseMultilineValues(tagsCanonInput?.value || '');
  const triggers = parseMultilineValues(movieTriggersInput?.value || '');

  const taxonomyHelpers = window.HORROR_TAXONOMY?.helpers;
  const taxonomyMovieDraft = {
    formats,
    modifiers,
    broad_families: broadFamilies,
    tags_perceived: tagsPerceived,
    tags_canon: tagsCanon,
    triggers
  };

  const resolvedSubgenres = taxonomyHelpers?.resolveMovieSubgenres
    ? taxonomyHelpers.resolveMovieSubgenres(taxonomyMovieDraft)
    : {
        primary_subgenre: null,
        secondary_subgenres: []
      };

  const validationResult = taxonomyHelpers?.validateMovieTags
    ? taxonomyHelpers.validateMovieTags(taxonomyMovieDraft)
    : {
        warnings: []
      };

  return {
    formats,
    modifiers,
    broadFamilies,
    tagsPerceived,
    tagsCanon,
    triggers,
    primarySubgenre: resolvedSubgenres.primary_subgenre || null,
    secondarySubgenres: Array.isArray(resolvedSubgenres.secondary_subgenres)
      ? resolvedSubgenres.secondary_subgenres
      : [],
    warnings: Array.isArray(validationResult.warnings)
      ? validationResult.warnings
      : []
  };
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .trim()
    .replace(/\s+/g, ' ');
}

function getTaxonomyLabel(groupName, key) {
  const normalizedKey = String(key || '').trim();

  if (!normalizedKey) {
    return '';
  }

  return window.HORROR_TAXONOMY?.labels?.[groupName]?.[normalizedKey] || normalizedKey;
}

function mapTaxonomyLabels(groupName, values) {
  return (Array.isArray(values) ? values : [])
    .filter(Boolean)
    .map(value => getTaxonomyLabel(groupName, value));
}

function normalizeTaxonomyExportValues(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return '—';
  }

  return values
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .join('\n');
}

function normalizeTaxonomyJsonArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const uniqueValues = new Map();

  values
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .forEach(value => {
      const normalizedValue = normalizeSearchText(value);

      if (!uniqueValues.has(normalizedValue)) {
        uniqueValues.set(normalizedValue, value);
      }
    });

  return Array.from(uniqueValues.values());
}

function normalizeTaxonomyImportBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  return String(value || '').trim().toLowerCase() === 'true';
}

function getTaxonomyImportMovies(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.movies)) {
    return payload.movies;
  }

  return [];
}

function getTaxonomyImportChangedFields(importMovie, existingMovie) {
  const tagsPerceived = normalizeTaxonomyJsonArray(importMovie.tags_perceived);
  const tagsCanon = normalizeTaxonomyJsonArray(importMovie.tags_canon);
  const formats = normalizeTaxonomyJsonArray(importMovie.tags_formats);
  const modifiers = normalizeTaxonomyJsonArray(importMovie.tags_modifiers);
  const broadFamilies = normalizeTaxonomyJsonArray(importMovie.tags_broad_families);
  const maskConflict = normalizeTaxonomyImportBoolean(importMovie.mask_conflict);

  const taxonomyHelpers = window.HORROR_TAXONOMY?.helpers;
  const resolvedSubgenres = taxonomyHelpers?.resolveMovieSubgenres
    ? taxonomyHelpers.resolveMovieSubgenres({ tags_perceived: tagsPerceived })
    : {
        primary_subgenre: null,
        secondary_subgenres: []
      };

  const changedFields = {};

  if (!areStringArraysEqual(tagsPerceived, existingMovie.tags_perceived || [])) {
    changedFields.tags_perceived = tagsPerceived;
  }

  if (!areStringArraysEqual(tagsCanon, existingMovie.tags_canon || [])) {
    changedFields.tags_canon = tagsCanon;
  }

  if (!areStringArraysEqual(formats, existingMovie.formats || [])) {
    changedFields.formats = formats;
  }

  if (!areStringArraysEqual(modifiers, existingMovie.modifiers || [])) {
    changedFields.modifiers = modifiers;
  }

  if (!areStringArraysEqual(broadFamilies, existingMovie.broad_families || [])) {
    changedFields.broad_families = broadFamilies;
  }

  if ((resolvedSubgenres.primary_subgenre || null) !== (existingMovie.primary_subgenre ?? null)) {
    changedFields.primary_subgenre = resolvedSubgenres.primary_subgenre || null;
  }

  if (!areStringArraysEqual(resolvedSubgenres.secondary_subgenres || [], existingMovie.secondary_subgenres || [])) {
    changedFields.secondary_subgenres = resolvedSubgenres.secondary_subgenres || [];
  }

  if (maskConflict !== Boolean(existingMovie.mask_conflict)) {
    changedFields.mask_conflict = maskConflict;
  }

  return changedFields;
}

function buildTaxonomyImportPreview(importItems) {
  const movieById = new Map(
    allMovies.map(movie => [String(movie.id), movie])
  );

  const updates = [];
  const missingItems = [];
  const invalidItems = [];

  importItems.forEach((importMovie, index) => {
    const movieId = String(importMovie?.id || '').trim();

    if (!movieId) {
      invalidItems.push(index + 1);
      return;
    }

    const existingMovie = movieById.get(movieId);

    if (!existingMovie) {
      missingItems.push(importMovie);
      return;
    }

    const changedFields = getTaxonomyImportChangedFields(importMovie, existingMovie);

    if (Object.keys(changedFields).length === 0) {
      return;
    }

    updates.push({
      movie: existingMovie,
      changedFields
    });
  });

  return {
    updates,
    missingItems,
    invalidItems
  };
}

function formatTaxonomyImportPreviewMessage(preview) {
  const changedMovieLines = preview.updates
    .slice(0, 12)
    .map(item => {
      const fieldNames = Object.keys(item.changedFields).join(', ');
      return `• ${item.movie.title || 'Без названия'} — ${fieldNames}`;
    });

  const moreUpdatesCount = Math.max(0, preview.updates.length - changedMovieLines.length);
  const messageLines = [
    'Импорт тегов из JSON',
    '',
    `Будет обновлено фильмов: ${preview.updates.length}`,
    `Не найдено по id: ${preview.missingItems.length}`,
    `Записей без id: ${preview.invalidItems.length}`
  ];

  if (changedMovieLines.length > 0) {
    messageLines.push('', 'Первые изменения:', ...changedMovieLines);
  }

  if (moreUpdatesCount > 0) {
    messageLines.push(`…и ещё ${moreUpdatesCount}`);
  }

  messageLines.push('', 'Применить импорт?');

  return messageLines.join('\n');
}

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result || ''));
    };

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл импорта.'));
    };

    reader.readAsText(file);
  });
}

function setTaxonomyImportControlsDisabled(isDisabled) {
  isTaxonomyImportInProgress = isDisabled;

  if (taxonomyImportButton) {
    taxonomyImportButton.disabled = isDisabled;
  }

  if (taxonomyJsonExportButton) {
    taxonomyJsonExportButton.disabled = isDisabled;
  }
}

async function applyTaxonomyImportUpdates(updates) {
  for (const item of updates) {
    const { error } = await supabaseClient
      .from('movies')
      .update(item.changedFields)
      .eq('id', item.movie.id);

    throwIfSupabaseError(error);
  }
}

async function importMovieTaxonomyJsonFile(file) {
  if (isTaxonomyImportInProgress) {
    return;
  }

  setTaxonomyImportControlsDisabled(true);

  try {
    ensureActiveSessionForWrite();
    showAuthMessage('Читаю JSON-импорт тегов...');

    if (!Array.isArray(allMovies) || allMovies.length === 0) {
      await fetchMovies();
    }

    const fileText = await readTextFile(file);
    const payload = JSON.parse(fileText);
    const importItems = getTaxonomyImportMovies(payload);

    if (importItems.length === 0) {
      showAuthMessage('В JSON не найден массив movies для импорта.', 'error', true);
      return;
    }

    const preview = buildTaxonomyImportPreview(importItems);

    if (preview.updates.length === 0) {
      showAuthMessage('В импортируемом JSON нет изменений для текущих фильмов.', 'success', true);
      return;
    }

    const isConfirmed = confirm(formatTaxonomyImportPreviewMessage(preview));

    if (!isConfirmed) {
      showAuthMessage('Импорт отменён.', 'info', true);
      return;
    }

    showAuthMessage(`Обновляю теги: ${preview.updates.length} фильмов...`);

    await applyTaxonomyImportUpdates(preview.updates);
    await reloadCatalogData({ showSkeleton: isCatalogPage() });

    if (isCatalogPage()) {
      rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);
    }

    if (isMoviePage() && currentMoviePageMovieId) {
      const updatedMovie = await reloadMoviePageData(currentMoviePageMovieId);

      if (updatedMovie) {
        renderMoviePage(updatedMovie);
      }
    }

    showAuthMessage(`Импорт тегов применён: ${preview.updates.length} фильмов.`, 'success', true);
  } catch (error) {
    console.error('Ошибка импорта тегов:', error);
    showAuthMessage(`Ошибка импорта тегов: ${error.message || 'смотри консоль F12.'}`, 'error', true);
  } finally {
    setTaxonomyImportControlsDisabled(false);
  }
}

function handleTaxonomyImportFileChange(event) {
  const file = event.target.files?.[0] || null;

  event.target.value = '';

  if (!file) {
    return;
  }

  importMovieTaxonomyJsonFile(file);
}

function buildMovieTaxonomyExportBlock(movie) {
  const title = String(movie?.title || 'Без названия').trim();
  const year = movie?.year ? ` (${movie.year})` : '';
  const originalTitle = movie?.original_title
    ? `Оригинальное название: ${movie.original_title}\n`
    : '';

  return [
    `Название: ${title}${year}`,
    originalTitle.trim(),
    `ID: ${movie.id}`,
    movie.slug ? `Slug: ${movie.slug}` : '',
    movie.letterboxd_url ? `Letterboxd: ${movie.letterboxd_url}` : '',
    '',
    'Perceived:',
    normalizeTaxonomyExportValues(movie.tags_perceived),
    '',
    'Canon:',
    normalizeTaxonomyExportValues(movie.tags_canon),
    '',
    'Formats:',
    normalizeTaxonomyExportValues(movie.formats),
    '',
    'Modifiers:',
    normalizeTaxonomyExportValues(movie.modifiers),
    '',
    'Broad families:',
    normalizeTaxonomyExportValues(movie.broad_families),
    '',
    'Mask conflict:',
    movie.mask_conflict ? 'true' : 'false'
  ]
    .filter((line, index, lines) => {
      const previousLine = lines[index - 1];
      return line !== '' || previousLine !== '';
    })
    .join('\n');
}

function buildMovieTaxonomyJsonExportItem(movie) {
  return {
    id: movie.id,
    slug: movie.slug || '',
    title: movie.title || '',
    original_title: movie.original_title || '',
    year: movie.year ?? null,
    letterboxd_url: movie.letterboxd_url || '',
    tags_perceived: normalizeTaxonomyJsonArray(movie.tags_perceived),
    tags_canon: normalizeTaxonomyJsonArray(movie.tags_canon),
    tags_formats: normalizeTaxonomyJsonArray(movie.formats),
    tags_modifiers: normalizeTaxonomyJsonArray(movie.modifiers),
    tags_broad_families: normalizeTaxonomyJsonArray(movie.broad_families),
    mask_conflict: Boolean(movie.mask_conflict)
  };
}

function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function sortMoviesForTaxonomyExport(movies) {
  return [...movies].sort((firstMovie, secondMovie) => {
    const firstYear = Number(firstMovie.year || 0);
    const secondYear = Number(secondMovie.year || 0);

    if (secondYear !== firstYear) {
      return secondYear - firstYear;
    }

    return String(firstMovie.title || '').localeCompare(String(secondMovie.title || ''), 'ru');
  });
}

async function ensureMoviesForTaxonomyExport() {
  if (!Array.isArray(allMovies) || allMovies.length === 0) {
    await fetchMovies();
  }

  if (!Array.isArray(allMovies) || allMovies.length === 0) {
    showAuthMessage('Нет фильмов для выгрузки.', 'error', true);
    return [];
  }

  return sortMoviesForTaxonomyExport(allMovies);
}

async function exportMovieTaxonomyJsonData() {
  try {
    const sortedMovies = await ensureMoviesForTaxonomyExport();

    if (sortedMovies.length === 0) {
      return;
    }

    const exportedAt = new Date().toISOString();
    const content = JSON.stringify({
      schema: 'horroreiro_taxonomy_tags',
      version: 1,
      exported_at: exportedAt,
      movies_count: sortedMovies.length,
      movies: sortedMovies.map(buildMovieTaxonomyJsonExportItem)
    }, null, 2);

    const datePart = exportedAt.slice(0, 10);
    downloadTextFile(
      `horroreiro-taxonomy-export-${datePart}.json`,
      content,
      'application/json;charset=utf-8'
    );

    showAuthMessage(`JSON-выгрузка тегов готова: ${sortedMovies.length} фильмов.`, 'success', true);
  } catch (error) {
    console.error('Ошибка JSON-выгрузки тегов:', error);
    showAuthMessage(`Ошибка JSON-выгрузки тегов: ${error.message || 'смотри консоль F12.'}`, 'error', true);
  }
}

function initTaxonomyExportButton() {
  if (!adminPanel || (taxonomyJsonExportButton && taxonomyImportButton && taxonomyImportFileInput)) {
    return;
  }

  if (!taxonomyJsonExportButton) {
    taxonomyJsonExportButton = document.createElement('button');
    taxonomyJsonExportButton.type = 'button';
    taxonomyJsonExportButton.id = 'exportTaxonomyJsonButton';
    taxonomyJsonExportButton.className = 'secondary-button secondary-button-compact taxonomy-export-button';
    taxonomyJsonExportButton.textContent = 'Экспорт JSON';
    taxonomyJsonExportButton.title = 'Скачать JSON-выгрузку тегов для последующего импорта';

    taxonomyJsonExportButton.addEventListener('click', exportMovieTaxonomyJsonData);
  }

  if (!taxonomyImportFileInput) {
    taxonomyImportFileInput = document.createElement('input');
    taxonomyImportFileInput.type = 'file';
    taxonomyImportFileInput.accept = 'application/json,.json';
    taxonomyImportFileInput.className = 'taxonomy-import-file-input';

    taxonomyImportFileInput.addEventListener('change', handleTaxonomyImportFileChange);
  }

  if (!taxonomyImportButton) {
    taxonomyImportButton = document.createElement('button');
    taxonomyImportButton.type = 'button';
    taxonomyImportButton.id = 'importTaxonomyJsonButton';
    taxonomyImportButton.className = 'secondary-button secondary-button-compact taxonomy-export-button taxonomy-import-button';
    taxonomyImportButton.textContent = 'Импорт JSON';
    taxonomyImportButton.title = 'Импортировать JSON-выгрузку тегов и массово обновить только теговые поля';

    taxonomyImportButton.addEventListener('click', () => {
      taxonomyImportFileInput.click();
    });
  }

  adminPanel.prepend(taxonomyImportFileInput);
  adminPanel.prepend(taxonomyImportButton);
  adminPanel.prepend(taxonomyJsonExportButton);
}

function getSelectedTriggerFilters() {
  if (!triggerFiltersGroup) {
    return [];
  }

  return Array.from(
    triggerFiltersGroup.querySelectorAll('input[type="checkbox"][data-trigger-filter]:checked')
  ).map(input => input.value);
}

function closeTriggerFiltersDropdown() {
  if (!triggerFiltersSelect || !triggerFiltersToggle || !triggerFiltersDropdown) {
    return;
  }

  triggerFiltersSelect.classList.remove('is-open');
  triggerFiltersToggle.setAttribute('aria-expanded', 'false');
  triggerFiltersDropdown.setAttribute('aria-hidden', 'true');
}

function openTriggerFiltersDropdown() {
  if (!triggerFiltersSelect || !triggerFiltersToggle || !triggerFiltersDropdown) {
    return;
  }

  triggerFiltersSelect.classList.add('is-open');
  triggerFiltersToggle.setAttribute('aria-expanded', 'true');
  triggerFiltersDropdown.setAttribute('aria-hidden', 'false');
}

function toggleTriggerFiltersDropdown() {
  if (!triggerFiltersSelect) {
    return;
  }

  if (triggerFiltersSelect.classList.contains('is-open')) {
    closeTriggerFiltersDropdown();
    return;
  }

  openTriggerFiltersDropdown();
}

function syncTriggerFiltersTriggerText() {
  if (!triggerFiltersTriggerText) {
    return;
  }

  const selectedTriggerKeys = getSelectedTriggerFilters();
  const hasSelectedTriggers = selectedTriggerKeys.length > 0;

  if (triggerFiltersSelect) {
    triggerFiltersSelect.classList.toggle('has-value', hasSelectedTriggers);
  }

  if (!hasSelectedTriggers) {
    triggerFiltersTriggerText.textContent = 'Скрыть по триггерам';
    return;
  }

  if (selectedTriggerKeys.length === 1) {
    triggerFiltersTriggerText.textContent = `Исключить: ${getTaxonomyLabel('triggers', selectedTriggerKeys[0])}`;
    return;
  }

  triggerFiltersTriggerText.textContent = `Исключить: ${selectedTriggerKeys.length}`;
}

function updateMovieTaxonomyPreview() {
  if (!movieTaxonomyPrimaryPreview || !movieTaxonomySecondaryPreview || !movieTaxonomyWarningsPreview) {
    return;
  }

  const taxonomyDraft = buildMovieTaxonomyDraftFromForm();
  const primaryLabel = taxonomyDraft.primarySubgenre
    ? getTaxonomyLabel('subgenres', taxonomyDraft.primarySubgenre)
    : '—';
  const secondaryLabels = taxonomyDraft.secondarySubgenres.length > 0
    ? mapTaxonomyLabels('subgenres', taxonomyDraft.secondarySubgenres).join(', ')
    : '—';

  movieTaxonomyPrimaryPreview.textContent = primaryLabel;
  movieTaxonomySecondaryPreview.textContent = secondaryLabels;

  if (!taxonomyDraft.warnings.length) {
    movieTaxonomyWarningsPreview.innerHTML = '';
    return;
  }

  movieTaxonomyWarningsPreview.innerHTML = taxonomyDraft.warnings
    .map(warning => `<div class="movie-taxonomy-preview-warning">${escapeHtml(warning.message)}</div>`)
    .join('');
}

function transliterateForSlug(value) {
  const transliterationMap = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
  };

  return String(value || '')
    .split('')
    .map(character => {
      const lowerCharacter = character.toLowerCase();

      if (transliterationMap[lowerCharacter] !== undefined) {
        return transliterationMap[lowerCharacter];
      }

      return character;
    })
    .join('');
}

function slugifyMovieValue(value) {
  const transliteratedValue = transliterateForSlug(value);

  return transliteratedValue
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function buildUniqueMovieSlug(title, year = null, excludeMovieId = null) {
  const normalizedYear = Number(year) || null;
  const baseSlug = slugifyMovieValue(title) || 'movie';
  const slugBaseWithYear = normalizedYear
    ? `${baseSlug}-${normalizedYear}`
    : baseSlug;

  let slugCandidate = slugBaseWithYear;
  let suffix = 2;

  while (true) {
    let query = supabaseClient
      .from('movies')
      .select('id')
      .eq('slug', slugCandidate)
      .limit(1);

    if (excludeMovieId) {
      query = query.neq('id', excludeMovieId);
    }

    const { data, error } = await query;

    throwIfSupabaseError(error);

    if (!data || data.length === 0) {
      return slugCandidate;
    }

    slugCandidate = `${slugBaseWithYear}-${suffix}`;
    suffix += 1;
  }
}

function buildMoviePageUrl(movie) {
  if (movie?.slug) {
    return `movie.html?slug=${encodeURIComponent(movie.slug)}`;
  }

  return `movie.html?id=${encodeURIComponent(movie.id)}`;
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeDisplayNameValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function isValidDisplayNameValue(value) {
  return /^[A-Za-zА-Яа-яЁё0-9_]{3,24}$/.test(String(value || '').trim());
}

function getCurrentDisplayName() {
  return String(
    currentUser?.user_metadata?.display_name ||
    currentUserProfile?.display_name ||
    currentUserProfile?.default_display_name ||
    ''
  ).trim();
}

function setDisplayNameMessage(message = '', type = '') {
  if (!displayNameMessage) {
    return;
  }

  displayNameMessage.textContent = message;
  displayNameMessage.classList.remove('is-error', 'is-success');

  if (type) {
    displayNameMessage.classList.add(`is-${type}`);
  }
}

function syncDisplayNameButton() {
  if (!displayNameWrap || !displayNameButton || !displayNameText) {
    return;
  }

  const shouldShowDisplayName = shouldUseAuthenticatedUi();
  const currentDisplayName = getCurrentDisplayName();

  displayNameWrap.classList.toggle('is-visible', shouldShowDisplayName);
  displayNameText.textContent = currentDisplayName;
  displayNameButton.title = currentDisplayName;
  displayNameButton.setAttribute('aria-expanded', String(isDisplayNameModalOpen));
}

function closeDisplayNameModal() {
  if (!displayNameModal || !displayNameButton) {
    return;
  }

  displayNameModal.classList.remove('is-open');
  isDisplayNameModalOpen = false;
  displayNameButton.setAttribute('aria-expanded', 'false');
  setDisplayNameMessage();
  syncBodyScrollLock();
}

function openDisplayNameModal() {
  if (!displayNameModal || !displayNameButton || !displayNameInput || !shouldUseAuthenticatedUi()) {
    return;
  }

  closeAuthPopoverMenu();

  displayNameInput.value = getCurrentDisplayName();
  displayNameModal.classList.add('is-open');
  isDisplayNameModalOpen = true;
  displayNameButton.setAttribute('aria-expanded', 'true');
  setDisplayNameMessage();
  syncBodyScrollLock();

  requestAnimationFrame(() => {
    displayNameInput.focus();
    displayNameInput.select();
  });
}

function toggleDisplayNameModal() {
  if (isDisplayNameModalOpen) {
    closeDisplayNameModal();
    return;
  }

  openDisplayNameModal();
}

async function updateCurrentUserDisplayName(nextDisplayName) {
  if (!currentUser) {
    return;
  }

  currentUser = {
    ...currentUser,
    user_metadata: {
      ...(currentUser.user_metadata || {}),
      display_name: nextDisplayName
    }
  };

  currentUserProfile = {
    ...(currentUserProfile || {}),
    display_name: nextDisplayName
  };

  syncDisplayNameButton();
  updateAuthUI();
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
    if (!container) {
      return;
    }

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
        subgenre: subgenreFilter.value,
        format: formatFilter.value,
        country: countryFilter.value,
        rating: ratingFilter.value,
        year: yearFilter.value,
        triggerExcludes: getSelectedTriggerFilters(),
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
      subgenreFilter.value = catalogState.subgenre || '';
      formatFilter.value = catalogState.format || '';
      countryFilter.value = catalogState.country || '';
      ratingFilter.value = catalogState.rating || '';
      yearFilter.value = catalogState.year || '';
      watchlistFilter.value = currentUser ? (catalogState.watchlist || '') : '';
      watchedFilter.value = currentUser ? (catalogState.watched || '') : '';

      const savedTriggerExcludes = Array.isArray(catalogState.triggerExcludes)
        ? catalogState.triggerExcludes
        : [];

      if (triggerFiltersGroup) {
        triggerFiltersGroup
          .querySelectorAll('input[type="checkbox"][data-trigger-filter]')
          .forEach(input => {
            input.checked = savedTriggerExcludes.includes(input.value);
          });
      }
      viewMode.value = catalogState.viewMode || 'list';
      sortMode.value = catalogState.sortMode || 'default';
    }

    if (searchClearBtn) {
      searchClearBtn.classList.toggle('is-visible', Boolean(searchInput.value.trim()));
    }

    refreshCustomSelectGroup([
      genreFilter,
      subgenreFilter,
      formatFilter,
      countryFilter,
      ratingFilter,
      yearFilter,
      watchlistFilter,
      watchedFilter,
      viewMode,
      sortMode
    ]);

    syncCatalogViewToggleButton();
    syncTriggerFiltersTriggerText();
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
    subgenreFilter.value ||
    formatFilter.value ||
    getSelectedTriggerFilters().length > 0 ||
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

function isPasswordRecoveryRedirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const hasPendingRecovery = Boolean(localStorage.getItem(PASSWORD_RECOVERY_PENDING_KEY));
  const hasAuthReturnParams = (
    searchParams.has('code') ||
    searchParams.has('token_hash') ||
    hashParams.has('access_token') ||
    hashParams.has('refresh_token')
  );

  return (
    searchParams.get('type') === 'recovery' ||
    hashParams.get('type') === 'recovery' ||
    (hasPendingRecovery && hasAuthReturnParams)
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
    currentUserProfile = null;
    updateAdminStatus();
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('role, display_name, default_display_name')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      console.error('Ошибка загрузки профиля пользователя:', error);
      currentUserRole = null;
      currentUserProfile = null;
    } else {
      currentUserRole = data?.role || null;
      currentUserProfile = data || null;
    }
  } catch (error) {
    console.error('Ошибка loadCurrentUserRole:', error);
    currentUserRole = null;
    currentUserProfile = null;
  }

  updateAdminStatus();
}

function updateAdminStatus() {
  isAdmin = Boolean(currentUser && currentUserRole === 'admin');
}

function shouldUseAuthenticatedUi() {
  return Boolean(currentUser) && !isPasswordRecoveryMode;
}

function getCurrentUserMovieState(movieId) {
  if (!shouldUseAuthenticatedUi()) {
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

function getMovieReviews(movieId) {
  return allMovieReviews.filter(item => item.movie_id === movieId);
}

function getMovieReviewByUserId(movieId, userId) {
  if (!movieId || !userId) {
    return null;
  }

  return allMovieReviews.find(item => (
    item.movie_id === movieId && item.user_id === userId
  )) || null;
}

function getCurrentUserMovieReview(movieId) {
  if (!currentUser) {
    return null;
  }

  return getMovieReviewByUserId(movieId, currentUser.id);
}

function getMovieReviewAuthorName(review) {
  return String(
    review?.profiles?.display_name ||
    review?.profiles?.default_display_name ||
    review?.author_display_name ||
    'Пользователь'
  ).trim();
}

function getMovieReviewUserRating(movieId, userId) {
  if (!movieId || !userId) {
    return 0;
  }

  const ratingRow = getMovieRatings(movieId).find(item => (
    String(item.user_id) === String(userId)
  ));

  return Number(ratingRow?.rating ?? 0);
}

function formatMovieReviewDate(dateValue) {
  if (!dateValue) {
    return '';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function canCurrentUserCreateMovieReview(movieId) {
  return Boolean(currentUser) && getCurrentUserRating(movieId) !== null;
}

function normalizeMovieReviewText(value) {
  return String(value || '').trim();
}

function isMovieReviewExpanded(reviewId) {
  return expandedSpoilerReviewIds.has(String(reviewId));
}

function setMovieReviewExpandedState(reviewId, shouldExpand) {
  const normalizedReviewId = String(reviewId);

  if (shouldExpand) {
    expandedSpoilerReviewIds.add(normalizedReviewId);
    return;
  }

  expandedSpoilerReviewIds.delete(normalizedReviewId);
}

function isMovieReviewTextExpanded(reviewId) {
  return expandedMovieReviewTextIds.has(String(reviewId));
}

function setMovieReviewTextExpandedState(reviewId, shouldExpand) {
  const normalizedReviewId = String(reviewId);

  if (shouldExpand) {
    expandedMovieReviewTextIds.add(normalizedReviewId);
    return;
  }

  expandedMovieReviewTextIds.delete(normalizedReviewId);
}

function isMovieReviewLong(reviewText) {
  return String(reviewText || '').trim().length > 650;
}

function startMovieReviewEditing(reviewId) {
  editingMovieReviewId = String(reviewId);
}

function stopMovieReviewEditing() {
  editingMovieReviewId = null;
}

function isMovieReviewEditing(reviewId) {
  return String(editingMovieReviewId) === String(reviewId);
}

function sortMovieReviewsForDisplay(reviews) {
  return [...(Array.isArray(reviews) ? reviews : [])].sort((firstReview, secondReview) => {
    const isFirstCurrentUserReview = currentUser && String(firstReview.user_id) === String(currentUser.id);
    const isSecondCurrentUserReview = currentUser && String(secondReview.user_id) === String(currentUser.id);

    if (isFirstCurrentUserReview !== isSecondCurrentUserReview) {
      return isFirstCurrentUserReview ? -1 : 1;
    }

    const firstTime = new Date(firstReview.updated_at || firstReview.created_at || 0).getTime();
    const secondTime = new Date(secondReview.updated_at || secondReview.created_at || 0).getTime();

    if (firstTime !== secondTime) {
      return secondTime - firstTime;
    }

    return 0;
  });
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

function resetAuthFormState() {
  isPasswordRecoveryMode = false;
  isAuthRegisterMode = false;

  if (loginForm) {
    loginForm.reset();
  }

  if (loginPasswordConfirm) {
    loginPasswordConfirm.value = '';
  }

  updateAuthModalMode();
  clearAuthMessage();
}

function setAuthRegisterMode(nextMode) {
  if (isPasswordRecoveryMode) {
    return;
  }

  isAuthRegisterMode = Boolean(nextMode);
  clearAuthMessage();
  updateAuthModalMode();

  requestAnimationFrame(() => {
    if (isAuthRegisterMode) {
      registerNicknameInput?.focus();
      return;
    }

    loginEmail?.focus();
  });
}

async function cancelPasswordRecoveryFlow() {
  localStorage.removeItem(PASSWORD_RECOVERY_PENDING_KEY);
  isPasswordRecoveryEntryPage = false;
  clearEmailConfirmationParamsFromUrl();

  try {
    await supabaseClient.auth.signOut({ scope: 'global' });
  } catch (error) {
    console.error('Ошибка отмены recovery-сессии:', error);
  }
}

async function clearLocalRecoverySession() {
  try {
    await supabaseClient.auth.signOut({ scope: 'local' });
  } catch (error) {
    console.error('Ошибка локальной очистки recovery-сессии:', error);
  }
}

function syncAuthIconButtonState() {
  if (!openAuthModalButton) {
    return;
  }

  const isAuthenticated = shouldUseAuthenticatedUi();

  openAuthModalButton.classList.toggle('is-authenticated', isAuthenticated);
  openAuthModalButton.setAttribute(
    'aria-label',
    isAuthenticated ? 'Меню аккаунта' : 'Вход или регистрация'
  );
  openAuthModalButton.setAttribute(
    'title',
    isAuthenticated ? 'Меню аккаунта' : 'Вход или регистрация'
  );

  if (!isAuthenticated) {
    closeAuthPopoverMenu();
  }
}

function setAuthSubmittingState(isSubmitting) {
  isAuthSubmitting = isSubmitting;

  if (loginEmail) {
    loginEmail.disabled = isSubmitting || isPasswordRecoveryMode;
  }

  if (loginPassword) {
    loginPassword.disabled = isSubmitting;
  }

  if (registerNicknameInput) {
    registerNicknameInput.disabled = isSubmitting || !isAuthRegisterMode || isPasswordRecoveryMode;
  }

  if (loginPasswordConfirm) {
    loginPasswordConfirm.disabled = isSubmitting || !isPasswordRecoveryMode;
  }

  const loginSubmitButton = loginForm?.querySelector('button[type="submit"]');

  if (loginSubmitButton) {
    loginSubmitButton.disabled = isSubmitting;
  }

  if (registerButton) {
    registerButton.disabled = isSubmitting;
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
    isAuthModalOpen ||
    (displayNameModal && displayNameModal.classList.contains('is-open')) ||
    (filtersModal && filtersModal.classList.contains('is-open')) ||
    (mobileRatingModal && mobileRatingModal.classList.contains('is-open'))
  );

  document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
}

function closeAuthPopoverMenu() {
  if (!authPopoverMenu || !openAuthModalButton) {
    return;
  }

  authPopoverMenu.classList.remove('is-open');
  isAuthPopoverOpen = false;
  openAuthModalButton.setAttribute('aria-expanded', 'false');
}

function openAuthPopoverMenu() {
  if (!authPopoverMenu || !openAuthModalButton || !shouldUseAuthenticatedUi()) {
    return;
  }

  authPopoverMenu.classList.add('is-open');
  isAuthPopoverOpen = true;
  openAuthModalButton.setAttribute('aria-expanded', 'true');
}

function toggleAuthPopoverMenu() {
  if (isAuthPopoverOpen) {
    closeAuthPopoverMenu();
    return;
  }

  openAuthPopoverMenu();
}

function openAuthModal() {
  if (!authModal || shouldUseAuthenticatedUi()) {
    return;
  }

  if (!isPasswordRecoveryMode) {
    isAuthRegisterMode = false;
    updateAuthModalMode();
  }

  authModal.classList.add('is-open');
  isAuthModalOpen = true;
  syncBodyScrollLock();

  requestAnimationFrame(() => {
    if (isPasswordRecoveryMode) {
      loginPassword?.focus();
      loginPassword?.select();
      return;
    }

    loginEmail?.focus();
  });
}

async function closeAuthModal() {
  if (!authModal) {
    return;
  }

  const shouldCancelPasswordRecovery = isPasswordRecoveryMode;

  closeAuthPopoverMenu();
  closeDisplayNameModal();
  authModal.classList.remove('is-open');
  isAuthModalOpen = false;
  syncBodyScrollLock();
  resetAuthFormState();

  if (shouldCancelPasswordRecovery) {
    await cancelPasswordRecoveryFlow();
  }
}

function updateAuthModalMode() {
  const submitButton = loginForm?.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  if (isPasswordRecoveryMode) {
    if (loginForm) {
      loginForm.classList.add('is-visible');
    }

    if (authModalTitle) {
      authModalTitle.textContent = 'Сброс пароля';
    }

    if (loginEmail) {
      loginEmail.classList.remove('is-visible');
      loginEmail.disabled = true;
    }

    if (loginPassword) {
      loginPassword.classList.add('is-visible');
      loginPassword.placeholder = 'Новый пароль';
      loginPassword.autocomplete = 'new-password';
    }

    if (registerNicknameInput) {
      registerNicknameInput.classList.remove('is-visible');
      registerNicknameInput.disabled = true;
    }

    if (registerNicknameHint) {
      registerNicknameHint.classList.remove('is-visible');
    }

    if (loginPasswordConfirm) {
      loginPasswordConfirm.classList.add('is-visible');
      loginPasswordConfirm.disabled = isAuthSubmitting;
      loginPasswordConfirm.placeholder = 'Повторите новый пароль';
      loginPasswordConfirm.autocomplete = 'off';
    }

    submitButton.textContent = 'Сохранить новый пароль';

    if (registerButton) {
      registerButton.classList.remove('is-visible');
    }

    if (authFormLinks) {
      authFormLinks.classList.remove('is-visible');
    }

    return;
  }

  if (loginForm) {
    loginForm.classList.toggle('is-visible', !currentUser);
  }

  if (loginEmail) {
    loginEmail.classList.add('is-visible');
    loginEmail.disabled = isAuthSubmitting;
  }

  if (loginPassword) {
    loginPassword.classList.add('is-visible');
    loginPassword.placeholder = 'Пароль';
  }

  if (loginPasswordConfirm) {
    loginPasswordConfirm.classList.remove('is-visible');
    loginPasswordConfirm.disabled = true;
    loginPasswordConfirm.value = '';
    loginPasswordConfirm.autocomplete = 'off';
  }

  if (isAuthRegisterMode) {
    if (authModalTitle) {
      authModalTitle.textContent = 'Регистрация';
    }

    if (loginPassword) {
      loginPassword.autocomplete = 'new-password';
    }

    if (registerNicknameInput) {
      registerNicknameInput.classList.add('is-visible');
      registerNicknameInput.disabled = isAuthSubmitting;
    }

    if (registerNicknameHint) {
      registerNicknameHint.classList.add('is-visible');
    }

    submitButton.textContent = 'Зарегистрироваться';

    if (registerButton) {
      registerButton.classList.add('is-visible');
      registerButton.textContent = 'У меня уже есть аккаунт';
    }

    if (authFormLinks) {
      authFormLinks.classList.remove('is-visible');
    }

    return;
  }

  if (authModalTitle) {
    authModalTitle.textContent = 'Вход';
  }

  if (loginPassword) {
    loginPassword.autocomplete = 'current-password';
  }

  if (registerNicknameInput) {
    registerNicknameInput.classList.remove('is-visible');
    registerNicknameInput.disabled = true;
  }

  if (registerNicknameHint) {
    registerNicknameHint.classList.remove('is-visible');
  }

  submitButton.textContent = 'Войти';

  if (registerButton) {
    registerButton.classList.add('is-visible');
    registerButton.textContent = 'Регистрация';
  }

  if (authFormLinks) {
    authFormLinks.classList.add('is-visible');
  }
}

function openMovieModal() {
  movieModal.classList.add('is-open');
  isModalOpen = true;
  syncBodyScrollLock();

  requestAnimationFrame(() => {
    titleInput.focus();
  });
}

function closeMovieModal() {
  movieModal.classList.remove('is-open');
  isModalOpen = false;
  syncBodyScrollLock();
}

function openFiltersModal() {
  if (!filtersModal) {
    return;
  }

  filtersModal.classList.add('is-open');
  syncBodyScrollLock();
}

function closeFiltersModal() {
  if (!filtersModal) {
    return;
  }

  filtersModal.classList.remove('is-open');
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
  cancelEditButton.classList.remove('is-visible');
  formMessage.textContent = '';

  refreshCustomSelect(releaseMonthInput);
  updateMovieTaxonomyPreview();
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
  setInputValue(synopsisInput, movie.synopsis, 'synopsisInput');
  setInputValue(movieFormatsInput, (movie.formats || []).join('\n'), 'movieFormatsInput');
  setInputValue(movieModifiersInput, (movie.modifiers || []).join('\n'), 'movieModifiersInput');
  setInputValue(movieBroadFamiliesInput, (movie.broad_families || []).join('\n'), 'movieBroadFamiliesInput');
  setInputValue(tagsPerceivedInput, (movie.tags_perceived || []).join('\n'), 'tagsPerceivedInput');
  setInputValue(tagsCanonInput, (movie.tags_canon || []).join('\n'), 'tagsCanonInput');
  setInputValue(movieTriggersInput, (movie.triggers || []).join('\n'), 'movieTriggersInput');

  formTitle.textContent = `Редактирование: ${movie.title}`;
  submitButton.textContent = 'Сохранить изменения';
  cancelEditButton.classList.add('is-visible');
  formMessage.textContent = '';

  refreshCustomSelect(releaseMonthInput);
  updateMovieTaxonomyPreview();

  openMovieModal();
}

/* =========================================================
JS-БЛОК 8. УПРАВЛЕНИЕ AUTH-ИНТЕРФЕЙСОМ
Показывает или скрывает форму входа и админские элементы
в зависимости от статуса пользователя.
========================================================== */
function updateAuthUI() {
  const shouldShowAuthenticatedUi = shouldUseAuthenticatedUi();

  syncAuthIconButtonState();
  syncDisplayNameButton();

  if (!shouldShowAuthenticatedUi) {
    closeAuthPopoverMenu();
    closeDisplayNameModal();
  }

  if (loginForm) {
    loginForm.classList.toggle('is-visible', !shouldShowAuthenticatedUi);
  }

  if (adminPanel) {
    initTaxonomyExportButton();
    adminPanel.classList.toggle('is-visible', shouldShowAuthenticatedUi && isAdmin);
  }

  if (moviePageAdminActions) {
    moviePageAdminActions.classList.toggle('is-visible', shouldShowAuthenticatedUi && isAdmin && isMoviePage());
  }

  if (shouldShowAuthenticatedUi) {
    closeAuthModal();
  }

  updateAuthModalMode();

  if (authControls) {
    authControls.classList.remove('auth-controls-pending');
  }

  let didResetUserOnlyCatalogFilters = false;

  if (watchlistFilterRow && watchlistFilter) {
    watchlistFilterRow.classList.toggle('is-visible', shouldShowAuthenticatedUi);

    if (!shouldShowAuthenticatedUi) {
      didResetUserOnlyCatalogFilters = didResetUserOnlyCatalogFilters || watchlistFilter.value !== '';
      watchlistFilter.value = '';
      refreshCustomSelect(watchlistFilter);
    }
  }

  if (watchedFilterRow && watchedFilter) {
    watchedFilterRow.classList.toggle('is-visible', shouldShowAuthenticatedUi);

    if (!shouldShowAuthenticatedUi) {
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
  subgenreFilter,
  formatFilter,
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
function refreshGenreFilterOptions() {
  if (!genreFilter) {
    return;
  }

  const selectedGenre = genreFilter.value || '';
  const genreCounts = getGenreOptionCounts();

  genreFilter.innerHTML = '<option value="">Все доп. жанры</option>';

  allGenreNames.forEach(genreName => {
    const option = document.createElement('option');
    option.value = genreName;
    option.textContent = `${genreName} (${genreCounts.get(genreName) || 0})`;
    option.disabled = (genreCounts.get(genreName) || 0) === 0 && genreName !== selectedGenre;
    genreFilter.appendChild(option);
  });

  genreFilter.value = selectedGenre;
  refreshCustomSelect(genreFilter);
}

async function loadGenres() {
  const { data, error } = await supabaseClient
    .from('genres')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Ошибка загрузки жанров:', error);
    return;
  }

  allGenreNames = (data || [])
    .map(item => item.name)
    .filter(Boolean)
    .filter(name => normalizeSearchText(name) !== 'ужасы');

  refreshGenreFilterOptions();
}

function loadSubgenreFilterOptions() {
  if (!subgenreFilter) {
    return;
  }

  const selectedSubgenre = subgenreFilter.value || '';
  const subgenreKeys = window.HORROR_TAXONOMY?.subgenres || [];
  const subgenreCounts = getSubgenreOptionCounts();

  subgenreFilter.innerHTML = '<option value="">Все</option>';

  subgenreKeys
    .map(subgenreKey => ({
      key: subgenreKey,
      count: subgenreCounts.get(subgenreKey) || 0,
      label: getTaxonomyLabel('subgenres', subgenreKey)
    }))
    .filter(item => item.count > 0 || item.key === selectedSubgenre)
    .sort((firstItem, secondItem) => {
      if (secondItem.count !== firstItem.count) {
        return secondItem.count - firstItem.count;
      }

      return firstItem.label.localeCompare(secondItem.label, 'ru');
    })
    .forEach(item => {
      const option = document.createElement('option');
      option.value = item.key;
      option.textContent = `${item.label} (${item.count})`;
      subgenreFilter.appendChild(option);
    });

  subgenreFilter.value = selectedSubgenre;
  refreshCustomSelect(subgenreFilter);
}

function loadFormatFilterOptions() {
  if (!formatFilter) {
    return;
  }

  const selectedFormat = formatFilter.value || '';
  const formatKeys = window.HORROR_TAXONOMY?.formats || [];
  const formatCounts = getFormatOptionCounts();

  formatFilter.innerHTML = '<option value="">Все</option>';

  formatKeys
    .map(formatKey => ({
      key: formatKey,
      count: formatCounts.get(formatKey) || 0,
      label: getTaxonomyLabel('formats', formatKey)
    }))
    .sort((firstItem, secondItem) => {
      if (secondItem.count !== firstItem.count) {
        return secondItem.count - firstItem.count;
      }

      return firstItem.label.localeCompare(secondItem.label, 'ru');
    })
    .forEach(item => {
      const option = document.createElement('option');
      option.value = item.key;
      option.textContent = `${item.label} (${item.count})`;
      option.disabled = item.count === 0 && item.key !== selectedFormat;
      formatFilter.appendChild(option);
    });

  formatFilter.value = selectedFormat;
  refreshCustomSelect(formatFilter);
}

function loadTriggerFilterOptions() {
  if (!triggerFiltersGroup) {
    return;
  }

  const selectedTriggerKeys = getSelectedTriggerFilters();
  const taxonomyTriggerKeys = window.HORROR_TAXONOMY?.triggers || [];
  const triggerCounts = getTriggerOptionCounts();
  const actualTriggerKeys = Array.from(triggerCounts.keys());
  const triggerKeys = [...new Set([...taxonomyTriggerKeys, ...actualTriggerKeys])];

  triggerFiltersGroup.innerHTML = triggerKeys
    .map(triggerKey => ({
      key: triggerKey,
      count: triggerCounts.get(triggerKey) || 0,
      label: getTaxonomyLabel('triggers', triggerKey),
      isSelected: selectedTriggerKeys.includes(triggerKey)
    }))
    .filter(item => item.count > 0 || item.isSelected)
    .sort((firstItem, secondItem) => {
      if (secondItem.count !== firstItem.count) {
        return secondItem.count - firstItem.count;
      }

      return firstItem.label.localeCompare(secondItem.label, 'ru');
    })
    .map(item => `
      <label class="trigger-filter-option">
        <input
          type="checkbox"
          value="${escapeHtml(item.key)}"
          data-trigger-filter="true"
          ${item.isSelected ? 'checked' : ''}
        >
        <span class="trigger-filter-option-label">
          <span class="trigger-filter-option-text">${escapeHtml(item.label)}</span>
          <span class="trigger-filter-option-count">(${item.count})</span>
        </span>
      </label>
    `)
    .join('');

  syncTriggerFiltersTriggerText();
}

function refreshCountryFilterOptions() {
  if (!countryFilter) {
    return;
  }

  const selectedCountry = countryFilter.value || '';
  const countryCounts = getCountryOptionCounts();

  countryFilter.innerHTML = '<option value="">Все</option>';

  allCountryNames.forEach(countryName => {
    const option = document.createElement('option');
    option.value = countryName;
    option.textContent = `${countryName} (${countryCounts.get(countryName) || 0})`;
    option.disabled = (countryCounts.get(countryName) || 0) === 0 && countryName !== selectedCountry;
    countryFilter.appendChild(option);
  });

  countryFilter.value = selectedCountry;
  refreshCustomSelect(countryFilter);
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

  allCountryNames = (data || [])
    .map(item => item.name)
    .filter(Boolean);

  refreshCountryFilterOptions();
}

function loadYearFilterOptions() {
  if (!yearFilter) {
    return;
  }

  const selectedYear = yearFilter.value || '';
  const yearCounts = getYearOptionCounts();

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
    option.textContent = `${year} (${yearCounts.get(Number(year)) || 0})`;
    option.disabled = (yearCounts.get(Number(year)) || 0) === 0 && String(year) !== selectedYear;
    yearFilter.appendChild(option);
  });

  yearFilter.value = selectedYear;
  refreshCustomSelect(yearFilter);
}

/* =========================================================
JS-БЛОК 10. ЗАГРУЗКА ДАННЫХ КАТАЛОГА
Получает фильмы и пользовательские оценки из Supabase.
========================================================== */
const MOVIE_BASE_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  director,
  synopsis,
  formats,
  modifiers,
  broad_families,
  mask_conflict,
  primary_subgenre,
  secondary_subgenres,
  tags_perceived,
  tags_canon,
  triggers,
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
`;

async function fetchMovies() {
  const { data, error } = await supabaseClient
    .from('movies')
    .select(MOVIE_BASE_SELECT)
    .order('title', { ascending: true })
    .order('position', { foreignTable: 'movie_genres', ascending: true });

    if (error) {
      moviesLoadedSuccessfully = false;
      console.error('Ошибка загрузки фильмов:', error);
  
      if (container) {
        container.innerHTML = 'Ошибка загрузки фильмов. Открой консоль F12.';
      }
  
      return;
    }

  allMovies = data || [];
  moviesLoadedSuccessfully = true;
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
  if (!shouldUseAuthenticatedUi()) {
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

async function fetchMovieReviews(movieId) {
  if (!movieId) {
    allMovieReviews = [];
    return;
  }

  const { data, error } = await supabaseClient
    .from('movie_reviews')
    .select(`
      id,
      movie_id,
      user_id,
      review_text,
      contains_spoilers,
      created_at,
      updated_at
    `)
    .eq('movie_id', movieId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Ошибка загрузки рецензий:', error);
    allMovieReviews = [];
    return;
  }

  const reviews = data || [];
  const uniqueUserIds = [...new Set(
    reviews
      .map(review => review.user_id)
      .filter(Boolean)
  )];

  let profilesMap = new Map();

  if (uniqueUserIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, display_name, default_display_name')
      .in('id', uniqueUserIds);

    if (profilesError) {
      console.error('Ошибка загрузки профилей авторов рецензий:', profilesError);
    } else {
      profilesMap = new Map(
        (profilesData || []).map(profile => [String(profile.id), profile])
      );
    }
  }

  allMovieReviews = reviews.map(review => ({
    ...review,
    profiles: profilesMap.get(String(review.user_id)) || null
  }));
}

async function reloadMoviePageData(movieId) {
  if (!movieId) {
    return null;
  }

  await Promise.all([
    fetchMovieRatings(),
    fetchMovieWatchlist(),
    fetchMovieReviews(movieId)
  ]);

  return fetchMovieById(movieId);
}

async function refreshMovieReviewsAfterMutation(movieId, reviewIdToCollapse = null) {
  if (reviewIdToCollapse) {
    setMovieReviewExpandedState(reviewIdToCollapse, false);
    setMovieReviewTextExpandedState(reviewIdToCollapse, false);
  }

  await fetchMovieReviews(movieId);
}

async function saveMovieReview(movieId, { reviewText, containsSpoilers = false }) {
  const activeUser = ensureActiveSessionForWrite();
  const normalizedReviewText = normalizeMovieReviewText(reviewText);

  if (!movieId) {
    throw new Error('Не найден фильм для сохранения рецензии.');
  }

  if (!normalizedReviewText) {
    throw new Error('Текст рецензии не должен быть пустым.');
  }

  if (normalizedReviewText.length < 80) {
    throw new Error('Рецензия должна содержать не менее 80 символов.');
  }

  if (normalizedReviewText.length > 5000) {
    throw new Error('Рецензия не должна превышать 5000 символов.');
  }

  const { error } = await supabaseClient
    .from('movie_reviews')
    .upsert(
      {
        movie_id: movieId,
        user_id: activeUser.id,
        review_text: normalizedReviewText,
        contains_spoilers: Boolean(containsSpoilers)
      },
      {
        onConflict: 'movie_id,user_id'
      }
    );

  throwIfSupabaseError(error);
  await refreshMovieReviewsAfterMutation(movieId);
}

async function removeMovieReview(reviewId, movieId) {
  if (!reviewId) {
    throw new Error('Не найдена рецензия для удаления.');
  }

  ensureActiveSessionForWrite();

  const { error } = await supabaseClient
    .from('movie_reviews')
    .delete()
    .eq('id', reviewId);

  throwIfSupabaseError(error);
  await refreshMovieReviewsAfterMutation(movieId, reviewId);
}

async function reloadCatalogData({ showSkeleton = false } = {}) {
  const shouldShowCatalogSkeleton = showSkeleton && Boolean(container);

  shouldFadeCatalogAfterSkeleton = shouldShowCatalogSkeleton;

  if (shouldShowCatalogSkeleton) {
    renderMoviesSkeleton(getCatalogSkeletonCardsCount());
  }

  await Promise.all([
    fetchMovies(),
    fetchMovieRatings(),
    fetchMovieWatchlist()
  ]);

  await Promise.all([
    loadGenres(),
    loadCountries()
  ]);

  refreshDynamicFilterOptions();
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
  if (!watchlistFilter) {
    return false;
  }

  return Boolean(watchlistFilter.value);
}

function shouldRenderFullCatalogAfterRatingChange() {
  if (!watchedFilter || !watchlistFilter || !ratingFilter) {
    return false;
  }

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
    searchClearBtn.classList.remove('is-visible');
  }

  saveCatalogState();
}

function resetFilterControls({ preserveSearch = false } = {}) {
  if (!preserveSearch) {
    clearSearchInput();
  }

  genreFilter.value = '';
  subgenreFilter.value = '';
  formatFilter.value = '';
  countryFilter.value = '';
  ratingFilter.value = '';
  yearFilter.value = '';
  watchlistFilter.value = '';
  watchedFilter.value = '';

  if (triggerFiltersGroup) {
    triggerFiltersGroup
      .querySelectorAll('input[type="checkbox"][data-trigger-filter]')
      .forEach(input => {
        input.checked = false;
      });
  }

  refreshCustomSelectGroup(
    filterCustomSelectElements.filter(selectElement => selectElement !== sortMode)
  );

  syncTriggerFiltersTriggerText();
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
  const hasSubgenreFilter = Boolean(subgenreFilter.value);
  const hasFormatFilter = Boolean(formatFilter.value);
  const hasTriggerFilters = getSelectedTriggerFilters().length > 0;
  const hasCountryFilter = Boolean(countryFilter.value);
  const hasYearFilter = Boolean(yearFilter.value);

  if (hasSearchQuery || hasGenreFilter || hasSubgenreFilter || hasFormatFilter || hasTriggerFilters || hasCountryFilter || hasYearFilter) {
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

    button.classList.toggle('is-hidden-by-auth', shouldHide);
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

  if (subgenreFilter.value) {
    chips.push({
      label: `Поджанр: ${getTaxonomyLabel('subgenres', subgenreFilter.value)}`,
      key: 'subgenre'
    });
  }

  if (formatFilter.value) {
    chips.push({
      label: `Формат: ${getTaxonomyLabel('formats', formatFilter.value)}`,
      key: 'format'
    });
  }

  getSelectedTriggerFilters().forEach(triggerKey => {
    chips.push({
      label: `Исключить: ${getTaxonomyLabel('triggers', triggerKey)}`,
      key: `trigger:${triggerKey}`
    });
  });

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

  filtersModalStatus.classList.add('is-visible');
  filtersModalStatus.classList.toggle('is-active', hasActiveFilters);
  resetFiltersTopButton.classList.toggle('is-visible', hasActiveFilters);
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

  if (filterKey === 'subgenre') {
    subgenreFilter.value = '';
    refreshCustomSelect(subgenreFilter);
  }

  if (filterKey === 'format') {
    formatFilter.value = '';
    refreshCustomSelect(formatFilter);
  }

  if (filterKey.startsWith('trigger:')) {
    const triggerKey = filterKey.slice('trigger:'.length);

    if (triggerFiltersGroup) {
      const triggerInput = triggerFiltersGroup.querySelector(
        `input[type="checkbox"][data-trigger-filter][value="${CSS.escape(triggerKey)}"]`
      );

      if (triggerInput) {
        triggerInput.checked = false;
      }
    }
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

  syncTriggerFiltersTriggerText();
  saveCatalogStateAndRenderFilters();

  // Если модалка фильтров была открыта, после снятия фильтра закрываем её,
  // чтобы внешняя очистка состояния ощущалась завершённым действием.
  if (filtersModal && filtersModal.classList.contains('is-open')) {
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
    activeFiltersBar.classList.remove('is-visible');
    activeFiltersBar.innerHTML = '';
    return;
  }

  activeFiltersBar.classList.add('is-visible');
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
  const synopsis = synopsisInput.value.trim();
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
  const taxonomyDraft = buildMovieTaxonomyDraftFromForm();

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
          slug: await buildUniqueMovieSlug(title, year ? Number(year) : null),
          original_title: originalTitle || null,
          year: year ? Number(year) : null,
          director: director || null,
          synopsis: synopsis || null,
          formats: taxonomyDraft.formats,
          modifiers: taxonomyDraft.modifiers,
          broad_families: taxonomyDraft.broadFamilies,
          primary_subgenre: taxonomyDraft.primarySubgenre,
          secondary_subgenres: taxonomyDraft.secondarySubgenres,
          tags_perceived: taxonomyDraft.tagsPerceived,
          tags_canon: taxonomyDraft.tagsCanon,
          triggers: taxonomyDraft.triggers,
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
        .select('id, slug') // сразу забираем id и slug созданной записи
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

    if (isCatalogPage()) {
      setMovieFormStatus('Обновляю каталог...');
      await withPendingRequestTimeout(
        reloadCatalogData({ showSkeleton: true }),
        15000,
        'Превышено время ожидания обновления каталога.'
      ); // сначала дожидаемся полной синхронизации состояния каталога

      rerenderCatalogAfterDataReload(insertedMovie.id);
      resetFormToCreateMode();
      closeMovieModal();
    } else if (isMoviePage()) {
      window.location.href = buildMoviePageUrl(insertedMovie);
      return;
    }
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
  const synopsis = synopsisInput.value.trim();
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
  const taxonomyDraft = buildMovieTaxonomyDraftFromForm();

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  const existingMovie = allMovies.find(movie => movie.id === editingMovieId)
    || (currentMoviePageMovieData && currentMoviePageMovieData.id === editingMovieId
      ? currentMoviePageMovieData
      : null);

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

    if ((synopsis || null) !== (existingMovie.synopsis ?? null)) {
      changedFields.synopsis = synopsis || null;
    }

    if (!areStringArraysEqual(taxonomyDraft.formats, existingMovie.formats || [])) {
      changedFields.formats = taxonomyDraft.formats;
    }

    if (!areStringArraysEqual(taxonomyDraft.modifiers, existingMovie.modifiers || [])) {
      changedFields.modifiers = taxonomyDraft.modifiers;
    }

    if (!areStringArraysEqual(taxonomyDraft.broadFamilies, existingMovie.broad_families || [])) {
      changedFields.broad_families = taxonomyDraft.broadFamilies;
    }

    if ((taxonomyDraft.primarySubgenre || null) !== (existingMovie.primary_subgenre ?? null)) {
      changedFields.primary_subgenre = taxonomyDraft.primarySubgenre;
    }

    if (!areStringArraysEqual(taxonomyDraft.secondarySubgenres, existingMovie.secondary_subgenres || [])) {
      changedFields.secondary_subgenres = taxonomyDraft.secondarySubgenres;
    }

    if (!areStringArraysEqual(taxonomyDraft.tagsPerceived, existingMovie.tags_perceived || [])) {
      changedFields.tags_perceived = taxonomyDraft.tagsPerceived;
    }

    if (!areStringArraysEqual(taxonomyDraft.tagsCanon, existingMovie.tags_canon || [])) {
      changedFields.tags_canon = taxonomyDraft.tagsCanon;
    }

    if (!areStringArraysEqual(taxonomyDraft.triggers, existingMovie.triggers || [])) {
      changedFields.triggers = taxonomyDraft.triggers;
    }

    const currentYearValue = year ? Number(year) : null;
    const shouldRegenerateSlug = (
      !existingMovie.slug ||
      title !== (existingMovie.title ?? '') ||
      currentYearValue !== (existingMovie.year ?? null)
    );

    if (shouldRegenerateSlug) {
      const nextSlug = await buildUniqueMovieSlug(title, currentYearValue, editingMovieId);

      if (nextSlug !== (existingMovie.slug ?? null)) {
        changedFields.slug = nextSlug;
      }
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

    if (isCatalogPage()) {
      setMovieFormStatus('Обновляю каталог...');
      await withPendingRequestTimeout(
        reloadCatalogData({ showSkeleton: true }),
        15000,
        'Превышено время ожидания обновления каталога.'
      );

      rerenderCatalogAfterDataReload(editingMovieId);
    } else if (isMoviePage()) {
      setMovieFormStatus('Обновляю страницу фильма...');

      const updatedMovie = await withPendingRequestTimeout(
        reloadMoviePageData(editingMovieId),
        15000,
        'Превышено время ожидания обновления страницы фильма.'
      );

      if (updatedMovie) {
        const nextMoviePageUrl = buildMoviePageUrl(updatedMovie);

        if (window.location.pathname.endsWith('movie.html')) {
          window.history.replaceState({}, '', nextMoviePageUrl);
        }

        renderMoviePage(updatedMovie);
      } else {
        renderMoviePageNotFound();
      }
    }

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
async function deleteMovieRecord(movieId) {
  const { error } = await supabaseClient
    .from('movies')
    .delete()
    .eq('id', movieId);

  throwIfSupabaseError(error);
}

async function deleteMovie(movieId, movieTitle) {
  try {
    await runConfirmedAction(`Удалить фильм "${movieTitle}"?`, async () => {
      await deleteMovieRecord(movieId);

      if (editingMovieId === movieId) {
        resetFormToCreateMode();
      }

      await reloadCatalogData({ showSkeleton: true });
      rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);

      setMovieFormStatus(`Фильм "${movieTitle}" удалён.`);
    });
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

  const hasPendingRecovery = Boolean(localStorage.getItem(PASSWORD_RECOVERY_PENDING_KEY));
  const hasForeignRecoverySession = (
    Boolean(data.session?.user) &&
    hasPendingRecovery &&
    !isPasswordRecoveryEntryPage
  );

  if (hasForeignRecoverySession) {
    await clearLocalRecoverySession();
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
    errorText.includes('over_email_send_rate_limit') ||
    errorText.includes('for security purposes') ||
    errorText.includes('can only request this after')
  ) {
    if (
      errorText.includes('email rate limit exceeded') ||
      errorText.includes('over_email_send_rate_limit') ||
      errorText.includes('for security purposes') ||
      errorText.includes('can only request this after')
    ) {
      return 'Слишком частые запросы. Подожди немного и попробуй снова.';
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
    errorText.includes('new password should be different') ||
    errorText.includes('same as the old password')
  ) {
    return 'Новый пароль должен отличаться от предыдущего.';
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

async function isDisplayNameAvailable(displayName, excludeUserId = null) {
  const normalizedDisplayName = normalizeDisplayNameValue(displayName);

  let query = supabaseClient
    .from('profiles')
    .select('id')
    .eq('display_name_normalized', normalizedDisplayName);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    throw error;
  }

  return !data || data.length === 0;
}

async function saveDisplayName(event) {
  event?.preventDefault();

  if (!currentUser || isDisplayNameSubmitting || !displayNameInput) {
    return;
  }

  const nextDisplayName = displayNameInput.value.trim();
  const normalizedNextDisplayName = normalizeDisplayNameValue(nextDisplayName);
  const currentDisplayName = getCurrentDisplayName();
  const normalizedCurrentDisplayName = normalizeDisplayNameValue(currentDisplayName);

  if (!nextDisplayName) {
    setDisplayNameMessage('Введите никнейм.', 'error');
    displayNameInput.focus();
    return;
  }

  if (!isValidDisplayNameValue(nextDisplayName)) {
    setDisplayNameMessage('Никнейм должен быть длиной от 3 до 24 символов и содержать только буквы, цифры или _.', 'error');
    displayNameInput.focus();
    return;
  }

  if (normalizedNextDisplayName === normalizedCurrentDisplayName) {
    closeDisplayNameModal();
    return;
  }

  isDisplayNameSubmitting = true;
  setDisplayNameMessage('Сохраняю...');

  if (saveDisplayNameButton) {
    saveDisplayNameButton.disabled = true;
  }

  if (cancelDisplayNameButton) {
    cancelDisplayNameButton.disabled = true;
  }

  if (displayNameInput) {
    displayNameInput.disabled = true;
  }

  try {
    const isAvailable = await isDisplayNameAvailable(nextDisplayName, currentUser.id);

    if (!isAvailable) {
      setDisplayNameMessage('Этот никнейм уже занят. Выберите другой.', 'error');
      return;
    }

    const { error: authError } = await supabaseClient.auth.updateUser({
      data: {
        ...(currentUser.user_metadata || {}),
        display_name: nextDisplayName
      }
    });

    if (authError) {
      console.error('Ошибка обновления user_metadata.display_name:', authError);
      setDisplayNameMessage('Не удалось обновить никнейм. Попробуйте ещё раз.', 'error');
      return;
    }

    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        display_name: nextDisplayName
      })
      .eq('id', currentUser.id);

    if (profileError) {
      console.error('Ошибка обновления profiles.display_name:', profileError);
      setDisplayNameMessage('Не удалось сохранить никнейм в профиле. Попробуйте ещё раз.', 'error');
      return;
    }

    await updateCurrentUserDisplayName(nextDisplayName);
    setDisplayNameMessage('Никнейм обновлён.', 'success');

    setTimeout(() => {
      closeDisplayNameModal();
    }, 500);
  } finally {
    isDisplayNameSubmitting = false;

    if (saveDisplayNameButton) {
      saveDisplayNameButton.disabled = false;
    }

    if (cancelDisplayNameButton) {
      cancelDisplayNameButton.disabled = false;
    }

    if (displayNameInput) {
      displayNameInput.disabled = false;
    }
  }
}

async function sendPasswordResetEmail() {
  if (isAuthSubmitting) {
    return;
  }

  const email = loginEmail.value.trim();

  if (!email) {
    showAuthMessage('Сначала введи e-mail, на который нужно отправить письмо для сброса пароля.', 'error');
    loginEmail.focus();
    return;
  }

  loginPassword.value = '';

  setAuthSubmittingState(true);
  showAuthMessage('Отправляю письмо для сброса пароля...');

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });

    if (error) {
      console.error('Ошибка отправки письма для сброса пароля:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Не удалось отправить письмо для сброса пароля. Попробуй позже.'),
        'error'
      );
      return;
    }

    localStorage.setItem(PASSWORD_RECOVERY_PENDING_KEY, '1');

    showAuthMessage(
      'Если такой e-mail существует, мы отправили письмо со ссылкой для сброса пароля.',
      'success'
    );
  } finally {
    setAuthSubmittingState(false);
  }
}

async function saveNewPassword() {
  if (isAuthSubmitting) {
    return;
  }

  const nextPassword = loginPassword.value;
  const confirmedPassword = loginPasswordConfirm?.value || '';

  if (!nextPassword) {
    showAuthMessage('Введи новый пароль.', 'error');
    loginPassword.focus();
    return;
  }

  if (!confirmedPassword) {
    showAuthMessage('Повтори новый пароль во втором поле.', 'error');
    loginPasswordConfirm.focus();
    return;
  }

  if (nextPassword !== confirmedPassword) {
    showAuthMessage('Пароли не совпадают. Проверь ввод и попробуй снова.', 'error');
    loginPasswordConfirm.focus();
    loginPasswordConfirm.select();
    return;
  }

  setAuthSubmittingState(true);
  showAuthMessage('Сохраняю новый пароль...');

  try {
    const { error } = await supabaseClient.auth.updateUser({
      password: nextPassword
    });

    if (error) {
      console.error('Ошибка сохранения нового пароля:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Не удалось сохранить новый пароль. Попробуй ещё раз.'),
        'error'
      );
      return;
    }

    localStorage.removeItem(PASSWORD_RECOVERY_PENDING_KEY);
    isPasswordRecoveryEntryPage = false;
    clearEmailConfirmationParamsFromUrl();

    showAuthMessage('Новый пароль сохранён. Теперь войди с ним заново.', 'success', true);

    setTimeout(async () => {
      try {
        await supabaseClient.auth.signOut({ scope: 'local' });
      } catch (error) {
        console.error('Ошибка завершения recovery-сессии:', error);
      }

      closeAuthModal();
    }, 900);
  } finally {
    setAuthSubmittingState(false);
  }
}

async function login(event) {
  event.preventDefault();

  if (isPasswordRecoveryMode) {
    await saveNewPassword();
    return;
  }

  if (isAuthRegisterMode) {
    await register();
    return;
  }

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

    setTimeout(() => {
      closeAuthModal();
    }, 300);
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
    const registerNickname = registerNicknameInput?.value.trim() || '';

    if (!email || !password) {
      showAuthMessage('Введи email и пароль для регистрации.', 'error');
      return;
    }

    if (registerNickname) {
      if (!isValidDisplayNameValue(registerNickname)) {
        showAuthMessage('Никнейм должен быть длиной от 3 до 24 символов и содержать только буквы, цифры или _.', 'error');
        registerNicknameInput.focus();
        return;
      }

      const isNicknameAvailable = await isDisplayNameAvailable(registerNickname);

      if (!isNicknameAvailable) {
        showAuthMessage('Этот никнейм уже занят. Выбери другой.', 'error');
        registerNicknameInput.focus();
        registerNicknameInput.select();
        return;
      }
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: registerNickname || null
        }
      }
    });

    if (error) {
      console.error('Ошибка регистрации:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Ошибка регистрации. Проверь e-mail, пароль и никнейм.'),
        'error'
      );
      return;
    }

    loginPassword.value = '';
    setAuthRegisterMode(false);
    loginEmail.focus();

    showAuthMessage(
      'Если аккаунт можно зарегистрировать, мы отправили письмо для завершения регистрации.',
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
  if (!container) {
    return;
  }

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

  const originalAriaLabel = buttonElement.getAttribute('aria-label') || '';
  const originalTitle = buttonElement.getAttribute('title') || '';

  buttonElement.dataset.deleteArmed = 'true';
  buttonElement.dataset.deleteOriginalAriaLabel = originalAriaLabel;
  buttonElement.dataset.deleteOriginalTitle = originalTitle;
  buttonElement.classList.add('is-delete-confirm');
  buttonElement.setAttribute('aria-label', 'Подтвердить удаление');
  buttonElement.setAttribute('title', 'Нажмите ещё раз, чтобы удалить');

  const resetDeleteButton = () => {
    buttonElement.dataset.deleteArmed = 'false';
    buttonElement.classList.remove('is-delete-confirm');

    if (buttonElement.dataset.deleteOriginalAriaLabel !== undefined) {
      buttonElement.setAttribute('aria-label', buttonElement.dataset.deleteOriginalAriaLabel);
      delete buttonElement.dataset.deleteOriginalAriaLabel;
    }

    if (buttonElement.dataset.deleteOriginalTitle !== undefined) {
      buttonElement.setAttribute('title', buttonElement.dataset.deleteOriginalTitle);
      delete buttonElement.dataset.deleteOriginalTitle;
    }

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
  if (!container && moviePage && currentMoviePageMovieId === movieId) {
    reloadMoviePageData(movieId)
      .then(movie => {
        if (!movie) {
          renderMoviePageNotFound();
          return;
        }

        renderMoviePage(movie);
      })
      .catch(error => {
        console.error('Ошибка перерендера страницы фильма:', error);
        renderMoviePageNotFound();
      });

    return;
  }

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
    }
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
  mobileRatingModal.className = 'mobile-rating-modal modal';

  mobileRatingModal.innerHTML = `
    <div class="modal-backdrop mobile-rating-modal-backdrop" data-mobile-rating-close="true"></div>
    <div
      class="modal-dialog mobile-rating-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobileRatingModalTitle"
    >
      <div class="modal-header">
        <h2 id="mobileRatingModalTitle" class="mobile-rating-modal-title"></h2>
        <button
          type="button"
          class="modal-close-button mobile-rating-modal-close"
          data-mobile-rating-close="true"
          aria-label="Закрыть"
        ></button>
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

  const pageRoot = document.querySelector('.page') || document.body;
  pageRoot.appendChild(mobileRatingModal);

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
      mobileRatingModal.classList.remove('is-open');
      syncBodyScrollLock();
    }
  }, 220);

  mobileRatingModalMovieId = null;
}

function openMobileRatingModal(movie) {
  if (!currentUser) {
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

  mobileRatingModalRemoveButton.classList.toggle('is-visible', hasCurrentUserRating);

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

  mobileRatingModal.classList.add('is-open');

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
  if (!container) {
    return 8;
  }

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

function extractImdbTitleId(url) {
  const match = String(url || '').match(/imdb\.com\/title\/(tt\d+)/i);
  return match ? match[1] : null;
}

function extractKinopoiskFilmId(url) {
  const match = String(url || '').match(/kinopoisk\.ru\/film\/(\d+)/i);
  return match ? match[1] : null;
}

function getMoviePageExternalLinksHtml(movie) {
  const imdbTitleId = extractImdbTitleId(movie.imdb_url);
  const kinopoiskFilmId = extractKinopoiskFilmId(movie.kinopoisk_url);

  const ratingLinks = [];

  if (imdbTitleId && movie.imdb_url) {
    ratingLinks.push(`
      <a
        href="${movie.imdb_url}"
        class="movie-rating-widget-link movie-rating-widget-link-imdb"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Открыть рейтинг IMDb"
        title="IMDb"
      >
        <img
          src="https://imdb.desol.one/${imdbTitleId}.png"
          alt="Рейтинг IMDb"
          class="movie-rating-widget-image"
          loading="lazy"
        >
      </a>
    `);
  }

  if (kinopoiskFilmId && movie.kinopoisk_url) {
    ratingLinks.push(`
      <a
        href="${movie.kinopoisk_url}"
        class="movie-rating-widget-link movie-rating-widget-link-kinopoisk"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Открыть рейтинг Кинопоиска"
        title="Кинопоиск"
      >
        <img
          src="https://www.kinopoisk.ru/rating/${kinopoiskFilmId}.gif"
          alt="Рейтинг Кинопоиска"
          class="movie-rating-widget-image"
          loading="lazy"
        >
      </a>
    `);
  }

  const fallbackLinks = [
    imdbTitleId ? null : (movie.imdb_url ? {
      url: movie.imdb_url,
      label: 'IMDb',
      type: 'imdb',
      className: 'is-imdb'
    } : null),
    kinopoiskFilmId ? null : (movie.kinopoisk_url ? {
      url: movie.kinopoisk_url,
      label: 'Кинопоиск',
      type: 'kinopoisk',
      className: 'is-kinopoisk'
    } : null),
    movie.letterboxd_url ? {
      url: movie.letterboxd_url,
      label: 'Letterboxd',
      type: 'letterboxd',
      className: 'is-letterboxd'
    } : null,
    movie.rottentomatoes_url ? {
      url: movie.rottentomatoes_url,
      label: 'Rotten Tomatoes',
      type: 'rottentomatoes',
      className: 'is-rottentomatoes'
    } : null
  ].filter(Boolean);

  const fallbackLinksHtml = fallbackLinks.length > 0
    ? `
      <div class="movie-external-links" aria-label="Ссылки на карточки фильма">
        ${fallbackLinks.map(link => `
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
    `
    : '';

  if (ratingLinks.length === 0 && !fallbackLinksHtml) {
    return '';
  }

  return `
    <div class="movie-page-external-links-mixed">
      ${
        ratingLinks.length > 0
          ? `
            <div class="movie-rating-widgets" aria-label="Рейтинги киноагрегаторов">
              ${ratingLinks.join('')}
            </div>
          `
          : ''
      }
      ${fallbackLinksHtml}
    </div>
  `;
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
      <a href="${buildMoviePageUrl(movie)}" class="movie-poster-link" aria-label="Открыть страницу фильма ${escapeHtml(movie.title)}">
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
      </a>
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
  if (!container) {
    return;
  }

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

    <h5 class="movie-title">
      <a href="${buildMoviePageUrl(movie)}" class="movie-title-link">${highlightSearchMatches(movie.title, searchInput.value)}</a>
    </h5>

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

    watchlistToggleBtn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
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

function getFilteredMovies(options = {}) {
  const {
    ignoreGenre = false,
    ignoreSubgenre = false,
    ignoreFormat = false,
    ignoreCountry = false,
    ignoreYear = false,
    ignoreTriggerExcludes = false,
    skipSorting = false
  } = options;

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

  if (!ignoreGenre && selectedGenre) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.movie_genres.some(item => item.genres.name === selectedGenre)
    );
  }

  if (!ignoreSubgenre && subgenreFilter.value) {
    filteredMovies = filteredMovies.filter(movie => {
      const movieSubgenreKeys = [
        movie.primary_subgenre,
        ...(Array.isArray(movie.secondary_subgenres) ? movie.secondary_subgenres : [])
      ].filter(Boolean);

      return movieSubgenreKeys.includes(subgenreFilter.value);
    });
  }

  if (!ignoreFormat && formatFilter.value) {
    filteredMovies = filteredMovies.filter(movie =>
      Array.isArray(movie.formats) && movie.formats.includes(formatFilter.value)
    );
  }

  const selectedTriggerExcludes = ignoreTriggerExcludes
    ? []
    : getSelectedTriggerFilters();

  if (selectedTriggerExcludes.length > 0) {
    filteredMovies = filteredMovies.filter(movie => {
      const movieTriggers = Array.isArray(movie.triggers) ? movie.triggers : [];

      return !selectedTriggerExcludes.some(triggerKey => movieTriggers.includes(triggerKey));
    });
  }

  if (!ignoreCountry && selectedCountry) {
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

  if (!ignoreYear && selectedYear) {
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

  if (!skipSorting) {
    sortMovies(filteredMovies, selectedSortMode);
  }

  return filteredMovies;
}

function getGenreOptionCounts() {
  const moviesWithoutGenreFilter = getFilteredMovies({
    ignoreGenre: true,
    skipSorting: true
  });

  const counts = new Map();

  moviesWithoutGenreFilter.forEach(movie => {
    const movieGenres = Array.isArray(movie.movie_genres) ? movie.movie_genres : [];

    movieGenres.forEach(item => {
      const genreName = item?.genres?.name;

      if (!genreName || normalizeSearchText(genreName) === 'ужасы') {
        return;
      }

      counts.set(genreName, (counts.get(genreName) || 0) + 1);
    });
  });

  return counts;
}

function getSubgenreOptionCounts() {
  const moviesWithoutSubgenreFilter = getFilteredMovies({
    ignoreSubgenre: true,
    skipSorting: true
  });

  const counts = new Map();

  moviesWithoutSubgenreFilter.forEach(movie => {
    const subgenreKeys = [
      movie.primary_subgenre,
      ...(Array.isArray(movie.secondary_subgenres) ? movie.secondary_subgenres : [])
    ].filter(Boolean);

    const uniqueSubgenreKeys = [...new Set(subgenreKeys)];

    uniqueSubgenreKeys.forEach(subgenreKey => {
      counts.set(subgenreKey, (counts.get(subgenreKey) || 0) + 1);
    });
  });

  return counts;
}

function getFormatOptionCounts() {
  const moviesWithoutFormatFilter = getFilteredMovies({
    ignoreFormat: true,
    skipSorting: true
  });

  const counts = new Map();

  moviesWithoutFormatFilter.forEach(movie => {
    const movieFormats = Array.isArray(movie.formats) ? movie.formats : [];

    movieFormats.forEach(formatKey => {
      counts.set(formatKey, (counts.get(formatKey) || 0) + 1);
    });
  });

  return counts;
}

function getCountryOptionCounts() {
  const moviesWithoutCountryFilter = getFilteredMovies({
    ignoreCountry: true,
    skipSorting: true
  });

  const counts = new Map();

  moviesWithoutCountryFilter.forEach(movie => {
    const movieCountries = Array.isArray(movie.movie_countries) ? movie.movie_countries : [];

    movieCountries.forEach(item => {
      const countryName = item?.countries?.name;

      if (!countryName) {
        return;
      }

      counts.set(countryName, (counts.get(countryName) || 0) + 1);
    });
  });

  return counts;
}

function getYearOptionCounts() {
  const moviesWithoutYearFilter = getFilteredMovies({
    ignoreYear: true,
    skipSorting: true
  });

  const counts = new Map();

  moviesWithoutYearFilter.forEach(movie => {
    const yearValue = movie?.year;

    if (!yearValue) {
      return;
    }

    counts.set(Number(yearValue), (counts.get(Number(yearValue)) || 0) + 1);
  });

  return counts;
}

function getTriggerOptionCounts() {
  const moviesWithoutTriggerExcludes = getFilteredMovies({
    ignoreTriggerExcludes: true,
    skipSorting: true
  });

  const counts = new Map();

  moviesWithoutTriggerExcludes.forEach(movie => {
    const movieTriggers = Array.isArray(movie.triggers) ? movie.triggers : [];

    movieTriggers.forEach(triggerKey => {
      counts.set(triggerKey, (counts.get(triggerKey) || 0) + 1);
    });
  });

  return counts;
}

function refreshDynamicFilterOptions() {
  refreshGenreFilterOptions();
  loadSubgenreFilterOptions();
  loadFormatFilterOptions();
  refreshCountryFilterOptions();
  loadYearFilterOptions();
  loadTriggerFilterOptions();
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
if (loginForm) {
  loginForm.addEventListener('submit', login);
}

if (loginEmail) {
  loginEmail.addEventListener('input', clearAuthMessage);
}

if (loginPassword) {
  loginPassword.addEventListener('input', clearAuthMessage);
}

if (loginPasswordConfirm) {
  loginPasswordConfirm.addEventListener('input', clearAuthMessage);
}

if (registerButton) {
  registerButton.addEventListener('click', () => {
    setAuthRegisterMode(!isAuthRegisterMode);
  });
}

if (logoutMenuButton) {
  logoutMenuButton.addEventListener('click', () => {
    closeAuthPopoverMenu();
    logout();
  });
}

if (displayNameButton) {
  displayNameButton.addEventListener('click', () => {
    toggleDisplayNameModal();
  });
}

if (displayNameForm) {
  displayNameForm.addEventListener('submit', saveDisplayName);
}

if (cancelDisplayNameButton) {
  cancelDisplayNameButton.addEventListener('click', () => {
    closeDisplayNameModal();
  });
}

if (closeDisplayNameModalButton) {
  closeDisplayNameModalButton.addEventListener('click', () => {
    closeDisplayNameModal();
  });
}

if (displayNameModalBackdrop) {
  displayNameModalBackdrop.addEventListener('click', () => {
    closeDisplayNameModal();
  });
}

if (openAuthModalButton) {
  openAuthModalButton.addEventListener('click', () => {
    if (shouldUseAuthenticatedUi()) {
      toggleAuthPopoverMenu();
      return;
    }

    openAuthModal();
  });
}

if (closeAuthModalButton) {
  closeAuthModalButton.addEventListener('click', () => {
    closeAuthModal();
  });
}

if (authModalBackdrop) {
  authModalBackdrop.addEventListener('click', () => {
    closeAuthModal();
  });
}

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener('click', () => {
    sendPasswordResetEmail();
  });
}

if (openAddMovieButton) {
  openAddMovieButton.addEventListener('click', () => {
    resetFormToCreateMode();
    openMovieModal();
  });
}

if (openFiltersButton) {
  openFiltersButton.addEventListener('click', () => {
    openFiltersModal();
  });
}

if (closeMovieModalButton) {
  closeMovieModalButton.addEventListener('click', () => {
    closeMovieModal();
  });
}

if (closeFiltersModalButton) {
  closeFiltersModalButton.addEventListener('click', () => {
    closeFiltersModal();
  });
}

if (movieModalBackdrop) {
  movieModalBackdrop.addEventListener('click', () => {
    closeMovieModal();
  });
}

if (filtersModalBackdrop) {
  filtersModalBackdrop.addEventListener('click', () => {
    closeFiltersModal();
  });
}

const debouncedRenderMovies = createDebouncedCatalogRender(200);

let lastSearchQuery = '';

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    if (searchClearBtn) {
      searchClearBtn.classList.toggle('is-visible', Boolean(query));
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
}

if (searchClearBtn && searchInput) {
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchClearBtn.classList.remove('is-visible');
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
  refreshDynamicFilterOptions();
  saveCatalogStateAndRenderFilters();
};

if (genreFilter) {
  genreFilter.addEventListener('change', handleFiltersChange);
}

if (subgenreFilter) {
  subgenreFilter.addEventListener('change', handleFiltersChange);
}

if (formatFilter) {
  formatFilter.addEventListener('change', handleFiltersChange);
}

if (countryFilter) {
  countryFilter.addEventListener('change', handleFiltersChange);
}

if (ratingFilter) {
  ratingFilter.addEventListener('change', handleFiltersChange);
}

if (yearFilter) {
  yearFilter.addEventListener('change', handleFiltersChange);
}

if (watchlistFilter) {
  watchlistFilter.addEventListener('change', handleFiltersChange);
}

if (watchedFilter) {
  watchedFilter.addEventListener('change', handleFiltersChange);
}

if (viewMode) {
  viewMode.addEventListener('change', () => {
    applyCatalogViewModeChange();
  });
}

if (sortMode) {
  sortMode.addEventListener('change', () => {
    trackSortUsageIfNeeded();
    rerenderCatalogPreservingPosition();
  });
}

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

if (triggerFiltersToggle) {
  triggerFiltersToggle.addEventListener('click', () => {
    toggleTriggerFiltersDropdown();
  });
}

if (triggerFiltersGroup) {
  triggerFiltersGroup.addEventListener('change', event => {
    const changedInput = event.target.closest('input[type="checkbox"][data-trigger-filter]');

    if (!changedInput) {
      return;
    }

    syncTriggerFiltersTriggerText();
    handleFiltersChange();
  });
}

if (posterFileInput) {
  posterFileInput.addEventListener('change', updatePosterFileUi);
}

[
  movieFormatsInput,
  movieModifiersInput,
  movieBroadFamiliesInput,
  tagsPerceivedInput,
  tagsCanonInput,
  movieTriggersInput
].forEach(inputElement => {
  if (!inputElement) {
    return;
  }

  inputElement.addEventListener('input', () => {
    updateMovieTaxonomyPreview();
  });
});

if (movieForm) {
  movieForm.addEventListener('submit', saveMovie);
}

if (cancelEditButton) {
  cancelEditButton.addEventListener('click', () => {
    resetFormToCreateMode();
    closeMovieModal();
  });
}

if (moviePageEditButton) {
  moviePageEditButton.addEventListener('click', async () => {
    if (!isAdmin || !currentMoviePageMovieId) {
      return;
    }

    const movieForEdit = currentMoviePageMovieData || await fetchMovieById(currentMoviePageMovieId);

    if (!movieForEdit) {
      return;
    }

    fillFormForEdit(movieForEdit);
  });
}

if (moviePageDeleteButton) {
  moviePageDeleteButton.addEventListener('click', () => {
    if (!isAdmin || !currentMoviePageMovieId || !currentMoviePageMovieData) {
      return;
    }

    armDeleteMovieButton(moviePageDeleteButton, () => {
      deleteMovieFromMoviePage(currentMoviePageMovieId, currentMoviePageMovieData.title);
    });
  });
}

document.addEventListener('click', event => {
  const clickedInsideAuthMenu = event.target.closest('.auth-menu-wrap');

  if (!clickedInsideAuthMenu) {
    closeAuthPopoverMenu();
  }

  if (triggerFiltersSelect && !event.target.closest('#triggerFiltersSelect')) {
    closeTriggerFiltersDropdown();
  }

  if (!container) {
    return;
  }

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

  if (!container) {
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
  closeAuthPopoverMenu();
  closeDisplayNameModal();
  closeTriggerFiltersDropdown();

  if (isModalOpen) {
    closeMovieModal();
    return;
  }

  if (isAuthModalOpen) {
    closeAuthModal();
    return;
  }

  if (filtersModal && filtersModal.classList.contains('is-open')) {
    closeFiltersModal();
  }
});

/* =========================================================
JS-БЛОК 23. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
Восстанавливает сессию, подписывается на auth-изменения,
загружает данные и запускает первую отрисовку.
========================================================== */
function isCatalogPage() {
  return Boolean(container);
}

function isMoviePage() {
  return Boolean(moviePage);
}

function handlePasswordRecoveryEntry(hasPasswordRecoveryRedirect) {
  if (!hasPasswordRecoveryRedirect) {
    return;
  }

  isPasswordRecoveryMode = true;
  updateAuthUI();
  updateAuthModalMode();
  openAuthModal();
  showAuthMessage('Введите новый пароль и подтвердите его ниже.');
}

function bindSharedAuthStateListener({ onAfterAuthSync } = {}) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      return;
    }

    if (event === 'PASSWORD_RECOVERY') {
      if (!isPasswordRecoveryEntryPage) {
        clearLocalRecoverySession();
        return;
      }

      localStorage.setItem(PASSWORD_RECOVERY_PENDING_KEY, '1');
      isPasswordRecoveryMode = true;
      updateAuthUI();
      updateAuthModalMode();
      openAuthModal();
      showAuthMessage('Введите новый пароль и подтвердите его ниже.');
      return;
    }

    const nextUserId = session?.user?.id ?? null;
    const currentUserId = currentUser?.id ?? null;
    const hasPendingRecovery = Boolean(localStorage.getItem(PASSWORD_RECOVERY_PENDING_KEY));
    const shouldIgnoreForeignRecoverySignIn = (
      event === 'SIGNED_IN' &&
      hasPendingRecovery &&
      !isPasswordRecoveryEntryPage
    );
    const shouldSkipAuthSync = (
      nextUserId === currentUserId &&
      event !== 'SIGNED_OUT' &&
      event !== 'SIGNED_IN'
    );

    if (shouldIgnoreForeignRecoverySignIn) {
      clearLocalRecoverySession();
      return;
    }

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

      if (typeof onAfterAuthSync === 'function') {
        onAfterAuthSync();
      }
    }, 0);
  });
}

async function initCatalogPage() {
  renderMoviesSkeleton();

  const restoredUser = await restoreSession();
  trackEmailConfirmedLoginIfNeeded();

  bindSharedAuthStateListener({
    onAfterAuthSync: () => {
      applySavedCatalogState();
      syncCatalogAfterAuthChange();
    }
  });

  await reloadCatalogData({ showSkeleton: true });
  initCatalogViewToggleButton();
  applySavedCatalogState();
  refreshDynamicFilterOptions();

  if (restoredUser && !isPasswordRecoveryMode) {
    syncCatalogAfterAuthChange();
  } else {
    renderMovies();
  }

  updateFiltersButtonLabel();
  restoreCatalogScrollPosition();
}

function getMoviePageRouteParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const rawMovieSlug = searchParams.get('slug');
  const rawMovieId = searchParams.get('id');

  const movieSlug = String(rawMovieSlug || '').trim();
  const movieId = String(rawMovieId || '').trim();

  if (movieSlug) {
    return { slug: movieSlug, id: null };
  }

  if (movieId) {
    return { slug: null, id: movieId };
  }

  return null;
}

async function fetchMovieById(movieId) {
  const { data, error } = await supabaseClient
    .from('movies')
    .select(MOVIE_BASE_SELECT)
    .eq('id', movieId)
    .order('position', { foreignTable: 'movie_genres', ascending: true })
    .single();

  if (error) {
    throw error;
  }

  return data || null;
}

async function fetchMovieByRouteParams(routeParams) {
  if (!routeParams) {
    return null;
  }

  if (routeParams.slug) {
    const { data, error } = await supabaseClient
      .from('movies')
      .select(MOVIE_BASE_SELECT)
      .eq('slug', routeParams.slug)
      .order('position', { foreignTable: 'movie_genres', ascending: true })
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }
  }

  if (routeParams.id) {
    return fetchMovieById(routeParams.id);
  }

  return null;
}

function getMoviePageReleaseLabel(movie) {
  if (!movie?.release_year && !movie?.release_month) {
    return '';
  }

  if (movie.release_year && movie.release_month) {
    return `${getMonthName(movie.release_month)} ${movie.release_year}`;
  }

  if (movie.release_year) {
    return String(movie.release_year);
  }

  return getMonthName(movie.release_month);
}

function setMoviePageDocumentMeta(movie) {
  if (!movie) {
    document.title = 'Фильм не найден — Хоррорейро';
    return;
  }

  document.title = `${movie.title} — Хоррорейро`;

  const descriptionText = [
    movie.original_title ? `Оригинальное название: ${movie.original_title}.` : '',
    movie.year ? `Год: ${movie.year}.` : '',
    movie.director ? `Режиссёр: ${movie.director}.` : '',
    'Страница фильма в каталоге Хоррорейро.'
  ].filter(Boolean).join(' ');

  const descriptionMeta = document.querySelector('meta[name="description"]');

  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', descriptionText);
  }
}

function renderMoviePageNotFound() {
  if (!moviePage) {
    return;
  }

  currentMoviePageMovieId = null;
  currentMoviePageMovieData = null;

  setMoviePageDocumentMeta(null);

  moviePage.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon" aria-hidden="true">◌</div>
      <div class="empty-state-title">Фильм не найден</div>
      <div class="empty-state-text">
        Возможно, ссылка устарела или фильм был удалён из каталога.
      </div>
      <div class="empty-state-actions">
        <a href="index.html" class="secondary-button secondary-button-compact empty-state-reset-btn">
          Вернуться в каталог
        </a>
      </div>
    </div>
  `;
}

function getMovieSimilarityExtraGenres(movie) {
  return (Array.isArray(movie?.movie_genres) ? movie.movie_genres : [])
    .map(item => item?.genres?.name)
    .filter(Boolean)
    .filter(name => normalizeSearchText(name) !== 'ужасы');
}

function getMovieSimilarityCountries(movie) {
  return (Array.isArray(movie?.movie_countries) ? movie.movie_countries : [])
    .map(item => item?.countries?.name)
    .filter(Boolean);
}

function getMovieSimilaritySource(movie) {
  return {
    id: String(movie.id),
    title: String(movie.title || ''),
    year: Number(movie.year || 0),

    perceived: Array.isArray(movie.tags_perceived) ? movie.tags_perceived : [],
    canon: Array.isArray(movie.tags_canon) ? movie.tags_canon : [],
    formats: Array.isArray(movie.formats) ? movie.formats : [],
    modifiers: Array.isArray(movie.modifiers) ? movie.modifiers : [],
    broadFamilies: Array.isArray(movie.broad_families) ? movie.broad_families : [],

    extraGenres: getMovieSimilarityExtraGenres(movie),
    countries: getMovieSimilarityCountries(movie)
  };
}

function getSimilarMoviesForMoviePage(movie, limit = 4) {
  if (!movie || !Array.isArray(allMovies) || allMovies.length === 0) {
    return [];
  }

  if (typeof getSimilarMovies !== 'function') {
    return [];
  }

  const similarityMovies = allMovies.map(sourceMovie => getMovieSimilaritySource(sourceMovie));
  const targetMovie = getMovieSimilaritySource(movie);
  const similarItems = getSimilarMovies(targetMovie, similarityMovies);
  const moviesById = new Map(allMovies.map(sourceMovie => [String(sourceMovie.id), sourceMovie]));

  return similarItems
    .slice(0, limit)
    .map(item => moviesById.get(String(item.movie.id)))
    .filter(Boolean);
}

function getMoviePageSimilarCardHtml(movie) {
  const genres = movie.movie_genres.map(item => item.genres.name).join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');
  const averageRating = getMovieAverageRating(movie.id);
  const votesCount = getMovieRatings(movie.id).length;

  return `
    <article class="movie-page-similar-card" data-movie-id="${movie.id}">
      <a href="${buildMoviePageUrl(movie)}" class="movie-page-similar-poster-link" aria-label="Перейти к фильму ${escapeHtml(movie.title)}">
        <div class="movie-page-similar-poster-wrapper">
          ${
            movie.poster_url
              ? `
                <img
                  class="movie-page-similar-poster"
                  src="${movie.poster_url}"
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
          <a href="${buildMoviePageUrl(movie)}" class="movie-title-link">${escapeHtml(movie.title)}</a>
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

function getMoviePageReviewFormHtml(movie) {
  const currentUserReview = getCurrentUserMovieReview(movie.id);
  const canCreateReview = canCurrentUserCreateMovieReview(movie.id);

  if (!currentUser) {
    return `
      <div class="movie-page-review-gate">
        <div class="movie-page-review-gate-text">Войдите, чтобы оставить рецензию.</div>
      </div>
    `;
  }

  if (currentUserReview) {
    return '';
  }

  if (!canCreateReview) {
    return `
      <div class="movie-page-review-gate">
        <div class="movie-page-review-gate-text">Оставить рецензию можно только после оценки фильма.</div>
      </div>
    `;
  }

  return `
    <section class="movie-page-review-form-block">
      <div class="movie-page-subtitle">Написать рецензию</div>

      <form class="movie-page-review-form" data-movie-review-form="true">
        <textarea
          class="movie-page-review-textarea"
          name="reviewText"
          placeholder="Поделитесь впечатлениями о фильме"
          rows="7"
          data-movie-review-textarea="true"
        ></textarea>

        <label class="movie-page-review-spoiler-toggle">
          <input
            type="checkbox"
            name="containsSpoilers"
            data-movie-review-spoilers="true"
          >
          <span>Есть спойлеры</span>
        </label>

        <div class="movie-page-review-form-actions">
          <button type="submit" data-movie-review-submit="true">Опубликовать</button>
        </div>

        <div class="movie-page-review-form-hint">
          Минимум 80 символов. Максимум 5000 символов.
        </div>

        <p class="movie-page-review-form-message" data-movie-review-form-message="true"></p>
      </form>
    </section>
  `;
}

function getMoviePageReviewBodyHtml(review, {
  isEditing,
  isSpoilerReview,
  isExpandedSpoiler,
  isExpandedText,
  isLongReview
}) {
  if (isEditing) {
    return `
      <form
        class="movie-page-review-form movie-page-review-inline-form"
        data-movie-review-form="true"
        data-movie-review-id="${review.id}"
      >
        <textarea
          class="movie-page-review-textarea"
          name="reviewText"
          placeholder="Поделитесь впечатлениями о фильме"
          rows="7"
          data-movie-review-textarea="true"
        >${escapeHtml(review.review_text || '')}</textarea>

        <label class="movie-page-review-spoiler-toggle">
          <input
            type="checkbox"
            name="containsSpoilers"
            data-movie-review-spoilers="true"
            ${review.contains_spoilers ? 'checked' : ''}
          >
          <span>Есть спойлеры</span>
        </label>

        <div class="movie-page-review-form-actions">
          <button type="submit" data-movie-review-submit="true">Сохранить изменения</button>
          <button
            type="button"
            class="secondary-button"
            data-movie-review-cancel-edit="true"
          >
            Отмена
          </button>
        </div>

        <div class="movie-page-review-form-hint">
          Минимум 80 символов. Максимум 5000 символов.
        </div>

        <p class="movie-page-review-form-message" data-movie-review-form-message="true"></p>
      </form>
    `;
  }

  if (isSpoilerReview && !isExpandedSpoiler) {
    return `
      <div class="movie-page-review-spoiler-cover">
        <div class="movie-page-review-spoiler-cover-text">Рецензия содержит спойлеры.</div>
        <button
          type="button"
          class="secondary-button secondary-button-compact"
          data-movie-review-show-spoilers="${review.id}"
        >
          Показать
        </button>
      </div>
    `;
  }

  return `
    <div class="movie-page-review-text ${isLongReview && !isExpandedText ? 'is-collapsed' : ''}">
      ${escapeHtml(review.review_text)}
    </div>

    ${
      isLongReview
        ? `
          <div class="movie-page-review-more">
            <button
              type="button"
              class="secondary-button secondary-button-compact"
              data-movie-review-toggle-text="${review.id}"
            >
              ${isExpandedText ? 'Свернуть' : 'Читать дальше'}
            </button>
          </div>
        `
        : ''
    }
  `;
}

function getMoviePageReviewHeaderHtml(review, {
  authorName,
  reviewDate,
  userRatingHtml,
  isCurrentUserReview,
  isSpoilerReview,
  isEditing
}) {
  return `
    <div class="movie-page-review-card-header">
      <div class="movie-page-review-card-meta">
        <div class="movie-page-review-author">${authorName}</div>
        ${
          reviewDate
            ? `<div class="movie-page-review-date">${escapeHtml(reviewDate)}</div>`
            : ''
        }
        ${userRatingHtml}
      </div>

      <div class="movie-page-review-card-header-side">
        ${
          isSpoilerReview
            ? `<div class="movie-page-review-spoiler-badge">Спойлеры</div>`
            : ''
        }

        ${
          isCurrentUserReview && !isEditing
            ? `
              <div class="movie-page-review-icon-actions">
                <button
                  type="button"
                  class="movie-page-review-icon-button"
                  data-movie-review-edit="${review.id}"
                  aria-label="Редактировать рецензию"
                  title="Редактировать"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path>
                  </svg>
                </button>

                <button
                  type="button"
                  class="movie-page-review-icon-button movie-page-review-icon-button-danger"
                  data-movie-review-delete="${review.id}"
                  aria-label="Удалить рецензию"
                  title="Удалить"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            `
            : ''
        }
      </div>
    </div>
  `;
}

function getMoviePageReviewCardHtml(review) {
  const authorName = escapeHtml(getMovieReviewAuthorName(review));
  const reviewDate = formatMovieReviewDate(review.updated_at || review.created_at);
  const userRating = getMovieReviewUserRating(review.movie_id, review.user_id);
  const userRatingHtml = Number.isFinite(userRating) && userRating > 0
    ? `<div class="movie-page-review-user-rating">Оценка: ${userRating}/10 <span class="movie-page-review-user-rating-star">★</span></div>`
    : '';
  const isCurrentUserReview = Boolean(currentUser) && String(review.user_id) === String(currentUser.id);
  const isSpoilerReview = Boolean(review.contains_spoilers);
  const isExpandedSpoiler = isMovieReviewExpanded(review.id);
  const isExpandedText = isMovieReviewTextExpanded(review.id);
  const isLongReview = isMovieReviewLong(review.review_text);
  const isEditing = isMovieReviewEditing(review.id);

  return `
    <article class="movie-page-review-card" data-movie-review-id="${review.id}">
      ${getMoviePageReviewHeaderHtml(review, {
        authorName,
        reviewDate,
        userRatingHtml,
        isCurrentUserReview,
        isSpoilerReview,
        isEditing
      })}

      ${getMoviePageReviewBodyHtml(review, {
        isEditing,
        isSpoilerReview,
        isExpandedSpoiler,
        isExpandedText,
        isLongReview
      })}
    </article>
  `;
}

function getMoviePageReviewsSectionHtml(movie) {
  const reviews = sortMovieReviewsForDisplay(getMovieReviews(movie.id));

  return `
  <section class="movie-page-reviews-block" aria-labelledby="moviePageReviewsTitle">
  <h2 id="moviePageReviewsTitle" class="movie-page-subtitle">Рецензии</h2>

  ${getMoviePageReviewFormHtml(movie)}

      ${
        reviews.length > 0
          ? `
            <div class="movie-page-reviews-list">
              ${reviews.map(review => getMoviePageReviewCardHtml(review)).join('')}
            </div>
          `
          : `
            <div class="movie-page-review-empty-state">
              Пока нет ни одной рецензии.
            </div>
          `
      }
    </section>
  `;
}

function getMoviePageSimilarSectionHtml(similarMovies) {
  if (!Array.isArray(similarMovies) || similarMovies.length === 0) {
    return '';
  }

  return `
  <section class="movie-page-similar-block" aria-labelledby="moviePageSimilarTitle">
  <h2 id="moviePageSimilarTitle" class="movie-page-subtitle">Похожие фильмы</h2>
  <div class="movie-page-similar-grid">
        ${similarMovies.map(similarMovie => getMoviePageSimilarCardHtml(similarMovie)).join('')}
      </div>
    </section>
  `;
}

async function handleMovieReviewFormSubmit(movie, formElement) {
  if (!formElement || reviewRequestInFlight.has(String(movie.id))) {
    return;
  }

  const messageElement = formElement.querySelector('[data-movie-review-form-message="true"]');
  const textareaElement = formElement.querySelector('[data-movie-review-textarea="true"]');
  const spoilersCheckbox = formElement.querySelector('[data-movie-review-spoilers="true"]');
  const submitButtonElement = formElement.querySelector('[data-movie-review-submit="true"]');
  const deleteButtonElement = formElement.querySelector('[data-movie-review-delete]');

  const setFormMessage = (message = '', type = '') => {
    if (!messageElement) {
      return;
    }

    messageElement.textContent = message;
    messageElement.classList.remove('is-error', 'is-success');

    if (type) {
      messageElement.classList.add(`is-${type}`);
    }
  };

  try {
    reviewRequestInFlight.add(String(movie.id));

    if (submitButtonElement) {
      submitButtonElement.disabled = true;
    }

    if (deleteButtonElement) {
      deleteButtonElement.disabled = true;
    }

    if (textareaElement) {
      textareaElement.disabled = true;
    }

    if (spoilersCheckbox) {
      spoilersCheckbox.disabled = true;
    }

    setFormMessage('Сохраняю...');

    await saveMovieReview(movie.id, {
      reviewText: textareaElement?.value || '',
      containsSpoilers: Boolean(spoilersCheckbox?.checked)
    });

    stopMovieReviewEditing();
    setFormMessage('Рецензия сохранена.', 'success');
    renderMoviePage(movie);
  } catch (error) {
    console.error('Ошибка сохранения рецензии:', error);
    setFormMessage(error?.message || 'Не удалось сохранить рецензию.', 'error');
  } finally {
    reviewRequestInFlight.delete(String(movie.id));
  }
}

async function handleMovieReviewDelete(movie, reviewId) {
  if (!reviewId || reviewRequestInFlight.has(String(movie.id))) {
    return;
  }

  try {
    await runConfirmedAction('Удалить рецензию?', async () => {
      reviewRequestInFlight.add(String(movie.id));
      stopMovieReviewEditing();
      await removeMovieReview(reviewId, movie.id);
      renderMoviePage(movie);
    });
  } catch (error) {
    console.error('Ошибка удаления рецензии:', error);
    alert(error?.message || 'Не удалось удалить рецензию.');
  } finally {
    reviewRequestInFlight.delete(String(movie.id));
  }
}

async function runConfirmedAction(confirmMessage, action) {
  const isConfirmed = confirm(confirmMessage);

  if (!isConfirmed) {
    return false;
  }

  await action();
  return true;
}

function bindMoviePageReviewClickAction(selector, handler) {
  if (!moviePage) {
    return;
  }

  moviePage.querySelectorAll(selector).forEach(element => {
    element.addEventListener('click', () => {
      handler(element);
    });
  });
}

function bindMoviePageReviewEvents(movie) {
  if (!moviePage || !movie) {
    return;
  }

  moviePage.querySelectorAll('[data-movie-review-form="true"]').forEach(reviewForm => {
    reviewForm.addEventListener('submit', event => {
      event.preventDefault();
      handleMovieReviewFormSubmit(movie, reviewForm);
    });
  });

  bindMoviePageReviewClickAction('[data-movie-review-delete]', button => {
    handleMovieReviewDelete(movie, button.dataset.movieReviewDelete);
  });

  bindMoviePageReviewClickAction('[data-movie-review-edit]', button => {
    startMovieReviewEditing(button.dataset.movieReviewEdit);
    renderMoviePage(movie);
  });

  bindMoviePageReviewClickAction('[data-movie-review-cancel-edit="true"]', () => {
    stopMovieReviewEditing();
    renderMoviePage(movie);
  });

  bindMoviePageReviewClickAction('[data-movie-review-show-spoilers]', button => {
    setMovieReviewExpandedState(button.dataset.movieReviewShowSpoilers, true);
    renderMoviePage(movie);
  });

  bindMoviePageReviewClickAction('[data-movie-review-toggle-text]', button => {
    const reviewId = button.dataset.movieReviewToggleText;
    const shouldExpand = !isMovieReviewTextExpanded(reviewId);

    setMovieReviewTextExpandedState(reviewId, shouldExpand);
    renderMoviePage(movie);
  });
}

function buildMoviePageViewModel(movie) {
  return {
    genres: movie.movie_genres.map(item => item.genres.name).join(', '),
    countries: movie.movie_countries.map(item => item.countries.name).join(', '),
    averageRating: getMovieAverageRating(movie.id),
    votesCount: getMovieRatings(movie.id).length,
    currentUserRating: getCurrentUserRating(movie.id),
    userMovieState: getCurrentUserMovieState(movie.id),
    primaryPerceivedTagLabel: Array.isArray(movie.tags_perceived) && movie.tags_perceived.length > 0
      ? movie.tags_perceived
          .slice(0, 2)
          .map(tag => getTaxonomyLabel('subgenres', tag))
          .filter(Boolean)
          .join(', ')
      : '',
    externalLinksHtml: getMoviePageExternalLinksHtml(movie),
    synopsis: String(movie.synopsis || '').trim(),
    isRatingBusy: ratingRequestInFlight.has(String(movie.id)),
    isWatchlistBusy: watchlistRequestInFlight.has(String(movie.id)),
    similarMovies: getSimilarMoviesForMoviePage(movie, 4),
    reviewsSectionHtml: getMoviePageReviewsSectionHtml(movie)
  };
}

function getMoviePagePosterColumnHtml(movie, viewModel) {
  const {
    currentUserRating,
    userMovieState,
    isWatchlistBusy
  } = viewModel;

  return `
    <div class="movie-page-poster-column">
      <div class="movie-page-poster-wrapper">
        ${
          movie.poster_url
            ? `
              <img
                class="movie-page-poster"
                src="${movie.poster_url}"
                alt="Постер фильма ${escapeHtml(movie.title)}"
                loading="eager"
                decoding="async"
              >
            `
            : `<div class="movie-poster-placeholder">Нет постера</div>`
        }

        ${
          currentUser && !userMovieState.isWatched
            ? `
              <button
                type="button"
                class="movie-page-watchlist-icon ${userMovieState.isInWatchlist ? 'is-active' : ''}"
                data-movie-page-watchlist-icon-toggle="true"
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
              <div class="movie-page-watched-icon" aria-label="Просмотрено" title="Просмотрено">
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

function getMoviePageMainColumnHtml(movie, viewModel) {
  const {
    genres,
    countries,
    averageRating,
    votesCount,
    currentUserRating,
    primaryPerceivedTagLabel,
    externalLinksHtml,
    synopsis,
    isRatingBusy
  } = viewModel;

  return `
    <div class="movie-page-main-column">
      <div class="movie-page-title-block">
      <div class="movie-page-title-row">
      <div class="movie-page-title-main">
        <h2 class="movie-page-title">${escapeHtml(movie.title)}</h2>

        ${
          movie.original_title
            ? `<div class="movie-page-original-title">${escapeHtml(movie.original_title)}</div>`
            : ''
        }
      </div>

          <div class="movie-page-summary-panel">
            <div class="movie-rating-summary movie-page-rating-summary">
              <div class="movie-rating-summary-main movie-page-rating-summary-main">
                <span class="movie-rating-value">${averageRating.toFixed(1)}</span>
                <span class="movie-rating-meta">(${votesCount} ${getVotesLabel(votesCount)})</span>
              </div>
            </div>

            ${
              currentUser
                ? `
                  <button
                    type="button"
                    class="secondary-button movie-page-rate-trigger"
                    data-open-mobile-rating="true"
                    ${isRatingBusy ? 'disabled' : ''}
                  >
                    ${
                      currentUserRating !== null
                        ? `Изменить <span class="movie-page-rate-value">${currentUserRating}</span><span class="movie-page-rate-trigger-star">★</span>`
                        : 'Оценить'
                    }
                  </button>
                `
                : ''
            }
          </div>
        </div>

        <div class="movie-page-meta-list">
          <div class="movie-page-meta-item"><span>Год:</span> <strong>${movie.year ?? '-'}</strong></div>
          <div class="movie-page-meta-item"><span>Режиссёр:</span> ${movie.director ? escapeHtml(movie.director) : '-'}</div>
          <div class="movie-page-meta-item"><span>Жанры:</span> ${genres ? escapeHtml(genres) : '-'}</div>
          <div class="movie-page-meta-item"><span>Поджанр:</span> ${primaryPerceivedTagLabel ? escapeHtml(primaryPerceivedTagLabel) : '-'}</div>
          <div class="movie-page-meta-item"><span>Страны:</span> ${countries ? escapeHtml(countries) : '-'}</div>
        </div>

        ${
          synopsis
            ? `
              <div class="movie-page-synopsis-block">
                <div class="movie-page-synopsis-text">${escapeHtml(synopsis)}</div>
              </div>
            `
            : ''
        }

        ${
          externalLinksHtml
            ? `
              <div class="movie-page-external-links-block">
                ${externalLinksHtml}
              </div>
            `
            : ''
        }
      </div>
    </div>
  `;
}

function getMoviePageHeaderHtml(movie, viewModel) {
  return `
    <article class="movie-page-layout" data-movie-id="${movie.id}">
      ${getMoviePagePosterColumnHtml(movie, viewModel)}
      ${getMoviePageMainColumnHtml(movie, viewModel)}
    </article>
  `;
}

function renderMoviePage(movie) {
  if (!moviePage || !movie) {
    return;
  }

  currentMoviePageMovieId = movie.id;
  currentMoviePageMovieData = movie;

  const viewModel = buildMoviePageViewModel(movie);
  const { similarMovies, reviewsSectionHtml } = viewModel;

  setMoviePageDocumentMeta(movie);

  moviePage.innerHTML = `
    <div class="movie-page-stack">
      ${getMoviePageHeaderHtml(movie, viewModel)}

      ${reviewsSectionHtml}
      ${getMoviePageSimilarSectionHtml(similarMovies)}
    </div>
  `;

  const watchlistIconButton = moviePage.querySelector('[data-movie-page-watchlist-icon-toggle="true"]');
  const mobileRatingButton = moviePage.querySelector('[data-open-mobile-rating="true"]');

  if (watchlistIconButton) {
    watchlistIconButton.addEventListener('click', () => {
      toggleMovieWatchlist(movie.id);
    });
  }

  if (mobileRatingButton) {
    mobileRatingButton.addEventListener('click', () => {
      openMobileRatingModal(movie);
    });
  }

  bindMoviePageReviewEvents(movie);
}

async function deleteMovieFromMoviePage(movieId, movieTitle) {
  try {
    await runConfirmedAction(`Удалить фильм "${movieTitle}"?`, async () => {
      await deleteMovieRecord(movieId);
      window.location.href = 'index.html';
    });
  } catch (error) {
    console.error('Ошибка при удалении фильма со страницы detail-page:', error);
  }
}

async function loadMoviePageByRouteParams(routeParams) {
  await Promise.all([
    fetchMovies(),
    fetchMovieRatings()
  ]);

  const movie = await fetchMovieByRouteParams(routeParams);

  if (!movie) {
    renderMoviePageNotFound();
    return null;
  }

  await fetchMovieReviews(movie.id);
  renderMoviePage(movie);

  return movie;
}

async function initMoviePage() {
  const routeParams = getMoviePageRouteParams();

  if (!routeParams) {
    renderMoviePageNotFound();
    return;
  }

  await restoreSession();
  trackEmailConfirmedLoginIfNeeded();
  await fetchMovieWatchlist();

  try {
    await loadMoviePageByRouteParams(routeParams);
  } catch (error) {
    console.error('Ошибка загрузки страницы фильма:', error);
    renderMoviePageNotFound();
  }

  bindSharedAuthStateListener({
    onAfterAuthSync: async () => {
      try {
        await loadMoviePageByRouteParams(routeParams);
      } catch (error) {
        console.error('Ошибка синхронизации страницы фильма после auth:', error);
        renderMoviePageNotFound();
      }
    }
  });
}

async function init() {
  const hasPasswordRecoveryRedirect = isPasswordRecoveryRedirect();
  isPasswordRecoveryEntryPage = hasPasswordRecoveryRedirect;
  const wasResetApplied = applyBuildVersionSoftResetIfNeeded();

  if (wasResetApplied) {
    window.location.replace(window.location.pathname + window.location.search);
    return;
  }

  bindCustomSelectGlobalEvents();
  initCustomSelects();
  handlePasswordRecoveryEntry(hasPasswordRecoveryRedirect);

  if (isCatalogPage()) {
    await initCatalogPage();
    return;
  }

  if (isMoviePage()) {
    await initMoviePage();
  }
}

/* =========================================================
JS-БЛОК 24. ЗАПУСК ПРИЛОЖЕНИЯ
Точка входа.
========================================================== */
updateMovieTaxonomyPreview();
init();