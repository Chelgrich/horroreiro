/* =========================================================
JS-БЛОК 1. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ СО СТРАНИЦЫ
Сохраняет ссылки на DOM-элементы, с которыми работает приложение.
========================================================== */
let movieModal = document.getElementById('movieModal');
let movieModalBackdrop = document.getElementById('movieModalBackdrop');
let closeMovieModalButton = document.getElementById('closeMovieModalButton');

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
const profileSummaryButton = document.getElementById('profileSummaryButton');

const openAuthModalButton = document.getElementById('openAuthModalButton');
const authPopoverMenu = document.getElementById('authPopoverMenu');
const importLetterboxdRatingsButton = document.getElementById('importLetterboxdRatingsButton');
const manualSimilarAuditButton = document.getElementById('manualSimilarAuditButton');
const letterboxdRatingsFileInput = document.getElementById('letterboxdRatingsFileInput');
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
const appToast = document.getElementById('appToast');
const appToastMessage = document.getElementById('appToastMessage');
const appToastAcceptButton = document.getElementById('appToastAcceptButton');
const userPage = document.getElementById('userPage');

const adminPanel = document.getElementById('adminPanel');
const openAddMovieButton = document.getElementById('openAddMovieButton');

const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const genreFilter = document.getElementById('genreFilter');
const subgenreFilter = document.getElementById('subgenreFilter');
const formatFilter = document.getElementById('formatFilter');
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
const moviePage = document.getElementById('moviePage');
const moviePageAdminActions = document.getElementById('moviePageAdminActions');
const moviePageEditButton = document.getElementById('moviePageEditButton');
const moviePageDeleteButton = document.getElementById('moviePageDeleteButton');
const moviesSectionTitle = document.querySelector('.movies-section .section-title');
const moviesResultCount = document.getElementById('moviesResultCount');
const catalogPaginationTop = document.getElementById('catalogPaginationTop');
const catalogPaginationBottom = document.getElementById('catalogPaginationBottom');
let catalogViewToggleButton = null;
let astralPresetToastTimerId = null;

let movieForm = document.getElementById('movieForm');
let formTitle = document.getElementById('formTitle');
let formMessage = document.getElementById('formMessage');
let submitButton = document.getElementById('submitButton');
let cancelEditButton = document.getElementById('cancelEditButton');

let titleInput = document.getElementById('title');
let originalTitleInput = document.getElementById('originalTitle');
let yearInput = document.getElementById('year');
let releaseMonthInput = document.getElementById('releaseMonth');
let releaseYearInput = document.getElementById('releaseYear');
let sortOrderInput = document.getElementById('sortOrder');
let directorInput = document.getElementById('director');
let posterFileInput = document.getElementById('posterFile');
let posterFileName = document.getElementById('posterFileName');
let kinopoiskUrlInput = document.getElementById('kinopoiskUrl');
let imdbUrlInput = document.getElementById('imdbUrl');
let letterboxdUrlInput = document.getElementById('letterboxdUrl');
let letterboxdShortUrlInput = document.getElementById('letterboxdShortUrl');
let rottentomatoesUrlInput = document.getElementById('rottentomatoesUrl');
let genresInput = document.getElementById('genresInput');
let countriesInput = document.getElementById('countriesInput');
let searchAliasesInput = document.getElementById('searchAliases');
let synopsisInput = document.getElementById('synopsis');
let movieFormatsInput = document.getElementById('movieFormats');
let tagsPerceivedInput = document.getElementById('tagsPerceived');
let manualSimilarMovieSelect = document.getElementById('manualSimilarMovieSelect');
let addManualSimilarMovieButton = document.getElementById('addManualSimilarMovieButton');
let manualSimilarMoviesList = document.getElementById('manualSimilarMoviesList');

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
const CATALOG_SESSION_SNAPSHOT_KEY = 'horroreiro_catalog_session_snapshot';
const CATALOG_DOM_SNAPSHOT_KEY = 'horroreiro_catalog_dom_snapshot';
const CATALOG_SESSION_SNAPSHOT_VERSION = 5;
const CATALOG_SESSION_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
const CATALOG_DOM_SNAPSHOT_IDLE_TIMEOUT_MS = 1200;
const CATALOG_PAGE_SIZE = 40;
const CATALOG_PAGINATION_PAGE_SLOTS = 6;
const CATALOG_PAGINATION_COMPACT_PAGE_SLOTS = 4;
const CATALOG_PRIORITY_POSTER_COUNT = 8;
const POSTER_STORAGE_PUBLIC_PATH = '/storage/v1/object/public/posters/';
const POSTER_STORAGE_RENDER_PATH = '/storage/v1/render/image/public/posters/';
const POSTER_IMAGE_PRESETS = {
  catalog: {
    widths: [240, 360, 480, 640],
    quality: 70,
    sizes: '(max-width: 360px) calc(100vw - 72px), (max-width: 680px) calc((100vw - 92px) / 2), (max-width: 1024px) calc((100vw - 88px) / 2), (max-width: 1200px) calc((100vw - 112px) / 3), 320px'
  },
  similar: {
    widths: [180, 240, 320, 480],
    quality: 68,
    sizes: '(max-width: 360px) calc(100vw - 72px), (max-width: 680px) calc((100vw - 92px) / 2), 220px'
  },
  detail: {
    widths: [320, 480, 640, 800],
    quality: 76,
    sizes: '(max-width: 680px) calc(100vw - 64px), (max-width: 900px) 232px, 320px'
  }
};
const BASE_HORROR_GENRE_NORMALIZED = '\u0443\u0436\u0430\u0441\u044b';
const MANUAL_SIMILAR_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const SITE_ORIGIN = 'https://horroreiro.ru';
const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/og-preview.jpg`;
const MOVIE_STRUCTURED_DATA_SCRIPT_ID = 'movieStructuredData';
const CATALOG_STRUCTURED_DATA_SCRIPT_ID = 'catalogItemListStructuredData';
const AUTH_REQUEST_TIMEOUT_MS = 20000;
const AUTH_PROFILE_REQUEST_TIMEOUT_MS = 15000;
const USER_PAGE_PREVIEW_LIMIT = 10;

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
let isMovieModalEventsBound = false;
let areSharedUiEventsBound = false;
let areCatalogPageEventsBound = false;
let areMoviePageEventsBound = false;
let allMovies = [];
let catalogMoviesById = new Map();
let catalogMovieMetaById = new Map();
let catalogSortedMoviesByMode = {
  default: [],
  oldest: []
};
let allManualSimilarRows = [];
let manualSimilarMovieIdsByMovieId = new Map();
let manualSimilarMovieIdsDraft = [];
let manualSimilarTableAvailable = true;
let manualSimilarRowsLoaded = false;
let manualSimilarDataLoadPromise = null;
let manualSimilarMovieIdsLoadedByMovieId = new Set();
let manualSimilarMovieIdsLoadPromisesByMovieId = new Map();
let manualSimilarDraftDirty = false;
let isManualSimilarAuditRunning = false;
let allMovieRatings = [];
let allMovieWatchlist = [];
let allMovieReviews = [];
let movieRatingStatsByMovieId = new Map();
let movieRatingByMovieAndUserKey = new Map();
let currentUserRatingsByMovieId = new Map();
let currentUserWatchlistMovieIds = new Set();
let catalogReviewedMovieIds = new Set();
let reviewedOnlyFilter = false;
let reviewRequestInFlight = new Set();
let expandedSpoilerReviewIds = new Set();
let expandedMovieReviewTextIds = new Set();
let editingMovieReviewId = null;
let editingMovieId = null;
let isModalOpen = false;
let moviesLoadedSuccessfully = false;
let authMessageTimer = null;
let appMessageTimer = null;
let isAuthSubmitting = false;
let isMovieFormSubmitting = false;
let isLetterboxdRatingsImporting = false;
let lastLetterboxdRatingsImportFileToken = '';
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
let allMovieYears = [];
let lastCatalogAnchorMovieId = null;
let currentMoviePageMovieId = null;
let currentMoviePageMovieData = null;
let currentMoviePageSimilarMovieId = null;
let currentMoviePageSimilarMovies = [];
let moviePageSimilarRequestId = 0;
let shouldFadeCatalogAfterSkeleton = false;
let catalogFadeCleanupTimerId = null;
let catalogDomSnapshotSchedule = null;
let pendingCatalogDomSnapshotSessionSnapshot = null;
let currentCatalogPage = 1;
let currentCatalogPaginationSlots = null;
let catalogDataVersion = 0;
let catalogDerivedStateCache = null;
const userRatingControlsHtmlCache = new Map();
const catalogSessionSnapshotDataHashCache = new WeakMap();

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

function buildMovieClassificationDraftFromForm() {
  const formats = parseMultilineValues(movieFormatsInput?.value || '');
  const tagsPerceived = parseMultilineValues(tagsPerceivedInput?.value || '');

  return {
    formats,
    tagsPerceived
  };
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .trim()
    .replace(/\s+/g, ' ');
}

function isManualSimilarTableUnavailableError(error) {
  const errorCode = String(error?.code || '');
  const errorMessage = String(error?.message || '').toLowerCase();

  return MANUAL_SIMILAR_UNAVAILABLE_CODES.has(errorCode) ||
    errorMessage.includes('movie_manual_similar');
}

function normalizeManualSimilarMovieIds(movieIds = [], ownerMovieId = null) {
  const ownerId = ownerMovieId ? String(ownerMovieId) : '';
  const uniqueMovieIds = new Set();
  const normalizedMovieIds = [];

  (movieIds || []).forEach(movieId => {
    const normalizedMovieId = String(movieId || '').trim();

    if (
      !normalizedMovieId ||
      normalizedMovieId === ownerId ||
      uniqueMovieIds.has(normalizedMovieId)
    ) {
      return;
    }

    uniqueMovieIds.add(normalizedMovieId);
    normalizedMovieIds.push(normalizedMovieId);
  });

  return normalizedMovieIds;
}

function rebuildManualSimilarMovieMap(rows = allManualSimilarRows) {
  const nextMap = new Map();

  (Array.isArray(rows) ? rows : [])
    .slice()
    .sort((firstRow, secondRow) => {
      const firstPosition = Number(firstRow?.position ?? 0);
      const secondPosition = Number(secondRow?.position ?? 0);

      if (firstPosition !== secondPosition) {
        return firstPosition - secondPosition;
      }

      return String(firstRow?.similar_movie_id || '')
        .localeCompare(String(secondRow?.similar_movie_id || ''));
    })
    .forEach(row => {
      const movieId = String(row?.movie_id || '').trim();
      const similarMovieId = String(row?.similar_movie_id || '').trim();

      if (!movieId || !similarMovieId || movieId === similarMovieId) {
        return;
      }

      if (!nextMap.has(movieId)) {
        nextMap.set(movieId, []);
      }

      nextMap.get(movieId).push(similarMovieId);
    });

  manualSimilarMovieIdsByMovieId = nextMap;
  manualSimilarMovieIdsLoadedByMovieId = new Set();
  manualSimilarMovieIdsLoadPromisesByMovieId.clear();
}

function getManualSimilarMovieIds(movieId) {
  if (!movieId) {
    return [];
  }

  return normalizeManualSimilarMovieIds(
    manualSimilarMovieIdsByMovieId.get(String(movieId)) || [],
    movieId
  );
}

function cacheCatalogMovies(movies = []) {
  (Array.isArray(movies) ? movies : []).forEach(movie => {
    if (!movie?.id) {
      return;
    }

    const movieId = String(movie.id);

    catalogMoviesById.set(movieId, movie);
    catalogMovieMetaById.set(movieId, buildCatalogMovieMeta(movie));
  });
}

async function fetchCatalogMoviesByIds(movieIds = []) {
  const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);
  const missingMovieIds = normalizedMovieIds.filter(movieId => !catalogMoviesById.has(String(movieId)));

  if (missingMovieIds.length === 0) {
    return normalizedMovieIds
      .map(movieId => getCatalogMovieById(movieId))
      .filter(Boolean);
  }

  const { data, error } = await supabaseClient
    .from('movies')
    .select(MOVIE_CATALOG_SELECT)
    .in('id', missingMovieIds)
    .order('position', { foreignTable: 'movie_genres', ascending: true });

  throwIfSupabaseError(error);
  cacheCatalogMovies(data || []);

  return normalizedMovieIds
    .map(movieId => getCatalogMovieById(movieId))
    .filter(Boolean);
}

function getManualSimilarMovieLabel(movie) {
  if (!movie) {
    return '';
  }

  const title = String(movie.title || movie.original_title || '').trim() || 'Без названия';
  const year = movie.year ? ` (${movie.year})` : '';

  return `${title}${year}`;
}

function getManualSimilarAuditMovieLabel(movie) {
  const title = getManualSimilarMovieLabel(movie);
  const path = movie?.id ? ` — ${buildMovieCanonicalPath(movie)}` : '';

  return `${title}${path}`;
}

function compareManualSimilarAuditMovies(firstMovie, secondMovie) {
  const firstReleaseYear = Number(firstMovie?.release_year || firstMovie?.year || 0);
  const secondReleaseYear = Number(secondMovie?.release_year || secondMovie?.year || 0);

  if (firstReleaseYear !== secondReleaseYear) {
    return secondReleaseYear - firstReleaseYear;
  }

  const firstReleaseMonth = Number(firstMovie?.release_month || 0);
  const secondReleaseMonth = Number(secondMovie?.release_month || 0);

  if (firstReleaseMonth !== secondReleaseMonth) {
    return secondReleaseMonth - firstReleaseMonth;
  }

  return getManualSimilarMovieLabel(firstMovie).localeCompare(
    getManualSimilarMovieLabel(secondMovie),
    'ru'
  );
}

function getManualSimilarAuditDateStamp() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function getManualSimilarAuditDirectedKey(movieId, similarMovieId) {
  return `${movieId}->${similarMovieId}`;
}

function getManualSimilarAuditCountLabel(count) {
  if (count === 0) {
    return '0 похожих';
  }

  if (count === 1) {
    return '1 похожий';
  }

  return `${count} похожих`;
}

function appendManualSimilarAuditSection(lines, title, items, formatItem) {
  lines.push('', title);

  if (!items.length) {
    lines.push('  Нет.');
    return;
  }

  items.forEach((item, index) => {
    lines.push(`  ${index + 1}. ${formatItem(item)}`);
  });
}

function buildManualSimilarAuditReport() {
  const movies = Array.isArray(allMovies) ? allMovies : [];
  const rows = Array.isArray(allManualSimilarRows) ? allManualSimilarRows : [];
  const moviesById = new Map();

  movies.forEach(movie => {
    if (movie?.id) {
      moviesById.set(String(movie.id), movie);
    }
  });

  const directedRowsByKey = new Map();
  const validDirectedKeys = new Set();
  const invalidRows = [];
  const duplicateLinks = [];
  const selfLinks = [];

  rows.forEach((row, index) => {
    const movieId = String(row?.movie_id || '').trim();
    const similarMovieId = String(row?.similar_movie_id || '').trim();
    const rowNumber = index + 1;
    const hasMovie = moviesById.has(movieId);
    const hasSimilarMovie = moviesById.has(similarMovieId);

    if (!movieId || !similarMovieId || !hasMovie || !hasSimilarMovie) {
      invalidRows.push({
        rowNumber,
        movieId,
        similarMovieId,
        reason: !movieId || !similarMovieId
          ? 'пустой movie_id или similar_movie_id'
          : !hasMovie
            ? 'movie_id не найден в каталоге'
            : 'similar_movie_id не найден в каталоге'
      });
      return;
    }

    if (movieId === similarMovieId) {
      selfLinks.push({ rowNumber, movieId });
      return;
    }

    const key = getManualSimilarAuditDirectedKey(movieId, similarMovieId);

    if (!directedRowsByKey.has(key)) {
      directedRowsByKey.set(key, []);
    }

    directedRowsByKey.get(key).push({
      rowNumber,
      movieId,
      similarMovieId,
      position: Number(row?.position ?? 0)
    });
    validDirectedKeys.add(key);
  });

  directedRowsByKey.forEach((directedRows, key) => {
    if (directedRows.length > 1) {
      duplicateLinks.push({
        key,
        rows: directedRows
      });
    }
  });

  const oneWayLinks = [];

  directedRowsByKey.forEach((directedRows, key) => {
    const firstRow = directedRows[0];
    const reverseKey = getManualSimilarAuditDirectedKey(firstRow.similarMovieId, firstRow.movieId);

    if (!validDirectedKeys.has(reverseKey)) {
      oneWayLinks.push({
        key,
        row: firstRow
      });
    }
  });

  const similarCountByMovieId = new Map();

  movies.forEach(movie => {
    const movieId = String(movie.id);
    const validSimilarIds = getManualSimilarMovieIds(movieId)
      .filter(similarMovieId => moviesById.has(String(similarMovieId)));

    similarCountByMovieId.set(movieId, validSimilarIds.length);
  });

  const moviesWithoutSimilar = movies
    .filter(movie => (similarCountByMovieId.get(String(movie.id)) || 0) === 0)
    .slice()
    .sort(compareManualSimilarAuditMovies);

  const similarCountDistribution = Array.from(similarCountByMovieId.values())
    .reduce((distribution, count) => {
      distribution.set(count, (distribution.get(count) || 0) + 1);
      return distribution;
    }, new Map());

  const sortedDistribution = Array.from(similarCountDistribution.entries())
    .sort((firstEntry, secondEntry) => firstEntry[0] - secondEntry[0]);

  const lines = [
    'Аудит ручных похожих фильмов Хоррорейро',
    `Дата: ${getManualSimilarAuditDateStamp()}`,
    '',
    'Сводка:',
    `  Фильмов в каталоге: ${movies.length}`,
    `  Строк в movie_manual_similar: ${rows.length}`,
    `  Фильмов без валидных похожих: ${moviesWithoutSimilar.length}`,
    `  Битых строк: ${invalidRows.length}`,
    `  Самоссылок: ${selfLinks.length}`,
    `  Дублей направленных связей: ${duplicateLinks.length}`,
    `  Односторонних связей: ${oneWayLinks.length}`,
    '',
    'Распределение по количеству похожих:',
    ...sortedDistribution.map(([count, moviesCount]) => (
      `  ${getManualSimilarAuditCountLabel(count)}: ${moviesCount}`
    ))
  ];

  appendManualSimilarAuditSection(
    lines,
    'Фильмы без валидных похожих:',
    moviesWithoutSimilar,
    movie => getManualSimilarAuditMovieLabel(movie)
  );

  appendManualSimilarAuditSection(
    lines,
    'Битые строки:',
    invalidRows,
    item => `строка ${item.rowNumber}: ${item.movieId || '—'} -> ${item.similarMovieId || '—'} (${item.reason})`
  );

  appendManualSimilarAuditSection(
    lines,
    'Самоссылки:',
    selfLinks,
    item => {
      const movie = moviesById.get(item.movieId);
      return `строка ${item.rowNumber}: ${getManualSimilarAuditMovieLabel(movie)}`;
    }
  );

  appendManualSimilarAuditSection(
    lines,
    'Дубли направленных связей:',
    duplicateLinks,
    item => {
      const firstRow = item.rows[0];
      const movie = moviesById.get(firstRow.movieId);
      const similarMovie = moviesById.get(firstRow.similarMovieId);
      const rowNumbers = item.rows.map(row => row.rowNumber).join(', ');

      return `${getManualSimilarAuditMovieLabel(movie)} -> ${getManualSimilarAuditMovieLabel(similarMovie)} (строки: ${rowNumbers})`;
    }
  );

  appendManualSimilarAuditSection(
    lines,
    'Односторонние связи:',
    oneWayLinks,
    item => {
      const movie = moviesById.get(item.row.movieId);
      const similarMovie = moviesById.get(item.row.similarMovieId);

      return `${getManualSimilarAuditMovieLabel(movie)} -> ${getManualSimilarAuditMovieLabel(similarMovie)} (нет обратной связи)`;
    }
  );

  return {
    text: `${lines.join('\n')}\n`,
    summary: {
      moviesWithoutSimilar: moviesWithoutSimilar.length,
      invalidRows: invalidRows.length,
      selfLinks: selfLinks.length,
      duplicateLinks: duplicateLinks.length,
      oneWayLinks: oneWayLinks.length
    }
  };
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function getManualSimilarAuditSummaryMessage(summary) {
  const problemCount = (
    summary.moviesWithoutSimilar +
    summary.invalidRows +
    summary.selfLinks +
    summary.duplicateLinks +
    summary.oneWayLinks
  );

  if (problemCount === 0) {
    return 'Аудит похожих готов: проблем не найдено.';
  }

  return [
    'Аудит похожих готов:',
    `без похожих ${summary.moviesWithoutSimilar}`,
    `битых строк ${summary.invalidRows}`,
    `самоссылок ${summary.selfLinks}`,
    `дублей ${summary.duplicateLinks}`,
    `односторонних ${summary.oneWayLinks}`
  ].join(' ');
}

async function runManualSimilarAudit() {
  if (!isAdmin || isManualSimilarAuditRunning) {
    return;
  }

  isManualSimilarAuditRunning = true;
  if (manualSimilarAuditButton) {
    manualSimilarAuditButton.disabled = true;
    manualSimilarAuditButton.textContent = 'Готовлю аудит...';
  }

  closeAuthPopoverMenu();
  showAppMessage('Готовлю аудит похожих фильмов...', 'info');

  try {
    await ensureManualSimilarDataLoaded({ ensureMovies: true });

    if (!manualSimilarTableAvailable) {
      showAppMessage('Аудит похожих недоступен: таблица movie_manual_similar не найдена.', 'error', true);
      return;
    }

    const report = buildManualSimilarAuditReport();
    const filename = `horroreiro-manual-similar-audit-${getManualSimilarAuditDateStamp()}.txt`;

    downloadTextFile(filename, report.text);
    console.info('Manual similar audit report:\n', report.text);
    showAppMessage(getManualSimilarAuditSummaryMessage(report.summary), 'success', false, {
      showAction: true
    });
  } catch (error) {
    console.error('Ошибка аудита похожих фильмов:', error);
    showAppMessage(`Ошибка аудита похожих: ${error.message || 'смотри консоль F12.'}`, 'error', true);
  } finally {
    isManualSimilarAuditRunning = false;
    if (manualSimilarAuditButton) {
      manualSimilarAuditButton.disabled = false;
      manualSimilarAuditButton.textContent = 'Аудит похожих';
    }
  }
}

function getManualSimilarSelectableMovies() {
  const excludedMovieIds = new Set([
    editingMovieId ? String(editingMovieId) : '',
    ...manualSimilarMovieIdsDraft.map(movieId => String(movieId))
  ].filter(Boolean));

  return (Array.isArray(allMovies) ? allMovies : [])
    .filter(movie => movie?.id && !excludedMovieIds.has(String(movie.id)))
    .slice()
    .sort((firstMovie, secondMovie) =>
      getManualSimilarMovieLabel(firstMovie).localeCompare(
        getManualSimilarMovieLabel(secondMovie),
        'ru'
      )
    );
}

function renderManualSimilarMovieOptions() {
  if (!manualSimilarMovieSelect) {
    return;
  }

  const selectableMovies = getManualSimilarSelectableMovies();

  manualSimilarMovieSelect.innerHTML = [
    '<option value="">Выбрать фильм</option>',
    ...selectableMovies.map(movie => (
      `<option value="${escapeHtml(movie.id)}">${escapeHtml(getManualSimilarMovieLabel(movie))}</option>`
    ))
  ].join('');
  manualSimilarMovieSelect.value = '';

  if (addManualSimilarMovieButton) {
    addManualSimilarMovieButton.disabled = true;
  }
}

function renderManualSimilarMoviesList() {
  if (!manualSimilarMoviesList) {
    renderManualSimilarMovieOptions();
    return;
  }

  const selectedMovies = manualSimilarMovieIdsDraft
    .map(movieId => getCatalogMovieById(movieId))
    .filter(Boolean);

  if (selectedMovies.length === 0) {
    manualSimilarMoviesList.innerHTML = '<div class="manual-similar-empty">Похожие фильмы не выбраны.</div>';
    renderManualSimilarMovieOptions();
    return;
  }

  manualSimilarMoviesList.innerHTML = selectedMovies.map(movie => `
    <div class="manual-similar-item" data-manual-similar-movie-id="${escapeHtml(movie.id)}">
      <span class="manual-similar-item-title">${escapeHtml(getManualSimilarMovieLabel(movie))}</span>
      <button
        type="button"
        class="manual-similar-remove-button"
        data-remove-manual-similar="${escapeHtml(movie.id)}"
        aria-label="Убрать фильм ${escapeHtml(getManualSimilarMovieLabel(movie))} из похожих"
        title="Убрать"
      >
        ×
      </button>
    </div>
  `).join('');

  renderManualSimilarMovieOptions();
}

function setManualSimilarDraft(movieIds = [], { markDirty = false } = {}) {
  manualSimilarMovieIdsDraft = normalizeManualSimilarMovieIds(movieIds, editingMovieId);
  manualSimilarDraftDirty = Boolean(markDirty);
  renderManualSimilarMoviesList();
}

function addManualSimilarMovieFromSelect() {
  if (!manualSimilarMovieSelect?.value) {
    return;
  }

  setManualSimilarDraft(
    [...manualSimilarMovieIdsDraft, manualSimilarMovieSelect.value],
    { markDirty: true }
  );
}

function removeManualSimilarMovieFromDraft(movieId) {
  setManualSimilarDraft(
    manualSimilarMovieIdsDraft.filter(similarMovieId => String(similarMovieId) !== String(movieId)),
    { markDirty: true }
  );
}

async function fetchManualSimilarMovies() {
  if (!manualSimilarTableAvailable) {
    manualSimilarRowsLoaded = true;
    return false;
  }

  if (manualSimilarDataLoadPromise) {
    return manualSimilarDataLoadPromise;
  }

  manualSimilarDataLoadPromise = (async () => {
    const { data, error } = await supabaseClient
      .from('movie_manual_similar')
      .select('movie_id, similar_movie_id, position')
      .order('position', { ascending: true });

    if (error) {
      if (isManualSimilarTableUnavailableError(error)) {
        manualSimilarTableAvailable = false;
        manualSimilarRowsLoaded = true;
        allManualSimilarRows = [];
        rebuildManualSimilarMovieMap();
        return false;
      }

      throw error;
    }

    manualSimilarTableAvailable = true;
    manualSimilarRowsLoaded = true;
    allManualSimilarRows = data || [];
    rebuildManualSimilarMovieMap();
    return true;
  })().finally(() => {
    manualSimilarDataLoadPromise = null;
  });

  return manualSimilarDataLoadPromise;
}

async function fetchManualSimilarMovieIdsForMovie(movieId, limit = 4) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !manualSimilarTableAvailable) {
    return [];
  }

  if (manualSimilarRowsLoaded || manualSimilarMovieIdsLoadedByMovieId.has(normalizedMovieId)) {
    return getManualSimilarMovieIds(normalizedMovieId).slice(0, limit);
  }

  if (manualSimilarMovieIdsLoadPromisesByMovieId.has(normalizedMovieId)) {
    const cachedPromiseResult = await manualSimilarMovieIdsLoadPromisesByMovieId.get(normalizedMovieId);
    return cachedPromiseResult.slice(0, limit);
  }

  const loadPromise = (async () => {
    const { data, error } = await supabaseClient
      .from('movie_manual_similar')
      .select('similar_movie_id, position')
      .eq('movie_id', normalizedMovieId)
      .order('position', { ascending: true })
      .limit(limit);

    if (error) {
      if (isManualSimilarTableUnavailableError(error)) {
        manualSimilarTableAvailable = false;
        manualSimilarMovieIdsByMovieId.set(normalizedMovieId, []);
        manualSimilarMovieIdsLoadedByMovieId.add(normalizedMovieId);
        return [];
      }

      throw error;
    }

    const similarMovieIds = normalizeManualSimilarMovieIds(
      (data || []).map(row => row?.similar_movie_id),
      normalizedMovieId
    );

    if (manualSimilarRowsLoaded) {
      return getManualSimilarMovieIds(normalizedMovieId).slice(0, limit);
    }

    manualSimilarMovieIdsByMovieId.set(normalizedMovieId, similarMovieIds);
    manualSimilarMovieIdsLoadedByMovieId.add(normalizedMovieId);
    return similarMovieIds;
  })().finally(() => {
    manualSimilarMovieIdsLoadPromisesByMovieId.delete(normalizedMovieId);
  });

  manualSimilarMovieIdsLoadPromisesByMovieId.set(normalizedMovieId, loadPromise);
  return loadPromise;
}

async function fetchManualSimilarMoviesForMovie(movieId, limit = 4) {
  const similarMovieIds = await fetchManualSimilarMovieIdsForMovie(movieId, limit);

  if (similarMovieIds.length === 0) {
    return [];
  }

  return fetchCatalogMoviesByIds(similarMovieIds.slice(0, limit));
}

async function ensureManualSimilarDataLoaded({ ensureMovies = false } = {}) {
  const loadingTasks = [];

  if (ensureMovies && (!Array.isArray(allMovies) || allMovies.length === 0)) {
    loadingTasks.push(fetchMovies({ preserveExistingCatalogOnError: true }));
  }

  if (!manualSimilarRowsLoaded && manualSimilarTableAvailable) {
    loadingTasks.push(fetchManualSimilarMovies());
  }

  if (loadingTasks.length === 0) {
    return true;
  }

  await Promise.all(loadingTasks);
  return manualSimilarTableAvailable;
}

function ensureManualSimilarEditorDataLoaded(movieId) {
  return ensureManualSimilarDataLoaded({ ensureMovies: true }).then(() => {
    if (movieId && String(editingMovieId) === String(movieId) && !manualSimilarDraftDirty) {
      setManualSimilarDraft(getManualSimilarMovieIds(movieId));
      return;
    }

    renderManualSimilarMoviesList();
  });
}

async function replaceManualSimilarMovies(movieId, similarMovieIds = []) {
  const ownerMovieId = String(movieId || '').trim();
  const normalizedSimilarMovieIds = normalizeManualSimilarMovieIds(similarMovieIds, ownerMovieId);

  if (!ownerMovieId) {
    return false;
  }

  if (!manualSimilarTableAvailable) {
    if (normalizedSimilarMovieIds.length === 0) {
      return false;
    }

    throw new Error('Таблица ручных похожих фильмов пока недоступна. Примените SQL-миграцию и повторите сохранение.');
  }

  const { error: deleteError } = await supabaseClient
    .from('movie_manual_similar')
    .delete()
    .or(`movie_id.eq.${ownerMovieId},similar_movie_id.eq.${ownerMovieId}`);

  if (deleteError) {
    if (isManualSimilarTableUnavailableError(deleteError)) {
      manualSimilarTableAvailable = false;
    }

    throwIfSupabaseError(deleteError);
  }

  if (normalizedSimilarMovieIds.length > 0) {
    const rows = normalizedSimilarMovieIds.flatMap((similarMovieId, index) => {
      const reciprocalPosition = getManualSimilarMovieIds(similarMovieId)
        .filter(existingMovieId => String(existingMovieId) !== ownerMovieId)
        .length;

      return [
        {
          movie_id: ownerMovieId,
          similar_movie_id: similarMovieId,
          position: index,
          created_by: currentUser?.id || null
        },
        {
          movie_id: similarMovieId,
          similar_movie_id: ownerMovieId,
          position: reciprocalPosition,
          created_by: currentUser?.id || null
        }
      ];
    });

    const { error: insertError } = await supabaseClient
      .from('movie_manual_similar')
      .insert(rows);

    if (insertError) {
      if (isManualSimilarTableUnavailableError(insertError)) {
        manualSimilarTableAvailable = false;
      }

      throwIfSupabaseError(insertError);
    }
  }

  await fetchManualSimilarMovies();
  return true;
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

function isLocalDevRouteHost() {
  const hostname = window.location.hostname;

  return (
    window.location.protocol === 'file:' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  );
}

function buildMovieCanonicalPath(movie) {
  if (movie?.slug) {
    return `/movie/${encodeURIComponent(movie.slug)}`;
  }

  return `/movie.html?id=${encodeURIComponent(movie?.id || '')}`;
}

function buildMovieCanonicalUrl(movie) {
  return `${SITE_ORIGIN}${buildMovieCanonicalPath(movie)}`;
}

function buildCatalogPageUrl() {
  return isLocalDevRouteHost() ? 'index.html' : '/';
}

function buildMoviePageUrl(movie) {
  if (movie?.slug && !isLocalDevRouteHost()) {
    return buildMovieCanonicalPath(movie);
  }

  if (movie?.slug) {
    return `movie.html?slug=${encodeURIComponent(movie.slug)}`;
  }

  return `movie.html?id=${encodeURIComponent(movie?.id || '')}`;
}

function buildUserPageUrl(handle) {
  const normalizedHandle = String(handle || '').trim();

  if (!normalizedHandle) {
    return buildCatalogPageUrl();
  }

  const encodedHandle = encodeURIComponent(normalizedHandle);

  return isLocalDevRouteHost()
    ? `user.html?handle=${encodedHandle}`
    : `/user/${encodedHandle}`;
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

function getCurrentUserPublicHandle() {
  return String(
    currentUserProfile?.default_display_name ||
    currentUser?.id ||
    ''
  ).trim();
}

function openCurrentUserProfilePage() {
  if (!shouldUseAuthenticatedUi()) {
    return;
  }

  closeAuthPopoverMenu();
  window.location.href = buildUserPageUrl(getCurrentUserPublicHandle());
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
  return createSearchHighlighter(searchQuery)(text);
}

function createSearchHighlighter(searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return escapeHtml;
  }

  const regexes = [...new Set(
    normalizedQuery
      .split(' ')
      .map(word => escapeRegExp(word))
      .filter(Boolean)
  )]
    .sort((a, b) => b.length - a.length)
    .map(word => new RegExp(`(${word})`, 'gi'));

  return text => {
    let result = escapeHtml(text);

    regexes.forEach(regex => {
      result = result.replace(regex, '<mark>$1</mark>');
    });

    return result;
  };
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

function getMovieRatingStatsSnapshotRows() {
  return Array.from(movieRatingStatsByMovieId.entries()).map(([movieId, stats]) => ({
    movie_id: movieId,
    count: stats.count,
    sum: stats.sum,
    average: stats.average
  }));
}

function getCurrentUserMovieRatingSnapshotRows() {
  if (!currentUser) {
    return [];
  }

  return allMovieRatings.filter(row => String(row?.user_id) === String(currentUser.id));
}

function applyMovieRatingStatsSnapshotRows(rows) {
  movieRatingStatsByMovieId = new Map();

  (Array.isArray(rows) ? rows : []).forEach(row => {
    const movieId = String(row?.movie_id ?? '');
    const count = Number(row?.count || 0);
    const sum = Number(row?.sum || 0);
    const average = Number(row?.average || 0);

    if (!movieId || count <= 0) {
      return;
    }

    movieRatingStatsByMovieId.set(movieId, {
      count,
      sum,
      average
    });
  });
}

function createCatalogSessionSnapshotPayload() {
  if (!moviesLoadedSuccessfully || !Array.isArray(allMovies) || allMovies.length === 0) {
    return null;
  }

  return {
    version: CATALOG_SESSION_SNAPSHOT_VERSION,
    buildVersion: APP_BUILD_VERSION,
    savedAt: Date.now(),
    userId: currentUser?.id || null,
    movies: allMovies,
    movieRatings: getCurrentUserMovieRatingSnapshotRows(),
    movieRatingStats: getMovieRatingStatsSnapshotRows(),
    movieWatchlist: allMovieWatchlist,
    reviewedMovieIds: Array.from(catalogReviewedMovieIds)
  };
}

function getCatalogSessionSnapshotSignature(snapshot) {
  if (!snapshot) {
    return '';
  }

  const sortByMovieAndUser = (firstItem, secondItem) => {
    const movieCompare = String(firstItem?.movie_id || '').localeCompare(String(secondItem?.movie_id || ''));

    if (movieCompare !== 0) {
      return movieCompare;
    }

    return String(firstItem?.user_id || '').localeCompare(String(secondItem?.user_id || ''));
  };

  return JSON.stringify({
    version: snapshot.version,
    buildVersion: snapshot.buildVersion,
    userId: snapshot.userId || null,
    movies: snapshot.movies || [],
    movieRatings: [...(snapshot.movieRatings || [])].sort(sortByMovieAndUser),
    movieRatingStats: [...(snapshot.movieRatingStats || [])].sort((firstItem, secondItem) =>
      String(firstItem?.movie_id || '').localeCompare(String(secondItem?.movie_id || ''))
    ),
    movieWatchlist: [...(snapshot.movieWatchlist || [])].sort(sortByMovieAndUser),
    reviewedMovieIds: [...(snapshot.reviewedMovieIds || [])].sort()
  });
}

function getStableStringHash(value) {
  const text = String(value || '');
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function getCatalogDataSignatureHash(snapshot, { forceRefresh = false } = {}) {
  if (!snapshot) {
    return '';
  }

  if (!forceRefresh && typeof snapshot.dataSignatureHash === 'string' && snapshot.dataSignatureHash) {
    return snapshot.dataSignatureHash;
  }

  if (!forceRefresh) {
    const cachedHash = catalogSessionSnapshotDataHashCache.get(snapshot);

    if (cachedHash) {
      return cachedHash;
    }
  }

  const signature = getCatalogSessionSnapshotSignature(snapshot);
  const nextHash = `${signature.length}:${getStableStringHash(signature)}`;

  catalogSessionSnapshotDataHashCache.set(snapshot, nextHash);

  if (typeof snapshot === 'object') {
    snapshot.dataSignatureHash = nextHash;
  }

  return nextHash;
}

function getCatalogRenderStateSignature() {
  const filterState = getCatalogFilterStateSnapshot();

  return JSON.stringify({
    userId: currentUser?.id || null,
    viewMode: viewMode?.value || 'list',
    sortMode: sortMode?.value || 'default',
    page: currentCatalogPage,
    filterState
  });
}

function readCatalogSessionSnapshot({ allowStale = false } = {}) {
  try {
    const rawSnapshot = sessionStorage.getItem(CATALOG_SESSION_SNAPSHOT_KEY);

    if (!rawSnapshot) {
      return null;
    }

    const snapshot = JSON.parse(rawSnapshot);
    const snapshotAge = Date.now() - Number(snapshot?.savedAt || 0);

    if (
      snapshot?.version !== CATALOG_SESSION_SNAPSHOT_VERSION ||
      snapshot?.buildVersion !== APP_BUILD_VERSION ||
      !Array.isArray(snapshot?.movies) ||
      (!allowStale && snapshotAge > CATALOG_SESSION_SNAPSHOT_MAX_AGE_MS)
    ) {
      sessionStorage.removeItem(CATALOG_SESSION_SNAPSHOT_KEY);
      return null;
    }

    return snapshot;
  } catch (error) {
    console.warn('Ошибка чтения снимка каталога:', error);
    sessionStorage.removeItem(CATALOG_SESSION_SNAPSHOT_KEY);
    return null;
  }
}

function writeCatalogSessionSnapshot(snapshot) {
  try {
    if (!snapshot) {
      return;
    }

    const dataSignatureHash = getCatalogDataSignatureHash(snapshot, {
      forceRefresh: true
    });

    sessionStorage.setItem(
      CATALOG_SESSION_SNAPSHOT_KEY,
      JSON.stringify({
        ...snapshot,
        dataSignatureHash,
        savedAt: Date.now()
      })
    );
  } catch (error) {
    console.warn('Ошибка сохранения снимка каталога:', error);
  }
}

function readCatalogDomSnapshot({ allowStale = false } = {}) {
  try {
    const rawSnapshot = sessionStorage.getItem(CATALOG_DOM_SNAPSHOT_KEY);

    if (!rawSnapshot) {
      return null;
    }

    const snapshot = JSON.parse(rawSnapshot);
    const snapshotAge = Date.now() - Number(snapshot?.savedAt || 0);

    if (
      snapshot?.version !== CATALOG_SESSION_SNAPSHOT_VERSION ||
      snapshot?.buildVersion !== APP_BUILD_VERSION ||
      snapshot?.viewMode !== 'list' ||
      typeof snapshot?.containerHtml !== 'string' ||
      !snapshot.containerHtml ||
      (!allowStale && snapshotAge > CATALOG_SESSION_SNAPSHOT_MAX_AGE_MS)
    ) {
      sessionStorage.removeItem(CATALOG_DOM_SNAPSHOT_KEY);
      return null;
    }

    return snapshot;
  } catch (error) {
    console.warn('Ошибка чтения DOM-снимка каталога:', error);
    sessionStorage.removeItem(CATALOG_DOM_SNAPSHOT_KEY);
    return null;
  }
}

function writeCatalogDomSnapshot(snapshot) {
  try {
    if (!snapshot) {
      sessionStorage.removeItem(CATALOG_DOM_SNAPSHOT_KEY);
      return;
    }

    sessionStorage.setItem(
      CATALOG_DOM_SNAPSHOT_KEY,
      JSON.stringify({
        ...snapshot,
        savedAt: Date.now()
      })
    );
  } catch (error) {
    console.warn('Ошибка сохранения DOM-снимка каталога:', error);
    sessionStorage.removeItem(CATALOG_DOM_SNAPSHOT_KEY);
  }
}

function createCatalogDomSnapshotPayload(sessionSnapshot = createCatalogSessionSnapshotPayload()) {
  if (
    !isCatalogPage() ||
    !container ||
    !sessionSnapshot ||
    !moviesLoadedSuccessfully ||
    viewMode?.value !== 'list' ||
    container.querySelector('.movie-card-skeleton')
  ) {
    return null;
  }

  const containerHtml = container.innerHTML;

  if (!containerHtml.trim()) {
    return null;
  }

  return {
    version: CATALOG_SESSION_SNAPSHOT_VERSION,
    buildVersion: APP_BUILD_VERSION,
    savedAt: Date.now(),
    userId: currentUser?.id || null,
    viewMode: 'list',
    renderStateSignature: getCatalogRenderStateSignature(),
    dataSignatureHash: getCatalogDataSignatureHash(sessionSnapshot),
    moviesResultCountText: moviesResultCount?.textContent || '',
    containerHtml
  };
}

function canQueueCatalogDomSnapshot() {
  return Boolean(
    isCatalogPage() &&
    container &&
    moviesLoadedSuccessfully &&
    viewMode?.value === 'list' &&
    !container.querySelector('.movie-card-skeleton')
  );
}

function canPersistCatalogDomSnapshot(sessionSnapshot) {
  return Boolean(canQueueCatalogDomSnapshot() && sessionSnapshot);
}

function cancelScheduledCatalogDomSnapshot() {
  if (!catalogDomSnapshotSchedule) {
    return;
  }

  if (
    catalogDomSnapshotSchedule.type === 'idle' &&
    typeof window.cancelIdleCallback === 'function'
  ) {
    window.cancelIdleCallback(catalogDomSnapshotSchedule.id);
  }

  if (catalogDomSnapshotSchedule.type === 'timeout') {
    clearTimeout(catalogDomSnapshotSchedule.id);
  }

  catalogDomSnapshotSchedule = null;
}

function flushCatalogDomSnapshot(sessionSnapshot = pendingCatalogDomSnapshotSessionSnapshot) {
  cancelScheduledCatalogDomSnapshot();
  pendingCatalogDomSnapshotSessionSnapshot = null;

  const nextSessionSnapshot = sessionSnapshot || createCatalogSessionSnapshotPayload();

  if (!canPersistCatalogDomSnapshot(nextSessionSnapshot)) {
    writeCatalogDomSnapshot(null);
    return;
  }

  writeCatalogDomSnapshot(createCatalogDomSnapshotPayload(nextSessionSnapshot));
}

function scheduleCatalogDomSnapshot(sessionSnapshot) {
  pendingCatalogDomSnapshotSessionSnapshot = sessionSnapshot;
  cancelScheduledCatalogDomSnapshot();

  const writePendingSnapshot = () => {
    catalogDomSnapshotSchedule = null;
    flushCatalogDomSnapshot();
  };

  if (typeof window.requestIdleCallback === 'function') {
    catalogDomSnapshotSchedule = {
      type: 'idle',
      id: window.requestIdleCallback(writePendingSnapshot, {
        timeout: CATALOG_DOM_SNAPSHOT_IDLE_TIMEOUT_MS
      })
    };
    return;
  }

  catalogDomSnapshotSchedule = {
    type: 'timeout',
    id: setTimeout(writePendingSnapshot, 120)
  };
}

function persistCatalogDomSnapshot(
  sessionSnapshot = null,
  { immediate = false } = {}
) {
  if (!isCatalogPage()) {
    return;
  }

  if (!canQueueCatalogDomSnapshot()) {
    cancelScheduledCatalogDomSnapshot();
    pendingCatalogDomSnapshotSessionSnapshot = null;
    writeCatalogDomSnapshot(null);
    return;
  }

  if (immediate) {
    flushCatalogDomSnapshot(sessionSnapshot);
    return;
  }

  scheduleCatalogDomSnapshot(sessionSnapshot);
}

function persistCatalogSessionSnapshot({ persistDomSnapshotImmediately = false } = {}) {
  if (!isCatalogPage()) {
    return;
  }

  const sessionSnapshot = createCatalogSessionSnapshotPayload();

  writeCatalogSessionSnapshot(sessionSnapshot);
  persistCatalogDomSnapshot(sessionSnapshot, {
    immediate: persistDomSnapshotImmediately
  });
}

function hydrateCatalogFromSessionSnapshot(snapshot = readCatalogSessionSnapshot()) {
  if (!snapshot) {
    return false;
  }

  const snapshotUserId = snapshot.userId || null;
  const activeUserId = currentUser?.id || null;
  const canUseUserScopedData = snapshotUserId === activeUserId;

  allMovies = snapshot.movies || [];
  moviesLoadedSuccessfully = allMovies.length > 0;
  rebuildCatalogMovieMeta();
  applyMovieRatingStatsSnapshotRows(snapshot.movieRatingStats);

  allMovieRatings = canUseUserScopedData && Array.isArray(snapshot.movieRatings)
    ? snapshot.movieRatings
    : [];
  rebuildMovieRatingIndexes();

  allMovieWatchlist = canUseUserScopedData && Array.isArray(snapshot.movieWatchlist)
    ? snapshot.movieWatchlist
    : [];
  rebuildCurrentUserWatchlistIndex();

  catalogReviewedMovieIds = new Set(
    (Array.isArray(snapshot.reviewedMovieIds) ? snapshot.reviewedMovieIds : [])
      .map(movieId => String(movieId || ''))
      .filter(Boolean)
  );

  markCatalogDataChanged();

  return moviesLoadedSuccessfully;
}

function syncCatalogSessionSnapshotMovieState(movieId, { syncReviews = false, syncMovie = null } = {}) {
  const snapshot = readCatalogSessionSnapshot({ allowStale: true });

  if (!snapshot || !movieId) {
    return;
  }

  const movieKey = String(movieId);
  const snapshotUserId = snapshot.userId || null;
  const activeUserId = currentUser?.id || null;
  const canUpdateUserScopedData = snapshotUserId === activeUserId;

  if (syncMovie) {
    snapshot.movies = (snapshot.movies || []).map(movie =>
      String(movie?.id) === movieKey ? syncMovie : movie
    );
  }

  const nextStats = movieRatingStatsByMovieId.get(movieKey);
  const movieRatingStats = (snapshot.movieRatingStats || [])
    .filter(row => String(row?.movie_id) !== movieKey);

  if (nextStats && nextStats.count > 0) {
    movieRatingStats.push({
      movie_id: movieKey,
      count: nextStats.count,
      sum: nextStats.sum,
      average: nextStats.average
    });
  }

  snapshot.movieRatingStats = movieRatingStats;

  if (canUpdateUserScopedData && currentUser) {
    const movieRatings = (snapshot.movieRatings || []).filter(row => !(
      String(row?.movie_id) === movieKey &&
      String(row?.user_id) === activeUserId
    ));
    const currentUserRating = getCurrentUserRating(movieKey);

    if (currentUserRating !== null) {
      movieRatings.push({
        movie_id: movieId,
        user_id: activeUserId,
        rating: currentUserRating
      });
    }

    snapshot.movieRatings = movieRatings;

    const movieWatchlist = (snapshot.movieWatchlist || []).filter(row => !(
      String(row?.movie_id) === movieKey &&
      String(row?.user_id) === activeUserId
    ));

    if (currentUserWatchlistMovieIds.has(movieKey)) {
      movieWatchlist.push({
        movie_id: movieId,
        user_id: activeUserId
      });
    }

    snapshot.movieWatchlist = movieWatchlist;
  }

  if (syncReviews) {
    const reviewedMovieIds = new Set(
      (snapshot.reviewedMovieIds || [])
        .map(reviewedMovieId => String(reviewedMovieId || ''))
        .filter(Boolean)
    );
    const hasReviews = allMovieReviews.some(review => String(review.movie_id) === movieKey);

    if (hasReviews) {
      reviewedMovieIds.add(movieKey);
    } else {
      reviewedMovieIds.delete(movieKey);
    }

    snapshot.reviewedMovieIds = Array.from(reviewedMovieIds);
  }

  writeCatalogSessionSnapshot(snapshot);
}

function removeMovieFromCatalogSessionSnapshot(movieId) {
  const snapshot = readCatalogSessionSnapshot({ allowStale: true });

  if (!snapshot || !movieId) {
    return;
  }

  const movieKey = String(movieId);

  snapshot.movies = (snapshot.movies || []).filter(movie => String(movie?.id) !== movieKey);
  snapshot.movieRatings = (snapshot.movieRatings || []).filter(row => String(row?.movie_id) !== movieKey);
  snapshot.movieRatingStats = (snapshot.movieRatingStats || []).filter(row => String(row?.movie_id) !== movieKey);
  snapshot.movieWatchlist = (snapshot.movieWatchlist || []).filter(row => String(row?.movie_id) !== movieKey);
  snapshot.reviewedMovieIds = (snapshot.reviewedMovieIds || []).filter(reviewedMovieId =>
    String(reviewedMovieId) !== movieKey
  );

  writeCatalogSessionSnapshot(snapshot);
}

function getMovieFromCatalogSessionSnapshot(routeParams, snapshot = readCatalogSessionSnapshot()) {
  if (!routeParams || !snapshot || !Array.isArray(snapshot.movies)) {
    return null;
  }

  if (routeParams.slug) {
    return snapshot.movies.find(movie => String(movie?.slug || '') === String(routeParams.slug)) || null;
  }

  if (routeParams.id) {
    return snapshot.movies.find(movie => String(movie?.id || '') === String(routeParams.id)) || null;
  }

  return null;
}

function hydrateMoviePageFromCatalogSnapshot(routeParams) {
  const snapshot = readCatalogSessionSnapshot();
  const snapshotMovie = getMovieFromCatalogSessionSnapshot(routeParams, snapshot);

  if (!snapshotMovie) {
    return null;
  }

  hydrateCatalogFromSessionSnapshot(snapshot);
  allMovieReviews = [];

  return getCatalogMovieById(snapshotMovie.id) || snapshotMovie;
}

function bindRestoredCatalogPosterLoadStates() {
  if (!container) {
    return;
  }

  container.querySelectorAll('.movie-poster').forEach(posterImage => {
    const posterSkeleton = posterImage
      .closest('.movie-poster-wrapper')
      ?.querySelector('.movie-poster-skeleton');

    bindPosterLoadState(posterImage, posterSkeleton);
  });
}

function bindRestoredCatalogDomState() {
  bindRestoredCatalogPosterLoadStates();
  bindCatalogEmptyStateEvents();

  requestAnimationFrame(syncOpenExternalLinksLayouts);
}

function hydrateCatalogDomFromSessionSnapshot(sessionSnapshot) {
  if (!container || !sessionSnapshot || viewMode?.value !== 'list') {
    return false;
  }

  const domSnapshot = readCatalogDomSnapshot();

  if (!domSnapshot) {
    return false;
  }

  const isSameUser = (domSnapshot.userId || null) === (currentUser?.id || null);
  const hasSameData = domSnapshot.dataSignatureHash === getCatalogDataSignatureHash(sessionSnapshot);
  const hasSameRenderState = domSnapshot.renderStateSignature === getCatalogRenderStateSignature();

  if (!isSameUser || !hasSameData || !hasSameRenderState) {
    return false;
  }

  renderActiveFilterChips();
  syncQuickPresetButtons();

  const { paginationState, pageMovies } = getCatalogDerivedState();

  if (moviesResultCount) {
    moviesResultCount.textContent = domSnapshot.moviesResultCountText || getMoviesResultCountText(
      paginationState.totalItems,
      paginationState
    );
  }

  updateCatalogStructuredData(pageMovies, paginationState);
  renderCatalogPagination(paginationState);
  container.classList.remove('is-catalog-fading', 'is-catalog-visible');
  container.innerHTML = domSnapshot.containerHtml;
  bindRestoredCatalogDomState();

  return true;
}

function getMoviePageTopRenderSignature(movie) {
  if (!movie) {
    return '';
  }

  const movieId = String(movie.id);
  const ratingStats = movieRatingStatsByMovieId.get(movieId) || null;

  return JSON.stringify({
    userId: currentUser?.id || null,
    isAdmin,
    movie,
    ratingStats,
    currentUserRating: getCurrentUserRating(movieId),
    userMovieState: getCurrentUserMovieState(movieId)
  });
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
let appResizeSyncFrameId = null;

function invalidateCatalogDerivedState({ bumpDataVersion = false } = {}) {
  if (bumpDataVersion) {
    catalogDataVersion += 1;
  }

  catalogDerivedStateCache = null;
}

function markCatalogDataChanged() {
  invalidateCatalogDerivedState({ bumpDataVersion: true });
}

function resetCatalogPaginationPage() {
  currentCatalogPage = 1;
}

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

function prepareCatalogStateForDeferredRender({ resetPage = false } = {}) {
  if (resetPage) {
    resetCatalogPaginationPage();
  }

  saveCatalogScrollPosition();
  saveCatalogAnchorMovieId();
  saveCatalogState();
}

function applyCatalogViewModeChange() {
  resetCatalogPaginationPage();
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
        withReviews: reviewedOnlyFilter,
        watchlist: currentUser ? watchlistFilter.value : '',
        watched: currentUser ? watchedFilter.value : '',
        viewMode: viewMode.value,
        sortMode: sortMode.value,
        page: currentCatalogPage
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
      reviewedOnlyFilter = Boolean(catalogState.withReviews);
      watchlistFilter.value = currentUser ? (catalogState.watchlist || '') : '';
      watchedFilter.value = currentUser ? (catalogState.watched || '') : '';

      viewMode.value = catalogState.viewMode || 'list';
      sortMode.value = catalogState.sortMode || 'default';
      currentCatalogPage = Math.max(1, Number(catalogState.page) || 1);
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

function withAuthRequestTimeout(promise, timeoutMessage, timeoutMs = AUTH_REQUEST_TIMEOUT_MS) {
  return withPendingRequestTimeout(promise, timeoutMs, timeoutMessage);
}

function withAuthProfileRequestTimeout(promise, timeoutMessage) {
  return withAuthRequestTimeout(promise, timeoutMessage, AUTH_PROFILE_REQUEST_TIMEOUT_MS);
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

function normalizeLetterboxdShortUrl(value) {
  const normalizedUrl = normalizeOptionalUrl(value);

  if (!normalizedUrl) {
    return '';
  }

  const shortUrlMatch = normalizedUrl.match(/^https?:\/\/(?:www\.)?boxd\.it\/([A-Za-z0-9]+)/i);

  return shortUrlMatch
    ? `https://boxd.it/${shortUrlMatch[1]}`
    : normalizedUrl;
}

function areStringArraysEqual(firstArray, secondArray) {
  if (firstArray.length !== secondArray.length) {
    return false;
  }

  return firstArray.every((item, index) => item === secondArray[index]);
}

function normalizeObjectForComparison(value) {
  if (Array.isArray(value)) {
    return value.map(item => normalizeObjectForComparison(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce((result, key) => {
      result[key] = normalizeObjectForComparison(value[key]);
      return result;
    }, {});
}

function areObjectsEqual(firstValue, secondValue) {
  return JSON.stringify(normalizeObjectForComparison(firstValue)) ===
    JSON.stringify(normalizeObjectForComparison(secondValue));
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
    const { data, error } = await withAuthProfileRequestTimeout(
      supabaseClient
        .from('profiles')
        .select('role, display_name, default_display_name')
        .eq('id', currentUser.id)
        .single(),
      'Не удалось загрузить профиль пользователя. Проверь соединение и попробуй обновить страницу.'
    );

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

function getMovieUserRatingKey(movieId, userId) {
  return `${String(movieId)}::${String(userId)}`;
}

function rebuildMovieRatingIndexes() {
  movieRatingByMovieAndUserKey = new Map();
  currentUserRatingsByMovieId = new Map();

  allMovieRatings.forEach(item => {
    const movieId = String(item.movie_id ?? '');

    if (!movieId) {
      return;
    }

    if (item.user_id) {
      movieRatingByMovieAndUserKey.set(
        getMovieUserRatingKey(movieId, item.user_id),
        Number(item.rating || 0)
      );
    }

    if (currentUser && String(item.user_id) === String(currentUser.id)) {
      currentUserRatingsByMovieId.set(movieId, Number(item.rating || 0));
    }
  });
}

function setKnownMovieRatingRows(rows) {
  allMovieRatings = Array.isArray(rows) ? rows : [];
  rebuildMovieRatingIndexes();
  markCatalogDataChanged();
}

function upsertKnownMovieRatingRows(rows, shouldRemoveExisting = null) {
  const nextRowsByKey = new Map();

  allMovieRatings.forEach(row => {
    if (typeof shouldRemoveExisting === 'function' && shouldRemoveExisting(row)) {
      return;
    }

    nextRowsByKey.set(getMovieUserRatingKey(row.movie_id, row.user_id), row);
  });

  (Array.isArray(rows) ? rows : []).forEach(row => {
    if (!row?.movie_id || !row?.user_id) {
      return;
    }

    nextRowsByKey.set(getMovieUserRatingKey(row.movie_id, row.user_id), row);
  });

  allMovieRatings = Array.from(nextRowsByKey.values());
  rebuildMovieRatingIndexes();
  markCatalogDataChanged();
}

function removeKnownMovieRatingRows(shouldRemove) {
  if (typeof shouldRemove !== 'function') {
    return;
  }

  allMovieRatings = allMovieRatings.filter(row => !shouldRemove(row));
  rebuildMovieRatingIndexes();
  markCatalogDataChanged();
}

function applyMovieRatingStatsRows(rows) {
  movieRatingStatsByMovieId = new Map();

  (Array.isArray(rows) ? rows : []).forEach(row => {
    const movieId = String(row.movie_id ?? '');
    const count = Number(row.votes_count ?? row.count ?? 0);

    if (!movieId || count <= 0) {
      return;
    }

    const average = Number(row.average_rating ?? row.avg_rating ?? 0);
    const sum = Number(row.rating_sum ?? average * count);

    movieRatingStatsByMovieId.set(movieId, {
      count,
      sum,
      average: Number(average.toFixed(1))
    });
  });

  markCatalogDataChanged();
}

function applyMovieRatingStatsFromRows(rows) {
  const statsByMovieId = new Map();

  (Array.isArray(rows) ? rows : []).forEach(row => {
    const movieId = String(row.movie_id ?? '');

    if (!movieId) {
      return;
    }

    const stats = statsByMovieId.get(movieId) || {
      count: 0,
      sum: 0,
      average: 0
    };

    stats.count += 1;
    stats.sum += Number(row.rating || 0);
    stats.average = Number((stats.sum / stats.count).toFixed(1));
    statsByMovieId.set(movieId, stats);
  });

  movieRatingStatsByMovieId = statsByMovieId;
  markCatalogDataChanged();
}

function updateLocalMovieRatingStats(movieId, nextRating, previousRating = null) {
  const movieKey = String(movieId);
  const hadPreviousRating = previousRating !== null && previousRating !== undefined;
  const hasNextRating = nextRating !== null && nextRating !== undefined;
  const previousStats = movieRatingStatsByMovieId.get(movieKey) || {
    count: 0,
    sum: 0,
    average: 0
  };

  let nextCount = previousStats.count;
  let nextSum = previousStats.sum;

  if (hadPreviousRating) {
    nextCount = Math.max(0, nextCount - 1);
    nextSum = Math.max(0, nextSum - Number(previousRating || 0));
  }

  if (hasNextRating) {
    nextCount += 1;
    nextSum += Number(nextRating || 0);
  }

  if (nextCount === 0) {
    movieRatingStatsByMovieId.delete(movieKey);
    markCatalogDataChanged();
    return;
  }

  movieRatingStatsByMovieId.set(movieKey, {
    count: nextCount,
    sum: nextSum,
    average: Number((nextSum / nextCount).toFixed(1))
  });
  markCatalogDataChanged();
}

const LETTERBOXD_IMPORT_FIELD_ALIASES = {
  name: ['name', 'title'],
  year: ['year', 'releaseyear', 'releasedate'],
  rating: ['rating', 'yourrating', 'stars'],
  uri: ['letterboxduri', 'letterboxdurl', 'letterboxdlink', 'url', 'uri']
};

const LETTERBOXD_IMPORT_PREVIEW_LIMIT = 8;
const LETTERBOXD_IMPORT_QUERY_CHUNK_SIZE = 200;

function reportLetterboxdRatingsImportProgress(options, message) {
  if (typeof options?.onProgress === 'function') {
    options.onProgress(message);
  }
}

function formatImportFileSize(bytes) {
  const fileSize = Number(bytes || 0);

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return '';
  }

  if (fileSize < 1024) {
    return `${fileSize} Б`;
  }

  return `${Math.round(fileSize / 1024)} КБ`;
}

function getFileImportToken(file) {
  if (!file) {
    return '';
  }

  return [
    file.name || '',
    file.size || 0,
    file.lastModified || 0
  ].join(':');
}

function parseCsvRows(csvText) {
  const text = String(csvText || '').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let isInsideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (isInsideQuotes && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        isInsideQuotes = !isInsideQuotes;
      }

      continue;
    }

    if (char === ',' && !isInsideQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !isInsideQuotes) {
      if (char === '\r' && text[index + 1] === '\n') {
        index += 1;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);

  if (row.some(cell => String(cell || '').trim())) {
    rows.push(row);
  }

  return rows.filter(csvRow => csvRow.some(cell => String(cell || '').trim()));
}

function normalizeCsvHeader(value) {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, '');
}

function parseCsvObjects(csvText) {
  const rows = parseCsvRows(csvText);
  const [headerRow = [], ...dataRows] = rows;
  const headers = headerRow.map(normalizeCsvHeader);

  return {
    headers,
    rows: dataRows.map((cells, index) => {
      const fields = {};

      headers.forEach((header, headerIndex) => {
        if (header) {
          fields[header] = cells[headerIndex] ?? '';
        }
      });

      return {
        rowNumber: index + 2,
        fields
      };
    })
  };
}

function getCsvField(row, aliases) {
  const fields = row?.fields || {};

  for (const alias of aliases) {
    const normalizedAlias = normalizeCsvHeader(alias);

    if (Object.prototype.hasOwnProperty.call(fields, normalizedAlias)) {
      return String(fields[normalizedAlias] || '').trim();
    }
  }

  return '';
}

function hasCsvColumn(parsedCsv, aliases) {
  const headerSet = new Set(parsedCsv.headers || []);

  return aliases.some(alias => headerSet.has(normalizeCsvHeader(alias)));
}

function normalizeImportedRatingScore(score) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore) || numericScore <= 0) {
    return null;
  }

  return Math.min(10, Math.max(1, Math.round(numericScore)));
}

function parseLetterboxdRatingValue(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return null;
  }

  const starCount = (rawValue.match(/★/g) || []).length;
  const hasHalfStar = rawValue.includes('½') || /(^|\D)1\/2($|\D)/.test(rawValue);

  if (starCount > 0 || hasHalfStar) {
    return normalizeImportedRatingScore((starCount * 2) + (hasHalfStar ? 1 : 0));
  }

  const normalizedValue = rawValue.replace(',', '.');
  const fractionMatch = normalizedValue.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);

  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
      return null;
    }

    return normalizeImportedRatingScore((numerator / denominator) * 10);
  }

  const numericMatch = normalizedValue.match(/-?\d+(?:\.\d+)?/);

  if (!numericMatch) {
    return null;
  }

  const numericRating = Number(numericMatch[0]);
  const ratingScore = numericRating <= 5
    ? numericRating * 2
    : numericRating;

  return normalizeImportedRatingScore(ratingScore);
}

function normalizeLetterboxdImportUri(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return '';
  }

  try {
    const url = new URL(/^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    const path = url.pathname.replace(/\/+$/g, '').toLowerCase();

    return `${host}${path}`;
  } catch (error) {
    return rawValue
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/[?#].*$/, '')
      .replace(/\/+$/g, '');
  }
}

function normalizeLetterboxdImportTitle(value) {
  const withoutDiacritics = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  return normalizeSearchText(withoutDiacritics)
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9а-яё\s]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLetterboxdImportTitleVariants(value) {
  const normalizedTitle = normalizeLetterboxdImportTitle(value);
  const variants = new Set();

  if (normalizedTitle) {
    variants.add(normalizedTitle);

    const articlelessTitle = normalizedTitle.replace(/^(the|a|an)\s+/, '');

    if (articlelessTitle) {
      variants.add(articlelessTitle);
    }
  }

  return Array.from(variants);
}

function parseLetterboxdImportYear(value) {
  const year = Number.parseInt(String(value || '').trim(), 10);

  return Number.isInteger(year) && year > 1800
    ? year
    : null;
}

function getMovieImportYear(movie) {
  return parseLetterboxdImportYear(movie?.year ?? movie?.release_year);
}

function getMovieLetterboxdImportTitles(movie) {
  const titles = [
    movie?.title,
    movie?.original_title,
    ...(Array.isArray(movie?.search_aliases) ? movie.search_aliases : [])
  ];

  return titles.filter(Boolean);
}

function addMovieToLetterboxdImportIndex(indexMap, key, movie) {
  if (!key || !movie?.id) {
    return;
  }

  const bucket = indexMap.get(key) || [];

  if (!bucket.some(item => String(item.id) === String(movie.id))) {
    bucket.push(movie);
  }

  indexMap.set(key, bucket);
}

function getMovieLetterboxdImportUris(movie) {
  return [
    movie?.letterboxd_short_url,
    movie?.letterboxd_url
  ].filter(Boolean);
}

function buildLetterboxdImportMovieIndex(movies) {
  const index = {
    uri: new Map(),
    titleYear: new Map(),
    title: new Map()
  };

  (Array.isArray(movies) ? movies : []).forEach(movie => {
    const movieYear = getMovieImportYear(movie);

    getMovieLetterboxdImportUris(movie).forEach(uri => {
      addMovieToLetterboxdImportIndex(index.uri, normalizeLetterboxdImportUri(uri), movie);
    });

    getMovieLetterboxdImportTitles(movie).forEach(title => {
      getLetterboxdImportTitleVariants(title).forEach(titleVariant => {
        addMovieToLetterboxdImportIndex(index.title, titleVariant, movie);

        if (movieYear) {
          addMovieToLetterboxdImportIndex(index.titleYear, `${titleVariant}::${movieYear}`, movie);
        }
      });
    });
  });

  return index;
}

function getUniqueLetterboxdImportIndexMatch(indexMap, key) {
  const matches = indexMap.get(key) || [];

  return matches.length === 1
    ? matches[0]
    : null;
}

function matchLetterboxdImportRowToMovie(row, movieIndex) {
  const uri = normalizeLetterboxdImportUri(getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.uri));
  const uriMatch = getUniqueLetterboxdImportIndexMatch(movieIndex.uri, uri);

  if (uriMatch) {
    return {
      movie: uriMatch,
      matchType: 'letterboxd_uri'
    };
  }

  const title = getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.name);
  const year = parseLetterboxdImportYear(getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.year));
  const titleVariants = getLetterboxdImportTitleVariants(title);

  if (!titleVariants.length) {
    return null;
  }

  if (year) {
    for (const titleVariant of titleVariants) {
      const titleYearMatch = getUniqueLetterboxdImportIndexMatch(
        movieIndex.titleYear,
        `${titleVariant}::${year}`
      );

      if (titleYearMatch) {
        return {
          movie: titleYearMatch,
          matchType: 'title_year'
        };
      }
    }

    return null;
  }

  for (const titleVariant of titleVariants) {
    const titleMatch = getUniqueLetterboxdImportIndexMatch(movieIndex.title, titleVariant);

    if (titleMatch) {
      return {
        movie: titleMatch,
        matchType: 'title'
      };
    }
  }

  return null;
}

async function fetchCurrentUserRatingsForMovieIds(movieIds, userId) {
  if (!movieIds.length || !userId) {
    return [];
  }

  const rows = [];

  for (let index = 0; index < movieIds.length; index += LETTERBOXD_IMPORT_QUERY_CHUNK_SIZE) {
    const chunk = movieIds.slice(index, index + LETTERBOXD_IMPORT_QUERY_CHUNK_SIZE);
    const { data, error } = await supabaseClient
      .from('movie_ratings')
      .select('movie_id, user_id, rating')
      .eq('user_id', userId)
      .in('movie_id', chunk);

    throwIfSupabaseError(error);
    rows.push(...(data || []));
  }

  return rows;
}

function getLetterboxdImportMovieLabel(movie) {
  const title = movie?.title || movie?.original_title || 'Фильм без названия';
  const year = getMovieImportYear(movie);

  return year
    ? `${title} (${year})`
    : title;
}

function applyLetterboxdRatingsImportLocally(insertedRows) {
  const normalizedRows = (Array.isArray(insertedRows) ? insertedRows : [])
    .filter(row => row?.movie_id && row?.user_id)
    .map(row => ({
      movie_id: row.movie_id,
      user_id: row.user_id,
      rating: Number(row.rating)
    }));

  if (!normalizedRows.length) {
    return;
  }

  upsertKnownMovieRatingRows(normalizedRows);

  normalizedRows.forEach(row => {
    updateLocalMovieRatingStats(row.movie_id, row.rating, null);
    syncCatalogSessionSnapshotMovieState(row.movie_id);
  });
}

function syncUiAfterLetterboxdRatingsImport(movieIds) {
  const importedMovieIds = (Array.isArray(movieIds) ? movieIds : []).map(movieId => String(movieId));

  if (!importedMovieIds.length) {
    return;
  }

  if (
    isMoviePage() &&
    currentMoviePageMovieData &&
    importedMovieIds.includes(String(currentMoviePageMovieId))
  ) {
    renderMoviePage(currentMoviePageMovieData);
    return;
  }

  if (!isCatalogPage() || !container) {
    return;
  }

  if (shouldRenderFullCatalogAfterRatingChange()) {
    rerenderCatalogAfterDataReload(importedMovieIds[0]);
    return;
  }

  importedMovieIds.forEach(movieId => {
    const existingCard = container.querySelector(`[data-movie-id="${movieId}"]`);

    if (existingCard) {
      rerenderMovieCard(movieId, {
        preserveCardTop: false,
        animateStateAppearance: false
      });
    }
  });
}

async function importLetterboxdRatingsFromCsvText(csvText, options = {}) {
  const activeUser = ensureActiveSessionForWrite();
  const parsedCsv = parseCsvObjects(csvText);

  if (!parsedCsv.headers.length || !parsedCsv.rows.length) {
    return {
      status: 'empty_file',
      totalRows: 0,
      ratingRowsCount: 0,
      matchedCount: 0,
      insertedCount: 0,
      alreadyRatedCount: 0,
      unmatchedItems: [],
      invalidRatingRows: [],
      duplicateRowsCount: 0,
      addedItems: []
    };
  }

  reportLetterboxdRatingsImportProgress(
    options,
    `CSV распознан: строк ${parsedCsv.rows.length}. Проверяю колонку Rating...`
  );

  if (!hasCsvColumn(parsedCsv, LETTERBOXD_IMPORT_FIELD_ALIASES.rating)) {
    return {
      status: 'missing_rating_column',
      totalRows: parsedCsv.rows.length,
      ratingRowsCount: 0,
      matchedCount: 0,
      insertedCount: 0,
      alreadyRatedCount: 0,
      unmatchedItems: [],
      invalidRatingRows: [],
      duplicateRowsCount: 0,
      addedItems: []
    };
  }

  if (!moviesLoadedSuccessfully || !allMovies.length) {
    reportLetterboxdRatingsImportProgress(
      options,
      'Загружаю каталог для сопоставления оценок...'
    );

    const moviesLoaded = await fetchMovies({ preserveExistingCatalogOnError: true });

    if (!moviesLoaded) {
      throw new Error('Не удалось загрузить каталог для сопоставления оценок.');
    }
  }

  const movieIndex = buildLetterboxdImportMovieIndex(allMovies);
  const matchedRowsByMovieId = new Map();
  const unmatchedItems = [];
  const invalidRatingRows = [];
  let ratingRowsCount = 0;
  let duplicateRowsCount = 0;

  parsedCsv.rows.forEach(row => {
    const rating = parseLetterboxdRatingValue(
      getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.rating)
    );
    const title = getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.name);
    const year = getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.year);

    if (rating === null) {
      invalidRatingRows.push({
        rowNumber: row.rowNumber,
        title,
        year
      });
      return;
    }

    ratingRowsCount += 1;

    const match = matchLetterboxdImportRowToMovie(row, movieIndex);

    if (!match?.movie) {
      unmatchedItems.push({
        rowNumber: row.rowNumber,
        title,
        year,
        rating
      });
      return;
    }

    const movieId = String(match.movie.id);

    if (matchedRowsByMovieId.has(movieId)) {
      duplicateRowsCount += 1;
      return;
    }

    matchedRowsByMovieId.set(movieId, {
      movie: match.movie,
      rating,
      matchType: match.matchType,
      sourceTitle: title,
      sourceYear: year
    });
  });

  const matchedRows = Array.from(matchedRowsByMovieId.values());
  const matchedMovieIds = matchedRows.map(item => item.movie.id);

  reportLetterboxdRatingsImportProgress(
    options,
    `Распознано оценок: ${ratingRowsCount}. Найдено в каталоге: ${matchedRows.length}. Проверяю уже выставленные оценки...`
  );

  const freshCurrentUserRatings = await fetchCurrentUserRatingsForMovieIds(
    matchedMovieIds,
    activeUser.id
  );
  const alreadyRatedMovieIds = new Set([
    ...Array.from(currentUserRatingsByMovieId.keys()),
    ...freshCurrentUserRatings.map(row => String(row.movie_id))
  ]);
  const rowsToInsert = matchedRows.filter(item => !alreadyRatedMovieIds.has(String(item.movie.id)));
  const alreadyRatedCount = matchedRows.length - rowsToInsert.length;

  if (!rowsToInsert.length) {
    return {
      status: 'no_updates',
      totalRows: parsedCsv.rows.length,
      ratingRowsCount,
      matchedCount: matchedRows.length,
      insertedCount: 0,
      alreadyRatedCount,
      unmatchedItems,
      invalidRatingRows,
      duplicateRowsCount,
      addedItems: []
    };
  }

  const insertRows = rowsToInsert.map(item => ({
    movie_id: item.movie.id,
    user_id: activeUser.id,
    rating: item.rating
  }));

  reportLetterboxdRatingsImportProgress(
    options,
    `Записываю новые оценки: ${insertRows.length}...`
  );

  const { data, error } = await supabaseClient
    .from('movie_ratings')
    .upsert(insertRows, {
      onConflict: 'movie_id,user_id',
      ignoreDuplicates: true
    })
    .select('movie_id, user_id, rating');

  throwIfSupabaseError(error);

  const insertedRows = data || [];
  const insertedRowsByMovieId = new Set(insertedRows.map(row => String(row.movie_id)));
  const addedItems = rowsToInsert
    .filter(item => insertedRowsByMovieId.has(String(item.movie.id)))
    .map(item => ({
      movie: item.movie,
      rating: item.rating
    }));

  applyLetterboxdRatingsImportLocally(insertedRows);
  syncUiAfterLetterboxdRatingsImport(insertedRows.map(row => row.movie_id));

  return {
    status: 'updated',
    totalRows: parsedCsv.rows.length,
    ratingRowsCount,
    matchedCount: matchedRows.length,
    insertedCount: insertedRows.length,
    alreadyRatedCount,
    unmatchedItems,
    invalidRatingRows,
    duplicateRowsCount,
    addedItems
  };
}

function formatLetterboxdRatingsImportMessage(result) {
  if (result.status === 'empty_file') {
    return 'CSV Letterboxd пустой или не содержит строк для импорта.';
  }

  if (result.status === 'missing_rating_column') {
    return 'В CSV Letterboxd нет колонки Rating. Похоже, это экспорт watched/watchlist без оценок; для импорта нужен файл с оценками.';
  }

  if (result.ratingRowsCount === 0) {
    return 'В CSV Letterboxd есть колонка Rating, но распознаваемых оценок не найдено.';
  }

  const skippedParts = [];

  if (result.alreadyRatedCount > 0) {
    skippedParts.push(`уже были оценены: ${result.alreadyRatedCount}`);
  }

  if (result.unmatchedItems.length > 0) {
    skippedParts.push(`не найдены в каталоге: ${result.unmatchedItems.length}`);
  }

  if (result.invalidRatingRows.length > 0) {
    skippedParts.push(`без распознаваемой оценки: ${result.invalidRatingRows.length}`);
  }

  if (result.duplicateRowsCount > 0) {
    skippedParts.push(`дубли в файле: ${result.duplicateRowsCount}`);
  }

  const skippedText = skippedParts.length
    ? ` Пропущено: ${skippedParts.join(', ')}.`
    : '';

  if (result.insertedCount <= 0) {
    return `Импорт Letterboxd завершён: новых оценок нет. Распознано оценок: ${result.ratingRowsCount}, найдено в каталоге: ${result.matchedCount}.${skippedText}`;
  }

  const preview = result.addedItems
    .slice(0, LETTERBOXD_IMPORT_PREVIEW_LIMIT)
    .map(item => `${getLetterboxdImportMovieLabel(item.movie)} — ${item.rating}/10`);
  const moreCount = Math.max(0, result.addedItems.length - LETTERBOXD_IMPORT_PREVIEW_LIMIT);
  const previewText = preview.length
    ? `: ${preview.join(', ')}${moreCount > 0 ? ` и ещё ${moreCount}` : ''}`
    : '';

  return `Импорт Letterboxd завершён: добавлено ${result.insertedCount} из ${result.ratingRowsCount} распознанных оценок; найдено в каталоге: ${result.matchedCount}${previewText}.${skippedText}`;
}

function setLetterboxdRatingsImportingState(isImporting) {
  isLetterboxdRatingsImporting = isImporting;

  if (!importLetterboxdRatingsButton) {
    return;
  }

  importLetterboxdRatingsButton.disabled = isImporting;
  importLetterboxdRatingsButton.textContent = isImporting
    ? 'Импортирую оценки...'
    : 'Импорт оценок Letterboxd';
}

async function handleLetterboxdRatingsFileChange(event) {
  const file = event.target?.files?.[0] || null;

  if (isLetterboxdRatingsImporting) {
    return;
  }

  if (!file) {
    showAppMessage('Файл не выбран. Попробуй выбрать ratings.csv ещё раз.', 'info', true);
    return;
  }

  const fileToken = getFileImportToken(file);

  if (fileToken && fileToken === lastLetterboxdRatingsImportFileToken) {
    return;
  }

  lastLetterboxdRatingsImportFileToken = fileToken;

  closeAuthPopoverMenu();
  setLetterboxdRatingsImportingState(true);
  const fileSizeText = formatImportFileSize(file.size);
  const fileLabel = [file.name, fileSizeText].filter(Boolean).join(', ');

  showAppMessage(`Файл выбран: ${fileLabel}. Читаю CSV...`, 'info');

  try {
    const csvText = await file.text();

    showAppMessage(`Файл прочитан: ${file.name}. Проверяю структуру...`, 'info');

    const importResult = await importLetterboxdRatingsFromCsvText(csvText, {
      onProgress: message => showAppMessage(message, 'info')
    });

    console.info('Letterboxd ratings import result:', importResult);
    showAppMessage(
      formatLetterboxdRatingsImportMessage(importResult),
      importResult.insertedCount > 0 ? 'success' : 'info',
      false,
      { showAction: true }
    );
  } catch (error) {
    console.error('Ошибка импорта оценок Letterboxd:', error);
    showAppMessage(
      error?.message || 'Не удалось импортировать оценки Letterboxd. Проверь файл и попробуй снова.',
      'error',
      true
    );
  } finally {
    setLetterboxdRatingsImportingState(false);

    if (letterboxdRatingsFileInput) {
      letterboxdRatingsFileInput.value = '';
    }
  }
}

function rebuildCurrentUserWatchlistIndex() {
  currentUserWatchlistMovieIds = new Set();

  if (!currentUser) {
    return;
  }

  allMovieWatchlist.forEach(item => {
    if (String(item.user_id) === String(currentUser.id)) {
      currentUserWatchlistMovieIds.add(String(item.movie_id));
    }
  });
}

function getCurrentUserMovieState(movieId) {
  if (!shouldUseAuthenticatedUi()) {
    return {
      hasWatchlistRecord: false,
      isWatched: false,
      isInWatchlist: false
    };
  }

  const hasWatchlistRecord = currentUserWatchlistMovieIds.has(String(movieId));
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
    String(item.movie_id) === String(movieId) &&
    String(item.user_id) === String(currentUser.id)
  ));

  if (shouldExist) {
    if (existingRecordIndex === -1) {
      allMovieWatchlist.push({
        movie_id: movieId,
        user_id: currentUser.id
      });
    }

    currentUserWatchlistMovieIds.add(String(movieId));
    markCatalogDataChanged();
    return;
  }

  if (existingRecordIndex !== -1) {
    allMovieWatchlist.splice(existingRecordIndex, 1);
  }

  currentUserWatchlistMovieIds.delete(String(movieId));
  markCatalogDataChanged();
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

  return Number(
    movieRatingByMovieAndUserKey.get(getMovieUserRatingKey(movieId, userId)) ?? 0
  );
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

function getCatalogMovieMeta(movie) {
  const movieId = String(movie?.id ?? '');

  if (movieId && catalogMovieMetaById.has(movieId)) {
    return catalogMovieMetaById.get(movieId);
  }

  return buildCatalogMovieMeta(movie);
}

function getCatalogMovieById(movieId) {
  return catalogMoviesById.get(String(movieId)) || null;
}

function buildCatalogMovieMeta(movie) {
  const movieGenres = Array.isArray(movie?.movie_genres) ? movie.movie_genres : [];
  const movieCountries = Array.isArray(movie?.movie_countries) ? movie.movie_countries : [];
  const genreNames = movieGenres
    .map(item => item?.genres?.name)
    .filter(Boolean);
  const countryNames = movieCountries
    .map(item => item?.countries?.name)
    .filter(Boolean);
  const searchAliases = Array.isArray(movie?.search_aliases)
    ? movie.search_aliases.filter(Boolean)
    : [];
  const searchAliasEntries = searchAliases.map(alias => ({
    alias,
    normalizedAlias: normalizeSearchText(alias)
  }));
  const subgenreKeys = Array.isArray(movie?.tags_perceived)
    ? movie.tags_perceived.filter(Boolean)
    : [];
  const genresText = genreNames.join(', ');
  const countriesText = countryNames.join(', ');
  const filterableGenreNames = genreNames.filter(genreName =>
    normalizeSearchText(genreName) !== BASE_HORROR_GENRE_NORMALIZED
  );

  return {
    genreNames: new Set(genreNames),
    filterableGenreNames: new Set(filterableGenreNames),
    countryNames: new Set(countryNames),
    genresText,
    countriesText,
    subgenreKeys: new Set(subgenreKeys),
    formatKeys: new Set(Array.isArray(movie?.formats) ? movie.formats.filter(Boolean) : []),
    searchAliasEntries,
    visibleSearchTexts: [
      movie?.title,
      movie?.original_title,
      movie?.director
    ].map(value => normalizeSearchText(value)),
    searchableText: normalizeSearchText([
      movie?.title,
      movie?.original_title,
      movie?.director,
      ...searchAliases
    ].join(' ')),
    cardRender: buildCatalogMovieCardRenderMeta(movie, genresText, countriesText)
  };
}

function buildCatalogMovieCardRenderMeta(movie, genresText, countriesText) {
  const titleText = String(movie?.title || '');
  const originalTitleText = String(movie?.original_title || '');
  const directorText = String(movie?.director || '');
  const escapedTitle = escapeHtml(titleText);
  const escapedOriginalTitle = escapeHtml(originalTitleText);
  const escapedDirector = directorText ? escapeHtml(directorText) : '-';
  const escapedGenres = escapeHtml(genresText || '-');
  const escapedCountries = escapeHtml(countriesText || '-');
  const pageUrl = buildMoviePageUrl(movie);
  const externalLinksHtml = getMovieExternalLinksHtml(movie);
  const hasExternalLinks = externalLinksHtml !== '';
  const externalLinksToggleHtml = hasExternalLinks
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
    : '';
  const externalLinksBlockHtml = hasExternalLinks
    ? `
      <div class="movie-external-links-collapsible" data-external-links-collapsible>
        ${externalLinksHtml}
      </div>
    `
    : '';

  return {
    titleText,
    originalTitleText,
    directorText,
    posterUrl: movie?.poster_url || '',
    pageUrl,
    escapedTitle,
    escapedOriginalTitle,
    escapedDirector,
    escapedGenres,
    escapedCountries,
    escapedPosterAlt: escapeHtml(`Постер фильма ${titleText}`),
    escapedPageLabel: escapeHtml(`Открыть страницу фильма ${titleText}`),
    externalLinksToggleHtml,
    externalLinksBlockHtml,
    staticDetailsHtml: `
      <h5 class="movie-title">
        <a href="${pageUrl}" class="movie-title-link">${escapedTitle}</a>
      </h5>

      ${originalTitleText ? `<p>Оригинальное название: ${escapedOriginalTitle}</p>` : ''}
      <p>Год: ${escapeHtml(movie?.year ?? '-')}</p>
      <p>Режиссёр: ${escapedDirector}</p>
      <p>Жанры: ${escapedGenres}</p>
      <p>Страны: ${escapedCountries}</p>
    `
  };
}

function rebuildCatalogMovieMeta() {
  const movies = Array.isArray(allMovies) ? allMovies : [];
  const catalogGenreNames = new Set();
  const catalogCountryNames = new Set();
  const catalogYearValues = new Set();

  catalogMoviesById = new Map();
  catalogMovieMetaById = new Map();
  catalogSortedMoviesByMode = {
    default: [],
    oldest: []
  };

  movies.forEach(movie => {
    const movieId = String(movie.id);
    const meta = buildCatalogMovieMeta(movie);

    catalogMoviesById.set(movieId, movie);
    catalogMovieMetaById.set(movieId, meta);

    meta.filterableGenreNames.forEach(genreName => {
      catalogGenreNames.add(genreName);
    });

    meta.countryNames.forEach(countryName => {
      catalogCountryNames.add(countryName);
    });

    if (movie.year) {
      catalogYearValues.add(Number(movie.year));
    }
  });

  catalogSortedMoviesByMode = {
    default: getSortedMoviesCopy(movies, 'default'),
    oldest: getSortedMoviesCopy(movies, 'oldest')
  };
  allGenreNames = Array.from(catalogGenreNames).sort((firstName, secondName) =>
    firstName.localeCompare(secondName, 'ru')
  );
  allCountryNames = Array.from(catalogCountryNames).sort((firstName, secondName) =>
    firstName.localeCompare(secondName, 'ru')
  );
  allMovieYears = Array.from(catalogYearValues).sort((a, b) => b - a);
}

function getMatchedSearchAlias(movie, searchQuery, queryWords = null) {
  const normalizedQuery = Array.isArray(queryWords)
    ? queryWords.join(' ')
    : normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return null;
  }

  const meta = getCatalogMovieMeta(movie);
  const words = Array.isArray(queryWords)
    ? queryWords
    : normalizedQuery.split(' ').filter(Boolean);
  const hasVisibleMatch = meta.visibleSearchTexts.some(text =>
    words.every(word => text.includes(word))
  );

  if (hasVisibleMatch) {
    return null;
  }

  return meta.searchAliasEntries.find(entry =>
    words.every(word => entry.normalizedAlias.includes(word))
  )?.alias || null;
}

function getSearchQueryWords(searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (!normalizedQuery) {
    return [];
  }

  return normalizedQuery.split(' ').filter(Boolean);
}

function movieMatchesSearch(movie, searchQuery, queryWords = null) {
  const words = Array.isArray(queryWords)
    ? queryWords
    : getSearchQueryWords(searchQuery);

  if (words.length === 0) {
    return true;
  }

  const meta = getCatalogMovieMeta(movie);

  return words.every(word => meta.searchableText.includes(word));
}

/* =========================================================
JS-БЛОК 6. РАБОТА С СООБЩЕНИЯМИ АВТОРИЗАЦИИ
Показывает, очищает и автоматически скрывает статусы auth-блока.
========================================================== */
function setToastActionState(toastElement, actionButtonElement, isVisible) {
  if (!toastElement || !actionButtonElement) {
    return;
  }

  actionButtonElement.hidden = !isVisible;
  toastElement.classList.toggle('has-action', isVisible);
}

function showToastMessage(
  toastElement,
  messageElement,
  timerState,
  text,
  type = 'info',
  autoHide = false,
  options = {}
) {
  if (!messageElement || !toastElement) {
    return null;
  }

  const actionButtonElement = options.actionButtonElement || null;
  const showAction = Boolean(options.showAction && actionButtonElement && !autoHide);

  if (timerState.value) {
    clearTimeout(timerState.value);
    timerState.value = null;
  }

  setToastActionState(toastElement, actionButtonElement, showAction);
  messageElement.textContent = text;
  toastElement.classList.remove('is-hidden', 'is-error', 'is-success', 'is-visible');
  messageElement.classList.remove('is-error', 'is-success');

  if (type === 'error') {
    toastElement.classList.add('is-error');
    messageElement.classList.add('is-error');
  }

  if (type === 'success') {
    toastElement.classList.add('is-success');
    messageElement.classList.add('is-success');
  }

  requestAnimationFrame(() => {
    toastElement.classList.add('is-visible');
  });

  if (autoHide) {
    timerState.value = setTimeout(() => {
      toastElement.classList.remove('is-visible');

      setTimeout(() => {
        toastElement.classList.add('is-hidden');
        toastElement.classList.remove('is-error', 'is-success');
        setToastActionState(toastElement, actionButtonElement, false);
        messageElement.classList.remove('is-error', 'is-success');
        messageElement.textContent = '';
      }, 250);
    }, 2600);
  }

  return timerState.value;
}

function syncAppToastPosition() {
  if (!appToast) {
    return;
  }

  const anchorElement = document.querySelector('.section') || document.querySelector('.page');
  const anchorRect = anchorElement?.getBoundingClientRect();

  if (!anchorRect || anchorRect.width <= 0) {
    return;
  }

  const rightOffset = Math.max(16, Math.round(window.innerWidth - anchorRect.right));

  document.documentElement.style.setProperty('--app-toast-right-offset', `${rightOffset}px`);
}

function showAuthMessage(text, type = 'info', autoHide = false) {
  authMessageTimer = showToastMessage(
    authToast,
    authMessage,
    { value: authMessageTimer },
    text,
    type,
    autoHide
  );
}

function showAppMessage(text, type = 'info', autoHide = false, options = {}) {
  syncAppToastPosition();

  appMessageTimer = showToastMessage(
    appToast,
    appToastMessage,
    { value: appMessageTimer },
    text,
    type,
    autoHide,
    {
      actionButtonElement: appToastAcceptButton,
      showAction: Boolean(options.showAction)
    }
  );
}

function clearToastMessage(toastElement, messageElement, timerState, actionButtonElement = null) {
  if (!messageElement || !toastElement) {
    return;
  }

  if (timerState.value) {
    clearTimeout(timerState.value);
    timerState.value = null;
  }

  toastElement.classList.remove('is-visible', 'is-error', 'is-success');
  toastElement.classList.add('is-hidden');
  setToastActionState(toastElement, actionButtonElement, false);
  messageElement.classList.remove('is-error', 'is-success');
  messageElement.textContent = '';
}

function clearAuthMessage() {
  const timerState = { value: authMessageTimer };
  clearToastMessage(authToast, authMessage, timerState);
  authMessageTimer = timerState.value;
}

function clearAppMessage() {
  const timerState = { value: appMessageTimer };
  clearToastMessage(appToast, appToastMessage, timerState, appToastAcceptButton);
  appMessageTimer = timerState.value;
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
    await withAuthRequestTimeout(
      supabaseClient.auth.signOut({ scope: 'global' }),
      'Не удалось отменить восстановление пароля. Проверь соединение и попробуй снова.'
    );
  } catch (error) {
    console.error('Ошибка отмены recovery-сессии:', error);
  }
}

async function clearLocalRecoverySession() {
  try {
    await withAuthRequestTimeout(
      supabaseClient.auth.signOut({ scope: 'local' }),
      'Не удалось очистить временную recovery-сессию. Проверь соединение и попробуй снова.'
    );
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

function refreshMovieModalElements() {
  movieModal = document.getElementById('movieModal');
  movieModalBackdrop = document.getElementById('movieModalBackdrop');
  closeMovieModalButton = document.getElementById('closeMovieModalButton');
  movieForm = document.getElementById('movieForm');
  formTitle = document.getElementById('formTitle');
  formMessage = document.getElementById('formMessage');
  submitButton = document.getElementById('submitButton');
  cancelEditButton = document.getElementById('cancelEditButton');
  titleInput = document.getElementById('title');
  originalTitleInput = document.getElementById('originalTitle');
  yearInput = document.getElementById('year');
  releaseMonthInput = document.getElementById('releaseMonth');
  releaseYearInput = document.getElementById('releaseYear');
  sortOrderInput = document.getElementById('sortOrder');
  directorInput = document.getElementById('director');
  posterFileInput = document.getElementById('posterFile');
  posterFileName = document.getElementById('posterFileName');
  kinopoiskUrlInput = document.getElementById('kinopoiskUrl');
  imdbUrlInput = document.getElementById('imdbUrl');
  letterboxdUrlInput = document.getElementById('letterboxdUrl');
  letterboxdShortUrlInput = document.getElementById('letterboxdShortUrl');
  rottentomatoesUrlInput = document.getElementById('rottentomatoesUrl');
  genresInput = document.getElementById('genresInput');
  countriesInput = document.getElementById('countriesInput');
  searchAliasesInput = document.getElementById('searchAliases');
  synopsisInput = document.getElementById('synopsis');
  movieFormatsInput = document.getElementById('movieFormats');
  tagsPerceivedInput = document.getElementById('tagsPerceived');
  manualSimilarMovieSelect = document.getElementById('manualSimilarMovieSelect');
  addManualSimilarMovieButton = document.getElementById('addManualSimilarMovieButton');
  manualSimilarMoviesList = document.getElementById('manualSimilarMoviesList');
}

function bindMovieModalEvents() {
  if (isMovieModalEventsBound || !movieForm) {
    return;
  }

  closeMovieModalButton?.addEventListener('click', () => {
    closeMovieModal();
  });

  movieModalBackdrop?.addEventListener('click', () => {
    closeMovieModal();
  });

  posterFileInput?.addEventListener('change', updatePosterFileUi);

  manualSimilarMovieSelect?.addEventListener('change', () => {
    if (addManualSimilarMovieButton) {
      addManualSimilarMovieButton.disabled = !manualSimilarMovieSelect.value;
    }
  });

  addManualSimilarMovieButton?.addEventListener('click', () => {
    addManualSimilarMovieFromSelect();
  });

  manualSimilarMoviesList?.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-manual-similar]');

    if (!removeButton) {
      return;
    }

    removeManualSimilarMovieFromDraft(removeButton.dataset.removeManualSimilar);
  });

  movieForm.addEventListener('submit', saveMovie);

  cancelEditButton?.addEventListener('click', () => {
    resetFormToCreateMode();
    closeMovieModal();
  });

  isMovieModalEventsBound = true;
}

function ensureMovieModalMounted() {
  if (!movieModal) {
    window.SharedLayout?.mountSharedMovieModal();
    refreshMovieModalElements();
  }

  bindMovieModalEvents();

  if (releaseMonthInput) {
    refreshCustomSelect(releaseMonthInput);
  }

  return Boolean(movieModal && movieForm);
}

function openMovieModal() {
  if (!ensureMovieModalMounted()) {
    return;
  }

  movieModal.classList.add('is-open');
  isModalOpen = true;
  syncBodyScrollLock();
  renderManualSimilarMoviesList();
  ensureManualSimilarEditorDataLoaded(editingMovieId).catch(error => {
    console.warn('Не удалось подготовить список ручных похожих фильмов:', error);
  });

  requestAnimationFrame(() => {
    titleInput?.focus();
  });
}

function closeMovieModal() {
  if (!movieModal) {
    return;
  }

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

  if (submitButton) {
    submitButton.disabled = isSubmitting;
  }

  if (cancelEditButton) {
    cancelEditButton.disabled = isSubmitting;
  }

  if (closeMovieModalButton) {
    closeMovieModalButton.disabled = isSubmitting;
  }

  if (openAddMovieButton) {
    openAddMovieButton.disabled = isSubmitting;
  }
}

function setMovieFormStatus(message) {
  if (formMessage) {
    formMessage.textContent = message;
  }
}

function resetFormToCreateMode() {
  if (!ensureMovieModalMounted()) {
    return;
  }

  editingMovieId = null;
  movieForm.reset();
  if (posterFileInput) {
    posterFileInput.value = '';
  }
  updatePosterFileUi(); // после сброса снова показываем "Файл не выбран"
  formTitle.textContent = 'Добавить фильм';
  submitButton.textContent = 'Добавить фильм';
  cancelEditButton.classList.remove('is-visible');
  formMessage.textContent = '';

  setManualSimilarDraft([]);
  refreshCustomSelect(releaseMonthInput);
}

function fillFormForEdit(movie) {
  if (!ensureMovieModalMounted()) {
    return;
  }

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
  setInputValue(letterboxdShortUrlInput, movie.letterboxd_short_url, 'letterboxdShortUrlInput');
  setInputValue(rottentomatoesUrlInput, movie.rottentomatoes_url, 'rottentomatoesUrlInput');

  if (posterFileInput) {
    posterFileInput.value = '';
  }

  updatePosterFileUi();

  const genres = movie.movie_genres
    .map(item => item.genres.name)
    .filter(name => normalizeSearchText(name) !== BASE_HORROR_GENRE_NORMALIZED)
    .join(', ');
  const countries = movie.movie_countries.map(item => item.countries.name).join(', ');

  setInputValue(genresInput, genres, 'genresInput');
  setInputValue(countriesInput, countries, 'countriesInput');
  setInputValue(searchAliasesInput, (movie.search_aliases || []).join('\n'), 'searchAliasesInput');
  setInputValue(synopsisInput, movie.synopsis, 'synopsisInput');
  setInputValue(movieFormatsInput, (movie.formats || []).join('\n'), 'movieFormatsInput');
  setInputValue(tagsPerceivedInput, (movie.tags_perceived || []).join('\n'), 'tagsPerceivedInput');
  setManualSimilarDraft(getManualSimilarMovieIds(movie.id));
  ensureManualSimilarEditorDataLoaded(movie.id).catch(error => {
    console.warn('Не удалось загрузить ручные похожие фильмы для формы:', error);
  });

  formTitle.textContent = `Редактирование: ${movie.title}`;
  submitButton.textContent = 'Сохранить изменения';
  cancelEditButton.classList.add('is-visible');
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
    adminPanel.classList.toggle('is-visible', shouldShowAuthenticatedUi && isAdmin);
  }

  if (profileSummaryButton) {
    profileSummaryButton.hidden = !shouldShowAuthenticatedUi;
  }

  if (moviePageAdminActions) {
    moviePageAdminActions.classList.toggle('is-visible', shouldShowAuthenticatedUi && isAdmin && isMoviePage());
  }

  if (manualSimilarAuditButton) {
    manualSimilarAuditButton.hidden = !(shouldShowAuthenticatedUi && isAdmin);
    manualSimilarAuditButton.disabled = isManualSimilarAuditRunning;
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

  if (!isAdmin && movieModal) {
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
JS-БЛОК 9. СПРАВОЧНИКИ ФИЛЬТРОВ
Заполняет select-поля по уже загруженному каталогу.
========================================================== */
function refreshGenreFilterOptions(genreCounts = new Map()) {
  if (!genreFilter) {
    return;
  }

  const selectedGenre = genreFilter.value || '';
  const genreNames = allGenreNames.includes(selectedGenre) || !selectedGenre
    ? allGenreNames
    : [...allGenreNames, selectedGenre].sort((firstName, secondName) =>
        firstName.localeCompare(secondName, 'ru')
      );

  genreFilter.innerHTML = '<option value="">Все доп. жанры</option>';

  genreNames.forEach(genreName => {
    const option = document.createElement('option');
    option.value = genreName;
    option.textContent = `${genreName} (${genreCounts.get(genreName) || 0})`;
    option.disabled = (genreCounts.get(genreName) || 0) === 0 && genreName !== selectedGenre;
    genreFilter.appendChild(option);
  });

  genreFilter.value = selectedGenre;
  refreshCustomSelect(genreFilter);
}

function loadSubgenreFilterOptions(subgenreCounts = new Map()) {
  if (!subgenreFilter) {
    return;
  }

  const selectedSubgenre = subgenreFilter.value || '';
  const subgenreKeys = Array.from(subgenreCounts.keys());

  subgenreFilter.innerHTML = '<option value="">Все</option>';

  subgenreKeys
    .map(subgenreKey => ({
      key: subgenreKey,
      count: subgenreCounts.get(subgenreKey) || 0,
      label: subgenreKey
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

function loadFormatFilterOptions(formatCounts = new Map()) {
  if (!formatFilter) {
    return;
  }

  const selectedFormat = formatFilter.value || '';
  const formatKeys = Array.from(formatCounts.keys());

  formatFilter.innerHTML = '<option value="">Все</option>';

  formatKeys
    .map(formatKey => ({
      key: formatKey,
      count: formatCounts.get(formatKey) || 0,
      label: formatKey
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

function refreshCountryFilterOptions(countryCounts = new Map()) {
  if (!countryFilter) {
    return;
  }

  const selectedCountry = countryFilter.value || '';
  const countryNames = allCountryNames.includes(selectedCountry) || !selectedCountry
    ? allCountryNames
    : [...allCountryNames, selectedCountry].sort((firstName, secondName) =>
        firstName.localeCompare(secondName, 'ru')
      );

  countryFilter.innerHTML = '<option value="">Все</option>';

  countryNames.forEach(countryName => {
    const option = document.createElement('option');
    option.value = countryName;
    option.textContent = `${countryName} (${countryCounts.get(countryName) || 0})`;
    option.disabled = (countryCounts.get(countryName) || 0) === 0 && countryName !== selectedCountry;
    countryFilter.appendChild(option);
  });

  countryFilter.value = selectedCountry;
  refreshCustomSelect(countryFilter);
}

function loadYearFilterOptions(yearCounts = new Map()) {
  if (!yearFilter) {
    return;
  }

  const selectedYear = yearFilter.value || '';
  const years = allMovieYears;

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
  tags_perceived,
  search_aliases,
  rating,
  poster_url,
  kinopoisk_url,
  imdb_url,
  letterboxd_url,
  letterboxd_short_url,
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

const MOVIE_CATALOG_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  director,
  formats,
  tags_perceived,
  search_aliases,
  poster_url,
  kinopoisk_url,
  imdb_url,
  letterboxd_url,
  letterboxd_short_url,
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

function getMovieSelectByPurpose(purpose = 'catalog') {
  if (purpose === 'detail') {
    return MOVIE_BASE_SELECT;
  }

  return MOVIE_CATALOG_SELECT;
}

function hasMovieDetailPayload(movie) {
  return Boolean(
    movie &&
    Object.prototype.hasOwnProperty.call(movie, 'synopsis') &&
    Object.prototype.hasOwnProperty.call(movie, 'tags_perceived')
  );
}

async function fetchMovies({ preserveExistingCatalogOnError = false, purpose = 'catalog' } = {}) {
  const { data, error } = await supabaseClient
    .from('movies')
    .select(getMovieSelectByPurpose(purpose))
    .order('title', { ascending: true })
    .order('position', { foreignTable: 'movie_genres', ascending: true });

    if (error) {
      if (!preserveExistingCatalogOnError) {
        moviesLoadedSuccessfully = false;
      }

      console.error('Ошибка загрузки фильмов:', error);
  
      if (container && !preserveExistingCatalogOnError) {
        container.innerHTML = 'Ошибка загрузки фильмов. Открой консоль F12.';
      }
  
      return false;
    }

  allMovies = data || [];
  rebuildCatalogMovieMeta();
  moviesLoadedSuccessfully = true;
  markCatalogDataChanged();
  return true;
}

async function fetchMovieRatings() {
  const hasFullRatingRows = await fetchMovieRatingStats();

  if (hasFullRatingRows) {
    return;
  }

  await fetchCurrentUserRatings();
}

async function fetchMovieRatingStats() {
  const { data, error } = await supabaseClient
    .from('movie_rating_stats')
    .select('movie_id, average_rating, votes_count, rating_sum');

  if (error) {
    console.warn('Не удалось загрузить агрегаты оценок, используем fallback:', error);
    return fetchFullMovieRatingsFallback();
  }

  applyMovieRatingStatsRows(data || []);
  return false;
}

async function fetchFullMovieRatingsFallback() {
  const { data, error } = await supabaseClient
    .from('movie_ratings')
    .select('movie_id, user_id, rating');

  if (error) {
    console.error('Ошибка загрузки оценок фильмов:', error);
    setKnownMovieRatingRows([]);
    applyMovieRatingStatsRows([]);
    return false;
  }

  setKnownMovieRatingRows(data || []);
  applyMovieRatingStatsFromRows(data || []);
  return true;
}

async function fetchCurrentUserRatings() {
  if (!currentUser) {
    setKnownMovieRatingRows([]);
    return;
  }

  const activeUserId = currentUser.id;
  const { data, error } = await supabaseClient
    .from('movie_ratings')
    .select('movie_id, user_id, rating')
    .eq('user_id', activeUserId);

  if (error) {
    console.error('Ошибка загрузки оценок текущего пользователя:', error);
    setKnownMovieRatingRows([]);
    return;
  }

  setKnownMovieRatingRows(data || []);
}

async function fetchMovieWatchlist() {
  if (!shouldUseAuthenticatedUi()) {
    allMovieWatchlist = [];
    rebuildCurrentUserWatchlistIndex();
    markCatalogDataChanged();
    return;
  }

  const { data, error } = await supabaseClient
    .from('movie_watchlist')
    .select('movie_id, user_id')
    .eq('user_id', currentUser.id);

  if (error) {
    console.error('Ошибка загрузки watchlist:', error);
    allMovieWatchlist = [];
    rebuildCurrentUserWatchlistIndex();
    markCatalogDataChanged();
    return;
  }

  allMovieWatchlist = data || [];
  rebuildCurrentUserWatchlistIndex();
  markCatalogDataChanged();
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
  const uniqueUserIdSet = new Set(uniqueUserIds.map(userId => String(userId)));

  let profilesMap = new Map();

  if (uniqueUserIds.length > 0) {
    const [
      { data: profilesData, error: profilesError },
      { data: reviewRatingsData, error: reviewRatingsError }
    ] = await Promise.all([
      supabaseClient
        .from('profiles')
        .select('id, display_name, default_display_name')
        .in('id', uniqueUserIds),
      supabaseClient
        .from('movie_ratings')
        .select('movie_id, user_id, rating')
        .eq('movie_id', movieId)
        .in('user_id', uniqueUserIds)
    ]);

    if (profilesError) {
      console.error('Ошибка загрузки профилей авторов рецензий:', profilesError);
    } else {
      profilesMap = new Map(
        (profilesData || []).map(profile => [String(profile.id), profile])
      );
    }

    if (reviewRatingsError) {
      console.error('Ошибка загрузки оценок авторов рецензий:', reviewRatingsError);
    } else {
      upsertKnownMovieRatingRows(
        reviewRatingsData || [],
        row => (
          String(row.movie_id) === String(movieId) &&
          uniqueUserIdSet.has(String(row.user_id))
        )
      );
    }
  } else {
    removeKnownMovieRatingRows(row => (
      String(row.movie_id) === String(movieId) &&
      (!currentUser || String(row.user_id) !== String(currentUser.id))
    ));
  }

  allMovieReviews = reviews.map(review => ({
    ...review,
    profiles: profilesMap.get(String(review.user_id)) || null
  }));
}

async function fetchCatalogReviewSummary() {
  const { data, error } = await supabaseClient
    .from('movie_reviews')
    .select('movie_id');

  if (error) {
    console.error('Ошибка загрузки сводки рецензий:', error);
    catalogReviewedMovieIds = new Set();
    markCatalogDataChanged();
    return;
  }

  catalogReviewedMovieIds = new Set(
    (data || [])
      .map(item => String(item.movie_id || ''))
      .filter(Boolean)
  );
  markCatalogDataChanged();
}

async function reloadMoviePageData(movieId) {
  if (!movieId) {
    return null;
  }

  await Promise.all([
    fetchMovieRatings(),
    fetchMovieWatchlist()
  ]);

  await fetchMovieReviews(movieId);

  return fetchMovieById(movieId);
}

async function refreshMovieReviewsAfterMutation(movieId, reviewIdToCollapse = null) {
  if (reviewIdToCollapse) {
    setMovieReviewExpandedState(reviewIdToCollapse, false);
    setMovieReviewTextExpandedState(reviewIdToCollapse, false);
  }

  await fetchMovieReviews(movieId);
  if (allMovieReviews.some(review => String(review.movie_id) === String(movieId))) {
    catalogReviewedMovieIds.add(String(movieId));
  } else {
    catalogReviewedMovieIds.delete(String(movieId));
  }
  markCatalogDataChanged();
  syncCatalogSessionSnapshotMovieState(movieId, { syncReviews: true });
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

async function reloadCatalogData({ showSkeleton = false, refreshFilters = true } = {}) {
  const shouldShowCatalogSkeleton = showSkeleton && Boolean(container);
  const shouldPreserveExistingCatalogOnMovieLoadError = (
    !shouldShowCatalogSkeleton &&
    moviesLoadedSuccessfully
  );

  shouldFadeCatalogAfterSkeleton = shouldShowCatalogSkeleton;

  if (shouldShowCatalogSkeleton) {
    renderMoviesSkeleton(getCatalogSkeletonCardsCount());
  }

  await Promise.all([
    fetchMovies({
      preserveExistingCatalogOnError: shouldPreserveExistingCatalogOnMovieLoadError
    }),
    fetchMovieRatings(),
    fetchMovieWatchlist(),
    fetchCatalogReviewSummary()
  ]);

  if (refreshFilters) {
    refreshDynamicFilterOptions();
  }

  persistCatalogSessionSnapshot();
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
function getMovieVotesCount(movieId) {
  return movieRatingStatsByMovieId.get(String(movieId))?.count || 0;
}

function getMovieAverageRating(movieId) {
  const stats = movieRatingStatsByMovieId.get(String(movieId));

  if (!stats || stats.count === 0) {
    return 0;
  }

  return stats.average;
}

function getCurrentUserRating(movieId) {
  if (!currentUser) {
    return null;
  }

  const movieKey = String(movieId);

  return currentUserRatingsByMovieId.has(movieKey)
    ? Number(currentUserRatingsByMovieId.get(movieKey))
    : null;
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
  resetCatalogPaginationPage();

  if (!preserveSearch) {
    clearSearchInput();
  }

  genreFilter.value = '';
  subgenreFilter.value = '';
  formatFilter.value = '';
  countryFilter.value = '';
  ratingFilter.value = '';
  yearFilter.value = '';
  reviewedOnlyFilter = false;
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
  resetCatalogPaginationPage();
  rerenderCatalogPreservingPosition();
}

function ensureAstralPresetToast() {
  let toast = document.getElementById('astralPresetToast');

  if (toast) {
    return toast;
  }

  toast = document.createElement('div');
  toast.id = 'astralPresetToast';
  toast.className = 'astral-preset-toast';
  toast.setAttribute('aria-hidden', 'true');

  toast.innerHTML = `
    <img
      src="/insidious.webp"
      alt=""
      class="astral-preset-toast-image"
      loading="eager"
      decoding="async"
    >
  `;

  document.body.appendChild(toast);

  return toast;
}

function showAstralPresetToast() {
  const toast = ensureAstralPresetToast();

  if (!toast) {
    return;
  }

  if (astralPresetToastTimerId) {
    clearTimeout(astralPresetToastTimerId);
    astralPresetToastTimerId = null;
  }

  toast.classList.remove('is-visible');

  void toast.offsetWidth;

  toast.classList.add('is-visible');

  astralPresetToastTimerId = setTimeout(() => {
    toast.classList.remove('is-visible');
    astralPresetToastTimerId = null;
  }, 1350);
}

function getActiveQuickPresetKey() {
  const hasSearchQuery = searchInput.value.trim() !== '';
  const hasGenreFilter = Boolean(genreFilter.value);
  const hasSubgenreFilter = Boolean(subgenreFilter.value);
  const hasFormatFilter = Boolean(formatFilter.value);
  const hasCountryFilter = Boolean(countryFilter.value);
  const hasYearFilter = Boolean(yearFilter.value);

  if (
    normalizeSearchText(searchInput.value) === 'астрал' &&
    !reviewedOnlyFilter &&
    !hasGenreFilter &&
    !hasSubgenreFilter &&
    !hasFormatFilter &&
    !hasCountryFilter &&
    !hasYearFilter &&
    ratingFilter.value === '' &&
    (!currentUser || (!watchlistFilter.value && !watchedFilter.value))
  ) {
    return 'astrals';
  }

  if (hasSearchQuery || hasGenreFilter || hasSubgenreFilter || hasFormatFilter || hasCountryFilter || hasYearFilter) {
    return null;
  }

  if (
    reviewedOnlyFilter &&
    ratingFilter.value === '' &&
    (!currentUser || (!watchlistFilter.value && !watchedFilter.value))
  ) {
    return 'with-reviews';
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

function ensureReviewedQuickPresetButton() {
  if (!quickPresetsBar || quickPresetsBar.querySelector('[data-quick-preset="with-reviews"]')) {
    return;
  }

  const reviewedPresetButton = document.createElement('button');

  reviewedPresetButton.type = 'button';
  reviewedPresetButton.className = 'quick-preset-button';
  reviewedPresetButton.dataset.quickPreset = 'with-reviews';
  reviewedPresetButton.textContent = 'С рецензиями';

  quickPresetsBar.appendChild(reviewedPresetButton);
}

function ensureAstralQuickPresetButton() {
  if (!quickPresetsBar || quickPresetsBar.querySelector('[data-quick-preset="astrals"]')) {
    return;
  }

  const astralPresetButton = document.createElement('button');

  astralPresetButton.type = 'button';
  astralPresetButton.className = 'quick-preset-button';
  astralPresetButton.dataset.quickPreset = 'astrals';
  astralPresetButton.textContent = 'Астралы';

  quickPresetsBar.appendChild(astralPresetButton);
}

function syncQuickPresetButtons() {
  if (!quickPresetsBar) {
    return;
  }

  ensureReviewedQuickPresetButton();
  ensureAstralQuickPresetButton();

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
  const shouldShowAstralPresetToast = (
    presetKey === 'astrals' &&
    searchInput &&
    searchInput.value.trim() === ''
  );

  resetFilterControls();

  if (presetKey === 'top-rated') {
    ratingFilter.value = '7';
  }

  if (presetKey === 'low-rated') {
    ratingFilter.value = '3';
  }

  if (presetKey === 'with-reviews') {
    reviewedOnlyFilter = true;
  }

  if (presetKey === 'astrals') {
    searchInput.value = 'Астрал';
    lastSearchQuery = 'Астрал';

    if (searchClearBtn) {
      searchClearBtn.classList.add('is-visible');
    }

    if (shouldShowAstralPresetToast) {
      showAstralPresetToast();
    }
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
    watchedFilter
  ]);

  syncCatalogViewToggleButton();
  saveCatalogStateAndRender();
}

function getActiveFilterChips() {
  const chips = [];

  if (reviewedOnlyFilter) {
    chips.push({ label: 'Рецензии: с рецензиями', key: 'with-reviews' });
  }

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
      label: `Поджанр: ${subgenreFilter.value}`,
      key: 'subgenre'
    });
  }

  if (formatFilter.value) {
    chips.push({
      label: `Формат: ${formatFilter.value}`,
      key: 'format'
    });
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

  if (filterKey === 'with-reviews') {
    reviewedOnlyFilter = false;
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

  let parsedUrl = null;

  try {
    parsedUrl = new URL(publicUrl);
  } catch (error) {
    return null;
  }

  const pathname = parsedUrl.pathname;
  const marker = pathname.includes(POSTER_STORAGE_PUBLIC_PATH)
    ? POSTER_STORAGE_PUBLIC_PATH
    : POSTER_STORAGE_RENDER_PATH;

  if (!pathname.includes(marker)) {
    return null;
  }

  const path = pathname.split(marker)[1];

  return path || null;
}

function getPosterTransformUrl(publicUrl, { width, quality, resize = 'cover' } = {}) {
  const storagePath = extractPosterStoragePath(publicUrl);

  if (!storagePath || !width) {
    return null;
  }

  let parsedUrl = null;

  try {
    parsedUrl = new URL(publicUrl);
  } catch (error) {
    return null;
  }

  const transformedUrl = new URL(`${parsedUrl.origin}${POSTER_STORAGE_RENDER_PATH}${storagePath}`);
  const normalizedWidth = Math.max(1, Math.min(2500, Number(width) || 0));
  const normalizedHeight = Math.round(normalizedWidth * 1.5);

  transformedUrl.searchParams.set('width', String(normalizedWidth));
  transformedUrl.searchParams.set('height', String(normalizedHeight));
  transformedUrl.searchParams.set('resize', resize);

  if (quality) {
    transformedUrl.searchParams.set('quality', String(quality));
  }

  return transformedUrl.toString();
}

function getPosterImageData(publicUrl, presetName = 'catalog') {
  const originalUrl = String(publicUrl || '').trim();
  const preset = POSTER_IMAGE_PRESETS[presetName] || POSTER_IMAGE_PRESETS.catalog;

  if (!originalUrl) {
    return {
      src: '',
      srcset: '',
      sizes: '',
      fallbackSrc: '',
      originalSrc: ''
    };
  }

  const transformedUrls = preset.widths
    .map(width => ({
      width,
      url: getPosterTransformUrl(originalUrl, {
        width,
        quality: preset.quality
      })
    }))
    .filter(item => item.url);

  if (transformedUrls.length === 0) {
    return {
      src: originalUrl,
      srcset: '',
      sizes: '',
      fallbackSrc: '',
      originalSrc: originalUrl
    };
  }

  return {
    src: transformedUrls[0].url,
    srcset: transformedUrls.map(item => `${item.url} ${item.width}w`).join(', '),
    sizes: preset.sizes,
    fallbackSrc: originalUrl,
    originalSrc: originalUrl
  };
}

function getPosterImageAttributeHtml(publicUrl, presetName = 'catalog') {
  const imageData = getPosterImageData(publicUrl, presetName);

  if (!imageData.src) {
    return '';
  }

  return [
    `src="${escapeHtml(imageData.src)}"`,
    imageData.srcset ? `srcset="${escapeHtml(imageData.srcset)}"` : '',
    imageData.sizes ? `sizes="${escapeHtml(imageData.sizes)}"` : '',
    imageData.fallbackSrc ? `data-poster-fallback-src="${escapeHtml(imageData.fallbackSrc)}"` : '',
    imageData.originalSrc ? `data-original-poster-src="${escapeHtml(imageData.originalSrc)}"` : ''
  ].filter(Boolean).join('\n                  ');
}

function restorePosterFallbackSource(posterImage) {
  if (!posterImage?.dataset?.posterFallbackSrc || posterImage.dataset.posterFallbackApplied === 'true') {
    return false;
  }

  posterImage.dataset.posterFallbackApplied = 'true';
  posterImage.removeAttribute('srcset');
  posterImage.removeAttribute('sizes');
  posterImage.src = posterImage.dataset.posterFallbackSrc;

  return true;
}

function bindPosterFallbackImages(root = document) {
  root.querySelectorAll?.('img[data-poster-fallback-src]').forEach(posterImage => {
    posterImage.addEventListener('error', () => {
      restorePosterFallbackSource(posterImage);
    });
  });
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
  const letterboxdShortUrl = normalizeLetterboxdShortUrl(letterboxdShortUrlInput.value);
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

    const classificationDraft = buildMovieClassificationDraftFromForm();
    const manualSimilarMovieIds = normalizeManualSimilarMovieIds(manualSimilarMovieIdsDraft);

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
          formats: classificationDraft.formats,
          tags_perceived: classificationDraft.tagsPerceived,
          search_aliases: searchAliases,
          rating: 0,
          poster_url: finalPosterUrl,
          kinopoisk_url: kinopoiskUrl || null,
          imdb_url: imdbUrl || null,
          letterboxd_url: letterboxdUrl || null,
          letterboxd_short_url: letterboxdShortUrl || null,
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

    if (manualSimilarMovieIds.length > 0) {
      setMovieFormStatus('Сохраняю похожие фильмы...');
      await withPendingRequestTimeout(
        replaceManualSimilarMovies(insertedMovie.id, manualSimilarMovieIds),
        15000,
        'Превышено время ожидания сохранения похожих фильмов.'
      );
    }

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
  const letterboxdShortUrl = normalizeLetterboxdShortUrl(letterboxdShortUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseCommaSeparated(countriesInput.value);
  const searchAliases = parseMultilineValues(searchAliasesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  const existingMovie = getCatalogMovieById(editingMovieId)
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
    await ensureManualSimilarDataLoaded();

    const classificationDraft = buildMovieClassificationDraftFromForm();
    const manualSimilarMovieIds = normalizeManualSimilarMovieIds(manualSimilarMovieIdsDraft, editingMovieId);
    const manualSimilarChanged = !areStringArraysEqual(
      manualSimilarMovieIds,
      getManualSimilarMovieIds(editingMovieId)
    );

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

    if (!areStringArraysEqual(classificationDraft.formats, existingMovie.formats || [])) {
      changedFields.formats = classificationDraft.formats;
    }

    if (!areStringArraysEqual(classificationDraft.tagsPerceived, existingMovie.tags_perceived || [])) {
      changedFields.tags_perceived = classificationDraft.tagsPerceived;
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

    if ((letterboxdShortUrl || null) !== (existingMovie.letterboxd_short_url ?? null)) {
      changedFields.letterboxd_short_url = letterboxdShortUrl || null;
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

    if (manualSimilarChanged) {
      setMovieFormStatus('Сохраняю похожие фильмы...');
      await withPendingRequestTimeout(
        replaceManualSimilarMovies(editingMovieId, manualSimilarMovieIds),
        15000,
        'Превышено время ожидания сохранения похожих фильмов.'
      );
    }

    if (uploadedNewPoster && oldPosterUrl && oldPosterUrl !== finalPosterUrl) {
      try {
        await deletePosterFileByUrl(oldPosterUrl);
      } catch (deletePosterError) {
        console.error('Не удалось удалить старый постер:', deletePosterError);
      }
    }

    if (Object.keys(changedFields).length === 0 && !relationsChanged && !manualSimilarChanged) {
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
        syncCatalogSessionSnapshotMovieState(editingMovieId, { syncMovie: updatedMovie });
        loadMoviePageSimilarMovies(updatedMovie);
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
  let data = null;
  let error = null;

  try {
    ({ data, error } = await withAuthRequestTimeout(
      supabaseClient.auth.getSession(),
      'Не удалось восстановить сессию. Проверь соединение и обнови страницу.'
    ));
  } catch (requestError) {
    console.error('Ошибка получения сессии:', requestError);
    await applyCurrentSessionUser(null);
    return null;
  }

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
  rebuildMovieRatingIndexes();
  rebuildCurrentUserWatchlistIndex();
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

  const { data, error } = await withAuthProfileRequestTimeout(
    query.limit(1),
    'Не удалось проверить никнейм. Проверь соединение и попробуй снова.'
  );

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

    const { error: authError } = await withAuthRequestTimeout(
      supabaseClient.auth.updateUser({
        data: {
          ...(currentUser.user_metadata || {}),
          display_name: nextDisplayName
        }
      }),
      'Не удалось обновить никнейм в аккаунте. Проверь соединение и попробуй снова.'
    );

    if (authError) {
      console.error('Ошибка обновления user_metadata.display_name:', authError);
      setDisplayNameMessage('Не удалось обновить никнейм. Попробуйте ещё раз.', 'error');
      return;
    }

    const { error: profileError } = await withAuthProfileRequestTimeout(
      supabaseClient
        .from('profiles')
        .update({
          display_name: nextDisplayName
        })
        .eq('id', currentUser.id),
      'Не удалось сохранить никнейм в профиле. Проверь соединение и попробуй снова.'
    );

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
  } catch (error) {
    console.error('Ошибка сохранения никнейма:', error);
    setDisplayNameMessage(error?.message || 'Не удалось сохранить никнейм. Попробуйте ещё раз.', 'error');
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
    const { error } = await withAuthRequestTimeout(
      supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      }),
      'Не удалось отправить письмо для сброса пароля. Проверь соединение и попробуй снова.'
    );

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
  } catch (error) {
    console.error('Ошибка отправки письма для сброса пароля:', error);
    showAuthMessage(
      getReadableAuthErrorMessage(error, 'Не удалось отправить письмо для сброса пароля. Попробуй позже.'),
      'error'
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
    const { error } = await withAuthRequestTimeout(
      supabaseClient.auth.updateUser({
        password: nextPassword
      }),
      'Не удалось сохранить новый пароль. Проверь соединение и попробуй снова.'
    );

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
        await withAuthRequestTimeout(
          supabaseClient.auth.signOut({ scope: 'local' }),
          'Не удалось завершить recovery-сессию. Проверь соединение и попробуй снова.'
        );
      } catch (error) {
        console.error('Ошибка завершения recovery-сессии:', error);
      }

      closeAuthModal();
    }, 900);
  } catch (error) {
    console.error('Ошибка сохранения нового пароля:', error);
    showAuthMessage(
      getReadableAuthErrorMessage(error, 'Не удалось сохранить новый пароль. Попробуй ещё раз.'),
      'error'
    );
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

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    showAuthMessage('Введи e-mail и пароль для входа.', 'error');

    if (!email) {
      loginEmail.focus();
    } else {
      loginPassword.focus();
    }

    return;
  }

  setAuthSubmittingState(true);
  showAuthMessage('Выполняю вход...');

  try {
    const { error } = await withAuthRequestTimeout(
      supabaseClient.auth.signInWithPassword({
        email,
        password
      }),
      'Не удалось выполнить вход. Проверь соединение и попробуй снова.'
    );

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
  } catch (error) {
    console.error('Ошибка входа:', error);
    showAuthMessage(
      getReadableAuthErrorMessage(error, 'Ошибка входа. Проверь e-mail и пароль.'),
      'error'
    );
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

    const { error } = await withAuthRequestTimeout(
      supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            display_name: registerNickname || null
          }
        }
      }),
      'Не удалось зарегистрировать аккаунт. Проверь соединение и попробуй снова.'
    );

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
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    showAuthMessage(
      getReadableAuthErrorMessage(error, 'Ошибка регистрации. Проверь e-mail, пароль и никнейм.'),
      'error'
    );
  } finally {
    setAuthSubmittingState(false);
  }
}

async function logout() {
  try {
    const { error } = await withAuthRequestTimeout(
      supabaseClient.auth.signOut(),
      'Не удалось выйти. Проверь соединение и попробуй снова.'
    );

    if (error) {
      console.error('Ошибка выхода:', error);
      showAuthMessage('Не удалось выйти.', 'error');
      return;
    }

    window.location.replace(window.location.pathname + window.location.search);
  } catch (error) {
    console.error('Ошибка выхода:', error);
    showAuthMessage(
      getReadableAuthErrorMessage(error, 'Не удалось выйти. Попробуй ещё раз.'),
      'error'
    );
  }
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
  if (!container) {
    return;
  }

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
      syncCatalogSessionSnapshotMovieState(movieId);
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
  if (
    isMoviePage() &&
    moviePage &&
    currentMoviePageMovieData &&
    String(currentMoviePageMovieId) === String(movieId)
  ) {
    renderMoviePage(currentMoviePageMovieData);
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

  const previousRating = getCurrentUserRating(movieId);

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
        String(item.movie_id) === String(movieId) &&
        String(item.user_id) === String(currentUser.id)
      ));
      rebuildMovieRatingIndexes();
      updateLocalMovieRatingStats(movieId, null, previousRating);

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

  const previousRating = getCurrentUserRating(movieId);

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
        String(item.movie_id) === String(movieId) &&
        String(item.user_id) === String(currentUser.id)
      ));

      allMovieRatings.push({
        movie_id: movieId,
        user_id: currentUser.id,
        rating: normalizedRating
      });
      rebuildMovieRatingIndexes();
      updateLocalMovieRatingStats(movieId, normalizedRating, previousRating);

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
function getCatalogPaginationContainers() {
  return [catalogPaginationTop, catalogPaginationBottom].filter(Boolean);
}

function getCatalogPaginationState(totalItems) {
  const normalizedTotalItems = Math.max(0, Number(totalItems) || 0);
  const totalPages = Math.max(1, Math.ceil(normalizedTotalItems / CATALOG_PAGE_SIZE));
  const clampedPage = Math.min(Math.max(1, Number(currentCatalogPage) || 1), totalPages);
  const startIndex = normalizedTotalItems > 0
    ? (clampedPage - 1) * CATALOG_PAGE_SIZE
    : 0;
  const endIndex = Math.min(startIndex + CATALOG_PAGE_SIZE, normalizedTotalItems);

  currentCatalogPage = clampedPage;

  return {
    totalItems: normalizedTotalItems,
    totalPages,
    currentPage: clampedPage,
    startIndex,
    endIndex,
    startItemNumber: normalizedTotalItems > 0 ? startIndex + 1 : 0,
    endItemNumber: endIndex,
    hasMultiplePages: totalPages > 1
  };
}

function getCatalogPaginationSlots() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 360px)').matches
    ? CATALOG_PAGINATION_COMPACT_PAGE_SLOTS
    : CATALOG_PAGINATION_PAGE_SLOTS;
}

function getCatalogPaginationPageItems(currentPage, totalPages, maxSlots = getCatalogPaginationSlots()) {
  if (totalPages <= maxSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const edgeWindowSize = maxSlots <= 4 ? 3 : 4;
  const pages = new Set([1, totalPages, currentPage]);
  const neighborStart = Math.max(1, currentPage - 1);
  const neighborEnd = Math.min(totalPages, currentPage + 1);

  for (let page = neighborStart; page <= neighborEnd; page += 1) {
    pages.add(page);
  }

  if (currentPage <= edgeWindowSize - 1) {
    for (let page = 1; page <= Math.min(totalPages, edgeWindowSize); page += 1) {
      pages.add(page);
    }
  }

  if (currentPage >= totalPages - edgeWindowSize + 2) {
    for (let page = Math.max(1, totalPages - edgeWindowSize + 1); page <= totalPages; page += 1) {
      pages.add(page);
    }
  }

  return Array.from(pages)
    .sort((firstPage, secondPage) => firstPage - secondPage)
    .reduce((items, page, index, sortedPages) => {
      const previousPage = sortedPages[index - 1];

      if (previousPage && page - previousPage > 1) {
        items.push(`ellipsis-${previousPage}-${page}`);
      }

      items.push(page);

      return items;
    }, []);
}

function getCatalogPaginationButtonHtml({ label, targetPage, isDisabled = false, extraClassName = '', ariaLabel = '' }) {
  const disabledAttribute = isDisabled ? ' disabled aria-disabled="true"' : '';
  const ariaLabelAttribute = ariaLabel ? ` aria-label="${escapeHtml(ariaLabel)}"` : '';

  return `
    <button
      type="button"
      class="catalog-pagination-button ${extraClassName}"
      data-catalog-page="${targetPage}"
      ${ariaLabelAttribute}
      ${disabledAttribute}
    >${escapeHtml(label)}</button>
  `;
}

function getCatalogPaginationHtml(paginationState) {
  const {
    currentPage,
    totalPages
  } = paginationState;
  const pageItems = getCatalogPaginationPageItems(currentPage, totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const pageButtonsHtml = pageItems.map(item => {
    if (typeof item === 'string') {
      return '<span class="catalog-pagination-ellipsis" aria-hidden="true">…</span>';
    }

    const isCurrentPage = item === currentPage;
    const currentAttribute = isCurrentPage ? ' aria-current="page"' : '';
    const activeClassName = isCurrentPage ? ' is-active' : '';

    return `
      <button
        type="button"
        class="catalog-pagination-button catalog-pagination-page${activeClassName}"
        data-catalog-page="${item}"
        aria-label="Страница ${item}"
        ${currentAttribute}
      >${item}</button>
    `;
  }).join('');

  return `
    <div class="catalog-pagination-controls" role="group" aria-label="Навигация по страницам каталога">
      ${getCatalogPaginationButtonHtml({
        label: '<',
        targetPage: Math.max(1, currentPage - 1),
        isDisabled: isFirstPage,
        extraClassName: 'catalog-pagination-arrow',
        ariaLabel: 'Перейти на предыдущую страницу каталога'
      })}
      <div class="catalog-pagination-pages" role="group" aria-label="Страницы каталога">
        ${pageButtonsHtml}
      </div>
      ${getCatalogPaginationButtonHtml({
        label: '>',
        targetPage: Math.min(totalPages, currentPage + 1),
        isDisabled: isLastPage,
        extraClassName: 'catalog-pagination-arrow',
        ariaLabel: 'Перейти на следующую страницу каталога'
      })}
    </div>
  `;
}

function renderCatalogPagination(paginationState) {
  getCatalogPaginationContainers().forEach(paginationContainer => {
    if (!paginationState?.hasMultiplePages) {
      paginationContainer.hidden = true;
      paginationContainer.innerHTML = '';
      return;
    }

    paginationContainer.hidden = false;
    paginationContainer.innerHTML = getCatalogPaginationHtml(paginationState);
  });
}

function clearCatalogPagination() {
  renderCatalogPagination(null);
}

function getMoviesResultCountText(totalItems, paginationState) {
  if (!paginationState?.hasMultiplePages) {
    return `Найдено: ${totalItems}`;
  }

  return `Найдено: ${totalItems} · показано ${paginationState.startItemNumber}–${paginationState.endItemNumber}`;
}

function scrollCatalogToPageStart() {
  const moviesSection = moviesSectionTitle?.closest('.movies-section') || container;

  if (!moviesSection) {
    return;
  }

  const top = Math.max(0, window.scrollY + moviesSection.getBoundingClientRect().top - 12);

  scrollWindowToPosition(top);
}

function focusCurrentCatalogPaginationButton() {
  const currentPageButton = catalogPaginationTop?.querySelector('[aria-current="page"]')
    || catalogPaginationBottom?.querySelector('[aria-current="page"]');

  currentPageButton?.focus({ preventScroll: true });
}

function goToCatalogPage(nextPage) {
  const normalizedPage = Math.max(1, Number(nextPage) || 1);

  if (normalizedPage === currentCatalogPage) {
    return;
  }

  currentCatalogPage = normalizedPage;
  saveCatalogState();
  renderMovies();

  requestAnimationFrame(() => {
    scrollCatalogToPageStart();
    focusCurrentCatalogPaginationButton();
  });
}

function syncCatalogPaginationSlotCount() {
  const nextSlots = getCatalogPaginationSlots();

  if (currentCatalogPaginationSlots === nextSlots) {
    return;
  }

  currentCatalogPaginationSlots = nextSlots;

  if (!isCatalogPage() || !moviesLoadedSuccessfully) {
    return;
  }

  const { paginationState } = getCatalogDerivedState();

  renderCatalogPagination(paginationState);
}

function scheduleAppResizeSync() {
  if (appResizeSyncFrameId !== null) {
    return;
  }

  appResizeSyncFrameId = requestAnimationFrame(() => {
    appResizeSyncFrameId = null;
    syncOpenExternalLinksLayouts();
    syncCatalogPaginationSlotCount();
    syncUserPageRailControls();
    syncAppToastPosition();
  });
}

function renderMoviesSkeleton(cardsCount = 12) {
  const skeletonMovies = getCatalogSkeletonMovies(cardsCount);

  clearCatalogPagination();

  container.innerHTML = skeletonMovies
    .map(movie => getMovieCardSkeletonHtml(movie))
    .join('');
}

function getCatalogSkeletonMovies(cardsCount) {
  if (!moviesLoadedSuccessfully) {
    return Array.from({ length: cardsCount }, () => null);
  }

  const { filteredMovies, paginationState } = getCatalogDerivedState();
  const skeletonMovies = filteredMovies.slice(
    paginationState.startIndex,
    paginationState.startIndex + cardsCount
  );

  return Array.from({ length: cardsCount }, (_, index) => skeletonMovies[index] || null);
}

function getMovieCardSkeletonHtml(movie = null) {
  const hasOriginalTitle = !movie || Boolean(movie.original_title);
  const hasExternalLinks = !movie || hasMovieExternalLinks(movie);

  return `
    <article class="movie-card movie-card-skeleton" aria-hidden="true">
      <div class="movie-poster-block">
        <div class="movie-poster-link">
          <div class="movie-poster-wrapper movie-poster-wrapper-skeleton">
            <div class="movie-poster-skeleton" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      <h5 class="movie-title movie-title-skeleton">
        <span class="movie-text-skeleton movie-text-skeleton-title"></span>
      </h5>

      ${hasOriginalTitle ? '<p><span class="movie-text-skeleton movie-text-skeleton-original"></span></p>' : ''}
      <p><span class="movie-text-skeleton movie-text-skeleton-year"></span></p>
      <p><span class="movie-text-skeleton movie-text-skeleton-director"></span></p>
      <p><span class="movie-text-skeleton movie-text-skeleton-genres"></span></p>
      <p><span class="movie-text-skeleton movie-text-skeleton-countries"></span></p>

      <div class="movie-rating-block">
        ${hasExternalLinks ? getMovieExternalLinksSkeletonHtml() : ''}
        <div class="movie-rating-summary movie-rating-summary-skeleton">
          <div class="movie-rating-summary-main">
            <span class="movie-rating-value movie-text-skeleton movie-rating-value-skeleton"></span>
            <span class="movie-rating-meta movie-text-skeleton movie-rating-meta-skeleton"></span>
          </div>
          <span class="remove-rating-inline-btn secondary-button secondary-button-compact movie-text-skeleton remove-rating-inline-skeleton"></span>
        </div>
        ${getUserRatingSkeletonHtml()}
      </div>

      <div class="movie-card-actions">
        ${isAdmin ? getMovieCardActionsSkeletonHtml() : ''}
      </div>
    </article>
  `;
}

function getMovieExternalLinksSkeletonHtml() {
  return `
    <span class="movie-external-links-toggle secondary-button secondary-button-compact movie-text-skeleton movie-external-links-toggle-skeleton"></span>
    <div class="movie-external-links-collapsible">
      <div class="movie-external-links movie-external-links-skeleton" aria-hidden="true">
        ${Array.from({ length: 4 }, () => '<span class="movie-external-link movie-external-link-skeleton"></span>').join('')}
      </div>
    </div>
  `;
}

function getUserRatingSkeletonHtml() {
  if (!currentUser) {
    return '';
  }

  return `
    <div class="movie-user-rating movie-user-rating-skeleton">
      <div class="movie-user-rating-label">
        <span class="movie-text-skeleton movie-user-rating-label-skeleton"></span>
      </div>

      <div class="movie-user-rating-desktop">
        <div class="movie-user-rating-stars">
          ${Array.from({ length: 10 }, () => '<button type="button" class="rating-star-btn" tabindex="-1" disabled>★</button>').join('')}
        </div>

        <div class="movie-user-rating-scale" aria-hidden="true">
          ${Array.from({ length: 10 }, (_, index) => `<span class="movie-user-rating-scale-item">${index + 1}</span>`).join('')}
        </div>
      </div>

      <div class="movie-user-rating-mobile">
        <span class="movie-user-rating-mobile-trigger secondary-button secondary-button-compact movie-text-skeleton movie-user-rating-mobile-skeleton"></span>
      </div>
    </div>
  `;
}

function getMovieCardActionsSkeletonHtml() {
  return `
    <span class="movie-card-action-skeleton movie-card-action-skeleton-edit movie-text-skeleton"></span>
    <span class="movie-card-action-skeleton movie-card-action-skeleton-delete movie-text-skeleton"></span>
  `;
}

function hasMovieExternalLinks(movie) {
  return Boolean(
    movie?.kinopoisk_url ||
    movie?.imdb_url ||
    movie?.letterboxd_url ||
    movie?.rottentomatoes_url
  );
}

function getCatalogSkeletonCardsCount() {
  if (!container) {
    return 12;
  }

  const renderedCardsCount = container.querySelectorAll('.movie-card').length;

  if (renderedCardsCount > 0) {
    return renderedCardsCount;
  }

  const { filteredTotal } = getCatalogDerivedState();
  const estimatedCardsCount = Number(filteredTotal || 0);

  if (estimatedCardsCount > 0) {
    return Math.min(estimatedCardsCount, 12);
  }

  return 12;
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

function getSortedMoviesCopy(movies, selectedSortMode) {
  const sortedMovies = [...(Array.isArray(movies) ? movies : [])];

  sortMovies(sortedMovies, selectedSortMode);

  return sortedMovies;
}

function getCatalogSortModeKey(selectedSortMode) {
  return selectedSortMode === 'oldest' ? 'oldest' : 'default';
}

function getCatalogSortedMoviesSource(selectedSortMode) {
  const modeKey = getCatalogSortModeKey(selectedSortMode);
  const sortedMovies = catalogSortedMoviesByMode[modeKey];

  if (!Array.isArray(sortedMovies) || sortedMovies.length !== allMovies.length) {
    return null;
  }

  return sortedMovies;
}

function getUserRatingControlsHtml(currentUserRating, isRatingBusy = false) {
  if (!currentUser) {
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

function getHighlightedCatalogText(value, renderContext, fallbackHtml = escapeHtml(value)) {
  return renderContext.queryWords.length > 0
    ? renderContext.highlightText(value)
    : fallbackHtml;
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
      <a href="${cardRenderMeta.pageUrl}" class="movie-title-link">${titleHtml}</a>
    </h5>

    ${originalTitleHtml ? `<p>Оригинальное название: ${originalTitleHtml}</p>` : ''}
    <p>Год: ${escapeHtml(movie.year ?? '-')}</p>
    <p>Режиссёр: ${directorHtml}</p>
    <p>Жанры: ${cardRenderMeta.escapedGenres}</p>
    <p>Страны: ${cardRenderMeta.escapedCountries}</p>
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

function getPosterHtml(
  movie,
  userMovieState,
  matchedSearchAlias = null,
  renderContext = createMovieCardRenderContext(),
  isWatchlistBusy = false,
  cardRenderMeta = getCatalogMovieMeta(movie).cardRender,
  renderOptions = {}
) {
  const posterUrl = cardRenderMeta.posterUrl;
  const isPosterLoaded = posterUrl && loadedPosterUrls.has(posterUrl);
  const isPriorityPoster = Boolean(renderOptions.isPriorityPoster);
  const matchedSearchAliasHtml = matchedSearchAlias
    ? getHighlightedCatalogText(matchedSearchAlias, renderContext)
    : '';

  return `
    <div class="movie-poster-block">
      <a href="${cardRenderMeta.pageUrl}" class="movie-poster-link" aria-label="${cardRenderMeta.escapedPageLabel}">
        <div class="movie-poster-wrapper">
          ${
            posterUrl
              ? `
                <div class="movie-poster-skeleton ${isPosterLoaded ? 'is-hidden' : ''}" aria-hidden="true"></div>
                <img
                  class="movie-poster ${isPosterLoaded ? 'is-loaded' : ''}"
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
            currentUser && !userMovieState.isWatched
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

function handleCatalogEmptyStateClick(event) {
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
}

function bindCatalogEmptyStateEvents() {
  const emptyStateElement = container?.querySelector('.empty-state');

  if (!emptyStateElement) {
    return;
  }

  emptyStateElement.addEventListener('click', handleCatalogEmptyStateClick);
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

  bindCatalogEmptyStateEvents();
}

function bindPosterLoadState(posterImage, posterSkeleton) {
  if (!posterImage || !posterSkeleton) {
    return;
  }

  const handlePosterReady = () => {
    const loadedPosterUrl = posterImage.dataset.originalPosterSrc || posterImage.currentSrc || posterImage.src;

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

  const handlePosterError = () => {
    if (restorePosterFallbackSource(posterImage)) {
      return;
    }

    posterSkeleton.classList.add('is-hidden');
  };

  posterImage.addEventListener('load', handlePosterReady, { once: true });
  posterImage.addEventListener('error', handlePosterError);
}

function getCatalogRatingStarContext(target) {
  const starButton = target.closest('.rating-star-btn');

  if (!starButton || !container?.contains(starButton)) {
    return null;
  }

  const starsContainer = starButton.closest('.movie-user-rating-stars');
  const card = starButton.closest('.movie-card[data-movie-id]');

  if (!starsContainer || !card) {
    return null;
  }

  return {
    starButton,
    starsContainer,
    card,
    movieId: card.dataset.movieId
  };
}

function applyCatalogRatingStarState(starsContainer, activeValue, mode = 'selected') {
  if (!starsContainer) {
    return;
  }

  const voteButtons = starsContainer.querySelectorAll('.rating-star-btn');
  const scaleItems = starsContainer.parentElement?.querySelectorAll('.movie-user-rating-scale-item') || [];

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
}

function resetCatalogRatingStarState(starsContainer) {
  const selectedValue = Number(starsContainer?.dataset.currentRating || 0);

  applyCatalogRatingStarState(starsContainer, selectedValue, 'selected');
}

function handleCatalogRatingStarMouseOver(event) {
  const context = getCatalogRatingStarContext(event.target);

  if (!context || context.starButton.disabled || ratingRequestInFlight.has(String(context.movieId))) {
    return;
  }

  applyCatalogRatingStarState(
    context.starsContainer,
    Number(context.starButton.dataset.ratingValue),
    'hover'
  );
}

function handleCatalogRatingStarMouseOut(event) {
  const starsContainer = event.target.closest('.movie-user-rating-stars');

  if (!starsContainer || !container?.contains(starsContainer)) {
    return;
  }

  if (event.relatedTarget && starsContainer.contains(event.relatedTarget)) {
    return;
  }

  resetCatalogRatingStarState(starsContainer);
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

function shouldResetMovieCardFocusAfterLinkOpen(event) {
  return (
    event.button === 1 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

function resetMovieCardFocusAfterLinkOpen(event, link = event.currentTarget) {
  if (!shouldResetMovieCardFocusAfterLinkOpen(event)) {
    return;
  }

  window.setTimeout(() => {
    if (document.activeElement === link && typeof link.blur === 'function') {
      link.blur();
    }
  }, 0);
}

function getCatalogCardActionContext(target) {
  if (!container || !target) {
    return null;
  }

  const card = target.closest('.movie-card[data-movie-id]');

  if (!card || !container.contains(card)) {
    return null;
  }

  const movieId = card.dataset.movieId;

  if (!movieId) {
    return null;
  }

  return {
    card,
    movieId,
    movie: getCatalogMovieById(movieId)
  };
}

function closeCatalogExternalLinksCard(card) {
  if (!card) {
    return;
  }

  const toggle = card.querySelector('[data-external-links-toggle="true"]');
  const panel = card.querySelector('[data-external-links-collapsible]');
  const grid = card.querySelector('.movie-external-links');

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

  card.classList.remove('has-open-external-links');
}

function toggleCatalogExternalLinksPanel(toggleButton, card) {
  const panel = card?.querySelector('[data-external-links-collapsible]');

  if (!toggleButton || !card || !panel) {
    return;
  }

  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  const openedCard = container.querySelector('.movie-card.has-open-external-links');

  if (openedCard && openedCard !== card) {
    closeCatalogExternalLinksCard(openedCard);
  }

  if (isExpanded) {
    closeCatalogExternalLinksCard(card);
    return;
  }

  const grid = card.querySelector('.movie-external-links');

  if (grid) {
    grid.classList.remove('is-two-rows');
  }

  toggleButton.setAttribute('aria-expanded', 'true');
  toggleButton.textContent = 'Свернуть';
  panel.classList.add('is-open');
  card.classList.add('has-open-external-links');

  requestAnimationFrame(syncOpenExternalLinksLayouts);
}

function handleCatalogCardAuxClick(event) {
  const link = event.target.closest('.movie-poster-link, .movie-title-link');

  if (link && container?.contains(link)) {
    resetMovieCardFocusAfterLinkOpen(event, link);
  }
}

async function handleCatalogCardClick(event) {
  const target = event.target;

  if (!container || !container.contains(target)) {
    return;
  }

  const link = target.closest('.movie-poster-link, .movie-title-link');

  if (link) {
    resetMovieCardFocusAfterLinkOpen(event, link);
  }

  const context = getCatalogCardActionContext(target);

  if (!context) {
    return;
  }

  const { card, movieId, movie } = context;
  const ratingStarBtn = target.closest('.rating-star-btn');

  if (ratingStarBtn) {
    if (!ratingStarBtn.disabled && !ratingRequestInFlight.has(String(movieId))) {
      saveUserMovieRating(movieId, Number(ratingStarBtn.dataset.ratingValue));
    }

    return;
  }

  const watchlistToggleBtn = target.closest('[data-watchlist-toggle="true"]');

  if (watchlistToggleBtn) {
    event.preventDefault();
    event.stopPropagation();

    if (!watchlistToggleBtn.disabled) {
      toggleMovieWatchlist(movieId);
    }

    return;
  }

  const externalLinksToggleBtn = target.closest('[data-external-links-toggle="true"]');

  if (externalLinksToggleBtn) {
    toggleCatalogExternalLinksPanel(externalLinksToggleBtn, card);
    return;
  }

  const removeRatingBtn = target.closest('[data-remove-rating="true"]');

  if (removeRatingBtn) {
    if (!removeRatingBtn.disabled) {
      removeUserMovieRating(movieId);
    }

    return;
  }

  const openMobileRatingBtn = target.closest('[data-open-mobile-rating="true"]');

  if (openMobileRatingBtn) {
    if (movie && !openMobileRatingBtn.disabled) {
      openMobileRatingModal(movie);
    }

    return;
  }

  const editBtn = target.closest('.edit-movie-btn');

  if (editBtn) {
    if (isAdmin && movie) {
      const movieForEdit = await getMovieForAdminEdit(movieId, movie);

      if (movieForEdit) {
        fillFormForEdit(movieForEdit);
      }
    }

    return;
  }

  const deleteBtn = target.closest('.delete-movie-btn');

  if (deleteBtn && isAdmin && movie) {
    armDeleteMovieButton(deleteBtn, () => {
      deleteMovie(movieId, movie.title);
    });
  }
}

function createMovieCardRenderContext(searchQuery = searchInput.value) {
  const queryWords = getSearchQueryWords(searchQuery);

  return {
    searchQuery,
    queryWords,
    highlightText: createSearchHighlighter(searchQuery)
  };
}

function createMovieCard(
  movie,
  renderContext = createMovieCardRenderContext(),
  renderOptions = {}
) {
  const card = document.createElement('article');
  const movieId = movie.id;
  const currentUserRating = getCurrentUserRating(movieId);
  const userMovieState = getCurrentUserMovieState(movieId);
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
  const isRatingBusy = ratingRequestInFlight.has(String(movieId));
  const isWatchlistBusy = watchlistRequestInFlight.has(String(movieId));

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
      ${userRatingControlsHtml}
    </div>

    ${isAdmin ? `
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

  const movie = getCatalogMovieById(movieId);

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
    persistCatalogDomSnapshot();
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

  persistCatalogDomSnapshot();
}

function getCatalogDerivedStateSignature(filterState, selectedSortMode) {
  return JSON.stringify({
    dataVersion: catalogDataVersion,
    pageSize: CATALOG_PAGE_SIZE,
    userId: currentUser?.id || null,
    viewMode: viewMode?.value || 'list',
    sortMode: selectedSortMode,
    page: currentCatalogPage,
    filterState
  });
}

function hasCatalogFilterStateOverrides(options = {}) {
  const {
    skipSorting = false,
    ignoreGenre = false,
    ignoreSubgenre = false,
    ignoreFormat = false,
    ignoreCountry = false,
    ignoreYear = false
  } = options;

  return Boolean(
    skipSorting ||
    ignoreGenre ||
    ignoreSubgenre ||
    ignoreFormat ||
    ignoreCountry ||
    ignoreYear ||
    ignoreTriggerExcludes
  );
}

function filterCatalogMovies(filterState, { skipSorting = false, selectedSortMode = sortMode?.value || 'default' } = {}) {
  const filteredMovies = [];
  const sourceMovies = skipSorting
    ? allMovies
    : (getCatalogSortedMoviesSource(selectedSortMode) || allMovies);

  sourceMovies.forEach(movie => {
    const meta = getCatalogMovieMeta(movie);

    if (doesMovieMatchCatalogFilters(movie, filterState, meta)) {
      filteredMovies.push(movie);
    }
  });

  if (!skipSorting && sourceMovies === allMovies) {
    sortMovies(filteredMovies, selectedSortMode);
  }

  return filteredMovies;
}

function getCatalogDerivedState() {
  const selectedSortMode = sortMode?.value || 'default';
  const filterState = getCatalogFilterStateSnapshot();
  const cacheSignature = getCatalogDerivedStateSignature(filterState, selectedSortMode);

  if (catalogDerivedStateCache?.signature === cacheSignature) {
    return catalogDerivedStateCache.state;
  }

  const filteredMovies = filterCatalogMovies(filterState, { selectedSortMode });
  const paginationState = getCatalogPaginationState(filteredMovies.length);
  const pageMovies = filteredMovies.slice(paginationState.startIndex, paginationState.endIndex);
  const state = {
    filteredMovies,
    filteredTotal: filteredMovies.length,
    pageMovies,
    paginationState,
    filterState,
    selectedSortMode
  };

  catalogDerivedStateCache = {
    signature: getCatalogDerivedStateSignature(filterState, selectedSortMode),
    state
  };

  return state;
}

function getFilteredMovies(options = {}) {
  if (!hasCatalogFilterStateOverrides(options)) {
    return getCatalogDerivedState().filteredMovies;
  }

  return filterCatalogMovies(getCatalogFilterStateSnapshot(options), {
    skipSorting: Boolean(options.skipSorting),
    selectedSortMode: sortMode?.value || 'default'
  });
}

function getCatalogFilterStateSnapshot(options = {}) {
  const {
    ignoreGenre = false,
    ignoreSubgenre = false,
    ignoreFormat = false,
    ignoreCountry = false,
    ignoreYear = false,
    ignoreTriggerExcludes = false
  } = options;
  const minRating = ratingFilter.value;
  const selectedWatchlist = watchlistFilter.value;
  const selectedWatched = watchedFilter.value;
  const searchQuery = searchInput.value;
  const searchQueryWords = getSearchQueryWords(searchQuery);
  return {
    selectedGenre: ignoreGenre ? '' : genreFilter.value,
    selectedSubgenre: ignoreSubgenre ? '' : subgenreFilter.value,
    selectedFormat: ignoreFormat ? '' : formatFilter.value,
    selectedCountry: ignoreCountry ? '' : countryFilter.value,
    minRating,
    minimumRating: Number(minRating),
    selectedYear: ignoreYear ? '' : yearFilter.value,
    selectedYearNumber: Number(yearFilter.value),
    selectedWatchlist,
    hasWatchlistFilter: selectedWatchlist === 'in_watchlist' || selectedWatchlist === 'not_in_watchlist',
    selectedWatched,
    hasWatchedFilter: selectedWatched === 'watched' || selectedWatched === 'unwatched',
    searchQuery,
    searchQueryWords,
    hasSearchQuery: searchQueryWords.length > 0,
    hasCurrentUser: Boolean(currentUser),
    isLowRatedPresetActive: getActiveQuickPresetKey() === 'low-rated',
    reviewedOnly: reviewedOnlyFilter
  };
}

function doesMovieMatchCatalogFilters(movie, filterState, meta = getCatalogMovieMeta(movie)) {
  if (
    filterState.hasSearchQuery &&
    !movieMatchesSearch(movie, filterState.searchQuery, filterState.searchQueryWords)
  ) {
    return false;
  }

  if (filterState.selectedGenre && !meta.genreNames.has(filterState.selectedGenre)) {
    return false;
  }

  if (filterState.selectedSubgenre && !meta.subgenreKeys.has(filterState.selectedSubgenre)) {
    return false;
  }

  if (filterState.selectedFormat && !meta.formatKeys.has(filterState.selectedFormat)) {
    return false;
  }

  if (filterState.selectedCountry && !meta.countryNames.has(filterState.selectedCountry)) {
    return false;
  }

  if (filterState.minRating !== '') {
    const averageRating = getMovieAverageRating(movie.id);
    const matchesRating = filterState.isLowRatedPresetActive
      ? averageRating > 0 && averageRating <= filterState.minimumRating
      : averageRating >= filterState.minimumRating;

    if (!matchesRating) {
      return false;
    }
  }

  if (
    filterState.selectedYear &&
    (
      movie.year === null ||
      Number(movie.year) !== filterState.selectedYearNumber
    )
  ) {
    return false;
  }

  if (filterState.reviewedOnly && !catalogReviewedMovieIds.has(String(movie.id))) {
    return false;
  }

  let currentUserMovieState = null;

  if (filterState.hasCurrentUser && filterState.hasWatchlistFilter) {
    currentUserMovieState = getCurrentUserMovieState(movie.id);

    if (
      filterState.selectedWatchlist === 'in_watchlist'
        ? !currentUserMovieState.isInWatchlist
        : currentUserMovieState.isInWatchlist
    ) {
      return false;
    }
  }

  if (filterState.hasCurrentUser && filterState.hasWatchedFilter) {
    currentUserMovieState = currentUserMovieState || getCurrentUserMovieState(movie.id);

    if (
      filterState.selectedWatched === 'watched'
        ? !currentUserMovieState.isWatched
        : currentUserMovieState.isWatched
    ) {
      return false;
    }
  }

  return true;
}

function getCatalogFilterMatches(movie, filterState, meta = getCatalogMovieMeta(movie)) {
  const currentUserMovieState = (
    filterState.hasCurrentUser &&
    (filterState.hasWatchlistFilter || filterState.hasWatchedFilter)
  )
    ? getCurrentUserMovieState(movie.id)
    : null;
  const averageRating = filterState.minRating !== ''
    ? getMovieAverageRating(movie.id)
    : 0;
  return {
    search: (
      !filterState.hasSearchQuery ||
      movieMatchesSearch(movie, filterState.searchQuery, filterState.searchQueryWords)
    ),
    genre: !filterState.selectedGenre || meta.genreNames.has(filterState.selectedGenre),
    subgenre: !filterState.selectedSubgenre || meta.subgenreKeys.has(filterState.selectedSubgenre),
    format: !filterState.selectedFormat || meta.formatKeys.has(filterState.selectedFormat),
    country: !filterState.selectedCountry || meta.countryNames.has(filterState.selectedCountry),
    rating: (
      filterState.minRating === '' ||
      (
        filterState.isLowRatedPresetActive
          ? averageRating > 0 && averageRating <= filterState.minimumRating
          : averageRating >= filterState.minimumRating
      )
    ),
    year: (
      !filterState.selectedYear ||
      (
        movie.year !== null &&
        Number(movie.year) === filterState.selectedYearNumber
      )
    ),
    reviews: !filterState.reviewedOnly || catalogReviewedMovieIds.has(String(movie.id)),
    watchlist: (
      !filterState.hasCurrentUser ||
      !filterState.hasWatchlistFilter ||
      (
        filterState.selectedWatchlist === 'in_watchlist'
          ? currentUserMovieState.isInWatchlist
          : !currentUserMovieState.isInWatchlist
      )
    ),
    watched: (
      !filterState.hasCurrentUser ||
      !filterState.hasWatchedFilter ||
      (
        filterState.selectedWatched === 'watched'
          ? currentUserMovieState.isWatched
          : !currentUserMovieState.isWatched
      )
    )
  };
}

function matchesCatalogFilterCountScope(matches, ignoredFilterKey) {
  return (
    matches.search &&
    (ignoredFilterKey === 'genre' || matches.genre) &&
    (ignoredFilterKey === 'subgenre' || matches.subgenre) &&
    (ignoredFilterKey === 'format' || matches.format) &&
    (ignoredFilterKey === 'country' || matches.country) &&
    (ignoredFilterKey === 'year' || matches.year) &&
    matches.rating &&
    matches.reviews &&
    matches.watchlist &&
    matches.watched
  );
}

function addCount(counts, value) {
  if (!value) {
    return;
  }

  counts.set(value, (counts.get(value) || 0) + 1);
}

function getDynamicFilterOptionCounts() {
  const counts = {
    genreCounts: new Map(),
    subgenreCounts: new Map(),
    formatCounts: new Map(),
    countryCounts: new Map(),
    yearCounts: new Map()
  };
  const filterState = getCatalogFilterStateSnapshot();

  allMovies.forEach(movie => {
    const meta = getCatalogMovieMeta(movie);
    const matches = getCatalogFilterMatches(movie, filterState, meta);

    if (matchesCatalogFilterCountScope(matches, 'genre')) {
      meta.filterableGenreNames.forEach(genreName => {
        addCount(counts.genreCounts, genreName);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'subgenre')) {
      meta.subgenreKeys.forEach(subgenreKey => {
        addCount(counts.subgenreCounts, subgenreKey);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'format')) {
      meta.formatKeys.forEach(formatKey => {
        addCount(counts.formatCounts, formatKey);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'country')) {
      meta.countryNames.forEach(countryName => {
        addCount(counts.countryCounts, countryName);
      });
    }

    if (matchesCatalogFilterCountScope(matches, 'year')) {
      addCount(counts.yearCounts, Number(movie?.year));
    }
  });

  return counts;
}

function refreshDynamicFilterOptions() {
  const filterOptionCounts = getDynamicFilterOptionCounts();

  refreshGenreFilterOptions(filterOptionCounts.genreCounts);
  loadSubgenreFilterOptions(filterOptionCounts.subgenreCounts);
  loadFormatFilterOptions(filterOptionCounts.formatCounts);
  refreshCountryFilterOptions(filterOptionCounts.countryCounts);
  loadYearFilterOptions(filterOptionCounts.yearCounts);
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

      const votesA = getMovieVotesCount(a.id);
      const votesB = getMovieVotesCount(b.id);

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

function createMonthSection(
  month,
  movies,
  initialReleaseDirection = 'desc',
  renderContext = createMovieCardRenderContext(),
  getCardRenderOptions = () => ({})
) {
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
      monthCards.appendChild(createMovieCard(movie, renderContext, getCardRenderOptions(movie)));
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

  currentCatalogPaginationSlots = getCatalogPaginationSlots();
  container.classList.remove('is-catalog-visible');

  renderActiveFilterChips();
  syncQuickPresetButtons();

  const {
    filteredTotal,
    paginationState,
    pageMovies
  } = getCatalogDerivedState();
  const cardRenderContext = createMovieCardRenderContext(searchInput.value);

  if (moviesResultCount) {
    moviesResultCount.textContent = getMoviesResultCountText(filteredTotal, paginationState);
  }

  if (filteredTotal === 0) {
    updateCatalogStructuredData([], paginationState);
    clearCatalogPagination();
    renderEmptyState();
    persistCatalogDomSnapshot();
    return;
  }

  updateCatalogStructuredData(pageMovies, paginationState);
  renderCatalogPagination(paginationState);

  let priorityPosterSlotsRemaining = CATALOG_PRIORITY_POSTER_COUNT;
  const getPriorityPosterOptions = movie => {
    const isPriorityPoster = priorityPosterSlotsRemaining > 0 && Boolean(movie?.poster_url);

    if (isPriorityPoster) {
      priorityPosterSlotsRemaining = Math.max(0, priorityPosterSlotsRemaining - 1);
    }

    return { isPriorityPoster };
  };

  if (viewMode.value === 'list') {
    const moviesFragment = document.createDocumentFragment();

    pageMovies.forEach(movie => {
      moviesFragment.appendChild(createMovieCard(movie, cardRenderContext, getPriorityPosterOptions(movie)));
    });

    container.replaceChildren(moviesFragment);
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
          defaultMonthReleaseDirection,
          cardRenderContext,
          getPriorityPosterOptions
        )
      );
      currentMonth = null;
      currentMonthMovies = [];
    };
    
    pageMovies.forEach(movie => {
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
    container.replaceChildren(moviesFragment);
  }

  persistCatalogDomSnapshot();
}

/* =========================================================
JS-БЛОК 22. ОБРАБОТЧИКИ СОБЫТИЙ ИНТЕРФЕЙСА
Навешивает события на форму, фильтры, auth и модальное окно.
========================================================== */
const debouncedRenderMovies = createDebouncedCatalogRender(200);

let lastSearchQuery = '';

const debouncedRenderMoviesForFilters = createDebouncedCatalogRender(120);

function saveCatalogStateAndRenderFilters() {
  prepareCatalogStateForDeferredRender({ resetPage: true });
  debouncedRenderMoviesForFilters();
}

const handleFiltersChange = () => {
  trackFiltersUsageIfNeeded();
  refreshDynamicFilterOptions();
  saveCatalogStateAndRenderFilters();
};

function bindSharedUiEvents() {
  if (areSharedUiEventsBound) {
    return;
  }

  loginForm?.addEventListener('submit', login);
  loginEmail?.addEventListener('input', clearAuthMessage);
  loginPassword?.addEventListener('input', clearAuthMessage);
  loginPasswordConfirm?.addEventListener('input', clearAuthMessage);
  appToastAcceptButton?.addEventListener('click', clearAppMessage);

  registerButton?.addEventListener('click', () => {
    setAuthRegisterMode(!isAuthRegisterMode);
  });

  logoutMenuButton?.addEventListener('click', () => {
    closeAuthPopoverMenu();
    logout();
  });

  profileSummaryButton?.addEventListener('click', openCurrentUserProfilePage);

  manualSimilarAuditButton?.addEventListener('click', runManualSimilarAudit);

  if (importLetterboxdRatingsButton && letterboxdRatingsFileInput) {
    importLetterboxdRatingsButton.addEventListener('click', () => {
      if (isLetterboxdRatingsImporting) {
        return;
      }

      letterboxdRatingsFileInput.value = '';
      lastLetterboxdRatingsImportFileToken = '';
      showAppMessage('Выбери ratings.csv из экспорта Letterboxd.', 'info', true);
      letterboxdRatingsFileInput.click();
    });

    letterboxdRatingsFileInput.addEventListener('input', handleLetterboxdRatingsFileChange);
    letterboxdRatingsFileInput.addEventListener('change', handleLetterboxdRatingsFileChange);

    letterboxdRatingsFileInput.addEventListener('cancel', () => {
      if (!isLetterboxdRatingsImporting) {
        showAppMessage('Файл не выбран. Импорт Letterboxd не запускался.', 'info', true);
      }
    });
  }

  displayNameButton?.addEventListener('click', () => {
    toggleDisplayNameModal();
  });

  displayNameForm?.addEventListener('submit', saveDisplayName);

  cancelDisplayNameButton?.addEventListener('click', () => {
    closeDisplayNameModal();
  });

  closeDisplayNameModalButton?.addEventListener('click', () => {
    closeDisplayNameModal();
  });

  displayNameModalBackdrop?.addEventListener('click', () => {
    closeDisplayNameModal();
  });

  openAuthModalButton?.addEventListener('click', () => {
    if (shouldUseAuthenticatedUi()) {
      toggleAuthPopoverMenu();
      return;
    }

    openAuthModal();
  });

  closeAuthModalButton?.addEventListener('click', () => {
    closeAuthModal();
  });

  authModalBackdrop?.addEventListener('click', () => {
    closeAuthModal();
  });

  forgotPasswordButton?.addEventListener('click', () => {
    sendPasswordResetEmail();
  });

  document.addEventListener('click', event => {
    handleUserPageRailControlClick(event);

    const clickedInsideAuthMenu = event.target.closest('.auth-menu-wrap');

    if (!clickedInsideAuthMenu) {
      closeAuthPopoverMenu();
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

    closeCatalogExternalLinksCard(openedCard);
  });

  window.addEventListener('resize', scheduleAppResizeSync);

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') {
      return;
    }

    closeMobileRatingModal();
    closeAllCustomSelects();
    closeAuthPopoverMenu();
    closeDisplayNameModal();

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

  areSharedUiEventsBound = true;
}

function bindCatalogPageEvents() {
  if (areCatalogPageEventsBound) {
    return;
  }

  openAddMovieButton?.addEventListener('click', () => {
    resetFormToCreateMode();
    openMovieModal();
  });

  openFiltersButton?.addEventListener('click', () => {
    openFiltersModal();
  });

  closeFiltersModalButton?.addEventListener('click', () => {
    closeFiltersModal();
  });

  filtersModalBackdrop?.addEventListener('click', () => {
    closeFiltersModal();
  });

  searchInput?.addEventListener('input', () => {
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

    prepareCatalogStateForDeferredRender({ resetPage: true });
    debouncedRenderMovies();
  });

  searchInput?.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !searchInput.value) {
      return;
    }

    event.preventDefault();
    clearSearchAndRerenderPreservingPosition();
  });

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.classList.remove('is-visible');
      clearSearchAndRerenderPreservingPosition();
    });
  }

  [
    genreFilter,
    subgenreFilter,
    formatFilter,
    countryFilter,
    ratingFilter,
    yearFilter,
    watchlistFilter,
    watchedFilter
  ].forEach(filterElement => {
    filterElement?.addEventListener('change', handleFiltersChange);
  });

  viewMode?.addEventListener('change', () => {
    applyCatalogViewModeChange();
  });

  sortMode?.addEventListener('change', () => {
    trackSortUsageIfNeeded();
    resetCatalogPaginationPage();
    rerenderCatalogPreservingPosition();
  });

  getCatalogPaginationContainers().forEach(paginationContainer => {
    paginationContainer.addEventListener('click', event => {
      const pageButton = event.target.closest('[data-catalog-page]');

      if (!pageButton || pageButton.disabled) {
        return;
      }

      goToCatalogPage(pageButton.dataset.catalogPage);
    });
  });

  quickPresetsBar?.addEventListener('click', event => {
    const quickPresetButton = event.target.closest('[data-quick-preset]');

    if (!quickPresetButton) {
      return;
    }

    applyQuickPreset(quickPresetButton.dataset.quickPreset);
  });

  resetFiltersTopButton?.addEventListener('click', () => {
    resetCatalogFiltersAndRerender();
  });

  if (container) {
    container.addEventListener('click', handleCatalogCardClick);
    container.addEventListener('auxclick', handleCatalogCardAuxClick);
    container.addEventListener('mouseover', handleCatalogRatingStarMouseOver);
    container.addEventListener('mouseout', handleCatalogRatingStarMouseOut);
  }

  window.addEventListener('pagehide', event => {
    if (event.persisted || !container) {
      return;
    }

    saveCatalogScrollPosition();
    saveCatalogAnchorMovieId();
    persistCatalogSessionSnapshot({
      persistDomSnapshotImmediately: true
    });
  });

  areCatalogPageEventsBound = true;
}

function bindMoviePageEvents() {
  if (areMoviePageEventsBound) {
    return;
  }

  moviePageEditButton?.addEventListener('click', async () => {
    if (!isAdmin || !currentMoviePageMovieId) {
      return;
    }

    const movieForEdit = await getMovieForAdminEdit(currentMoviePageMovieId, currentMoviePageMovieData);

    if (!movieForEdit) {
      return;
    }

    fillFormForEdit(movieForEdit);
  });

  moviePageDeleteButton?.addEventListener('click', () => {
    if (!isAdmin || !currentMoviePageMovieId || !currentMoviePageMovieData) {
      return;
    }

    armDeleteMovieButton(moviePageDeleteButton, () => {
      deleteMovieFromMoviePage(currentMoviePageMovieId, currentMoviePageMovieData.title);
    });
  });

  areMoviePageEventsBound = true;
}

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

function isUserPage() {
  return Boolean(userPage);
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
      event !== 'SIGNED_OUT'
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
      try {
        await applyCurrentSessionUser(session?.user ?? null);
        trackEmailConfirmedLoginIfNeeded();

        if (currentRequestId !== authStateSyncRequestId) {
          return;
        }

        await Promise.all([
          fetchMovieRatings(),
          fetchMovieWatchlist()
        ]);

        if (currentRequestId !== authStateSyncRequestId) {
          return;
        }

        if (typeof onAfterAuthSync === 'function') {
          onAfterAuthSync();
        }
      } catch (error) {
        console.error('Ошибка синхронизации auth-состояния:', error);
      }
    }, 0);
  });
}

function hydrateCatalogPageFromSnapshot(hydratedSnapshot, { shouldRestoreScroll = true } = {}) {
  const didHydrateCatalogFromSnapshot = hydrateCatalogFromSessionSnapshot(hydratedSnapshot);
  let didHydrateCatalogDomFromSnapshot = false;
  let hydratedCatalogSignature = '';

  if (!didHydrateCatalogFromSnapshot) {
    return {
      didHydrateCatalogFromSnapshot,
      didHydrateCatalogDomFromSnapshot,
      hydratedCatalogSignature
    };
  }

  applySavedCatalogState();
  refreshDynamicFilterOptions();
  didHydrateCatalogDomFromSnapshot = hydrateCatalogDomFromSessionSnapshot(hydratedSnapshot);

  if (!didHydrateCatalogDomFromSnapshot) {
    renderMovies();
  }

  updateFiltersButtonLabel();

  if (shouldRestoreScroll) {
    restoreCatalogScrollPosition();
  }

  hydratedCatalogSignature = getCatalogDataSignatureHash(createCatalogSessionSnapshotPayload());

  return {
    didHydrateCatalogFromSnapshot,
    didHydrateCatalogDomFromSnapshot,
    hydratedCatalogSignature
  };
}

async function initCatalogPage() {
  initCatalogViewToggleButton();
  renderMoviesSkeleton();

  const restoreSessionPromise = restoreSession();
  const hydratedSnapshot = readCatalogSessionSnapshot();
  const preAuthUserId = currentUser?.id || null;
  let hydrationState = hydrateCatalogPageFromSnapshot(hydratedSnapshot);

  const restoredUser = await restoreSessionPromise;
  trackEmailConfirmedLoginIfNeeded();

  const activeUserId = currentUser?.id || null;
  const shouldRehydrateForRestoredUser = (
    hydratedSnapshot &&
    activeUserId &&
    activeUserId !== preAuthUserId &&
    (hydratedSnapshot.userId || null) === activeUserId
  );

  if (shouldRehydrateForRestoredUser) {
    hydrationState = hydrateCatalogPageFromSnapshot(hydratedSnapshot, {
      shouldRestoreScroll: false
    });
  }

  bindSharedAuthStateListener({
    onAfterAuthSync: () => {
      applySavedCatalogState();
      syncCatalogAfterAuthChange();
    }
  });

  await reloadCatalogData({
    showSkeleton: !hydrationState.didHydrateCatalogFromSnapshot,
    refreshFilters: false
  });
  applySavedCatalogState();
  refreshDynamicFilterOptions();

  const refreshedCatalogSignature = getCatalogDataSignatureHash(createCatalogSessionSnapshotPayload());
  const canReuseHydratedCatalog = (
    hydrationState.didHydrateCatalogFromSnapshot &&
    hydrationState.hydratedCatalogSignature &&
    hydrationState.hydratedCatalogSignature === refreshedCatalogSignature
  );

  if (canReuseHydratedCatalog) {
    updateFiltersButtonLabel();
    return;
  }

  if (hydrationState.didHydrateCatalogFromSnapshot) {
    preserveWindowScrollPosition(renderMovies);
  } else if (restoredUser && !isPasswordRecoveryMode) {
    syncCatalogAfterAuthChange();
  } else {
    renderMovies();
  }

  updateFiltersButtonLabel();

  if (!hydrationState.didHydrateCatalogFromSnapshot) {
    restoreCatalogScrollPosition();
  }
}

function isSafeUserProfileLookupHandle(handle) {
  return /^[A-Za-z0-9_-]{3,80}$/.test(String(handle || '').trim());
}

function getUserPageRouteHandle() {
  const searchParams = new URLSearchParams(window.location.search);
  const pathHandleMatch = window.location.pathname.match(/\/user\/([^/]+)\/?$/);
  const pathHandle = pathHandleMatch ? decodeURIComponent(pathHandleMatch[1] || '').trim() : '';
  const queryHandle = String(searchParams.get('handle') || '').trim();

  return pathHandle || queryHandle || '';
}

function getPublicProfileDisplayName(profile) {
  return String(
    profile?.display_name ||
    profile?.default_display_name ||
    'Пользователь'
  ).trim();
}

function getPublicProfileHandle(profile) {
  return String(profile?.default_display_name || '').trim();
}

function buildUserCanonicalUrl(profile) {
  return `${SITE_ORIGIN}${buildUserPageUrl(getPublicProfileHandle(profile))}`;
}

function setUserPageDocumentMeta(profile) {
  if (!profile) {
    document.title = 'Пользователь не найден — Хоррорейро';
    upsertDocumentMeta({ name: 'description', content: 'Пользователь не найден в Хоррорейро.' });
    upsertDocumentMeta({ name: 'robots', content: 'noindex, follow' });
    upsertDocumentCanonical(window.location.href);
    removeStructuredDataScript(MOVIE_STRUCTURED_DATA_SCRIPT_ID);
    removeStructuredDataScript(CATALOG_STRUCTURED_DATA_SCRIPT_ID);
    return;
  }

  const displayName = getPublicProfileDisplayName(profile);
  const title = `${displayName} — профиль пользователя Хоррорейро`;
  const description = `Профиль пользователя ${displayName}: оценки, список просмотра и рецензии в каталоге Хоррорейро.`;
  const canonicalUrl = buildUserCanonicalUrl(profile);

  document.title = title;
  upsertDocumentMeta({ name: 'description', content: description });
  upsertDocumentMeta({ name: 'robots', content: 'index, follow' });
  upsertDocumentCanonical(canonicalUrl);
  upsertDocumentMeta({ property: 'og:type', content: 'profile' });
  upsertDocumentMeta({ property: 'og:title', content: title });
  upsertDocumentMeta({ property: 'og:description', content: description });
  upsertDocumentMeta({ property: 'og:url', content: canonicalUrl });
  upsertDocumentMeta({ property: 'og:image', content: DEFAULT_SOCIAL_IMAGE_URL });
  upsertDocumentMeta({ name: 'twitter:title', content: title });
  upsertDocumentMeta({ name: 'twitter:description', content: description });
  upsertDocumentMeta({ name: 'twitter:image', content: DEFAULT_SOCIAL_IMAGE_URL });
  upsertDocumentMeta({ name: 'twitter:url', content: canonicalUrl });
  removeStructuredDataScript(MOVIE_STRUCTURED_DATA_SCRIPT_ID);
  removeStructuredDataScript(CATALOG_STRUCTURED_DATA_SCRIPT_ID);
}

async function fetchPublicUserProfileByHandle(handle) {
  const normalizedHandle = String(handle || '').trim();

  if (!normalizedHandle || !isSafeUserProfileLookupHandle(normalizedHandle)) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, display_name, default_display_name')
    .eq('default_display_name', normalizedHandle)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data || null;
}

function getUserPageMovieIds(rows = []) {
  return [...new Set(
    (Array.isArray(rows) ? rows : [])
      .map(row => String(row?.movie_id || ''))
      .filter(Boolean)
  )];
}

function getUserPageAverageRating(ratingRows) {
  const values = (Array.isArray(ratingRows) ? ratingRows : [])
    .map(row => Number(row.rating))
    .filter(rating => Number.isFinite(rating) && rating > 0);

  if (!values.length) {
    return null;
  }

  return values.reduce((sum, rating) => sum + rating, 0) / values.length;
}

function sortUserPageMoviesByTitle(firstItem, secondItem) {
  return getManualSimilarMovieLabel(firstItem.movie).localeCompare(
    getManualSimilarMovieLabel(secondItem.movie),
    'ru'
  );
}

function getUserPageMovieCardHtml(item, getBadgeHtml = null) {
  const movie = item.movie;
  const movieTitle = getManualSimilarMovieLabel(movie);
  const originalTitle = String(movie?.original_title || '').trim();
  const year = movie?.year ? String(movie.year) : '';
  const badgeHtml = getBadgeHtml ? getBadgeHtml(item) : '';

  return `
    <a href="${buildMoviePageUrl(movie)}" class="user-page-movie-card" aria-label="Перейти к фильму ${escapeHtml(movieTitle)}">
      <div class="user-page-movie-poster-wrapper">
        ${
          movie.poster_url
            ? `
              <img
                class="user-page-movie-poster"
                ${getPosterImageAttributeHtml(movie.poster_url, 'similar')}
                alt="Постер фильма ${escapeHtml(movieTitle)}"
                loading="lazy"
                decoding="async"
              >
            `
            : `<div class="movie-poster-placeholder">Нет постера</div>`
        }
        ${badgeHtml}
      </div>

      <div class="user-page-movie-card-body">
        <div class="user-page-movie-card-title">${escapeHtml(movie.title || movieTitle)}</div>
        ${originalTitle ? `<div class="user-page-movie-card-original">${escapeHtml(originalTitle)}</div>` : ''}
        ${year ? `<div class="user-page-movie-card-meta">${escapeHtml(year)}</div>` : ''}
      </div>
    </a>
  `;
}

function getUserPageRailScrollStep(rail) {
  return Math.max(rail.clientWidth * 0.82, 180);
}

function getUserPageRailState(rail) {
  const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  const scrollLeft = Math.max(0, rail.scrollLeft);
  const tolerance = 2;

  return {
    canScrollPrev: scrollLeft > tolerance,
    canScrollNext: scrollLeft < maxScrollLeft - tolerance
  };
}

function updateUserPageRailControls(shell) {
  const rail = shell?.querySelector('[data-user-page-rail="true"]');
  const prevButton = shell?.querySelector('[data-user-page-rail-prev="true"]');
  const nextButton = shell?.querySelector('[data-user-page-rail-next="true"]');

  if (!rail || !prevButton || !nextButton) {
    return;
  }

  const { canScrollPrev, canScrollNext } = getUserPageRailState(rail);

  prevButton.hidden = !canScrollPrev;
  nextButton.hidden = !canScrollNext;
}

function syncUserPageRailControls() {
  userPage
    ?.querySelectorAll('[data-user-page-rail-shell="true"]')
    .forEach(updateUserPageRailControls);
}

function bindUserPageRailControls() {
  userPage
    ?.querySelectorAll('[data-user-page-rail-shell="true"]')
    .forEach(shell => {
      const rail = shell.querySelector('[data-user-page-rail="true"]');

      if (!rail || rail.dataset.userPageRailBound === 'true') {
        return;
      }

      rail.dataset.userPageRailBound = 'true';
      rail.addEventListener('scroll', () => updateUserPageRailControls(shell), { passive: true });
    });

  requestAnimationFrame(syncUserPageRailControls);
}

function scrollUserPageRail(shell, direction) {
  const rail = shell?.querySelector('[data-user-page-rail="true"]');

  if (!rail) {
    return;
  }

  rail.scrollBy({
    left: getUserPageRailScrollStep(rail) * direction,
    behavior: 'smooth'
  });

  requestAnimationFrame(() => updateUserPageRailControls(shell));
}

function handleUserPageRailControlClick(event) {
  const button = event.target.closest('[data-user-page-rail-prev="true"], [data-user-page-rail-next="true"]');

  if (!button) {
    return;
  }

  const shell = button.closest('[data-user-page-rail-shell="true"]');
  const direction = button.matches('[data-user-page-rail-next="true"]') ? 1 : -1;

  scrollUserPageRail(shell, direction);
}

function getUserPageMovieRailHtml(items, emptyText, getBadgeHtml = null) {
  if (!items.length) {
    return `<div class="user-page-empty-state">${escapeHtml(emptyText)}</div>`;
  }

  const visibleItems = items.slice(0, USER_PAGE_PREVIEW_LIMIT);
  const hiddenCount = Math.max(0, items.length - visibleItems.length);
  const cardsHtml = visibleItems
    .map(item => getUserPageMovieCardHtml(item, getBadgeHtml))
    .join('');
  const moreHtml = hiddenCount > 0
    ? `
      <div class="user-page-more-card" aria-label="И ещё ${hiddenCount}">
        <strong>И ещё ${hiddenCount}</strong>
      </div>
    `
    : '';

  return `
    <div class="user-page-movie-rail-shell" data-user-page-rail-shell="true">
      <button
        class="user-page-rail-button user-page-rail-button-prev"
        type="button"
        data-user-page-rail-prev="true"
        aria-label="Прокрутить назад"
        hidden
      >
        &lsaquo;
      </button>
      <div class="user-page-movie-rail" data-user-page-rail="true" tabindex="0">
        ${cardsHtml}
        ${moreHtml}
      </div>
      <button
        class="user-page-rail-button user-page-rail-button-next"
        type="button"
        data-user-page-rail-next="true"
        aria-label="Прокрутить вперёд"
        hidden
      >
        &rsaquo;
      </button>
    </div>
  `;
}

function renderUserPageLoading() {
  if (!userPage) {
    return;
  }

  userPage.innerHTML = '<div class="user-page-loading-state">Загрузка профиля...</div>';
}

function renderUserPageNotFound() {
  if (!userPage) {
    return;
  }

  setUserPageDocumentMeta(null);
  userPage.innerHTML = `
    <div class="user-page-empty-state user-page-empty-state-large">
      Пользователь не найден.
    </div>
  `;
}

async function fetchPublicUserPageData(profile) {
  const userId = profile?.id;

  if (!userId) {
    return null;
  }

  const [
    ratingsResult,
    watchlistResult,
    reviewsResult
  ] = await Promise.all([
    supabaseClient
      .from('movie_ratings')
      .select('movie_id, rating')
      .eq('user_id', userId),
    supabaseClient
      .from('movie_watchlist')
      .select('movie_id')
      .eq('user_id', userId),
    supabaseClient
      .from('movie_reviews')
      .select('id, movie_id, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
  ]);

  throwIfSupabaseError(ratingsResult.error);
  throwIfSupabaseError(watchlistResult.error);
  throwIfSupabaseError(reviewsResult.error);

  const ratingRows = ratingsResult.data || [];
  const watchlistRows = watchlistResult.data || [];
  const reviewRows = reviewsResult.data || [];
  const ratedMovieIds = new Set(getUserPageMovieIds(ratingRows));
  const activeWatchlistRows = watchlistRows.filter(row => (
    row?.movie_id && !ratedMovieIds.has(String(row.movie_id))
  ));
  const relatedMovieIds = [...new Set([
    ...getUserPageMovieIds(ratingRows),
    ...getUserPageMovieIds(activeWatchlistRows),
    ...getUserPageMovieIds(reviewRows)
  ])];
  const movies = await fetchCatalogMoviesByIds(relatedMovieIds);
  const moviesById = new Map(movies.map(movie => [String(movie.id), movie]));
  const ratingItems = ratingRows
    .map(row => ({
      ...row,
      movie: moviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie)
    .sort((firstItem, secondItem) => (
      Number(secondItem.rating || 0) - Number(firstItem.rating || 0) ||
      sortUserPageMoviesByTitle(firstItem, secondItem)
    ));
  const watchlistItems = activeWatchlistRows
    .map(row => ({
      ...row,
      movie: moviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie)
    .sort(sortUserPageMoviesByTitle);
  const reviewItems = reviewRows
    .map(row => ({
      ...row,
      movie: moviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie)
    .sort((firstItem, secondItem) => (
      String(secondItem.updated_at || secondItem.created_at || '').localeCompare(
        String(firstItem.updated_at || firstItem.created_at || '')
      )
    ));

  return {
    profile,
    ratingItems,
    watchlistItems,
    reviewItems,
    averageRating: getUserPageAverageRating(ratingRows)
  };
}

function renderUserPage(data) {
  if (!userPage || !data?.profile) {
    return;
  }

  const displayName = getPublicProfileDisplayName(data.profile);
  const handle = getPublicProfileHandle(data.profile);
  const averageRating = data.averageRating === null ? '-' : data.averageRating.toFixed(1);
  const avatarLetter = displayName.slice(0, 1).toUpperCase() || 'H';

  setUserPageDocumentMeta(data.profile);

  userPage.innerHTML = `
    <section class="user-page-hero">
      <div class="user-page-avatar" aria-hidden="true">${escapeHtml(avatarLetter)}</div>
      <div class="user-page-identity">
        <h1>${escapeHtml(displayName)}</h1>
        <div class="user-page-handle">${escapeHtml(handle)}</div>
      </div>
    </section>

    <section class="user-page-stats" aria-label="Статистика пользователя">
      <div class="user-page-stat">
        <span class="user-page-stat-value">${data.ratingItems.length}</span>
        <span class="user-page-stat-label">Оценено</span>
      </div>
      <div class="user-page-stat">
        <span class="user-page-stat-value">${averageRating}</span>
        <span class="user-page-stat-label">Средняя оценка</span>
      </div>
      <div class="user-page-stat">
        <span class="user-page-stat-value">${data.watchlistItems.length}</span>
        <span class="user-page-stat-label">Смотреть позже</span>
      </div>
      <div class="user-page-stat">
        <span class="user-page-stat-value">${data.reviewItems.length}</span>
        <span class="user-page-stat-label">Рецензии</span>
      </div>
    </section>

    <section class="user-page-section">
      <div class="user-page-section-header">
        <h2>Оценки и просмотры</h2>
        <span aria-hidden="true">›</span>
      </div>
      ${getUserPageMovieRailHtml(
          data.ratingItems,
          'Пока нет оценённых фильмов.',
          item => `<span class="user-page-card-badge">★ ${Number(item.rating || 0)}</span>`
        )}
    </section>

    <section class="user-page-section">
      <div class="user-page-section-header">
        <h2>Смотреть позже</h2>
        <span aria-hidden="true">›</span>
      </div>
      ${getUserPageMovieRailHtml(data.watchlistItems, 'Список просмотра пуст.')}
    </section>

    <section class="user-page-section">
      <div class="user-page-section-header">
        <h2>Рецензии</h2>
        <span aria-hidden="true">›</span>
      </div>
      ${getUserPageMovieRailHtml(
          data.reviewItems,
          'Пока нет рецензий.',
          () => '<span class="user-page-card-badge user-page-card-badge-muted">Рецензия</span>'
        )}
    </section>
  `;

  bindUserPageRailControls();
}

async function initUserPage() {
  const handle = getUserPageRouteHandle();

  renderUserPageLoading();
  await restoreSession();
  trackEmailConfirmedLoginIfNeeded();

  try {
    const profile = await fetchPublicUserProfileByHandle(handle);

    if (!profile) {
      renderUserPageNotFound();
      return;
    }

    const data = await fetchPublicUserPageData(profile);
    renderUserPage(data);
  } catch (error) {
    console.error('Ошибка загрузки страницы пользователя:', error);
    renderUserPageNotFound();
  }

  bindSharedAuthStateListener();
}

function getMoviePageRouteParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const pathSlugMatch = window.location.pathname.match(/\/movie\/([^/]+)\/?$/);
  const pathMovieSlug = pathSlugMatch ? decodeURIComponent(pathSlugMatch[1] || '').trim() : '';
  const rawMovieSlug = searchParams.get('slug');
  const rawMovieId = searchParams.get('id');

  const movieSlug = String(rawMovieSlug || '').trim();
  const movieId = String(rawMovieId || '').trim();

  if (pathMovieSlug) {
    return { slug: pathMovieSlug, id: null };
  }

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

async function getMovieForAdminEdit(movieId, fallbackMovie = null) {
  const candidateMovie = fallbackMovie || getCatalogMovieById(movieId);

  if (hasMovieDetailPayload(candidateMovie)) {
    return candidateMovie;
  }

  return fetchMovieById(movieId);
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

function normalizeSeoText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function truncateSeoText(value, maxLength = 165) {
  const text = normalizeSeoText(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function getMovieSeoTitle(movie) {
  const yearSuffix = movie?.year ? ` (${movie.year})` : '';

  return `${movie?.title || 'Фильм ужасов'}${yearSuffix} — Хоррорейро`;
}

function getMovieSeoDescription(movie) {
  const meta = getCatalogMovieMeta(movie);
  const genresText = meta?.genresText ? `жанры: ${meta.genresText}` : '';
  const details = [
    movie?.year ? `${movie.year}` : '',
    movie?.director ? `режиссёр: ${movie.director}` : '',
    genresText
  ].filter(Boolean).join(' · ');
  const text = [
    `${movie?.title || 'Фильм ужасов'} в каталоге Хоррорейро.`,
    details,
    movie?.synopsis
  ].filter(Boolean).join(' ');

  return truncateSeoText(text);
}

function getMovieSocialImage(movie) {
  return movie?.poster_url || DEFAULT_SOCIAL_IMAGE_URL;
}

function getMovieSameAsLinks(movie) {
  return [
    movie?.kinopoisk_url,
    movie?.imdb_url,
    movie?.letterboxd_url,
    movie?.rottentomatoes_url
  ].filter(Boolean);
}

function getMovieDatePublished(movie) {
  const releaseYear = movie?.release_year || movie?.year;
  const releaseMonth = movie?.release_month;

  if (!releaseYear) {
    return null;
  }

  if (releaseMonth) {
    return `${releaseYear}-${String(releaseMonth).padStart(2, '0')}-01`;
  }

  return String(releaseYear);
}

function upsertDocumentMeta({ name = '', property = '', content = '' }) {
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`;
  let metaElement = document.head.querySelector(selector);

  if (!metaElement) {
    metaElement = document.createElement('meta');

    if (name) {
      metaElement.setAttribute('name', name);
    } else {
      metaElement.setAttribute('property', property);
    }

    document.head.appendChild(metaElement);
  }

  metaElement.setAttribute('content', content);
}

function upsertDocumentCanonical(canonicalUrl) {
  let canonicalLink = document.head.querySelector('link[rel="canonical"]');

  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }

  canonicalLink.setAttribute('href', canonicalUrl);
}

function upsertStructuredDataScript(scriptId, data) {
  let scriptElement = document.getElementById(scriptId);

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = JSON.stringify(data);
}

function removeStructuredDataScript(scriptId) {
  document.getElementById(scriptId)?.remove();
}

function buildMovieStructuredData(movie) {
  const meta = getCatalogMovieMeta(movie);
  const canonicalUrl = buildMovieCanonicalUrl(movie);
  const votesCount = getMovieVotesCount(movie.id);
  const averageRating = getMovieAverageRating(movie.id);
  const genreNames = meta ? Array.from(meta.genreNames) : [];
  const countryNames = meta ? Array.from(meta.countryNames) : [];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    url: canonicalUrl,
    image: getMovieSocialImage(movie),
    description: getMovieSeoDescription(movie),
    inLanguage: 'ru-RU'
  };

  if (movie.original_title) {
    structuredData.alternateName = movie.original_title;
  }

  if (movie.director) {
    structuredData.director = String(movie.director)
      .split(',')
      .map(name => normalizeSeoText(name))
      .filter(Boolean)
      .map(name => ({
        '@type': 'Person',
        name
      }));
  }

  if (genreNames.length > 0) {
    structuredData.genre = genreNames;
  }

  if (countryNames.length > 0) {
    structuredData.countryOfOrigin = countryNames.map(name => ({
      '@type': 'Country',
      name
    }));
  }

  const datePublished = getMovieDatePublished(movie);

  if (datePublished) {
    structuredData.datePublished = datePublished;
  }

  const sameAs = getMovieSameAsLinks(movie);

  if (sameAs.length > 0) {
    structuredData.sameAs = sameAs;
  }

  if (votesCount > 0 && averageRating > 0) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(averageRating.toFixed(1)),
      bestRating: 10,
      worstRating: 1,
      ratingCount: votesCount
    };
  }

  return structuredData;
}

function buildCatalogItemListStructuredData(pageMovies, paginationState) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Фильмы ужасов — Хоррорейро',
    url: `${SITE_ORIGIN}/`,
    numberOfItems: paginationState?.totalItems || pageMovies.length,
    itemListElement: pageMovies.map((movie, index) => {
      const meta = getCatalogMovieMeta(movie);
      const movieData = {
        '@type': 'Movie',
        name: movie.title,
        url: buildMovieCanonicalUrl(movie),
        image: getMovieSocialImage(movie)
      };
      const datePublished = getMovieDatePublished(movie);

      if (movie.original_title) {
        movieData.alternateName = movie.original_title;
      }

      if (datePublished) {
        movieData.datePublished = datePublished;
      }

      if (meta?.genresText) {
        movieData.genre = Array.from(meta.genreNames);
      }

      return {
        '@type': 'ListItem',
        position: (paginationState?.startIndex || 0) + index + 1,
        url: buildMovieCanonicalUrl(movie),
        item: movieData
      };
    })
  };
}

function updateCatalogStructuredData(pageMovies, paginationState) {
  if (!Array.isArray(pageMovies) || pageMovies.length === 0) {
    removeStructuredDataScript(CATALOG_STRUCTURED_DATA_SCRIPT_ID);
    return;
  }

  upsertStructuredDataScript(
    CATALOG_STRUCTURED_DATA_SCRIPT_ID,
    buildCatalogItemListStructuredData(pageMovies, paginationState)
  );
}

function setMoviePageDocumentMeta(movie) {
  if (!movie) {
    document.title = 'Фильм не найден — Хоррорейро';
    upsertDocumentCanonical(window.location.href);
    upsertDocumentMeta({ name: 'robots', content: 'noindex, follow' });
    removeStructuredDataScript(MOVIE_STRUCTURED_DATA_SCRIPT_ID);
    return;
  }

  const title = getMovieSeoTitle(movie);
  const description = getMovieSeoDescription(movie);
  const canonicalUrl = buildMovieCanonicalUrl(movie);
  const imageUrl = getMovieSocialImage(movie);

  document.title = title;
  upsertDocumentMeta({ name: 'description', content: description });
  upsertDocumentMeta({ name: 'robots', content: 'index, follow' });
  upsertDocumentCanonical(canonicalUrl);
  upsertDocumentMeta({ property: 'og:type', content: 'video.movie' });
  upsertDocumentMeta({ property: 'og:title', content: title });
  upsertDocumentMeta({ property: 'og:description', content: description });
  upsertDocumentMeta({ property: 'og:url', content: canonicalUrl });
  upsertDocumentMeta({ property: 'og:image', content: imageUrl });
  upsertDocumentMeta({ name: 'twitter:title', content: title });
  upsertDocumentMeta({ name: 'twitter:description', content: description });
  upsertDocumentMeta({ name: 'twitter:image', content: imageUrl });
  upsertDocumentMeta({ name: 'twitter:url', content: canonicalUrl });
  upsertStructuredDataScript(MOVIE_STRUCTURED_DATA_SCRIPT_ID, buildMovieStructuredData(movie));
}

function renderMoviePageNotFound() {
  if (!moviePage) {
    return;
  }

  currentMoviePageMovieId = null;
  currentMoviePageMovieData = null;
  resetMoviePageSimilarState();

  setMoviePageDocumentMeta(null);

  moviePage.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon" aria-hidden="true">◌</div>
      <div class="empty-state-title">Фильм не найден</div>
      <div class="empty-state-text">
        Возможно, ссылка устарела или фильм был удалён из каталога.
      </div>
      <div class="empty-state-actions">
        <a href="${buildCatalogPageUrl()}" class="secondary-button secondary-button-compact empty-state-reset-btn">
          Вернуться в каталог
        </a>
      </div>
    </div>
  `;
}

function resetMoviePageSimilarState() {
  currentMoviePageSimilarMovieId = null;
  currentMoviePageSimilarMovies = [];
  moviePageSimilarRequestId += 1;
}

function renderMoviePageSimilarSection(movieId) {
  const mount = moviePage?.querySelector('[data-movie-page-similar-mount="true"]');

  if (!mount) {
    return;
  }

  const similarMovies = String(currentMoviePageSimilarMovieId) === String(movieId)
    ? currentMoviePageSimilarMovies
    : [];

  mount.innerHTML = getMoviePageSimilarSectionHtml(similarMovies);
  bindPosterFallbackImages(mount);
}

async function loadMoviePageSimilarMovies(movie, limit = 4) {
  if (!movie || !moviePage) {
    return;
  }

  const requestId = ++moviePageSimilarRequestId;
  const movieId = String(movie.id);

  currentMoviePageSimilarMovieId = movieId;
  currentMoviePageSimilarMovies = [];
  renderMoviePageSimilarSection(movieId);

  try {
    const similarMovies = await fetchManualSimilarMoviesForMovie(movieId, limit);

    if (
      requestId !== moviePageSimilarRequestId ||
      String(currentMoviePageMovieId) !== movieId
    ) {
      return;
    }

    if (!moviePage.querySelector('[data-movie-page-similar-mount="true"]')) {
      renderMoviePage(movie);
    }

    currentMoviePageSimilarMovies = similarMovies;
    renderMoviePageSimilarSection(movieId);
  } catch (error) {
    console.error('Ошибка загрузки похожих фильмов:', error);
  }
}

function getMoviePageSimilarCardHtml(movie) {
  const meta = getCatalogMovieMeta(movie);
  const genres = meta.genresText;
  const countries = meta.countriesText;
  const averageRating = getMovieAverageRating(movie.id);
  const votesCount = getMovieVotesCount(movie.id);

  return `
    <article class="movie-page-similar-card" data-movie-id="${movie.id}">
      <a href="${buildMoviePageUrl(movie)}" class="movie-page-similar-poster-link" aria-label="Перейти к фильму ${escapeHtml(movie.title)}">
        <div class="movie-page-similar-poster-wrapper">
          ${
            movie.poster_url
              ? `
                <img
                  class="movie-page-similar-poster"
                  ${getPosterImageAttributeHtml(movie.poster_url, 'similar')}
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

function getMoviePageReviewsSectionHtml(movie, { isLoading = false } = {}) {
  const reviews = sortMovieReviewsForDisplay(getMovieReviews(movie.id));

  return `
  <section class="movie-page-reviews-block" aria-labelledby="moviePageReviewsTitle" data-movie-page-reviews-section="true">
  <h2 id="moviePageReviewsTitle" class="movie-page-subtitle">Рецензии</h2>

  ${isLoading ? '' : getMoviePageReviewFormHtml(movie)}

      ${
        isLoading
          ? `
            <div class="movie-page-review-empty-state">
              Загружаю рецензии...
            </div>
          `
          : reviews.length > 0
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

function getMoviePageSubgenreLabel(movie) {
  if (!Array.isArray(movie?.tags_perceived) || movie.tags_perceived.length === 0) {
    return '';
  }

  return movie.tags_perceived
    .slice(0, 2)
    .map(tag => String(tag || '').trim())
    .filter(Boolean)
    .join(', ');
}

function getMoviePageFormatsLabel(movie) {
  if (!Array.isArray(movie?.formats) || movie.formats.length === 0) {
    return '';
  }

  return movie.formats
    .map(format => String(format || '').trim())
    .filter(Boolean)
    .join(', ');
}

function buildMoviePageViewModel(movie, { reviewsLoading = false } = {}) {
  return {
    genres: movie.movie_genres.map(item => item.genres.name).join(', '),
    countries: movie.movie_countries.map(item => item.countries.name).join(', '),
    averageRating: getMovieAverageRating(movie.id),
    votesCount: getMovieVotesCount(movie.id),
    currentUserRating: getCurrentUserRating(movie.id),
    userMovieState: getCurrentUserMovieState(movie.id),
    primaryPerceivedTagLabel: getMoviePageSubgenreLabel(movie),
    formatsLabel: getMoviePageFormatsLabel(movie),
    externalLinksHtml: getMoviePageExternalLinksHtml(movie),
    synopsis: String(movie.synopsis || '').trim(),
    isRatingBusy: ratingRequestInFlight.has(String(movie.id)),
    isWatchlistBusy: watchlistRequestInFlight.has(String(movie.id)),
    reviewsSectionHtml: getMoviePageReviewsSectionHtml(movie, { isLoading: reviewsLoading })
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
                ${getPosterImageAttributeHtml(movie.poster_url, 'detail')}
                alt="Постер фильма ${escapeHtml(movie.title)}"
                loading="eager"
                decoding="async"
                fetchpriority="high"
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
    formatsLabel,
    externalLinksHtml,
    synopsis,
    isRatingBusy
  } = viewModel;

  return `
    <div class="movie-page-main-column">
      <div class="movie-page-title-block">
      <div class="movie-page-title-row">
      <div class="movie-page-title-main">
        <h1 class="movie-page-title">${escapeHtml(movie.title)}</h1>

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
          ${
            formatsLabel
              ? `<div class="movie-page-meta-item"><span>Формат:</span> ${escapeHtml(formatsLabel)}</div>`
              : ''
          }
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

function renderMoviePage(movie, options = {}) {
  if (!moviePage || !movie) {
    return;
  }

  currentMoviePageMovieId = movie.id;
  currentMoviePageMovieData = movie;

  const viewModel = buildMoviePageViewModel(movie, options);
  const { reviewsSectionHtml } = viewModel;

  setMoviePageDocumentMeta(movie);

  moviePage.innerHTML = `
    <div class="movie-page-stack">
      ${getMoviePageHeaderHtml(movie, viewModel)}

      ${reviewsSectionHtml}
      <div data-movie-page-similar-mount="true">
        ${
          String(currentMoviePageSimilarMovieId) === String(movie.id)
            ? getMoviePageSimilarSectionHtml(currentMoviePageSimilarMovies)
            : ''
        }
      </div>
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

  bindPosterFallbackImages(moviePage);
  bindMoviePageReviewEvents(movie);
}

function renderMoviePageReviewsSection(movie) {
  if (!moviePage || !movie) {
    return;
  }

  const reviewsSection = moviePage.querySelector('[data-movie-page-reviews-section="true"]');

  if (!reviewsSection) {
    renderMoviePage(movie);
    return;
  }

  reviewsSection.outerHTML = getMoviePageReviewsSectionHtml(movie);
  bindMoviePageReviewEvents(movie);
}

function renderMoviePageReviewsStatus(message) {
  const reviewsSection = moviePage?.querySelector('[data-movie-page-reviews-section="true"]');

  if (!reviewsSection) {
    return;
  }

  reviewsSection.innerHTML = `
    <h2 id="moviePageReviewsTitle" class="movie-page-subtitle">Рецензии</h2>
    <div class="movie-page-review-empty-state">
      ${escapeHtml(message)}
    </div>
  `;
}

async function deleteMovieFromMoviePage(movieId, movieTitle) {
  try {
    await runConfirmedAction(`Удалить фильм "${movieTitle}"?`, async () => {
      await deleteMovieRecord(movieId);
      removeMovieFromCatalogSessionSnapshot(movieId);
      window.location.href = buildCatalogPageUrl();
    });
  } catch (error) {
    console.error('Ошибка при удалении фильма со страницы detail-page:', error);
  }
}

async function loadMoviePageByRouteParams(routeParams, {
  warmMovie = null,
  warmTopSignature = '',
  skipUserStateFetch = false
} = {}) {
  const loadingTasks = [fetchMovieByRouteParams(routeParams)];

  if (!skipUserStateFetch) {
    loadingTasks.push(fetchMovieRatings(), fetchMovieWatchlist());
  }

  const [movie] = await Promise.all(loadingTasks);

  if (!movie) {
    if (warmMovie) {
      removeMovieFromCatalogSessionSnapshot(warmMovie.id);
    }

    renderMoviePageNotFound();
    return null;
  }

  await fetchMovieReviews(movie.id);
  syncCatalogSessionSnapshotMovieState(movie.id, {
    syncReviews: true,
    syncMovie: movie
  });

  const nextTopSignature = getMoviePageTopRenderSignature(movie);
  const canReuseWarmTop = (
    warmMovie &&
    String(warmMovie.id) === String(movie.id) &&
    warmTopSignature &&
    warmTopSignature === nextTopSignature &&
    String(currentMoviePageMovieId) === String(movie.id)
  );

  if (canReuseWarmTop) {
    currentMoviePageMovieData = movie;
    setMoviePageDocumentMeta(movie);
    renderMoviePageReviewsSection(movie);
  } else {
    renderMoviePage(movie);
  }

  loadMoviePageSimilarMovies(movie);

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
  const warmMovie = hydrateMoviePageFromCatalogSnapshot(routeParams);
  const warmTopSignature = warmMovie
    ? getMoviePageTopRenderSignature(warmMovie)
    : '';

  if (warmMovie) {
    renderMoviePage(warmMovie, { reviewsLoading: true });
  }

  try {
    await loadMoviePageByRouteParams(routeParams, {
      warmMovie,
      warmTopSignature
    });
  } catch (error) {
    console.error('Ошибка загрузки страницы фильма:', error);

    if (!warmMovie) {
      renderMoviePageNotFound();
    } else {
      renderMoviePageReviewsStatus('Не удалось обновить рецензии. Попробуй обновить страницу.');
    }
  }

  bindSharedAuthStateListener({
    onAfterAuthSync: async () => {
      try {
        await loadMoviePageByRouteParams(routeParams, {
          skipUserStateFetch: true
        });
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
  bindSharedUiEvents();
  handlePasswordRecoveryEntry(hasPasswordRecoveryRedirect);

  if (isCatalogPage()) {
    bindCatalogPageEvents();
    await initCatalogPage();
    return;
  }

  if (isUserPage()) {
    await initUserPage();
    return;
  }

  if (isMoviePage()) {
    bindMoviePageEvents();
    await initMoviePage();
  }
}

/* =========================================================
JS-БЛОК 24. ЗАПУСК ПРИЛОЖЕНИЯ
Точка входа.
========================================================== */
init();
