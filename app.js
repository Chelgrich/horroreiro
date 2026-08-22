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
const profilePasswordForm = document.getElementById('profilePasswordForm');
const profilePasswordCurrentInput = document.getElementById('profilePasswordCurrent');
const profilePasswordNewInput = document.getElementById('profilePasswordNew');
const profilePasswordConfirmInput = document.getElementById('profilePasswordConfirm');
const saveProfilePasswordButton = document.getElementById('saveProfilePasswordButton');
const profilePasswordMessage = document.getElementById('profilePasswordMessage');
const profilePosterPreferenceForm = document.getElementById('profilePosterPreferenceForm');
const profileRussianPostersInput = document.getElementById('profileRussianPostersInput');
const saveProfilePosterPreferenceButton = document.getElementById('saveProfilePosterPreferenceButton');
const profilePosterPreferenceMessage = document.getElementById('profilePosterPreferenceMessage');
const profileSummaryButton = document.getElementById('profileSummaryButton');
const notificationsSummaryButton = document.getElementById('notificationsSummaryButton');
const notificationsMenuBadge = document.getElementById('notificationsMenuBadge');
const followingSummaryButton = document.getElementById('followingSummaryButton');
const editorCenterSummaryButton = document.getElementById('editorCenterSummaryButton');
const directorsAdminSummaryButton = document.getElementById('directorsAdminSummaryButton');

const openAuthModalButton = document.getElementById('openAuthModalButton');
const authIconButtonDefaultHtml = openAuthModalButton?.innerHTML || '';
const authPopoverMenu = document.getElementById('authPopoverMenu');
const importLetterboxdRatingsButton = document.getElementById('importLetterboxdRatingsButton');
const manualSimilarAuditButton = document.getElementById('manualSimilarAuditButton');
const completenessAuditButton = document.getElementById('completenessAuditButton');
const databaseExportButton = document.getElementById('databaseExportButton');
const notificationTestButton = document.getElementById('notificationTestButton');
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
const userPageMainTitle = document.querySelector('.user-page-main-title');
const userPage = document.getElementById('userPage');
const notificationsPage = document.getElementById('notificationsPage');
const followingPage = document.getElementById('followingPage');
const editorPage = document.getElementById('editorPage');
const directorPage = document.getElementById('directorPage');
const directorsAdminPage = document.getElementById('directorsAdminPage');

const adminPanel = document.getElementById('adminPanel');
const openAddMovieButton = document.getElementById('openAddMovieButton');

const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const genreFilter = document.getElementById('genreFilter');
const subgenreFilter = document.getElementById('subgenreFilter');
const formatFilter = document.getElementById('formatFilter');
const countryFilter = document.getElementById('countryFilter');
const runtimeFromFilter = document.getElementById('runtimeFromFilter');
const runtimeToFilter = document.getElementById('runtimeToFilter');
const runtimeFromSlider = document.getElementById('runtimeFromSlider');
const runtimeToSlider = document.getElementById('runtimeToSlider');
const runtimeRangeFill = document.getElementById('runtimeRangeFill');
const yearFromFilter = document.getElementById('yearFromFilter');
const yearToFilter = document.getElementById('yearToFilter');
const yearFromSlider = document.getElementById('yearFromSlider');
const yearToSlider = document.getElementById('yearToSlider');
const yearRangeFill = document.getElementById('yearRangeFill');
const ratingFromFilter = document.getElementById('ratingFromFilter');
const ratingToFilter = document.getElementById('ratingToFilter');
const ratingFromSlider = document.getElementById('ratingFromSlider');
const ratingToSlider = document.getElementById('ratingToSlider');
const ratingRangeFill = document.getElementById('ratingRangeFill');
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
const CATALOG_RANGE_FILTER_KEYS = ['runtime', 'year', 'rating'];
const CATALOG_RANGE_FILTER_CONFIGS = {
  runtime: {
    key: 'runtime',
    fromInput: runtimeFromFilter,
    toInput: runtimeToFilter,
    fromSlider: runtimeFromSlider,
    toSlider: runtimeToSlider,
    fillElement: runtimeRangeFill,
    defaultMin: 1,
    defaultMax: 999,
    step: 1,
    allowDecimal: false,
    getMovieValue: movie => normalizeRuntimeMinutesValue(movie?.runtime_minutes)
  },
  year: {
    key: 'year',
    fromInput: yearFromFilter,
    toInput: yearToFilter,
    fromSlider: yearFromSlider,
    toSlider: yearToSlider,
    fillElement: yearRangeFill,
    defaultMin: 1900,
    defaultMax: 2100,
    step: 1,
    allowDecimal: false,
    getMovieValue: getCatalogMovieYearFilterValue
  },
  rating: {
    key: 'rating',
    fromInput: ratingFromFilter,
    toInput: ratingToFilter,
    fromSlider: ratingFromSlider,
    toSlider: ratingToSlider,
    fillElement: ratingRangeFill,
    defaultMin: 0,
    defaultMax: 10,
    step: 0.1,
    allowDecimal: true,
    useFixedBounds: true,
    getMovieValue: movie => {
      const averageRating = getMovieAverageRating(movie?.id);

      return Number.isFinite(averageRating) ? averageRating : 0;
    }
  }
};

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
const QUICK_PRESETS_SCROLL_HINT_MEDIA_QUERY = '(max-width: 680px)';
const QUICK_PRESETS_SCROLL_HINT_DELAY_MS = 650;
const QUICK_PRESETS_SCROLL_HINT_DISTANCE = 72;
const QUICK_PRESETS_SCROLL_HINT_DURATION_MS = 420;
const NOTIFICATIONS_UNREAD_REFRESH_INTERVAL_MS = 60000;
const NOTIFICATIONS_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
let didPlayQuickPresetsScrollHint = false;
let quickPresetsScrollHintTimerId = null;
let quickPresetsScrollHintFrameId = null;
let didConsumeEmailConfirmationRedirect = false;

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
let runtimeMinutesInput = document.getElementById('runtimeMinutes');
let directorInput = document.getElementById('director');
let posterFileInput = document.getElementById('posterFile');
let posterFileName = document.getElementById('posterFileName');
let moviePosterImagesList = document.getElementById('moviePosterImagesList');
let kinopoiskUrlInput = document.getElementById('kinopoiskUrl');
let imdbUrlInput = document.getElementById('imdbUrl');
let letterboxdUrlInput = document.getElementById('letterboxdUrl');
let letterboxdShortUrlInput = document.getElementById('letterboxdShortUrl');
let rottentomatoesUrlInput = document.getElementById('rottentomatoesUrl');
let tmdbUrlInput = document.getElementById('tmdbUrl');
let trailerUrlInput = document.getElementById('trailerUrl');
let genresInput = document.getElementById('genresInput');
let countriesInput = document.getElementById('countriesInput');
let productionInput = document.getElementById('productionInput');
let distributionInput = document.getElementById('distributionInput');
let russianDistributionInput = document.getElementById('russianDistributionInput');
let searchAliasesInput = document.getElementById('searchAliases');
let synopsisInput = document.getElementById('synopsis');
let movieFormatsInput = document.getElementById('movieFormats');
let tagsPerceivedInput = document.getElementById('tagsPerceived');
let manualSimilarMovieSelect = document.getElementById('manualSimilarMovieSelect');
let addManualSimilarMovieButton = document.getElementById('addManualSimilarMovieButton');
let manualSimilarMoviesList = document.getElementById('manualSimilarMoviesList');

const SUPABASE_URL = window.__ENV__?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY;
const APP_BUILD_VERSION = window.__ENV__?.APP_BUILD_VERSION || 'dev';
const SUPABASE_PROJECT_REF = (() => {
  try {
    return new URL(SUPABASE_URL).hostname.split('.')[0] || '';
  } catch (error) {
    return '';
  }
})();
const SUPABASE_AUTH_STORAGE_KEY = SUPABASE_PROJECT_REF
  ? `sb-${SUPABASE_PROJECT_REF}-auth-token`
  : '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Не заданы переменные окружения SUPABASE_URL и SUPABASE_ANON_KEY');
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
const CATALOG_STATE_STORAGE_KEY = 'horroreiro_catalog_state';
const EMAIL_CONFIRMATION_PENDING_KEY = 'horroreiro_email_confirmation_pending';
const EMAIL_CONFIRMATION_TRACKED_KEY = 'horroreiro_email_confirmation_tracked';
const PASSWORD_RECOVERY_PENDING_KEY = 'horroreiro_password_recovery_pending';
const CATALOG_SCROLL_POSITION_KEY = 'horroreiro_catalog_scroll_position';
const CATALOG_ANCHOR_MOVIE_ID_KEY = 'horroreiro_catalog_anchor_movie_id';
const CATALOG_FAST_RETURN_PENDING_KEY = 'horroreiro_catalog_fast_return_pending';
const CATALOG_SESSION_SNAPSHOT_KEY = 'horroreiro_catalog_session_snapshot';
const CATALOG_DOM_SNAPSHOT_KEY = 'horroreiro_catalog_dom_snapshot';
const MOVIE_PAGE_SESSION_CACHE_KEY = 'horroreiro_movie_page_session_cache';
const USER_PAGE_ACTIVITY_AGGREGATE_CACHE_KEY = 'horroreiro_user_page_activity_aggregate_cache';
const DATA_MUTATION_STAMP_KEY = 'horroreiro_data_mutation_stamp';
const CATALOG_SESSION_SNAPSHOT_VERSION = 8;
const CATALOG_SESSION_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
const CATALOG_DOM_SNAPSHOT_IDLE_TIMEOUT_MS = 1200;
const MOVIE_PAGE_SESSION_CACHE_VERSION = 1;
const MOVIE_PAGE_SESSION_CACHE_MAX_AGE_MS = 30 * 60 * 1000;
const MOVIE_PAGE_SESSION_CACHE_MAX_ENTRIES = 6;
const CATALOG_PAGE_SIZE = 40;
const CATALOG_PAGINATION_PAGE_SLOTS = 6;
const CATALOG_PAGINATION_COMPACT_PAGE_SLOTS = 4;
const CATALOG_PRIORITY_POSTER_COUNT = 8;
const INTENTIONAL_EMPTY_FIELD_MARKER = 'Не применимо';
const INTENTIONAL_EMPTY_FIELD_MARKERS = new Set([
  'не применимо'
]);
const CATALOG_PRESET_QUERY_PARAM = 'preset';
const CATALOG_PROFILE_QUERY_PARAM = 'profile';
const CATALOG_PROFILE_ACTIVITY_QUERY_PARAM = 'activity';
const CATALOG_PROFILE_ACTIVITY_KEYS = new Set(['ratings', 'watchlist', 'reviews']);
const CATALOG_PROFILE_ACTIVITY_LABELS = {
  ratings: 'Оценки и просмотры',
  watchlist: 'Смотреть позже',
  reviews: 'Рецензии'
};
const POSTER_STORAGE_PUBLIC_PATH = '/storage/v1/object/public/posters/';
const POSTER_STORAGE_RENDER_PATH = '/storage/v1/render/image/public/posters/';
const POSTER_IMAGE_MIN_QUALITY = 90;
const DIRECTOR_STORAGE_BUCKET = 'people';
const DIRECTOR_STORAGE_PUBLIC_PATH = `/storage/v1/object/public/${DIRECTOR_STORAGE_BUCKET}/`;
const DIRECTOR_STORAGE_RENDER_PATH = `/storage/v1/render/image/public/${DIRECTOR_STORAGE_BUCKET}/`;
const AVATAR_STORAGE_BUCKET = 'avatars';
const AVATAR_STORAGE_PUBLIC_PATH = `/storage/v1/object/public/${AVATAR_STORAGE_BUCKET}/`;
const AVATAR_ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const AVATAR_ACCEPTED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const AVATAR_SOURCE_MAX_SIZE_BYTES = 10 * 1024 * 1024;
const AVATAR_OUTPUT_SIZE = 256;
const AVATAR_OUTPUT_TYPE = 'image/jpeg';
const AVATAR_OUTPUT_QUALITY = 0.9;
const AVATAR_MIN_SOURCE_SIDE = 256;
const POSTER_IMAGE_PRESETS = {
  catalog: {
    widths: [240, 360, 480, 640],
    quality: POSTER_IMAGE_MIN_QUALITY,
    sizes: '(max-width: 360px) calc(100vw - 72px), (max-width: 680px) calc((100vw - 92px) / 2), (max-width: 1024px) calc((100vw - 88px) / 2), (max-width: 1200px) calc((100vw - 112px) / 3), 320px'
  },
  similar: {
    widths: [180, 240, 320, 480],
    quality: POSTER_IMAGE_MIN_QUALITY,
    sizes: '(max-width: 360px) calc(100vw - 72px), (max-width: 680px) calc((100vw - 92px) / 2), 220px'
  },
  detail: {
    widths: [320, 480, 640, 800],
    quality: POSTER_IMAGE_MIN_QUALITY,
    sizes: '(max-width: 680px) calc(100vw - 64px), (max-width: 900px) 232px, 320px'
  }
};
const POSTER_IMAGE_CACHE_MAX_ENTRIES = 1500;
const posterTransformUrlCache = new Map();
const posterImageDataCache = new Map();
const posterImageAttributeHtmlCache = new Map();
const DIRECTOR_IMAGE_PRESET = {
  widths: [320, 480, 640],
  quality: POSTER_IMAGE_MIN_QUALITY,
  heightRatio: 1.5,
  sizes: '(max-width: 480px) calc(100vw - 48px), (max-width: 900px) 320px, 320px'
};
const BASE_HORROR_GENRE_NORMALIZED = '\u0443\u0436\u0430\u0441\u044b';
const MANUAL_SIMILAR_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_REVIEW_LIKES_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_POSTER_IMAGES_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const DIRECTORS_UNAVAILABLE_CODES = new Set(['42P01', '42703', 'PGRST204', 'PGRST205']);
const MOVIE_COMMENTS_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_COMMENT_LIKES_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const SITE_ORIGIN = 'https://horroreiro.ru';
const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/og-preview.jpg`;
const MOVIE_STRUCTURED_DATA_SCRIPT_ID = 'movieStructuredData';
const CATALOG_STRUCTURED_DATA_SCRIPT_ID = 'catalogItemListStructuredData';
const AUTH_REQUEST_TIMEOUT_MS = 20000;
const AUTH_PROFILE_REQUEST_TIMEOUT_MS = 15000;
const USER_PAGE_PREVIEW_LIMIT = 10;
const CATALOG_ROUTE_PRESET_KEYS = new Set([
  'top-rated',
  'low-rated',
  'unrated',
  'short-runtime',
  'with-reviews',
  'astrals',
  'watchlist',
  'watched',
  'unwatched'
]);
const AUTH_REQUIRED_CATALOG_PRESET_KEYS = new Set(['watchlist', 'watched', 'unwatched']);
const CATALOG_URL_STATE_PARAMS = new Set([
  CATALOG_PRESET_QUERY_PARAM,
  'q',
  'search',
  'genre',
  'subgenre',
  'format',
  'country',
  'year',
  'year_from',
  'year_to',
  'rating',
  'rating_from',
  'rating_to',
  'runtime_from',
  'runtime_to',
  'reviews',
  'watchlist',
  'watched',
  'sort',
  'view',
  'page',
  CATALOG_PROFILE_QUERY_PARAM,
  CATALOG_PROFILE_ACTIVITY_QUERY_PARAM
]);
const CATALOG_URL_TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
const CATALOG_URL_VALUE_ALIASES = {
  genre: {
    'Боевик': 'action',
    'Вестерн': 'western',
    'Военный': 'war',
    'Детектив': 'mystery',
    'Документальный': 'documentary',
    'Драма': 'drama',
    'История': 'history',
    'Комедия': 'comedy',
    'Криминал': 'crime',
    'Мелодрама': 'romance',
    'Музыка': 'music',
    'Мультфильм': 'animation',
    'Мюзикл': 'musical',
    'Приключения': 'adventure',
    'Семейный': 'family',
    'Спорт': 'sport',
    'Телевизионный фильм': 'tv-movie',
    'Триллер': 'thriller',
    'Фантастика': 'sci-fi',
    'Фэнтези': 'fantasy'
  },
  subgenre: {
    'Сверхъестественный хоррор': 'supernatural-horror',
    'Дом с привидениями': 'haunted-house',
    'Мистери-хоррор': 'mystery-horror',
    'Конспирологический хоррор': 'conspiracy-horror',
    'Монстр-муви': 'monster-movie',
    'Одержимость': 'possession',
    'Хоррор-выживание': 'survival-horror',
    'Религиозный хоррор': 'religious-horror',
    'Фолк-хоррор': 'folk-horror',
    'Психологический хоррор': 'psychological-horror',
    'Слэшер': 'slasher',
    'Нападение животных': 'animal-attack',
    'Инфекционный хоррор': 'infection-horror',
    'Боди-хоррор': 'body-horror',
    'Каннибальский хоррор': 'cannibal-horror',
    'Зомби-хоррор': 'zombie-horror',
    'Вампирский хоррор': 'vampire-horror',
    'Хоррор-катастрофа': 'disaster-horror'
  },
  format: {
    'Найденная плёнка': 'found-footage',
    'Псевдодокументальный': 'mockumentary',
    'Гибридное повествование': 'hybrid-narrative',
    'Антология': 'anthology',
    'Немой фильм': 'silent-film'
  },
  country: {
    'Австралия': 'australia',
    'Австрия': 'austria',
    'Албания': 'albania',
    'Аргентина': 'argentina',
    'Бельгия': 'belgium',
    'Бразилия': 'brazil',
    'Великобритания': 'united-kingdom',
    'Венгрия': 'hungary',
    'Германия': 'germany',
    'Гонконг': 'hong-kong',
    'Гренландия': 'greenland',
    'Греция': 'greece',
    'Дания': 'denmark',
    'Индия': 'india',
    'Индонезия': 'indonesia',
    'Ирландия': 'ireland',
    'Исландия': 'iceland',
    'Испания': 'spain',
    'Италия': 'italy',
    'Казахстан': 'kazakhstan',
    'Камбоджа': 'cambodia',
    'Канада': 'canada',
    'Кипр': 'cyprus',
    'Китай': 'china',
    'Колумбия': 'colombia',
    'Кыргызстан': 'kyrgyzstan',
    'Латвия': 'latvia',
    'Люксембург': 'luxembourg',
    'Малайзия': 'malaysia',
    'Мексика': 'mexico',
    'Нидерланды': 'netherlands',
    'Новая Зеландия': 'new-zealand',
    'Норвегия': 'norway',
    'ОАЭ': 'united-arab-emirates',
    'Польша': 'poland',
    'Россия': 'russia',
    'Румыния': 'romania',
    'Саудовская Аравия': 'saudi-arabia',
    'Сербия': 'serbia',
    'Сингапур': 'singapore',
    'Словения': 'slovenia',
    'США': 'usa',
    'Таиланд': 'thailand',
    'Тайвань': 'taiwan',
    'Турция': 'turkey',
    'Уругвай': 'uruguay',
    'Филиппины': 'philippines',
    'Финляндия': 'finland',
    'Франция': 'france',
    'Чехия': 'czech-republic',
    'Швейцария': 'switzerland',
    'Швеция': 'sweden',
    'Эквадор': 'ecuador',
    'Эстония': 'estonia',
    'ЮАР': 'south-africa',
    'Южная Корея': 'south-korea',
    'Япония': 'japan'
  }
};
const CATALOG_URL_VALUE_ALIAS_LOOKUPS = Object.fromEntries(
  Object.entries(CATALOG_URL_VALUE_ALIASES).map(([paramName, valueMap]) => [
    paramName,
    Object.fromEntries(
      Object.entries(valueMap).map(([label, alias]) => [alias, label])
    )
  ])
);

let currentUser = null;
let currentUserRole = null;
let currentUserProfile = null;
let publicProfilesByIdCache = new Map();
let publicProfileIdsByHandleCache = new Map();
let currentUserFollowedProfileIds = new Set();
let userPageFollowRequestProfileIds = new Set();
let notificationsUnreadCount = 0;
let notificationsUnreadUserId = '';
let notificationsUnreadRefreshPromise = null;
let notificationsUnreadFetchedAt = 0;
let areNotificationsUnavailable = false;
let isNotificationTestRunning = false;
let isAdmin = false;
let isAuthModalOpen = false;
let isAuthPopoverOpen = false;
let isDisplayNameModalOpen = false;
let isDisplayNameSubmitting = false;
let isProfilePosterPreferenceSubmitting = false;
let profileRussianPostersColumnAvailable = true;
let isAuthRegisterMode = false;
let isPasswordRecoveryMode = false;
let isPasswordRecoveryEntryPage = false;
let isSharedAuthStateListenerBound = false;
let sharedAuthStateAfterSyncHandler = null;
let isMovieModalEventsBound = false;
let areSharedUiEventsBound = false;
let areCatalogPageEventsBound = false;
let areMoviePageEventsBound = false;
let allMovies = [];
let catalogMoviesById = new Map();
let catalogMovieMetaById = new Map();
let movieSelectRowsBySelectKey = new Map();
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
let isCompletenessAuditRunning = false;
let isDatabaseExportRunning = false;
let moviePosterImagesByMovieId = new Map();
let moviePosterImagesLoadedByMovieId = new Set();
let moviePosterImagesLoadPromisesByMovieId = new Map();
let moviePosterImagesTableAvailable = true;
let moviePosterImagesDraft = [];
let moviePosterImagesDraftDirty = false;
let moviePosterImagesDraftDraggedEntryId = null;
let isMoviePagePayloadRpcAvailable = true;
let allMovieRatings = [];
let allMovieWatchlist = [];
let allMovieReviews = [];
let allMovieComments = [];
let movieRatingStatsByMovieId = new Map();
let movieRatingByMovieAndUserKey = new Map();
let currentUserRatingsByMovieId = new Map();
let currentUserWatchlistMovieIds = new Set();
let catalogReviewedMovieIds = new Set();
let reviewedOnlyFilter = false;
let areMovieReviewLikesAvailable = true;
let areMovieCommentsAvailable = true;
let areMovieCommentLikesAvailable = true;
let editingMovieId = null;
let isModalOpen = false;
let moviesLoadedSuccessfully = false;
let authMessageTimer = null;
let appMessageTimer = null;
let isAuthSubmitting = false;
let isMovieFormSubmitting = false;
let isProfilePasswordSubmitting = false;
let isUserAdminPasswordSubmitting = false;
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
let avatarCropModal = null;
let avatarCropFrame = null;
let avatarCropImage = null;
let avatarCropZoomInput = null;
let avatarCropStatus = null;
let avatarCropSaveButton = null;
let avatarCropSourceUrl = '';
let avatarCropState = null;
let isAvatarCropSubmitting = false;
let isAvatarCropDragging = false;
let avatarCropDragStart = null;
let authStateSyncRequestId = 0;
let loadedPosterUrls = new Set();
let allGenreNames = [];
let allCountryNames = [];
let lastCatalogAnchorMovieId = null;
let currentMoviePageMovieId = null;
let currentMoviePageMovieData = null;
let activeMoviePageSessionCacheSignature = '';
let currentMoviePageSimilarMovieId = null;
let currentMoviePageSimilarMovieIds = [];
let currentMoviePageSimilarMovies = [];
let areDirectorsAvailable = true;
let currentDirectorPageData = null;
let currentDirectorsAdminRows = [];
let currentDirectorsAdminMovieRows = [];
let directorPageControllerPromise = null;
let directorPageController = null;
let directorsAdminFrameworkAppPromise = null;
let directorsAdminFrameworkApp = null;
let moviePageSimilarControllerPromise = null;
let moviePageSimilarController = null;
let directorModal = null;
let directorForm = null;
let directorModalTitle = null;
let directorIdInput = null;
let directorNameRuInput = null;
let directorNameInput = null;
let directorGenderInput = null;
let directorAliasesInput = null;
let directorTmdbUrlInput = null;
let directorBirthDateInput = null;
let directorDeathDateInput = null;
let directorBirthPlaceInput = null;
let directorPhotoFileInput = null;
let directorPhotoFileName = null;
let directorPhotoPreview = null;
let directorPhotoRemoveInput = null;
let directorFormMessage = null;
let directorSubmitButton = null;
let directorDeleteButton = null;
let isDirectorModalOpen = false;
let isDirectorFormSubmitting = false;
let moviePageSimilarRequestId = 0;
let isMoviePageSimilarEditorSaving = false;
let moviePageSimilarEditorSearchQuery = '';
let moviePageSimilarEditorStatus = '';
let moviePageSimilarEditorStatusType = '';
let moviePageSimilarEditorDraggedMovieId = null;
let shouldFadeCatalogAfterSkeleton = false;
let catalogFadeCleanupTimerId = null;
let catalogDomSnapshotSchedule = null;
let pendingCatalogDomSnapshotSessionSnapshot = null;
let currentCatalogPage = 1;
let currentCatalogPaginationSlots = null;
let catalogProfileActivityHandle = '';
let catalogProfileActivityKey = '';
let catalogProfileActivityUserId = '';
let catalogProfileActivityDisplayName = '';
let catalogProfileActivityMovieIds = new Set();
let catalogProfileActivityRatingsByMovieId = new Map();
let catalogProfileActivityLoaded = false;
let catalogProfileActivityLoadingPromise = null;
let catalogProfileActivityError = null;
let catalogDataVersion = 0;
let catalogDerivedStateCache = null;
let lastCatalogDomRenderSignature = '';
const userRatingControlsHtmlCache = new Map();
const catalogSessionSnapshotDataHashCache = new WeakMap();

function hasStoredSupabaseAuthSession() {
  try {
    const authStorageKeys = Array.from(new Set([
      SUPABASE_AUTH_STORAGE_KEY,
      ...Object.keys(localStorage).filter(key => /^sb-.+-auth-token$/.test(key))
    ].filter(Boolean)));

    return authStorageKeys.some(key => {
      const rawValue = localStorage.getItem(key);

      if (!rawValue || rawValue === 'null' || rawValue === 'undefined') {
        return false;
      }

      try {
        const parsedValue = JSON.parse(rawValue);

        return Boolean(
          parsedValue?.access_token ||
          parsedValue?.currentSession?.access_token ||
          parsedValue?.user?.id
        );
      } catch (error) {
        return true;
      }
    });
  } catch (error) {
    return false;
  }
}

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

function parseLineOrCommaSeparatedValues(value) {
  const uniqueValues = new Map();

  String(value || '')
    .split(/\r?\n|,/)
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

function setFormInputValue(inputElement, value, inputName = 'input') {
  if (!inputElement) {
    console.error(`Не найден элемент формы: ${inputName}`);
    return;
  }

  inputElement.value = value ?? '';
}

function isIntentionalEmptyFieldMarker(value) {
  return INTENTIONAL_EMPTY_FIELD_MARKERS.has(normalizeSearchText(value));
}

function normalizeTextArrayField(value, { excludeIntentionalEmpty = false } = {}) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => String(item || '').trim())
    .filter(item => item && (!excludeIntentionalEmpty || !isIntentionalEmptyFieldMarker(item)));
}

function getTextArrayFormValue(value) {
  return normalizeTextArrayField(value).join('\n');
}

function getOptionalTextArrayPayload(values = []) {
  const normalizedValues = normalizeTextArrayField(values);

  return normalizedValues.length > 0 ? normalizedValues : null;
}

function formatTextArrayForDetail(value) {
  return normalizeTextArrayField(value, { excludeIntentionalEmpty: true }).join(', ');
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

function isMovieReviewLikesTableUnavailableError(error) {
  const errorCode = String(error?.code || '');
  const errorMessage = String(error?.message || '').toLowerCase();

  return MOVIE_REVIEW_LIKES_UNAVAILABLE_CODES.has(errorCode) ||
    errorMessage.includes('movie_review_likes');
}

function isMoviePosterImagesTableUnavailableError(error) {
  const errorCode = String(error?.code || '');
  const errorMessage = String(error?.message || '').toLowerCase();

  return MOVIE_POSTER_IMAGES_UNAVAILABLE_CODES.has(errorCode) ||
    errorMessage.includes('movie_poster_images');
}

function isMovieCommentsTableUnavailableError(error) {
  const errorCode = String(error?.code || '');
  const errorMessage = String(error?.message || '').toLowerCase();

  return MOVIE_COMMENTS_UNAVAILABLE_CODES.has(errorCode) ||
    errorMessage.includes('movie_comments');
}

function isMovieCommentLikesTableUnavailableError(error) {
  const errorCode = String(error?.code || '');
  const errorMessage = String(error?.message || '').toLowerCase();

  return MOVIE_COMMENT_LIKES_UNAVAILABLE_CODES.has(errorCode) ||
    errorMessage.includes('movie_comment_likes');
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

function getMovieSelectRowsCacheKey(selectQuery = MOVIE_CATALOG_SELECT) {
  return String(selectQuery || MOVIE_CATALOG_SELECT)
    .replace(/\s+/g, ' ')
    .trim();
}

function getMovieSelectRowsCacheBucket(selectQuery = MOVIE_CATALOG_SELECT) {
  const cacheKey = getMovieSelectRowsCacheKey(selectQuery);

  if (!movieSelectRowsBySelectKey.has(cacheKey)) {
    movieSelectRowsBySelectKey.set(cacheKey, new Map());
  }

  return movieSelectRowsBySelectKey.get(cacheKey);
}

function cacheMovieSelectRows(selectQuery = MOVIE_CATALOG_SELECT, movies = []) {
  const cacheBucket = getMovieSelectRowsCacheBucket(selectQuery);

  (Array.isArray(movies) ? movies : []).forEach(movie => {
    const movieId = String(movie?.id || '').trim();

    if (movieId) {
      cacheBucket.set(movieId, movie);
    }
  });
}

function invalidateMovieSelectRowsCache(movieIds = null) {
  const normalizedMovieIds = Array.isArray(movieIds)
    ? movieIds.map(movieId => String(movieId || '').trim()).filter(Boolean)
    : [];

  if (!normalizedMovieIds.length) {
    movieSelectRowsBySelectKey = new Map();
    return;
  }

  movieSelectRowsBySelectKey.forEach(cacheBucket => {
    normalizedMovieIds.forEach(movieId => {
      cacheBucket.delete(movieId);
    });
  });
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

  cacheMovieSelectRows(MOVIE_CATALOG_SELECT, movies);
}

async function fetchCatalogMoviesByIds(movieIds = []) {
  const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);
  const missingMovieIds = normalizedMovieIds.filter(movieId => !catalogMoviesById.has(String(movieId)));

  if (missingMovieIds.length === 0) {
    return normalizedMovieIds
      .map(movieId => getCatalogMovieById(movieId))
      .filter(Boolean);
  }

  const { data, error } = await runMovieSelectWithOptionalColumns(
    selectQuery => supabaseClient
      .from('movies')
      .select(selectQuery)
      .in('id', missingMovieIds)
      .order('position', { foreignTable: 'movie_genres', ascending: true }),
    MOVIE_CATALOG_SELECT
  );

  throwIfSupabaseError(error);
  cacheCatalogMovies(data || []);

  return normalizedMovieIds
    .map(movieId => getCatalogMovieById(movieId))
    .filter(Boolean);
}

async function fetchSimilarCardMoviesByIds(movieIds = []) {
  const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);

  if (!normalizedMovieIds.length) {
    return [];
  }

  const similarMovieCache = getMovieSelectRowsCacheBucket(MOVIE_SIMILAR_CARD_SELECT);
  const missingMovieIds = normalizedMovieIds.filter(movieId => (
    !catalogMoviesById.has(String(movieId)) &&
    !similarMovieCache.has(String(movieId))
  ));

  if (missingMovieIds.length > 0) {
    await fetchMoviesByIdsWithSelect(missingMovieIds, MOVIE_SIMILAR_CARD_SELECT);
  }

  const movies = normalizedMovieIds
    .map(movieId => getCatalogMovieById(movieId) || similarMovieCache.get(String(movieId)))
    .filter(Boolean);

  await ensurePreferredPosterImagesForMovies(movies);
  return movies;
}

async function fetchMoviesByIdsWithSelect(movieIds = [], selectQuery = MOVIE_CATALOG_SELECT) {
  const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);

  if (!normalizedMovieIds.length) {
    return [];
  }

  const selectCache = getMovieSelectRowsCacheBucket(selectQuery);
  const missingMovieIds = normalizedMovieIds.filter(movieId => !selectCache.has(String(movieId)));

  if (!missingMovieIds.length) {
    return normalizedMovieIds
      .map(movieId => selectCache.get(String(movieId)))
      .filter(Boolean);
  }

  const { data, error } = await runMovieSelectWithOptionalColumns(
    currentSelectQuery => {
      let query = supabaseClient
        .from('movies')
        .select(currentSelectQuery)
        .in('id', missingMovieIds);

      if (String(currentSelectQuery || '').includes('movie_genres')) {
        query = query.order('position', { foreignTable: 'movie_genres', ascending: true });
      }

      return query;
    },
    selectQuery
  );

  throwIfSupabaseError(error);

  cacheMovieSelectRows(selectQuery, data || []);

  const moviesById = getMovieSelectRowsCacheBucket(selectQuery);

  return normalizedMovieIds
    .map(movieId => moviesById.get(String(movieId)))
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

async function fetchAllSupabaseRows(createQuery, pageSize = 1000) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await createQuery().range(from, from + pageSize - 1);

    throwIfSupabaseError(error);

    const pageRows = Array.isArray(data) ? data : [];
    rows.push(...pageRows);

    if (pageRows.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return rows;
}

const ADMIN_COMPLETENESS_MOVIE_SELECT = `
  id,
  slug,
  title,
  year,
  release_year,
  release_month,
  production,
  distribution,
  russian_distribution,
  poster_url,
  kinopoisk_url,
  trailer_url
`;

async function fetchAdminMovieRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movies')
      .select('*')
      .order('title', { ascending: true })
      .order('year', { ascending: true })
  ));
}

async function fetchAdminCompletenessMovieRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movies')
      .select(ADMIN_COMPLETENESS_MOVIE_SELECT)
      .order('title', { ascending: true })
      .order('year', { ascending: true })
  ));
}

async function fetchAdminMoviePosterImageRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movie_poster_images')
      .select('*')
      .order('movie_id', { ascending: true })
      .order('position', { ascending: true })
  ));
}

async function fetchAdminMovieGenreRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movie_genres')
      .select('*, genres (*)')
      .order('movie_id', { ascending: true })
      .order('position', { ascending: true })
  ));
}

async function fetchAdminMovieCountryRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movie_countries')
      .select('*, countries (*)')
      .order('movie_id', { ascending: true })
  ));
}

async function fetchAdminManualSimilarRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movie_manual_similar')
      .select('*')
      .order('movie_id', { ascending: true })
      .order('position', { ascending: true })
  ));
}

function groupRowsByMovieId(rows = []) {
  return (Array.isArray(rows) ? rows : []).reduce((groupedRows, row) => {
    const movieId = String(row?.movie_id || '').trim();

    if (!movieId) {
      return groupedRows;
    }

    if (!groupedRows.has(movieId)) {
      groupedRows.set(movieId, []);
    }

    groupedRows.get(movieId).push(row);
    return groupedRows;
  }, new Map());
}

function isEmptyTextArrayLikeField(value) {
  if (Array.isArray(value)) {
    return normalizeTextArrayField(value).length === 0;
  }

  return !String(value || '').trim();
}

function getUniqueMoviePosterUrlCount(movie, posterRows = []) {
  const urls = new Set();
  const primaryPosterUrl = String(movie?.poster_url || '').trim();

  if (primaryPosterUrl) {
    urls.add(primaryPosterUrl);
  }

  posterRows.forEach(row => {
    const imageUrl = String(row?.image_url || '').trim();

    if (imageUrl) {
      urls.add(imageUrl);
    }
  });

  return urls.size;
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

    const adminTools = await loadAdminActionTools();
    const report = adminTools.buildManualSimilarAuditReport();
    const filename = `horroreiro-manual-similar-audit-${adminTools.getDateStamp()}.txt`;

    adminTools.downloadTextFile(filename, report.text);
    showAppMessage(adminTools.getManualSimilarAuditSummaryMessage(report.summary), 'success', false, {
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

function setCompletenessAuditButtonState(isRunning) {
  if (!completenessAuditButton) {
    return;
  }

  completenessAuditButton.disabled = isRunning;
  completenessAuditButton.textContent = isRunning ? 'Готовлю аудит...' : 'Аудит заполненности';
}

function setDatabaseExportButtonState(isRunning) {
  if (!databaseExportButton) {
    return;
  }

  databaseExportButton.disabled = isRunning;
  databaseExportButton.textContent = isRunning ? 'Готовлю экспорт...' : 'Экспорт базы';
}

function setNotificationTestButtonState(isRunning) {
  if (!notificationTestButton) {
    return;
  }

  notificationTestButton.disabled = isRunning;
  notificationTestButton.textContent = isRunning ? 'Готовлю тест...' : 'Тест уведомлений';
}

async function runCompletenessAudit() {
  if (!isAdmin || isCompletenessAuditRunning) {
    return;
  }

  isCompletenessAuditRunning = true;
  setCompletenessAuditButtonState(true);
  closeAuthPopoverMenu();
  showAppMessage('Готовлю аудит заполненности...', 'info');

  try {
    const [movies, posterRows] = await Promise.all([
      fetchAdminCompletenessMovieRows(),
      fetchAdminMoviePosterImageRows()
    ]);
    const adminTools = await loadAdminActionTools();
    const report = adminTools.buildCompletenessAuditReport(movies, posterRows);
    const filename = `horroreiro-completeness-audit-${adminTools.getDateStamp()}.txt`;

    adminTools.downloadTextFile(filename, report.text);
    showAppMessage(adminTools.getCompletenessAuditSummaryMessage(report.summary), 'success', false, {
      showAction: true
    });
  } catch (error) {
    console.error('Ошибка аудита заполненности:', error);
    showAppMessage(`Ошибка аудита заполненности: ${error.message || 'смотри консоль F12.'}`, 'error', true);
  } finally {
    isCompletenessAuditRunning = false;
    setCompletenessAuditButtonState(false);
  }
}

async function exportDatabase() {
  if (!isAdmin || isDatabaseExportRunning) {
    return;
  }

  isDatabaseExportRunning = true;
  setDatabaseExportButtonState(true);
  closeAuthPopoverMenu();
  showAppMessage('Готовлю экспорт базы...', 'info');

  try {
    const [
      movies,
      movieGenres,
      movieCountries,
      posterImages,
      manualSimilarRows,
      people,
      moviePeople
    ] = await Promise.all([
      fetchAdminMovieRows(),
      fetchAdminMovieGenreRows(),
      fetchAdminMovieCountryRows(),
      fetchAdminMoviePosterImageRows(),
      fetchAdminManualSimilarRows(),
      fetchAdminPersonRows().catch(error => {
        if (isDirectorsUnavailableError(error)) {
          areDirectorsAvailable = false;
          return [];
        }

        throw error;
      }),
      fetchAdminMoviePeopleRows().catch(error => {
        if (isDirectorsUnavailableError(error)) {
          areDirectorsAvailable = false;
          return [];
        }

        throw error;
      })
    ]);
    const adminTools = await loadAdminActionTools();
    const payload = adminTools.buildDatabaseExportPayload({
      movies,
      movieGenres,
      movieCountries,
      posterImages,
      manualSimilarRows,
      people,
      moviePeople
    });
    const filename = `horroreiro-database-export-${adminTools.getDateStamp()}.json`;

    adminTools.downloadJsonFile(filename, payload);
    showAppMessage(`Экспорт базы готов: ${payload.counts.movies} фильмов.`, 'success', false, {
      showAction: true
    });
  } catch (error) {
    console.error('Ошибка экспорта базы:', error);
    showAppMessage(`Ошибка экспорта базы: ${error.message || 'смотри консоль F12.'}`, 'error', true);
  } finally {
    isDatabaseExportRunning = false;
    setDatabaseExportButtonState(false);
  }
}

async function runNotificationTestSuite() {
  if (!isAdmin || isNotificationTestRunning) {
    return;
  }

  isNotificationTestRunning = true;
  setNotificationTestButtonState(true);
  closeAuthPopoverMenu();
  showAppMessage('Готовлю тестовые уведомления...', 'info');

  try {
    const { data, error } = await supabaseClient.rpc('create_notification_test_suite');

    if (error) {
      throw error;
    }

    areNotificationsUnavailable = false;
    await refreshNotificationsUnreadCount({ force: true });

    const createdCount = Number(data?.created || data?.created_count || 0);
    const deletedCount = Number(data?.deleted_previous || data?.deleted || 0);
    const summary = [
      `Тестовые уведомления готовы: ${createdCount || 9}.`,
      deletedCount ? `Старые тестовые удалены: ${deletedCount}.` : ''
    ].filter(Boolean).join(' ');

    showAppMessage(summary, 'success', true);

    if (isNotificationsPage()) {
      const controller = await loadNotificationsPageController();
      await controller.loadNotificationsPage();
    } else {
      window.location.href = buildNotificationsPageUrl();
    }
  } catch (error) {
    console.error('Ошибка генерации тестовых уведомлений:', error);

    const adminTools = await loadAdminActionTools();

    if (adminTools.isNotificationTestFunctionMissingError(error)) {
      showAppMessage('Тест уведомлений недоступен: серверные инструменты тестирования не подключены.', 'error', true);
    } else {
      showAppMessage(`Не удалось создать тестовые уведомления: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  } finally {
    isNotificationTestRunning = false;
    setNotificationTestButtonState(false);
  }
}

let editorPageControllerPromise = null;
let editorPageController = null;

function getEditorPageControllerContext() {
  return {
    editorPage,
    getCurrentUser: () => currentUser,
    getIsAdmin: () => isAdmin,
    shouldUseAuthenticatedUi,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    bindSharedAuthStateListener,
    openAuthModal,
    escapeHtml,
    fetchAdminCompletenessMovieRows,
    fetchAdminMoviePosterImageRows,
    groupRowsByMovieId,
    isEmptyTextArrayLikeField,
    getUniqueMoviePosterUrlCount,
    compareManualSimilarAuditMovies,
    getManualSimilarMovieLabel,
    buildMoviePageUrl,
    buildMovieCanonicalPath,
    runCompletenessAudit,
    exportDatabase
  };
}

async function loadEditorPageController() {
  if (!editorPage) {
    return null;
  }

  if (!editorPageControllerPromise) {
    editorPageControllerPromise = import(getLazyFeatureModuleUrl('editor-page.js'))
      .then(module => {
        editorPageController = module.createEditorPageController(getEditorPageControllerContext());
        return editorPageController;
      })
      .catch(error => {
        editorPageControllerPromise = null;
        editorPageController = null;
        throw error;
      });
  }

  return editorPageControllerPromise;
}

async function initEditorPage() {
  const controller = await loadEditorPageController();

  await controller?.initEditorPage?.();
}

function handleEditorPageClick(event) {
  return editorPageController?.handleEditorPageClick?.(event) || false;
}

function getDirectorPageControllerContext() {
  return {
    directorPage,
    supabaseClient,
    directorStorageRenderPath: DIRECTOR_STORAGE_RENDER_PATH,
    directorImagePreset: DIRECTOR_IMAGE_PRESET,
    posterImageMinQuality: POSTER_IMAGE_MIN_QUALITY,
    movieCatalogSelect: MOVIE_CATALOG_SELECT,
    catalogPriorityPosterCount: CATALOG_PRIORITY_POSTER_COUNT,
    getAreDirectorsAvailable: () => areDirectorsAvailable,
    setAreDirectorsAvailable: value => {
      areDirectorsAvailable = Boolean(value);
    },
    getCurrentDirectorPageData: () => currentDirectorPageData,
    setCurrentDirectorPageData: data => {
      currentDirectorPageData = data;
    },
    getIsAdmin: () => isAdmin,
    shouldUseAuthenticatedUi,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    bindSharedAuthStateListener,
    escapeHtml,
    isDirectorsUnavailableError,
    normalizeDirectorRow,
    normalizeDirectorAliasValues,
    normalizeDirectorGender,
    getDirectorDisplayName,
    getDirectorSecondaryName,
    getDirectorLifeLabel,
    isDirectorDeceased,
    getDirectorPlaceholderSvgHtml,
    extractDirectorStoragePath,
    fetchMoviesByIdsWithSelect,
    ensurePreferredPosterImagesForMovies,
    getSortedMoviesCopy,
    cacheCatalogMovies,
    runMovieSelectWithOptionalColumns,
    throwIfSupabaseError,
    parseLineOrCommaSeparatedValues,
    slugifyMovieValue,
    normalizeSearchText,
    buildCatalogPageUrl,
    createMovieCardRenderContext,
    getMoviePreferredPosterUrl,
    createMovieCard,
    bindMoviePosterLoadStates,
    bindPosterFallbackImages,
    handleCatalogCardClick,
    handleCatalogCardAuxClick,
    handleCatalogRatingStarMouseOver,
    handleCatalogRatingStarMouseOut,
    openDirectorModalById,
    fetchMovieRatings,
    fetchCurrentUserRatings,
    fetchMovieWatchlist,
    loadPersonPlaceholderTools
  };
}

async function loadDirectorPageController() {
  if (!directorPage) {
    return null;
  }

  if (!directorPageControllerPromise) {
    directorPageControllerPromise = import(getLazyFeatureModuleUrl('director-page.js'))
      .then(module => {
        directorPageController = module.createDirectorPageController(getDirectorPageControllerContext());
        return directorPageController;
      })
      .catch(error => {
        directorPageControllerPromise = null;
        directorPageController = null;
        throw error;
      });
  }

  return directorPageControllerPromise;
}

async function loadDirectorPage() {
  const controller = await loadDirectorPageController();

  await controller?.loadDirectorPage?.();
}

function renderDirectorPage(data = currentDirectorPageData) {
  return directorPageController?.renderDirectorPage?.(data);
}

async function initDirectorPage() {
  const controller = await loadDirectorPageController();

  await controller?.initDirectorPage?.();
}

function isDirectorsUnavailableError(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();
  const mentionsPeopleSchema = (
    message.includes('people') ||
    message.includes('movie_people')
  );

  return (
    (DIRECTORS_UNAVAILABLE_CODES.has(code) && mentionsPeopleSchema) ||
    (code === 'PGRST200' && mentionsPeopleSchema && message.includes('relationship')) ||
    (mentionsPeopleSchema && message.includes('could not find the table')) ||
    (mentionsPeopleSchema && message.includes('schema cache')) ||
    (mentionsPeopleSchema && message.includes('relation') && message.includes('does not exist'))
  );
}

function isMovieDirectorSyncRpcUnavailableError(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();

  return (
    ['42883', 'PGRST202', 'PGRST204'].includes(code) &&
    message.includes('horroreiro_sync_movie_directors')
  ) || (
    message.includes('horroreiro_sync_movie_directors') &&
    (
      message.includes('could not find') ||
      message.includes('schema cache') ||
      message.includes('does not exist')
    )
  );
}

function normalizeDirectorAliasValues(value) {
  if (Array.isArray(value)) {
    return value
      .map(alias => String(alias || '').trim())
      .filter(Boolean);
  }

  return parseMultilineValues(value)
    .map(alias => alias.trim())
    .filter(Boolean);
}

function normalizeDirectorGender(value) {
  return String(value || '').trim() === 'Ж' ? 'Ж' : 'М';
}

function getDirectorDisplayName(director) {
  return String(director?.name_ru || director?.name || '').trim() || 'Без имени';
}

function getDirectorSecondaryName(director) {
  return String(director?.name || '').trim();
}

function formatYearsLabel(count) {
  const normalizedCount = Math.abs(Number(count) || 0);
  const lastTwoDigits = normalizedCount % 100;
  const lastDigit = normalizedCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет';
  }

  if (lastDigit === 1) {
    return 'год';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  }

  return 'лет';
}

function parseDateOnly(value) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    return null;
  }

  const date = new Date(`${normalizedValue}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getAgeInYears(startDate, endDate = new Date()) {
  if (!startDate || !endDate) {
    return null;
  }

  let age = endDate.getFullYear() - startDate.getFullYear();
  const monthDelta = endDate.getMonth() - startDate.getMonth();
  const dayDelta = endDate.getDate() - startDate.getDate();

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    age -= 1;
  }

  return Math.max(0, age);
}

function isDirectorDeceased(director) {
  return Boolean(parseDateOnly(director?.death_date));
}

function formatDirectorDate(value) {
  const date = parseDateOnly(value);

  if (!date) {
    return '';
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getDirectorLifeLabel(director) {
  const birthDate = parseDateOnly(director?.birth_date);
  const deathDate = parseDateOnly(director?.death_date);

  if (!birthDate && !deathDate) {
    return '';
  }

  const birthLabel = formatDirectorDate(director?.birth_date);
  const deathLabel = formatDirectorDate(director?.death_date);
  const ageReferenceDate = deathDate || new Date();
  const age = birthDate ? getAgeInYears(birthDate, ageReferenceDate) : null;
  const ageLabel = age !== null ? ` (${age} ${formatYearsLabel(age)})` : '';

  if (birthLabel && deathLabel) {
    return `${birthLabel} — ${deathLabel}${ageLabel}`;
  }

  if (birthLabel) {
    return `${birthLabel}${ageLabel}`;
  }

  return deathLabel;
}

function normalizeDirectorRow(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    gender: normalizeDirectorGender(row.gender),
    aliases: Array.isArray(row.aliases) ? row.aliases : []
  };
}

async function fetchDirectorById(directorId) {
  const normalizedDirectorId = String(directorId || '').trim();

  if (!normalizedDirectorId || !areDirectorsAvailable) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from('people')
    .select('*')
    .eq('id', normalizedDirectorId)
    .maybeSingle();

  if (error) {
    if (isDirectorsUnavailableError(error)) {
      areDirectorsAvailable = false;
      return null;
    }

    throw error;
  }

  return normalizeDirectorRow(data);
}

async function fetchMovieDirectorsForMovie(movieId) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !areDirectorsAvailable) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('movie_people')
    .select('role, position, people (*)')
    .eq('movie_id', normalizedMovieId)
    .eq('role', 'director')
    .order('position', { ascending: true });

  if (error) {
    if (isDirectorsUnavailableError(error)) {
      areDirectorsAvailable = false;
      return [];
    }

    throw error;
  }

  return (data || [])
    .map(row => ({
      ...row,
      people: normalizeDirectorRow(row.people)
    }))
    .filter(row => row.people?.id);
}

async function ensureMovieDirectorItemsLoaded(movie) {
  if (!movie?.id || Array.isArray(movie.movie_people) || !areDirectorsAvailable) {
    return movie;
  }

  movie.movie_people = await fetchMovieDirectorsForMovie(movie.id);
  return movie;
}

function getMovieDirectorItems(movie) {
  const rows = Array.isArray(movie?.movie_people)
    ? movie.movie_people
    : Array.isArray(movie?.movie_directors)
      ? movie.movie_directors
      : [];

  return rows
    .filter(row => !row?.role || row.role === 'director')
    .map(row => row?.people || row?.directors || row?.director || null)
    .filter(director => director?.id);
}

function getMoviePageDirectorHtml(movie) {
  const directors = getMovieDirectorItems(movie);

  if (directors.length === 0) {
    return movie?.director ? escapeHtml(movie.director) : '-';
  }

  return directors.map(director => `
    <a class="movie-page-meta-link" href="${escapeHtml(buildDirectorPageUrl(director))}">
      ${escapeHtml(getDirectorDisplayName(director))}
    </a>
  `).join(', ');
}

function getDirectorPlaceholderSvgHtml(director, iconClassName = 'director-page-photo-placeholder-icon') {
  if (personPlaceholderTools?.getDirectorPlaceholderSvgHtml) {
    return personPlaceholderTools.getDirectorPlaceholderSvgHtml(director, iconClassName);
  }

  const isFemale = normalizeDirectorGender(director?.gender) === 'Ж';

  return `
    <svg
      class="${escapeHtml(`${iconClassName} ${isFemale ? 'is-female' : 'is-male'}`)}"
      viewBox="0 0 64 64"
      focusable="false"
      aria-hidden="true"
    >
      <circle cx="32" cy="24" r="14" fill="currentColor"></circle>
      <path d="M12 58c3.4-12.5 13.1-20 20-20s16.6 7.5 20 20H12Z" fill="currentColor"></path>
    </svg>
  `;
}

async function fetchAdminPersonRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('people')
      .select('*')
      .order('name_ru', { ascending: true })
  ));
}

async function fetchAdminMoviePeopleRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movie_people')
      .select('movie_id, person_id, role, position')
      .order('role', { ascending: true })
      .order('person_id', { ascending: true })
      .order('position', { ascending: true })
  ));
}

async function fetchAdminMovieDirectorRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movie_people')
      .select('movie_id, person_id, role, position')
      .eq('role', 'director')
      .order('person_id', { ascending: true })
      .order('position', { ascending: true })
  ));
}

function getDirectorsAdminFrameworkActions() {
  return {
    login: openAuthModal,
    refresh: () => {
      void loadDirectorsAdminPage();
    },
    create: openDirectorModal,
    edit: directorId => {
      void openDirectorModalById(directorId);
    }
  };
}

function getDirectorsAdminFrameworkUtils() {
  return {
    buildDirectorPageUrl,
    getDirectorDisplayName,
    getDirectorSecondaryName,
    getDirectorLifeLabel,
    getDirectorPlaceholderSvgHtml
  };
}

async function ensureDirectorsAdminFrameworkApp() {
  if (directorsAdminFrameworkApp || !directorsAdminPage) {
    return directorsAdminFrameworkApp;
  }

  if (!directorsAdminFrameworkAppPromise) {
    directorsAdminFrameworkAppPromise = import(getLazyFeatureModuleUrl('assets/directors-admin-app.js'))
      .then(module => {
        directorsAdminFrameworkApp = module.mountDirectorsAdminApp(directorsAdminPage, {
          status: 'loading',
          actions: getDirectorsAdminFrameworkActions(),
          utils: getDirectorsAdminFrameworkUtils()
        });

        return directorsAdminFrameworkApp;
      })
      .catch(error => {
        directorsAdminFrameworkAppPromise = null;
        throw error;
      });
  }

  return directorsAdminFrameworkAppPromise;
}

function renderDirectorsAdminFrameworkState(state = {}) {
  if (!directorsAdminPage || !directorsAdminFrameworkApp) {
    return false;
  }

  document.title = 'Режиссёры — Хоррорейро';
  directorsAdminFrameworkApp.update({
    ...state,
    actions: getDirectorsAdminFrameworkActions(),
    utils: getDirectorsAdminFrameworkUtils()
  });

  return true;
}

function renderDirectorsAdminPageLoading() {
  if (!directorsAdminPage) {
    return;
  }

  if (!renderDirectorsAdminFrameworkState({ status: 'loading' })) {
    directorsAdminPage.innerHTML = '<div class="directors-admin-page-loading-state">Загрузка режиссёров...</div>';
  }
}

function renderDirectorsAdminPageAuthGate() {
  if (!directorsAdminPage) {
    return;
  }

  if (!renderDirectorsAdminFrameworkState({ status: 'auth' })) {
    document.title = 'Режиссёры — Хоррорейро';
    directorsAdminPage.innerHTML = `
      <div class="directors-admin-page-empty-state directors-admin-page-empty-state-large">
        <p>Войди под администратором, чтобы открыть список режиссёров.</p>
        <button type="button" class="secondary-button directors-admin-page-login-button" data-directors-admin-action="login">
          Войти
        </button>
      </div>
    `;
  }
}

function renderDirectorsAdminPageForbidden() {
  if (!directorsAdminPage) {
    return;
  }

  if (!renderDirectorsAdminFrameworkState({ status: 'forbidden' })) {
    document.title = 'Режиссёры — Хоррорейро';
    directorsAdminPage.innerHTML = `
      <div class="directors-admin-page-empty-state directors-admin-page-empty-state-large">
        <p>Список режиссёров доступен только администратору.</p>
      </div>
    `;
  }
}

function renderDirectorsAdminPageUnavailable() {
  if (!directorsAdminPage) {
    return;
  }

  if (!renderDirectorsAdminFrameworkState({ status: 'unavailable' })) {
    document.title = 'Режиссёры — Хоррорейро';
    directorsAdminPage.innerHTML = `
      <div class="directors-admin-page-empty-state directors-admin-page-empty-state-large">
        <p>Таблицы персон пока недоступны: серверный контур персон не подключён.</p>
      </div>
    `;
  }
}

function renderDirectorsAdminPageError() {
  if (!directorsAdminPage) {
    return;
  }

  if (!renderDirectorsAdminFrameworkState({ status: 'error' })) {
    directorsAdminPage.innerHTML = `
      <div class="directors-admin-page-empty-state directors-admin-page-empty-state-large">
        <p>Не удалось загрузить режиссёров. Попробуй обновить страницу.</p>
        <button type="button" class="secondary-button directors-admin-page-login-button" data-directors-admin-action="refresh">
          Повторить
        </button>
      </div>
    `;
  }
}

function getMoviesCountLabel(count) {
  const normalizedCount = Math.abs(Number(count) || 0);
  const lastTwoDigits = normalizedCount % 100;
  const lastDigit = normalizedCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'фильмов';
  }

  if (lastDigit === 1) {
    return 'фильм';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'фильма';
  }

  return 'фильмов';
}

function renderDirectorsAdminPage({ directors = [], movieDirectorRows = [] } = {}) {
  if (!directorsAdminPage) {
    return;
  }

  const sourceDirectors = Array.isArray(directors) ? directors : [];
  currentDirectorsAdminRows = sourceDirectors;
  currentDirectorsAdminMovieRows = Array.isArray(movieDirectorRows) ? movieDirectorRows : [];

  if (!renderDirectorsAdminFrameworkState({
    status: 'ready',
    directors: sourceDirectors,
    movieDirectorRows: currentDirectorsAdminMovieRows
  })) {
    renderDirectorsAdminPageError();
  }
}

async function loadDirectorsAdminPage({ preserveScroll = false } = {}) {
  if (!directorsAdminPage) {
    return;
  }

  const scrollYBeforeLoad = preserveScroll
    ? window.scrollY || window.pageYOffset || 0
    : null;

  try {
    await ensureDirectorsAdminFrameworkApp();
  } catch (error) {
    console.error('Ошибка загрузки framework-интерфейса режиссёров:', error);
    renderDirectorsAdminPageError();
    return;
  }

  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    renderDirectorsAdminPageAuthGate();
    return;
  }

  if (!isAdmin) {
    renderDirectorsAdminPageForbidden();
    return;
  }

  if (!preserveScroll) {
    renderDirectorsAdminPageLoading();
  }

  try {
    const [directors, movieDirectorRows] = await Promise.all([
      fetchAdminPersonRows(),
      fetchAdminMovieDirectorRows()
    ]);

    areDirectorsAvailable = true;
    renderDirectorsAdminPage({
      directors: directors.map(normalizeDirectorRow).filter(Boolean),
      movieDirectorRows
    });

    restoreWindowScrollPositionOnNextFrames(scrollYBeforeLoad);
  } catch (error) {
    if (isDirectorsUnavailableError(error)) {
      areDirectorsAvailable = false;
      renderDirectorsAdminPageUnavailable();
      return;
    }

    console.error('Ошибка загрузки списка режиссёров:', error);
    renderDirectorsAdminPageError();
  }
}

async function initDirectorsAdminPage() {
  renderDirectorsAdminPageLoading();
  await restoreSession();
  trackEmailConfirmedLoginIfNeeded();
  await loadDirectorsAdminPage();

  bindSharedAuthStateListener({
    onAfterAuthSync: loadDirectorsAdminPage
  });
}

function getDirectorByIdFromAdminRows(directorId) {
  const normalizedDirectorId = String(directorId || '').trim();

  return currentDirectorsAdminRows.find(director => String(director.id) === normalizedDirectorId) || null;
}

async function openDirectorModalById(directorId) {
  const normalizedDirectorId = String(directorId || '').trim();

  if (!normalizedDirectorId) {
    openDirectorModal();
    return;
  }

  const fallbackDirector = getDirectorByIdFromAdminRows(normalizedDirectorId);

  try {
    const director = await fetchDirectorById(normalizedDirectorId);

    if (director) {
      openDirectorModal(director);
      return;
    }

    if (fallbackDirector) {
      openDirectorModal(fallbackDirector);
      return;
    }

    showAppMessage('Персона не найдена. Обнови страницу.', 'error');
  } catch (error) {
    console.error('Ошибка загрузки персоны для редактирования:', error);

    if (fallbackDirector) {
      openDirectorModal(fallbackDirector);
      setDirectorFormMessage('Не удалось обновить данные перед редактированием. Проверь изменения перед сохранением.', 'error');
      return;
    }

    showAppMessage('Не удалось открыть карточку персоны.', 'error');
  }
}

function handleDirectorsAdminPageClick(event) {
  const actionButton = event.target?.closest?.('[data-directors-admin-action]');

  if (!actionButton || !directorsAdminPage?.contains(actionButton)) {
    return false;
  }

  const action = String(actionButton.dataset.directorsAdminAction || '').trim();

  event.preventDefault();

  if (action === 'login') {
    openAuthModal();
    return true;
  }

  if (action === 'refresh') {
    void loadDirectorsAdminPage();
    return true;
  }

  if (action === 'create') {
    openDirectorModal();
    return true;
  }

  return false;
}

function ensureDirectorModal() {
  if (directorModal) {
    return;
  }

  directorModal = document.createElement('div');
  directorModal.id = 'directorModal';
  directorModal.className = 'modal director-modal';
  directorModal.innerHTML = `
    <div class="modal-backdrop" data-director-modal-close="true"></div>
    <div class="modal-dialog director-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="directorModalTitle">
      <div class="modal-header">
        <h2 id="directorModalTitle">Режиссёр</h2>
        <button type="button" class="modal-close-button" data-director-modal-close="true" aria-label="Закрыть"></button>
      </div>
      <form class="director-form" data-director-form="true">
        <input type="hidden" data-director-id="true">

        <div class="director-form-photo-row">
          <div class="director-form-photo-preview" data-director-photo-preview="true"></div>
          <div class="director-form-photo-actions">
            <label class="secondary-button director-form-photo-upload">
              <span>Выбрать фото</span>
              <input type="file" data-director-photo-file="true" accept="image/jpeg,image/png,image/webp">
            </label>
            <button type="button" class="secondary-button secondary-button-compact" data-director-photo-remove-button="true">
              Удалить фото
            </button>
            <input type="checkbox" data-director-photo-remove="true" hidden>
            <div class="director-form-photo-name" data-director-photo-file-name="true">Файл не выбран</div>
          </div>
        </div>

        <div class="movie-form-inline-group movie-form-inline-group-titles">
          <div class="form-row">
            <label for="directorNameRu">Имя на русском:</label>
            <input type="text" id="directorNameRu" data-director-name-ru="true" required>
          </div>
          <div class="form-row">
            <label for="directorName">Имя:</label>
            <input type="text" id="directorName" data-director-name="true">
          </div>
          <div class="form-row">
            <label for="directorGender">Пол:</label>
            <select id="directorGender" data-director-gender="true">
              <option value="М">М</option>
              <option value="Ж">Ж</option>
            </select>
          </div>
        </div>

        <div class="movie-form-inline-group movie-form-inline-group-meta">
          <div class="form-row">
            <label for="directorBirthDate">Дата рождения:</label>
            <input type="date" id="directorBirthDate" data-director-birth-date="true">
          </div>
          <div class="form-row">
            <label for="directorDeathDate">Дата смерти:</label>
            <input type="date" id="directorDeathDate" data-director-death-date="true">
          </div>
          <div class="form-row">
            <label for="directorBirthPlace">Место рождения:</label>
            <input type="text" id="directorBirthPlace" data-director-birth-place="true">
          </div>
        </div>

        <div class="form-row">
          <label for="directorAliases">Дополнительные имена:</label>
          <textarea id="directorAliases" data-director-aliases="true" rows="3"></textarea>
          <div class="field-hint">По одному имени с новой строки.</div>
        </div>

        <div class="form-row">
          <label for="directorTmdbUrl">Ссылка TMDB:</label>
          <input
            type="text"
            id="directorTmdbUrl"
            data-director-tmdb-url="true"
            inputmode="url"
            placeholder="https://www.themoviedb.org/person/..."
          >
        </div>

        <div class="form-actions">
          <button type="submit" data-director-submit="true">Сохранить</button>
          <button type="button" class="secondary-button form-mode-button director-delete-button" data-director-delete="true" hidden>
            Удалить
          </button>
          <button type="button" class="secondary-button form-mode-button" data-director-modal-close="true">
            Отмена
          </button>
        </div>
      </form>
      <p class="form-message" data-director-form-message="true"></p>
    </div>
  `;

  document.body.appendChild(directorModal);

  directorForm = directorModal.querySelector('[data-director-form="true"]');
  directorModalTitle = directorModal.querySelector('#directorModalTitle');
  directorIdInput = directorModal.querySelector('[data-director-id="true"]');
  directorNameRuInput = directorModal.querySelector('[data-director-name-ru="true"]');
  directorNameInput = directorModal.querySelector('[data-director-name="true"]');
  directorGenderInput = directorModal.querySelector('[data-director-gender="true"]');
  directorAliasesInput = directorModal.querySelector('[data-director-aliases="true"]');
  directorTmdbUrlInput = directorModal.querySelector('[data-director-tmdb-url="true"]');
  directorBirthDateInput = directorModal.querySelector('[data-director-birth-date="true"]');
  directorDeathDateInput = directorModal.querySelector('[data-director-death-date="true"]');
  directorBirthPlaceInput = directorModal.querySelector('[data-director-birth-place="true"]');
  directorPhotoFileInput = directorModal.querySelector('[data-director-photo-file="true"]');
  directorPhotoFileName = directorModal.querySelector('[data-director-photo-file-name="true"]');
  directorPhotoPreview = directorModal.querySelector('[data-director-photo-preview="true"]');
  directorPhotoRemoveInput = directorModal.querySelector('[data-director-photo-remove="true"]');
  directorFormMessage = directorModal.querySelector('[data-director-form-message="true"]');
  directorSubmitButton = directorModal.querySelector('[data-director-submit="true"]');
  directorDeleteButton = directorModal.querySelector('[data-director-delete="true"]');

  directorModal.querySelectorAll('[data-director-modal-close="true"]').forEach(element => {
    element.addEventListener('click', closeDirectorModal);
  });

  directorModal.querySelector('[data-director-photo-remove-button="true"]')?.addEventListener('click', () => {
    if (directorPhotoRemoveInput) {
      directorPhotoRemoveInput.checked = true;
    }

    if (directorPhotoFileInput) {
      directorPhotoFileInput.value = '';
    }

    renderDirectorModalPhotoPreview('');
    setDirectorFormMessage();
  });

  directorPhotoFileInput?.addEventListener('change', () => {
    updateDirectorPhotoFileUi();
    setDirectorFormMessage();
  });

  directorDeleteButton?.addEventListener('click', deleteDirectorFromModal);

  directorForm?.addEventListener('submit', saveDirectorFromModal);
}

function setDirectorFormMessage(message = '', type = '') {
  if (!directorFormMessage) {
    return;
  }

  directorFormMessage.textContent = message;
  directorFormMessage.classList.remove('is-error', 'is-success');

  if (type) {
    directorFormMessage.classList.add(`is-${type}`);
  }
}

function setDirectorFormSubmitting(isSubmitting) {
  isDirectorFormSubmitting = isSubmitting;

  [
    directorNameRuInput,
    directorNameInput,
    directorGenderInput,
    directorAliasesInput,
    directorTmdbUrlInput,
    directorBirthDateInput,
    directorDeathDateInput,
    directorBirthPlaceInput,
    directorPhotoFileInput,
    directorDeleteButton
  ].forEach(element => {
    if (element) {
      element.disabled = isSubmitting;
    }
  });

  if (directorSubmitButton) {
    directorSubmitButton.disabled = isSubmitting;
    directorSubmitButton.textContent = isSubmitting ? 'Сохраняю...' : 'Сохранить';
  }
}

function renderDirectorModalPhotoPreview(photoUrl = '') {
  if (!directorPhotoPreview) {
    return;
  }

  const normalizedPhotoUrl = String(photoUrl || '').trim();

  directorPhotoPreview.innerHTML = normalizedPhotoUrl
    ? `<img src="${escapeHtml(normalizedPhotoUrl)}" alt="" loading="lazy" decoding="async">`
    : '<span>Фото</span>';
}

function updateDirectorPhotoFileUi() {
  const file = directorPhotoFileInput?.files?.[0] || null;

  if (directorPhotoFileName) {
    directorPhotoFileName.textContent = file ? file.name : 'Файл не выбран';
  }

  if (file) {
    if (directorPhotoRemoveInput) {
      directorPhotoRemoveInput.checked = false;
    }

    const objectUrl = URL.createObjectURL(file);
    renderDirectorModalPhotoPreview(objectUrl);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

function openDirectorModal(director = null) {
  if (!isAdmin) {
    return;
  }

  ensureDirectorModal();

  const normalizedDirector = normalizeDirectorRow(director) || {};

  isDirectorModalOpen = true;
  directorModal.classList.add('is-open');
  document.body.classList.add('modal-open');

  if (directorModalTitle) {
    directorModalTitle.textContent = normalizedDirector.id ? 'Редактировать режиссёра' : 'Добавить режиссёра';
  }

  setFormInputValue(directorIdInput, normalizedDirector.id || '', 'directorIdInput');
  setFormInputValue(directorNameRuInput, normalizedDirector.name_ru || '', 'directorNameRuInput');
  setFormInputValue(directorNameInput, normalizedDirector.name || '', 'directorNameInput');
  setFormInputValue(directorGenderInput, normalizeDirectorGender(normalizedDirector.gender), 'directorGenderInput');
  setFormInputValue(directorAliasesInput, normalizeDirectorAliasValues(normalizedDirector.aliases || []).join('\n'), 'directorAliasesInput');
  setFormInputValue(directorTmdbUrlInput, normalizedDirector.tmdb_url || '', 'directorTmdbUrlInput');
  setFormInputValue(directorBirthDateInput, normalizedDirector.birth_date || '', 'directorBirthDateInput');
  setFormInputValue(directorDeathDateInput, normalizedDirector.death_date || '', 'directorDeathDateInput');
  setFormInputValue(directorBirthPlaceInput, normalizedDirector.birth_place || '', 'directorBirthPlaceInput');

  if (directorPhotoFileInput) {
    directorPhotoFileInput.value = '';
  }

  if (directorPhotoRemoveInput) {
    directorPhotoRemoveInput.checked = false;
  }

  if (directorPhotoFileName) {
    directorPhotoFileName.textContent = 'Файл не выбран';
  }

  if (directorDeleteButton) {
    directorDeleteButton.hidden = !normalizedDirector.id;
  }

  renderDirectorModalPhotoPreview(normalizedDirector.photo_url || '');
  setDirectorFormMessage();
  setDirectorFormSubmitting(false);
  directorNameRuInput?.focus();
}

function closeDirectorModal(options = {}) {
  const forceClose = Boolean(options?.force);

  if (!directorModal || (isDirectorFormSubmitting && !forceClose)) {
    return;
  }

  isDirectorModalOpen = false;
  directorModal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
}

async function buildUniqueDirectorSlug(nameRu, excludeDirectorId = null) {
  const baseSlug = slugifyMovieValue(nameRu) || 'name';
  let slugCandidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabaseClient
      .from('people')
      .select('id')
      .eq('slug', slugCandidate)
      .limit(1);

    if (excludeDirectorId) {
      query = query.neq('id', excludeDirectorId);
    }

    const { data, error } = await query;

    throwIfSupabaseError(error);

    if (!data || data.length === 0) {
      return slugCandidate;
    }

    slugCandidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function getDirectorNameKey(nameRu) {
  return normalizeSearchText(nameRu);
}

function getDirectorCompletenessScore(director) {
  if (!director) {
    return 0;
  }

  let score = 0;

  if (String(director.photo_url || '').trim()) score += 16;
  if (String(director.name || '').trim()) score += 8;
  if (String(director.birth_date || '').trim()) score += 4;
  if (String(director.death_date || '').trim()) score += 2;
  if (String(director.birth_place || '').trim()) score += 2;
  if (normalizeDirectorAliasValues(director.aliases).length > 0) score += 2;

  return score;
}

function choosePreferredDirectorRow(firstDirector, secondDirector) {
  if (!firstDirector) {
    return secondDirector || null;
  }

  if (!secondDirector) {
    return firstDirector;
  }

  const firstScore = getDirectorCompletenessScore(firstDirector);
  const secondScore = getDirectorCompletenessScore(secondDirector);

  if (secondScore > firstScore) {
    return secondDirector;
  }

  return firstDirector;
}

async function findExistingDirectorByNameRu(nameRu, excludeDirectorId = null) {
  const nameKey = getDirectorNameKey(nameRu);
  const excludedId = String(excludeDirectorId || '').trim();

  if (!nameKey || !areDirectorsAvailable) {
    return null;
  }

  const rows = await fetchAdminPersonRows();

  return rows
    .map(normalizeDirectorRow)
    .filter(Boolean)
    .filter(director => String(director.id) !== excludedId)
    .filter(director => getDirectorNameKey(director.name_ru) === nameKey)
    .reduce((preferredDirector, director) => (
      choosePreferredDirectorRow(preferredDirector, director)
    ), null);
}

function mergeDirectorPayloadForExisting(existingDirector, payload) {
  if (!existingDirector) {
    return payload;
  }

  return {
    ...payload,
    name: payload.name || existingDirector.name || null,
    gender: normalizeDirectorGender(existingDirector.gender || payload.gender),
    aliases: Array.isArray(payload.aliases) && payload.aliases.length > 0
      ? payload.aliases
      : normalizeDirectorAliasValues(existingDirector.aliases),
    birth_date: payload.birth_date || existingDirector.birth_date || null,
    death_date: payload.death_date || existingDirector.death_date || null,
    birth_place: payload.birth_place || existingDirector.birth_place || null,
    tmdb_url: payload.tmdb_url || existingDirector.tmdb_url || null,
    photo_url: payload.photo_url || existingDirector.photo_url || null
  };
}

async function mergeDirectorIntoExisting(sourceDirectorId, targetDirectorId) {
  const sourceId = String(sourceDirectorId || '').trim();
  const targetId = String(targetDirectorId || '').trim();

  if (!sourceId || !targetId || sourceId === targetId) {
    return;
  }

  const { data: sourceLinks, error: sourceLinksError } = await supabaseClient
    .from('movie_people')
    .select('movie_id, role, position')
    .eq('person_id', sourceId);

  throwIfSupabaseError(sourceLinksError);

  const targetLinks = (sourceLinks || []).map(row => ({
    movie_id: row.movie_id,
    person_id: targetId,
    role: row.role,
    position: row.position
  }));

  if (targetLinks.length > 0) {
    const { error: upsertLinksError } = await supabaseClient
      .from('movie_people')
      .upsert(targetLinks, {
        onConflict: 'movie_id,person_id,role'
      });

    throwIfSupabaseError(upsertLinksError);
  }

  const { error: deleteLinksError } = await supabaseClient
    .from('movie_people')
    .delete()
    .eq('person_id', sourceId);

  throwIfSupabaseError(deleteLinksError);

  const { error: deletePersonError } = await supabaseClient
    .from('people')
    .delete()
    .eq('id', sourceId);

  throwIfSupabaseError(deletePersonError);
}

async function uploadDirectorPhotoFile(file) {
  if (!file) {
    return '';
  }

  const rawExtension = String(file.name || 'jpg').split('.').pop() || 'jpg';
  const fileExtension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(DIRECTOR_STORAGE_BUCKET)
    .upload(fileName, file, {
      upsert: false
    });

  throwIfSupabaseError(uploadError);

  const { data } = supabaseClient.storage
    .from(DIRECTOR_STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return data?.publicUrl || '';
}

function extractDirectorStoragePath(publicUrl) {
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
  const marker = pathname.includes(DIRECTOR_STORAGE_PUBLIC_PATH)
    ? DIRECTOR_STORAGE_PUBLIC_PATH
    : DIRECTOR_STORAGE_RENDER_PATH;

  if (!pathname.includes(marker)) {
    return null;
  }

  return pathname.split(marker)[1] || null;
}

async function deleteDirectorPhotoFileByUrl(publicUrl) {
  const storagePath = extractDirectorStoragePath(publicUrl);

  if (!storagePath) {
    return;
  }

  const { error } = await supabaseClient.storage
    .from(DIRECTOR_STORAGE_BUCKET)
    .remove([storagePath]);

  throwIfSupabaseError(error);
}

async function deleteDirectorFromModal() {
  if (!isAdmin || isDirectorFormSubmitting) {
    return;
  }

  const directorId = String(directorIdInput?.value || '').trim();

  if (!directorId) {
    return;
  }

  await runConfirmedAction('Удалить персону? Это возможно только если она не привязана к фильмам.', async () => {
    try {
      ensureActiveSessionForWrite();
      setDirectorFormSubmitting(true);
      setDirectorFormMessage('Проверяю связи...');

      const { count, error: countError } = await supabaseClient
        .from('movie_people')
        .select('movie_id', {
          count: 'exact',
          head: true
        })
        .eq('person_id', directorId);

      throwIfSupabaseError(countError);

      if (Number(count) > 0) {
        setDirectorFormMessage(`Нельзя удалить: персона привязана к ${count} ${getMoviesCountLabel(count)}.`, 'error');
        return;
      }

      const director = await fetchDirectorById(directorId);
      const { error: deleteError } = await supabaseClient
        .from('people')
        .delete()
        .eq('id', directorId);

      throwIfSupabaseError(deleteError);

      if (director?.photo_url) {
        await deleteDirectorPhotoFileByUrl(director.photo_url);
      }

      closeDirectorModal({ force: true });

      if (isDirectorsAdminPage()) {
        await loadDirectorsAdminPage({ preserveScroll: true });
      } else if (isDirectorPage()) {
        window.location.href = buildDirectorsAdminPageUrl();
      }
    } catch (error) {
      console.error('Ошибка удаления персоны:', error);
      setDirectorFormMessage(error?.message || 'Не удалось удалить персону.', 'error');
    } finally {
      setDirectorFormSubmitting(false);
    }
  });
}

async function saveDirectorFromModal(event) {
  event.preventDefault();

  if (!isAdmin || isDirectorFormSubmitting) {
    return;
  }

  const directorId = String(directorIdInput?.value || '').trim();
  const nameRu = String(directorNameRuInput?.value || '').trim();
  const name = String(directorNameInput?.value || '').trim();
  const gender = normalizeDirectorGender(directorGenderInput?.value);
  const aliases = normalizeDirectorAliasValues(directorAliasesInput?.value || '');
  const tmdbUrl = normalizeTmdbPersonUrl(directorTmdbUrlInput?.value || '');
  const birthDate = String(directorBirthDateInput?.value || '').trim();
  const deathDate = String(directorDeathDateInput?.value || '').trim();
  const birthPlace = String(directorBirthPlaceInput?.value || '').trim();
  const photoFile = directorPhotoFileInput?.files?.[0] || null;
  const shouldRemovePhoto = Boolean(directorPhotoRemoveInput?.checked);
  if (!nameRu) {
    setDirectorFormMessage('Имя на русском обязательно.', 'error');
    directorNameRuInput?.focus();
    return;
  }

  try {
    ensureActiveSessionForWrite();
    setDirectorFormSubmitting(true);
    setDirectorFormMessage('Сохраняю...');

    const existingDirector = directorId
      ? await fetchDirectorById(directorId)
        || currentDirectorsAdminRows.find(director => String(director.id) === directorId)
        || currentDirectorPageData?.director
      : null;
    const sameNameDirector = await findExistingDirectorByNameRu(nameRu, directorId);
    const isMergeIntoExisting = Boolean(existingDirector?.id && sameNameDirector?.id);
    const targetDirector = isMergeIntoExisting
      ? sameNameDirector
      : existingDirector || sameNameDirector || null;

    let photoUrl = targetDirector?.photo_url || '';

    if (shouldRemovePhoto) {
      photoUrl = '';
    }

    if (photoFile) {
      setDirectorFormMessage('Загружаю фото...');
      photoUrl = await uploadDirectorPhotoFile(photoFile);
    }

    const payload = {
      name_ru: nameRu,
      name: name || null,
      gender,
      aliases,
      birth_date: birthDate || null,
      death_date: deathDate || null,
      birth_place: birthPlace || null,
      tmdb_url: tmdbUrl || null,
      photo_url: photoUrl || null
    };

    const shouldPreserveExistingTargetValues = Boolean(!directorId && sameNameDirector) || isMergeIntoExisting;
    const savePayload = shouldPreserveExistingTargetValues
      ? mergeDirectorPayloadForExisting(targetDirector, payload)
      : payload;
    let savedDirector = null;

    if (targetDirector?.id) {
      if (nameRu !== (targetDirector.name_ru || '') || !targetDirector.slug) {
        savePayload.slug = await buildUniqueDirectorSlug(nameRu, targetDirector.id);
      }

      const { data, error } = await supabaseClient
        .from('people')
        .update(savePayload)
        .eq('id', targetDirector.id)
        .select('*')
        .single();

      throwIfSupabaseError(error);

      savedDirector = normalizeDirectorRow(data);

      if (isMergeIntoExisting) {
        await mergeDirectorIntoExisting(existingDirector.id, targetDirector.id);
      }

      if (currentDirectorPageData?.director && String(currentDirectorPageData.director.id) === String(savedDirector.id)) {
        currentDirectorPageData.director = savedDirector;
        renderDirectorPage(currentDirectorPageData);
      }
    } else {
      savePayload.slug = await buildUniqueDirectorSlug(nameRu);
      savePayload.created_by = currentUser.id;

      const { data, error } = await supabaseClient
        .from('people')
        .insert(savePayload)
        .select('*')
        .single();

      throwIfSupabaseError(error);
      savedDirector = normalizeDirectorRow(data);
    }

    if (
      targetDirector?.photo_url &&
      targetDirector.photo_url !== photoUrl &&
      (shouldRemovePhoto || photoFile)
    ) {
      await deleteDirectorPhotoFileByUrl(targetDirector.photo_url);
    }

    setDirectorFormMessage('Сохранено.', 'success');
    closeDirectorModal({ force: true });

    if (isDirectorPage() && savedDirector?.slug && currentDirectorPageData?.director?.id !== savedDirector.id) {
      window.location.href = buildDirectorPageUrl(savedDirector);
      return;
    }

    if (isDirectorsAdminPage()) {
      await loadDirectorsAdminPage({ preserveScroll: true });
    }
  } catch (error) {
    console.error('Ошибка сохранения режиссёра:', error);
    setDirectorFormMessage(error?.message || 'Не удалось сохранить режиссёра.', 'error');
  } finally {
    setDirectorFormSubmitting(false);
  }
}

async function ensureDirectorsByNames(names = []) {
  const normalizedNames = parseLineOrCommaSeparatedValues(names.join('\n'));

  if (!areDirectorsAvailable || normalizedNames.length === 0) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('people')
    .select('*')
    .order('name_ru', { ascending: true });

  if (error) {
    if (isDirectorsUnavailableError(error)) {
      areDirectorsAvailable = false;
      return [];
    }

    throw error;
  }

  const directorsByNameKey = (data || [])
    .map(normalizeDirectorRow)
    .filter(Boolean)
    .reduce((directorsMap, director) => {
      const nameKey = getDirectorNameKey(director.name_ru);

      if (!nameKey) {
        return directorsMap;
      }

      directorsMap.set(
        nameKey,
        choosePreferredDirectorRow(directorsMap.get(nameKey), director)
      );
      return directorsMap;
    }, new Map());
  const result = [];

  for (const nameRu of normalizedNames) {
    const nameKey = getDirectorNameKey(nameRu);
    let director = directorsByNameKey.get(nameKey);

    if (!director) {
      const payload = {
        name_ru: nameRu,
        slug: await buildUniqueDirectorSlug(nameRu),
        created_by: currentUser?.id || null
      };
      const { data: insertedDirector, error: insertError } = await supabaseClient
        .from('people')
        .insert(payload)
        .select('*')
        .single();

      if (insertError) {
        if (isDirectorsUnavailableError(insertError)) {
          areDirectorsAvailable = false;
          return result;
        }

        throw insertError;
      }

      director = normalizeDirectorRow(insertedDirector);
      directorsByNameKey.set(nameKey, director);
    }

    if (director) {
      result.push(director);
    }
  }

  return result;
}

async function deleteOrphanPeopleByIds(personIds = []) {
  const uniquePersonIds = Array.from(new Set(
    (Array.isArray(personIds) ? personIds : [])
      .map(personId => String(personId || '').trim())
      .filter(Boolean)
  ));

  if (!areDirectorsAvailable || uniquePersonIds.length === 0) {
    return;
  }

  for (const personId of uniquePersonIds) {
    const { count, error: countError } = await supabaseClient
      .from('movie_people')
      .select('movie_id', {
        count: 'exact',
        head: true
      })
      .eq('person_id', personId);

    if (countError) {
      if (isDirectorsUnavailableError(countError)) {
        areDirectorsAvailable = false;
        return;
      }

      throw countError;
    }

    if (Number(count) > 0) {
      continue;
    }

    const { error: deleteError } = await supabaseClient
      .from('people')
      .delete()
      .eq('id', personId);

    if (deleteError) {
      if (isDirectorsUnavailableError(deleteError)) {
        areDirectorsAvailable = false;
        return;
      }

      throw deleteError;
    }
  }
}

async function syncMovieDirectorsViaRpc(movieId) {
  const { error } = await supabaseClient.rpc('horroreiro_sync_movie_directors', {
    target_movie_id: movieId
  });

  throwIfSupabaseError(error);
  return true;
}

async function replaceMovieDirectors(movieId, directorNames = []) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !areDirectorsAvailable) {
    return false;
  }

  try {
    return await syncMovieDirectorsViaRpc(normalizedMovieId);
  } catch (error) {
    if (isMovieDirectorSyncRpcUnavailableError(error)) {
      return replaceMovieDirectorsClientFallback(normalizedMovieId, directorNames);
    }

    if (isDirectorsUnavailableError(error)) {
      areDirectorsAvailable = false;
      return false;
    }

    throw error;
  }
}

async function replaceMovieDirectorsClientFallback(movieId, directorNames = []) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !areDirectorsAvailable) {
    return false;
  }

  try {
    const directors = await ensureDirectorsByNames(directorNames);
    const nextDirectorIds = new Set(directors.map(director => String(director.id)));
    const { data: previousLinks, error: previousLinksError } = await supabaseClient
      .from('movie_people')
      .select('person_id')
      .eq('movie_id', normalizedMovieId)
      .eq('role', 'director');

    if (previousLinksError) {
      throw previousLinksError;
    }

    const orphanCandidateIds = (previousLinks || [])
      .map(row => String(row?.person_id || '').trim())
      .filter(personId => personId && !nextDirectorIds.has(personId));

    const { error: deleteError } = await supabaseClient
      .from('movie_people')
      .delete()
      .eq('movie_id', normalizedMovieId)
      .eq('role', 'director');

    if (deleteError) {
      throw deleteError;
    }

    if (directors.length === 0) {
      await deleteOrphanPeopleByIds(orphanCandidateIds);
      return true;
    }

    const rows = directors.map((director, index) => ({
      movie_id: normalizedMovieId,
      person_id: director.id,
      role: 'director',
      position: index
    }));

    const { error: insertError } = await supabaseClient
      .from('movie_people')
      .insert(rows);

    if (insertError) {
      throw insertError;
    }

    await deleteOrphanPeopleByIds(orphanCandidateIds);
    return true;
  } catch (error) {
    if (isDirectorsUnavailableError(error)) {
      areDirectorsAvailable = false;
      return false;
    }

    throw error;
  }
}

function getManualSimilarSelectableMovies() {
  return movieEditorController?.getManualSimilarSelectableMovies({
    movies: allMovies,
    ownerMovieId: editingMovieId,
    draftMovieIds: manualSimilarMovieIdsDraft,
    getMovieLabel: getManualSimilarMovieLabel
  }) || [];
}

function renderManualSimilarMovieOptions() {
  if (!manualSimilarMovieSelect) {
    return;
  }

  const selectableMovies = getManualSimilarSelectableMovies();

  manualSimilarMovieSelect.innerHTML = movieEditorController?.getManualSimilarMovieOptionsHtml({
    selectableMovies,
    getMovieLabel: getManualSimilarMovieLabel,
    escapeHtml
  }) || '<option value="">Выбрать фильм</option>';
  manualSimilarMovieSelect.value = '';
  refreshCustomSelect(manualSimilarMovieSelect);

  if (addManualSimilarMovieButton) {
    addManualSimilarMovieButton.disabled = true;
  }
}

function renderManualSimilarMoviesList() {
  if (!manualSimilarMoviesList) {
    renderManualSimilarMovieOptions();
    return;
  }

  const selectedMovies = movieEditorController?.getManualSimilarSelectedMovies({
    movieIds: manualSimilarMovieIdsDraft,
    ownerMovieId: editingMovieId,
    getMovieById: getCatalogMovieById
  }) || [];

  manualSimilarMoviesList.innerHTML = movieEditorController?.getManualSimilarMoviesListHtml({
    selectedMovies,
    getMovieLabel: getManualSimilarMovieLabel,
    escapeHtml
  }) || '<div class="manual-similar-empty">Похожие фильмы не выбраны.</div>';

  renderManualSimilarMovieOptions();
}

function setManualSimilarDraft(movieIds = [], { markDirty = false } = {}) {
  manualSimilarMovieIdsDraft = movieEditorController?.getManualSimilarDraftAfterSet(
    movieIds,
    editingMovieId
  ) || normalizeManualSimilarMovieIds(movieIds, editingMovieId);
  manualSimilarDraftDirty = Boolean(markDirty);
  renderManualSimilarMoviesList();
}

function addManualSimilarMovieFromSelect() {
  if (!manualSimilarMovieSelect?.value) {
    return;
  }

  setManualSimilarDraft(
    movieEditorController?.getManualSimilarDraftAfterAdd(
      manualSimilarMovieIdsDraft,
      manualSimilarMovieSelect.value,
      editingMovieId
    ) || normalizeManualSimilarMovieIds(
      [...manualSimilarMovieIdsDraft, manualSimilarMovieSelect.value],
      editingMovieId
    ),
    { markDirty: true }
  );
}

function removeManualSimilarMovieFromDraft(movieId) {
  setManualSimilarDraft(
    movieEditorController?.getManualSimilarDraftAfterRemove(
      manualSimilarMovieIdsDraft,
      movieId,
      editingMovieId
    ) || normalizeManualSimilarMovieIds(
      manualSimilarMovieIdsDraft.filter(similarMovieId => String(similarMovieId) !== String(movieId)),
      editingMovieId
    ),
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

    throw new Error('Серверный контур ручных похожих фильмов пока недоступен. Повтори сохранение позже.');
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
  markLocalDataMutation(`manual-similar:${ownerMovieId}`);
  return true;
}

function normalizeMoviePosterImageRows(rows = []) {
  return (Array.isArray(rows) ? rows : [])
    .map(row => ({
      id: row?.id ? String(row.id) : '',
      movie_id: row?.movie_id ? String(row.movie_id) : '',
      image_url: String(row?.image_url || '').trim(),
      position: Number(row?.position ?? 0)
    }))
    .filter(row => row.image_url)
    .sort((firstRow, secondRow) => {
      if (firstRow.position !== secondRow.position) {
        return firstRow.position - secondRow.position;
      }

      return firstRow.image_url.localeCompare(secondRow.image_url);
    });
}

function setMoviePosterImagesCache(movieId, rows = []) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId) {
    return;
  }

  moviePosterImagesByMovieId.set(normalizedMovieId, normalizeMoviePosterImageRows(rows));
  moviePosterImagesLoadedByMovieId.add(normalizedMovieId);
}

function getMoviePosterImages(movieId) {
  if (!movieId) {
    return [];
  }

  return moviePosterImagesByMovieId.get(String(movieId)) || [];
}

function getNormalizedMovieIdsFromMovies(movies = []) {
  return [...new Set(
    (Array.isArray(movies) ? movies : [])
      .map(movie => String(movie?.id || '').trim())
      .filter(Boolean)
  )];
}

async function fetchMoviePosterImagesForMovie(movieId, { force = false } = {}) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !moviePosterImagesTableAvailable) {
    if (normalizedMovieId) {
      setMoviePosterImagesCache(normalizedMovieId, []);
    }

    return [];
  }

  if (!force && moviePosterImagesLoadedByMovieId.has(normalizedMovieId)) {
    return getMoviePosterImages(normalizedMovieId);
  }

  if (!force && moviePosterImagesLoadPromisesByMovieId.has(normalizedMovieId)) {
    return moviePosterImagesLoadPromisesByMovieId.get(normalizedMovieId);
  }

  const loadPromise = (async () => {
    const { data, error } = await supabaseClient
      .from('movie_poster_images')
      .select('id, movie_id, image_url, position')
      .eq('movie_id', normalizedMovieId)
      .order('position', { ascending: true });

    if (error) {
      if (isMoviePosterImagesTableUnavailableError(error)) {
        moviePosterImagesTableAvailable = false;
        setMoviePosterImagesCache(normalizedMovieId, []);
        return [];
      }

      throw error;
    }

    setMoviePosterImagesCache(normalizedMovieId, data || []);
    return getMoviePosterImages(normalizedMovieId);
  })().finally(() => {
    moviePosterImagesLoadPromisesByMovieId.delete(normalizedMovieId);
  });

  moviePosterImagesLoadPromisesByMovieId.set(normalizedMovieId, loadPromise);
  return loadPromise;
}

async function fetchMoviePosterImagesForMovieSafe(movieId, options = {}) {
  try {
    return await fetchMoviePosterImagesForMovie(movieId, options);
  } catch (error) {
    console.warn('Не удалось загрузить галерею постеров:', error);
    return getMoviePosterImages(movieId);
  }
}

async function fetchMoviePosterImagesForMovies(movieIds = [], { force = false } = {}) {
  const normalizedMovieIds = [...new Set(
    (Array.isArray(movieIds) ? movieIds : [])
      .map(movieId => String(movieId || '').trim())
      .filter(Boolean)
  )];

  if (!normalizedMovieIds.length) {
    return new Map();
  }

  if (!moviePosterImagesTableAvailable) {
    normalizedMovieIds.forEach(movieId => setMoviePosterImagesCache(movieId, []));
    return new Map(normalizedMovieIds.map(movieId => [movieId, []]));
  }

  const movieIdsToFetch = normalizedMovieIds.filter(movieId =>
    force || !moviePosterImagesLoadedByMovieId.has(movieId)
  );

  if (!movieIdsToFetch.length) {
    return new Map(normalizedMovieIds.map(movieId => [movieId, getMoviePosterImages(movieId)]));
  }

  const rowsByMovieId = new Map(movieIdsToFetch.map(movieId => [movieId, []]));
  const chunkSize = 200;

  for (let index = 0; index < movieIdsToFetch.length; index += chunkSize) {
    const chunkMovieIds = movieIdsToFetch.slice(index, index + chunkSize);
    const { data, error } = await supabaseClient
      .from('movie_poster_images')
      .select('id, movie_id, image_url, position')
      .in('movie_id', chunkMovieIds)
      .order('movie_id', { ascending: true })
      .order('position', { ascending: true });

    if (error) {
      if (isMoviePosterImagesTableUnavailableError(error)) {
        moviePosterImagesTableAvailable = false;
        normalizedMovieIds.forEach(movieId => setMoviePosterImagesCache(movieId, []));
        return new Map(normalizedMovieIds.map(movieId => [movieId, []]));
      }

      throw error;
    }

    (data || []).forEach(row => {
      const movieId = String(row?.movie_id || '').trim();

      if (!rowsByMovieId.has(movieId)) {
        rowsByMovieId.set(movieId, []);
      }

      rowsByMovieId.get(movieId).push(row);
    });
  }

  movieIdsToFetch.forEach(movieId => {
    setMoviePosterImagesCache(movieId, rowsByMovieId.get(movieId) || []);
  });

  return new Map(normalizedMovieIds.map(movieId => [movieId, getMoviePosterImages(movieId)]));
}

async function fetchMoviePosterImagesForMoviesSafe(movieIds = [], options = {}) {
  try {
    return await fetchMoviePosterImagesForMovies(movieIds, options);
  } catch (error) {
    console.warn('Не удалось загрузить галереи постеров:', error);
    return new Map(
      (Array.isArray(movieIds) ? movieIds : [])
        .map(movieId => String(movieId || '').trim())
        .filter(Boolean)
        .map(movieId => [movieId, getMoviePosterImages(movieId)])
    );
  }
}

async function ensurePreferredPosterImagesForMovies(movies = [], options = {}) {
  if (!options.force && !shouldPreferRussianPosters()) {
    return new Map();
  }

  return fetchMoviePosterImagesForMoviesSafe(getNormalizedMovieIdsFromMovies(movies), options);
}

function getMoviePreferredPosterUrl(movie) {
  const primaryPosterUrl = String(movie?.poster_url || '').trim();

  if (!movie?.id || !shouldPreferRussianPosters()) {
    return primaryPosterUrl;
  }

  const [firstAdditionalPoster] = getMoviePosterImages(movie.id);
  const russianPosterUrl = String(firstAdditionalPoster?.image_url || '').trim();

  return russianPosterUrl || primaryPosterUrl;
}

function getMovieDisplayPosterGalleryImages(movie) {
  if (!movie?.id) {
    return [];
  }

  const uniqueImageUrls = new Set();
  const primaryPosterUrl = String(movie?.poster_url || '').trim();
  const additionalPosterRows = getMoviePosterImages(movie.id);
  const orderedImageEntries = [
    {
      imageUrl: primaryPosterUrl,
      label: 'Основной постер'
    },
    ...additionalPosterRows.map((row, index) => ({
      imageUrl: row.image_url,
      label: `Дополнительное изображение ${index + 1}`
    }))
  ];

  if (shouldPreferRussianPosters() && orderedImageEntries.length > 1) {
    const [primaryEntry, russianEntry, ...restEntries] = orderedImageEntries;
    orderedImageEntries.splice(
      0,
      orderedImageEntries.length,
      { ...russianEntry, label: 'Основной постер' },
      { ...primaryEntry, label: 'Дополнительное изображение 1' },
      ...restEntries
    );
  }

  return orderedImageEntries
    .map(entry => ({
      ...entry,
      imageUrl: String(entry.imageUrl || '').trim()
    }))
    .filter(entry => {
      if (!entry.imageUrl || uniqueImageUrls.has(entry.imageUrl)) {
        return false;
      }

      uniqueImageUrls.add(entry.imageUrl);
      return true;
    });
}

function revokeMoviePosterImageDraftObjectUrl(entry) {
  if (movieEditorController) {
    movieEditorController.revokeMoviePosterImageDraftObjectUrl(entry);
  } else if (entry?.objectUrl) {
    URL.revokeObjectURL(entry.objectUrl);
  }
}

function resetMoviePosterImagesDraft() {
  if (movieEditorController) {
    movieEditorController.revokeMoviePosterImageDraftObjectUrls(moviePosterImagesDraft);
  } else {
    moviePosterImagesDraft.forEach(revokeMoviePosterImageDraftObjectUrl);
  }
  moviePosterImagesDraft = [];
  moviePosterImagesDraftDirty = false;
  moviePosterImagesDraftDraggedEntryId = null;
  updatePosterFileUi();
  renderMoviePosterImagesDraftList();
}

function setMoviePosterImagesDraftFromMovie(movie, rows = [], { markDirty = false } = {}) {
  const draftEntries = movieEditorController
    ? movieEditorController.createMoviePosterImageDraftEntriesFromMovie(movie, rows)
    : [];

  if (movieEditorController) {
    movieEditorController.revokeMoviePosterImageDraftObjectUrls(moviePosterImagesDraft);
  } else {
    moviePosterImagesDraft.forEach(revokeMoviePosterImageDraftObjectUrl);
  }
  moviePosterImagesDraft = draftEntries;
  moviePosterImagesDraftDirty = Boolean(markDirty);
  moviePosterImagesDraftDraggedEntryId = null;
  updatePosterFileUi();
  renderMoviePosterImagesDraftList();
}

function renderMoviePosterImagesDraftList() {
  if (!moviePosterImagesList) {
    return;
  }

  moviePosterImagesList.innerHTML = movieEditorController?.getMoviePosterImagesDraftListHtml({
    draftEntries: moviePosterImagesDraft,
    isTableAvailable: moviePosterImagesTableAvailable,
    draggedEntryId: moviePosterImagesDraftDraggedEntryId,
    isSubmitting: isMovieFormSubmitting,
    escapeHtml
  }) || '';
}

function addMoviePosterImageDraftFiles(files = []) {
  const entries = movieEditorController
    ? movieEditorController.createMoviePosterImageDraftEntriesFromFiles(files)
    : [];

  if (entries.length === 0) {
    updatePosterFileUi();
    return;
  }

  moviePosterImagesDraft.push(...entries);
  moviePosterImagesDraftDirty = true;
  updatePosterFileUi();
  renderMoviePosterImagesDraftList();
}

function moveMoviePosterImageDraftEntry(entryId, direction) {
  const result = movieEditorController?.getMoviePosterImagesDraftAfterMove(
    moviePosterImagesDraft,
    entryId,
    direction
  );

  if (!result?.changed) {
    return;
  }

  moviePosterImagesDraft = result.draftEntries;
  moviePosterImagesDraftDirty = true;
  renderMoviePosterImagesDraftList();
}

function removeMoviePosterImageDraftEntry(entryId) {
  const result = movieEditorController?.getMoviePosterImagesDraftAfterRemove(
    moviePosterImagesDraft,
    entryId
  );

  if (!result?.changed) {
    return;
  }

  revokeMoviePosterImageDraftObjectUrl(result.removedEntry);
  moviePosterImagesDraft = result.draftEntries;
  moviePosterImagesDraftDirty = true;
  updatePosterFileUi();
  renderMoviePosterImagesDraftList();
}

function handleMoviePosterImagesDraftClick(event) {
  const action = movieEditorController?.getMoviePosterImagesDraftClickAction(event);

  if (action?.type === 'remove') {
    removeMoviePosterImageDraftEntry(action.entryId);
    return;
  }

  if (action?.type === 'move') {
    moveMoviePosterImageDraftEntry(action.entryId, action.direction);
  }
}

function handleMoviePosterImagesDraftDragStart(event) {
  const result = movieEditorController?.handleMoviePosterImagesDraftDragStartEvent(
    event,
    { isSubmitting: isMovieFormSubmitting }
  );

  if (result?.started) {
    moviePosterImagesDraftDraggedEntryId = result.draggedEntryId;
  }
}

function handleMoviePosterImagesDraftDragEnd(event) {
  const result = movieEditorController?.handleMoviePosterImagesDraftDragEndEvent(event);
  moviePosterImagesDraftDraggedEntryId = result?.draggedEntryId ?? null;
}

function handleMoviePosterImagesDraftDragOver(event) {
  movieEditorController?.handleMoviePosterImagesDraftDragOverEvent(
    event,
    { draggedEntryId: moviePosterImagesDraftDraggedEntryId }
  );
}

function handleMoviePosterImagesDraftDrop(event) {
  if (!movieEditorController) {
    return;
  }

  const result = movieEditorController.getMoviePosterImagesDraftDropResult(
    event,
    {
      draftEntries: moviePosterImagesDraft,
      draggedEntryId: moviePosterImagesDraftDraggedEntryId
    }
  );

  if (!result?.changed) {
    return;
  }

  moviePosterImagesDraft = result.draftEntries;
  moviePosterImagesDraftDirty = true;
  moviePosterImagesDraftDraggedEntryId = result.draggedEntryId;
  renderMoviePosterImagesDraftList();
}

async function replaceMoviePosterImages(movieId, draftEntries = [], { preservedUrls = [] } = {}) {
  const ownerMovieId = String(movieId || '').trim();

  if (!ownerMovieId) {
    return false;
  }

  if (!moviePosterImagesTableAvailable) {
    if (draftEntries.length === 0) {
      return false;
    }

    throw new Error('Серверный контур галереи постеров пока недоступен. Повтори сохранение позже.');
  }

  if (!moviePosterImagesLoadedByMovieId.has(ownerMovieId)) {
    await fetchMoviePosterImagesForMovie(ownerMovieId, { force: true });
  }

  const previousRows = getMoviePosterImages(ownerMovieId);
  const previousUrls = new Set(previousRows.map(row => row.image_url).filter(Boolean));
  const preservedUrlSet = new Set(
    (Array.isArray(preservedUrls) ? preservedUrls : [])
      .map(url => String(url || '').trim())
      .filter(Boolean)
  );
  const finalRows = [];
  const finalUrls = new Set();
  const uploadedUrls = [];

  try {
    for (const entry of draftEntries) {
      let imageUrl = String(entry?.imageUrl || '').trim();

      if (entry?.type === 'pending' && entry.file) {
        imageUrl = await uploadPosterFile(entry.file);
        uploadedUrls.push(imageUrl);
      }

      if (!imageUrl || finalUrls.has(imageUrl)) {
        continue;
      }

      finalUrls.add(imageUrl);
      finalRows.push({
        movie_id: ownerMovieId,
        image_url: imageUrl,
        position: finalRows.length,
        created_by: currentUser?.id || null
      });
    }

    const { error: deleteError } = await supabaseClient
      .from('movie_poster_images')
      .delete()
      .eq('movie_id', ownerMovieId);

    if (deleteError) {
      if (isMoviePosterImagesTableUnavailableError(deleteError)) {
        moviePosterImagesTableAvailable = false;
      }

      throwIfSupabaseError(deleteError);
    }

    if (finalRows.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('movie_poster_images')
        .insert(finalRows);

      if (insertError) {
        if (isMoviePosterImagesTableUnavailableError(insertError)) {
          moviePosterImagesTableAvailable = false;
        }

        throwIfSupabaseError(insertError);
      }
    }

    await fetchMoviePosterImagesForMovie(ownerMovieId, { force: true });
    markLocalDataMutation(`poster-images:${ownerMovieId}`);

    const removedUrls = [...previousUrls].filter(url => (
      !finalUrls.has(url) &&
      !preservedUrlSet.has(url)
    ));

    for (const removedUrl of removedUrls) {
      try {
        await deletePosterFileByUrl(removedUrl);
      } catch (deletePosterError) {
        console.error('Не удалось удалить изображение галереи:', deletePosterError);
      }
    }

    return true;
  } catch (error) {
    for (const uploadedUrl of uploadedUrls) {
      try {
        await deletePosterFileByUrl(uploadedUrl);
      } catch (deletePosterError) {
        console.error('Не удалось удалить загруженное изображение после ошибки:', deletePosterError);
      }
    }

    throw error;
  }
}

function ensureMoviePosterImagesEditorDataLoaded(movie) {
  const movieId = movie?.id;

  return fetchMoviePosterImagesForMovie(movieId).then(rows => {
    if (movieId && String(editingMovieId) === String(movieId) && !moviePosterImagesDraftDirty) {
      setMoviePosterImagesDraftFromMovie(movie, rows);
      return;
    }

    renderMoviePosterImagesDraftList();
  });
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

function buildFollowingPageUrl() {
  return isLocalDevRouteHost() ? 'following.html' : '/following';
}

function buildNotificationsPageUrl() {
  return isLocalDevRouteHost() ? 'notifications.html' : '/notifications';
}

function buildEditorPageUrl() {
  return isLocalDevRouteHost() ? 'editor.html' : '/editor';
}

function buildDirectorsAdminPageUrl() {
  return isLocalDevRouteHost() ? 'directors.html' : '/directors';
}

function buildDirectorPageUrl(director) {
  const slug = String(director?.slug || '').trim();

  if (!slug) {
    return buildDirectorsAdminPageUrl();
  }

  const encodedSlug = encodeURIComponent(slug);

  return isLocalDevRouteHost()
    ? `name.html?slug=${encodedSlug}`
    : `/name/${encodedSlug}`;
}

function buildCatalogProfileActivityUrl(handle, activityKey) {
  const normalizedHandle = String(handle || '').trim();
  const normalizedActivityKey = String(activityKey || '').trim();
  const catalogUrl = buildCatalogPageUrl();

  if (!normalizedHandle || !CATALOG_PROFILE_ACTIVITY_KEYS.has(normalizedActivityKey)) {
    return catalogUrl;
  }

  const searchParams = new URLSearchParams();

  searchParams.set(CATALOG_PROFILE_QUERY_PARAM, normalizedHandle);
  searchParams.set(CATALOG_PROFILE_ACTIVITY_QUERY_PARAM, normalizedActivityKey);

  return `${catalogUrl}${catalogUrl.includes('?') ? '&' : '?'}${searchParams.toString()}`;
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

let currentPageLinkObserver = null;
let currentPageLinkSyncFrameId = null;
let isHistoryPatchedForCurrentPageLinks = false;

function normalizeCurrentPageLinkPath(pathname) {
  const normalizedPathname = String(pathname || '/')
    .replace(/\/index\.html$/i, '/')
    .replace(/\/{2,}/g, '/');

  if (normalizedPathname.length > 1) {
    return normalizedPathname.replace(/\/+$/g, '');
  }

  return normalizedPathname || '/';
}

function normalizeCurrentPageLinkSearch(searchParams) {
  const entries = Array.from(searchParams.entries())
    .sort((firstEntry, secondEntry) => (
      firstEntry[0].localeCompare(secondEntry[0]) ||
      firstEntry[1].localeCompare(secondEntry[1])
    ));

  return new URLSearchParams(entries).toString();
}

function getCurrentPageLinkKey(url) {
  return [
    url.origin,
    normalizeCurrentPageLinkPath(url.pathname),
    normalizeCurrentPageLinkSearch(url.searchParams),
    url.hash || ''
  ].join('|');
}

function isSameCurrentPageUrl(href) {
  try {
    const targetUrl = new URL(href, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (targetUrl.origin !== currentUrl.origin) {
      return false;
    }

    return getCurrentPageLinkKey(targetUrl) === getCurrentPageLinkKey(currentUrl);
  } catch (error) {
    return false;
  }
}

function restoreCurrentPageLink(anchor) {
  const originalHref = anchor.dataset.currentPageOriginalHref || '';

  if (originalHref && !anchor.hasAttribute('href')) {
    anchor.setAttribute('href', originalHref);
  }

  anchor.removeAttribute('aria-current');
  anchor.removeAttribute('data-current-page-link');
  delete anchor.dataset.currentPageOriginalHref;
}

function disableCurrentPageLink(anchor, href) {
  if (!anchor.dataset.currentPageOriginalHref) {
    anchor.dataset.currentPageOriginalHref = href;
  }

  anchor.removeAttribute('href');
  anchor.setAttribute('aria-current', 'page');
  anchor.dataset.currentPageLink = 'true';
}

function shouldSkipCurrentPageLinkGuard(anchor) {
  return Boolean(anchor?.matches?.('[data-movie-comment-review-anchor]'));
}

function syncCurrentPageLinks() {
  const anchors = document.querySelectorAll('a[href], a[data-current-page-original-href]');

  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href') || anchor.dataset.currentPageOriginalHref || '';

    if (!href || anchor.hasAttribute('download')) {
      return;
    }

    if (shouldSkipCurrentPageLinkGuard(anchor)) {
      if (anchor.dataset.currentPageLink === 'true') {
        restoreCurrentPageLink(anchor);
      }

      return;
    }

    if (isSameCurrentPageUrl(href)) {
      disableCurrentPageLink(anchor, href);
      return;
    }

    if (anchor.dataset.currentPageLink === 'true') {
      restoreCurrentPageLink(anchor);
    }
  });
}

function scheduleCurrentPageLinkSync() {
  if (currentPageLinkSyncFrameId !== null) {
    return;
  }

  currentPageLinkSyncFrameId = requestAnimationFrame(() => {
    currentPageLinkSyncFrameId = null;
    syncCurrentPageLinks();
  });
}

function patchHistoryForCurrentPageLinks() {
  if (isHistoryPatchedForCurrentPageLinks) {
    return;
  }

  ['pushState', 'replaceState'].forEach(methodName => {
    const originalMethod = window.history[methodName];

    if (typeof originalMethod !== 'function') {
      return;
    }

    window.history[methodName] = function patchCurrentPageLinkHistoryMethod(...args) {
      const result = originalMethod.apply(this, args);
      scheduleCurrentPageLinkSync();

      return result;
    };
  });

  isHistoryPatchedForCurrentPageLinks = true;
}

function initCurrentPageLinkGuard() {
  patchHistoryForCurrentPageLinks();
  syncCurrentPageLinks();

  if (currentPageLinkObserver || typeof MutationObserver === 'undefined' || !document.body) {
    return;
  }

  currentPageLinkObserver = new MutationObserver(mutations => {
    const shouldSync = mutations.some(mutation => (
      mutation.type === 'attributes' ||
      Array.from(mutation.addedNodes).some(node => (
        node.nodeType === Node.ELEMENT_NODE &&
        (
          node.matches?.('a[href], a[data-current-page-original-href]') ||
          node.querySelector?.('a[href], a[data-current-page-original-href]')
        )
      ))
    ));

    if (shouldSync) {
      scheduleCurrentPageLinkSync();
    }
  });

  currentPageLinkObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });

  window.addEventListener('popstate', scheduleCurrentPageLinkSync);
  window.addEventListener('hashchange', scheduleCurrentPageLinkSync);
  window.addEventListener('hashchange', () => {
    if (isMoviePage()) {
      requestAnimationFrame(focusMoviePageHashTarget);
    }
  });
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

function doesProfilePreferRussianPosters(profile = currentUserProfile) {
  return Boolean(profile?.prefer_russian_posters);
}

function shouldPreferRussianPosters() {
  return Boolean(shouldUseAuthenticatedUi() && doesProfilePreferRussianPosters());
}

function syncProfilePosterPreferenceControls(profile = currentUserProfile) {
  if (!profileRussianPostersInput && !saveProfilePosterPreferenceButton) {
    return;
  }

  const shouldDisable = !shouldUseAuthenticatedUi() || !profileRussianPostersColumnAvailable || isProfilePosterPreferenceSubmitting;

  if (profileRussianPostersInput) {
    profileRussianPostersInput.checked = doesProfilePreferRussianPosters(profile);
    profileRussianPostersInput.disabled = shouldDisable;
  }

  if (saveProfilePosterPreferenceButton) {
    saveProfilePosterPreferenceButton.disabled = shouldDisable;
  }

  if (!profileRussianPostersColumnAvailable) {
    setProfilePosterPreferenceMessage('Нужно добавить колонку prefer_russian_posters в profiles и повторить попытку.', 'error');
  }
}

function syncAuthPopoverNavigationLink(linkElement, href, shouldShow) {
  if (!linkElement) {
    return;
  }

  const normalizedHref = String(href || '').trim();

  linkElement.hidden = !shouldShow;

  if (linkElement.dataset.currentPageLink === 'true') {
    restoreCurrentPageLink(linkElement);
  }

  if (!shouldShow || !normalizedHref) {
    linkElement.removeAttribute('href');
    linkElement.removeAttribute('aria-current');
    return;
  }

  linkElement.setAttribute('href', normalizedHref);

  if (isSameCurrentPageUrl(normalizedHref)) {
    disableCurrentPageLink(linkElement, normalizedHref);
    return;
  }

  linkElement.removeAttribute('aria-current');
}

function handleAuthPopoverNavigationLinkClick(event) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  closeAuthPopoverMenu();
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

function setProfilePasswordMessage(message = '', type = '') {
  if (!profilePasswordMessage) {
    return;
  }

  profilePasswordMessage.textContent = message;
  profilePasswordMessage.classList.remove('is-error', 'is-success');

  if (type) {
    profilePasswordMessage.classList.add(`is-${type}`);
  }
}

function setProfilePosterPreferenceMessage(message = '', type = '') {
  if (!profilePosterPreferenceMessage) {
    return;
  }

  profilePosterPreferenceMessage.textContent = message;
  profilePosterPreferenceMessage.classList.remove('is-error', 'is-success');

  if (type) {
    profilePosterPreferenceMessage.classList.add(`is-${type}`);
  }
}

function clearProfileSettingsPasswordFields() {
  [
    profilePasswordCurrentInput,
    profilePasswordNewInput,
    profilePasswordConfirmInput
  ].forEach(input => {
    if (input) {
      input.value = '';
    }
  });
}

function setProfilePasswordSubmitting(isSubmitting) {
  isProfilePasswordSubmitting = isSubmitting;

  [
    profilePasswordCurrentInput,
    profilePasswordNewInput,
    profilePasswordConfirmInput,
    saveProfilePasswordButton
  ].forEach(element => {
    if (element) {
      element.disabled = isSubmitting;
    }
  });

  if (saveProfilePasswordButton) {
    saveProfilePasswordButton.textContent = isSubmitting ? 'Обновляю...' : 'Обновить пароль';
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
  if (!displayNameModal) {
    return;
  }

  displayNameModal.classList.remove('is-open');
  isDisplayNameModalOpen = false;
  displayNameButton?.setAttribute('aria-expanded', 'false');
  setDisplayNameMessage();
  setProfilePasswordMessage();
  setProfilePosterPreferenceMessage();
  clearProfileSettingsPasswordFields();
  syncBodyScrollLock();
}

function openDisplayNameModal() {
  if (!displayNameModal || !displayNameInput || !shouldUseAuthenticatedUi()) {
    return;
  }

  closeAuthPopoverMenu();

  displayNameInput.value = getCurrentDisplayName();
  syncProfileSettingsAvatarPreview(currentUserProfile);
  syncUserPageAvatarControls(currentUserProfile);
  syncProfilePosterPreferenceControls(currentUserProfile);
  setDisplayNameMessage();
  setProfilePasswordMessage();
  if (profileRussianPostersColumnAvailable) {
    setProfilePosterPreferenceMessage();
  }
  clearProfileSettingsPasswordFields();
  displayNameModal.classList.add('is-open');
  isDisplayNameModalOpen = true;
  displayNameButton?.setAttribute('aria-expanded', 'true');
  syncBodyScrollLock();

  requestAnimationFrame(() => {
    displayNameInput.focus();
    displayNameInput.select();
  });
}

function syncUserPageProfileSettingsButton() {
  const settingsButton = userPage?.querySelector('[data-user-page-profile-settings="true"]');

  if (!settingsButton) {
    return;
  }

  settingsButton.hidden = !(
    shouldUseAuthenticatedUi() &&
    currentUser?.id &&
    String(settingsButton.dataset.profileId || '') === String(currentUser.id)
  );
}

function syncUserPageOwnProfileIdentity() {
  if (!userPage || !currentUser?.id) {
    return;
  }

  const displayName = getCurrentDisplayName();
  const titleElement = userPage.querySelector('[data-user-page-display-name="true"]');

  if (titleElement && displayName) {
    titleElement.textContent = displayName;
  }

  syncUserPageAvatarMedia(currentUserProfile);
  syncProfileSettingsAvatarPreview(currentUserProfile);
  syncAuthIconButtonState();

  if (isUserPage()) {
    setUserPageDocumentMeta(currentUserProfile);
  }
}

function handleUserPageProfileSettingsClick(event) {
  const settingsButton = event.target.closest('[data-user-page-profile-settings="true"]');

  if (!settingsButton) {
    return;
  }

  event.preventDefault();
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
  cachePublicProfileRows([{ id: currentUser.id, ...currentUserProfile }]);

  syncDisplayNameButton();
  syncUserPageOwnProfileIdentity();
  updateAuthUI();
}

function isMissingProfileOptionalColumnError(error) {
  const message = String(error?.message || '').toLowerCase();

  return (
    error?.code === '42703' ||
    error?.code === 'PGRST204' ||
    message.includes('column') && message.includes('schema cache')
  );
}

function getMissingProfileOptionalColumnName(error, optionalColumns = []) {
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();
  const normalizedOptionalColumns = optionalColumns
    .map(columnName => String(columnName || '').trim())
    .filter(Boolean);
  const explicitMissingColumn = normalizedOptionalColumns.find(columnName =>
    message.includes(columnName.toLowerCase())
  );

  if (explicitMissingColumn) {
    return explicitMissingColumn;
  }

  if (!isMissingProfileOptionalColumnError(error)) {
    return '';
  }

  if (error?.code === '42703' || error?.code === 'PGRST204') {
    return normalizedOptionalColumns[normalizedOptionalColumns.length - 1] || '';
  }

  return '';
}

function markMissingProfileOptionalColumn(columnName) {
  if (columnName === 'prefer_russian_posters') {
    profileRussianPostersColumnAvailable = false;
  }
}

function isMissingAvatarColumnError(error) {
  return getMissingProfileOptionalColumnName(error, ['avatar_url']) === 'avatar_url';
}

async function runProfileSelectWithOptionalColumns(createQuery, requiredSelectColumns, optionalColumns = []) {
  let activeOptionalColumns = optionalColumns
    .map(columnName => String(columnName || '').trim())
    .filter(Boolean);

  while (true) {
    const selectColumns = [
      String(requiredSelectColumns || '').trim(),
      ...activeOptionalColumns
    ].filter(Boolean).join(', ');
    const { data, error } = await createQuery(selectColumns);

    if (!error) {
      return data || null;
    }

    const missingColumn = getMissingProfileOptionalColumnName(error, activeOptionalColumns);

    if (!missingColumn) {
      throwIfSupabaseError(error);
      return data || null;
    }

    markMissingProfileOptionalColumn(missingColumn);
    activeOptionalColumns = activeOptionalColumns.filter(columnName => columnName !== missingColumn);
  }
}

async function runProfileSelectWithOptionalAvatar(createQuery, selectWithAvatar, selectWithoutAvatar) {
  return runProfileSelectWithOptionalColumns(createQuery, selectWithoutAvatar, ['avatar_url']);
}

async function runCurrentUserProfileSelect(createQuery) {
  return runProfileSelectWithOptionalColumns(
    createQuery,
    'role, display_name, default_display_name',
    ['avatar_url', 'prefer_russian_posters']
  );
}

function cachePublicProfileRows(rows = []) {
  (Array.isArray(rows) ? rows : [rows])
    .filter(Boolean)
    .forEach(profile => {
      const profileId = String(profile?.id || '').trim();

      if (!profileId) {
        return;
      }

      publicProfilesByIdCache.set(profileId, {
        ...(publicProfilesByIdCache.get(profileId) || {}),
        ...profile,
        id: profileId
      });

      const profileHandle = String(profile?.default_display_name || '').trim();

      if (profileHandle) {
        publicProfileIdsByHandleCache.set(profileHandle, profileId);
      }
    });
}

function getAvatarFriendlyErrorMessage(error) {
  const message = String(error?.message || '');
  const normalizedMessage = message.toLowerCase();

  if (isMissingAvatarColumnError(error)) {
    return 'Нужно добавить колонку avatar_url в profiles и повторить загрузку.';
  }

  if (normalizedMessage.includes('bucket') || normalizedMessage.includes('avatars')) {
    return 'Нужно создать storage bucket avatars и политики доступа для аватаров.';
  }

  if (normalizedMessage.includes('row-level security') || normalizedMessage.includes('policy')) {
    return 'Supabase отклонил загрузку. Проверь политики Storage для bucket avatars.';
  }

  return message || 'Не удалось сохранить аватар. Попробуй ещё раз.';
}

function getPublicProfileAvatarUrl(profile) {
  const rawUrl = String(profile?.avatar_url || '').trim();

  if (!rawUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(rawUrl);

    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return parsedUrl.toString();
    }
  } catch (error) {
    return '';
  }

  return '';
}

function getUserPageAvatarLetter(displayName) {
  return String(displayName || 'H').trim().slice(0, 1).toUpperCase() || 'H';
}

function getUserPageAvatarMediaHtml(profile, displayName) {
  const avatarUrl = getPublicProfileAvatarUrl(profile);

  if (avatarUrl) {
    return `
      <img
        class="user-page-avatar user-page-avatar-image"
        data-user-page-avatar="true"
        src="${escapeHtml(avatarUrl)}"
        decoding="async"
        alt="Аватар пользователя ${escapeHtml(displayName)}"
      >
    `;
  }

  return `
    <div class="user-page-avatar" data-user-page-avatar="true" aria-hidden="true">
      ${escapeHtml(getUserPageAvatarLetter(displayName))}
    </div>
  `;
}

function getUserPageAvatarHtml(profile, displayName, canEditAvatar) {
  return `
    <div class="user-page-avatar-shell" data-user-page-avatar-shell="true" data-profile-avatar-media-slot="true">
      ${getUserPageAvatarMediaHtml(profile, displayName)}
    </div>
  `;
}

function syncUserPageAvatarControls(profile = currentUserProfile) {
  const deleteButtons = document.querySelectorAll('[data-user-page-avatar-delete="true"]');

  const hasAvatar = Boolean(getPublicProfileAvatarUrl(profile));

  deleteButtons.forEach(deleteButton => {
    deleteButton.hidden = !hasAvatar;
    deleteButton.setAttribute('aria-label', 'Удалить аватар');
    deleteButton.setAttribute('title', 'Удалить аватар');
  });
}

function syncUserPageAvatarMedia(profile = currentUserProfile) {
  const displayName = getCurrentDisplayName();
  const mediaHtml = getUserPageAvatarMediaHtml(profile, displayName).trim();

  document.querySelectorAll('[data-profile-avatar-media-slot="true"]').forEach(slot => {
    slot.innerHTML = mediaHtml;
  });

  syncUserPageAvatarControls(profile);
}

function syncProfileSettingsAvatarPreview(profile = currentUserProfile) {
  syncUserPageAvatarMedia(profile);
}

function setUserPageAvatarStatus(message = '', type = 'info') {
  document.querySelectorAll('[data-user-page-avatar-status="true"]').forEach(statusElement => {
    statusElement.textContent = message;
    statusElement.hidden = !message;
    statusElement.classList.toggle('is-error', type === 'error');
    statusElement.classList.toggle('is-success', type === 'success');
  });
}

function setUserPageAvatarSubmitting(isSubmitting) {
  document.querySelectorAll('[data-profile-avatar-media-slot="true"]').forEach(avatarShell => {
    avatarShell.classList.toggle('is-uploading', isSubmitting);
  });

  document.querySelectorAll('[data-user-page-avatar-input="true"]').forEach(avatarInput => {
    avatarInput.disabled = isSubmitting;
  });

  document.querySelectorAll('[data-user-page-avatar-delete="true"]').forEach(avatarDeleteButton => {
    avatarDeleteButton.disabled = isSubmitting;
  });
}

function getAvatarFileValidationMessage(file) {
  if (!file) {
    return 'Файл не выбран.';
  }

  const fileType = String(file.type || '').toLowerCase();
  const fileExtension = String(file.name || '').split('.').pop()?.toLowerCase() || '';

  if (!AVATAR_ACCEPTED_TYPES.has(fileType) && !AVATAR_ACCEPTED_EXTENSIONS.has(fileExtension)) {
    return 'Поддерживаются только JPG, PNG и WebP.';
  }

  if (file.size > AVATAR_SOURCE_MAX_SIZE_BYTES) {
    return 'Файл слишком большой. Максимум 10 МБ.';
  }

  return '';
}

function readAvatarSourceMetadata(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        objectUrl,
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Не удалось прочитать изображение.'));
    };

    image.src = objectUrl;
  });
}

function ensureAvatarCropModal() {
  if (avatarCropModal) {
    return;
  }

  avatarCropModal = document.createElement('div');
  avatarCropModal.id = 'avatarCropModal';
  avatarCropModal.className = 'modal avatar-crop-modal';
  avatarCropModal.innerHTML = `
    <div class="modal-backdrop" data-avatar-crop-close="true"></div>
    <div class="modal-dialog avatar-crop-dialog" role="dialog" aria-modal="true" aria-labelledby="avatarCropTitle">
      <div class="modal-header">
        <h2 id="avatarCropTitle">Настроить аватар</h2>
        <button type="button" class="modal-close-button" data-avatar-crop-close="true" aria-label="Закрыть"></button>
      </div>
      <div class="avatar-crop-frame" data-avatar-crop-frame="true">
        <img class="avatar-crop-image" data-avatar-crop-image="true" alt="">
      </div>
      <div class="avatar-crop-controls">
        <label for="avatarCropZoom">Масштаб</label>
        <input id="avatarCropZoom" type="range" min="1" max="3" step="0.01" value="1" data-avatar-crop-zoom="true">
      </div>
      <p class="avatar-crop-status" data-avatar-crop-status="true" aria-live="polite" hidden></p>
      <div class="avatar-crop-actions">
        <button type="button" data-avatar-crop-save="true">Сохранить аватар</button>
        <button type="button" class="secondary-button secondary-button-compact" data-avatar-crop-close="true">Отмена</button>
      </div>
    </div>
  `;

  document.body.appendChild(avatarCropModal);

  avatarCropFrame = avatarCropModal.querySelector('[data-avatar-crop-frame="true"]');
  avatarCropImage = avatarCropModal.querySelector('[data-avatar-crop-image="true"]');
  avatarCropZoomInput = avatarCropModal.querySelector('[data-avatar-crop-zoom="true"]');
  avatarCropStatus = avatarCropModal.querySelector('[data-avatar-crop-status="true"]');
  avatarCropSaveButton = avatarCropModal.querySelector('[data-avatar-crop-save="true"]');

  avatarCropModal.querySelectorAll('[data-avatar-crop-close="true"]').forEach(element => {
    element.addEventListener('click', closeAvatarCropModal);
  });

  avatarCropSaveButton?.addEventListener('click', saveAvatarCrop);
  avatarCropZoomInput?.addEventListener('input', handleAvatarCropZoomInput);
  avatarCropFrame?.addEventListener('pointerdown', handleAvatarCropPointerDown);
  avatarCropFrame?.addEventListener('pointermove', handleAvatarCropPointerMove);
  avatarCropFrame?.addEventListener('pointerup', handleAvatarCropPointerUp);
  avatarCropFrame?.addEventListener('pointercancel', handleAvatarCropPointerUp);
}

function setAvatarCropStatus(message = '', type = 'info') {
  if (!avatarCropStatus) {
    return;
  }

  avatarCropStatus.textContent = message;
  avatarCropStatus.hidden = !message;
  avatarCropStatus.classList.toggle('is-error', type === 'error');
  avatarCropStatus.classList.toggle('is-success', type === 'success');
}

function setAvatarCropSubmitting(isSubmitting) {
  isAvatarCropSubmitting = isSubmitting;

  if (avatarCropSaveButton) {
    avatarCropSaveButton.disabled = isSubmitting;
    avatarCropSaveButton.textContent = isSubmitting ? 'Сохраняю...' : 'Сохранить аватар';
  }

  if (avatarCropZoomInput) {
    avatarCropZoomInput.disabled = isSubmitting;
  }
}

function getAvatarCropFrameSize() {
  const rect = avatarCropFrame?.getBoundingClientRect();

  return Math.round(rect?.width || 280);
}

function getAvatarCropScale() {
  return (avatarCropState?.minScale || 1) * (avatarCropState?.zoom || 1);
}

function clampAvatarCropOffset() {
  if (!avatarCropState) {
    return;
  }

  const scale = getAvatarCropScale();
  const frameSize = avatarCropState.frameSize;
  const maxOffsetX = Math.max(0, (avatarCropState.naturalWidth * scale - frameSize) / 2);
  const maxOffsetY = Math.max(0, (avatarCropState.naturalHeight * scale - frameSize) / 2);

  avatarCropState.offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, avatarCropState.offsetX));
  avatarCropState.offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, avatarCropState.offsetY));
}

function applyAvatarCropTransform() {
  if (!avatarCropImage || !avatarCropState) {
    return;
  }

  clampAvatarCropOffset();

  const scale = getAvatarCropScale();

  avatarCropImage.style.width = `${avatarCropState.naturalWidth * scale}px`;
  avatarCropImage.style.height = `${avatarCropState.naturalHeight * scale}px`;
  avatarCropImage.style.transform = `translate(-50%, -50%) translate(${avatarCropState.offsetX}px, ${avatarCropState.offsetY}px)`;
}

function resetAvatarCropState() {
  if (!avatarCropImage || !avatarCropState) {
    return;
  }

  const frameSize = getAvatarCropFrameSize();

  avatarCropState.frameSize = frameSize;
  avatarCropState.minScale = Math.max(
    frameSize / avatarCropState.naturalWidth,
    frameSize / avatarCropState.naturalHeight
  );
  avatarCropState.zoom = 1;
  avatarCropState.offsetX = 0;
  avatarCropState.offsetY = 0;

  if (avatarCropZoomInput) {
    avatarCropZoomInput.value = '1';
  }

  applyAvatarCropTransform();
}

function handleAvatarCropZoomInput() {
  if (!avatarCropState || !avatarCropZoomInput) {
    return;
  }

  avatarCropState.zoom = Number(avatarCropZoomInput.value) || 1;
  applyAvatarCropTransform();
}

function handleAvatarCropPointerDown(event) {
  if (!avatarCropState || isAvatarCropSubmitting) {
    return;
  }

  isAvatarCropDragging = true;
  avatarCropDragStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    offsetX: avatarCropState.offsetX,
    offsetY: avatarCropState.offsetY
  };

  avatarCropFrame?.setPointerCapture?.(event.pointerId);
  avatarCropFrame?.classList.add('is-dragging');
}

function handleAvatarCropPointerMove(event) {
  if (!isAvatarCropDragging || !avatarCropState || !avatarCropDragStart) {
    return;
  }

  avatarCropState.offsetX = avatarCropDragStart.offsetX + event.clientX - avatarCropDragStart.x;
  avatarCropState.offsetY = avatarCropDragStart.offsetY + event.clientY - avatarCropDragStart.y;
  applyAvatarCropTransform();
}

function handleAvatarCropPointerUp(event) {
  if (!isAvatarCropDragging) {
    return;
  }

  isAvatarCropDragging = false;
  avatarCropFrame?.releasePointerCapture?.(event.pointerId);
  avatarCropFrame?.classList.remove('is-dragging');
  avatarCropDragStart = null;
}

function closeAvatarCropModal(options = {}) {
  if (!avatarCropModal || (isAvatarCropSubmitting && !options.force)) {
    return;
  }

  avatarCropModal.classList.remove('is-open');
  setAvatarCropStatus();
  avatarCropState = null;
  isAvatarCropDragging = false;
  avatarCropDragStart = null;

  if (avatarCropImage) {
    avatarCropImage.removeAttribute('src');
    avatarCropImage.removeAttribute('style');
  }

  if (avatarCropSourceUrl) {
    URL.revokeObjectURL(avatarCropSourceUrl);
    avatarCropSourceUrl = '';
  }

  syncBodyScrollLock();
}

async function openAvatarCropModalFromFile(file) {
  const validationMessage = getAvatarFileValidationMessage(file);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const metadata = await readAvatarSourceMetadata(file);

  if (metadata.width < AVATAR_MIN_SOURCE_SIDE || metadata.height < AVATAR_MIN_SOURCE_SIDE) {
    URL.revokeObjectURL(metadata.objectUrl);
    throw new Error('Изображение слишком маленькое. Минимум 256×256 пикселей.');
  }

  ensureAvatarCropModal();
  closeAvatarCropModal();

  avatarCropSourceUrl = metadata.objectUrl;
  avatarCropState = {
    naturalWidth: metadata.width,
    naturalHeight: metadata.height,
    frameSize: 280,
    minScale: 1,
    zoom: 1,
    offsetX: 0,
    offsetY: 0
  };

  avatarCropImage.src = avatarCropSourceUrl;
  avatarCropModal.classList.add('is-open');
  syncBodyScrollLock();
  setAvatarCropStatus();
  setAvatarCropSubmitting(false);

  requestAnimationFrame(resetAvatarCropState);
}

function renderAvatarCropBlob() {
  return new Promise((resolve, reject) => {
    if (!avatarCropImage || !avatarCropState) {
      reject(new Error('Изображение для аватара не найдено.'));
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Браузер не смог подготовить изображение.'));
      return;
    }

    const frameSize = avatarCropState.frameSize || getAvatarCropFrameSize();
    const outputScale = AVATAR_OUTPUT_SIZE / frameSize;
    const imageScale = getAvatarCropScale() * outputScale;

    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;

    context.fillStyle = '#0d1117';
    context.fillRect(0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
    context.translate(
      AVATAR_OUTPUT_SIZE / 2 + avatarCropState.offsetX * outputScale,
      AVATAR_OUTPUT_SIZE / 2 + avatarCropState.offsetY * outputScale
    );
    context.drawImage(
      avatarCropImage,
      -avatarCropState.naturalWidth * imageScale / 2,
      -avatarCropState.naturalHeight * imageScale / 2,
      avatarCropState.naturalWidth * imageScale,
      avatarCropState.naturalHeight * imageScale
    );

    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Не удалось подготовить файл аватара.'));
      }
    }, AVATAR_OUTPUT_TYPE, AVATAR_OUTPUT_QUALITY);
  });
}

function extractAvatarStoragePath(publicUrl) {
  if (!publicUrl) {
    return null;
  }

  let parsedUrl = null;

  try {
    parsedUrl = new URL(publicUrl);
  } catch (error) {
    return null;
  }

  const path = parsedUrl.pathname;

  if (!path.includes(AVATAR_STORAGE_PUBLIC_PATH)) {
    return null;
  }

  return path.split(AVATAR_STORAGE_PUBLIC_PATH)[1] || null;
}

async function uploadAvatarBlob(blob) {
  const user = ensureActiveSessionForWrite();
  const storagePath = `${user.id}/avatar-${Date.now()}.jpg`;
  const { error: uploadError } = await supabaseClient.storage
    .from(AVATAR_STORAGE_BUCKET)
    .upload(storagePath, blob, {
      cacheControl: '31536000',
      contentType: AVATAR_OUTPUT_TYPE,
      upsert: false
    });

  throwIfSupabaseError(uploadError);

  const { data } = supabaseClient.storage
    .from(AVATAR_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return data?.publicUrl || '';
}

async function deleteAvatarFileByUrl(publicUrl) {
  const storagePath = extractAvatarStoragePath(publicUrl);

  if (!storagePath) {
    return;
  }

  const { error } = await supabaseClient.storage
    .from(AVATAR_STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.warn('Не удалось удалить старый аватар:', error);
  }
}

async function deleteCurrentUserAvatar() {
  if (isAvatarCropSubmitting) {
    return;
  }

  const previousAvatarUrl = getPublicProfileAvatarUrl(currentUserProfile);

  if (!previousAvatarUrl) {
    setUserPageAvatarStatus('Аватар уже удалён.', 'info');
    syncUserPageAvatarControls(currentUserProfile);
    return;
  }

  try {
    ensureActiveSessionForWrite();
    setUserPageAvatarSubmitting(true);
    setUserPageAvatarStatus('Удаляю аватар...');

    const { error } = await supabaseClient
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', currentUser.id);

    throwIfSupabaseError(error);

    currentUserProfile = {
      ...(currentUserProfile || {}),
      avatar_url: null
    };
    cachePublicProfileRows([{ id: currentUser.id, ...currentUserProfile }]);

    syncUserPageOwnProfileIdentity();
    setUserPageAvatarStatus('Аватар удалён.', 'success');
    deleteAvatarFileByUrl(previousAvatarUrl);
  } catch (error) {
    const message = getAvatarFriendlyErrorMessage(error);

    console.error('Ошибка удаления аватара:', error);
    setUserPageAvatarStatus(message, 'error');
  } finally {
    setUserPageAvatarSubmitting(false);
  }
}

async function saveAvatarCrop() {
  if (isAvatarCropSubmitting) {
    return;
  }

  let uploadedAvatarUrl = '';

  try {
    ensureActiveSessionForWrite();
    setAvatarCropSubmitting(true);
    setUserPageAvatarSubmitting(true);
    setAvatarCropStatus('Сохраняю аватар...');
    setUserPageAvatarStatus('Сохраняю аватар...');

    const previousAvatarUrl = getPublicProfileAvatarUrl(currentUserProfile);
    const avatarBlob = await renderAvatarCropBlob();
    const avatarUrl = await uploadAvatarBlob(avatarBlob);
    uploadedAvatarUrl = avatarUrl;

    if (!avatarUrl) {
      throw new Error('Supabase не вернул публичную ссылку на аватар.');
    }

    const { error } = await supabaseClient
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', currentUser.id);

    throwIfSupabaseError(error);

    currentUserProfile = {
      ...(currentUserProfile || {}),
      avatar_url: avatarUrl
    };
    cachePublicProfileRows([{ id: currentUser.id, ...currentUserProfile }]);

    syncUserPageOwnProfileIdentity();
    closeAvatarCropModal({ force: true });
    setUserPageAvatarStatus('Аватар обновлён.', 'success');

    if (previousAvatarUrl && previousAvatarUrl !== avatarUrl) {
      deleteAvatarFileByUrl(previousAvatarUrl);
    }
  } catch (error) {
    const message = getAvatarFriendlyErrorMessage(error);

    console.error('Ошибка сохранения аватара:', error);

    if (uploadedAvatarUrl) {
      deleteAvatarFileByUrl(uploadedAvatarUrl);
    }

    setAvatarCropStatus(message, 'error');
    setUserPageAvatarStatus(message, 'error');
  } finally {
    setAvatarCropSubmitting(false);
    setUserPageAvatarSubmitting(false);
  }
}

function handleUserPageAvatarDeleteClick(event) {
  const deleteButton = event.target?.closest?.('[data-user-page-avatar-delete="true"]');

  if (!deleteButton || deleteButton.hidden) {
    return false;
  }

  event.preventDefault();
  armDeleteMovieButton(deleteButton, deleteCurrentUserAvatar, 'Удалить аватар?');

  return true;
}

async function handleUserPageAvatarFileChange(event) {
  const input = event.target?.closest?.('[data-user-page-avatar-input="true"]');

  if (!input) {
    return;
  }

  const file = input.files?.[0] || null;

  input.value = '';

  if (!file) {
    return;
  }

  try {
    setUserPageAvatarStatus();
    await openAvatarCropModalFromFile(file);
  } catch (error) {
    console.error('Ошибка выбора аватара:', error);
    setUserPageAvatarStatus(error.message || 'Не удалось открыть изображение.', 'error');
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

function hasSavedCatalogReturnPosition() {
  try {
    return Boolean(
      sessionStorage.getItem(CATALOG_ANCHOR_MOVIE_ID_KEY) !== null ||
      sessionStorage.getItem(CATALOG_SCROLL_POSITION_KEY) !== null
    );
  } catch (error) {
    console.warn('Ошибка проверки сохранённой позиции каталога:', error);
    return false;
  }
}

function markCatalogFastReturnPending() {
  try {
    sessionStorage.setItem(CATALOG_FAST_RETURN_PENDING_KEY, '1');
  } catch (error) {
    console.warn('Ошибка сохранения признака быстрого возврата в каталог:', error);
  }
}

function consumeCatalogFastReturnPending() {
  try {
    const hasPendingFastReturn = sessionStorage.getItem(CATALOG_FAST_RETURN_PENDING_KEY) === '1';

    sessionStorage.removeItem(CATALOG_FAST_RETURN_PENDING_KEY);

    return hasPendingFastReturn;
  } catch (error) {
    console.warn('Ошибка чтения признака быстрого возврата в каталог:', error);
    return false;
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
    dataMutationStamp: getDataMutationStamp(),
    savedAt: Date.now(),
    userId: currentUser?.id || null,
    preferRussianPosters: shouldPreferRussianPosters(),
    movies: allMovies,
    movieRatings: getCurrentUserMovieRatingSnapshotRows(),
    movieRatingStats: getMovieRatingStatsSnapshotRows(),
    movieWatchlist: allMovieWatchlist,
    reviewedMovieIds: Array.from(catalogReviewedMovieIds)
  };
}

function canUseCatalogSnapshotForPosterPreference(snapshot) {
  return Boolean(snapshot?.preferRussianPosters) === shouldPreferRussianPosters();
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
    dataMutationStamp: snapshot.dataMutationStamp || '',
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

function getDataMutationStamp() {
  try {
    return localStorage.getItem(DATA_MUTATION_STAMP_KEY) || '';
  } catch (error) {
    return '';
  }
}

function markLocalDataMutation(scope = 'data') {
  invalidateMovieSelectRowsCache();

  try {
    const stamp = `${Date.now().toString(36)}:${String(scope || 'data')}:${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(DATA_MUTATION_STAMP_KEY, stamp);
    invalidateUserPageActivityAggregateRowsCache();
    return stamp;
  } catch (error) {
    invalidateUserPageActivityAggregateRowsCache();
    return '';
  }
}

function isDataMutationStampFresh(stamp) {
  return String(stamp || '') === getDataMutationStamp();
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
      !isDataMutationStampFresh(snapshot?.dataMutationStamp) ||
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

function createMoviePageSessionCacheEntry(movie) {
  return movieDetailCacheController?.createEntry(movie) || null;
}

function writeMoviePageSessionCacheEntry(entry) {
  return movieDetailCacheController?.writeEntry(entry) || '';
}

function removeMoviePageSessionCacheForMovie(movie) {
  movieDetailCacheController?.removeForMovie(movie);
}

function getMoviePageSessionCacheEntry(routeParams) {
  return movieDetailCacheController?.getEntry(routeParams) || null;
}

function applyMoviePageSessionCacheEntry(entry) {
  const movie = entry?.movie;

  if (!movie?.id) {
    return null;
  }

  const movieId = String(movie.id);

  if (entry.movieRatingStats) {
    upsertMovieRatingStatsRows([entry.movieRatingStats], [movieId]);
  } else {
    upsertMovieRatingStatsRows([], [movieId]);
  }

  upsertKnownMovieRatingRows(
    entry.movieRatings || [],
    row => String(row?.movie_id || '') === movieId
  );

  allMovieWatchlist = allMovieWatchlist.filter(row => String(row?.movie_id || '') !== movieId);
  allMovieWatchlist.push(...(Array.isArray(entry.movieWatchlist) ? entry.movieWatchlist : []));
  rebuildCurrentUserWatchlistIndex();

  allMovieReviews = allMovieReviews.filter(review => String(review?.movie_id || '') !== movieId);
  allMovieReviews.push(...(Array.isArray(entry.movieReviews) ? entry.movieReviews : []));

  allMovieComments = allMovieComments.filter(comment => String(comment?.movie_id || '') !== movieId);
  allMovieComments.push(...(Array.isArray(entry.movieComments) ? entry.movieComments : []));

  setMoviePosterImagesCache(movieId, entry.posterImages || []);

  currentMoviePageSimilarMovieId = String(entry.similarMovieId || movieId);
  currentMoviePageSimilarMovieIds = Array.isArray(entry.similarMovieIds) ? entry.similarMovieIds : [];
  currentMoviePageSimilarMovies = Array.isArray(entry.similarMovies) ? entry.similarMovies : [];
  activeMoviePageSessionCacheSignature = entry.signature ||
    movieDetailCacheController?.getEntrySignature(entry) ||
    '';

  renderMoviePage(movie);
  return movie;
}

function restoreMoviePageFromSessionCache(routeParams) {
  const entry = getMoviePageSessionCacheEntry(routeParams);

  if (!entry) {
    return null;
  }

  return applyMoviePageSessionCacheEntry(entry);
}

function persistCurrentMoviePageSessionCache() {
  if (!isMoviePage() || !currentMoviePageMovieData?.id) {
    return '';
  }

  const entry = createMoviePageSessionCacheEntry(currentMoviePageMovieData);
  const signature = writeMoviePageSessionCacheEntry(entry);

  if (signature) {
    activeMoviePageSessionCacheSignature = signature;
  }

  return signature;
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
    preferRussianPosters: shouldPreferRussianPosters(),
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
  if (!snapshot || !canUseCatalogSnapshotForPosterPreference(snapshot)) {
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

function bindMoviePosterLoadStates(root = document) {
  if (!root) {
    return;
  }

  root.querySelectorAll?.('.movie-poster').forEach(posterImage => {
    const posterSkeleton = posterImage
      .closest('.movie-poster-wrapper')
      ?.querySelector('.movie-poster-skeleton');

    bindPosterLoadState(posterImage, posterSkeleton);
  });
}

function bindRestoredCatalogPosterLoadStates() {
  bindMoviePosterLoadStates(container);
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
  const hasSamePosterPreference = canUseCatalogSnapshotForPosterPreference(domSnapshot);
  const hasSameData = domSnapshot.dataSignatureHash === getCatalogDataSignatureHash(sessionSnapshot);
  const hasSameRenderState = domSnapshot.renderStateSignature === getCatalogRenderStateSignature();

  if (!isSameUser || !hasSamePosterPreference || !hasSameData || !hasSameRenderState) {
    return false;
  }

  renderActiveFilterChips();
  syncQuickPresetButtons();

  const {
    filteredTotal,
    paginationState,
    pageMovies,
    selectedSortMode,
    filterState
  } = getCatalogDerivedState();

  showMoviesResultCount(domSnapshot.moviesResultCountText || getMoviesResultCountText(
    paginationState.totalItems,
    paginationState
  ));

  updateCatalogStructuredData(pageMovies, paginationState);
  renderCatalogPagination(paginationState);
  container.classList.remove('is-catalog-fading', 'is-catalog-visible');
  setCatalogBusyState(false);
  container.innerHTML = domSnapshot.containerHtml;
  lastCatalogDomRenderSignature = getCatalogDomRenderSignature({
    filteredTotal,
    paginationState,
    pageMovies,
    selectedSortMode,
    filterState
  });
  bindRestoredCatalogDomState();

  return true;
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
  lastCatalogDomRenderSignature = '';
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

function saveCatalogStateAndRender(renderCallback = renderMovies, options = {}) {
  saveCatalogState(options);
  scheduleCatalogRender(renderCallback);
}

function renderCatalogAndRestoreScrollPosition() {
  renderMovies();
  restoreCatalogScrollPosition();
}

function rerenderCatalogPreservingPosition(options = {}) {
  saveCatalogScrollPosition();
  saveCatalogAnchorMovieId();
  saveCatalogStateAndRender(renderCatalogAndRestoreScrollPosition, options);
}

function createDebouncedCatalogRender(delay) {
  return debounce(renderCatalogAndRestoreScrollPosition, delay);
}

function prepareCatalogStateForDeferredRender({ resetPage = false, urlMode = 'replace' } = {}) {
  if (resetPage) {
    resetCatalogPaginationPage();
  }

  saveCatalogScrollPosition();
  saveCatalogAnchorMovieId();
  saveCatalogState({ urlMode });
}

function applyCatalogViewModeChange() {
  resetCatalogPaginationPage();
  syncCatalogViewToggleButton();
  rerenderCatalogPreservingPosition();
}

function getDefaultCatalogState() {
  return {
    searchQuery: '',
    genre: '',
    subgenre: '',
    format: '',
    country: '',
    ratingFrom: '',
    ratingTo: '',
    yearFrom: '',
    yearTo: '',
    runtimeFrom: '',
    runtimeTo: '',
    withReviews: false,
    watchlist: '',
    watched: '',
    viewMode: 'list',
    sortMode: 'default',
    page: 1,
    profileHandle: '',
    profileActivity: ''
  };
}

function getCatalogProfileActivityLabel(activityKey = catalogProfileActivityKey) {
  return CATALOG_PROFILE_ACTIVITY_LABELS[activityKey] || '';
}

function isCatalogProfileActivityActive() {
  return Boolean(catalogProfileActivityHandle && catalogProfileActivityKey);
}

function normalizeCatalogProfileActivityKey(activityKey) {
  const normalizedActivityKey = String(activityKey || '').trim();

  return CATALOG_PROFILE_ACTIVITY_KEYS.has(normalizedActivityKey)
    ? normalizedActivityKey
    : '';
}

function resetCatalogProfileActivityData() {
  catalogProfileActivityUserId = '';
  catalogProfileActivityDisplayName = '';
  catalogProfileActivityMovieIds = new Set();
  catalogProfileActivityRatingsByMovieId = new Map();
  catalogProfileActivityLoaded = false;
  catalogProfileActivityLoadingPromise = null;
  catalogProfileActivityError = null;
}

function setCatalogProfileActivitySelection(profileHandle, activityKey) {
  const normalizedHandle = String(profileHandle || '').trim();
  const normalizedActivityKey = normalizeCatalogProfileActivityKey(activityKey);
  const shouldActivate = Boolean(normalizedHandle && normalizedActivityKey);
  const nextHandle = shouldActivate ? normalizedHandle : '';
  const nextActivityKey = shouldActivate ? normalizedActivityKey : '';

  if (
    catalogProfileActivityHandle === nextHandle &&
    catalogProfileActivityKey === nextActivityKey
  ) {
    return;
  }

  catalogProfileActivityHandle = nextHandle;
  catalogProfileActivityKey = nextActivityKey;
  resetCatalogProfileActivityData();
  invalidateCatalogDerivedState({ bumpDataVersion: true });
}

function clearCatalogProfileActivitySelection() {
  setCatalogProfileActivitySelection('', '');
}

function getCatalogProfileActivityChipLabel() {
  if (!isCatalogProfileActivityActive()) {
    return '';
  }

  const activityLabel = getCatalogProfileActivityLabel();
  const displayName = catalogProfileActivityDisplayName || catalogProfileActivityHandle;

  return `${activityLabel} · ${displayName}`;
}

function getCatalogProfileActivityMatchSet() {
  return isCatalogProfileActivityActive() && catalogProfileActivityLoaded
    ? catalogProfileActivityMovieIds
    : null;
}

function shouldShowCatalogProfileRatingContext() {
  if (
    !isCatalogProfileActivityActive() ||
    !catalogProfileActivityLoaded ||
    catalogProfileActivityKey !== 'ratings' ||
    catalogProfileActivityRatingsByMovieId.size === 0
  ) {
    return false;
  }

  const currentUserId = currentUser?.id ? String(currentUser.id) : '';

  return !currentUserId || String(catalogProfileActivityUserId) !== currentUserId;
}

function getCatalogProfileRating(movieId) {
  if (!shouldShowCatalogProfileRatingContext()) {
    return null;
  }

  const rating = Number(catalogProfileActivityRatingsByMovieId.get(String(movieId)));

  return Number.isFinite(rating) ? rating : null;
}

function getCatalogProfileRatingHtml(movieId) {
  const rating = getCatalogProfileRating(movieId);

  if (rating === null) {
    return '';
  }

  const displayName = catalogProfileActivityDisplayName || catalogProfileActivityHandle || 'зрителя';

  return `
    <div class="movie-profile-rating" title="Оценка ${escapeHtml(displayName)}: ${escapeHtml(String(rating))} из 10" aria-label="Оценка ${escapeHtml(displayName)}: ${escapeHtml(String(rating))} из 10">
      <span class="movie-profile-rating-label">Оценка ${escapeHtml(displayName)}</span>
      <span class="movie-profile-rating-value">${escapeHtml(String(rating))} ★</span>
    </div>
  `;
}

function getCurrentCatalogStateForPersistence() {
  return {
    searchQuery: searchInput.value,
    genre: genreFilter.value,
    subgenre: subgenreFilter.value,
    format: formatFilter.value,
    country: countryFilter.value,
    ratingFrom: getCatalogRangeControlValue(ratingFromFilter, getCatalogRangeInputOptions('rating')),
    ratingTo: getCatalogRangeControlValue(ratingToFilter, getCatalogRangeInputOptions('rating')),
    yearFrom: getCatalogRangeControlValue(yearFromFilter, getCatalogRangeInputOptions('year')),
    yearTo: getCatalogRangeControlValue(yearToFilter, getCatalogRangeInputOptions('year')),
    runtimeFrom: getCatalogRangeControlValue(runtimeFromFilter, getCatalogRangeInputOptions('runtime')),
    runtimeTo: getCatalogRangeControlValue(runtimeToFilter, getCatalogRangeInputOptions('runtime')),
    withReviews: reviewedOnlyFilter,
    watchlist: currentUser ? watchlistFilter.value : '',
    watched: currentUser ? watchedFilter.value : '',
    viewMode: viewMode.value,
    sortMode: sortMode.value,
    page: currentCatalogPage
  };
}

function hasCatalogUrlStateParams(searchParams = new URLSearchParams(window.location.search)) {
  return Array.from(CATALOG_URL_STATE_PARAMS).some(paramName => searchParams.has(paramName));
}

function getSelectOptionValue(selectElement, value, fallbackValue = '') {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue || !selectElement) {
    return fallbackValue;
  }

  return Array.from(selectElement.options).some(option => option.value === normalizedValue)
    ? normalizedValue
    : fallbackValue;
}

function getCatalogRangeFilterConfig(rangeKey) {
  return CATALOG_RANGE_FILTER_CONFIGS[rangeKey] || null;
}

function getCatalogRangeFilterConfigs() {
  return CATALOG_RANGE_FILTER_KEYS
    .map(getCatalogRangeFilterConfig)
    .filter(Boolean);
}

function getCatalogMovieYearFilterValue(movie) {
  const publicYear = Number(movie?.year);

  if (Number.isInteger(publicYear) && publicYear > 1900) {
    return publicYear;
  }

  const releaseYear = Number(movie?.release_year);

  return Number.isInteger(releaseYear) && releaseYear > 1900 ? releaseYear : null;
}

function roundCatalogRangeValueToStep(value, config, direction = 'nearest') {
  const step = Number(config?.step || 1);
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || !Number.isFinite(step) || step <= 0) {
    return numericValue;
  }

  const scaledValue = numericValue / step;
  const roundedValue = direction === 'floor'
    ? Math.floor(scaledValue) * step
    : direction === 'ceil'
      ? Math.ceil(scaledValue) * step
      : Math.round(scaledValue) * step;

  return normalizeCatalogRangeNumberPrecision(roundedValue, config);
}

function normalizeCatalogRangeNumberPrecision(value, config) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return numericValue;
  }

  return config?.allowDecimal
    ? Number(numericValue.toFixed(1))
    : Math.trunc(numericValue);
}

function formatCatalogRangeControlValue(value, config) {
  const numericValue = normalizeCatalogRangeNumberPrecision(value, config);

  if (!Number.isFinite(numericValue)) {
    return '';
  }

  return config?.allowDecimal
    ? String(Number(numericValue.toFixed(1))).replace(/\.0$/, '')
    : String(Math.trunc(numericValue));
}

function getCatalogRangeActualBounds(config) {
  if (!config) {
    return { min: 0, max: 0 };
  }

  if (config.useFixedBounds) {
    return {
      min: config.defaultMin,
      max: config.defaultMax
    };
  }

  const values = [];

  (Array.isArray(allMovies) ? allMovies : []).forEach(movie => {
    const value = Number(config.getMovieValue?.(movie));

    if (Number.isFinite(value)) {
      values.push(value);
    }
  });

  if (values.length === 0) {
    return {
      min: config.defaultMin,
      max: config.defaultMax
    };
  }

  const minValue = Math.max(
    config.defaultMin,
    roundCatalogRangeValueToStep(Math.min(...values), config, 'floor')
  );
  const maxValue = Math.min(
    config.defaultMax,
    roundCatalogRangeValueToStep(Math.max(...values), config, 'ceil')
  );

  return {
    min: Math.min(minValue, maxValue),
    max: Math.max(minValue, maxValue)
  };
}

function getCatalogRangeInputOptions(rangeKey) {
  const config = getCatalogRangeFilterConfig(rangeKey);
  const bounds = getCatalogRangeActualBounds(config);

  return {
    min: bounds.min,
    max: bounds.max,
    allowDecimal: Boolean(config?.allowDecimal)
  };
}

function clampCatalogRangeNumber(value, config, bounds = getCatalogRangeActualBounds(config)) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  const roundedValue = roundCatalogRangeValueToStep(numericValue, config);

  return Math.min(bounds.max, Math.max(bounds.min, roundedValue));
}

function setCatalogRangeInputValue(inputElement, value, config) {
  if (!inputElement) {
    return;
  }

  inputElement.value = value === null || value === undefined || value === ''
    ? ''
    : formatCatalogRangeControlValue(value, config);
}

function setCatalogRangeElementBounds(element, bounds, config) {
  if (!element || !config || !bounds) {
    return;
  }

  element.min = formatCatalogRangeControlValue(bounds.min, config);
  element.max = formatCatalogRangeControlValue(bounds.max, config);
  element.step = String(config.step || 1);
}

function getCatalogRangeInputNumber(inputElement, config, bounds) {
  const normalizedValue = normalizeCatalogRangeValue(inputElement?.value, {
    min: bounds.min,
    max: bounds.max,
    allowDecimal: Boolean(config?.allowDecimal)
  });

  return normalizedValue === '' ? null : Number(normalizedValue);
}

function normalizeCatalogRangeInputs(config, changedBound = null) {
  if (!config?.fromInput || !config?.toInput) {
    return;
  }

  const bounds = getCatalogRangeActualBounds(config);
  let from = getCatalogRangeInputNumber(config.fromInput, config, bounds);
  let to = getCatalogRangeInputNumber(config.toInput, config, bounds);

  if (config.fromInput.value.trim() && from === null) {
    from = bounds.min;
  }

  if (config.toInput.value.trim() && to === null) {
    to = bounds.max;
  }

  if (from !== null) {
    from = clampCatalogRangeNumber(from, config, bounds);
  }

  if (to !== null) {
    to = clampCatalogRangeNumber(to, config, bounds);
  }

  if (from !== null && to !== null && from > to) {
    const step = Number(config.step || 1);

    if (changedBound === 'to') {
      to = clampCatalogRangeNumber(from + step, config, bounds);

      if (to < from) {
        to = from;
      }
    } else {
      from = clampCatalogRangeNumber(to - step, config, bounds);

      if (from > to) {
        from = to;
      }
    }
  }

  setCatalogRangeInputValue(config.fromInput, from, config);
  setCatalogRangeInputValue(config.toInput, to, config);
  syncCatalogRangeSlider(config);
}

function syncCatalogRangeSlider(config) {
  if (!config?.fromSlider || !config?.toSlider) {
    return;
  }

  const bounds = getCatalogRangeActualBounds(config);

  [config.fromInput, config.toInput, config.fromSlider, config.toSlider].forEach(element => {
    setCatalogRangeElementBounds(element, bounds, config);
  });

  const from = getCatalogRangeInputNumber(config.fromInput, config, bounds);
  const to = getCatalogRangeInputNumber(config.toInput, config, bounds);
  const effectiveFrom = from === null ? bounds.min : from;
  const effectiveTo = to === null ? bounds.max : to;

  config.fromSlider.value = formatCatalogRangeControlValue(effectiveFrom, config);
  config.toSlider.value = formatCatalogRangeControlValue(effectiveTo, config);

  const range = bounds.max - bounds.min;
  const startPercent = range > 0 ? ((effectiveFrom - bounds.min) / range) * 100 : 0;
  const endPercent = range > 0 ? ((effectiveTo - bounds.min) / range) * 100 : 100;

  if (config.fillElement) {
    config.fillElement.style.setProperty('--range-start', `${Math.max(0, Math.min(100, startPercent))}%`);
    config.fillElement.style.setProperty('--range-end', `${Math.max(0, Math.min(100, endPercent))}%`);
  }
}

function refreshCatalogRangeControls() {
  getCatalogRangeFilterConfigs().forEach(config => {
    const bounds = getCatalogRangeActualBounds(config);

    setCatalogRangeElementBounds(config.fromInput, bounds, config);
    setCatalogRangeElementBounds(config.toInput, bounds, config);
    setCatalogRangeElementBounds(config.fromSlider, bounds, config);
    setCatalogRangeElementBounds(config.toSlider, bounds, config);

    if (config.fromInput) {
      config.fromInput.placeholder = `От ${formatCatalogRangeControlValue(bounds.min, config)}`;
    }

    if (config.toInput) {
      config.toInput.placeholder = `До ${formatCatalogRangeControlValue(bounds.max, config)}`;
    }

    normalizeCatalogRangeInputs(config);
  });
}

function getCatalogRangeConfigByElement(element) {
  return getCatalogRangeFilterConfigs().find(config => (
    config.fromInput === element ||
    config.toInput === element ||
    config.fromSlider === element ||
    config.toSlider === element
  )) || null;
}

function getCatalogRangeChangedBound(config, element) {
  if (!config || !element) {
    return null;
  }

  return element === config.fromInput || element === config.fromSlider ? 'from' : 'to';
}

function shouldDeferCatalogRangeInputNormalization(config, changedBound) {
  if (!config || !changedBound) {
    return false;
  }

  const bounds = getCatalogRangeActualBounds(config);
  const changedInput = changedBound === 'from' ? config.fromInput : config.toInput;
  const otherInput = changedBound === 'from' ? config.toInput : config.fromInput;
  const rawValue = String(changedInput?.value || '').trim().replace(',', '.');

  if (!rawValue) {
    return false;
  }

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return true;
  }

  if (numericValue < bounds.min || numericValue > bounds.max) {
    return true;
  }

  const otherValue = getCatalogRangeInputNumber(otherInput, config, bounds);

  return (
    otherValue !== null &&
    (
      (changedBound === 'from' && numericValue > otherValue) ||
      (changedBound === 'to' && numericValue < otherValue)
    )
  );
}

function handleCatalogRangeInputChange(event) {
  const config = getCatalogRangeConfigByElement(event.target);

  if (!config) {
    return;
  }

  const changedBound = getCatalogRangeChangedBound(config, event.target);

  if (event.type === 'input' && shouldDeferCatalogRangeInputNormalization(config, changedBound)) {
    syncCatalogRangeSlider(config);
    return;
  }

  normalizeCatalogRangeInputs(config, changedBound);
  handleFiltersChange();
}

function handleCatalogRangeSliderInput(event) {
  const config = getCatalogRangeConfigByElement(event.target);

  if (!config) {
    return;
  }

  const changedBound = getCatalogRangeChangedBound(config, event.target);
  const bounds = getCatalogRangeActualBounds(config);
  const sliderValue = clampCatalogRangeNumber(event.target.value, config, bounds);

  if (changedBound === 'from') {
    setCatalogRangeInputValue(config.fromInput, sliderValue, config);
  } else {
    setCatalogRangeInputValue(config.toInput, sliderValue, config);
  }

  normalizeCatalogRangeInputs(config, changedBound);
  handleFiltersChange();
}

function normalizeCatalogRangeValue(value, {
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  allowDecimal = false
} = {}) {
  const normalizedValue = String(value ?? '').trim().replace(',', '.');

  if (!normalizedValue) {
    return '';
  }

  const numericValue = Number(normalizedValue);

  if (
    !Number.isFinite(numericValue) ||
    numericValue < min ||
    numericValue > max ||
    (!allowDecimal && !Number.isInteger(numericValue))
  ) {
    return '';
  }

  return allowDecimal
    ? String(Number(numericValue.toFixed(1))).replace(/\.0$/, '')
    : String(Math.trunc(numericValue));
}

function getCatalogRangeControlValue(inputElement, options) {
  return normalizeCatalogRangeValue(inputElement?.value, options);
}

function setCatalogRangeControlValue(inputElement, value, options) {
  if (!inputElement) {
    return;
  }

  inputElement.value = normalizeCatalogRangeValue(value, options);
}

function getCatalogRangeBounds(fromValue, toValue, options) {
  const normalizedFromValue = normalizeCatalogRangeValue(fromValue, options);
  const normalizedToValue = normalizeCatalogRangeValue(toValue, options);
  let from = normalizedFromValue === '' ? null : Number(normalizedFromValue);
  let to = normalizedToValue === '' ? null : Number(normalizedToValue);

  if (from !== null && to !== null && from > to) {
    [from, to] = [to, from];
  }

  return {
    from,
    to,
    hasRange: from !== null || to !== null
  };
}

function formatCatalogRangeLabel(label, fromValue, toValue, {
  valueFormatter = value => String(value)
} = {}) {
  const hasFrom = fromValue !== null && fromValue !== undefined && fromValue !== '';
  const hasTo = toValue !== null && toValue !== undefined && toValue !== '';

  if (hasFrom && hasTo) {
    return `${label}: ${valueFormatter(fromValue)} - ${valueFormatter(toValue)}`;
  }

  if (hasFrom) {
    return `${label}: от ${valueFormatter(fromValue)}`;
  }

  if (hasTo) {
    return `${label}: до ${valueFormatter(toValue)}`;
  }

  return '';
}

function getCatalogUrlValueAlias(paramName, value) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    return '';
  }

  if (!CATALOG_URL_VALUE_ALIASES[paramName]) {
    return normalizedValue;
  }

  return CATALOG_URL_VALUE_ALIASES[paramName][normalizedValue]
    || slugifyMovieValue(normalizedValue)
    || normalizedValue;
}

function getCatalogUrlValueByAlias(paramName, value, selectElement = null) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    return '';
  }

  if (
    selectElement &&
    Array.from(selectElement.options).some(option => option.value === normalizedValue)
  ) {
    return normalizedValue;
  }

  const aliasedValue = CATALOG_URL_VALUE_ALIAS_LOOKUPS[paramName]?.[normalizedValue];

  if (aliasedValue) {
    return aliasedValue;
  }

  if (selectElement) {
    const matchingOption = Array.from(selectElement.options)
      .find(option => getCatalogUrlValueAlias(paramName, option.value) === normalizedValue);

    if (matchingOption) {
      return matchingOption.value;
    }
  }

  return normalizedValue;
}

function getCatalogUrlBooleanValue(value) {
  return CATALOG_URL_TRUE_VALUES.has(String(value || '').trim().toLowerCase());
}

function readCatalogUrlState() {
  const searchParams = new URLSearchParams(window.location.search);

  if (!hasCatalogUrlStateParams(searchParams)) {
    return null;
  }

  const catalogState = getDefaultCatalogState();
  const presetKey = String(searchParams.get(CATALOG_PRESET_QUERY_PARAM) || '').trim();
  const hasValidPreset = CATALOG_ROUTE_PRESET_KEYS.has(presetKey);
  const searchQuery = searchParams.has('q')
    ? searchParams.get('q')
    : searchParams.get('search');

  if (!hasValidPreset) {
    catalogState.searchQuery = String(searchQuery || '').trim();
    catalogState.genre = getCatalogUrlValueByAlias('genre', searchParams.get('genre'), genreFilter);
    catalogState.subgenre = getCatalogUrlValueByAlias('subgenre', searchParams.get('subgenre'), subgenreFilter);
    catalogState.format = getCatalogUrlValueByAlias('format', searchParams.get('format'), formatFilter);
    catalogState.country = getCatalogUrlValueByAlias('country', searchParams.get('country'), countryFilter);
    catalogState.ratingFrom = normalizeCatalogRangeValue(
      searchParams.get('rating_from') || searchParams.get('rating'),
      getCatalogRangeInputOptions('rating')
    );
    catalogState.ratingTo = normalizeCatalogRangeValue(
      searchParams.get('rating_to'),
      getCatalogRangeInputOptions('rating')
    );
    catalogState.yearFrom = normalizeCatalogRangeValue(
      searchParams.get('year_from') || searchParams.get('year'),
      getCatalogRangeInputOptions('year')
    );
    catalogState.yearTo = normalizeCatalogRangeValue(
      searchParams.get('year_to') || searchParams.get('year'),
      getCatalogRangeInputOptions('year')
    );
    catalogState.runtimeFrom = normalizeCatalogRangeValue(
      searchParams.get('runtime_from'),
      getCatalogRangeInputOptions('runtime')
    );
    catalogState.runtimeTo = normalizeCatalogRangeValue(
      searchParams.get('runtime_to'),
      getCatalogRangeInputOptions('runtime')
    );
    catalogState.withReviews = getCatalogUrlBooleanValue(searchParams.get('reviews'));
    catalogState.watchlist = getSelectOptionValue(watchlistFilter, searchParams.get('watchlist'), '');
    catalogState.watched = getSelectOptionValue(watchedFilter, searchParams.get('watched'), '');
  }

  catalogState.viewMode = getSelectOptionValue(viewMode, searchParams.get('view'), 'list');
  catalogState.sortMode = getSelectOptionValue(sortMode, searchParams.get('sort'), 'default');
  catalogState.page = Math.max(1, Number(searchParams.get('page')) || 1);
  catalogState.profileHandle = String(searchParams.get(CATALOG_PROFILE_QUERY_PARAM) || '').trim();
  catalogState.profileActivity = normalizeCatalogProfileActivityKey(
    searchParams.get(CATALOG_PROFILE_ACTIVITY_QUERY_PARAM)
  );

  return catalogState;
}

function readStoredCatalogState() {
  const rawCatalogState = localStorage.getItem(CATALOG_STATE_STORAGE_KEY);

  if (!rawCatalogState) {
    return null;
  }

  return {
    ...getDefaultCatalogState(),
    ...JSON.parse(rawCatalogState)
  };
}

function setSelectValue(selectElement, value) {
  if (!selectElement) {
    return;
  }

  const normalizedValue = String(value || '').trim();
  const hasOption = Array.from(selectElement.options).some(option => option.value === normalizedValue);

  if (normalizedValue && !hasOption) {
    const option = document.createElement('option');
    option.value = normalizedValue;
    option.textContent = normalizedValue;
    selectElement.appendChild(option);
  }

  selectElement.value = normalizedValue;
}

function applyCatalogStateToControls(catalogState) {
  const nextCatalogState = {
    ...getDefaultCatalogState(),
    ...(catalogState || {})
  };

  searchInput.value = nextCatalogState.searchQuery || '';
  setSelectValue(genreFilter, nextCatalogState.genre);
  setSelectValue(subgenreFilter, nextCatalogState.subgenre);
  setSelectValue(formatFilter, nextCatalogState.format);
  setSelectValue(countryFilter, nextCatalogState.country);
  setCatalogRangeControlValue(ratingFromFilter, nextCatalogState.ratingFrom, getCatalogRangeInputOptions('rating'));
  setCatalogRangeControlValue(ratingToFilter, nextCatalogState.ratingTo, getCatalogRangeInputOptions('rating'));
  setCatalogRangeControlValue(yearFromFilter, nextCatalogState.yearFrom, getCatalogRangeInputOptions('year'));
  setCatalogRangeControlValue(yearToFilter, nextCatalogState.yearTo, getCatalogRangeInputOptions('year'));
  setCatalogRangeControlValue(runtimeFromFilter, nextCatalogState.runtimeFrom, getCatalogRangeInputOptions('runtime'));
  setCatalogRangeControlValue(runtimeToFilter, nextCatalogState.runtimeTo, getCatalogRangeInputOptions('runtime'));
  refreshCatalogRangeControls();
  reviewedOnlyFilter = Boolean(nextCatalogState.withReviews);
  setSelectValue(watchlistFilter, currentUser ? nextCatalogState.watchlist : '');
  setSelectValue(watchedFilter, currentUser ? nextCatalogState.watched : '');

  setSelectValue(viewMode, nextCatalogState.viewMode || 'list');
  setSelectValue(sortMode, nextCatalogState.sortMode || 'default');
  currentCatalogPage = Math.max(1, Number(nextCatalogState.page) || 1);
  setCatalogProfileActivitySelection(nextCatalogState.profileHandle, nextCatalogState.profileActivity);
}

function setCatalogUrlParam(searchParams, paramName, value) {
  const normalizedValue = getCatalogUrlValueAlias(paramName, value);

  if (normalizedValue) {
    searchParams.set(paramName, normalizedValue);
  }
}

function getCatalogUrlSearchParamsFromControls() {
  const searchParams = new URLSearchParams(window.location.search);
  const activePresetKey = getActiveQuickPresetKey();

  CATALOG_URL_STATE_PARAMS.forEach(paramName => {
    searchParams.delete(paramName);
  });

  if (activePresetKey) {
    searchParams.set(CATALOG_PRESET_QUERY_PARAM, activePresetKey);
  } else {
    setCatalogUrlParam(searchParams, 'q', searchInput.value);
    setCatalogUrlParam(searchParams, 'genre', genreFilter.value);
    setCatalogUrlParam(searchParams, 'subgenre', subgenreFilter.value);
    setCatalogUrlParam(searchParams, 'format', formatFilter.value);
    setCatalogUrlParam(searchParams, 'country', countryFilter.value);
    setCatalogUrlParam(searchParams, 'year_from', getCatalogRangeControlValue(yearFromFilter, getCatalogRangeInputOptions('year')));
    setCatalogUrlParam(searchParams, 'year_to', getCatalogRangeControlValue(yearToFilter, getCatalogRangeInputOptions('year')));
    setCatalogUrlParam(searchParams, 'rating_from', getCatalogRangeControlValue(ratingFromFilter, getCatalogRangeInputOptions('rating')));
    setCatalogUrlParam(searchParams, 'rating_to', getCatalogRangeControlValue(ratingToFilter, getCatalogRangeInputOptions('rating')));
    setCatalogUrlParam(searchParams, 'runtime_from', getCatalogRangeControlValue(runtimeFromFilter, getCatalogRangeInputOptions('runtime')));
    setCatalogUrlParam(searchParams, 'runtime_to', getCatalogRangeControlValue(runtimeToFilter, getCatalogRangeInputOptions('runtime')));

    if (reviewedOnlyFilter) {
      searchParams.set('reviews', '1');
    }

    if (currentUser) {
      setCatalogUrlParam(searchParams, 'watchlist', watchlistFilter.value);
      setCatalogUrlParam(searchParams, 'watched', watchedFilter.value);
    }
  }

  if (sortMode.value && sortMode.value !== 'default') {
    searchParams.set('sort', sortMode.value);
  }

  if (viewMode.value && viewMode.value !== 'list') {
    searchParams.set('view', viewMode.value);
  }

  if (currentCatalogPage > 1) {
    searchParams.set('page', String(currentCatalogPage));
  }

  if (isCatalogProfileActivityActive()) {
    searchParams.set(CATALOG_PROFILE_QUERY_PARAM, catalogProfileActivityHandle);
    searchParams.set(CATALOG_PROFILE_ACTIVITY_QUERY_PARAM, catalogProfileActivityKey);
  }

  return searchParams;
}

function syncCatalogUrlFromControls({ urlMode = 'replace' } = {}) {
  if (!isCatalogPage() || !window.history?.replaceState) {
    return;
  }

  const searchParams = getCatalogUrlSearchParamsFromControls();
  const nextSearch = searchParams.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextUrl === currentUrl) {
    return;
  }

  if (urlMode === 'push' && window.history.pushState) {
    window.history.pushState(null, '', nextUrl);
    return;
  }

  window.history.replaceState(null, '', nextUrl);
}

function saveCatalogState(options = {}) {
  const catalogState = getCurrentCatalogStateForPersistence();

  try {
    localStorage.setItem(
      CATALOG_STATE_STORAGE_KEY,
      JSON.stringify(catalogState)
    );
  } catch (error) {
    console.warn('Ошибка сохранения состояния каталога:', error);
  }
  syncCatalogUrlFromControls(options);
}

function applySavedCatalogState({ fallbackToStorage = true } = {}) {
  try {
    const catalogUrlState = readCatalogUrlState();
    const catalogState = catalogUrlState
      || (fallbackToStorage ? readStoredCatalogState() : getDefaultCatalogState());

    applyCatalogStateToControls(catalogState);

    if (searchClearBtn) {
      searchClearBtn.classList.toggle('is-visible', Boolean(searchInput.value.trim()));
    }

    refreshCustomSelectGroup([
      genreFilter,
      subgenreFilter,
      formatFilter,
      countryFilter,
      watchlistFilter,
      watchedFilter,
      viewMode,
      sortMode
    ]);

    syncCatalogViewToggleButton();
    updateFiltersButtonLabel();
    syncQuickPresetButtons();

    const hasPendingAuthFilter = !currentUser && Boolean(catalogState?.watchlist || catalogState?.watched);

    if (catalogUrlState && !getCatalogRoutePresetKey()) {
      syncCatalogUrlFromControls();
    }

    if (!catalogUrlState && fallbackToStorage && !hasPendingAuthFilter) {
      syncCatalogUrlFromControls();
    }
  } catch (error) {
    console.warn('Ошибка восстановления состояния каталога:', error);
  }
}

function updatePosterFileUi() {
  if (!posterFileName) {
    return;
  }

  const pendingFilesCount = moviePosterImagesDraft
    .filter(entry => entry.type === 'pending')
    .length;

  posterFileName.textContent = pendingFilesCount > 0
    ? `Добавлено файлов: ${pendingFilesCount}`
    : 'Файлы не выбраны';
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

function normalizeOptionalUrl(value, { preserveIntentionalEmpty = false } = {}) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return '';
  }

  if (isIntentionalEmptyFieldMarker(trimmedValue)) {
    return preserveIntentionalEmpty ? INTENTIONAL_EMPTY_FIELD_MARKER : '';
  }

  // Если пользователь вставил ссылку без протокола, пробуем добавить https://
  if (!/^https?:\/\//i.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  return trimmedValue;
}

function getPublicOptionalUrl(value) {
  return normalizeOptionalUrl(value);
}

function normalizeTmdbPersonUrl(value) {
  const normalizedUrl = normalizeOptionalUrl(value);

  if (!normalizedUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(normalizedUrl);

    parsedUrl.hash = '';
    parsedUrl.search = '';
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/g, '');

    return parsedUrl.toString();
  } catch (error) {
    return normalizedUrl;
  }
}

function getYouTubeVideoIdFromUrl(value) {
  const normalizedUrl = normalizeOptionalUrl(value);

  if (!normalizedUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./i, '').toLowerCase();
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be') {
      return pathParts[0] || '';
    }

    if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'music.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v') || '';
      }

      if (['embed', 'shorts', 'live'].includes(pathParts[0])) {
        return pathParts[1] || '';
      }
    }
  } catch (error) {
    const fallbackMatch = normalizedUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([A-Za-z0-9_-]+)/i);
    return fallbackMatch?.[1] || '';
  }

  return '';
}

function getYouTubeTrailerEmbedUrl(value) {
  const videoId = getYouTubeVideoIdFromUrl(value).trim();

  if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
    return '';
  }

  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);

  embedUrl.searchParams.set('autoplay', '1');
  embedUrl.searchParams.set('rel', '0');

  return embedUrl.toString();
}

function normalizeRuntimeMinutesValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const runtimeMinutes = Number(value);

  if (!Number.isInteger(runtimeMinutes) || runtimeMinutes < 1 || runtimeMinutes > 999) {
    return null;
  }

  return runtimeMinutes;
}

function parseRuntimeMinutesFormValue(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return null;
  }

  const runtimeMinutes = Number(trimmedValue);

  return Number.isInteger(runtimeMinutes) && runtimeMinutes >= 1 && runtimeMinutes <= 999
    ? runtimeMinutes
    : Number.NaN;
}

function formatRuntimeMinutes(runtimeMinutes) {
  const normalizedRuntimeMinutes = normalizeRuntimeMinutesValue(runtimeMinutes);

  if (!normalizedRuntimeMinutes) {
    return '';
  }

  const hours = Math.floor(normalizedRuntimeMinutes / 60);
  const minutes = normalizedRuntimeMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} ч ${minutes} мин`;
  }

  if (hours > 0) {
    return `${hours} ч`;
  }

  return `${minutes} мин`;
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
  const genreNames = parseLineOrCommaSeparatedValues(value);
  const additionalGenreNames = genreNames.filter(name =>
    normalizeSearchText(name) !== BASE_HORROR_GENRE_NORMALIZED
  );

  return ['Ужасы', ...additionalGenreNames];
}

function formatPublicCommaSeparatedValues(values = []) {
  const normalizedValues = (Array.isArray(values) ? values : [])
    .map(value => String(value || '').trim())
    .filter(Boolean);

  return normalizedValues
    .map((value, index) => {
      return index === 0
        ? value
        : value.toLocaleLowerCase('ru-RU');
    })
    .join(', ');
}

function formatGenreNamesForPublicDisplay(genreNames = []) {
  const normalizedGenreNames = (Array.isArray(genreNames) ? genreNames : [])
    .map(genreName => String(genreName || '').trim())
    .filter(Boolean);
  const hasBaseHorrorGenre = normalizedGenreNames.some(genreName =>
    normalizeSearchText(genreName) === BASE_HORROR_GENRE_NORMALIZED
  );
  const orderedGenreNames = hasBaseHorrorGenre
    ? [
        'Ужасы',
        ...normalizedGenreNames.filter(genreName =>
          normalizeSearchText(genreName) !== BASE_HORROR_GENRE_NORMALIZED
        )
      ]
    : normalizedGenreNames;

  return formatPublicCommaSeparatedValues(orderedGenreNames);
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
    runtimeFromFilter.value ||
    runtimeToFilter.value ||
    yearFromFilter.value ||
    yearToFilter.value ||
    ratingFromFilter.value ||
    ratingToFilter.value ||
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
    ? 'По месяцам'
    : 'Общим списком';

  catalogViewToggleButton.setAttribute(
    'aria-label',
    isListMode
      ? 'Переключить отображение по месяцам'
      : 'Переключить отображение общим списком'
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

function getAuthRedirectInfo() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const getParam = name => searchParams.get(name) || hashParams.get(name) || '';
  const type = getParam('type');
  const code = getParam('code');
  const tokenHash = getParam('token_hash');
  const accessToken = getParam('access_token');
  const refreshToken = getParam('refresh_token');
  const error = getParam('error') || getParam('error_code');
  const errorDescription = getParam('error_description');
  const hasPendingRecovery = Boolean(localStorage.getItem(PASSWORD_RECOVERY_PENDING_KEY));
  const hasPendingEmailConfirmation = Boolean(localStorage.getItem(EMAIL_CONFIRMATION_PENDING_KEY));
  const hasAuthReturnParams = Boolean(
    code ||
    tokenHash ||
    accessToken ||
    refreshToken ||
    error ||
    errorDescription
  );
  const normalizedType = String(type || '').toLowerCase();
  const isRecovery = normalizedType === 'recovery' || (hasPendingRecovery && hasAuthReturnParams);
  const isEmailConfirmation = (
    normalizedType === 'signup' ||
    normalizedType === 'email' ||
    normalizedType === 'email_change' ||
    (tokenHash && !isRecovery) ||
    (hasPendingEmailConfirmation && hasAuthReturnParams && !isRecovery)
  );

  return {
    type: normalizedType,
    code,
    tokenHash,
    accessToken,
    refreshToken,
    error,
    errorDescription,
    hasAuthReturnParams,
    isRecovery,
    isEmailConfirmation
  };
}

function isEmailConfirmationRedirect() {
  return getAuthRedirectInfo().isEmailConfirmation || didConsumeEmailConfirmationRedirect;
}

function isPasswordRecoveryRedirect() {
  return getAuthRedirectInfo().isRecovery;
}

function clearEmailConfirmationParamsFromUrl() {
  const url = new URL(window.location.href);
  let wasChanged = false;
  const authParamNames = [
    'type',
    'token_hash',
    'code',
    'access_token',
    'refresh_token',
    'expires_at',
    'expires_in',
    'token_type',
    'provider_token',
    'provider_refresh_token',
    'error',
    'error_code',
    'error_description'
  ];

  authParamNames.forEach(paramName => {
    if (url.searchParams.has(paramName)) {
      url.searchParams.delete(paramName);
      wasChanged = true;
    }
  });

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));

  authParamNames.forEach(paramName => {
    if (hashParams.has(paramName)) {
      hashParams.delete(paramName);
      wasChanged = true;
    }
  });

  if (wasChanged) {
    const nextHash = hashParams.toString();
    url.hash = nextHash ? `#${nextHash}` : '';
    window.history.replaceState({}, document.title, url.toString());
  }
}

function normalizeAuthRedirectOtpType(type) {
  const normalizedType = String(type || '').toLowerCase();
  const allowedTypes = new Set([
    'email',
    'email_change',
    'invite',
    'magiclink',
    'recovery'
  ]);

  if (normalizedType === 'signup') {
    return 'email';
  }

  if (!allowedTypes.has(normalizedType)) {
    return '';
  }

  return normalizedType;
}

async function consumeAuthRedirectFromUrl(authRedirectInfo = getAuthRedirectInfo()) {
  if (!authRedirectInfo.hasAuthReturnParams) {
    return {
      didConsume: false,
      isRecovery: authRedirectInfo.isRecovery,
      error: null
    };
  }

  const authRedirectErrorMessage = authRedirectInfo.errorDescription || authRedirectInfo.error || '';

  try {
    if (authRedirectErrorMessage) {
      throw new Error(authRedirectErrorMessage);
    }

    if (authRedirectInfo.code) {
      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.exchangeCodeForSession(authRedirectInfo.code),
        'Не удалось обработать ссылку входа. Проверь соединение и попробуй открыть ссылку ещё раз.'
      );

      if (error) {
        throw error;
      }
    } else if (authRedirectInfo.accessToken && authRedirectInfo.refreshToken) {
      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.setSession({
          access_token: authRedirectInfo.accessToken,
          refresh_token: authRedirectInfo.refreshToken
        }),
        'Не удалось восстановить сессию из ссылки. Проверь соединение и попробуй открыть ссылку ещё раз.'
      );

      if (error) {
        throw error;
      }
    } else if (authRedirectInfo.tokenHash) {
      const otpType = normalizeAuthRedirectOtpType(authRedirectInfo.type);

      if (!otpType) {
        throw new Error('Ссылка входа содержит неизвестный тип подтверждения.');
      }

      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.verifyOtp({
          token_hash: authRedirectInfo.tokenHash,
          type: otpType
        }),
        'Не удалось подтвердить ссылку входа. Проверь соединение и попробуй открыть ссылку ещё раз.'
      );

      if (error) {
        throw error;
      }
    }

    if (authRedirectInfo.isRecovery) {
      localStorage.setItem(PASSWORD_RECOVERY_PENDING_KEY, '1');
    }

    if (authRedirectInfo.isEmailConfirmation) {
      didConsumeEmailConfirmationRedirect = true;
    }

    return {
      didConsume: true,
      isRecovery: authRedirectInfo.isRecovery,
      error: null
    };
  } catch (error) {
    console.error('Ошибка обработки auth-редиректа:', error);

    return {
      didConsume: true,
      isRecovery: authRedirectInfo.isRecovery,
      error
    };
  } finally {
    clearEmailConfirmationParamsFromUrl();
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
    didConsumeEmailConfirmationRedirect = false;
    return;
  }

  trackGoal('email_confirmed_login');
  localStorage.setItem(EMAIL_CONFIRMATION_TRACKED_KEY, currentUser.id);
  localStorage.removeItem(EMAIL_CONFIRMATION_PENDING_KEY);
  clearEmailConfirmationParamsFromUrl();
  didConsumeEmailConfirmationRedirect = false;
}

async function loadCurrentUserRole() {
  if (!currentUser) {
    currentUserRole = null;
    currentUserProfile = null;
    updateAdminStatus();
    return;
  }

  try {
    const data = await withAuthProfileRequestTimeout(
      runCurrentUserProfileSelect(
        selectColumns => supabaseClient
          .from('profiles')
          .select(selectColumns)
          .eq('id', currentUser.id)
          .single()
      ),
      'Не удалось загрузить профиль пользователя. Проверь соединение и попробуй обновить страницу.'
    );

    currentUserRole = data?.role || null;
    currentUserProfile = data || null;
    cachePublicProfileRows([{ id: currentUser.id, ...(data || {}) }]);
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

function upsertMovieRatingStatsRows(rows, movieIdsToClear = []) {
  (Array.isArray(movieIdsToClear) ? movieIdsToClear : [])
    .map(movieId => String(movieId || ''))
    .filter(Boolean)
    .forEach(movieId => movieRatingStatsByMovieId.delete(movieId));

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

function getMovieRatingStatsRowsFromRatingRows(rows) {
  const statsByMovieId = new Map();

  (Array.isArray(rows) ? rows : []).forEach(row => {
    const movieId = String(row.movie_id ?? '');

    if (!movieId) {
      return;
    }

    const stats = statsByMovieId.get(movieId) || {
      movie_id: movieId,
      votes_count: 0,
      rating_sum: 0,
      average_rating: 0
    };

    stats.votes_count += 1;
    stats.rating_sum += Number(row.rating || 0);
    stats.average_rating = stats.votes_count > 0
      ? Number((stats.rating_sum / stats.votes_count).toFixed(1))
      : 0;
    statsByMovieId.set(movieId, stats);
  });

  return Array.from(statsByMovieId.values());
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

const LETTERBOXD_IMPORT_PREVIEW_LIMIT = 8;
const LETTERBOXD_IMPORT_QUERY_CHUNK_SIZE = 200;
let letterboxdImportToolsPromise = null;
let adminActionToolsPromise = null;
let personPlaceholderToolsPromise = null;
let movieSocialControllerPromise = null;
let movieEditorControllerPromise = null;
let movieDetailCacheControllerPromise = null;
let moviePageOrchestratorControllerPromise = null;
let moviePageShellControllerPromise = null;
let moviePageInteractionsControllerPromise = null;
let movieUserStateControllerPromise = null;
let customSelectScriptPromise = null;
let personPlaceholderTools = null;
let movieSocialController = null;
let movieEditorController = null;
let movieDetailCacheController = null;
let moviePageOrchestratorController = null;
let moviePageShellController = null;
let moviePageInteractionsController = null;
let movieUserStateController = null;

function getLazyFeatureModuleUrl(filename) {
  const isLocalFile = window.location.protocol === 'file:';
  const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!isLocalFile && !isLocalHost) {
    return `/app-assets/${encodeURIComponent(APP_BUILD_VERSION)}?file=${encodeURIComponent(filename)}`;
  }

  const assetPath = window.location.protocol === 'file:' ? filename : `/${filename}`;

  return `${assetPath}?v=${encodeURIComponent(APP_BUILD_VERSION)}`;
}

function loadLetterboxdImportTools() {
  if (!letterboxdImportToolsPromise) {
    letterboxdImportToolsPromise = import(getLazyFeatureModuleUrl('letterboxd-import.js'));
  }

  return letterboxdImportToolsPromise;
}

function loadCustomSelectScript() {
  if (typeof createCustomSelectManager === 'function') {
    return Promise.resolve();
  }

  if (!customSelectScriptPromise) {
    customSelectScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = getLazyFeatureModuleUrl('custom-select.js');
      script.onload = () => resolve();
      script.onerror = () => {
        customSelectScriptPromise = null;
        reject(new Error('Failed to load custom-select.js'));
      };
      document.body.appendChild(script);
    });
  }

  return customSelectScriptPromise.then(() => {
    if (typeof createCustomSelectManager !== 'function') {
      throw new Error('custom-select.js did not expose createCustomSelectManager');
    }
  });
}

function getMovieUserStateControllerContext() {
  return {
    window,
    getCurrentUser: () => currentUser,
    getRatingRequestSet: () => ratingRequestInFlight,
    getWatchlistRequestSet: () => watchlistRequestInFlight,
    markLocalDataMutation,
    syncCatalogSnapshot: syncCatalogSessionSnapshotMovieState,
    isMovieWatchedByCurrentUser,
    hasMovieWatchlistRecord,
    getCurrentUserRating,
    addToWatchlist: addMovieToWatchlist,
    removeFromWatchlist: removeMovieFromWatchlist,
    deleteRating: deleteCurrentUserMovieRating,
    upsertRating: upsertCurrentUserMovieRating,
    rerenderWatchlistToggle: movieId => {
      MOVIE_MUTATION_RERENDER_PRESETS.watchlistToggle(movieId);
    },
    rerenderRatingChange: movieId => {
      MOVIE_MUTATION_RERENDER_PRESETS.ratingChange(movieId);
    },
    showRatingFeedback: showMovieRatingFeedback,
    showWatchlistFeedback: showMovieWatchlistFeedback,
    onWatchlistToggleError: error => {
      console.error('Ошибка переключения watchlist:', error);
    },
    onRemoveRatingError: error => {
      console.error('Ошибка удаления оценки фильма:', error);
    },
    onSaveRatingError: error => {
      console.error('Ошибка сохранения оценки фильма:', error);
    }
  };
}

function ensureMovieUserStateControllerLoaded() {
  if (!movieUserStateControllerPromise) {
    movieUserStateControllerPromise = import(getLazyFeatureModuleUrl('movie-user-state.js'))
      .then(module => {
        movieUserStateController = module.createMovieUserStateController(
          getMovieUserStateControllerContext()
        );
        return movieUserStateController;
      })
      .catch(error => {
        movieUserStateControllerPromise = null;
        movieUserStateController = null;
        throw error;
      });
  }

  return movieUserStateControllerPromise;
}

function getAdminActionToolsContext() {
  return {
    APP_BUILD_VERSION,
    BASE_HORROR_GENRE_NORMALIZED,
    buildMovieCanonicalPath,
    compareManualSimilarAuditMovies,
    getAllMovies: () => allMovies,
    getManualSimilarMovieIds,
    getManualSimilarMovieLabel,
    getManualSimilarRows: () => allManualSimilarRows,
    getUniqueMoviePosterUrlCount,
    groupRowsByMovieId,
    isEmptyTextArrayLikeField,
    normalizeDirectorRow,
    normalizeSearchText,
    normalizeTextArrayField,
    parseLineOrCommaSeparatedValues
  };
}

function loadAdminActionTools() {
  if (!adminActionToolsPromise) {
    adminActionToolsPromise = import(getLazyFeatureModuleUrl('admin-actions.js'))
      .then(module => module.createAdminActionTools(getAdminActionToolsContext()));
  }

  return adminActionToolsPromise;
}

function loadPersonPlaceholderTools() {
  if (!personPlaceholderToolsPromise) {
    personPlaceholderToolsPromise = import(getLazyFeatureModuleUrl('person-placeholders.js'))
      .then(module => {
        personPlaceholderTools = module;
        return module;
      });
  }

  return personPlaceholderToolsPromise;
}

function getMovieEditorFormElements() {
  return {
    movieForm,
    formTitle,
    formMessage,
    submitButton,
    cancelEditButton,
    closeMovieModalButton,
    titleInput,
    originalTitleInput,
    yearInput,
    releaseMonthInput,
    releaseYearInput,
    sortOrderInput,
    runtimeMinutesInput,
    directorInput,
    productionInput,
    distributionInput,
    russianDistributionInput,
    synopsisInput,
    kinopoiskUrlInput,
    imdbUrlInput,
    letterboxdUrlInput,
    letterboxdShortUrlInput,
    rottentomatoesUrlInput,
    tmdbUrlInput,
    trailerUrlInput,
    genresInput,
    countriesInput,
    searchAliasesInput,
    movieFormatsInput,
    tagsPerceivedInput,
    posterFileInput,
    moviePosterImagesList
  };
}

function getMovieEditorControllerContext() {
  return {
    getElements: getMovieEditorFormElements,
    normalizeOptionalUrl,
    normalizeLetterboxdShortUrl,
    parseRuntimeMinutesFormValue,
    parseLineOrCommaSeparatedValues,
    parseMultilineValues,
    getTextArrayFormValue,
    normalizeSearchText,
    baseHorrorGenreNormalized: BASE_HORROR_GENRE_NORMALIZED,
    normalizeAdditionalGenreNames,
    uploadPosterFile,
    getOptionalTextArrayPayload,
    areStringArraysEqual,
    normalizeTextArrayField,
    normalizeRuntimeMinutesValue,
    normalizeManualSimilarMovieIds,
    normalizeMoviePosterImageRows,
    supabaseClient,
    withPendingRequestTimeout,
    throwIfSupabaseError
  };
}

function ensureMovieEditorControllerLoaded() {
  if (!movieEditorControllerPromise) {
    movieEditorControllerPromise = import(getLazyFeatureModuleUrl('movie-editor.js'))
      .then(module => {
        movieEditorController = module.createMovieEditorController(getMovieEditorControllerContext());
        return movieEditorController;
      })
      .catch(error => {
        movieEditorControllerPromise = null;
        throw error;
      });
  }

  return movieEditorControllerPromise;
}

function getMoviePageSessionSnapshot(movie) {
  if (!movie?.id) {
    return {};
  }

  const movieId = String(movie.id);
  const movieRatingStats = movieRatingStatsByMovieId.get(movieId);

  return {
    movieRatingStats: movieRatingStats
      ? {
        movie_id: movieId,
        votes_count: movieRatingStats.count,
        rating_sum: movieRatingStats.sum,
        average_rating: movieRatingStats.average
      }
      : null,
    movieRatings: allMovieRatings.filter(row => String(row?.movie_id || '') === movieId),
    movieWatchlist: allMovieWatchlist.filter(row => String(row?.movie_id || '') === movieId),
    movieReviews: allMovieReviews.filter(review => String(review?.movie_id || '') === movieId),
    movieComments: allMovieComments.filter(comment => String(comment?.movie_id || '') === movieId),
    posterImages: getMoviePosterImages(movieId),
    similarMovieId: String(currentMoviePageSimilarMovieId || ''),
    similarMovieIds: String(currentMoviePageSimilarMovieId || '') === movieId
      ? currentMoviePageSimilarMovieIds
      : [],
    similarMovies: String(currentMoviePageSimilarMovieId || '') === movieId
      ? currentMoviePageSimilarMovies
      : []
  };
}

function getMovieDetailCacheControllerContext() {
  return {
    storage: sessionStorage,
    cacheKey: MOVIE_PAGE_SESSION_CACHE_KEY,
    version: MOVIE_PAGE_SESSION_CACHE_VERSION,
    buildVersion: APP_BUILD_VERSION,
    maxAgeMs: MOVIE_PAGE_SESSION_CACHE_MAX_AGE_MS,
    maxEntries: MOVIE_PAGE_SESSION_CACHE_MAX_ENTRIES,
    getDataMutationStamp,
    isDataMutationStampFresh,
    getStableStringHash,
    getCurrentUserId: () => currentUser?.id || null,
    getIsAdmin: () => Boolean(isAdmin),
    getMovieStateSnapshot: getMoviePageSessionSnapshot,
    onCacheError: (action, error) => {
      console.warn(`Error during movie page session cache ${action}:`, error);
    }
  };
}

function ensureMovieDetailCacheControllerLoaded() {
  if (!movieDetailCacheControllerPromise) {
    movieDetailCacheControllerPromise = import(getLazyFeatureModuleUrl('movie-detail-cache.js'))
      .then(module => {
        movieDetailCacheController = module.createMovieDetailCacheController(
          getMovieDetailCacheControllerContext()
        );
        return movieDetailCacheController;
      })
      .catch(error => {
        movieDetailCacheControllerPromise = null;
        movieDetailCacheController = null;
        throw error;
      });
  }

  return movieDetailCacheControllerPromise;
}

function getMoviePageOrchestratorControllerContext() {
  return {
    location: window.location
  };
}

function ensureMoviePageOrchestratorControllerLoaded() {
  if (!moviePageOrchestratorControllerPromise) {
    moviePageOrchestratorControllerPromise = import(getLazyFeatureModuleUrl('movie-page-orchestrator.js'))
      .then(module => {
        moviePageOrchestratorController = module.createMoviePageOrchestratorController(
          getMoviePageOrchestratorControllerContext()
        );
        return moviePageOrchestratorController;
      })
      .catch(error => {
        moviePageOrchestratorControllerPromise = null;
        moviePageOrchestratorController = null;
        throw error;
      });
  }

  return moviePageOrchestratorControllerPromise;
}

function getMoviePageOrchestratorController() {
  if (!moviePageOrchestratorController) {
    throw new Error('Movie page orchestrator module is not loaded.');
  }

  return moviePageOrchestratorController;
}

function getMoviePageInteractionsControllerContext() {
  return {
    moviePage,
    getYouTubeTrailerEmbedUrl,
    getMoviePagePosterGalleryImages,
    getPosterImageData,
    bindPosterFallbackImages,
    showAppMessage,
    syncBodyScrollLock,
    toggleMovieWatchlist,
    openMobileRatingModal
  };
}

function getLoadedMoviePageInteractionsController() {
  return moviePageInteractionsController;
}

function ensureMoviePageInteractionsControllerLoaded() {
  if (!moviePageInteractionsControllerPromise) {
    moviePageInteractionsControllerPromise = import(getLazyFeatureModuleUrl('movie-page-interactions.js'))
      .then(module => {
        moviePageInteractionsController = module.createMoviePageInteractionsController(
          getMoviePageInteractionsControllerContext()
        );
        return moviePageInteractionsController;
      })
      .catch(error => {
        moviePageInteractionsControllerPromise = null;
        throw error;
      });
  }

  return moviePageInteractionsControllerPromise;
}

function getStoredMoviePagePosterGalleryIndex(movieId) {
  return getLoadedMoviePageInteractionsController()?.getStoredPosterGalleryIndex(movieId) || 0;
}

function isMovieTrailerModalOpen() {
  return Boolean(getLoadedMoviePageInteractionsController()?.isMovieTrailerModalOpen());
}

function closeMovieTrailerModal() {
  getLoadedMoviePageInteractionsController()?.closeMovieTrailerModal();
}

function syncMovieTrailerModalOffset() {
  getLoadedMoviePageInteractionsController()?.syncMovieTrailerModalOffset();
}

function getMoviePageShellControllerContext() {
  return {
    escapeHtml,
    formatPublicCommaSeparatedValues,
    formatGenreNamesForPublicDisplay,
    formatTextArrayForDetail,
    formatRuntimeMinutes,
    getMovieAverageRating,
    getMovieVotesCount,
    getCurrentUserRating,
    getCurrentUserMovieState,
    getMoviePageExternalLinksHtml,
    getYouTubeTrailerEmbedUrl,
    getMoviePageReviewsSectionHtml,
    getMoviePageCommentsSectionHtml,
    getMoviePosterImages,
    getMovieDisplayPosterGalleryImages,
    getPosterImageAttributeHtml,
    getVotesLabel,
    getMoviePageDirectorHtml,
    getCurrentUser: () => currentUser,
    isMovieRatingBusy: movieId => ratingRequestInFlight.has(String(movieId)),
    isMovieWatchlistBusy: movieId => watchlistRequestInFlight.has(String(movieId)),
    getStoredPosterGalleryIndex: getStoredMoviePagePosterGalleryIndex
  };
}

function ensureMoviePageShellControllerLoaded() {
  if (!moviePageShellControllerPromise) {
    moviePageShellControllerPromise = import(getLazyFeatureModuleUrl('movie-page-shell.js'))
      .then(module => {
        moviePageShellController = module.createMoviePageShellController(getMoviePageShellControllerContext());
        return moviePageShellController;
      })
      .catch(error => {
        moviePageShellControllerPromise = null;
        throw error;
      });
  }

  return moviePageShellControllerPromise;
}

function getMoviePageShellController() {
  if (!moviePageShellController) {
    throw new Error('Movie page shell module is not loaded.');
  }

  return moviePageShellController;
}

function getMoviePageSimilarControllerContext() {
  return {
    escapeHtml,
    buildMoviePageUrl,
    getCatalogMovieById,
    getCatalogMovieMeta,
    getMovieAverageRating,
    getMovieVotesCount,
    getMoviePreferredPosterUrl,
    getPosterImageAttributeHtml,
    getVotesLabel,
    normalizeManualSimilarMovieIds,
    normalizeSearchText,
    getManualSimilarMovieLabel
  };
}

function ensureMoviePageSimilarControllerLoaded() {
  if (!moviePageSimilarControllerPromise) {
    moviePageSimilarControllerPromise = import(getLazyFeatureModuleUrl('movie-page-similar.js'))
      .then(module => {
        moviePageSimilarController = module.createMoviePageSimilarController(
          getMoviePageSimilarControllerContext()
        );
        return moviePageSimilarController;
      })
      .catch(error => {
        moviePageSimilarControllerPromise = null;
        moviePageSimilarController = null;
        throw error;
      });
  }

  return moviePageSimilarControllerPromise;
}

function getMoviePageSimilarController() {
  if (!moviePageSimilarController) {
    throw new Error('Movie page similar module is not loaded.');
  }

  return moviePageSimilarController;
}

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

function parseLetterboxdImportYear(value) {
  const year = Number.parseInt(String(value || '').trim(), 10);

  return Number.isInteger(year) && year > 1800
    ? year
    : null;
}

function getMovieImportYear(movie) {
  return parseLetterboxdImportYear(movie?.year ?? movie?.release_year);
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
    renderMoviePageHeaderSection(currentMoviePageMovieData);
    persistCurrentMoviePageSessionCache();
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
  const {
    LETTERBOXD_IMPORT_FIELD_ALIASES,
    buildLetterboxdImportMovieIndex,
    getCsvField,
    hasCsvColumn,
    matchLetterboxdImportRowToMovie,
    parseCsvObjects,
    parseLetterboxdRatingValue
  } = await loadLetterboxdImportTools();
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

  function formatShortDateTime(dateValue) {
  if (!dateValue) {
    return '';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const datePart = parsedDate
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
    .replaceAll('.', '');
  const timePart = parsedDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${datePart} в ${timePart}`;
}

function normalizeMovieReviewText(value) {
  return String(value || '').trim();
}

function normalizeMovieCommentText(value) {
  return String(value || '').trim();
}

function getMovieReviewAnchorId(reviewId) {
  return `movie-review-${String(reviewId || '').replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function getMovieCommentAnchorId(commentId) {
  return `movie-comment-${String(commentId || '').replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function getMovieContentWarningCoverText(content, contentLabel) {
  const hasSpoilers = Boolean(content?.contains_spoilers);
  const hasProfanity = Boolean(content?.contains_profanity);

  if (hasSpoilers && hasProfanity) {
    return `${contentLabel} содержит спойлеры и нецензурную лексику.`;
  }

  if (hasSpoilers) {
    return `${contentLabel} содержит спойлеры.`;
  }

  if (hasProfanity) {
    return `${contentLabel} содержит нецензурную лексику.`;
  }

  return '';
}

async function runConfirmedAction(confirmMessage, action) {
  const isConfirmed = confirm(confirmMessage);

  if (!isConfirmed) {
    return false;
  }

  await action();
  return true;
}

function getMoviePageSocialSectionTitleHtml(titleId, title, count = null) {
  const hasCount = count !== null && count !== undefined && Number.isFinite(Number(count));

  return `
    <h2 id="${escapeHtml(titleId)}" class="movie-page-subtitle movie-page-section-title">
      <span>${escapeHtml(title)}</span>
      ${hasCount ? `<span class="movie-page-section-count">(${Number(count)})</span>` : ''}
    </h2>
  `;
}

function getMoviePageReviewsFallbackSectionHtml({ isLoading = true } = {}) {
  return `
    <section class="movie-page-reviews-block" aria-labelledby="moviePageReviewsTitle" data-movie-page-reviews-section="true">
      ${getMoviePageSocialSectionTitleHtml('moviePageReviewsTitle', 'Рецензии')}
      <div class="movie-page-review-empty-state">
        ${isLoading ? 'Загружаю рецензии...' : 'Пока нет ни одной рецензии.'}
      </div>
    </section>
  `;
}

function getMoviePageCommentsFallbackSectionHtml({ isLoading = true } = {}) {
  return `
    <section class="movie-page-comments-block" aria-labelledby="moviePageCommentsTitle" data-movie-page-comments-section="true">
      ${getMoviePageSocialSectionTitleHtml('moviePageCommentsTitle', 'Комментарии')}
      <div class="movie-page-comment-empty-state">
        ${isLoading ? 'Загружаю комментарии...' : 'Пока нет ни одного комментария.'}
      </div>
    </section>
  `;
}

function getMovieSocialControllerContext() {
  return {
    moviePage,
    supabaseClient,
    escapeHtml,
    buildUserPageUrl,
    getPublicProfileHandle,
    getPublicProfileAvatarUrl,
    getUserPageAvatarLetter,
    getCurrentUserRating,
    getMovieUserRatingKey,
    fetchPublicProfilesByIds,
    upsertKnownMovieRatingRows,
    removeKnownMovieRatingRows,
    throwIfSupabaseError,
    ensureActiveSessionForWrite,
    markLocalDataMutation,
    markCatalogDataChanged,
    syncCatalogSessionSnapshotMovieState,
    persistCurrentMoviePageSessionCache,
    openAuthModal,
    showAppMessage,
    runConfirmedAction,
    renderMoviePage,
    getCurrentUser: () => currentUser,
    getIsAdmin: () => isAdmin,
    getCurrentMoviePageMovieData: () => currentMoviePageMovieData,
    getMovieRatingByMovieAndUserKey: () => movieRatingByMovieAndUserKey,
    getCatalogReviewedMovieIds: () => catalogReviewedMovieIds,
    getAllMovieReviews: () => allMovieReviews,
    setAllMovieReviews: reviews => {
      allMovieReviews = Array.isArray(reviews) ? reviews : [];
    },
    getAllMovieComments: () => allMovieComments,
    setAllMovieComments: comments => {
      allMovieComments = Array.isArray(comments) ? comments : [];
    },
    getAreMovieReviewLikesAvailable: () => areMovieReviewLikesAvailable,
    setAreMovieReviewLikesAvailable: isAvailable => {
      areMovieReviewLikesAvailable = Boolean(isAvailable);
    },
    getAreMovieCommentsAvailable: () => areMovieCommentsAvailable,
    setAreMovieCommentsAvailable: isAvailable => {
      areMovieCommentsAvailable = Boolean(isAvailable);
    },
    getAreMovieCommentLikesAvailable: () => areMovieCommentLikesAvailable,
    setAreMovieCommentLikesAvailable: isAvailable => {
      areMovieCommentLikesAvailable = Boolean(isAvailable);
    },
    isMovieReviewLikesTableUnavailableError,
    isMovieCommentsTableUnavailableError,
    isMovieCommentLikesTableUnavailableError
  };
}

function getLoadedMovieSocialController() {
  if (movieSocialController) {
    movieSocialController.syncContextState?.();
  }

  return movieSocialController;
}

function ensureMovieSocialControllerLoaded() {
  if (!movieSocialControllerPromise) {
    movieSocialControllerPromise = import(getLazyFeatureModuleUrl('movie-social.js'))
      .then(module => {
        movieSocialController = module.createMovieSocialController(getMovieSocialControllerContext());
        movieSocialController.syncContextState?.();
        return movieSocialController;
      })
      .catch(error => {
        movieSocialControllerPromise = null;
        throw error;
      });
  }

  return movieSocialControllerPromise.then(controller => {
    controller.syncContextState?.();
    return controller;
  });
}

let movieSocialSectionsHydrationToken = 0;

function scheduleMovieSocialSectionsHydration(movie) {
  if (!movie?.id) {
    return;
  }

  const hydrationToken = ++movieSocialSectionsHydrationToken;
  const movieId = String(movie.id);

  ensureMovieSocialControllerLoaded()
    .then(controller => {
      if (
        hydrationToken !== movieSocialSectionsHydrationToken ||
        String(currentMoviePageMovieId || '') !== movieId
      ) {
        return;
      }

      controller.renderMoviePageReviewsSection(movie);
      controller.renderMoviePageCommentsSection(movie);
      requestAnimationFrame(() => controller.focusMoviePageHashTarget());
    })
    .catch(error => {
      console.error('Ошибка загрузки social-модуля детальной страницы:', error);
    });
}

function resetMoviePageComposerState() {
  getLoadedMovieSocialController()?.resetMoviePageComposerState();
}

function getMoviePageReviewsSectionHtml(movie, options = {}) {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    return controller.getMoviePageReviewsSectionHtml(movie, options);
  }

  return getMoviePageReviewsFallbackSectionHtml({ isLoading: options.isLoading !== false });
}

function getMoviePageCommentsSectionHtml(movie, options = {}) {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    return controller.getMoviePageCommentsSectionHtml(movie, options);
  }

  return getMoviePageCommentsFallbackSectionHtml({ isLoading: options.isLoading !== false });
}

async function fetchMovieReviews(movieId) {
  const controller = await ensureMovieSocialControllerLoaded();
  return controller.fetchMovieReviews(movieId);
}

async function fetchMovieComments(movieId) {
  const controller = await ensureMovieSocialControllerLoaded();
  return controller.fetchMovieComments(movieId);
}

function bindMoviePageReviewEvents(movie) {
  getLoadedMovieSocialController()?.bindMoviePageReviewEvents(movie);
}

function bindMoviePageCommentEvents(movie) {
  getLoadedMovieSocialController()?.bindMoviePageCommentEvents(movie);
}

function focusMoviePageHashTarget() {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    controller.focusMoviePageHashTarget();
    return;
  }

  ensureMovieSocialControllerLoaded()
    .then(loadedController => loadedController.focusMoviePageHashTarget())
    .catch(error => {
      console.error('Ошибка фокуса social-якоря детальной страницы:', error);
    });
}

function renderMoviePageReviewsSection(movie, options = {}) {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    controller.renderMoviePageReviewsSection(movie, options);
    return;
  }

  scheduleMovieSocialSectionsHydration(movie);
}

function renderMoviePageCommentsSection(movie) {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    controller.renderMoviePageCommentsSection(movie);
    return;
  }

  scheduleMovieSocialSectionsHydration(movie);
}

function renderMoviePageReviewsStatus(message) {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    controller.renderMoviePageReviewsStatus(message);
    return;
  }

  const reviewsSection = moviePage?.querySelector('[data-movie-page-reviews-section="true"]');

  if (!reviewsSection) {
    return;
  }

  reviewsSection.innerHTML = `
    ${getMoviePageSocialSectionTitleHtml('moviePageReviewsTitle', 'Рецензии')}
    <div class="movie-page-review-empty-state">
      ${escapeHtml(message)}
    </div>
  `;
}

function renderMoviePageCommentsStatus(message) {
  const controller = getLoadedMovieSocialController();

  if (controller) {
    controller.renderMoviePageCommentsStatus(message);
    return;
  }

  const commentsSection = moviePage?.querySelector('[data-movie-page-comments-section="true"]');

  if (!commentsSection) {
    return;
  }

  commentsSection.innerHTML = `
    ${getMoviePageSocialSectionTitleHtml('moviePageCommentsTitle', 'Комментарии')}
    <div class="movie-page-comment-empty-state">
      ${escapeHtml(message)}
    </div>
  `;
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
  const genresText = formatGenreNamesForPublicDisplay(genreNames);
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
  const runtimeLabel = formatRuntimeMinutes(movie?.runtime_minutes);
  const escapedRuntime = runtimeLabel ? escapeHtml(runtimeLabel) : '';
  const pageUrl = buildMoviePageUrl(movie);
  const escapedPageUrl = escapeHtml(pageUrl);
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
    posterUrl: getMoviePreferredPosterUrl(movie),
    pageUrl,
    escapedPageUrl,
    escapedTitle,
    escapedOriginalTitle,
    escapedDirector,
    escapedGenres,
    escapedCountries,
    escapedRuntime,
    escapedPosterAlt: escapeHtml(`Постер фильма ${titleText}`),
    escapedPageLabel: escapeHtml(`Открыть страницу фильма ${titleText}`),
    externalLinksToggleHtml,
    externalLinksBlockHtml,
    staticDetailsHtml: `
      <h5 class="movie-title">
        <a href="${escapedPageUrl}" class="movie-title-link">${escapedTitle}</a>
      </h5>

      ${originalTitleText ? `<p>Оригинальное название: ${escapedOriginalTitle}</p>` : ''}
      <p>Год: ${escapeHtml(movie?.year ?? '-')}</p>
      <p>Режиссёр: ${escapedDirector}</p>
      <p>Жанры: ${escapedGenres}</p>
      <p>Страны: ${escapedCountries}</p>
      ${escapedRuntime ? `<p>Время: ${escapedRuntime}</p>` : ''}
    `
  };
}

function rebuildCatalogMovieMeta() {
  const movies = Array.isArray(allMovies) ? allMovies : [];
  const catalogGenreNames = new Set();
  const catalogCountryNames = new Set();

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
  const avatarUrl = isAuthenticated ? getPublicProfileAvatarUrl(currentUserProfile) : '';

  openAuthModalButton.classList.toggle('is-authenticated', isAuthenticated);
  openAuthModalButton.classList.toggle('has-avatar', Boolean(avatarUrl));
  openAuthModalButton.setAttribute(
    'aria-label',
    isAuthenticated ? 'Меню аккаунта' : 'Вход или регистрация'
  );
  openAuthModalButton.setAttribute(
    'title',
    isAuthenticated ? 'Меню аккаунта' : 'Вход или регистрация'
  );

  if (avatarUrl) {
    if (openAuthModalButton.dataset.avatarUrl !== avatarUrl) {
      openAuthModalButton.innerHTML = `
        <img
          class="auth-icon-avatar"
          src="${escapeHtml(avatarUrl)}"
          alt=""
          aria-hidden="true"
        >
      `;
      openAuthModalButton.dataset.avatarUrl = avatarUrl;
    }
  } else if (openAuthModalButton.dataset.avatarUrl || openAuthModalButton.classList.contains('has-avatar')) {
    openAuthModalButton.innerHTML = authIconButtonDefaultHtml;
    delete openAuthModalButton.dataset.avatarUrl;
  }

  if (!isAuthenticated) {
    closeAuthPopoverMenu();
  }

  ensureAuthNotificationBadgeElement();
}

function ensureAuthNotificationBadgeElement() {
  if (!openAuthModalButton) {
    return null;
  }

  const existingBadge = openAuthModalButton.querySelector('#authNotificationBadge');

  if (existingBadge) {
    return existingBadge;
  }

  const badge = document.createElement('span');

  badge.id = 'authNotificationBadge';
  badge.className = 'auth-notification-badge';
  badge.hidden = true;
  openAuthModalButton.appendChild(badge);

  return badge;
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

function syncBodyScrollLock() {
  const shouldLockScroll = (
    isModalOpen ||
    isAuthModalOpen ||
    (displayNameModal && displayNameModal.classList.contains('is-open')) ||
    (filtersModal && filtersModal.classList.contains('is-open')) ||
    (mobileRatingModal && mobileRatingModal.classList.contains('is-open')) ||
    Boolean(getLoadedMoviePageInteractionsController()?.isMovieTrailerModalOpen()) ||
    (avatarCropModal && avatarCropModal.classList.contains('is-open'))
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

async function closeAuthModal(options = {}) {
  if (!authModal) {
    return;
  }

  const shouldCancelPasswordRecovery = isPasswordRecoveryMode && !options.skipPasswordRecoveryCancel;

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
  runtimeMinutesInput = document.getElementById('runtimeMinutes');
  directorInput = document.getElementById('director');
  posterFileInput = document.getElementById('posterFile');
  posterFileName = document.getElementById('posterFileName');
  moviePosterImagesList = document.getElementById('moviePosterImagesList');
  kinopoiskUrlInput = document.getElementById('kinopoiskUrl');
  imdbUrlInput = document.getElementById('imdbUrl');
  letterboxdUrlInput = document.getElementById('letterboxdUrl');
  letterboxdShortUrlInput = document.getElementById('letterboxdShortUrl');
  rottentomatoesUrlInput = document.getElementById('rottentomatoesUrl');
  tmdbUrlInput = document.getElementById('tmdbUrl');
  trailerUrlInput = document.getElementById('trailerUrl');
  genresInput = document.getElementById('genresInput');
  countriesInput = document.getElementById('countriesInput');
  productionInput = document.getElementById('productionInput');
  distributionInput = document.getElementById('distributionInput');
  russianDistributionInput = document.getElementById('russianDistributionInput');
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

  posterFileInput?.addEventListener('change', () => {
    addMoviePosterImageDraftFiles(posterFileInput.files);
    posterFileInput.value = '';
    updatePosterFileUi();
  });

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

  moviePosterImagesList?.addEventListener('click', handleMoviePosterImagesDraftClick);
  moviePosterImagesList?.addEventListener('dragstart', handleMoviePosterImagesDraftDragStart);
  moviePosterImagesList?.addEventListener('dragend', handleMoviePosterImagesDraftDragEnd);
  moviePosterImagesList?.addEventListener('dragover', handleMoviePosterImagesDraftDragOver);
  moviePosterImagesList?.addEventListener('drop', handleMoviePosterImagesDraftDrop);

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

  if (manualSimilarMovieSelect) {
    refreshCustomSelect(manualSimilarMovieSelect);
  }

  return Boolean(movieModal && movieForm);
}

async function openMovieModal() {
  try {
    await ensureMovieEditorControllerLoaded();
  } catch (error) {
    console.warn('Не удалось загрузить редактор фильма:', error);
    return;
  }

  try {
    await ensureCustomSelectToolsLoaded();
  } catch (error) {
    console.warn('Не удалось загрузить кастомные селекты для модалки фильма:', error);
  }

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

  refreshDynamicFilterOptions();
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
  movieEditorController?.setMovieFormSubmittingUiState(isSubmitting);

  if (openAddMovieButton) {
    openAddMovieButton.disabled = isSubmitting;
  }

  renderMoviePosterImagesDraftList();
}

function setMovieFormStatus(message) {
  if (movieEditorController?.setMovieFormStatus) {
    movieEditorController.setMovieFormStatus(message);
    return;
  }

  if (formMessage) {
    formMessage.textContent = message;
  }
}

function resetFormToCreateMode() {
  if (!ensureMovieModalMounted()) {
    return;
  }

  editingMovieId = null;
  movieEditorController?.resetMovieFormToCreateMode();
  resetMoviePosterImagesDraft();
  setManualSimilarDraft([]);
  refreshCustomSelect(releaseMonthInput);
}

async function fillFormForEdit(movie) {
  try {
    await ensureMovieEditorControllerLoaded();
  } catch (error) {
    console.warn('Movie editor controller failed to load before edit form fill:', error);
    return;
  }

  if (!ensureMovieModalMounted()) {
    return;
  }

  editingMovieId = movie.id;

  movieEditorController.fillMovieFormForEdit(movie);

  setMoviePosterImagesDraftFromMovie(movie, getMoviePosterImages(movie.id));
  ensureMoviePosterImagesEditorDataLoaded(movie).catch(error => {
    console.warn('Не удалось загрузить галерею постеров для формы:', error);
  });

  setManualSimilarDraft(getManualSimilarMovieIds(movie.id));
  ensureManualSimilarEditorDataLoaded(movie.id).catch(error => {
    console.warn('Не удалось загрузить ручные похожие фильмы для формы:', error);
  });

  refreshCustomSelect(releaseMonthInput);

  void openMovieModal();
}

function updateAuthUI() {
  const shouldShowAuthenticatedUi = shouldUseAuthenticatedUi();

  syncAuthIconButtonState();
  syncDisplayNameButton();
  syncProfilePosterPreferenceControls(currentUserProfile);
  syncUserPageProfileSettingsButton();

  if (!shouldShowAuthenticatedUi) {
    closeAuthPopoverMenu();
    closeDisplayNameModal();
  }

  if (loginForm) {
    loginForm.classList.toggle('is-visible', !shouldShowAuthenticatedUi);
  }

  if (adminPanel) {
    adminPanel.classList.toggle('is-visible', shouldShowAuthenticatedUi && isAdmin && isCatalogPage());
  }

  if (profileSummaryButton) {
    syncAuthPopoverNavigationLink(
      profileSummaryButton,
      buildUserPageUrl(getCurrentUserPublicHandle()),
      shouldShowAuthenticatedUi
    );
  }

  if (followingSummaryButton) {
    syncAuthPopoverNavigationLink(
      followingSummaryButton,
      buildFollowingPageUrl(),
      shouldShowAuthenticatedUi
    );
  }

  if (notificationsSummaryButton) {
    syncAuthPopoverNavigationLink(
      notificationsSummaryButton,
      buildNotificationsPageUrl(),
      shouldShowAuthenticatedUi
    );
  }

  if (editorCenterSummaryButton) {
    syncAuthPopoverNavigationLink(
      editorCenterSummaryButton,
      buildEditorPageUrl(),
      shouldShowAuthenticatedUi && isAdmin
    );
  }

  if (directorsAdminSummaryButton) {
    syncAuthPopoverNavigationLink(
      directorsAdminSummaryButton,
      buildDirectorsAdminPageUrl(),
      shouldShowAuthenticatedUi && isAdmin
    );
  }

  if (shouldShowAuthenticatedUi) {
    scheduleNotificationsUnreadRefresh();
  } else {
    notificationsUnreadCount = 0;
    notificationsUnreadUserId = '';
    notificationsUnreadFetchedAt = 0;
    syncNotificationsBadgeUi();
  }

  if (moviePageAdminActions) {
    moviePageAdminActions.classList.toggle('is-visible', shouldShowAuthenticatedUi && isAdmin && isMoviePage());
  }

  if (manualSimilarAuditButton) {
    manualSimilarAuditButton.hidden = !(shouldShowAuthenticatedUi && isAdmin);
    manualSimilarAuditButton.disabled = isManualSimilarAuditRunning;
  }

  if (completenessAuditButton) {
    completenessAuditButton.hidden = !(shouldShowAuthenticatedUi && isAdmin);
    completenessAuditButton.disabled = isCompletenessAuditRunning;
  }

  if (databaseExportButton) {
    databaseExportButton.hidden = !(shouldShowAuthenticatedUi && isAdmin);
    databaseExportButton.disabled = isDatabaseExportRunning;
  }

  if (notificationTestButton) {
    notificationTestButton.hidden = !(shouldShowAuthenticatedUi && isAdmin);
    notificationTestButton.disabled = isNotificationTestRunning;
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

const filterCustomSelectElements = [
  genreFilter,
  subgenreFilter,
  formatFilter,
  countryFilter,
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

function createNoopCustomSelectManager() {
  return {
    initCustomSelects: () => {},
    refreshCustomSelect: () => {},
    closeAllCustomSelects: () => {},
    bindGlobalEvents: () => {}
  };
}

function createCurrentCustomSelectManager() {
  if (typeof createCustomSelectManager !== 'function') {
    return createNoopCustomSelectManager();
  }

  return createCustomSelectManager({
    selectElements: customSelectElements,
    normalizeSearchText
  });
}

let customSelectManager = createCurrentCustomSelectManager();
let isRealCustomSelectManagerReady = typeof createCustomSelectManager === 'function';

function initCustomSelects() {
  customSelectManager.initCustomSelects();
}

function refreshCustomSelect(selectElement) {
  customSelectManager.refreshCustomSelect(selectElement);
}

function closeAllCustomSelects(exceptElement = null) {
  customSelectManager.closeAllCustomSelects(exceptElement);
}

function bindCustomSelectGlobalEvents() {
  customSelectManager.bindGlobalEvents();
}

async function ensureCustomSelectToolsLoaded() {
  if (isRealCustomSelectManagerReady) {
    return customSelectManager;
  }

  await loadCustomSelectScript();
  customSelectManager = createCurrentCustomSelectManager();
  isRealCustomSelectManagerReady = typeof createCustomSelectManager === 'function';

  bindCustomSelectGlobalEvents();
  initCustomSelects();

  return customSelectManager;
}

function refreshCustomSelectGroup(selectElements) {
  selectElements.forEach(selectElement => {
    refreshCustomSelect(selectElement);
  });
}

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
  const subgenreKeys = subgenreCounts.has(selectedSubgenre) || !selectedSubgenre
    ? Array.from(subgenreCounts.keys())
    : [...subgenreCounts.keys(), selectedSubgenre];

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
  const formatKeys = formatCounts.has(selectedFormat) || !selectedFormat
    ? Array.from(formatCounts.keys())
    : [...formatCounts.keys(), selectedFormat];

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

const MOVIE_DETAIL_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  runtime_minutes,
  director,
  production,
  distribution,
  russian_distribution,
  synopsis,
  formats,
  tags_perceived,
  poster_url,
  kinopoisk_url,
  imdb_url,
  letterboxd_url,
  rottentomatoes_url,
  tmdb_url,
  trailer_url,
  release_year,
  release_month,
  movie_genres (
    position,
    genres (name)
  ),
  movie_countries (
    countries (name)
  )
`;

const MOVIE_EDITOR_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  runtime_minutes,
  director,
  production,
  distribution,
  russian_distribution,
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
  tmdb_url,
  trailer_url,
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
  runtime_minutes,
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

const MOVIE_USER_PAGE_CARD_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  poster_url
`;

const MOVIE_USER_PAGE_TASTE_SELECT = `
  id,
  year,
  tags_perceived,
  movie_genres (
    position,
    genres (name)
  ),
  movie_countries (
    countries (name)
  )
`;

const MOVIE_SIMILAR_CARD_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  director,
  poster_url,
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
    return MOVIE_DETAIL_SELECT;
  }

  return MOVIE_CATALOG_SELECT;
}

const OPTIONAL_MOVIE_SELECT_COLUMNS = ['trailer_url', 'runtime_minutes', 'tmdb_url'];
let movieRuntimeMinutesColumnAvailable = true;
let movieTmdbUrlColumnAvailable = true;

function getMissingOptionalMovieColumn(error) {
  const message = String(error?.message || '').toLowerCase();

  return OPTIONAL_MOVIE_SELECT_COLUMNS.find(columnName => message.includes(columnName)) || '';
}

function isMissingOptionalMovieColumnError(error) {
  const missingColumn = getMissingOptionalMovieColumn(error);

  return Boolean(
    missingColumn &&
    (
      error?.code === '42703' ||
      error?.code === 'PGRST204' ||
      String(error?.message || '').toLowerCase().includes('schema cache')
    )
  );
}

function markMissingOptionalMovieColumn(columnName) {
  if (columnName === 'runtime_minutes') {
    movieRuntimeMinutesColumnAvailable = false;
  }

  if (columnName === 'tmdb_url') {
    movieTmdbUrlColumnAvailable = false;
  }
}

function getMovieSelectWithoutOptionalColumn(selectQuery, columnName) {
  const safeColumnName = String(columnName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return String(selectQuery || '').replace(new RegExp(`\\n\\s*${safeColumnName},\\s*`, 'g'), '\n');
}

async function runMovieSelectWithOptionalColumns(createQuery, selectQuery) {
  let currentSelectQuery = selectQuery;
  let result = await createQuery(currentSelectQuery);

  while (result.error && isMissingOptionalMovieColumnError(result.error)) {
    const missingColumn = getMissingOptionalMovieColumn(result.error);

    if (!missingColumn || !String(currentSelectQuery || '').includes(missingColumn)) {
      break;
    }

    markMissingOptionalMovieColumn(missingColumn);
    currentSelectQuery = getMovieSelectWithoutOptionalColumn(currentSelectQuery, missingColumn);
    result = await createQuery(currentSelectQuery);
  }

  if (result.error) {
    return result;
  }

  if (String(currentSelectQuery || '').includes('runtime_minutes')) {
    movieRuntimeMinutesColumnAvailable = true;
  }

  if (String(currentSelectQuery || '').includes('tmdb_url')) {
    movieTmdbUrlColumnAvailable = true;
  }

  return {
    data: result.data || null,
    error: null
  };
}

function hasMovieDetailPayload(movie) {
  return Boolean(
    movie &&
    Object.prototype.hasOwnProperty.call(movie, 'synopsis') &&
    Object.prototype.hasOwnProperty.call(movie, 'tags_perceived')
  );
}

function hasMovieEditorPayload(movie) {
  return Boolean(
    hasMovieDetailPayload(movie) &&
    Object.prototype.hasOwnProperty.call(movie, 'search_aliases') &&
    Object.prototype.hasOwnProperty.call(movie, 'sort_order') &&
    Object.prototype.hasOwnProperty.call(movie, 'letterboxd_short_url')
  );
}

async function fetchMovies({ preserveExistingCatalogOnError = false, purpose = 'catalog' } = {}) {
  const { data, error } = await runMovieSelectWithOptionalColumns(
    selectQuery => supabaseClient
      .from('movies')
      .select(selectQuery)
      .order('title', { ascending: true })
      .order('position', { foreignTable: 'movie_genres', ascending: true }),
    getMovieSelectByPurpose(purpose)
  );

  if (error) {
    if (!preserveExistingCatalogOnError) {
      moviesLoadedSuccessfully = false;
    }

    console.error('Ошибка загрузки фильмов:', error);
  
    if (container && !preserveExistingCatalogOnError) {
      hideMoviesResultCount();
      setCatalogBusyState(false);
      container.innerHTML = 'Ошибка загрузки фильмов. Открой консоль F12.';
    }

    return false;
  }

  allMovies = data || [];
  await ensurePreferredPosterImagesForMovies(allMovies);
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

function hasUserScopedCatalogControlsActive() {
  return Boolean(
    shouldUseAuthenticatedUi() &&
    (
      watchlistFilter?.value ||
      watchedFilter?.value
    )
  );
}

function hasUserScopedCatalogState(catalogState) {
  return Boolean(
    catalogState &&
    (
      catalogState.watchlist ||
      catalogState.watched
    )
  );
}

function getRenderedCatalogMovieIds() {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('.movie-card[data-movie-id]:not(.movie-card-skeleton)'))
    .map(card => String(card.dataset.movieId || '').trim())
    .filter(Boolean);
}

function getCatalogUserCardStateFingerprint(movieId) {
  const movieKey = String(movieId || '');
  const currentUserRating = getCurrentUserRating(movieKey);
  const watchlistState = currentUserWatchlistMovieIds.has(movieKey) ? 'watchlist' : '';

  return `${currentUserRating ?? ''}|${watchlistState}`;
}

function getCatalogUserCardStateByMovieId(movieIds = []) {
  const stateByMovieId = new Map();

  (Array.isArray(movieIds) ? movieIds : [])
    .map(movieId => String(movieId || '').trim())
    .filter(Boolean)
    .forEach(movieId => {
      stateByMovieId.set(movieId, getCatalogUserCardStateFingerprint(movieId));
    });

  return stateByMovieId;
}

function getChangedCatalogUserCardMovieIds(previousStateByMovieId) {
  if (!(previousStateByMovieId instanceof Map) || previousStateByMovieId.size === 0) {
    return [];
  }

  return Array.from(previousStateByMovieId.entries())
    .filter(([movieId, previousFingerprint]) => (
      previousFingerprint !== getCatalogUserCardStateFingerprint(movieId)
    ))
    .map(([movieId]) => movieId);
}

function shouldAwaitUserStateForCatalogLoad({
  forceAwaitUserState = false
} = {}) {
  if (!shouldUseAuthenticatedUi()) {
    return false;
  }

  return Boolean(
    forceAwaitUserState ||
    hasUserScopedCatalogControlsActive()
  );
}

async function fetchCatalogUserState({
  skipCurrentUserRatings = false
} = {}) {
  if (!shouldUseAuthenticatedUi()) {
    await fetchMovieWatchlist();
    return;
  }

  await Promise.all([
    skipCurrentUserRatings ? Promise.resolve() : fetchCurrentUserRatings(),
    fetchMovieWatchlist()
  ]);
}

function loadDeferredCatalogUserState({
  userIdAtLoadStart = currentUser?.id || null,
  skipCurrentUserRatings = false
} = {}) {
  if (!shouldUseAuthenticatedUi()) {
    return;
  }

  const renderedUserStateBeforeLoad = getCatalogUserCardStateByMovieId(getRenderedCatalogMovieIds());

  fetchCatalogUserState({ skipCurrentUserRatings })
    .then(() => {
      if (
        !isCatalogPage() ||
        userIdAtLoadStart !== (currentUser?.id || null) ||
        hasUserScopedCatalogControlsActive()
      ) {
        return;
      }

      persistCatalogSessionSnapshot();

      if (renderedUserStateBeforeLoad.size === 0) {
        rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);
        return;
      }

      const changedMovieIds = getChangedCatalogUserCardMovieIds(renderedUserStateBeforeLoad);

      if (changedMovieIds.length === 0) {
        return;
      }

      changedMovieIds.forEach(movieId => {
        rerenderMovieCard(movieId, {
          preserveCardTop: false,
          animateStateAppearance: false
        });
      });
    })
    .catch(error => {
      console.error('Ошибка фоновой загрузки пользовательского слоя каталога:', error);
    });
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

async function fetchMovieRatingStatsForMovie(movieId) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId) {
    return;
  }

  const { data, error } = await supabaseClient
    .from('movie_rating_stats')
    .select('movie_id, average_rating, votes_count, rating_sum')
    .eq('movie_id', normalizedMovieId)
    .limit(1);

  if (error) {
    console.warn('Не удалось загрузить агрегат оценки фильма, используем fallback:', error);
    await fetchFullMovieRatingsForMovieFallback(normalizedMovieId);
    return;
  }

  upsertMovieRatingStatsRows(data || [], [normalizedMovieId]);
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

async function fetchFullMovieRatingsForMovieFallback(movieId) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId) {
    return false;
  }

  const { data, error } = await supabaseClient
    .from('movie_ratings')
    .select('movie_id, user_id, rating')
    .eq('movie_id', normalizedMovieId);

  if (error) {
    console.error('Ошибка загрузки оценок фильма:', error);
    removeKnownMovieRatingRows(row => String(row.movie_id) === normalizedMovieId);
    upsertMovieRatingStatsRows([], [normalizedMovieId]);
    return false;
  }

  upsertKnownMovieRatingRows(
    data || [],
    row => String(row.movie_id) === normalizedMovieId
  );
  const existingRows = allMovieRatings.filter(row => String(row.movie_id) === normalizedMovieId);
  upsertMovieRatingStatsRows(
    getMovieRatingStatsRowsFromRatingRows(existingRows),
    [normalizedMovieId]
  );
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

async function fetchCurrentUserRatingForMovie(movieId) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !currentUser) {
    return;
  }

  const activeUserId = currentUser.id;
  const { data, error } = await supabaseClient
    .from('movie_ratings')
    .select('movie_id, user_id, rating')
    .eq('movie_id', normalizedMovieId)
    .eq('user_id', activeUserId)
    .limit(1);

  if (error) {
    console.error('Ошибка загрузки оценки текущего пользователя для фильма:', error);
    removeKnownMovieRatingRows(row => (
      String(row.movie_id) === normalizedMovieId &&
      String(row.user_id) === String(activeUserId)
    ));
    return;
  }

  upsertKnownMovieRatingRows(
    data || [],
    row => (
      String(row.movie_id) === normalizedMovieId &&
      String(row.user_id) === String(activeUserId)
    )
  );
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

async function fetchMovieWatchlistForCurrentUser(movieId) {
  const normalizedMovieId = String(movieId || '').trim();

  if (!normalizedMovieId || !shouldUseAuthenticatedUi()) {
    return;
  }

  const activeUserId = currentUser.id;
  const { data, error } = await supabaseClient
    .from('movie_watchlist')
    .select('movie_id, user_id')
    .eq('movie_id', normalizedMovieId)
    .eq('user_id', activeUserId)
    .limit(1);

  if (error) {
    console.error('Ошибка загрузки watchlist для фильма:', error);
    updateLocalWatchlistState(normalizedMovieId, false);
    return;
  }

  allMovieWatchlist = allMovieWatchlist.filter(item => !(
    String(item.movie_id) === normalizedMovieId &&
    String(item.user_id) === String(activeUserId)
  ));

  if (data?.[0]) {
    allMovieWatchlist.push(data[0]);
  }

  rebuildCurrentUserWatchlistIndex();
  markCatalogDataChanged();
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

function getUniqueMovieIdsFromRows(rows = []) {
  return [...new Set(
    (Array.isArray(rows) ? rows : [])
      .map(row => String(row?.movie_id || ''))
      .filter(Boolean)
  )];
}

async function fetchCatalogProfileActivityMovieIds(userId, activityKey) {
  catalogProfileActivityRatingsByMovieId = new Map();

  if (!userId || !CATALOG_PROFILE_ACTIVITY_KEYS.has(activityKey)) {
    return [];
  }

  if (activityKey === 'ratings') {
    const { data, error } = await supabaseClient
      .from('movie_ratings')
      .select('movie_id, rating')
      .eq('user_id', userId);

    throwIfSupabaseError(error);

    catalogProfileActivityRatingsByMovieId = new Map(
      (data || [])
        .map(row => {
          const movieId = String(row?.movie_id || '');
          const rating = Number(row?.rating);

          return movieId && Number.isFinite(rating)
            ? [movieId, rating]
            : null;
        })
        .filter(Boolean)
    );

    return getUniqueMovieIdsFromRows(data || []);
  }

  if (activityKey === 'reviews') {
    const { data, error } = await supabaseClient
      .from('movie_reviews')
      .select('movie_id')
      .eq('user_id', userId);

    throwIfSupabaseError(error);

    return getUniqueMovieIdsFromRows(data || []);
  }

  const [watchlistResult, ratingsResult] = await Promise.all([
    supabaseClient
      .from('movie_watchlist')
      .select('movie_id')
      .eq('user_id', userId),
    supabaseClient
      .from('movie_ratings')
      .select('movie_id')
      .eq('user_id', userId)
  ]);

  throwIfSupabaseError(watchlistResult.error);
  throwIfSupabaseError(ratingsResult.error);

  const ratedMovieIds = new Set(getUniqueMovieIdsFromRows(ratingsResult.data || []));

  return getUniqueMovieIdsFromRows(watchlistResult.data || [])
    .filter(movieId => !ratedMovieIds.has(String(movieId)));
}

async function ensureCatalogProfileActivityContextLoaded() {
  if (!isCatalogProfileActivityActive()) {
    return;
  }

  if (catalogProfileActivityLoaded) {
    return;
  }

  if (catalogProfileActivityLoadingPromise) {
    await catalogProfileActivityLoadingPromise;
    return;
  }

  catalogProfileActivityLoadingPromise = (async () => {
    try {
      const profile = await fetchPublicUserProfileByHandle(catalogProfileActivityHandle);

      catalogProfileActivityUserId = String(profile?.id || '');
      catalogProfileActivityDisplayName = profile ? getPublicProfileDisplayName(profile) : catalogProfileActivityHandle;

      if (!profile?.id) {
        catalogProfileActivityMovieIds = new Set();
        catalogProfileActivityError = new Error('Пользователь не найден.');
        return;
      }

      const movieIds = await fetchCatalogProfileActivityMovieIds(profile.id, catalogProfileActivityKey);

      catalogProfileActivityMovieIds = new Set(movieIds.map(movieId => String(movieId)));
      catalogProfileActivityError = null;
    } catch (error) {
      console.error('Ошибка загрузки профильной выборки каталога:', error);
      catalogProfileActivityMovieIds = new Set();
      catalogProfileActivityError = error;
    } finally {
      catalogProfileActivityLoaded = true;
      catalogProfileActivityLoadingPromise = null;
      markCatalogDataChanged();
    }
  })();

  await catalogProfileActivityLoadingPromise;
}

async function reloadMoviePageData(movieId) {
  if (!movieId) {
    return null;
  }

  const rpcMovie = await fetchMoviePagePayloadByRouteParams({ id: movieId, slug: null });

  if (rpcMovie) {
    await Promise.all([
      fetchMovieReviews(movieId),
      fetchMovieComments(movieId)
    ]);
    return rpcMovie;
  }

  const [movie] = await Promise.all([
    fetchMovieById(movieId),
    fetchMovieRatingStatsForMovie(movieId),
    fetchCurrentUserRatingForMovie(movieId),
    fetchMovieWatchlistForCurrentUser(movieId),
    fetchMovieReviews(movieId),
    fetchMovieComments(movieId),
    fetchMoviePosterImagesForMovieSafe(movieId, { force: true })
  ]);

  return movie;
}

async function reloadCatalogData({
  showSkeleton = false,
  refreshFilters = true,
  awaitUserState = false,
  loadDeferredUserState = true
} = {}) {
  const shouldShowCatalogSkeleton = showSkeleton && Boolean(container);
  const shouldPreserveExistingCatalogOnMovieLoadError = (
    !shouldShowCatalogSkeleton &&
    moviesLoadedSuccessfully
  );
  const userIdAtLoadStart = currentUser?.id || null;
  let hasFullRatingRows = false;

  shouldFadeCatalogAfterSkeleton = shouldShowCatalogSkeleton;

  if (shouldShowCatalogSkeleton) {
    renderMoviesSkeleton(getCatalogSkeletonCardsCount());
  }

  await Promise.all([
    fetchMovies({
      preserveExistingCatalogOnError: shouldPreserveExistingCatalogOnMovieLoadError
    }),
    fetchMovieRatingStats().then(result => {
      hasFullRatingRows = Boolean(result);
    }),
    fetchCatalogReviewSummary()
  ]);

  const shouldAwaitCatalogUserState = shouldAwaitUserStateForCatalogLoad({
    forceAwaitUserState: awaitUserState
  });

  if (shouldAwaitCatalogUserState || !shouldUseAuthenticatedUi()) {
    await fetchCatalogUserState({
      skipCurrentUserRatings: hasFullRatingRows
    });
  }

  if (refreshFilters) {
    refreshDynamicFilterOptions();
  }

  persistCatalogSessionSnapshot();

  if (shouldAwaitCatalogUserState || !shouldUseAuthenticatedUi()) {
    return {
      hasFullRatingRows,
      didAwaitUserState: true
    };
  }

  if (loadDeferredUserState) {
    loadDeferredCatalogUserState({
      userIdAtLoadStart,
      skipCurrentUserRatings: hasFullRatingRows
    });
  }

  return {
    hasFullRatingRows,
    didAwaitUserState: false
  };
}

function preserveWindowScrollPosition(callback) {
  const currentScrollY = window.scrollY;

  callback();

  requestAnimationFrame(() => {
    scrollWindowToPosition(currentScrollY);
  });
}

function restoreWindowScrollPositionOnNextFrames(scrollY) {
  if (scrollY === null || scrollY === undefined) {
    return;
  }

  const normalizedScrollY = Number(scrollY);

  if (!Number.isFinite(normalizedScrollY) || normalizedScrollY < 0) {
    return;
  }

  requestAnimationFrame(() => {
    scrollWindowToPosition(normalizedScrollY);
    requestAnimationFrame(() => {
      scrollWindowToPosition(normalizedScrollY);
    });
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
  if (!watchedFilter || !watchlistFilter || !ratingFromFilter || !ratingToFilter) {
    return false;
  }

  return Boolean(
    watchedFilter.value ||
    watchlistFilter.value ||
    ratingFromFilter.value !== '' ||
    ratingToFilter.value !== ''
  );
}

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

function clearSearchInput({ skipSave = false } = {}) {
  if (!searchInput.value) {
    return;
  }

  searchInput.value = '';
  lastSearchQuery = '';

  if (searchClearBtn) {
    searchClearBtn.classList.remove('is-visible');
  }

  if (!skipSave) {
    saveCatalogState();
  }
}

function resetFilterControls({
  preserveSearch = false,
  preservePage = false,
  preserveProfileActivity = false,
  skipSave = false
} = {}) {
  if (!preservePage) {
    resetCatalogPaginationPage();
  }

  if (!preserveSearch) {
    clearSearchInput({ skipSave });
  }

  genreFilter.value = '';
  subgenreFilter.value = '';
  formatFilter.value = '';
  countryFilter.value = '';
  runtimeFromFilter.value = '';
  runtimeToFilter.value = '';
  yearFromFilter.value = '';
  yearToFilter.value = '';
  ratingFromFilter.value = '';
  ratingToFilter.value = '';
  reviewedOnlyFilter = false;
  watchlistFilter.value = '';
  watchedFilter.value = '';

  if (!preserveProfileActivity) {
    clearCatalogProfileActivitySelection();
  }

  refreshCustomSelectGroup(
    filterCustomSelectElements.filter(selectElement => selectElement !== sortMode)
  );
  refreshCatalogRangeControls();

  if (!skipSave) {
    saveCatalogState();
  }
}

function resetCatalogFiltersAndRerender({ preserveSearch = false, preserveProfileActivity = false } = {}) {
  resetFilterControls({ preserveSearch, preserveProfileActivity });
  saveCatalogStateAndRenderFilters();
}

function clearSearchAndRerenderPreservingPosition() {
  clearSearchInput();
  resetCatalogPaginationPage();
  refreshDynamicFilterOptions();
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
  const hasYearFilter = Boolean(yearFromFilter.value || yearToFilter.value);
  const hasRatingFilter = Boolean(ratingFromFilter.value || ratingToFilter.value);
  const hasRuntimeFilter = Boolean(runtimeFromFilter.value || runtimeToFilter.value);
  const hasAuthPresetFilter = Boolean(currentUser && (watchlistFilter.value || watchedFilter.value));

  if (
    normalizeSearchText(searchInput.value) === 'астрал' &&
    !reviewedOnlyFilter &&
    !hasGenreFilter &&
    !hasSubgenreFilter &&
    !hasFormatFilter &&
    !hasCountryFilter &&
    !hasYearFilter &&
    !hasRatingFilter &&
    !hasRuntimeFilter &&
    !hasAuthPresetFilter
  ) {
    return 'astrals';
  }

  if (
    runtimeFromFilter.value === '' &&
    runtimeToFilter.value === '90' &&
    !hasSearchQuery &&
    !reviewedOnlyFilter &&
    !hasGenreFilter &&
    !hasSubgenreFilter &&
    !hasFormatFilter &&
    !hasCountryFilter &&
    !hasYearFilter &&
    !hasRatingFilter &&
    !hasAuthPresetFilter
  ) {
    return 'short-runtime';
  }

  if (
    hasSearchQuery ||
    hasGenreFilter ||
    hasSubgenreFilter ||
    hasFormatFilter ||
    hasCountryFilter ||
    hasYearFilter ||
    hasRuntimeFilter
  ) {
    return null;
  }

  if (
    reviewedOnlyFilter &&
    !hasRatingFilter &&
    !hasAuthPresetFilter
  ) {
    return 'with-reviews';
  }

  if (
    ratingFromFilter.value === '7' &&
    ratingToFilter.value === '' &&
    !hasAuthPresetFilter
  ) {
    return 'top-rated';
  }

  if (
    ratingFromFilter.value === '1' &&
    ratingToFilter.value === '3' &&
    !hasAuthPresetFilter
  ) {
    return 'low-rated';
  }

  if (
    ratingFromFilter.value === '0' &&
    ratingToFilter.value === '0' &&
    !hasAuthPresetFilter
  ) {
    return 'unrated';
  }

  if (
    currentUser &&
    watchlistFilter.value === 'in_watchlist' &&
    !watchedFilter.value &&
    !hasRatingFilter
  ) {
    return 'watchlist';
  }

  if (
    currentUser &&
    watchedFilter.value === 'watched' &&
    !watchlistFilter.value &&
    !hasRatingFilter
  ) {
    return 'watched';
  }

  if (
    currentUser &&
    watchedFilter.value === 'unwatched' &&
    !watchlistFilter.value &&
    !hasRatingFilter
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

  scheduleQuickPresetsScrollHint();
}

function getCatalogRoutePresetKey() {
  const presetKey = String(
    new URLSearchParams(window.location.search).get(CATALOG_PRESET_QUERY_PARAM) || ''
  ).trim();

  return CATALOG_ROUTE_PRESET_KEYS.has(presetKey) ? presetKey : '';
}

function canApplyQuickPreset(presetKey) {
  return !AUTH_REQUIRED_CATALOG_PRESET_KEYS.has(presetKey) || Boolean(currentUser);
}

function applyQuickPreset(presetKey, { preservePage = false, urlMode = 'push' } = {}) {
  if (!canApplyQuickPreset(presetKey)) {
    return false;
  }

  const preserveProfileActivity = isCatalogProfileActivityActive();
  const shouldRemoveActivePreset = getActiveQuickPresetKey() === presetKey;

  if (shouldRemoveActivePreset) {
    resetFilterControls({
      preservePage,
      preserveProfileActivity,
      skipSave: true
    });

    syncCatalogViewToggleButton();
    refreshDynamicFilterOptions();
    saveCatalogStateAndRender(renderMovies, { urlMode });

    return true;
  }

  const shouldShowAstralPresetToast = (
    presetKey === 'astrals' &&
    searchInput &&
    searchInput.value.trim() === ''
  );

  resetFilterControls({
    preservePage,
    preserveProfileActivity,
    skipSave: true
  });

  if (presetKey === 'top-rated') {
    ratingFromFilter.value = '7';
    ratingToFilter.value = '';
  }

  if (presetKey === 'low-rated') {
    ratingFromFilter.value = '1';
    ratingToFilter.value = '3';
  }

  if (presetKey === 'unrated') {
    ratingFromFilter.value = '0';
    ratingToFilter.value = '0';
  }

  if (presetKey === 'short-runtime') {
    runtimeFromFilter.value = '';
    runtimeToFilter.value = '90';
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

  refreshCustomSelectGroup([watchlistFilter, watchedFilter]);

  syncCatalogViewToggleButton();
  refreshDynamicFilterOptions();
  saveCatalogStateAndRender(renderMovies, { urlMode });

  return true;
}

function getActiveFilterChips() {
  const chips = [];
  const profileActivityChipLabel = getCatalogProfileActivityChipLabel();

  if (profileActivityChipLabel) {
    chips.push({
      label: profileActivityChipLabel,
      key: 'profile-activity',
      variant: 'profile-context'
    });
  }

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

  const runtimeRange = getCatalogRangeBounds(
    runtimeFromFilter.value,
    runtimeToFilter.value,
    getCatalogRangeInputOptions('runtime')
  );

  if (runtimeRange.hasRange) {
    chips.push({
      label: formatCatalogRangeLabel('Время', runtimeRange.from, runtimeRange.to, {
        valueFormatter: formatRuntimeMinutes
      }),
      key: 'runtime'
    });
  }

  const yearRange = getCatalogRangeBounds(
    yearFromFilter.value,
    yearToFilter.value,
    getCatalogRangeInputOptions('year')
  );

  if (yearRange.hasRange) {
    chips.push({
      label: formatCatalogRangeLabel('Год', yearRange.from, yearRange.to),
      key: 'year'
    });
  }

  if (countryFilter.value) {
    chips.push({ label: `Страна: ${countryFilter.value}`, key: 'country' });
  }

  const ratingRange = getCatalogRangeBounds(
    ratingFromFilter.value,
    ratingToFilter.value,
    getCatalogRangeInputOptions('rating')
  );

  if (ratingRange.hasRange) {
    chips.push({
      label: formatCatalogRangeLabel('Рейтинг', ratingRange.from, ratingRange.to),
      key: 'rating'
    });
  }

  return chips;
}

function getFilterModalActiveChips() {
  return getActiveFilterChips().filter(chip => chip.key !== 'profile-activity');
}

function updateFiltersModalStatus() {
  if (!filtersModalStatus || !resetFiltersTopButton) {
    return;
  }

  const activeFiltersCount = getFilterModalActiveChips().length;
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

  const activeFiltersCount = getFilterModalActiveChips().length;
  const hasActiveFilters = activeFiltersCount > 0;

  openFiltersButton.textContent = hasActiveFilters
    ? `Фильтровать (${activeFiltersCount})`
    : 'Фильтровать';

  openFiltersButton.classList.toggle('is-active', hasActiveFilters);
  updateFiltersModalStatus();
}

function clearFilterChip(filterKey) {
  if (filterKey === 'profile-activity') {
    clearCatalogProfileActivitySelection();
  }

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

  if (filterKey === 'runtime') {
    runtimeFromFilter.value = '';
    runtimeToFilter.value = '';
  }

  if (filterKey === 'year') {
    yearFromFilter.value = '';
    yearToFilter.value = '';
  }

  if (filterKey === 'country') {
    countryFilter.value = '';
    refreshCustomSelect(countryFilter);
  }

  if (filterKey === 'rating') {
    ratingFromFilter.value = '';
    ratingToFilter.value = '';
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
  activeFiltersBar.innerHTML = chips.map(chip => {
    const removeLabel = chip.key === 'profile-activity'
      ? 'Убрать профильный срез'
      : 'Убрать фильтр';

    return `
    <div class="active-filter-chip ${chip.variant === 'profile-context' ? 'is-profile-context' : ''}">
      <span>${escapeHtml(chip.label)}</span>
      <button
        type="button"
        class="active-filter-chip-remove"
        data-filter-key="${escapeHtml(chip.key)}"
        aria-label="${escapeHtml(removeLabel)}"
        title="${escapeHtml(removeLabel)}"
      >
        ×
      </button>
    </div>
  `;
  }).join('');

  activeFiltersBar.querySelectorAll('.active-filter-chip-remove').forEach(button => {
    button.addEventListener('click', () => {
      clearFilterChip(button.dataset.filterKey);
    });
  });
}

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

function setBoundedPosterImageCacheEntry(cache, key, value) {
  if (!cache || !key) {
    return;
  }

  if (cache.has(key)) {
    cache.delete(key);
  }

  cache.set(key, value);

  while (cache.size > POSTER_IMAGE_CACHE_MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

function getPosterTransformUrl(publicUrl, { width, quality, resize = 'cover' } = {}) {
  const originalUrl = String(publicUrl || '').trim();
  const rawWidth = Number(width) || 0;
  const normalizedWidth = rawWidth > 0
    ? Math.max(1, Math.min(2500, rawWidth))
    : 0;
  const normalizedQuality = quality !== undefined && quality !== null && quality !== ''
    ? Math.round(Math.max(POSTER_IMAGE_MIN_QUALITY, Math.min(100, Number(quality) || POSTER_IMAGE_MIN_QUALITY)))
    : '';
  const cacheKey = `${originalUrl}|${normalizedWidth}|${normalizedQuality}|${resize}`;
  const cachedUrl = posterTransformUrlCache.get(cacheKey);

  if (cachedUrl !== undefined) {
    return cachedUrl;
  }

  const storagePath = extractPosterStoragePath(originalUrl);

  if (!storagePath || !normalizedWidth) {
    setBoundedPosterImageCacheEntry(posterTransformUrlCache, cacheKey, null);
    return null;
  }

  let parsedUrl = null;

  try {
    parsedUrl = new URL(originalUrl);
  } catch (error) {
    setBoundedPosterImageCacheEntry(posterTransformUrlCache, cacheKey, null);
    return null;
  }

  const transformedUrl = new URL(`${parsedUrl.origin}${POSTER_STORAGE_RENDER_PATH}${storagePath}`);
  const normalizedHeight = Math.round(normalizedWidth * 1.5);

  transformedUrl.searchParams.set('width', String(normalizedWidth));
  transformedUrl.searchParams.set('height', String(normalizedHeight));
  transformedUrl.searchParams.set('resize', resize);

  if (normalizedQuality !== '') {
    transformedUrl.searchParams.set('quality', String(normalizedQuality));
  }

  const transformedUrlString = transformedUrl.toString();
  setBoundedPosterImageCacheEntry(posterTransformUrlCache, cacheKey, transformedUrlString);
  return transformedUrlString;
}

function getPosterImageData(publicUrl, presetName = 'catalog') {
  const originalUrl = String(publicUrl || '').trim();
  const preset = POSTER_IMAGE_PRESETS[presetName] || POSTER_IMAGE_PRESETS.catalog;
  const cacheKey = `${originalUrl}|${presetName}`;
  const cachedImageData = posterImageDataCache.get(cacheKey);

  if (cachedImageData) {
    return cachedImageData;
  }

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
    const fallbackImageData = {
      src: originalUrl,
      srcset: '',
      sizes: '',
      fallbackSrc: '',
      originalSrc: originalUrl
    };

    setBoundedPosterImageCacheEntry(posterImageDataCache, cacheKey, fallbackImageData);
    return fallbackImageData;
  }

  const imageData = {
    src: transformedUrls[0].url,
    srcset: transformedUrls.map(item => `${item.url} ${item.width}w`).join(', '),
    sizes: preset.sizes,
    fallbackSrc: originalUrl,
    originalSrc: originalUrl
  };

  setBoundedPosterImageCacheEntry(posterImageDataCache, cacheKey, imageData);
  return imageData;
}

function getPosterImageAttributeHtml(publicUrl, presetName = 'catalog') {
  const originalUrl = String(publicUrl || '').trim();
  const cacheKey = `${originalUrl}|${presetName}`;
  const cachedAttributeHtml = posterImageAttributeHtmlCache.get(cacheKey);

  if (cachedAttributeHtml !== undefined) {
    return cachedAttributeHtml;
  }

  const imageData = getPosterImageData(originalUrl, presetName);
  const preset = POSTER_IMAGE_PRESETS[presetName] || POSTER_IMAGE_PRESETS.catalog;
  const intrinsicWidth = Number(preset.widths?.[0] || 0);
  const intrinsicHeight = intrinsicWidth > 0 ? Math.round(intrinsicWidth * 1.5) : 0;

  if (!imageData.src) {
    setBoundedPosterImageCacheEntry(posterImageAttributeHtmlCache, cacheKey, '');
    return '';
  }

  const attributeHtml = [
    `src="${escapeHtml(imageData.src)}"`,
    intrinsicWidth ? `width="${intrinsicWidth}"` : '',
    intrinsicHeight ? `height="${intrinsicHeight}"` : '',
    imageData.srcset ? `srcset="${escapeHtml(imageData.srcset)}"` : '',
    imageData.sizes ? `sizes="${escapeHtml(imageData.sizes)}"` : '',
    imageData.fallbackSrc ? `data-poster-fallback-src="${escapeHtml(imageData.fallbackSrc)}"` : '',
    imageData.originalSrc ? `data-original-poster-src="${escapeHtml(imageData.originalSrc)}"` : ''
  ].filter(Boolean).join('\n                  ');

  setBoundedPosterImageCacheEntry(posterImageAttributeHtmlCache, cacheKey, attributeHtml);
  return attributeHtml;
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

function orderLookupRowsByRequestedNames(rows, names) {
  const rowsByNormalizedName = new Map(
    (Array.isArray(rows) ? rows : [])
      .filter(row => row?.name)
      .map(row => [normalizeSearchText(row.name), row])
  );

  return (Array.isArray(names) ? names : [])
    .map(name => rowsByNormalizedName.get(normalizeSearchText(name)))
    .filter(Boolean);
}

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

  return orderLookupRowsByRequestedNames(data, names);
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

  return orderLookupRowsByRequestedNames(data, names);
}

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

async function addMovie(movieEditor) {
  const createResult = await movieEditor.submitMovieCreate({
    manualSimilarMovieIdsDraft,
    moviePosterImagesDraft,
    buildClassificationDraft: buildMovieClassificationDraftFromForm,
    normalizeManualSimilarMovieIds,
    ensureActiveSessionForWrite,
    buildUniqueMovieSlug,
    includeRuntimeMinutes: movieRuntimeMinutesColumnAvailable,
    includeTmdbUrl: movieTmdbUrlColumnAvailable,
    setStatus: setMovieFormStatus,
    replaceMovieRelations,
    replaceMovieDirectors,
    replaceManualSimilarMovies,
    replaceMoviePosterImages,
    postSaveOptions: {
      isCatalogPage: isCatalogPage(),
      isMoviePage: isMoviePage(),
      markLocalDataMutation,
      reloadCatalogData,
      rerenderCatalogAfterDataReload,
      resetFormToCreateMode,
      closeMovieModal,
      redirectToMovie: movie => {
        window.location.href = buildMoviePageUrl(movie);
      }
    }
  });

  return createResult;
}

async function updateMovie(movieEditor) {
  const existingMovie = getCatalogMovieById(editingMovieId)
    || (currentMoviePageMovieData && currentMoviePageMovieData.id === editingMovieId
      ? currentMoviePageMovieData
      : null);
  const updateResult = await movieEditor.submitMovieUpdate({
    movieId: editingMovieId,
    existingMovie,
    manualSimilarMovieIdsDraft,
    moviePosterImagesDraft,
    posterImagesChanged: moviePosterImagesDraftDirty,
    buildClassificationDraft: buildMovieClassificationDraftFromForm,
    normalizeManualSimilarMovieIds,
    getManualSimilarMovieIds,
    getMovieDirectorItems,
    getDirectorDisplayName,
    ensureActiveSessionForWrite,
    ensureManualSimilarDataLoaded,
    buildUniqueMovieSlug,
    includeRuntimeMinutes: movieRuntimeMinutesColumnAvailable,
    includeTmdbUrl: movieTmdbUrlColumnAvailable,
    setStatus: setMovieFormStatus,
    setMissingMovieMessage: setMovieFormStatus,
    replaceMovieRelations,
    replaceMovieDirectors,
    replaceManualSimilarMovies,
    replaceMoviePosterImages,
    deletePosterFileByUrl,
    onDeletePosterError: deletePosterError => {
      console.error('Не удалось удалить старый постер:', deletePosterError);
    },
    postSaveOptions: {
      isCatalogPage: isCatalogPage(),
      isMoviePage: isMoviePage(),
      shouldReplaceMoviePageUrl: window.location.pathname.endsWith('movie.html'),
      markLocalDataMutation,
      reloadCatalogData,
      rerenderCatalogAfterDataReload,
      reloadMoviePageData,
      buildMoviePageUrl,
      replaceMoviePageUrl: nextMoviePageUrl => {
        window.history.replaceState({}, '', nextMoviePageUrl);
      },
      renderMoviePage,
      syncCatalogSessionSnapshotMovieState,
      loadMoviePageSimilarMovies,
      persistCurrentMoviePageSessionCache,
      renderMoviePageNotFound,
      closeMovieModal,
      resetFormToCreateMode
    }
  });

  return updateResult;
}

async function saveMovie(event) {
  event.preventDefault();

  let movieEditor = null;

  try {
    movieEditor = await ensureMovieEditorControllerLoaded();
  } catch (error) {
    console.error('Не удалось загрузить редактор фильма:', error);
    setMovieFormStatus(`Не удалось загрузить редактор фильма: ${error.message || 'смотри консоль F12.'}`);
    return;
  }

  await movieEditor.submitMovieFormEvent({
    isEditing: Boolean(editingMovieId),
    isSubmitting: isMovieFormSubmitting,
    setSubmittingState: setMovieFormSubmittingState,
    setStatus: setMovieFormStatus,
    submitCreate: () => addMovie(movieEditor),
    submitUpdate: () => updateMovie(movieEditor),
    errorMessages: {
      create: {
        logPrefix: 'Ошибка при добавлении фильма:',
        statusPrefix: 'Ошибка при добавлении фильма',
        fallbackMessage: 'смотри консоль F12.'
      },
      update: {
        logPrefix: 'Ошибка при редактировании фильма:',
        statusPrefix: 'Ошибка при редактировании фильма',
        fallbackMessage: 'смотри консоль F12.'
      }
    }
  });
}

async function deleteMovieRecord(movieId) {
  const { error } = await supabaseClient
    .from('movies')
    .delete()
    .eq('id', movieId);

  throwIfSupabaseError(error);
  markLocalDataMutation(`movie-delete:${movieId}`);
}

async function deleteMovie(movieId, movieTitle) {
  try {
    await deleteMovieRecord(movieId);

    if (editingMovieId === movieId) {
      resetFormToCreateMode();
    }

    await reloadCatalogData({ showSkeleton: false });
    rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);

    setMovieFormStatus(`Фильм "${movieTitle}" удалён.`);
  } catch (error) {
    console.error('Ошибка при удалении фильма:', error);
    setMovieFormStatus('Ошибка при удалении фильма. Смотри консоль F12.');
  }
}

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
  await Promise.all([
    loadCurrentUserRole(),
    fetchCurrentUserProfileFollows()
  ]);
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
    setDisplayNameMessage('Никнейм уже актуален.', 'success');
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

function setProfilePosterPreferenceSubmitting(isSubmitting) {
  isProfilePosterPreferenceSubmitting = isSubmitting;

  if (profileRussianPostersInput) {
    profileRussianPostersInput.disabled = isSubmitting || !profileRussianPostersColumnAvailable;
  }

  if (saveProfilePosterPreferenceButton) {
    saveProfilePosterPreferenceButton.disabled = isSubmitting || !profileRussianPostersColumnAvailable;
    saveProfilePosterPreferenceButton.textContent = isSubmitting ? 'Сохраняю...' : 'Сохранить';
  }
}

async function refreshPosterPreferenceDependentUi({ forcePosterImages = false } = {}) {
  const moviesToPrepare = [
    ...(Array.isArray(allMovies) ? allMovies : []),
    ...(currentMoviePageMovieData ? [currentMoviePageMovieData] : []),
    ...(Array.isArray(currentMoviePageSimilarMovies) ? currentMoviePageSimilarMovies : []),
    ...(Array.isArray(currentDirectorPageData?.movies) ? currentDirectorPageData.movies : [])
  ];

  await ensurePreferredPosterImagesForMovies(moviesToPrepare, { force: forcePosterImages });

  if (isCatalogPage() && container) {
    rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);
    persistCatalogSessionSnapshot({ persistDomSnapshotImmediately: true });
  }

  if (isMoviePage() && currentMoviePageMovieData) {
    renderMoviePageHeaderSection(currentMoviePageMovieData);

    if (currentMoviePageSimilarMovieId) {
      renderMoviePageSimilarSection(currentMoviePageSimilarMovieId);
    }

    persistCurrentMoviePageSessionCache();
  }

  if (isDirectorPage() && currentDirectorPageData?.director) {
    renderDirectorPage(currentDirectorPageData);
  }

  if (isUserPage() && userPageController?.reloadUserPage) {
    await userPageController.reloadUserPage();
  }

  if (isNotificationsPage() && notificationsPageController?.loadNotificationsPage) {
    await notificationsPageController.loadNotificationsPage();
  }
}

async function saveProfilePosterPreference(event) {
  event?.preventDefault();

  if (
    !currentUser ||
    isProfilePosterPreferenceSubmitting ||
    !profileRussianPostersInput ||
    !profileRussianPostersColumnAvailable
  ) {
    return;
  }

  const nextPreferRussianPosters = Boolean(profileRussianPostersInput.checked);
  const previousPreferRussianPosters = doesProfilePreferRussianPosters(currentUserProfile);

  if (nextPreferRussianPosters === previousPreferRussianPosters) {
    setProfilePosterPreferenceMessage('Настройка уже актуальна.', 'success');
    return;
  }

  setProfilePosterPreferenceSubmitting(true);
  setProfilePosterPreferenceMessage('Сохраняю...');

  try {
    ensureActiveSessionForWrite();

    const { error } = await withAuthProfileRequestTimeout(
      supabaseClient
        .from('profiles')
        .update({ prefer_russian_posters: nextPreferRussianPosters })
        .eq('id', currentUser.id),
      'Не удалось сохранить настройку постеров. Проверь соединение и попробуй снова.'
    );

    if (error) {
      if (getMissingProfileOptionalColumnName(error, ['prefer_russian_posters']) === 'prefer_russian_posters') {
        markMissingProfileOptionalColumn('prefer_russian_posters');
        syncProfilePosterPreferenceControls(currentUserProfile);
        return;
      }

      throw error;
    }

    currentUserProfile = {
      ...(currentUserProfile || {}),
      prefer_russian_posters: nextPreferRussianPosters
    };
    cachePublicProfileRows([{ id: currentUser.id, ...currentUserProfile }]);
    syncProfilePosterPreferenceControls(currentUserProfile);
    setProfilePosterPreferenceMessage('Настройка сохранена.', 'success');

    await refreshPosterPreferenceDependentUi({
      forcePosterImages: nextPreferRussianPosters
    });
  } catch (error) {
    console.error('Ошибка сохранения настройки постеров:', error);
    setProfilePosterPreferenceMessage(error?.message || 'Не удалось сохранить настройку постеров. Попробуйте ещё раз.', 'error');
  } finally {
    setProfilePosterPreferenceSubmitting(false);
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

function getProfilePasswordErrorMessage(error, fallbackMessage) {
  const errorText = String(error?.message || '').toLowerCase();

  if (
    errorText.includes('invalid login credentials') ||
    errorText.includes('invalid credentials')
  ) {
    return 'Старый пароль не подошёл.';
  }

  return getReadableAuthErrorMessage(error, fallbackMessage);
}

async function saveProfilePassword(event) {
  event?.preventDefault();

  if (
    !currentUser ||
    isProfilePasswordSubmitting ||
    !profilePasswordCurrentInput ||
    !profilePasswordNewInput ||
    !profilePasswordConfirmInput
  ) {
    return;
  }

  const email = String(currentUser.email || '').trim();
  const currentPassword = profilePasswordCurrentInput.value;
  const nextPassword = profilePasswordNewInput.value;
  const confirmedPassword = profilePasswordConfirmInput.value;

  if (!email) {
    setProfilePasswordMessage('У аккаунта не найден e-mail для проверки пароля.', 'error');
    return;
  }

  if (!currentPassword) {
    setProfilePasswordMessage('Введите старый пароль.', 'error');
    profilePasswordCurrentInput.focus();
    return;
  }

  if (!nextPassword) {
    setProfilePasswordMessage('Введите новый пароль.', 'error');
    profilePasswordNewInput.focus();
    return;
  }

  if (!confirmedPassword) {
    setProfilePasswordMessage('Повторите новый пароль.', 'error');
    profilePasswordConfirmInput.focus();
    return;
  }

  if (nextPassword !== confirmedPassword) {
    setProfilePasswordMessage('Новые пароли не совпадают.', 'error');
    profilePasswordConfirmInput.focus();
    profilePasswordConfirmInput.select();
    return;
  }

  if (currentPassword === nextPassword) {
    setProfilePasswordMessage('Новый пароль должен отличаться от старого.', 'error');
    profilePasswordNewInput.focus();
    profilePasswordNewInput.select();
    return;
  }

  setProfilePasswordSubmitting(true);
  setProfilePasswordMessage('Проверяю старый пароль...');

  try {
    const { error: signInError } = await withAuthRequestTimeout(
      supabaseClient.auth.signInWithPassword({
        email,
        password: currentPassword
      }),
      'Не удалось проверить старый пароль. Проверь соединение и попробуй снова.'
    );

    if (signInError) {
      setProfilePasswordMessage(
        getProfilePasswordErrorMessage(signInError, 'Не удалось проверить старый пароль.'),
        'error'
      );
      return;
    }

    setProfilePasswordMessage('Сохраняю новый пароль...');

    const { error: updateError } = await withAuthRequestTimeout(
      supabaseClient.auth.updateUser({
        password: nextPassword
      }),
      'Не удалось обновить пароль. Проверь соединение и попробуй снова.'
    );

    if (updateError) {
      setProfilePasswordMessage(
        getProfilePasswordErrorMessage(updateError, 'Не удалось обновить пароль. Попробуй ещё раз.'),
        'error'
      );
      return;
    }

    clearProfileSettingsPasswordFields();
    setProfilePasswordMessage('Пароль обновлён.', 'success');
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    setProfilePasswordMessage(
      getProfilePasswordErrorMessage(error, 'Не удалось обновить пароль. Попробуй ещё раз.'),
      'error'
    );
  } finally {
    setProfilePasswordSubmitting(false);
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
    const { data: sessionData, error: sessionError } = await withAuthRequestTimeout(
      supabaseClient.auth.getSession(),
      'Не удалось проверить recovery-сессию. Проверь соединение и попробуй открыть ссылку ещё раз.'
    );

    if (sessionError || !sessionData?.session?.user) {
      console.error('Recovery-сессия не найдена:', sessionError);
      showAuthMessage(
        'Ссылка для сброса пароля не создала активную сессию. Запроси новое письмо и открой свежую ссылку.',
        'error'
      );
      return;
    }

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

      closeAuthModal({ skipPasswordRecoveryCancel: true });
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

async function armDeleteMovieButton(buttonElement, onConfirm, confirmMessage = 'Удалить?') {
  if (!buttonElement || typeof onConfirm !== 'function') {
    return;
  }

  await runConfirmedAction(confirmMessage, onConfirm);
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
    renderMoviePageHeaderSection(currentMoviePageMovieData);
    persistCurrentMoviePageSessionCache();
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
  const controller = await ensureMovieUserStateControllerLoaded();

  return controller.toggleMovieWatchlist(movieId);
}

async function deleteCurrentUserMovieRating(movieId, previousRating) {
  if (!currentUser) {
    return;
  }

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
}

async function removeUserMovieRating(movieId) {
  const controller = await ensureMovieUserStateControllerLoaded();

  return controller.removeUserMovieRating(movieId);
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

async function upsertCurrentUserMovieRating(movieId, normalizedRating, previousRating) {
  if (!currentUser) {
    return;
  }

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
}

async function saveUserMovieRating(movieId, ratingValue) {
  const controller = await ensureMovieUserStateControllerLoaded();

  return controller.saveUserMovieRating(movieId, ratingValue);
}

function getCatalogPaginationContainers() {
  return [catalogPaginationTop, catalogPaginationBottom].filter(Boolean);
}

function getCatalogPaginationState(totalItems) {
  const normalizedTotalItems = Math.max(0, Number(totalItems) || 0);
  const totalPages = Math.max(1, Math.ceil(normalizedTotalItems / CATALOG_PAGE_SIZE));
  const requestedPage = Math.max(1, Number(currentCatalogPage) || 1);
  const clampedPage = Math.min(requestedPage, totalPages);
  const startIndex = normalizedTotalItems > 0
    ? (clampedPage - 1) * CATALOG_PAGE_SIZE
    : 0;
  const endIndex = Math.min(startIndex + CATALOG_PAGE_SIZE, normalizedTotalItems);

  currentCatalogPage = clampedPage;

  if (clampedPage !== requestedPage) {
    saveCatalogState();
  }

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

function hideMoviesResultCount() {
  if (!moviesResultCount) {
    return;
  }

  moviesResultCount.textContent = '';
  moviesResultCount.hidden = true;
}

function showMoviesResultCount(text) {
  if (!moviesResultCount) {
    return;
  }

  moviesResultCount.textContent = text;
  moviesResultCount.hidden = false;
}

function setCatalogBusyState(isBusy) {
  if (!container) {
    return;
  }

  if (isBusy) {
    container.setAttribute('aria-busy', 'true');
  } else {
    container.removeAttribute('aria-busy');
  }
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

function isQuickPresetsScrollHintAllowed() {
  if (typeof window.matchMedia !== 'function') {
    return false;
  }

  const isMobileLayout = window.matchMedia(QUICK_PRESETS_SCROLL_HINT_MEDIA_QUERY).matches;
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return Boolean(isMobileLayout && !shouldReduceMotion);
}

function getQuickPresetsMaxScrollLeft() {
  if (!quickPresetsBar) {
    return 0;
  }

  return Math.max(0, quickPresetsBar.scrollWidth - quickPresetsBar.clientWidth);
}

function easeQuickPresetsScrollHint(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function cancelQuickPresetsScrollHint({ markHandled = false } = {}) {
  if (quickPresetsScrollHintTimerId !== null) {
    clearTimeout(quickPresetsScrollHintTimerId);
    quickPresetsScrollHintTimerId = null;
  }

  if (quickPresetsScrollHintFrameId !== null) {
    cancelAnimationFrame(quickPresetsScrollHintFrameId);
    quickPresetsScrollHintFrameId = null;
  }

  if (markHandled) {
    didPlayQuickPresetsScrollHint = true;
  }
}

function markQuickPresetsScrollHintHandled() {
  cancelQuickPresetsScrollHint({ markHandled: true });
}

function animateQuickPresetsScrollHint(fromScrollLeft, toScrollLeft, onComplete = null) {
  const startedAt = performance.now();

  const step = currentTime => {
    if (!quickPresetsBar) {
      quickPresetsScrollHintFrameId = null;
      return;
    }

    const progress = Math.min(1, (currentTime - startedAt) / QUICK_PRESETS_SCROLL_HINT_DURATION_MS);
    const easedProgress = easeQuickPresetsScrollHint(progress);

    quickPresetsBar.scrollLeft = fromScrollLeft + (toScrollLeft - fromScrollLeft) * easedProgress;

    if (progress < 1) {
      quickPresetsScrollHintFrameId = requestAnimationFrame(step);
      return;
    }

    quickPresetsScrollHintFrameId = null;
    onComplete?.();
  };

  quickPresetsScrollHintFrameId = requestAnimationFrame(step);
}

function playQuickPresetsScrollHint() {
  quickPresetsScrollHintTimerId = null;

  if (
    didPlayQuickPresetsScrollHint ||
    !quickPresetsBar ||
    !isQuickPresetsScrollHintAllowed() ||
    quickPresetsBar.scrollLeft > 1
  ) {
    return;
  }

  const maxScrollLeft = getQuickPresetsMaxScrollLeft();

  if (maxScrollLeft < 24) {
    return;
  }

  didPlayQuickPresetsScrollHint = true;
  const startScrollLeft = quickPresetsBar.scrollLeft;
  const hintScrollLeft = Math.min(maxScrollLeft, startScrollLeft + QUICK_PRESETS_SCROLL_HINT_DISTANCE);

  animateQuickPresetsScrollHint(startScrollLeft, hintScrollLeft, () => {
    quickPresetsScrollHintTimerId = setTimeout(() => {
      quickPresetsScrollHintTimerId = null;
      animateQuickPresetsScrollHint(quickPresetsBar.scrollLeft, startScrollLeft);
    }, 120);
  });
}

function scheduleQuickPresetsScrollHint() {
  if (
    didPlayQuickPresetsScrollHint ||
    quickPresetsScrollHintTimerId !== null ||
    !quickPresetsBar ||
    !isQuickPresetsScrollHintAllowed()
  ) {
    return;
  }

  quickPresetsScrollHintTimerId = setTimeout(() => {
    requestAnimationFrame(playQuickPresetsScrollHint);
  }, QUICK_PRESETS_SCROLL_HINT_DELAY_MS);
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

    if (isMovieTrailerModalOpen()) {
      syncMovieTrailerModalOffset();
    }
  });
}

function renderMoviesSkeleton(cardsCount = CATALOG_PAGE_SIZE) {
  const skeletonMovies = getCatalogSkeletonMovies(cardsCount);

  hideMoviesResultCount();
  setCatalogBusyState(true);
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
  const hasRuntime = !movie || Boolean(formatRuntimeMinutes(movie.runtime_minutes));

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
      ${hasRuntime ? '<p><span class="movie-text-skeleton movie-text-skeleton-runtime"></span></p>' : ''}

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
    getPublicOptionalUrl(movie?.kinopoisk_url) ||
    getPublicOptionalUrl(movie?.imdb_url) ||
    getPublicOptionalUrl(movie?.letterboxd_url) ||
    getPublicOptionalUrl(movie?.rottentomatoes_url)
  );
}

function getCatalogSkeletonCardsCount() {
  if (!container) {
    return CATALOG_PAGE_SIZE;
  }

  const renderedCardsCount = container.querySelectorAll('.movie-card').length;

  if (renderedCardsCount > 0) {
    return renderedCardsCount;
  }

  const { filteredTotal } = getCatalogDerivedState();
  const estimatedCardsCount = Number(filteredTotal || 0);

  if (estimatedCardsCount > 0) {
    return Math.min(estimatedCardsCount, CATALOG_PAGE_SIZE);
  }

  return CATALOG_PAGE_SIZE;
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
      <a href="${cardRenderMeta.escapedPageUrl}" class="movie-title-link">${titleHtml}</a>
    </h5>

    ${originalTitleHtml ? `<p>Оригинальное название: ${originalTitleHtml}</p>` : ''}
    <p>Год: ${escapeHtml(movie.year ?? '-')}</p>
    <p>Режиссёр: ${directorHtml}</p>
    <p>Жанры: ${cardRenderMeta.escapedGenres}</p>
    <p>Страны: ${cardRenderMeta.escapedCountries}</p>
    ${cardRenderMeta.escapedRuntime ? `<p>Время: ${cardRenderMeta.escapedRuntime}</p>` : ''}
  `;
}

function getMovieExternalIconSrc(type) {
  const icons = {
    kinopoisk: '/icons/kp.svg',
    imdb: '/icons/imdb.svg',
    letterboxd: '/icons/lb.svg',
    rottentomatoes: '/icons/rt.svg',
    tmdb: '/icons/tmdb.svg'
  };

  const iconSrc = icons[type] || '';

  if (!iconSrc) {
    return '';
  }

  return `${iconSrc}?v=${encodeURIComponent(APP_BUILD_VERSION)}`;
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
  const kinopoiskUrl = getPublicOptionalUrl(movie?.kinopoisk_url);
  const imdbUrl = getPublicOptionalUrl(movie?.imdb_url);
  const letterboxdUrl = getPublicOptionalUrl(movie?.letterboxd_url);
  const rottentomatoesUrl = getPublicOptionalUrl(movie?.rottentomatoes_url);
  const tmdbUrl = getPublicOptionalUrl(movie?.tmdb_url);
  const imdbTitleId = extractImdbTitleId(imdbUrl);
  const kinopoiskFilmId = extractKinopoiskFilmId(kinopoiskUrl);

  const ratingLinks = [];

  if (kinopoiskFilmId && kinopoiskUrl) {
    ratingLinks.push(`
      <a
        href="${escapeHtml(kinopoiskUrl)}"
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
          decoding="async"
        >
      </a>
    `);
  }

  if (imdbTitleId && imdbUrl) {
    ratingLinks.push(`
      <a
        href="${escapeHtml(imdbUrl)}"
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
          decoding="async"
        >
      </a>
    `);
  }

  const fallbackLinks = [
    kinopoiskFilmId ? null : (kinopoiskUrl ? {
      url: kinopoiskUrl,
      label: 'Кинопоиск',
      type: 'kinopoisk',
      className: 'is-kinopoisk'
    } : null),
    imdbTitleId ? null : (imdbUrl ? {
      url: imdbUrl,
      label: 'IMDb',
      type: 'imdb',
      className: 'is-imdb'
    } : null),
    letterboxdUrl ? {
      url: letterboxdUrl,
      label: 'Letterboxd',
      type: 'letterboxd',
      className: 'is-letterboxd'
    } : null,
    rottentomatoesUrl ? {
      url: rottentomatoesUrl,
      label: 'Rotten Tomatoes',
      type: 'rottentomatoes',
      className: 'is-rottentomatoes'
    } : null,
    tmdbUrl ? {
      url: tmdbUrl,
      label: 'TMDB',
      type: 'tmdb',
      className: 'is-tmdb'
    } : null
  ].filter(Boolean);

  const fallbackLinksHtml = fallbackLinks.length > 0
    ? `
      <div class="movie-external-links" aria-label="Ссылки на карточки фильма">
        ${fallbackLinks.map(link => `
          <a
            href="${escapeHtml(link.url)}"
            class="movie-external-link ${escapeHtml(link.className)}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${escapeHtml(link.label)}"
            title="${escapeHtml(link.label)}"
          >
            <img
              src="${escapeHtml(getMovieExternalIconSrc(link.type))}"
              alt=""
              class="movie-external-link-icon"
              loading="lazy"
              decoding="async"
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
      url: getPublicOptionalUrl(movie?.kinopoisk_url),
      label: 'Кинопоиск',
      type: 'kinopoisk',
      className: 'is-kinopoisk'
    },
    {
      url: getPublicOptionalUrl(movie?.imdb_url),
      label: 'IMDb',
      type: 'imdb',
      className: 'is-imdb'
    },
    {
      url: getPublicOptionalUrl(movie?.letterboxd_url),
      label: 'Letterboxd',
      type: 'letterboxd',
      className: 'is-letterboxd'
    },
    {
      url: getPublicOptionalUrl(movie?.rottentomatoes_url),
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
          href="${escapeHtml(link.url)}"
          class="movie-external-link ${escapeHtml(link.className)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeHtml(link.label)}"
          title="${escapeHtml(link.label)}"
        >
          <img
            src="${escapeHtml(getMovieExternalIconSrc(link.type))}"
            alt=""
            class="movie-external-link-icon"
            loading="lazy"
            decoding="async"
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
  const posterUrl = getMoviePreferredPosterUrl(movie);
  const isPosterLoaded = posterUrl && loadedPosterUrls.has(posterUrl);
  const isPriorityPoster = Boolean(renderOptions.isPriorityPoster);
  const matchedSearchAliasHtml = matchedSearchAlias
    ? getHighlightedCatalogText(matchedSearchAlias, renderContext)
    : '';

  return `
    <div class="movie-poster-block">
      <a href="${cardRenderMeta.escapedPageUrl}" class="movie-poster-link" aria-label="${cardRenderMeta.escapedPageLabel}">
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

function shouldHoldMovieCardHoverAfterLinkOpen(event, link) {
  return (
    shouldResetMovieCardFocusAfterLinkOpen(event) ||
    link?.classList?.contains('movie-external-link')
  );
}

function isSameTabCatalogMovieLinkNavigation(event, link) {
  return Boolean(
    link &&
    (
      link.classList.contains('movie-poster-link') ||
      link.classList.contains('movie-title-link')
    ) &&
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.altKey &&
    link.target !== '_blank'
  );
}

function holdMovieCardHoverAfterLinkOpen(event, link = event.currentTarget) {
  if (!shouldHoldMovieCardHoverAfterLinkOpen(event, link) || !link) {
    return;
  }

  const card = link.closest('.movie-card[data-movie-id]');

  if (!card || !container?.contains(card)) {
    return;
  }

  card.classList.add('is-link-opening');

  const clearHeldState = () => {
    card.classList.remove('is-link-opening');
    card.removeEventListener('mouseleave', clearHeldState);
    window.removeEventListener('blur', clearHeldState);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearHeldState();
    }
  };

  card.addEventListener('mouseleave', clearHeldState, { once: true });
  window.addEventListener('blur', clearHeldState, { once: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

function resetMovieCardFocusAfterLinkOpen(event, link = event.currentTarget) {
  holdMovieCardHoverAfterLinkOpen(event, link);

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
  const link = event.target.closest('.movie-poster-link, .movie-title-link, .movie-external-link');

  if (link && container?.contains(link)) {
    resetMovieCardFocusAfterLinkOpen(event, link);
  }
}

async function handleCatalogCardClick(event) {
  const target = event.target;

  if (!container || !container.contains(target)) {
    return;
  }

  const link = target.closest('.movie-poster-link, .movie-title-link, .movie-external-link');

  if (link) {
    if (isSameTabCatalogMovieLinkNavigation(event, link)) {
      markCatalogFastReturnPending();
    }

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
        await fillFormForEdit(movieForEdit);
      }
    }

    return;
  }

  const deleteBtn = target.closest('.delete-movie-btn');

  if (deleteBtn && isAdmin && movie) {
    armDeleteMovieButton(deleteBtn, () => {
      deleteMovie(movieId, movie.title);
    }, `Удалить фильм "${movie.title}"?`);
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
  const profileRatingHtml = getCatalogProfileRatingHtml(movieId);
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
      ${profileRatingHtml}
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
    profileActivityHandle: catalogProfileActivityHandle,
    profileActivityKey: catalogProfileActivityKey,
    viewMode: viewMode?.value || 'list',
    sortMode: selectedSortMode,
    page: currentCatalogPage,
    filterState
  });
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

function getCatalogFilterStateSnapshot(options = {}) {
  const {
    ignoreGenre = false,
    ignoreSubgenre = false,
    ignoreFormat = false,
    ignoreCountry = false,
    ignoreYear = false,
    ignoreRuntime = false
  } = options;
  const ratingRange = getCatalogRangeBounds(
    ratingFromFilter.value,
    ratingToFilter.value,
    getCatalogRangeInputOptions('rating')
  );
  const yearRange = ignoreYear
    ? { from: null, to: null, hasRange: false }
    : getCatalogRangeBounds(yearFromFilter.value, yearToFilter.value, getCatalogRangeInputOptions('year'));
  const runtimeRange = ignoreRuntime
    ? { from: null, to: null, hasRange: false }
    : getCatalogRangeBounds(runtimeFromFilter.value, runtimeToFilter.value, getCatalogRangeInputOptions('runtime'));
  const selectedWatchlist = watchlistFilter.value;
  const selectedWatched = watchedFilter.value;
  const searchQuery = searchInput.value;
  const searchQueryWords = getSearchQueryWords(searchQuery);
  return {
    selectedGenre: ignoreGenre ? '' : genreFilter.value,
    selectedSubgenre: ignoreSubgenre ? '' : subgenreFilter.value,
    selectedFormat: ignoreFormat ? '' : formatFilter.value,
    selectedCountry: ignoreCountry ? '' : countryFilter.value,
    ratingFrom: ratingRange.from,
    ratingTo: ratingRange.to,
    hasRatingRange: ratingRange.hasRange,
    yearFrom: yearRange.from,
    yearTo: yearRange.to,
    hasYearRange: yearRange.hasRange,
    runtimeFrom: runtimeRange.from,
    runtimeTo: runtimeRange.to,
    hasRuntimeRange: runtimeRange.hasRange,
    selectedWatchlist,
    hasWatchlistFilter: selectedWatchlist === 'in_watchlist' || selectedWatchlist === 'not_in_watchlist',
    selectedWatched,
    hasWatchedFilter: selectedWatched === 'watched' || selectedWatched === 'unwatched',
    searchQuery,
    searchQueryWords,
    hasSearchQuery: searchQueryWords.length > 0,
    hasCurrentUser: Boolean(currentUser),
    hasProfileActivityFilter: isCatalogProfileActivityActive(),
    profileActivityMovieIds: getCatalogProfileActivityMatchSet(),
    reviewedOnly: reviewedOnlyFilter
  };
}

function doesNumberMatchCatalogRange(value, from, to) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return false;
  }

  if (from !== null && numericValue < from) {
    return false;
  }

  if (to !== null && numericValue > to) {
    return false;
  }

  return true;
}

function doesMovieMatchCatalogFilters(movie, filterState, meta = getCatalogMovieMeta(movie)) {
  if (
    filterState.hasSearchQuery &&
    !movieMatchesSearch(movie, filterState.searchQuery, filterState.searchQueryWords)
  ) {
    return false;
  }

  if (
    filterState.hasProfileActivityFilter &&
    !filterState.profileActivityMovieIds?.has(String(movie.id))
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

  if (filterState.hasRatingRange) {
    const averageRating = getMovieAverageRating(movie.id);
    const matchesRating = doesNumberMatchCatalogRange(
      averageRating,
      filterState.ratingFrom,
      filterState.ratingTo
    );

    if (!matchesRating) {
      return false;
    }
  }

  const movieYearFilterValue = filterState.hasYearRange
    ? getCatalogMovieYearFilterValue(movie)
    : null;

  if (
    filterState.hasYearRange &&
    (
      movieYearFilterValue === null ||
      !doesNumberMatchCatalogRange(
        movieYearFilterValue,
        filterState.yearFrom,
        filterState.yearTo
      )
    )
  ) {
    return false;
  }

  if (
    filterState.hasRuntimeRange &&
    (
      movie.runtime_minutes === null ||
      !doesNumberMatchCatalogRange(movie.runtime_minutes, filterState.runtimeFrom, filterState.runtimeTo)
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
  const averageRating = filterState.hasRatingRange
    ? getMovieAverageRating(movie.id)
    : 0;
  const movieYearFilterValue = filterState.hasYearRange
    ? getCatalogMovieYearFilterValue(movie)
    : null;
  return {
    profileActivity: (
      !filterState.hasProfileActivityFilter ||
      filterState.profileActivityMovieIds?.has(String(movie.id))
    ),
    search: (
      !filterState.hasSearchQuery ||
      movieMatchesSearch(movie, filterState.searchQuery, filterState.searchQueryWords)
    ),
    genre: !filterState.selectedGenre || meta.genreNames.has(filterState.selectedGenre),
    subgenre: !filterState.selectedSubgenre || meta.subgenreKeys.has(filterState.selectedSubgenre),
    format: !filterState.selectedFormat || meta.formatKeys.has(filterState.selectedFormat),
    country: !filterState.selectedCountry || meta.countryNames.has(filterState.selectedCountry),
    rating: (
      !filterState.hasRatingRange ||
      doesNumberMatchCatalogRange(averageRating, filterState.ratingFrom, filterState.ratingTo)
    ),
    year: (
      !filterState.hasYearRange ||
      (
        movieYearFilterValue !== null &&
        doesNumberMatchCatalogRange(
          movieYearFilterValue,
          filterState.yearFrom,
          filterState.yearTo
        )
      )
    ),
    runtime: (
      !filterState.hasRuntimeRange ||
      (
        movie.runtime_minutes !== null &&
        doesNumberMatchCatalogRange(movie.runtime_minutes, filterState.runtimeFrom, filterState.runtimeTo)
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
    matches.profileActivity &&
    (ignoredFilterKey === 'genre' || matches.genre) &&
    (ignoredFilterKey === 'subgenre' || matches.subgenre) &&
    (ignoredFilterKey === 'format' || matches.format) &&
    (ignoredFilterKey === 'country' || matches.country) &&
    (ignoredFilterKey === 'year' || matches.year) &&
    (ignoredFilterKey === 'runtime' || matches.runtime) &&
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
    countryCounts: new Map()
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
  });

  return counts;
}

function refreshDynamicFilterOptions() {
  const filterOptionCounts = getDynamicFilterOptionCounts();

  refreshGenreFilterOptions(filterOptionCounts.genreCounts);
  loadSubgenreFilterOptions(filterOptionCounts.subgenreCounts);
  loadFormatFilterOptions(filterOptionCounts.formatCounts);
  refreshCountryFilterOptions(filterOptionCounts.countryCounts);
  refreshCatalogRangeControls();
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

function getCatalogDomRenderSignature({ filteredTotal, paginationState, pageMovies, selectedSortMode, filterState }) {
  return JSON.stringify({
    dataVersion: catalogDataVersion,
    viewMode: viewMode?.value || 'list',
    sortMode: selectedSortMode || sortMode?.value || 'default',
    filteredTotal,
    currentPage: paginationState?.currentPage || currentCatalogPage,
    startIndex: paginationState?.startIndex || 0,
    endIndex: paginationState?.endIndex || 0,
    pageMovieIds: (Array.isArray(pageMovies) ? pageMovies : []).map(movie => String(movie?.id || '')),
    filterState
  });
}

function renderMovies() {
  if (!moviesLoadedSuccessfully) {
    return;
  }

  currentCatalogPaginationSlots = getCatalogPaginationSlots();
  container.classList.remove('is-catalog-visible');

  renderActiveFilterChips();
  syncQuickPresetButtons();

  const requestedCatalogPage = currentCatalogPage;
  const {
    filteredTotal,
    paginationState,
    pageMovies,
    selectedSortMode,
    filterState
  } = getCatalogDerivedState();
  const cardRenderContext = createMovieCardRenderContext(searchInput.value);

  if (paginationState.currentPage !== requestedCatalogPage) {
    saveCatalogState();
  }

  showMoviesResultCount(getMoviesResultCountText(filteredTotal, paginationState));
  setCatalogBusyState(false);

  if (filteredTotal === 0) {
    updateCatalogStructuredData([], paginationState);
    clearCatalogPagination();
    renderEmptyState();
    persistCatalogDomSnapshot();
    return;
  }

  updateCatalogStructuredData(pageMovies, paginationState);
  renderCatalogPagination(paginationState);

  const domRenderSignature = getCatalogDomRenderSignature({
    filteredTotal,
    paginationState,
    pageMovies,
    selectedSortMode,
    filterState
  });

  if (
    lastCatalogDomRenderSignature === domRenderSignature &&
    container.children.length > 0 &&
    !container.querySelector('.movie-card-skeleton')
  ) {
    persistCatalogDomSnapshot();
    return;
  }

  let priorityPosterSlotsRemaining = CATALOG_PRIORITY_POSTER_COUNT;
  const getPriorityPosterOptions = movie => {
    const isPriorityPoster = priorityPosterSlotsRemaining > 0 && Boolean(getMoviePreferredPosterUrl(movie));

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

  lastCatalogDomRenderSignature = domRenderSignature;
  persistCatalogDomSnapshot();
}

const debouncedRenderMovies = createDebouncedCatalogRender(200);

let lastSearchQuery = '';

const debouncedRenderMoviesForFilters = createDebouncedCatalogRender(120);

function saveCatalogStateAndRenderFilters() {
  prepareCatalogStateForDeferredRender({ resetPage: true });
  refreshDynamicFilterOptions();
  debouncedRenderMoviesForFilters();
}

const handleFiltersChange = () => {
  trackFiltersUsageIfNeeded();
  saveCatalogStateAndRenderFilters();
};

async function syncCatalogProfileActivityContextBeforeRender() {
  await ensureCatalogProfileActivityContextLoaded();
  refreshDynamicFilterOptions();
  updateFiltersButtonLabel();
  syncQuickPresetButtons();
}

async function handleCatalogHistoryNavigation() {
  if (!isCatalogPage()) {
    return;
  }

  const routePresetKey = getCatalogRoutePresetKey();

  applySavedCatalogState({ fallbackToStorage: false });
  await syncCatalogProfileActivityContextBeforeRender();

  if (routePresetKey) {
    const didApplyRoutePreset = applyQuickPreset(routePresetKey, {
      preservePage: true,
      urlMode: 'replace'
    });

    if (didApplyRoutePreset) {
      updateFiltersButtonLabel();
      return;
    }
  }

  rerenderCatalogPreservingPosition();
}

function bindSharedUiEvents() {
  if (areSharedUiEventsBound) {
    return;
  }

  loginForm?.addEventListener('submit', login);
  loginEmail?.addEventListener('input', clearAuthMessage);
  loginPassword?.addEventListener('input', clearAuthMessage);
  loginPasswordConfirm?.addEventListener('input', clearAuthMessage);
  displayNameInput?.addEventListener('input', () => setDisplayNameMessage());
  [
    profilePasswordCurrentInput,
    profilePasswordNewInput,
    profilePasswordConfirmInput
  ].forEach(input => {
    input?.addEventListener('input', () => setProfilePasswordMessage());
  });
  appToastAcceptButton?.addEventListener('click', clearAppMessage);

  registerButton?.addEventListener('click', () => {
    setAuthRegisterMode(!isAuthRegisterMode);
  });

  logoutMenuButton?.addEventListener('click', () => {
    closeAuthPopoverMenu();
    logout();
  });

  profileSummaryButton?.addEventListener('click', handleAuthPopoverNavigationLinkClick);
  notificationsSummaryButton?.addEventListener('click', handleAuthPopoverNavigationLinkClick);
  followingSummaryButton?.addEventListener('click', handleAuthPopoverNavigationLinkClick);
  editorCenterSummaryButton?.addEventListener('click', handleAuthPopoverNavigationLinkClick);
  directorsAdminSummaryButton?.addEventListener('click', handleAuthPopoverNavigationLinkClick);

  manualSimilarAuditButton?.addEventListener('click', runManualSimilarAudit);
  completenessAuditButton?.addEventListener('click', runCompletenessAudit);
  databaseExportButton?.addEventListener('click', exportDatabase);
  notificationTestButton?.addEventListener('click', runNotificationTestSuite);

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

  displayNameForm?.addEventListener('submit', saveDisplayName);
  profilePosterPreferenceForm?.addEventListener('submit', saveProfilePosterPreference);
  profileRussianPostersInput?.addEventListener('change', () => {
    if (profileRussianPostersColumnAvailable) {
      setProfilePosterPreferenceMessage();
    }
  });
  profilePasswordForm?.addEventListener('submit', saveProfilePassword);
  document.addEventListener('submit', event => {
    handleUserPageAdminPasswordSubmit(event);
  });

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
    if (handleUserPageRankTooltipClick(event)) {
      return;
    }

    if (handleUserPageAvatarDeleteClick(event)) {
      return;
    }

    if (handleUserPageFollowClick(event)) {
      return;
    }

    if (handleNotificationsPageClick(event)) {
      return;
    }

    if (handleEditorPageClick(event)) {
      return;
    }

    if (handleDirectorsAdminPageClick(event)) {
      return;
    }

    handleUserPageProfileSettingsClick(event);
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
  document.addEventListener('change', handleUserPageAvatarFileChange);
  document.addEventListener('change', event => {
    handleNotificationsPagePreferenceChange(event);
  });
  document.addEventListener('focusin', event => {
    if (userPageRankTooltipTarget && !event.target?.closest?.('[data-user-page-rank-title]')) {
      hideUserPageRankTooltip();
    }
  });

  window.addEventListener('resize', () => {
    hideUserPageRankTooltip();
    observeNotificationsPageVisibleItems();
    scheduleAppResizeSync();
  });
  window.addEventListener('scroll', hideUserPageRankTooltip, { passive: true });

  document.addEventListener('keydown', event => {
    if (handleUserPageRankTooltipKeydown(event)) {
      return;
    }

    if (event.key !== 'Escape') {
      return;
    }

    hideUserPageRankTooltip();
    if (isMovieTrailerModalOpen()) {
      closeMovieTrailerModal();
      return;
    }

    closeMobileRatingModal();
    closeAllCustomSelects();
    closeAuthPopoverMenu();
    closeDisplayNameModal();

    if (isDirectorModalOpen) {
      closeDirectorModal();
      return;
    }

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

  window.addEventListener('popstate', handleCatalogHistoryNavigation);

  openAddMovieButton?.addEventListener('click', async () => {
    try {
      await ensureMovieEditorControllerLoaded();
    } catch (error) {
      console.warn('Не удалось загрузить редактор фильма:', error);
      return;
    }

    resetFormToCreateMode();
    void openMovieModal();
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
    refreshDynamicFilterOptions();
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
    watchlistFilter,
    watchedFilter
  ].forEach(filterElement => {
    filterElement?.addEventListener('change', handleFiltersChange);
  });

  [
    runtimeFromFilter,
    runtimeToFilter,
    yearFromFilter,
    yearToFilter,
    ratingFromFilter,
    ratingToFilter
  ].forEach(filterElement => {
    filterElement?.addEventListener('input', handleCatalogRangeInputChange);
    filterElement?.addEventListener('change', handleCatalogRangeInputChange);
    filterElement?.addEventListener('blur', handleCatalogRangeInputChange);
  });

  [
    runtimeFromSlider,
    runtimeToSlider,
    yearFromSlider,
    yearToSlider,
    ratingFromSlider,
    ratingToSlider
  ].forEach(filterElement => {
    filterElement?.addEventListener('input', handleCatalogRangeSliderInput);
    filterElement?.addEventListener('change', handleCatalogRangeSliderInput);
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
  quickPresetsBar?.addEventListener('pointerdown', markQuickPresetsScrollHintHandled, { passive: true });
  quickPresetsBar?.addEventListener('wheel', markQuickPresetsScrollHintHandled, { passive: true });

  resetFiltersTopButton?.addEventListener('click', () => {
    resetCatalogFiltersAndRerender({ preserveProfileActivity: true });
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

    await fillFormForEdit(movieForEdit);
  });

  moviePageDeleteButton?.addEventListener('click', () => {
    if (!isAdmin || !currentMoviePageMovieId || !currentMoviePageMovieData) {
      return;
    }

    armDeleteMovieButton(moviePageDeleteButton, () => {
      deleteMovieFromMoviePage(currentMoviePageMovieId, currentMoviePageMovieData.title);
    }, `Удалить фильм "${currentMoviePageMovieData.title}"?`);
  });

  areMoviePageEventsBound = true;
}

function isCatalogPage() {
  return Boolean(container);
}

function isMoviePage() {
  return Boolean(moviePage);
}

function isUserPage() {
  return Boolean(userPage);
}

function isFollowingPage() {
  return Boolean(followingPage);
}

function isNotificationsPage() {
  return Boolean(notificationsPage);
}

function isEditorPage() {
  return Boolean(editorPage);
}

function isDirectorPage() {
  return Boolean(directorPage);
}

function isDirectorsAdminPage() {
  return Boolean(directorsAdminPage);
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
  if (typeof onAfterAuthSync === 'function') {
    sharedAuthStateAfterSyncHandler = onAfterAuthSync;
  }

  if (isSharedAuthStateListenerBound) {
    return;
  }

  isSharedAuthStateListenerBound = true;

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

        if (typeof sharedAuthStateAfterSyncHandler === 'function') {
          await sharedAuthStateAfterSyncHandler();
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

function canUseHydratedCatalogWithoutReload(hydrationState, hydratedSnapshot, { isReturnNavigation = false } = {}) {
  if (!isReturnNavigation || !hydrationState?.didHydrateCatalogFromSnapshot || !hydratedSnapshot) {
    return false;
  }

  return (hydratedSnapshot.userId || null) === (currentUser?.id || null);
}

async function initCatalogPage() {
  initCatalogViewToggleButton();
  renderMoviesSkeleton();

  const routePresetKey = getCatalogRoutePresetKey();
  const restoreSessionPromise = restoreSession();
  const initialCatalogUrlState = readCatalogUrlState();
  const isReturnNavigationWithSnapshot = consumeCatalogFastReturnPending() && hasSavedCatalogReturnPosition();
  const shouldSkipSnapshotForProfileActivity = Boolean(
    initialCatalogUrlState?.profileHandle &&
    initialCatalogUrlState?.profileActivity
  );
  const hydratedSnapshot = shouldSkipSnapshotForProfileActivity ? null : readCatalogSessionSnapshot();
  const preAuthUserId = currentUser?.id || null;
  const shouldWaitForSessionBeforeHydration = Boolean(
    hydratedSnapshot &&
    !preAuthUserId &&
    (
      hydratedSnapshot.userId ||
      hasStoredSupabaseAuthSession()
    )
  );
  let hydrationState = {
    didHydrateCatalogFromSnapshot: false,
    didHydrateCatalogDomFromSnapshot: false,
    hydratedCatalogSignature: ''
  };
  let restoredUser = null;

  if (!shouldWaitForSessionBeforeHydration) {
    hydrationState = hydrateCatalogPageFromSnapshot(hydratedSnapshot);
  }

  restoredUser = await restoreSessionPromise;
  trackEmailConfirmedLoginIfNeeded();

  if (shouldWaitForSessionBeforeHydration) {
    hydrationState = hydrateCatalogPageFromSnapshot(hydratedSnapshot);
  }

  const activeUserId = currentUser?.id || null;
  const shouldRehydrateForRestoredUser = (
    !shouldWaitForSessionBeforeHydration &&
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

  let storedCatalogStateForInitialLoad = null;

  if (!initialCatalogUrlState) {
    try {
      storedCatalogStateForInitialLoad = readStoredCatalogState();
    } catch (error) {
      console.warn('Ошибка чтения сохранённого состояния каталога для первичной загрузки:', error);
    }
  }

  const shouldAwaitInitialUserCatalogState = Boolean(
    shouldUseAuthenticatedUi() &&
    (
      AUTH_REQUIRED_CATALOG_PRESET_KEYS.has(routePresetKey) ||
      hasUserScopedCatalogState(initialCatalogUrlState) ||
      hasUserScopedCatalogState(storedCatalogStateForInitialLoad) ||
      hasUserScopedCatalogControlsActive()
    )
  );

  bindSharedAuthStateListener({
    onAfterAuthSync: async () => {
      applySavedCatalogState();
      await syncCatalogProfileActivityContextBeforeRender();
      syncCatalogAfterAuthChange();
    }
  });

  if (canUseHydratedCatalogWithoutReload(hydrationState, hydratedSnapshot, {
    isReturnNavigation: isReturnNavigationWithSnapshot
  })) {
    applySavedCatalogState();
    await syncCatalogProfileActivityContextBeforeRender();

    if (routePresetKey) {
      const didApplyRoutePreset = applyQuickPreset(routePresetKey, {
        preservePage: true,
        urlMode: 'replace'
      });

      if (didApplyRoutePreset) {
        updateFiltersButtonLabel();
        return;
      }
    }

    updateFiltersButtonLabel();
    return;
  }

  const catalogLoadState = await reloadCatalogData({
    showSkeleton: !hydrationState.didHydrateCatalogFromSnapshot,
    refreshFilters: false,
    awaitUserState: shouldAwaitInitialUserCatalogState,
    loadDeferredUserState: false
  });

  const loadDeferredInitialUserState = () => {
    if (catalogLoadState?.didAwaitUserState || !shouldUseAuthenticatedUi()) {
      return;
    }

    loadDeferredCatalogUserState({
      userIdAtLoadStart: activeUserId,
      skipCurrentUserRatings: Boolean(catalogLoadState?.hasFullRatingRows)
    });
  };

  applySavedCatalogState();
  await syncCatalogProfileActivityContextBeforeRender();

  if (routePresetKey) {
    const didApplyRoutePreset = applyQuickPreset(routePresetKey, {
      preservePage: true,
      urlMode: 'replace'
    });

    if (didApplyRoutePreset) {
      updateFiltersButtonLabel();
      loadDeferredInitialUserState();
      return;
    }
  }

  const refreshedCatalogSignature = getCatalogDataSignatureHash(createCatalogSessionSnapshotPayload());
  const canReuseHydratedCatalog = (
    hydrationState.didHydrateCatalogFromSnapshot &&
    hydrationState.hydratedCatalogSignature &&
    hydrationState.hydratedCatalogSignature === refreshedCatalogSignature
  );

  if (canReuseHydratedCatalog) {
    updateFiltersButtonLabel();
    loadDeferredInitialUserState();
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

  loadDeferredInitialUserState();
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

function isOwnUserProfile(profile) {
  return Boolean(
    shouldUseAuthenticatedUi() &&
    currentUser?.id &&
    profile?.id &&
    String(profile.id) === String(currentUser.id)
  );
}

function isCurrentUserFollowingProfile(profileId) {
  const normalizedProfileId = String(profileId || '').trim();

  return Boolean(normalizedProfileId && currentUserFollowedProfileIds.has(normalizedProfileId));
}

async function fetchCurrentUserProfileFollows() {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    currentUserFollowedProfileIds = new Set();
    userPageFollowRequestProfileIds = new Set();
    return;
  }

  const { data, error } = await supabaseClient
    .from('user_profile_follows')
    .select('following_id')
    .eq('follower_id', currentUser.id);

  if (error) {
    console.warn('Ошибка загрузки отслеживаемых профилей:', error);
    currentUserFollowedProfileIds = new Set();
    return;
  }

  currentUserFollowedProfileIds = new Set(
    (data || [])
      .map(row => String(row?.following_id || '').trim())
      .filter(Boolean)
  );
}

function getUserPageFollowButtonHtml(profile) {
  const profileId = String(profile?.id || '').trim();

  if (!profileId || isOwnUserProfile(profile)) {
    return '';
  }

  const isAuthenticated = Boolean(shouldUseAuthenticatedUi() && currentUser?.id);
  const isFollowing = isAuthenticated && isCurrentUserFollowingProfile(profileId);
  const isBusy = userPageFollowRequestProfileIds.has(profileId);
  const buttonLabel = isFollowing ? 'Отслеживается' : 'Отслеживать';
  const buttonTitle = isAuthenticated
    ? (isFollowing ? 'Больше не отслеживать профиль' : 'Отслеживать профиль')
    : 'Войти, чтобы отслеживать профиль';

  return `
    <div class="user-page-follow-actions">
      <button
        type="button"
        class="secondary-button secondary-button-compact user-page-follow-button${isFollowing ? ' is-following' : ''}"
        data-user-page-follow-profile-id="${escapeHtml(profileId)}"
        aria-pressed="${isFollowing ? 'true' : 'false'}"
        title="${escapeHtml(buttonTitle)}"
        ${isBusy ? 'disabled' : ''}
      >
        ${escapeHtml(buttonLabel)}
      </button>
    </div>
  `;
}

function syncUserPageFollowButtonState(profileId) {
  const normalizedProfileId = String(profileId || '').trim();

  if (!normalizedProfileId || !userPage) {
    return;
  }

  const button = userPage.querySelector(`[data-user-page-follow-profile-id="${CSS.escape(normalizedProfileId)}"]`);

  if (!button) {
    return;
  }

  const isAuthenticated = Boolean(shouldUseAuthenticatedUi() && currentUser?.id);
  const isFollowing = isAuthenticated && isCurrentUserFollowingProfile(normalizedProfileId);
  const isBusy = userPageFollowRequestProfileIds.has(normalizedProfileId);

  button.disabled = isBusy;
  button.classList.toggle('is-following', isFollowing);
  button.setAttribute('aria-pressed', isFollowing ? 'true' : 'false');
  button.title = isAuthenticated
    ? (isFollowing ? 'Больше не отслеживать профиль' : 'Отслеживать профиль')
    : 'Войти, чтобы отслеживать профиль';
  button.textContent = isFollowing ? 'Отслеживается' : 'Отслеживать';
}

function handleUserPageFollowClick(event) {
  const button = event.target?.closest?.('[data-user-page-follow-profile-id]');

  if (!button) {
    return false;
  }

  event.preventDefault();
  toggleUserPageProfileFollow(button.dataset.userPageFollowProfileId);

  return true;
}

async function toggleUserPageProfileFollow(profileId) {
  const normalizedProfileId = String(profileId || '').trim();

  if (!normalizedProfileId) {
    return;
  }

  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    openAuthModal();
    showAuthMessage('Войди, чтобы отслеживать профили.', 'info', true);
    return;
  }

  if (normalizedProfileId === String(currentUser.id) || userPageFollowRequestProfileIds.has(normalizedProfileId)) {
    return;
  }

  const wasFollowing = isCurrentUserFollowingProfile(normalizedProfileId);

  userPageFollowRequestProfileIds.add(normalizedProfileId);
  syncUserPageFollowButtonState(normalizedProfileId);

  try {
    if (wasFollowing) {
      const { error } = await supabaseClient
        .from('user_profile_follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', normalizedProfileId);

      throwIfSupabaseError(error);
      currentUserFollowedProfileIds.delete(normalizedProfileId);
    } else {
      const { error } = await supabaseClient
        .from('user_profile_follows')
        .insert({
          follower_id: currentUser.id,
          following_id: normalizedProfileId
        });

      if (error && error.code !== '23505') {
        throw error;
      }

      currentUserFollowedProfileIds.add(normalizedProfileId);
    }

    showAppMessage(
      wasFollowing ? 'Профиль больше не отслеживается.' : 'Профиль отслеживается.',
      'success',
      true
    );
  } catch (error) {
    console.error('Ошибка обновления отслеживания профиля:', error);
    showAppMessage('Не удалось обновить отслеживание профиля.', 'error', true);
  } finally {
    userPageFollowRequestProfileIds.delete(normalizedProfileId);
    syncUserPageFollowButtonState(normalizedProfileId);
  }
}

function getUserPageAdminPasswordPanelHtml(profile) {
  const profileId = String(profile?.id || '').trim();

  if (!isAdmin || !profileId || isOwnUserProfile(profile)) {
    return '';
  }

  const displayName = getPublicProfileDisplayName(profile);

  return `
    <section class="user-page-admin-panel" aria-labelledby="userPageAdminPasswordTitle">
      <div class="user-page-admin-panel-header">
        <h2 id="userPageAdminPasswordTitle">Администрирование</h2>
        <span>Пароль для ${escapeHtml(displayName)}</span>
      </div>
      <form
        class="user-page-admin-password-form"
        data-user-admin-password-form="true"
        data-user-id="${escapeHtml(profileId)}"
      >
        <div class="user-page-admin-password-fields">
          <label>
            <span>Новый пароль</span>
            <input
              type="password"
              data-user-admin-password="true"
              autocomplete="new-password"
              minlength="8"
            >
          </label>
          <label>
            <span>Повторите пароль</span>
            <input
              type="password"
              data-user-admin-password-confirm="true"
              autocomplete="new-password"
              minlength="8"
            >
          </label>
        </div>
        <div class="user-page-admin-password-actions">
          <button type="submit">Установить пароль</button>
          <p class="user-page-admin-password-message" data-user-admin-password-message="true" aria-live="polite"></p>
        </div>
      </form>
    </section>
  `;
}

function setUserPageAdminPasswordMessage(form, message = '', type = 'info') {
  const messageElement = form?.querySelector('[data-user-admin-password-message="true"]');

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.classList.toggle('is-error', type === 'error');
  messageElement.classList.toggle('is-success', type === 'success');
}

function setUserPageAdminPasswordSubmitting(form, isSubmitting) {
  isUserAdminPasswordSubmitting = isSubmitting;

  form?.querySelectorAll('input, button').forEach(element => {
    element.disabled = isSubmitting;
  });

  const submitButton = form?.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.textContent = isSubmitting ? 'Сохраняю...' : 'Установить пароль';
  }
}

function handleUserPageAdminPasswordSubmit(event) {
  const form = event.target?.closest?.('[data-user-admin-password-form="true"]');

  if (!form) {
    return false;
  }

  event.preventDefault();
  saveUserPageAdminPassword(form);

  return true;
}

async function saveUserPageAdminPassword(form) {
  if (!form || isUserAdminPasswordSubmitting) {
    return;
  }

  if (!isAdmin || !currentUser?.id) {
    setUserPageAdminPasswordMessage(form, 'Доступно только администратору.', 'error');
    return;
  }

  const profileId = String(form.dataset.userId || '').trim();
  const passwordInput = form.querySelector('[data-user-admin-password="true"]');
  const passwordConfirmInput = form.querySelector('[data-user-admin-password-confirm="true"]');
  const nextPassword = passwordInput?.value || '';
  const confirmedPassword = passwordConfirmInput?.value || '';

  if (!profileId) {
    setUserPageAdminPasswordMessage(form, 'Не найден id пользователя.', 'error');
    return;
  }

  if (nextPassword.length < 8) {
    setUserPageAdminPasswordMessage(form, 'Пароль должен быть не короче 8 символов.', 'error');
    passwordInput?.focus();
    return;
  }

  if (nextPassword !== confirmedPassword) {
    setUserPageAdminPasswordMessage(form, 'Пароли не совпадают.', 'error');
    passwordConfirmInput?.focus();
    passwordConfirmInput?.select();
    return;
  }

  setUserPageAdminPasswordSubmitting(form, true);
  setUserPageAdminPasswordMessage(form, 'Сохраняю пароль...');

  try {
    const { data: sessionData, error: sessionError } = await withAuthRequestTimeout(
      supabaseClient.auth.getSession(),
      'Не удалось получить текущую сессию администратора. Проверь соединение и попробуй снова.'
    );
    const accessToken = sessionData?.session?.access_token || '';

    if (sessionError || !accessToken) {
      throw sessionError || new Error('Сессия администратора не найдена.');
    }

    const response = await fetch(`/admin/users/${encodeURIComponent(profileId)}/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        password: nextPassword,
        confirmEmail: true
      })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.message || 'Не удалось установить пароль.');
    }

    form.reset();
    setUserPageAdminPasswordMessage(form, 'Пароль установлен, e-mail пользователя подтверждён.', 'success');
  } catch (error) {
    console.error('Ошибка админской установки пароля:', error);
    setUserPageAdminPasswordMessage(
      form,
      getReadableAuthErrorMessage(error, 'Не удалось установить пароль. Попробуй ещё раз.'),
      'error'
    );
  } finally {
    setUserPageAdminPasswordSubmitting(form, false);
  }
}

function syncUserPageMainTitle(profile = null) {
  if (!userPageMainTitle) {
    return;
  }

  userPageMainTitle.textContent = isOwnUserProfile(profile)
    ? 'Мой профиль'
    : 'Профиль зрителя';
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

async function fetchUserPageActivityRanks(profileId) {
  const normalizedProfileId = String(profileId || '').trim();

  if (!normalizedProfileId) {
    return null;
  }

  try {
    const response = await fetch(`/profile-activity-ranks/${encodeURIComponent(normalizedProfileId)}`, {
      headers: {
        Accept: 'application/json'
      },
      credentials: 'same-origin'
    });
    const contentType = response.headers.get('Content-Type') || '';

    if (!contentType.toLowerCase().includes('application/json')) {
      console.warn('Profile activity ranks endpoint returned a non-JSON response.');
      return null;
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload?.ok || !payload.ranks) {
      console.warn('Profile activity ranks endpoint returned an error:', payload?.message || response.status);
      return null;
    }

    return payload.ranks;
  } catch (error) {
    console.warn('Profile activity ranks endpoint is unavailable:', error);
    return null;
  }
}

async function fetchPublicUserProfileByHandle(handle) {
  const normalizedHandle = String(handle || '').trim();

  if (!normalizedHandle || !isSafeUserProfileLookupHandle(normalizedHandle)) {
    return null;
  }

  const cachedProfileId = publicProfileIdsByHandleCache.get(normalizedHandle);
  const cachedProfile = cachedProfileId
    ? publicProfilesByIdCache.get(cachedProfileId)
    : null;

  if (cachedProfile) {
    return cachedProfile;
  }

  const profile = await runProfileSelectWithOptionalAvatar(
    selectColumns => supabaseClient
      .from('profiles')
      .select(selectColumns)
      .eq('default_display_name', normalizedHandle)
      .maybeSingle(),
    'id, display_name, default_display_name, avatar_url',
    'id, display_name, default_display_name'
  );

  cachePublicProfileRows(profile ? [profile] : []);

  return profile;
}

async function fetchPublicProfilesByIds(profileIds = []) {
  const normalizedProfileIds = [...new Set(
    (Array.isArray(profileIds) ? profileIds : [])
      .map(profileId => String(profileId || '').trim())
      .filter(Boolean)
  )];

  if (!normalizedProfileIds.length) {
    return [];
  }

  const missingProfileIds = normalizedProfileIds.filter(profileId => !publicProfilesByIdCache.has(profileId));

  if (missingProfileIds.length > 0) {
    const profiles = await runProfileSelectWithOptionalAvatar(
      selectColumns => supabaseClient
        .from('profiles')
        .select(selectColumns)
        .in('id', missingProfileIds),
      'id, display_name, default_display_name, avatar_url',
      'id, display_name, default_display_name'
    );

    cachePublicProfileRows(profiles || []);
  }

  return normalizedProfileIds
    .map(profileId => publicProfilesByIdCache.get(profileId))
    .filter(Boolean);
}

function getUserPageMovieCardHtml(item, getBadgeHtml = null) {
  const movie = item.movie;
  const movieTitle = getManualSimilarMovieLabel(movie);
  const originalTitle = String(movie?.original_title || '').trim();
  const year = movie?.year ? String(movie.year) : '';
  const badgeHtml = getBadgeHtml ? getBadgeHtml(item) : '';
  const posterUrl = getMoviePreferredPosterUrl(movie);

  return `
    <a href="${escapeHtml(buildMoviePageUrl(movie))}" class="user-page-movie-card" aria-label="Перейти к фильму ${escapeHtml(movieTitle)}">
      <div class="user-page-movie-poster-wrapper">
        ${
          posterUrl
            ? `
              <img
                class="user-page-movie-poster"
                ${getPosterImageAttributeHtml(posterUrl, 'similar')}
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

function syncUserPageRailControls(root = userPage) {
  root
    ?.querySelectorAll('[data-user-page-rail-shell="true"]')
    .forEach(updateUserPageRailControls);
}

function bindUserPageRailControls(root = userPage) {
  root
    ?.querySelectorAll('[data-user-page-rail-shell="true"]')
    .forEach(shell => {
      const rail = shell.querySelector('[data-user-page-rail="true"]');

      if (!rail || rail.dataset.userPageRailBound === 'true') {
        return;
      }

      rail.dataset.userPageRailBound = 'true';
      rail.addEventListener('scroll', () => updateUserPageRailControls(shell), { passive: true });
    });

  requestAnimationFrame(() => syncUserPageRailControls(root));
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

let userPageRankTooltipElement = null;
let userPageRankTooltipTarget = null;

function getUserPageRankTooltipElement() {
  if (userPageRankTooltipElement) {
    return userPageRankTooltipElement;
  }

  const tooltip = document.createElement('div');
  tooltip.id = 'userPageRankTooltip';
  tooltip.className = 'user-page-rank-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.appendChild(tooltip);
  userPageRankTooltipElement = tooltip;

  return tooltip;
}

function positionUserPageRankTooltip(target, tooltip) {
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportPadding = 12;
  const gap = 8;
  const left = Math.min(
    Math.max(
      targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      viewportPadding
    ),
    window.innerWidth - tooltipRect.width - viewportPadding
  );
  const preferredTop = targetRect.bottom + gap;
  const fallbackTop = targetRect.top - tooltipRect.height - gap;
  const top = preferredTop + tooltipRect.height + viewportPadding <= window.innerHeight
    ? preferredTop
    : Math.max(viewportPadding, fallbackTop);

  tooltip.style.left = `${Math.round(left)}px`;
  tooltip.style.top = `${Math.round(top)}px`;
}

function hideUserPageRankTooltip() {
  if (userPageRankTooltipTarget) {
    userPageRankTooltipTarget.removeAttribute('aria-describedby');
    userPageRankTooltipTarget.setAttribute('aria-expanded', 'false');
  }

  if (userPageRankTooltipElement) {
    userPageRankTooltipElement.classList.remove('is-visible');
    userPageRankTooltipElement.hidden = true;
    userPageRankTooltipElement.textContent = '';
  }

  userPageRankTooltipTarget = null;
}

function showUserPageRankTooltip(target) {
  const title = target?.dataset?.userPageRankTitle || '';

  if (!title) {
    hideUserPageRankTooltip();
    return;
  }

  const tooltip = getUserPageRankTooltipElement();

  if (userPageRankTooltipTarget && userPageRankTooltipTarget !== target) {
    userPageRankTooltipTarget.removeAttribute('aria-describedby');
    userPageRankTooltipTarget.setAttribute('aria-expanded', 'false');
  }

  userPageRankTooltipTarget = target;
  tooltip.textContent = title;
  tooltip.hidden = false;
  tooltip.classList.add('is-visible');
  target.setAttribute('aria-describedby', tooltip.id);
  target.setAttribute('aria-expanded', 'true');
  positionUserPageRankTooltip(target, tooltip);
}

function toggleUserPageRankTooltip(target) {
  if (userPageRankTooltipTarget === target && userPageRankTooltipElement?.classList.contains('is-visible')) {
    hideUserPageRankTooltip();
    return;
  }

  showUserPageRankTooltip(target);
}

function getUserPageRankTooltipTarget(eventTarget) {
  return eventTarget?.closest?.('[data-user-page-rank-title]');
}

function handleUserPageRankTooltipClick(event) {
  const target = getUserPageRankTooltipTarget(event.target);

  if (target) {
    event.preventDefault();
    toggleUserPageRankTooltip(target);
    return true;
  }

  if (userPageRankTooltipTarget && !event.target?.closest?.('.user-page-rank-tooltip')) {
    hideUserPageRankTooltip();
  }

  return false;
}

function handleUserPageRankTooltipKeydown(event) {
  const target = getUserPageRankTooltipTarget(event.target);

  if (target && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    toggleUserPageRankTooltip(target);
    return true;
  }

  if (event.key === 'Escape' && userPageRankTooltipTarget) {
    hideUserPageRankTooltip();
  }

  return false;
}

function getUserPageMoreCardHtml(hiddenCount, moreUrl = '') {
  const contentHtml = `<strong>И ещё ${hiddenCount}</strong>`;
  const catalogUrl = String(moreUrl || '').trim();

  if (catalogUrl) {
    return `
      <a class="user-page-more-card" href="${escapeHtml(catalogUrl)}" aria-label="Открыть остальные ${hiddenCount} в каталоге">
        ${contentHtml}
      </a>
    `;
  }

  return `
    <div class="user-page-more-card" aria-label="И ещё ${hiddenCount}">
      ${contentHtml}
    </div>
  `;
}

function getUserPageMovieRailHtml(items, emptyText, getBadgeHtml = null, moreUrl = '', totalItems = items.length) {
  if (!items.length) {
    return `<div class="user-page-empty-state">${escapeHtml(emptyText)}</div>`;
  }

  const visibleItems = items.slice(0, USER_PAGE_PREVIEW_LIMIT);
  const hiddenCount = Math.max(0, Number(totalItems || 0) - visibleItems.length);
  const cardsHtml = visibleItems
    .map(item => getUserPageMovieCardHtml(item, getBadgeHtml))
    .join('');
  const moreHtml = hiddenCount > 0 ? getUserPageMoreCardHtml(hiddenCount, moreUrl) : '';

  return `
    <div class="user-page-movie-rail-shell" data-user-page-rail-shell="true">
      <button
        class="user-page-rail-button user-page-rail-button-prev"
        type="button"
        data-user-page-rail-prev="true"
        aria-label="Прокрутить назад"
        hidden
      >
        <span class="user-page-rail-button-icon" aria-hidden="true"></span>
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
        <span class="user-page-rail-button-icon" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function isNotificationsUnavailableError(error) {
  if (!error) {
    return false;
  }

  const code = String(error.code || '').trim();
  const message = String(error.message || error.details || error.hint || '').toLowerCase();

  return (
    NOTIFICATIONS_UNAVAILABLE_CODES.has(code) ||
    message.includes('notification_deliveries') ||
    message.includes('notification_events') ||
    message.includes('notification_preferences') ||
    message.includes('user_follow_notification_preferences') ||
    message.includes('could not find the table') ||
    message.includes('schema cache')
  );
}

function getNotificationsBadgeLabel(count) {
  const normalizedCount = Number(count || 0);

  if (!Number.isFinite(normalizedCount) || normalizedCount <= 0) {
    return '';
  }

  return normalizedCount > 99 ? '99+' : String(normalizedCount);
}

function syncNotificationsBadgeUi() {
  const shouldShowBadge = Boolean(shouldUseAuthenticatedUi() && notificationsUnreadCount > 0);
  const badgeLabel = getNotificationsBadgeLabel(notificationsUnreadCount);
  const authBadge = ensureAuthNotificationBadgeElement();

  if (authBadge) {
    authBadge.hidden = !shouldShowBadge;
    authBadge.textContent = '';
    authBadge.title = shouldShowBadge
      ? `Непрочитанных уведомлений: ${notificationsUnreadCount}`
      : '';
  }

  if (notificationsMenuBadge) {
    notificationsMenuBadge.hidden = !shouldShowBadge;
    notificationsMenuBadge.textContent = shouldShowBadge ? badgeLabel : '';
  }
}

async function refreshNotificationsUnreadCount({ force = false } = {}) {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id || !supabaseClient || areNotificationsUnavailable) {
    notificationsUnreadCount = 0;
    notificationsUnreadUserId = currentUser?.id || '';
    syncNotificationsBadgeUi();
    return 0;
  }

  const currentUserId = String(currentUser.id);

  if (
    !force &&
    notificationsUnreadUserId === currentUserId &&
    Date.now() - notificationsUnreadFetchedAt < NOTIFICATIONS_UNREAD_REFRESH_INTERVAL_MS
  ) {
    syncNotificationsBadgeUi();
    return notificationsUnreadCount;
  }

  if (!force && notificationsUnreadUserId === currentUserId && notificationsUnreadRefreshPromise) {
    return notificationsUnreadRefreshPromise;
  }

  notificationsUnreadUserId = currentUserId;
  notificationsUnreadRefreshPromise = (async () => {
    const { count, error } = await supabaseClient
      .from('notification_deliveries')
      .select('event_id', { count: 'exact', head: true })
      .eq('recipient_id', currentUserId)
      .is('read_at', null);

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        areNotificationsUnavailable = true;
        notificationsUnreadCount = 0;
        syncNotificationsBadgeUi();
        return 0;
      }

      throw error;
    }

    notificationsUnreadCount = Number(count || 0);
    notificationsUnreadFetchedAt = Date.now();
    syncNotificationsBadgeUi();
    return notificationsUnreadCount;
  })();

  try {
    return await notificationsUnreadRefreshPromise;
  } catch (error) {
    console.warn('Ошибка загрузки счётчика уведомлений:', error);
    notificationsUnreadCount = 0;
    syncNotificationsBadgeUi();
    return 0;
  } finally {
    notificationsUnreadRefreshPromise = null;
  }
}

function scheduleNotificationsUnreadRefresh(options = {}) {
  void refreshNotificationsUnreadCount(options);
}

let notificationsPageControllerPromise = null;
let notificationsPageController = null;

function getNotificationsPageControllerContext() {
  return {
    notificationsPage,
    supabaseClient,
    getCurrentUser: () => currentUser,
    shouldUseAuthenticatedUi,
    restoreSession,
    bindSharedAuthStateListener,
    openAuthModal,
    showAppMessage,
    escapeHtml,
    buildFollowingPageUrl,
    buildUserPageUrl,
    buildMoviePageUrl,
    getUserPageAvatarLetter,
    getPublicProfileDisplayName,
    getPublicProfileAvatarUrl,
    getPublicProfileHandle,
    fetchPublicProfilesByIds,
    fetchMoviesByIdsWithSelect,
    ensurePreferredPosterImagesForMovies,
    movieUserPageCardSelect: MOVIE_USER_PAGE_CARD_SELECT,
    getManualSimilarMovieLabel,
    normalizeMovieReviewText,
    normalizeMovieCommentText,
    getMovieContentWarningCoverText,
    getMovieReviewAnchorId,
    getMovieCommentAnchorId,
    formatShortDateTime,
    getUserPageMovieCardHtml,
    bindUserPageRailControls,
    runConfirmedAction,
    isNotificationsUnavailableError,
    isMovieCommentsTableUnavailableError,
    getAreMovieCommentsAvailable: () => areMovieCommentsAvailable,
    setAreMovieCommentsAvailable: value => {
      areMovieCommentsAvailable = Boolean(value);
    },
    setNotificationsUnavailable: value => {
      areNotificationsUnavailable = Boolean(value);
    },
    refreshNotificationsUnreadCount,
    setNotificationsUnreadCount: (count, options = {}) => {
      notificationsUnreadCount = Math.max(0, Number(count || 0));

      if (Object.prototype.hasOwnProperty.call(options, 'userId')) {
        notificationsUnreadUserId = String(options.userId || '');
      }

      if (Object.prototype.hasOwnProperty.call(options, 'fetchedAt')) {
        notificationsUnreadFetchedAt = Number(options.fetchedAt || 0);
      }

      syncNotificationsBadgeUi();
    },
    decrementNotificationsUnreadCount: (amount = 1) => {
      const numericAmount = Math.max(0, Number(amount || 0));
      notificationsUnreadCount = Math.max(0, notificationsUnreadCount - numericAmount);
      syncNotificationsBadgeUi();
    }
  };
}

function loadNotificationsPageController() {
  if (!notificationsPageControllerPromise) {
    notificationsPageControllerPromise = import(getLazyFeatureModuleUrl('notifications-page.js'))
      .then(module => {
        notificationsPageController = module.createNotificationsPageController(getNotificationsPageControllerContext());
        return notificationsPageController;
      })
      .catch(error => {
        notificationsPageControllerPromise = null;
        notificationsPageController = null;
        throw error;
      });
  }

  return notificationsPageControllerPromise;
}

function handleNotificationsPageClick(event) {
  return notificationsPageController?.handleNotificationsPageClick?.(event) || false;
}

function handleNotificationsPagePreferenceChange(event) {
  return notificationsPageController?.handleNotificationsPagePreferenceChange?.(event) || false;
}

function observeNotificationsPageVisibleItems() {
  notificationsPageController?.observeNotificationsPageVisibleItems?.();
}

async function initNotificationsPage() {
  const controller = await loadNotificationsPageController();
  await controller.initNotificationsPage();
}

let followingPageControllerPromise = null;

function getFollowingPageControllerContext() {
  return {
    followingPage,
    supabaseClient,
    getCurrentUser: () => currentUser,
    shouldUseAuthenticatedUi,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    bindSharedAuthStateListener,
    openAuthModal,
    showAppMessage,
    escapeHtml,
    buildUserPageUrl,
    getUserPageAvatarLetter,
    getPublicProfileDisplayName,
    getPublicProfileAvatarUrl,
    getPublicProfileHandle,
    fetchPublicProfilesByIds,
    throwIfSupabaseError,
    isNotificationsUnavailableError,
    setNotificationsUnavailable: value => {
      areNotificationsUnavailable = Boolean(value);
    },
    setCurrentUserFollowedProfileIds: profileIds => {
      currentUserFollowedProfileIds = profileIds instanceof Set
        ? profileIds
        : new Set(Array.isArray(profileIds) ? profileIds : []);
    },
    deleteCurrentUserFollowedProfileId: profileId => {
      currentUserFollowedProfileIds.delete(String(profileId || '').trim());
    }
  };
}

function loadFollowingPageController() {
  if (!followingPageControllerPromise) {
    followingPageControllerPromise = import(getLazyFeatureModuleUrl('following-page.js'))
      .then(module => module.createFollowingPageController(getFollowingPageControllerContext()));
  }

  return followingPageControllerPromise;
}

async function initFollowingPage() {
  const controller = await loadFollowingPageController();
  await controller.initFollowingPage();
}

let userPageControllerPromise = null;
let userPageController = null;

function getUserPageControllerContext() {
  return {
    userPage,
    supabaseClient,
    getCurrentUser: () => currentUser,
    shouldUseAuthenticatedUi,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    bindSharedAuthStateListener,
    escapeHtml,
    buildCatalogProfileActivityUrl,
    getPublicProfileDisplayName,
    getPublicProfileHandle,
    fetchPublicUserProfileByHandle,
    getCatalogMovieMeta,
    addCount,
    fetchMoviesByIdsWithSelect,
    ensurePreferredPosterImagesForMovies,
    movieUserPageCardSelect: MOVIE_USER_PAGE_CARD_SELECT,
    movieUserPageTasteSelect: MOVIE_USER_PAGE_TASTE_SELECT,
    throwIfSupabaseError,
    getManualSimilarMovieLabel,
    getUserPageAvatarHtml,
    getUserPageFollowButtonHtml,
    getUserPageAdminPasswordPanelHtml,
    setUserPageDocumentMeta,
    fetchUserPageActivityRanks,
    isUserPageActivityRankFallbackEnabled: isLocalDevRouteHost,
    syncUserPageMainTitle,
    bindUserPageRailControls,
    syncUserPageProfileSettingsButton,
    getUserPageMovieRailHtml,
    hideUserPageRankTooltip,
    userPageActivityAggregateCacheKey: USER_PAGE_ACTIVITY_AGGREGATE_CACHE_KEY,
    userPagePreviewLimit: USER_PAGE_PREVIEW_LIMIT
  };
}

function loadUserPageController() {
  if (!userPageControllerPromise) {
    userPageControllerPromise = import(getLazyFeatureModuleUrl('user-page.js'))
      .then(module => {
        userPageController = module.createUserPageController(getUserPageControllerContext());
        return userPageController;
      })
      .catch(error => {
        userPageControllerPromise = null;
        userPageController = null;
        throw error;
      });
  }

  return userPageControllerPromise;
}

function invalidateUserPageActivityAggregateRowsCache() {
  userPageController?.invalidateUserPageActivityAggregateRowsCache?.();

  try {
    sessionStorage.removeItem(USER_PAGE_ACTIVITY_AGGREGATE_CACHE_KEY);
  } catch (error) {
    console.warn('?? ??????? ???????? ??? ????????? ???????:', error);
  }
}

async function initUserPage() {
  const controller = await loadUserPageController();
  await controller.initUserPage();
}

function getMoviePageRouteParams() {
  return getMoviePageOrchestratorController().getMoviePageRouteParams();
}

async function fetchMovieById(movieId, selectQuery = MOVIE_DETAIL_SELECT) {
  const { data, error } = await runMovieSelectWithOptionalColumns(
    currentSelectQuery => supabaseClient
      .from('movies')
      .select(currentSelectQuery)
      .eq('id', movieId)
      .order('position', { foreignTable: 'movie_genres', ascending: true })
      .single(),
    selectQuery
  );

  if (error) {
    throw error;
  }

  return data || null;
}

async function getMovieForAdminEdit(movieId, fallbackMovie = null) {
  const candidateMovie = fallbackMovie || getCatalogMovieById(movieId);

  if (hasMovieEditorPayload(candidateMovie)) {
    return candidateMovie;
  }

  return fetchMovieById(movieId, MOVIE_EDITOR_SELECT);
}

async function fetchMovieByRouteParams(routeParams) {
  if (!routeParams) {
    return null;
  }

  if (routeParams.slug) {
    const { data, error } = await runMovieSelectWithOptionalColumns(
      selectQuery => supabaseClient
        .from('movies')
        .select(selectQuery)
        .eq('slug', routeParams.slug)
        .order('position', { foreignTable: 'movie_genres', ascending: true })
        .maybeSingle(),
      MOVIE_DETAIL_SELECT
    );

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

function isMoviePagePayloadRpcUnavailableError(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();

  return (
    code === 'PGRST202' ||
    code === '42883' ||
    message.includes('get_movie_page_payload')
  );
}

function normalizeMoviePagePayload(payload) {
  if (typeof payload !== 'string') {
    return payload || null;
  }

  try {
    return JSON.parse(payload);
  } catch (error) {
    console.warn('Unable to parse movie page RPC payload:', error);
    return null;
  }
}

function applyMoviePagePayload(rawPayload, { skipUserStateFetch = false } = {}) {
  const payload = normalizeMoviePagePayload(rawPayload);
  const movie = payload?.movie || null;

  if (!movie?.id) {
    return null;
  }

  const movieId = String(movie.id);

  upsertMovieRatingStatsRows(
    payload.rating_stats ? [payload.rating_stats] : [],
    [movieId]
  );

  if (!skipUserStateFetch && currentUser) {
    const activeUserId = String(currentUser.id);

    upsertKnownMovieRatingRows(
      payload.current_user_rating ? [payload.current_user_rating] : [],
      row => (
        String(row.movie_id) === movieId &&
        String(row.user_id) === activeUserId
      )
    );

    allMovieWatchlist = allMovieWatchlist.filter(row => !(
      String(row.movie_id) === movieId &&
      String(row.user_id) === activeUserId
    ));

    if (payload.current_user_watchlist) {
      allMovieWatchlist.push(payload.current_user_watchlist);
    }

    rebuildCurrentUserWatchlistIndex();
    markCatalogDataChanged();
  }

  setMoviePosterImagesCache(movieId, Array.isArray(payload.poster_images) ? payload.poster_images : []);
  return movie;
}

async function fetchMoviePagePayloadByRouteParams(routeParams, { skipUserStateFetch = false } = {}) {
  if (!routeParams || !isMoviePagePayloadRpcAvailable) {
    return null;
  }

  const movieId = routeParams.id ? String(routeParams.id) : null;
  const movieSlug = routeParams.slug ? String(routeParams.slug) : null;

  if (!movieId && !movieSlug) {
    return null;
  }

  const shouldIncludeUserState = Boolean(!skipUserStateFetch && shouldUseAuthenticatedUi());
  const { data, error } = await supabaseClient.rpc('get_movie_page_payload', {
    p_movie_id: movieId,
    p_slug: movieSlug,
    p_include_user_state: shouldIncludeUserState
  });

  if (error) {
    if (isMoviePagePayloadRpcUnavailableError(error)) {
      isMoviePagePayloadRpcAvailable = false;
    }

    console.warn('Movie page RPC payload is unavailable, falling back to separate queries:', error);
    return null;
  }

  return applyMoviePagePayload(data, {
    skipUserStateFetch: !shouldIncludeUserState
  });
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
    getPublicOptionalUrl(movie?.kinopoisk_url),
    getPublicOptionalUrl(movie?.imdb_url),
    getPublicOptionalUrl(movie?.letterboxd_url),
    getPublicOptionalUrl(movie?.rottentomatoes_url),
    getPublicOptionalUrl(movie?.tmdb_url)
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
  activeMoviePageSessionCacheSignature = '';
  resetMoviePageComposerState();
  resetMoviePageSimilarState();

  setMoviePageDocumentMeta(null);

  moviePage.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon" aria-hidden="true">◌</div>
      <h1 class="empty-state-title">Фильм не найден</h1>
      <div class="empty-state-text">
        Возможно, ссылка устарела или фильм был удалён из каталога.
      </div>
      <div class="empty-state-actions">
          <a href="${escapeHtml(buildCatalogPageUrl())}" class="secondary-button secondary-button-compact empty-state-reset-btn">
          Вернуться в каталог
        </a>
      </div>
    </div>
  `;
  document.documentElement.classList.add('movie-page-rendered');
}

function resetMoviePageSimilarState() {
  currentMoviePageSimilarMovieId = null;
  currentMoviePageSimilarMovieIds = [];
  currentMoviePageSimilarMovies = [];
  moviePageSimilarRequestId += 1;
  isMoviePageSimilarEditorSaving = false;
  moviePageSimilarEditorSearchQuery = '';
  moviePageSimilarEditorStatus = '';
  moviePageSimilarEditorStatusType = '';
  moviePageSimilarEditorDraggedMovieId = null;
}

function setMoviePageSimilarEditorStatus(message = '', type = '') {
  moviePageSimilarEditorStatus = message;
  moviePageSimilarEditorStatusType = type;
}

function getMoviePageSimilarRenderState(overrides = {}) {
  return {
    movies: allMovies,
    selectedMovieIds: currentMoviePageSimilarMovieIds,
    query: moviePageSimilarEditorSearchQuery,
    isSaving: isMoviePageSimilarEditorSaving,
    status: moviePageSimilarEditorStatus,
    statusType: moviePageSimilarEditorStatusType,
    draggedMovieId: moviePageSimilarEditorDraggedMovieId,
    isAdmin,
    isManualSimilarAvailable: manualSimilarTableAvailable,
    ...overrides
  };
}

function getMoviePageSimilarSectionHtml(similarMovies, movie = currentMoviePageMovieData, { isLoading = false } = {}) {
  return getMoviePageSimilarController().getMoviePageSimilarSectionHtml(
    similarMovies,
    movie,
    getMoviePageSimilarRenderState({ isLoading })
  );
}

function bindMoviePageSimilarEditorEvents(movie) {
  getMoviePageSimilarController().bindMoviePageSimilarEditorEvents(movie, {
    rootElement: moviePage,
    getMovie: () => currentMoviePageMovieData,
    getIsAdmin: () => isAdmin,
    getSelectedMovieIds: () => currentMoviePageSimilarMovieIds,
    getSelectedMovies: () => currentMoviePageSimilarMovies,
    getDraggedMovieId: () => moviePageSimilarEditorDraggedMovieId,
    getIsSaving: () => isMoviePageSimilarEditorSaving,
    setSelectedMovieIds: movieIds => {
      currentMoviePageSimilarMovieIds = movieIds;
    },
    setSelectedMovies: movies => {
      currentMoviePageSimilarMovies = movies;
    },
    setIsSaving: isSaving => {
      isMoviePageSimilarEditorSaving = isSaving;
    },
    setQuery: value => {
      moviePageSimilarEditorSearchQuery = value;
    },
    setStatus: setMoviePageSimilarEditorStatus,
    renderSection: movieId => {
      renderMoviePageSimilarSection(movieId);
    },
    replaceManualSimilarMovies,
    getManualSimilarMovieIds,
    fetchSimilarCardMoviesByIds,
    onSaveError: error => {
      console.error('Ошибка сохранения похожих на деталке:', error);
    },
    onDraggedMovieIdChange: movieId => {
      moviePageSimilarEditorDraggedMovieId = movieId;
    }
  });
}

function renderMoviePageSimilarSection(movieId) {
  const mount = moviePage?.querySelector('[data-movie-page-similar-mount="true"]');

  if (!mount) {
    return;
  }

  const movie = currentMoviePageMovieData;
  const similarMovies = String(currentMoviePageSimilarMovieId) === String(movieId)
    ? currentMoviePageSimilarMovies
    : [];

  mount.innerHTML = getMoviePageSimilarSectionHtml(similarMovies, movie);
  bindPosterFallbackImages(mount);
  bindMoviePageSimilarEditorEvents(movie);
}

async function loadMoviePageSimilarMovies(movie, limit = 4, { shouldRender = true } = {}) {
  return getMoviePageSimilarController().loadMoviePageSimilarMovies(movie, {
    rootElement: moviePage,
    getCurrentMovieId: () => currentMoviePageMovieId,
    getSimilarMovieId: () => currentMoviePageSimilarMovieId,
    createRequestId: () => {
      moviePageSimilarRequestId += 1;
      return moviePageSimilarRequestId;
    },
    getRequestId: () => moviePageSimilarRequestId,
    getIsAdmin: () => isAdmin,
    setSimilarMovieId: movieId => {
      currentMoviePageSimilarMovieId = movieId;
    },
    setSelectedMovieIds: movieIds => {
      currentMoviePageSimilarMovieIds = movieIds;
    },
    setSelectedMovies: movies => {
      currentMoviePageSimilarMovies = movies;
    },
    setQuery: value => {
      moviePageSimilarEditorSearchQuery = value;
    },
    setStatus: setMoviePageSimilarEditorStatus,
    renderSection: movieId => {
      renderMoviePageSimilarSection(movieId);
    },
    renderMoviePage,
    ensureAdminSimilarDataLoaded: () => ensureManualSimilarDataLoaded({ ensureMovies: true }),
    getManualSimilarMovieIds,
    fetchPublicSimilarMovieIds: (movieId, publicLimit) => (
      fetchManualSimilarMovieIdsForMovie(movieId, publicLimit)
    ),
    fetchSimilarCardMoviesByIds,
    persistSessionCache: persistCurrentMoviePageSessionCache,
    onLoadError: error => {
      console.error('Ошибка загрузки похожих фильмов:', error);
    }
  }, limit, { shouldRender });
}

function getMoviePagePosterGalleryImages(movie) {
  return getMoviePageShellController().getMoviePagePosterGalleryImages(movie);
}

function renderMoviePageSkeleton() {
  if (!moviePage) {
    return;
  }

  document.documentElement.classList.remove('movie-page-rendered');
  moviePage.innerHTML = getMoviePageShellController().getMoviePageSkeletonHtml();
}

function bindMoviePageHeaderEvents(movie, rootElement = moviePage) {
  if (!rootElement || !movie) {
    return;
  }

  bindPosterFallbackImages(rootElement);
  const controller = getLoadedMoviePageInteractionsController();

  if (controller) {
    controller.bindMoviePageHeaderEvents(movie, rootElement);
    return;
  }

  ensureMoviePageInteractionsControllerLoaded()
    .then(interactionsController => {
      interactionsController.bindMoviePageHeaderEvents(movie, rootElement);
    })
    .catch(error => {
      console.error('Ошибка загрузки interaction-модуля детальной страницы:', error);
    });
}

function renderMoviePageHeaderSection(movie) {
  if (!moviePage || !movie) {
    return;
  }

  const headerElement = moviePage.querySelector('.movie-page-layout');

  if (!headerElement) {
    renderMoviePage(movie);
    return;
  }

  currentMoviePageMovieId = movie.id;
  currentMoviePageMovieData = movie;

  const viewModel = getMoviePageShellController().buildMoviePageViewModel(movie, {
    includeSocialSections: false
  });

  headerElement.outerHTML = getMoviePageShellController().getMoviePageHeaderHtml(movie, viewModel);
  bindMoviePageHeaderEvents(movie);
  document.documentElement.classList.add('movie-page-rendered');
}

function renderMoviePage(movie, { socialLoading = false, similarLoading = false } = {}) {
  if (!moviePage || !movie) {
    return;
  }

  if (String(currentMoviePageMovieId || '') !== String(movie.id || '')) {
    resetMoviePageComposerState();
  }

  currentMoviePageMovieId = movie.id;
  currentMoviePageMovieData = movie;

  const viewModel = getMoviePageShellController().buildMoviePageViewModel(movie, {
    includeSocialSections: !socialLoading
  });
  const reviewsSectionHtml = socialLoading
    ? getMoviePageReviewsSectionHtml(movie, { isLoading: true })
    : viewModel.reviewsSectionHtml;
  const commentsSectionHtml = socialLoading
    ? getMoviePageCommentsSectionHtml(movie, { isLoading: true })
    : viewModel.commentsSectionHtml;
  const similarSectionHtml = similarLoading
    ? getMoviePageSimilarSectionHtml([], movie, { isLoading: true })
    : String(currentMoviePageSimilarMovieId) === String(movie.id)
      ? getMoviePageSimilarSectionHtml(currentMoviePageSimilarMovies, movie)
      : '';

  setMoviePageDocumentMeta(movie);

  moviePage.innerHTML = `
    <div class="movie-page-stack">
      ${getMoviePageShellController().getMoviePageHeaderHtml(movie, viewModel)}

      ${reviewsSectionHtml}
      ${commentsSectionHtml}
      <div data-movie-page-similar-mount="true">
        ${similarSectionHtml}
      </div>
    </div>
  `;
  document.documentElement.classList.add('movie-page-rendered');

  bindMoviePageHeaderEvents(movie);
  bindMoviePageReviewEvents(movie);
  bindMoviePageCommentEvents(movie);
  bindMoviePageSimilarEditorEvents(movie);
  if (!socialLoading && !getLoadedMovieSocialController()) {
    scheduleMovieSocialSectionsHydration(movie);
  }
  requestAnimationFrame(focusMoviePageHashTarget);
}

async function deleteMovieFromMoviePage(movieId, movieTitle) {
  try {
    await deleteMovieRecord(movieId);
    removeMovieFromCatalogSessionSnapshot(movieId);
    removeMoviePageSessionCacheForMovie(currentMoviePageMovieData || { id: movieId });
    window.location.href = buildCatalogPageUrl();
  } catch (error) {
    console.error('Ошибка при удалении фильма со страницы detail-page:', error);
  }
}

async function loadDeferredMoviePageSections(movie, { shouldRender = true } = {}) {
  return getMoviePageOrchestratorController().loadDeferredMoviePageSections(movie, {
    getCurrentMovieId: () => currentMoviePageMovieId,
    loadSimilarMovies: loadMoviePageSimilarMovies,
    fetchReviews: fetchMovieReviews,
    renderReviewsSection: renderMoviePageReviewsSection,
    renderReviewsStatus: renderMoviePageReviewsStatus,
    onReviewsLoadError: error => {
      console.error('Ошибка загрузки рецензий на деталке:', error);
    },
    fetchComments: fetchMovieComments,
    renderCommentsSection: renderMoviePageCommentsSection,
    renderCommentsStatus: renderMoviePageCommentsStatus,
    onCommentsLoadError: error => {
      console.error('Ошибка загрузки комментариев на деталке:', error);
    },
    syncCatalogSnapshot: syncCatalogSessionSnapshotMovieState,
    persistSessionCache: persistCurrentMoviePageSessionCache
  }, { shouldRender });
}

async function loadMoviePageByRouteParams(routeParams, {
  warmMovie = null,
  skipUserStateFetch = false,
  skipRenderIfCacheFresh = false
} = {}) {
  return getMoviePageOrchestratorController().loadMoviePageByRouteParams(routeParams, {
    fetchPayloadByRouteParams: fetchMoviePagePayloadByRouteParams,
    fetchMovieByRouteParams,
    getAreDirectorsAvailable: () => areDirectorsAvailable,
    ensureDirectorItemsLoaded: ensureMovieDirectorItemsLoaded,
    fetchRatingStats: fetchMovieRatingStatsForMovie,
    fetchPosterImages: fetchMoviePosterImagesForMovieSafe,
    fetchCurrentUserRating: fetchCurrentUserRatingForMovie,
    fetchCurrentUserWatchlist: fetchMovieWatchlistForCurrentUser,
    getCurrentMovieId: () => currentMoviePageMovieId,
    getCurrentMovie: () => currentMoviePageMovieData,
    setCurrentMovie: movie => {
      currentMoviePageMovieId = movie?.id || null;
      currentMoviePageMovieData = movie || null;
    },
    resetComposerState: resetMoviePageComposerState,
    createSessionCacheEntry: createMoviePageSessionCacheEntry,
    getActiveSessionCacheSignature: () => activeMoviePageSessionCacheSignature,
    setActiveSessionCacheSignature: signature => {
      activeMoviePageSessionCacheSignature = signature || activeMoviePageSessionCacheSignature;
    },
    hasRenderedMoviePage: () => Boolean(
      moviePage?.querySelector('.movie-page-stack:not(.movie-page-stack-skeleton)')
    ),
    renderMoviePage,
    loadDeferredSections: loadDeferredMoviePageSections,
    removeMovieFromCatalogSnapshot: removeMovieFromCatalogSessionSnapshot,
    removeSessionCacheForMovie: removeMoviePageSessionCacheForMovie,
    renderNotFound: renderMoviePageNotFound
  }, {
    warmMovie,
    skipUserStateFetch,
    skipRenderIfCacheFresh
  });
}

async function initMoviePage() {
  await ensureMoviePageOrchestratorControllerLoaded();

  return getMoviePageOrchestratorController().initMoviePage({
    getRouteParams: getMoviePageRouteParams,
    renderNotFound: renderMoviePageNotFound,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    ensureDetailModulesLoaded: () => Promise.all([
      ensureMovieDetailCacheControllerLoaded(),
      ensureMoviePageShellControllerLoaded(),
      ensureMoviePageInteractionsControllerLoaded(),
      ensureMoviePageSimilarControllerLoaded()
    ]),
    restoreFromSessionCache: restoreMoviePageFromSessionCache,
    hydrateFromCatalogSnapshot: hydrateMoviePageFromCatalogSnapshot,
    renderSkeleton: renderMoviePageSkeleton,
    loadByRouteParams: loadMoviePageByRouteParams,
    getCurrentMovie: () => currentMoviePageMovieData,
    renderMoviePage,
    renderReviewsStatus: renderMoviePageReviewsStatus,
    renderCommentsStatus: renderMoviePageCommentsStatus,
    bindSharedAuthStateListener,
    onLoadError: error => {
      console.error('Ошибка загрузки страницы фильма:', error);
    },
    onAuthSyncError: error => {
      console.error('Ошибка синхронизации страницы фильма после auth:', error);
    }
  });
}

async function initDetectedPage() {
  if (isCatalogPage()) {
    bindCatalogPageEvents();
    await initCatalogPage();
    return;
  }

  if (isUserPage()) {
    await initUserPage();
    return;
  }

  if (isFollowingPage()) {
    await initFollowingPage();
    return;
  }

  if (isNotificationsPage()) {
    await initNotificationsPage();
    return;
  }

  if (isEditorPage()) {
    await initEditorPage();
    return;
  }

  if (isDirectorsAdminPage()) {
    await initDirectorsAdminPage();
    return;
  }

  if (isDirectorPage()) {
    await initDirectorPage();
    return;
  }

  if (isMoviePage()) {
    bindMoviePageEvents();
    await initMoviePage();
  }
}

async function initSharedApp() {
  const initialAuthRedirectInfo = getAuthRedirectInfo();

  isPasswordRecoveryEntryPage = initialAuthRedirectInfo.isRecovery;
  const wasResetApplied = applyBuildVersionSoftResetIfNeeded();

  if (wasResetApplied) {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    return false;
  }

  bindCustomSelectGlobalEvents();
  initCustomSelects();
  initCurrentPageLinkGuard();
  bindSharedUiEvents();

  const authRedirectResult = await consumeAuthRedirectFromUrl(initialAuthRedirectInfo);

  if (authRedirectResult.error) {
    if (authRedirectResult.isRecovery) {
      localStorage.removeItem(PASSWORD_RECOVERY_PENDING_KEY);
      isPasswordRecoveryEntryPage = false;
      openAuthModal();
      showAuthMessage(
        getReadableAuthErrorMessage(
          authRedirectResult.error,
          'Ссылка для сброса пароля недействительна или устарела. Запроси новое письмо.'
        ),
        'error'
      );
    } else {
      showAppMessage(
        getReadableAuthErrorMessage(
          authRedirectResult.error,
          'Не удалось выполнить вход по ссылке. Попробуй запросить новую ссылку.'
        ),
        'error',
        true
      );
    }
  } else {
    isPasswordRecoveryEntryPage = authRedirectResult.isRecovery;
    handlePasswordRecoveryEntry(authRedirectResult.isRecovery);
  }

  return true;
}

async function init() {
  const shouldContinue = await initSharedApp();

  if (shouldContinue === false) {
    return;
  }

  await initDetectedPage();
}

window.HorroreiroApp = {
  init,
  initSharedApp,
  initDetectedPage,
  bindCatalogPageEvents,
  bindMoviePageEvents,
  initCatalogPage,
  initUserPage,
  initFollowingPage,
  initNotificationsPage,
  initEditorPage,
  initDirectorPage,
  initDirectorsAdminPage,
  initMoviePage
};
