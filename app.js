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
const profileSummaryButton = document.getElementById('profileSummaryButton');
const notificationsSummaryButton = document.getElementById('notificationsSummaryButton');
const notificationsMenuBadge = document.getElementById('notificationsMenuBadge');
const followingSummaryButton = document.getElementById('followingSummaryButton');

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
const NOTIFICATIONS_PAGE_LIMIT = 80;
const NOTIFICATION_READ_DWELL_MS = 1300;
const NOTIFICATION_READ_VISIBILITY_RATIO = 0.7;
const NOTIFICATION_CONTEXT_SNIPPET_LABELS = {
  review: 'Рецензия',
  comment: 'Комментарий'
};
const NOTIFICATIONS_UNREAD_REFRESH_INTERVAL_MS = 60000;
const NOTIFICATIONS_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_REVIEW_MIN_LENGTH = 80;
const MOVIE_REVIEW_MAX_LENGTH = 5000;
const MOVIE_REVIEW_REPLY_SNIPPET_MAX_LENGTH = 120;
const MOVIE_REVIEW_RAIL_SCROLL_STEP_RATIO = 1;
const MOVIE_COMMENT_MAX_LENGTH = 1200;
const MOVIE_COMMENT_MAX_DEPTH = 2;
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
const CATALOG_SESSION_SNAPSHOT_VERSION = 6;
const CATALOG_SESSION_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
const CATALOG_DOM_SNAPSHOT_IDLE_TIMEOUT_MS = 1200;
const CATALOG_PAGE_SIZE = 40;
const CATALOG_PAGINATION_PAGE_SLOTS = 6;
const CATALOG_PAGINATION_COMPACT_PAGE_SLOTS = 4;
const CATALOG_PRIORITY_POSTER_COUNT = 8;
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
const BASE_HORROR_GENRE_NORMALIZED = '\u0443\u0436\u0430\u0441\u044b';
const MANUAL_SIMILAR_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_REVIEW_LIKES_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_POSTER_IMAGES_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_COMMENTS_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const MOVIE_COMMENT_LIKES_UNAVAILABLE_CODES = new Set(['42P01', '42501', 'PGRST205']);
const SITE_ORIGIN = 'https://horroreiro.ru';
const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/og-preview.jpg`;
const MOVIE_STRUCTURED_DATA_SCRIPT_ID = 'movieStructuredData';
const CATALOG_STRUCTURED_DATA_SCRIPT_ID = 'catalogItemListStructuredData';
const AUTH_REQUEST_TIMEOUT_MS = 20000;
const AUTH_PROFILE_REQUEST_TIMEOUT_MS = 15000;
const USER_PAGE_PREVIEW_LIMIT = 10;
const USER_PAGE_ACTIVITY_AGGREGATE_LIMIT = 10000;
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
let currentUserFollowedProfileIds = new Set();
let userPageFollowRequestProfileIds = new Set();
let notificationsUnreadCount = 0;
let notificationsUnreadUserId = '';
let notificationsUnreadRefreshPromise = null;
let notificationsUnreadFetchedAt = 0;
let areNotificationsUnavailable = false;
let notificationsPageItems = [];
let notificationsPageFilter = 'all';
let isNotificationsPageMarkingAllRead = false;
let isNotificationTestRunning = false;
let notificationsPagePreferences = null;
let notificationPreferenceRequestKeys = new Set();
let notificationReadDwellTimers = new Map();
let notificationReadObserver = null;
let areNotificationReadTrackingEventsBound = false;
let followingPagePreferenceRequestKeys = new Set();
let followingPageUnfollowRequestProfileIds = new Set();
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
let isCompletenessAuditRunning = false;
let isDatabaseExportRunning = false;
let moviePosterImagesByMovieId = new Map();
let moviePosterImagesLoadedByMovieId = new Set();
let moviePosterImagesLoadPromisesByMovieId = new Map();
let moviePosterImagesTableAvailable = true;
let moviePosterImagesDraft = [];
let moviePosterImagesDraftDirty = false;
let moviePosterImagesDraftDraggedEntryId = null;
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
let reviewRequestInFlight = new Set();
let reviewLikeRequestInFlight = new Set();
let movieReviewHighlightTimers = new WeakMap();
let movieReviewRailResizeObservers = new WeakMap();
let areMovieReviewLikesAvailable = true;
let movieCommentRequestInFlight = new Set();
let movieCommentLikeRequestInFlight = new Set();
let areMovieCommentsAvailable = true;
let areMovieCommentLikesAvailable = true;
let expandedSpoilerReviewIds = new Set();
let expandedMovieReviewTextIds = new Set();
let expandedSpoilerCommentIds = new Set();
let expandedMovieCommentThreadKeys = new Set();
let editingMovieReviewId = null;
let editingMovieCommentId = null;
let replyingMovieCommentTargetKey = '';
let isMovieReviewComposerExpanded = false;
let isMovieCommentComposerExpanded = false;
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
let movieTrailerModal = null;
let movieTrailerFrame = null;
let movieTrailerModalTitle = null;
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
let currentMoviePageSimilarMovieId = null;
let currentMoviePageSimilarMovieIds = [];
let currentMoviePageSimilarMovies = [];
let currentMoviePagePosterIndexByMovieId = new Map();
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

function normalizeTextArrayField(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => String(item || '').trim())
    .filter(Boolean);
}

function getTextArrayFormValue(value) {
  return normalizeTextArrayField(value).join('\n');
}

function getOptionalTextArrayPayload(values = []) {
  const normalizedValues = normalizeTextArrayField(values);

  return normalizedValues.length > 0 ? normalizedValues : null;
}

function formatTextArrayForDetail(value) {
  return normalizeTextArrayField(value).join(', ');
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

async function fetchMoviesByIdsWithSelect(movieIds = [], selectQuery = MOVIE_CATALOG_SELECT) {
  const normalizedMovieIds = normalizeManualSimilarMovieIds(movieIds);

  if (!normalizedMovieIds.length) {
    return [];
  }

  const { data, error } = await runMovieSelectWithOptionalColumns(
    currentSelectQuery => {
      let query = supabaseClient
        .from('movies')
        .select(currentSelectQuery)
        .in('id', normalizedMovieIds);

      if (String(currentSelectQuery || '').includes('movie_genres')) {
        query = query.order('position', { foreignTable: 'movie_genres', ascending: true });
      }

      return query;
    },
    selectQuery
  );

  throwIfSupabaseError(error);

  const moviesById = new Map((data || []).map(movie => [String(movie.id), movie]));

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

async function fetchAdminMovieRows() {
  return fetchAllSupabaseRows(() => (
    supabaseClient
      .from('movies')
      .select('*')
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

function getMovieCompletenessAuditLabel(movie) {
  const title = String(movie?.title || 'Без названия').trim();
  const year = movie?.year ? ` (${movie.year})` : '';
  const slug = String(movie?.slug || '').trim();
  const path = slug
    ? `/movie/${slug}`
    : `/movie.html?id=${movie?.id || ''}`;

  return `${title}${year} — ${path}`;
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

function buildCompletenessAuditReport(movies, posterRows) {
  const sortedMovies = [...movies].sort(compareManualSimilarAuditMovies);
  const posterRowsByMovieId = groupRowsByMovieId(posterRows);
  const emptyProductionMovies = [];
  const primaryPosterOnlyMovies = [];
  const emptyKinopoiskMovies = [];
  const emptyTrailerMovies = [];
  const emptyRuntimeMovies = [];

  sortedMovies.forEach(movie => {
    const movieId = String(movie?.id || '');
    const moviePosterRows = posterRowsByMovieId.get(movieId) || [];

    if (isEmptyTextArrayLikeField(movie?.production)) {
      emptyProductionMovies.push(movie);
    }

    if (String(movie?.poster_url || '').trim() && getUniqueMoviePosterUrlCount(movie, moviePosterRows) === 1) {
      primaryPosterOnlyMovies.push(movie);
    }

    if (!String(movie?.kinopoisk_url || '').trim()) {
      emptyKinopoiskMovies.push(movie);
    }

    if (!String(movie?.trailer_url || '').trim()) {
      emptyTrailerMovies.push(movie);
    }

    if (!normalizeRuntimeMinutesValue(movie?.runtime_minutes)) {
      emptyRuntimeMovies.push(movie);
    }
  });

  const lines = [
    'Аудит заполненности карточек Хоррорейро',
    `Дата: ${getManualSimilarAuditDateStamp()}`,
    '',
    'Сводка:',
    `  Фильмов в каталоге: ${movies.length}`,
    `  Пустое поле "Производство": ${emptyProductionMovies.length}`,
    `  Только основной poster_url: ${primaryPosterOnlyMovies.length}`,
    `  Пустое поле "Кинопоиск": ${emptyKinopoiskMovies.length}`,
    `  Пустое поле "Трейлер": ${emptyTrailerMovies.length}`,
    `  Пустое поле "Время": ${emptyRuntimeMovies.length}`
  ];

  appendManualSimilarAuditSection(
    lines,
    '1. Пустое поле "Производство":',
    emptyProductionMovies,
    getMovieCompletenessAuditLabel
  );

  appendManualSimilarAuditSection(
    lines,
    '2. Только основной poster_url:',
    primaryPosterOnlyMovies,
    getMovieCompletenessAuditLabel
  );

  appendManualSimilarAuditSection(
    lines,
    '3. Пустое поле "Кинопоиск":',
    emptyKinopoiskMovies,
    getMovieCompletenessAuditLabel
  );

  appendManualSimilarAuditSection(
    lines,
    '4. Пустое поле "Трейлер":',
    emptyTrailerMovies,
    getMovieCompletenessAuditLabel
  );

  appendManualSimilarAuditSection(
    lines,
    '5. Пустое поле "Время":',
    emptyRuntimeMovies,
    getMovieCompletenessAuditLabel
  );

  return {
    text: `${lines.join('\n')}\n`,
    summary: {
      emptyProduction: emptyProductionMovies.length,
      primaryPosterOnly: primaryPosterOnlyMovies.length,
      emptyKinopoisk: emptyKinopoiskMovies.length,
      emptyTrailer: emptyTrailerMovies.length,
      emptyRuntime: emptyRuntimeMovies.length
    }
  };
}

function getRowsForExportGroup(groupedRows, movieId) {
  return groupedRows.get(String(movieId || '')) || [];
}

function getExportRowPosition(row, fallbackIndex) {
  const position = Number(row?.position);

  return Number.isFinite(position) ? position : fallbackIndex;
}

function sortExportRowsByPosition(rows = []) {
  return [...rows].sort((firstRow, secondRow) => (
    getExportRowPosition(firstRow, 0) - getExportRowPosition(secondRow, 0)
  ));
}

function getExportGenreNames(rows = [], { includeBaseHorror = true } = {}) {
  return sortExportRowsByPosition(rows)
    .map(row => String(row?.genres?.name || row?.genre_name || row?.name || '').trim())
    .filter(name => includeBaseHorror || normalizeSearchText(name) !== BASE_HORROR_GENRE_NORMALIZED)
    .filter(Boolean);
}

function getExportCountryNames(rows = []) {
  return rows
    .map(row => String(row?.countries?.name || row?.country_name || row?.name || '').trim())
    .filter(Boolean)
    .sort((firstName, secondName) => firstName.localeCompare(secondName, 'ru'));
}

function getExportPosterImages(movie, rows = []) {
  const usedUrls = new Set();
  const images = [];
  const primaryPosterUrl = String(movie?.poster_url || '').trim();

  if (primaryPosterUrl) {
    usedUrls.add(primaryPosterUrl);
    images.push({
      role: 'primary',
      image_url: primaryPosterUrl,
      position: 0
    });
  }

  sortExportRowsByPosition(rows).forEach((row, index) => {
    const imageUrl = String(row?.image_url || '').trim();

    if (!imageUrl || usedUrls.has(imageUrl)) {
      return;
    }

    usedUrls.add(imageUrl);
    images.push({
      ...row,
      role: 'additional',
      position: getExportRowPosition(row, index + 1)
    });
  });

  return images;
}

function getExportManualSimilarItems(rows = []) {
  return sortExportRowsByPosition(rows).map((row, index) => ({
    ...row,
    position: getExportRowPosition(row, index),
    similar_movie_id: row?.similar_movie_id || null
  }));
}

function buildEditableMovieExport(movie, {
  movieGenres = [],
  movieCountries = [],
  posterImages = [],
  manualSimilarRows = []
} = {}) {
  return {
    id: movie?.id || null,
    slug: movie?.slug || '',
    title: movie?.title || '',
    original_title: movie?.original_title || '',
    year: movie?.year ?? null,
    runtime_minutes: movie?.runtime_minutes ?? null,
    release_year: movie?.release_year ?? null,
    release_month: movie?.release_month ?? null,
    sort_order: movie?.sort_order ?? null,
    director: parseLineOrCommaSeparatedValues(movie?.director || ''),
    genres: getExportGenreNames(movieGenres, { includeBaseHorror: false }),
    countries: getExportCountryNames(movieCountries),
    production: normalizeTextArrayField(movie?.production),
    distribution: normalizeTextArrayField(movie?.distribution),
    russian_distribution: normalizeTextArrayField(movie?.russian_distribution),
    synopsis: movie?.synopsis || '',
    formats: normalizeTextArrayField(movie?.formats),
    tags_perceived: normalizeTextArrayField(movie?.tags_perceived),
    search_aliases: normalizeTextArrayField(movie?.search_aliases),
    kinopoisk_url: movie?.kinopoisk_url || '',
    imdb_url: movie?.imdb_url || '',
    letterboxd_url: movie?.letterboxd_url || '',
    letterboxd_short_url: movie?.letterboxd_short_url || '',
    rottentomatoes_url: movie?.rottentomatoes_url || '',
    trailer_url: movie?.trailer_url || '',
    poster_url: movie?.poster_url || '',
    poster_images: getExportPosterImages(movie, posterImages),
    manual_similar: getExportManualSimilarItems(manualSimilarRows)
  };
}

function buildDatabaseExportPayload({
  movies,
  movieGenres,
  movieCountries,
  posterImages,
  manualSimilarRows
}) {
  const movieGenresByMovieId = groupRowsByMovieId(movieGenres);
  const movieCountriesByMovieId = groupRowsByMovieId(movieCountries);
  const posterImagesByMovieId = groupRowsByMovieId(posterImages);
  const manualSimilarRowsByMovieId = groupRowsByMovieId(manualSimilarRows);

  return {
    exported_at: new Date().toISOString(),
    app_build_version: APP_BUILD_VERSION,
    source_origin: window.location.origin,
    format: 'horroreiro-database-export-v1',
    counts: {
      movies: movies.length,
      movie_genres: movieGenres.length,
      movie_countries: movieCountries.length,
      movie_poster_images: posterImages.length,
      movie_manual_similar: manualSimilarRows.length
    },
    movies: movies.map(movie => {
      const movieId = String(movie?.id || '');
      const relatedMovieGenres = getRowsForExportGroup(movieGenresByMovieId, movieId);
      const relatedMovieCountries = getRowsForExportGroup(movieCountriesByMovieId, movieId);
      const relatedPosterImages = getRowsForExportGroup(posterImagesByMovieId, movieId);
      const relatedManualSimilarRows = getRowsForExportGroup(manualSimilarRowsByMovieId, movieId);

      return {
        editable_fields: buildEditableMovieExport(movie, {
          movieGenres: relatedMovieGenres,
          movieCountries: relatedMovieCountries,
          posterImages: relatedPosterImages,
          manualSimilarRows: relatedManualSimilarRows
        }),
        raw: {
          movies: movie,
          movie_genres: relatedMovieGenres,
          movie_countries: relatedMovieCountries,
          movie_poster_images: relatedPosterImages,
          movie_manual_similar: relatedManualSimilarRows
        }
      };
    })
  };
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

function downloadJsonFile(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
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

function getCompletenessAuditSummaryMessage(summary) {
  const totalProblems = (
    summary.emptyProduction +
    summary.primaryPosterOnly +
    summary.emptyKinopoisk +
    summary.emptyTrailer +
    summary.emptyRuntime
  );

  if (totalProblems === 0) {
    return 'Аудит заполненности готов: недозаполненных контуров нет.';
  }

  return [
    'Аудит заполненности готов:',
    `производство ${summary.emptyProduction}`,
    `один постер ${summary.primaryPosterOnly}`,
    `Кинопоиск ${summary.emptyKinopoisk}`,
    `трейлер ${summary.emptyTrailer}`,
    `время ${summary.emptyRuntime}`
  ].join(' ');
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
      fetchAdminMovieRows(),
      fetchAdminMoviePosterImageRows()
    ]);
    const report = buildCompletenessAuditReport(movies, posterRows);
    const filename = `horroreiro-completeness-audit-${getManualSimilarAuditDateStamp()}.txt`;

    downloadTextFile(filename, report.text);
    showAppMessage(getCompletenessAuditSummaryMessage(report.summary), 'success', false, {
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
      manualSimilarRows
    ] = await Promise.all([
      fetchAdminMovieRows(),
      fetchAdminMovieGenreRows(),
      fetchAdminMovieCountryRows(),
      fetchAdminMoviePosterImageRows(),
      fetchAdminManualSimilarRows()
    ]);
    const payload = buildDatabaseExportPayload({
      movies,
      movieGenres,
      movieCountries,
      posterImages,
      manualSimilarRows
    });
    const filename = `horroreiro-database-export-${getManualSimilarAuditDateStamp()}.json`;

    downloadJsonFile(filename, payload);
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

function isNotificationTestFunctionMissingError(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();

  return (
    code === '42883' ||
    code === 'PGRST202' ||
    message.includes('create_notification_test_suite') ||
    message.includes('could not find the function') ||
    message.includes('schema cache')
  );
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
      const pageData = await fetchNotificationsPageData();
      await refreshNotificationsUnreadCount({ force: true });
      renderNotificationsPage(pageData);
    } else {
      window.location.href = buildNotificationsPageUrl();
    }
  } catch (error) {
    console.error('Ошибка генерации тестовых уведомлений:', error);

    if (isNotificationTestFunctionMissingError(error)) {
      showAppMessage('Тест уведомлений недоступен: примените notification-test-tools-setup.sql в Supabase.', 'error', true);
    } else {
      showAppMessage(`Не удалось создать тестовые уведомления: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  } finally {
    isNotificationTestRunning = false;
    setNotificationTestButtonState(false);
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

function createMoviePosterImageDraftEntryId(prefix = 'poster') {
  if (window.crypto?.randomUUID) {
    return `${prefix}:${window.crypto.randomUUID()}`;
  }

  return `${prefix}:${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function createMoviePosterImageDraftEntryFromRow(row) {
  const normalizedRow = normalizeMoviePosterImageRows([row])[0];

  if (!normalizedRow) {
    return null;
  }

  return {
    entryId: `existing:${normalizedRow.id || normalizedRow.image_url}`,
    type: 'existing',
    id: normalizedRow.id,
    imageUrl: normalizedRow.image_url,
    label: 'Сохранённое изображение'
  };
}

function createMoviePosterImageDraftEntryFromPrimaryUrl(imageUrl) {
  const normalizedImageUrl = String(imageUrl || '').trim();

  if (!normalizedImageUrl) {
    return null;
  }

  return {
    entryId: `primary:${normalizedImageUrl}`,
    type: 'existing-primary',
    id: '',
    imageUrl: normalizedImageUrl,
    label: 'Сохранённое изображение'
  };
}

function createMoviePosterImageDraftEntryFromFile(file) {
  if (!file) {
    return null;
  }

  return {
    entryId: createMoviePosterImageDraftEntryId('pending'),
    type: 'pending',
    file,
    objectUrl: URL.createObjectURL(file),
    imageUrl: '',
    label: file.name || 'Новое изображение'
  };
}

function getMoviePosterImageDraftPreviewUrl(entry) {
  return String(entry?.objectUrl || entry?.imageUrl || '').trim();
}

function revokeMoviePosterImageDraftObjectUrl(entry) {
  if (entry?.objectUrl) {
    URL.revokeObjectURL(entry.objectUrl);
  }
}

function resetMoviePosterImagesDraft() {
  moviePosterImagesDraft.forEach(revokeMoviePosterImageDraftObjectUrl);
  moviePosterImagesDraft = [];
  moviePosterImagesDraftDirty = false;
  moviePosterImagesDraftDraggedEntryId = null;
  updatePosterFileUi();
  renderMoviePosterImagesDraftList();
}

function setMoviePosterImagesDraftFromMovie(movie, rows = [], { markDirty = false } = {}) {
  const usedImageUrls = new Set();
  const draftEntries = [];
  const primaryEntry = createMoviePosterImageDraftEntryFromPrimaryUrl(movie?.poster_url);

  if (primaryEntry) {
    usedImageUrls.add(primaryEntry.imageUrl);
    draftEntries.push(primaryEntry);
  }

  normalizeMoviePosterImageRows(rows)
    .map(createMoviePosterImageDraftEntryFromRow)
    .filter(Boolean)
    .forEach(entry => {
      if (usedImageUrls.has(entry.imageUrl)) {
        return;
      }

      usedImageUrls.add(entry.imageUrl);
      draftEntries.push(entry);
    });

  moviePosterImagesDraft.forEach(revokeMoviePosterImageDraftObjectUrl);
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

  if (!moviePosterImagesTableAvailable) {
    moviePosterImagesList.innerHTML = `
      <div class="movie-poster-images-empty">
        Галерея недоступна: примените SQL-миграцию и повторите попытку.
      </div>
    `;
    return;
  }

  if (moviePosterImagesDraft.length === 0) {
    moviePosterImagesList.innerHTML = `
      <div class="movie-poster-images-empty">
        Постеры не выбраны.
      </div>
    `;
    return;
  }

  moviePosterImagesList.innerHTML = moviePosterImagesDraft.map((entry, index) => {
    const previewUrl = getMoviePosterImageDraftPreviewUrl(entry);
    const isFirst = index === 0;
    const isLast = index === moviePosterImagesDraft.length - 1;
    const isDragging = moviePosterImagesDraftDraggedEntryId === entry.entryId;
    const title = entry.label || `Изображение ${index + 1}`;
    const roleLabel = index === 0
      ? 'Основной постер'
      : `Дополнительный постер #${index + 1}`;
    const status = entry.type === 'pending'
      ? 'Будет загружено после сохранения'
      : 'Сохранено';

    return `
      <div
        class="movie-poster-images-item${isDragging ? ' is-dragging' : ''}"
        data-movie-poster-image-entry="${escapeHtml(entry.entryId)}"
        draggable="${isMovieFormSubmitting ? 'false' : 'true'}"
      >
        <button
          type="button"
          class="movie-poster-images-drag-handle"
          aria-label="Перетащить изображение ${index + 1}"
          title="Перетащить"
          ${isMovieFormSubmitting ? 'disabled' : ''}
        >
          ≡
        </button>

        <div class="movie-poster-images-preview">
          ${
            previewUrl
              ? `<img src="${escapeHtml(previewUrl)}" alt="" loading="lazy" decoding="async">`
              : ''
          }
        </div>

        <div class="movie-poster-images-main">
          <div class="movie-poster-images-title">
            ${escapeHtml(title)}
          </div>
          <div class="movie-poster-images-meta">
            ${escapeHtml(roleLabel)} · ${escapeHtml(status)}
          </div>
        </div>

        <div class="movie-poster-images-actions">
          <button
            type="button"
            class="movie-poster-images-icon-button"
            data-movie-poster-image-move="${escapeHtml(entry.entryId)}"
            data-movie-poster-image-direction="-1"
            aria-label="Поднять изображение выше"
            title="Поднять выше"
            ${isFirst || isMovieFormSubmitting ? 'disabled' : ''}
          >
            ↑
          </button>
          <button
            type="button"
            class="movie-poster-images-icon-button"
            data-movie-poster-image-move="${escapeHtml(entry.entryId)}"
            data-movie-poster-image-direction="1"
            aria-label="Опустить изображение ниже"
            title="Опустить ниже"
            ${isLast || isMovieFormSubmitting ? 'disabled' : ''}
          >
            ↓
          </button>
          <button
            type="button"
            class="movie-poster-images-icon-button movie-poster-images-remove-button"
            data-movie-poster-image-remove="${escapeHtml(entry.entryId)}"
            aria-label="Удалить изображение из галереи"
            title="Удалить"
            ${isMovieFormSubmitting ? 'disabled' : ''}
          >
            ×
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function addMoviePosterImageDraftFiles(files = []) {
  const entries = Array.from(files || [])
    .map(createMoviePosterImageDraftEntryFromFile)
    .filter(Boolean);

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
  const normalizedEntryId = String(entryId || '');
  const currentIndex = moviePosterImagesDraft.findIndex(entry => entry.entryId === normalizedEntryId);
  const nextIndex = currentIndex + Number(direction || 0);

  if (
    currentIndex < 0 ||
    nextIndex < 0 ||
    nextIndex >= moviePosterImagesDraft.length
  ) {
    return;
  }

  const [entry] = moviePosterImagesDraft.splice(currentIndex, 1);
  moviePosterImagesDraft.splice(nextIndex, 0, entry);
  moviePosterImagesDraftDirty = true;
  renderMoviePosterImagesDraftList();
}

function removeMoviePosterImageDraftEntry(entryId) {
  const normalizedEntryId = String(entryId || '');
  const entry = moviePosterImagesDraft.find(item => item.entryId === normalizedEntryId);

  if (!entry) {
    return;
  }

  revokeMoviePosterImageDraftObjectUrl(entry);
  moviePosterImagesDraft = moviePosterImagesDraft.filter(item => item.entryId !== normalizedEntryId);
  moviePosterImagesDraftDirty = true;
  updatePosterFileUi();
  renderMoviePosterImagesDraftList();
}

function getMoviePosterImagesDraftAfterDrop(sourceEntryId, targetEntryId, shouldPlaceAfter = false) {
  const sourceId = String(sourceEntryId || '');
  const targetId = String(targetEntryId || '');

  if (!sourceId || !targetId || sourceId === targetId) {
    return moviePosterImagesDraft;
  }

  const sourceEntry = moviePosterImagesDraft.find(entry => entry.entryId === sourceId);
  const nextEntries = moviePosterImagesDraft.filter(entry => entry.entryId !== sourceId);
  const targetIndex = nextEntries.findIndex(entry => entry.entryId === targetId);

  if (!sourceEntry || targetIndex < 0) {
    return moviePosterImagesDraft;
  }

  nextEntries.splice(targetIndex + (shouldPlaceAfter ? 1 : 0), 0, sourceEntry);
  return nextEntries;
}

function handleMoviePosterImagesDraftClick(event) {
  const removeButton = event.target.closest('[data-movie-poster-image-remove]');
  const moveButton = event.target.closest('[data-movie-poster-image-move]');

  if (removeButton) {
    removeMoviePosterImageDraftEntry(removeButton.dataset.moviePosterImageRemove);
    return;
  }

  if (moveButton) {
    moveMoviePosterImageDraftEntry(
      moveButton.dataset.moviePosterImageMove,
      Number(moveButton.dataset.moviePosterImageDirection || 0)
    );
  }
}

function handleMoviePosterImagesDraftDragStart(event) {
  const item = event.target.closest('[data-movie-poster-image-entry]');

  if (!item || isMovieFormSubmitting) {
    event.preventDefault();
    return;
  }

  moviePosterImagesDraftDraggedEntryId = item.dataset.moviePosterImageEntry;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', moviePosterImagesDraftDraggedEntryId);
  item.classList.add('is-dragging');
}

function handleMoviePosterImagesDraftDragEnd(event) {
  event.target
    .closest('[data-movie-poster-image-entry]')
    ?.classList.remove('is-dragging');
  moviePosterImagesDraftDraggedEntryId = null;
}

function handleMoviePosterImagesDraftDragOver(event) {
  if (!moviePosterImagesDraftDraggedEntryId) {
    return;
  }

  const item = event.target.closest('[data-movie-poster-image-entry]');

  if (!item) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function handleMoviePosterImagesDraftDrop(event) {
  const targetItem = event.target.closest('[data-movie-poster-image-entry]');
  const sourceEntryId = moviePosterImagesDraftDraggedEntryId ||
    event.dataTransfer.getData('text/plain');
  const targetEntryId = targetItem?.dataset.moviePosterImageEntry;

  if (!sourceEntryId || !targetEntryId || sourceEntryId === targetEntryId) {
    return;
  }

  event.preventDefault();

  const targetRect = targetItem.getBoundingClientRect();
  const shouldPlaceAfter = event.clientY > targetRect.top + (targetRect.height / 2);

  moviePosterImagesDraft = getMoviePosterImagesDraftAfterDrop(
    sourceEntryId,
    targetEntryId,
    shouldPlaceAfter
  );
  moviePosterImagesDraftDirty = true;
  moviePosterImagesDraftDraggedEntryId = null;
  renderMoviePosterImagesDraftList();
}

function getMoviePosterImagesDraftEntriesForSave() {
  return moviePosterImagesDraft
    .map(entry => ({ ...entry }));
}

async function resolveMoviePosterImageDraftEntries(draftEntries = []) {
  const resolvedEntries = [];
  const usedImageUrls = new Set();
  const uploadedUrls = [];

  for (const entry of draftEntries) {
    let imageUrl = String(entry?.imageUrl || '').trim();

    if (entry?.type === 'pending' && entry.file) {
      imageUrl = await uploadPosterFile(entry.file);
      uploadedUrls.push(imageUrl);
    }

    if (!imageUrl || usedImageUrls.has(imageUrl)) {
      continue;
    }

    usedImageUrls.add(imageUrl);
    resolvedEntries.push({
      ...entry,
      type: 'resolved',
      imageUrl
    });
  }

  return {
    resolvedEntries,
    uploadedUrls
  };
}

function splitMoviePosterImageEntriesForSave(resolvedEntries = []) {
  const primaryUrl = String(resolvedEntries[0]?.imageUrl || '').trim() || null;
  const additionalEntries = resolvedEntries.slice(1);
  const allUrls = new Set(
    resolvedEntries
      .map(entry => String(entry?.imageUrl || '').trim())
      .filter(Boolean)
  );

  return {
    primaryUrl,
    additionalEntries,
    allUrls
  };
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

    throw new Error('Таблица галереи постеров пока недоступна. Примените SQL-миграцию и повторите сохранение.');
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
  setDisplayNameMessage();
  setProfilePasswordMessage();
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

  syncDisplayNameButton();
  syncUserPageOwnProfileIdentity();
  updateAuthUI();
}

function isMissingAvatarColumnError(error) {
  const message = String(error?.message || '').toLowerCase();

  return (
    error?.code === '42703' ||
    error?.code === 'PGRST204' ||
    message.includes('avatar_url') ||
    message.includes('column') && message.includes('schema cache')
  );
}

async function runProfileSelectWithOptionalAvatar(createQuery, selectWithAvatar, selectWithoutAvatar) {
  const { data, error } = await createQuery(selectWithAvatar);

  if (error && isMissingAvatarColumnError(error)) {
    const fallbackResult = await createQuery(selectWithoutAvatar);

    throwIfSupabaseError(fallbackResult.error);

    return fallbackResult.data || null;
  }

  throwIfSupabaseError(error);

  return data || null;
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

  showMoviesResultCount(domSnapshot.moviesResultCountText || getMoviesResultCountText(
    paginationState.totalItems,
    paginationState
  ));

  updateCatalogStructuredData(pageMovies, paginationState);
  renderCatalogPagination(paginationState);
  container.classList.remove('is-catalog-fading', 'is-catalog-visible');
  setCatalogBusyState(false);
  container.innerHTML = domSnapshot.containerHtml;
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
      runProfileSelectWithOptionalAvatar(
        selectColumns => supabaseClient
          .from('profiles')
          .select(selectColumns)
          .eq('id', currentUser.id)
          .single(),
        'role, display_name, default_display_name, avatar_url',
        'role, display_name, default_display_name'
      ),
      'Не удалось загрузить профиль пользователя. Проверь соединение и попробуй обновить страницу.'
    );

    currentUserRole = data?.role || null;
    currentUserProfile = data || null;
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

function parseLetterboxdImportYear(value) {
  const year = Number.parseInt(String(value || '').trim(), 10);

  return Number.isInteger(year) && year > 1800
    ? year
    : null;
}

function getMovieImportYear(movie) {
  return parseLetterboxdImportYear(movie?.year ?? movie?.release_year);
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
    uri: new Map()
  };

  (Array.isArray(movies) ? movies : []).forEach(movie => {
    getMovieLetterboxdImportUris(movie).forEach(uri => {
      addMovieToLetterboxdImportIndex(index.uri, normalizeLetterboxdImportUri(uri), movie);
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

  if (!uri) {
    return null;
  }

  const uriMatch = getUniqueLetterboxdImportIndexMatch(movieIndex.uri, uri);

  if (uriMatch) {
    return {
      movie: uriMatch,
      matchType: 'letterboxd_uri'
    };
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

function getMovieReviewAuthorProfileUrl(review) {
  const handle = getPublicProfileHandle(review?.profiles);

  return handle ? buildUserPageUrl(handle) : '';
}

function getMovieReviewAuthorAvatarHtml(review) {
  const authorName = getMovieReviewAuthorName(review);
  const avatarUrl = getPublicProfileAvatarUrl(review?.profiles);
  const profileUrl = getMovieReviewAuthorProfileUrl(review);
  let avatarHtml = '';

  if (avatarUrl) {
    avatarHtml = `
      <img
        class="movie-page-review-avatar movie-page-review-avatar-image"
        src="${escapeHtml(avatarUrl)}"
        alt=""
        aria-hidden="true"
      >
    `;
  } else {
    avatarHtml = `
      <div class="movie-page-review-avatar" aria-hidden="true">
        ${escapeHtml(getUserPageAvatarLetter(authorName))}
      </div>
    `;
  }

  if (!profileUrl) {
    return avatarHtml;
  }

  return `
    <a
      class="movie-page-review-avatar-link"
      href="${escapeHtml(profileUrl)}"
      aria-label="Открыть профиль ${escapeHtml(authorName)}"
    >
      ${avatarHtml}
    </a>
  `;
}

function getMovieReviewAuthorNameHtml(review, authorName) {
  const profileUrl = getMovieReviewAuthorProfileUrl(review);

  if (!profileUrl) {
    return `<div class="movie-page-review-author">${escapeHtml(authorName)}</div>`;
  }

  return `
    <a class="movie-page-review-author" href="${escapeHtml(profileUrl)}">
      ${escapeHtml(authorName)}
    </a>
  `;
}

function getMovieReviewLikeCount(review) {
  return Math.max(0, Number(review?.likes_count || 0));
}

function isMovieReviewLikedByCurrentUser(review) {
  return Boolean(currentUser?.id && review?.is_liked_by_current_user);
}

function canCurrentUserLikeMovieReview(review) {
  return Boolean(
    currentUser?.id &&
    review?.user_id &&
    String(review.user_id) !== String(currentUser.id)
  );
}

function getMovieReviewLikeStats(likes = []) {
  const countsByReviewId = new Map();
  const currentUserLikedReviewIds = new Set();

  (Array.isArray(likes) ? likes : []).forEach(like => {
    const reviewId = String(like?.review_id || '');

    if (!reviewId) {
      return;
    }

    countsByReviewId.set(reviewId, (countsByReviewId.get(reviewId) || 0) + 1);

    if (currentUser?.id && String(like?.user_id) === String(currentUser.id)) {
      currentUserLikedReviewIds.add(reviewId);
    }
  });

  return {
    countsByReviewId,
    currentUserLikedReviewIds
  };
}

function getMovieReviewUserRating(movieId, userId) {
  if (!movieId || !userId) {
    return 0;
  }

  return Number(
    movieRatingByMovieAndUserKey.get(getMovieUserRatingKey(movieId, userId)) ?? 0
  );
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

function formatMovieReviewDate(dateValue) {
  return formatShortDateTime(dateValue);
}

function canCurrentUserCreateMovieReview(movieId) {
  return Boolean(currentUser) && getCurrentUserRating(movieId) !== null;
}

function normalizeMovieReviewText(value) {
  return String(value || '').trim();
}

function getMovieReviewTextLength(value) {
  return normalizeMovieReviewText(value).length;
}

function getMovieReviewValidationMessage(value) {
  const reviewTextLength = getMovieReviewTextLength(value);

  if (!reviewTextLength) {
    return 'Текст рецензии не должен быть пустым.';
  }

  if (reviewTextLength < MOVIE_REVIEW_MIN_LENGTH) {
    return `Рецензия должна содержать не менее ${MOVIE_REVIEW_MIN_LENGTH} символов.`;
  }

  if (reviewTextLength > MOVIE_REVIEW_MAX_LENGTH) {
    return `Рецензия не должна превышать ${MOVIE_REVIEW_MAX_LENGTH} символов.`;
  }

  return '';
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

function getMovieComments(movieId) {
  const normalizedMovieId = String(movieId || '');

  return allMovieComments.filter(comment => String(comment.movie_id || '') === normalizedMovieId);
}

function getMovieCommentById(commentId) {
  const normalizedCommentId = String(commentId || '');

  return allMovieComments.find(comment => String(comment.id || '') === normalizedCommentId) || null;
}

function getMovieReviewById(reviewId) {
  const normalizedReviewId = String(reviewId || '');

  return allMovieReviews.find(review => String(review.id || '') === normalizedReviewId) || null;
}

function getMovieReviewAnchorId(reviewId) {
  return `movie-review-${String(reviewId || '').replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function getMovieCommentAnchorId(commentId) {
  return `movie-comment-${String(commentId || '').replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function getMovieCommentAuthorName(comment) {
  return String(
    comment?.profiles?.display_name ||
    comment?.profiles?.default_display_name ||
    'Пользователь'
  ).trim();
}

function getMovieCommentAuthorProfileUrl(comment) {
  const handle = getPublicProfileHandle(comment?.profiles);

  return handle ? buildUserPageUrl(handle) : '';
}

function formatMovieCommentDate(dateValue) {
  return formatShortDateTime(dateValue);
}

function normalizeMovieCommentText(value) {
  return String(value || '').trim();
}

function getMovieCommentTextLength(value) {
  return normalizeMovieCommentText(value).length;
}

function getMovieCommentValidationMessage(value) {
  const commentTextLength = getMovieCommentTextLength(value);

  if (!commentTextLength) {
    return 'Комментарий не должен быть пустым.';
  }

  if (commentTextLength > MOVIE_COMMENT_MAX_LENGTH) {
    return `Комментарий не должен превышать ${MOVIE_COMMENT_MAX_LENGTH} символов.`;
  }

  return '';
}

function getMovieCommentLikeCount(comment) {
  return Math.max(0, Number(comment?.likes_count || 0));
}

function isMovieCommentLikedByCurrentUser(comment) {
  return Boolean(currentUser?.id && comment?.is_liked_by_current_user);
}

function canCurrentUserLikeMovieComment(comment) {
  return Boolean(
    currentUser?.id &&
    comment?.user_id &&
    !comment?.is_deleted &&
    String(comment.user_id) !== String(currentUser.id)
  );
}

function getMovieCommentLikeStats(likes = []) {
  const countsByCommentId = new Map();
  const currentUserLikedCommentIds = new Set();

  (Array.isArray(likes) ? likes : []).forEach(like => {
    const commentId = String(like?.comment_id || '');

    if (!commentId) {
      return;
    }

    countsByCommentId.set(commentId, (countsByCommentId.get(commentId) || 0) + 1);

    if (currentUser?.id && String(like?.user_id) === String(currentUser.id)) {
      currentUserLikedCommentIds.add(commentId);
    }
  });

  return {
    countsByCommentId,
    currentUserLikedCommentIds
  };
}

function getMovieCommentThreadKey(type, id) {
  return `${type}:${String(id || '')}`;
}

function isMovieCommentThreadExpanded(type, id) {
  return expandedMovieCommentThreadKeys.has(getMovieCommentThreadKey(type, id));
}

function setMovieCommentThreadExpandedState(type, id, shouldExpand) {
  const threadKey = getMovieCommentThreadKey(type, id);

  if (shouldExpand) {
    expandedMovieCommentThreadKeys.add(threadKey);
    return;
  }

  expandedMovieCommentThreadKeys.delete(threadKey);
}

function isMovieCommentSpoilerExpanded(commentId) {
  return expandedSpoilerCommentIds.has(String(commentId));
}

function setMovieCommentSpoilerExpandedState(commentId, shouldExpand) {
  const normalizedCommentId = String(commentId);

  if (shouldExpand) {
    expandedSpoilerCommentIds.add(normalizedCommentId);
    return;
  }

  expandedSpoilerCommentIds.delete(normalizedCommentId);
}

function startMovieCommentEditing(commentId) {
  editingMovieCommentId = String(commentId || '');
  replyingMovieCommentTargetKey = '';
}

function stopMovieCommentEditing() {
  editingMovieCommentId = null;
}

function isMovieCommentEditing(commentId) {
  return String(editingMovieCommentId || '') === String(commentId || '');
}

function startMovieCommentReply(targetType, targetId) {
  replyingMovieCommentTargetKey = getMovieCommentThreadKey(targetType, targetId);
  editingMovieCommentId = null;
}

function stopMovieCommentReply() {
  replyingMovieCommentTargetKey = '';
}

function isMovieCommentReplyingTo(targetType, targetId) {
  return replyingMovieCommentTargetKey === getMovieCommentThreadKey(targetType, targetId);
}

function resetMoviePageComposerState() {
  isMovieReviewComposerExpanded = false;
  isMovieCommentComposerExpanded = false;
}

function setMoviePageComposerExpanded({
  composerSelector,
  openButtonSelector,
  panelSelector,
  textareaSelector,
  onChange
}, shouldExpand) {
  const composerElement = moviePage?.querySelector(composerSelector);
  const isExpanded = Boolean(shouldExpand);

  onChange(isExpanded);

  if (!composerElement) {
    return;
  }

  const openButtonElement = composerElement.querySelector(openButtonSelector);
  const panelElement = composerElement.querySelector(panelSelector);

  composerElement.classList.toggle('is-expanded', isExpanded);

  if (openButtonElement) {
    openButtonElement.hidden = isExpanded;
    openButtonElement.setAttribute('aria-expanded', String(isExpanded));
  }

  if (panelElement) {
    panelElement.hidden = !isExpanded;
  }

  requestAnimationFrame(() => {
    if (isExpanded) {
      composerElement.querySelector(textareaSelector)?.focus();
      return;
    }

    openButtonElement?.focus();
  });
}

function setMoviePageReviewComposerExpanded(shouldExpand) {
  setMoviePageComposerExpanded({
    composerSelector: '[data-movie-review-composer="true"]',
    openButtonSelector: '[data-movie-review-composer-open="true"]',
    panelSelector: '[data-movie-review-composer-panel="true"]',
    textareaSelector: '[data-movie-review-textarea="true"]',
    onChange: isExpanded => {
      isMovieReviewComposerExpanded = isExpanded;
    }
  }, shouldExpand);
}

function setMoviePageCommentComposerExpanded(shouldExpand) {
  setMoviePageComposerExpanded({
    composerSelector: '[data-movie-comment-composer="true"]',
    openButtonSelector: '[data-movie-comment-composer-open="true"]',
    panelSelector: '[data-movie-comment-composer-panel="true"]',
    textareaSelector: '[data-movie-comment-textarea="true"]',
    onChange: isExpanded => {
      isMovieCommentComposerExpanded = isExpanded;
    }
  }, shouldExpand);
}

function sortMovieCommentRepliesForDisplay(comments = []) {
  return [...comments].sort((firstComment, secondComment) => {
    const firstTime = new Date(firstComment.created_at || 0).getTime();
    const secondTime = new Date(secondComment.created_at || 0).getTime();

    if (firstTime !== secondTime) {
      return firstTime - secondTime;
    }

    return String(firstComment.id || '').localeCompare(String(secondComment.id || ''));
  });
}

function sortTopLevelMovieCommentsForDisplay(comments = []) {
  return [...comments].sort((firstComment, secondComment) => {
    const firstTime = new Date(firstComment.created_at || 0).getTime();
    const secondTime = new Date(secondComment.created_at || 0).getTime();

    if (firstTime !== secondTime) {
      return secondTime - firstTime;
    }

    return String(firstComment.id || '').localeCompare(String(secondComment.id || ''));
  });
}

function getTopLevelMovieComments(movieId) {
  return sortTopLevelMovieCommentsForDisplay(
    getMovieComments(movieId).filter(comment => !comment.parent_comment_id)
  );
}

function getMovieCommentChildComments(commentId, comments = allMovieComments) {
  const normalizedCommentId = String(commentId || '');

  return sortMovieCommentRepliesForDisplay(
    (Array.isArray(comments) ? comments : []).filter(comment =>
      String(comment.parent_comment_id || '') === normalizedCommentId
    )
  );
}

function getMovieCommentDescendantCount(commentId, comments = allMovieComments) {
  const children = getMovieCommentChildComments(commentId, comments);

  return children.reduce(
    (count, childComment) => count + 1 + getMovieCommentDescendantCount(childComment.id, comments),
    0
  );
}

function hasMovieCommentReplies(commentId) {
  const normalizedCommentId = String(commentId || '');

  return allMovieComments.some(comment => (
    String(comment.parent_comment_id || '') === normalizedCommentId ||
    String(comment.reply_to_comment_id || '') === normalizedCommentId
  ));
}

function canCurrentUserEditMovieComment(comment) {
  return Boolean(
    comment &&
    !comment.is_deleted &&
    currentUser?.id &&
    (
      isAdmin ||
      (
        String(comment.user_id || '') === String(currentUser.id) &&
        !hasMovieCommentReplies(comment.id)
      )
    )
  );
}

function canCurrentUserDeleteMovieComment(comment) {
  return Boolean(
    comment &&
    currentUser?.id &&
    (isAdmin || String(comment.user_id || '') === String(currentUser.id))
  );
}

function canCurrentUserReplyToMovieReview(review) {
  return Boolean(
    currentUser?.id &&
    review?.movie_id &&
    getCurrentUserRating(review.movie_id) !== null
  );
}

function getMovieContentWarningBadgesHtml(content) {
  const badges = [];

  if (content?.contains_spoilers) {
    badges.push('Спойлеры');
  }

  if (content?.contains_profanity) {
    badges.push('Нецензурная лексика');
  }

  if (!badges.length) {
    return '';
  }

  return `
    <div class="movie-page-content-flags">
      ${badges.map(label => `<span class="movie-page-content-flag">${escapeHtml(label)}</span>`).join('')}
    </div>
  `;
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

function getMovieReviewReplySnippet(review) {
  const reviewText = normalizeMovieReviewText(review?.review_text || '').replace(/\s+/g, ' ').trim();

  if (!reviewText) {
    return '';
  }

  if (reviewText.length <= MOVIE_REVIEW_REPLY_SNIPPET_MAX_LENGTH) {
    return reviewText;
  }

  return `${reviewText.slice(0, MOVIE_REVIEW_REPLY_SNIPPET_MAX_LENGTH).trim()}...`;
}

function getMovieCommentReplyTargetForComment(comment) {
  const commentDepth = Math.max(0, Math.min(MOVIE_COMMENT_MAX_DEPTH, Number(comment?.depth || 0)));

  if (commentDepth >= MOVIE_COMMENT_MAX_DEPTH) {
    return {
      parentCommentId: comment?.parent_comment_id || comment?.id || null,
      replyToCommentId: comment?.id || null,
      rootReviewId: comment?.root_review_id || null,
      depth: MOVIE_COMMENT_MAX_DEPTH
    };
  }

  return {
    parentCommentId: comment?.id || null,
    replyToCommentId: comment?.id || null,
    rootReviewId: comment?.root_review_id || null,
    depth: commentDepth + 1
  };
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
    posterUrl: movie?.poster_url || '',
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
    (movieTrailerModal && movieTrailerModal.classList.contains('is-open')) ||
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

  if (submitButton) {
    submitButton.disabled = isSubmitting;
  }

  if (cancelEditButton) {
    cancelEditButton.disabled = isSubmitting;
  }

  if (closeMovieModalButton) {
    closeMovieModalButton.disabled = isSubmitting;
  }

  if (posterFileInput) {
    posterFileInput.disabled = isSubmitting;
  }

  moviePosterImagesList?.querySelectorAll('button').forEach(button => {
    button.disabled = isSubmitting || button.disabled;
  });

  if (openAddMovieButton) {
    openAddMovieButton.disabled = isSubmitting;
  }

  renderMoviePosterImagesDraftList();
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
  resetMoviePosterImagesDraft();
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
  setInputValue(runtimeMinutesInput, movie.runtime_minutes, 'runtimeMinutesInput');
  setInputValue(directorInput, parseLineOrCommaSeparatedValues(movie.director).join('\n'), 'directorInput');
  setInputValue(productionInput, getTextArrayFormValue(movie.production), 'productionInput');
  setInputValue(distributionInput, getTextArrayFormValue(movie.distribution), 'distributionInput');
  setInputValue(russianDistributionInput, getTextArrayFormValue(movie.russian_distribution), 'russianDistributionInput');
  setInputValue(kinopoiskUrlInput, movie.kinopoisk_url, 'kinopoiskUrlInput');
  setInputValue(imdbUrlInput, movie.imdb_url, 'imdbUrlInput');
  setInputValue(letterboxdUrlInput, movie.letterboxd_url, 'letterboxdUrlInput');
  setInputValue(letterboxdShortUrlInput, movie.letterboxd_short_url, 'letterboxdShortUrlInput');
  setInputValue(rottentomatoesUrlInput, movie.rottentomatoes_url, 'rottentomatoesUrlInput');
  setInputValue(trailerUrlInput, movie.trailer_url, 'trailerUrlInput');

  if (posterFileInput) {
    posterFileInput.value = '';
  }

  setMoviePosterImagesDraftFromMovie(movie, getMoviePosterImages(movie.id));
  ensureMoviePosterImagesEditorDataLoaded(movie).catch(error => {
    console.warn('Не удалось загрузить галерею постеров для формы:', error);
  });

  const genres = movie.movie_genres
    .map(item => item.genres.name)
    .filter(name => normalizeSearchText(name) !== BASE_HORROR_GENRE_NORMALIZED)
    .join('\n');
  const countries = movie.movie_countries.map(item => item.countries.name).join('\n');

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

function updateAuthUI() {
  const shouldShowAuthenticatedUi = shouldUseAuthenticatedUi();

  syncAuthIconButtonState();
  syncDisplayNameButton();
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

const createCustomSelectManagerSafe = typeof createCustomSelectManager === 'function'
  ? createCustomSelectManager
  : () => ({
      initCustomSelects: () => {},
      refreshCustomSelect: () => {},
      closeAllCustomSelects: () => {},
      bindGlobalEvents: () => {}
    });

const customSelectManager = createCustomSelectManagerSafe({
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

const MOVIE_BASE_SELECT = `
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
  production,
  distribution,
  russian_distribution,
  formats,
  tags_perceived,
  search_aliases,
  poster_url,
  kinopoisk_url,
  imdb_url,
  letterboxd_url,
  letterboxd_short_url,
  rottentomatoes_url,
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

function getMovieSelectByPurpose(purpose = 'catalog') {
  if (purpose === 'detail') {
    return MOVIE_BASE_SELECT;
  }

  return MOVIE_CATALOG_SELECT;
}

const OPTIONAL_MOVIE_SELECT_COLUMNS = ['trailer_url', 'runtime_minutes'];
let movieRuntimeMinutesColumnAvailable = true;

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
      rerenderCatalogAfterDataReload(null, FULL_CATALOG_RERENDER_PRESETS.preserveScrollOnly);
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

async function fetchMovieReviewLikes(reviewIds = []) {
  const normalizedReviewIds = [...new Set(
    (Array.isArray(reviewIds) ? reviewIds : [])
      .map(reviewId => String(reviewId || '').trim())
      .filter(Boolean)
  )];

  if (!areMovieReviewLikesAvailable || normalizedReviewIds.length === 0) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('movie_review_likes')
    .select('review_id, user_id, created_at')
    .in('review_id', normalizedReviewIds);

  if (error) {
    if (isMovieReviewLikesTableUnavailableError(error)) {
      areMovieReviewLikesAvailable = false;
      console.warn('Лайки рецензий недоступны: таблица movie_review_likes не найдена или закрыта политиками.', error);
      return [];
    }

    console.error('Ошибка загрузки лайков рецензий:', error);
    return [];
  }

  areMovieReviewLikesAvailable = true;
  return data || [];
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
      contains_profanity,
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
  const reviewIds = reviews
    .map(review => review.id)
    .filter(Boolean);
  const uniqueUserIds = [...new Set(
    reviews
      .map(review => review.user_id)
      .filter(Boolean)
  )];
  const uniqueUserIdSet = new Set(uniqueUserIds.map(userId => String(userId)));

  let profilesMap = new Map();
  let reviewLikes = [];

  if (uniqueUserIds.length > 0) {
    const [
      reviewLikesResult,
      profilesResult,
      { data: reviewRatingsData, error: reviewRatingsError }
    ] = await Promise.all([
      fetchMovieReviewLikes(reviewIds)
        .then(likesData => ({ data: likesData, error: null }))
        .catch(error => ({ data: [], error })),
      runProfileSelectWithOptionalAvatar(
        selectColumns => supabaseClient
          .from('profiles')
          .select(selectColumns)
          .in('id', uniqueUserIds),
        'id, display_name, default_display_name, avatar_url',
        'id, display_name, default_display_name'
      )
        .then(profilesData => ({ data: profilesData, error: null }))
        .catch(error => ({ data: null, error })),
      supabaseClient
        .from('movie_ratings')
        .select('movie_id, user_id, rating')
        .eq('movie_id', movieId)
        .in('user_id', uniqueUserIds)
    ]);

    if (reviewLikesResult.error) {
      console.error('Ошибка загрузки лайков рецензий:', reviewLikesResult.error);
    } else {
      reviewLikes = reviewLikesResult.data || [];
    }

    if (profilesResult.error) {
      console.error('Ошибка загрузки профилей авторов рецензий:', profilesResult.error);
    } else {
      profilesMap = new Map(
        (profilesResult.data || []).map(profile => [String(profile.id), profile])
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

  const reviewLikeStats = getMovieReviewLikeStats(reviewLikes);

  allMovieReviews = reviews.map(review => ({
    ...review,
    profiles: profilesMap.get(String(review.user_id)) || null,
    likes_count: reviewLikeStats.countsByReviewId.get(String(review.id)) || 0,
    is_liked_by_current_user: reviewLikeStats.currentUserLikedReviewIds.has(String(review.id))
  }));
}

async function fetchMovieCommentLikes(commentIds = []) {
  const normalizedCommentIds = [...new Set(
    (Array.isArray(commentIds) ? commentIds : [])
      .map(commentId => String(commentId || '').trim())
      .filter(Boolean)
  )];

  if (!areMovieCommentLikesAvailable || normalizedCommentIds.length === 0) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('movie_comment_likes')
    .select('comment_id, user_id, created_at')
    .in('comment_id', normalizedCommentIds);

  if (error) {
    if (isMovieCommentLikesTableUnavailableError(error)) {
      areMovieCommentLikesAvailable = false;
      console.warn('Лайки комментариев недоступны: таблица movie_comment_likes не найдена или закрыта политиками.', error);
      return [];
    }

    console.error('Ошибка загрузки лайков комментариев:', error);
    return [];
  }

  areMovieCommentLikesAvailable = true;
  return data || [];
}

async function fetchMovieComments(movieId) {
  if (!movieId) {
    allMovieComments = [];
    return;
  }

  if (!areMovieCommentsAvailable) {
    allMovieComments = [];
    return;
  }

  const { data, error } = await supabaseClient
    .from('movie_comments')
    .select(`
      id,
      movie_id,
      user_id,
      parent_comment_id,
      reply_to_comment_id,
      root_review_id,
      depth,
      comment_text,
      contains_spoilers,
      contains_profanity,
      is_deleted,
      deleted_at,
      created_at,
      updated_at
    `)
    .eq('movie_id', movieId)
    .order('created_at', { ascending: true });

  if (error) {
    if (isMovieCommentsTableUnavailableError(error)) {
      areMovieCommentsAvailable = false;
      allMovieComments = [];
      console.warn('Комментарии недоступны: таблица movie_comments не найдена или закрыта политиками.', error);
      return;
    }

    console.error('Ошибка загрузки комментариев:', error);
    allMovieComments = [];
    return;
  }

  areMovieCommentsAvailable = true;

  const comments = data || [];
  const commentIds = comments
    .map(comment => comment.id)
    .filter(Boolean);
  const uniqueUserIds = [...new Set(
    comments
      .map(comment => comment.user_id)
      .filter(Boolean)
  )];

  let profilesMap = new Map();
  let commentLikes = [];

  if (uniqueUserIds.length > 0) {
    const [
      commentLikesResult,
      profilesResult
    ] = await Promise.all([
      fetchMovieCommentLikes(commentIds)
        .then(likesData => ({ data: likesData, error: null }))
        .catch(error => ({ data: [], error })),
      runProfileSelectWithOptionalAvatar(
        selectColumns => supabaseClient
          .from('profiles')
          .select(selectColumns)
          .in('id', uniqueUserIds),
        'id, display_name, default_display_name, avatar_url',
        'id, display_name, default_display_name'
      )
        .then(profilesData => ({ data: profilesData, error: null }))
        .catch(error => ({ data: null, error }))
    ]);

    if (commentLikesResult.error) {
      console.error('Ошибка загрузки лайков комментариев:', commentLikesResult.error);
    } else {
      commentLikes = commentLikesResult.data || [];
    }

    if (profilesResult.error) {
      console.error('Ошибка загрузки профилей авторов комментариев:', profilesResult.error);
    } else {
      profilesMap = new Map(
        (profilesResult.data || []).map(profile => [String(profile.id), profile])
      );
    }
  }

  const commentLikeStats = getMovieCommentLikeStats(commentLikes);

  allMovieComments = comments.map(comment => ({
    ...comment,
    depth: Math.max(0, Math.min(MOVIE_COMMENT_MAX_DEPTH, Number(comment.depth || 0))),
    profiles: profilesMap.get(String(comment.user_id)) || null,
    likes_count: commentLikeStats.countsByCommentId.get(String(comment.id)) || 0,
    is_liked_by_current_user: commentLikeStats.currentUserLikedCommentIds.has(String(comment.id))
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

  await Promise.all([
    fetchMovieRatingStatsForMovie(movieId),
    fetchCurrentUserRatingForMovie(movieId),
    fetchMovieWatchlistForCurrentUser(movieId)
  ]);

  await fetchMovieReviews(movieId);
  await fetchMovieComments(movieId);
  await fetchMoviePosterImagesForMovieSafe(movieId, { force: true });

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

async function saveMovieReview(movieId, {
  reviewText,
  containsSpoilers = false,
  containsProfanity = false
}) {
  const activeUser = ensureActiveSessionForWrite();
  const normalizedReviewText = normalizeMovieReviewText(reviewText);

  if (!movieId) {
    throw new Error('Не найден фильм для сохранения рецензии.');
  }

  const validationMessage = getMovieReviewValidationMessage(normalizedReviewText);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const { error } = await supabaseClient
    .from('movie_reviews')
    .upsert(
      {
        movie_id: movieId,
        user_id: activeUser.id,
        review_text: normalizedReviewText,
        contains_spoilers: Boolean(containsSpoilers),
        contains_profanity: Boolean(containsProfanity)
      },
      {
        onConflict: 'movie_id,user_id'
      }
    );

  throwIfSupabaseError(error);
  await refreshMovieReviewsAfterMutation(movieId);
}

async function updateMovieReview(reviewId, movieId, {
  reviewText,
  containsSpoilers = false,
  containsProfanity = false
}) {
  const activeUser = ensureActiveSessionForWrite();
  const normalizedReviewId = String(reviewId || '').trim();
  const review = allMovieReviews.find(item => String(item.id || '') === normalizedReviewId);
  const normalizedReviewText = normalizeMovieReviewText(reviewText);

  if (!normalizedReviewId || !review) {
    throw new Error('Не найдена рецензия для редактирования.');
  }

  if (!isAdmin && String(review.user_id || '') !== String(activeUser.id)) {
    throw new Error('Можно редактировать только собственные рецензии.');
  }

  const validationMessage = getMovieReviewValidationMessage(normalizedReviewText);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const { error } = await supabaseClient
    .from('movie_reviews')
    .update({
      review_text: normalizedReviewText,
      contains_spoilers: Boolean(containsSpoilers),
      contains_profanity: Boolean(containsProfanity)
    })
    .eq('id', normalizedReviewId);

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
  await fetchMovieComments(movieId);
}

async function setMovieReviewLike(review, shouldLike) {
  const activeUser = ensureActiveSessionForWrite();
  const reviewId = String(review?.id || '');

  if (!reviewId) {
    throw new Error('Не найдена рецензия для лайка.');
  }

  if (String(review?.user_id || '') === String(activeUser.id)) {
    throw new Error('Нельзя лайкать собственную рецензию.');
  }

  if (shouldLike) {
    const { error } = await supabaseClient
      .from('movie_review_likes')
      .insert({
        review_id: reviewId,
        user_id: activeUser.id
      });

    if (error?.code !== '23505') {
      throwIfSupabaseError(error);
    }

    return;
  }

  const { error } = await supabaseClient
    .from('movie_review_likes')
    .delete()
    .eq('review_id', reviewId)
    .eq('user_id', activeUser.id);

  throwIfSupabaseError(error);
}

async function refreshMovieCommentsAfterMutation(movieId) {
  await fetchMovieComments(movieId);
}

function getMovieCommentPayloadFromTarget({
  movieId,
  commentText,
  containsSpoilers = false,
  containsProfanity = false,
  parentCommentId = '',
  replyToCommentId = '',
  rootReviewId = '',
  depth = 0
}) {
  const activeUser = ensureActiveSessionForWrite();
  const normalizedMovieId = String(movieId || '').trim();
  const normalizedCommentText = normalizeMovieCommentText(commentText);
  const normalizedParentCommentId = String(parentCommentId || '').trim();
  const normalizedReplyToCommentId = String(replyToCommentId || '').trim();
  const normalizedRootReviewId = String(rootReviewId || '').trim();
  const normalizedDepth = Math.max(0, Math.min(MOVIE_COMMENT_MAX_DEPTH, Number(depth || 0)));

  if (!normalizedMovieId) {
    throw new Error('Не найден фильм для сохранения комментария.');
  }

  const validationMessage = getMovieCommentValidationMessage(normalizedCommentText);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  if (normalizedRootReviewId && getCurrentUserRating(normalizedMovieId) === null) {
    throw new Error('Ответить на рецензию можно только после оценки фильма.');
  }

  return {
    movie_id: normalizedMovieId,
    user_id: activeUser.id,
    parent_comment_id: normalizedParentCommentId || null,
    reply_to_comment_id: normalizedReplyToCommentId || null,
    root_review_id: normalizedRootReviewId || null,
    depth: normalizedDepth,
    comment_text: normalizedCommentText,
    contains_spoilers: Boolean(containsSpoilers),
    contains_profanity: Boolean(containsProfanity),
    is_deleted: false
  };
}

async function saveMovieComment(movieId, commentData) {
  const payload = getMovieCommentPayloadFromTarget({
    movieId,
    ...commentData
  });

  const { error } = await supabaseClient
    .from('movie_comments')
    .insert(payload);

  throwIfSupabaseError(error);
  await refreshMovieCommentsAfterMutation(movieId);
}

async function updateMovieComment(commentId, movieId, {
  commentText,
  containsSpoilers = false,
  containsProfanity = false
}) {
  const activeUser = ensureActiveSessionForWrite();
  const normalizedCommentId = String(commentId || '').trim();
  const comment = getMovieCommentById(normalizedCommentId);
  const normalizedCommentText = normalizeMovieCommentText(commentText);

  if (!normalizedCommentId || !comment) {
    throw new Error('Не найден комментарий для редактирования.');
  }

  if (!isAdmin && String(comment.user_id || '') !== String(activeUser.id)) {
    throw new Error('Можно редактировать только собственные комментарии.');
  }

  if (!isAdmin && hasMovieCommentReplies(normalizedCommentId)) {
    throw new Error('Комментарий уже получил ответ, поэтому редактирование недоступно.');
  }

  const validationMessage = getMovieCommentValidationMessage(normalizedCommentText);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const { error } = await supabaseClient
    .from('movie_comments')
    .update({
      comment_text: normalizedCommentText,
      contains_spoilers: Boolean(containsSpoilers),
      contains_profanity: Boolean(containsProfanity)
    })
    .eq('id', normalizedCommentId);

  throwIfSupabaseError(error);
  await refreshMovieCommentsAfterMutation(movieId);
}

async function removeMovieComment(commentId, movieId) {
  ensureActiveSessionForWrite();

  const normalizedCommentId = String(commentId || '').trim();
  const comment = getMovieCommentById(normalizedCommentId);

  if (!normalizedCommentId || !comment) {
    throw new Error('Не найден комментарий для удаления.');
  }

  if (!canCurrentUserDeleteMovieComment(comment)) {
    throw new Error('Можно удалять только собственные комментарии.');
  }

  if (hasMovieCommentReplies(normalizedCommentId)) {
    const { error } = await supabaseClient
      .from('movie_comments')
      .update({
        comment_text: '',
        contains_spoilers: false,
        contains_profanity: false,
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', normalizedCommentId);

    throwIfSupabaseError(error);
    await refreshMovieCommentsAfterMutation(movieId);
    return;
  }

  const { error } = await supabaseClient
    .from('movie_comments')
    .delete()
    .eq('id', normalizedCommentId);

  throwIfSupabaseError(error);
  await refreshMovieCommentsAfterMutation(movieId);
}

async function setMovieCommentLike(comment, shouldLike) {
  const activeUser = ensureActiveSessionForWrite();
  const commentId = String(comment?.id || '');

  if (!commentId) {
    throw new Error('Не найден комментарий для лайка.');
  }

  if (String(comment?.user_id || '') === String(activeUser.id)) {
    throw new Error('Нельзя лайкать собственный комментарий.');
  }

  if (comment?.is_deleted) {
    throw new Error('Нельзя лайкать удалённый комментарий.');
  }

  if (shouldLike) {
    const { error } = await supabaseClient
      .from('movie_comment_likes')
      .insert({
        comment_id: commentId,
        user_id: activeUser.id
      });

    if (error?.code !== '23505') {
      throwIfSupabaseError(error);
    }

    return;
  }

  const { error } = await supabaseClient
    .from('movie_comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', activeUser.id);

  throwIfSupabaseError(error);
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

  if (quality !== undefined && quality !== null && quality !== '') {
    const normalizedQuality = Math.round(
      Math.max(POSTER_IMAGE_MIN_QUALITY, Math.min(100, Number(quality) || POSTER_IMAGE_MIN_QUALITY))
    );
    transformedUrl.searchParams.set('quality', String(normalizedQuality));
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
  const runtimeMinutes = parseRuntimeMinutesFormValue(runtimeMinutesInput?.value || '');
  const director = parseLineOrCommaSeparatedValues(directorInput.value).join(', ');
  const production = parseMultilineValues(productionInput?.value || '');
  const distribution = parseMultilineValues(distributionInput?.value || '');
  const russianDistribution = parseMultilineValues(russianDistributionInput?.value || '');
  const synopsis = synopsisInput.value.trim();
  const kinopoiskUrl = normalizeOptionalUrl(kinopoiskUrlInput.value);
  const imdbUrl = normalizeOptionalUrl(imdbUrlInput.value);
  const letterboxdUrl = normalizeOptionalUrl(letterboxdUrlInput.value);
  const letterboxdShortUrl = normalizeLetterboxdShortUrl(letterboxdShortUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);
  const trailerUrl = normalizeOptionalUrl(trailerUrlInput?.value || '');

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseLineOrCommaSeparatedValues(countriesInput.value);
  const searchAliases = parseMultilineValues(searchAliasesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  if (Number.isNaN(runtimeMinutes)) {
    formMessage.textContent = 'Время должно быть целым числом минут от 1 до 999.';
    setMovieFormSubmittingState(false);
    return;
  }

  try {
    ensureActiveSessionForWrite();

    const classificationDraft = buildMovieClassificationDraftFromForm();
    const manualSimilarMovieIds = normalizeManualSimilarMovieIds(manualSimilarMovieIdsDraft);
    const posterDraftEntries = getMoviePosterImagesDraftEntriesForSave();

    if (posterDraftEntries.some(entry => entry.type === 'pending')) {
      setMovieFormStatus('Загружаю постеры...');
    }

    const resolvedPosterImages = await withPendingRequestTimeout(
      resolveMoviePosterImageDraftEntries(posterDraftEntries),
      30000,
      'Превышено время ожидания загрузки постеров.'
    );
    const {
      primaryUrl: finalPosterUrl,
      additionalEntries: additionalPosterEntriesForSave
    } = splitMoviePosterImageEntriesForSave(resolvedPosterImages.resolvedEntries);

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
          production: getOptionalTextArrayPayload(production),
          distribution: getOptionalTextArrayPayload(distribution),
          russian_distribution: getOptionalTextArrayPayload(russianDistribution),
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
          ...(trailerUrl ? { trailer_url: trailerUrl } : {}),
          ...(movieRuntimeMinutesColumnAvailable ? { runtime_minutes: runtimeMinutes } : {}),
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

    if (additionalPosterEntriesForSave.length > 0) {
      setMovieFormStatus('Сохраняю галерею...');
      await withPendingRequestTimeout(
        replaceMoviePosterImages(insertedMovie.id, additionalPosterEntriesForSave),
        30000,
        'Превышено время ожидания сохранения галереи.'
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
  const runtimeMinutes = parseRuntimeMinutesFormValue(runtimeMinutesInput?.value || '');
  const director = parseLineOrCommaSeparatedValues(directorInput.value).join(', ');
  const production = parseMultilineValues(productionInput?.value || '');
  const distribution = parseMultilineValues(distributionInput?.value || '');
  const russianDistribution = parseMultilineValues(russianDistributionInput?.value || '');
  const synopsis = synopsisInput.value.trim();
  const kinopoiskUrl = normalizeOptionalUrl(kinopoiskUrlInput.value);
  const imdbUrl = normalizeOptionalUrl(imdbUrlInput.value);
  const letterboxdUrl = normalizeOptionalUrl(letterboxdUrlInput.value);
  const letterboxdShortUrl = normalizeLetterboxdShortUrl(letterboxdShortUrlInput.value);
  const rottentomatoesUrl = normalizeOptionalUrl(rottentomatoesUrlInput.value);
  const trailerUrl = normalizeOptionalUrl(trailerUrlInput?.value || '');

  const genreNames = normalizeAdditionalGenreNames(genresInput.value);
  const countryNames = parseLineOrCommaSeparatedValues(countriesInput.value);
  const searchAliases = parseMultilineValues(searchAliasesInput.value);

  if (!title) {
    formMessage.textContent = 'Название обязательно.';
    setMovieFormSubmittingState(false);
    return;
  }

  if (Number.isNaN(runtimeMinutes)) {
    formMessage.textContent = 'Время должно быть целым числом минут от 1 до 999.';
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
    const posterImagesChanged = moviePosterImagesDraftDirty;
    let additionalPosterEntriesForSave = [];
    let finalPosterUrl = existingMovie.poster_url ?? null;
    let finalPosterUrls = new Set([finalPosterUrl].filter(Boolean));

    if (posterImagesChanged) {
      const posterDraftEntries = getMoviePosterImagesDraftEntriesForSave();

      if (posterDraftEntries.some(entry => entry.type === 'pending')) {
        setMovieFormStatus('Загружаю постеры...');
      }

      const resolvedPosterImages = await withPendingRequestTimeout(
        resolveMoviePosterImageDraftEntries(posterDraftEntries),
        30000,
        'Превышено время ожидания загрузки постеров.'
      );
      const posterImagesForSave = splitMoviePosterImageEntriesForSave(resolvedPosterImages.resolvedEntries);

      finalPosterUrl = posterImagesForSave.primaryUrl;
      additionalPosterEntriesForSave = posterImagesForSave.additionalEntries;
      finalPosterUrls = posterImagesForSave.allUrls;
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

    if (!areStringArraysEqual(production, normalizeTextArrayField(existingMovie.production))) {
      changedFields.production = getOptionalTextArrayPayload(production);
    }

    if (!areStringArraysEqual(distribution, normalizeTextArrayField(existingMovie.distribution))) {
      changedFields.distribution = getOptionalTextArrayPayload(distribution);
    }

    if (!areStringArraysEqual(russianDistribution, normalizeTextArrayField(existingMovie.russian_distribution))) {
      changedFields.russian_distribution = getOptionalTextArrayPayload(russianDistribution);
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

    if ((trailerUrl || null) !== (existingMovie.trailer_url ?? null)) {
      changedFields.trailer_url = trailerUrl || null;
    }

    if (
      movieRuntimeMinutesColumnAvailable &&
      runtimeMinutes !== normalizeRuntimeMinutesValue(existingMovie.runtime_minutes)
    ) {
      changedFields.runtime_minutes = runtimeMinutes;
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

    if (posterImagesChanged) {
      setMovieFormStatus('Сохраняю галерею...');
      await withPendingRequestTimeout(
        replaceMoviePosterImages(editingMovieId, additionalPosterEntriesForSave, {
          preservedUrls: [finalPosterUrl]
        }),
        30000,
        'Превышено время ожидания сохранения галереи.'
      );
    }

    if (posterImagesChanged && oldPosterUrl && !finalPosterUrls.has(oldPosterUrl)) {
      try {
        await deletePosterFileByUrl(oldPosterUrl);
      } catch (deletePosterError) {
        console.error('Не удалось удалить старый постер:', deletePosterError);
      }
    }

    if (Object.keys(changedFields).length === 0 && !relationsChanged && !manualSimilarChanged && !posterImagesChanged) {
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

async function saveMovie(event) {
  if (editingMovieId) {
    await updateMovie(event);
  } else {
    await addMovie(event);
  }
}

async function deleteMovieRecord(movieId) {
  const { error } = await supabaseClient
    .from('movies')
    .delete()
    .eq('id', movieId);

  throwIfSupabaseError(error);
}

async function deleteMovie(movieId, movieTitle) {
  try {
    await deleteMovieRecord(movieId);

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
  await fetchCurrentUserProfileFollows();
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

function ensureMovieTrailerModal() {
  if (movieTrailerModal) {
    return;
  }

  movieTrailerModal = document.createElement('div');
  movieTrailerModal.id = 'movieTrailerModal';
  movieTrailerModal.className = 'modal movie-trailer-modal';
  movieTrailerModal.innerHTML = `
    <div class="modal-backdrop movie-trailer-modal-backdrop" data-movie-trailer-close="true"></div>
    <div
      class="modal-dialog movie-trailer-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movieTrailerModalTitle"
    >
      <div class="modal-header movie-trailer-modal-header">
        <h2 id="movieTrailerModalTitle" class="movie-trailer-modal-title">Трейлер</h2>
        <button
          type="button"
          class="modal-close-button movie-trailer-modal-close"
          data-movie-trailer-close="true"
          aria-label="Закрыть"
        ></button>
      </div>

      <div class="movie-trailer-frame-shell">
        <iframe
          class="movie-trailer-frame"
          title="Трейлер фильма"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  `;

  const pageRoot = document.querySelector('.page') || document.body;
  pageRoot.appendChild(movieTrailerModal);

  movieTrailerFrame = movieTrailerModal.querySelector('.movie-trailer-frame');
  movieTrailerModalTitle = movieTrailerModal.querySelector('#movieTrailerModalTitle');

  movieTrailerModal.querySelectorAll('[data-movie-trailer-close="true"]').forEach(element => {
    element.addEventListener('click', () => {
      closeMovieTrailerModal();
    });
  });
}

function closeMovieTrailerModal() {
  if (!movieTrailerModal) {
    return;
  }

  movieTrailerModal.classList.remove('is-open');

  if (movieTrailerFrame) {
    movieTrailerFrame.removeAttribute('src');
  }

  syncBodyScrollLock();
}

function syncMovieTrailerModalOffset() {
  if (!movieTrailerModal) {
    return;
  }

  const header = document.querySelector('.page-header');
  const headerRect = header?.getBoundingClientRect?.();
  const headerHeight = Math.ceil(headerRect?.height || header?.offsetHeight || 0);
  const topOffset = Math.max(16, headerHeight + 12);

  movieTrailerModal.style.setProperty('--movie-trailer-modal-top-offset', `${topOffset}px`);
}

function openMovieTrailerModal(movie) {
  const trailerEmbedUrl = getYouTubeTrailerEmbedUrl(movie?.trailer_url);

  if (!trailerEmbedUrl) {
    showAppMessage('Трейлер недоступен: нужна ссылка YouTube.', 'error', true);
    return;
  }

  ensureMovieTrailerModal();

  const title = String(movie?.title || '').trim();
  const year = Number(movie?.year ?? movie?.release_year);
  const titleWithYear = title && Number.isFinite(year)
    ? `${title} (${year})`
    : title;
  const modalTitle = titleWithYear ? `Трейлер: ${titleWithYear}` : 'Трейлер';

  if (movieTrailerModalTitle) {
    movieTrailerModalTitle.textContent = modalTitle;
  }

  if (movieTrailerFrame) {
    movieTrailerFrame.src = trailerEmbedUrl;
    movieTrailerFrame.title = modalTitle;
  }

  syncMovieTrailerModalOffset();
  movieTrailerModal.classList.add('is-open');
  syncBodyScrollLock();
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

    if (movieTrailerModal?.classList.contains('is-open')) {
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
    movie?.kinopoisk_url ||
    movie?.imdb_url ||
    movie?.letterboxd_url ||
    movie?.rottentomatoes_url
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
        href="${escapeHtml(movie.imdb_url)}"
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
        href="${escapeHtml(movie.kinopoisk_url)}"
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
        fillFormForEdit(movieForEdit);
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
    ignoreRuntime = false,
    ignoreTriggerExcludes = false
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
    pageMovies
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

    if (handleFollowingPageLoginClick(event)) {
      return;
    }

    if (handleFollowingPageUnfollowClick(event)) {
      return;
    }

    if (handleNotificationsPageClick(event)) {
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
    if (handleNotificationsPagePreferenceChange(event)) {
      return;
    }

    handleFollowingPagePreferenceChange(event);
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
    if (movieTrailerModal && movieTrailerModal.classList.contains('is-open')) {
      closeMovieTrailerModal();
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

  window.addEventListener('popstate', handleCatalogHistoryNavigation);

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

    fillFormForEdit(movieForEdit);
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
          await onAfterAuthSync();
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

async function fetchPublicUserProfileByHandle(handle) {
  const normalizedHandle = String(handle || '').trim();

  if (!normalizedHandle || !isSafeUserProfileLookupHandle(normalizedHandle)) {
    return null;
  }

  return runProfileSelectWithOptionalAvatar(
    selectColumns => supabaseClient
      .from('profiles')
      .select(selectColumns)
      .eq('default_display_name', normalizedHandle)
      .maybeSingle(),
    'id, display_name, default_display_name, avatar_url',
    'id, display_name, default_display_name'
  );
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

  return runProfileSelectWithOptionalAvatar(
    selectColumns => supabaseClient
      .from('profiles')
      .select(selectColumns)
      .in('id', normalizedProfileIds),
    'id, display_name, default_display_name, avatar_url',
    'id, display_name, default_display_name'
  );
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

function getUserPageTopCountItem(counts, options = {}) {
  const items = Array.from(counts.entries())
    .filter(([value, count]) => value && Number(count) > 0);

  if (!items.length) {
    return null;
  }

  items.sort(([firstValue, firstCount], [secondValue, secondCount]) => {
    if (firstCount !== secondCount) {
      return secondCount - firstCount;
    }

    if (options.numeric) {
      return Number(secondValue) - Number(firstValue);
    }

    return String(firstValue).localeCompare(String(secondValue), 'ru');
  });

  const [label, count] = items[0];

  return {
    label: String(label),
    count
  };
}

function getUserPageTasteStats(items = []) {
  const genreCounts = new Map();
  const subgenreCounts = new Map();
  const countryCounts = new Map();
  const yearCounts = new Map();

  (Array.isArray(items) ? items : []).forEach(item => {
    const movie = item?.movie;

    if (!movie) {
      return;
    }

    const meta = getCatalogMovieMeta(movie);

    meta.filterableGenreNames.forEach(genreName => addCount(genreCounts, genreName));
    meta.subgenreKeys.forEach(subgenreKey => addCount(subgenreCounts, subgenreKey));
    meta.countryNames.forEach(countryName => addCount(countryCounts, countryName));

    if (movie.year) {
      addCount(yearCounts, Number(movie.year));
    }
  });

  return {
    extraGenre: getUserPageTopCountItem(genreCounts),
    subgenre: getUserPageTopCountItem(subgenreCounts),
    country: getUserPageTopCountItem(countryCounts),
    year: getUserPageTopCountItem(yearCounts, { numeric: true })
  };
}

function getOptionalUserPageAggregateRows(result, label) {
  if (result?.error) {
    console.warn(`Не удалось загрузить агрегаты профиля (${label}):`, result.error);
    return [];
  }

  return Array.isArray(result?.data) ? result.data : [];
}

async function fetchUserPageActivityAggregateRows() {
  try {
    const [
      profilesResult,
      ratingsResult,
      watchlistResult,
      reviewsResult
    ] = await Promise.all([
      supabaseClient
        .from('profiles')
        .select('id')
        .limit(USER_PAGE_ACTIVITY_AGGREGATE_LIMIT),
      supabaseClient
        .from('movie_ratings')
        .select('user_id, movie_id')
        .limit(USER_PAGE_ACTIVITY_AGGREGATE_LIMIT),
      supabaseClient
        .from('movie_watchlist')
        .select('user_id, movie_id')
        .limit(USER_PAGE_ACTIVITY_AGGREGATE_LIMIT),
      supabaseClient
        .from('movie_reviews')
        .select('user_id')
        .limit(USER_PAGE_ACTIVITY_AGGREGATE_LIMIT)
    ]);

    return {
      profileRows: getOptionalUserPageAggregateRows(profilesResult, 'profiles'),
      ratingRows: getOptionalUserPageAggregateRows(ratingsResult, 'movie_ratings'),
      watchlistRows: getOptionalUserPageAggregateRows(watchlistResult, 'movie_watchlist'),
      reviewRows: getOptionalUserPageAggregateRows(reviewsResult, 'movie_reviews'),
      hasProfileRows: !profilesResult.error,
      hasRatingRows: !ratingsResult.error,
      hasWatchlistRows: !watchlistResult.error,
      hasReviewRows: !reviewsResult.error
    };
  } catch (error) {
    console.warn('Не удалось загрузить агрегаты профиля:', error);
    return {
      profileRows: [],
      ratingRows: [],
      watchlistRows: [],
      reviewRows: [],
      hasProfileRows: false,
      hasRatingRows: false,
      hasWatchlistRows: false,
      hasReviewRows: false
    };
  }
}

function normalizeUserPageUserId(userId) {
  return String(userId || '').trim();
}

function getUserPageUserMoviePairKey(row) {
  const userId = normalizeUserPageUserId(row?.user_id);
  const movieId = String(row?.movie_id || '').trim();

  return userId && movieId ? `${userId}:${movieId}` : '';
}

function getUserPageUserCountMap(rows = []) {
  const counts = new Map();

  (Array.isArray(rows) ? rows : []).forEach(row => {
    addCount(counts, normalizeUserPageUserId(row?.user_id));
  });

  return counts;
}

function getUserPageActiveWatchlistCountMap(watchlistRows = [], ratingRows = []) {
  const ratedMovieUserPairs = new Set(
    (Array.isArray(ratingRows) ? ratingRows : [])
      .map(getUserPageUserMoviePairKey)
      .filter(Boolean)
  );
  const counts = new Map();

  (Array.isArray(watchlistRows) ? watchlistRows : []).forEach(row => {
    const pairKey = getUserPageUserMoviePairKey(row);

    if (!pairKey || ratedMovieUserPairs.has(pairKey)) {
      return;
    }

    addCount(counts, normalizeUserPageUserId(row.user_id));
  });

  return counts;
}

function getUserPageActivityPopulationIds(aggregateRows, currentUserId, countMaps = []) {
  const userIds = new Set();
  const normalizedCurrentUserId = normalizeUserPageUserId(currentUserId);

  (Array.isArray(aggregateRows?.profileRows) ? aggregateRows.profileRows : [])
    .forEach(row => {
      const userId = normalizeUserPageUserId(row?.id);

      if (userId) {
        userIds.add(userId);
      }
    });

  countMaps.forEach(counts => {
    counts.forEach((_, userId) => {
      if (userId) {
        userIds.add(userId);
      }
    });
  });

  if (normalizedCurrentUserId) {
    userIds.add(normalizedCurrentUserId);
  }

  return userIds;
}

function getUserPageBetterThanPercent(count, countsByUser, populationUserIds, currentUserId) {
  const ownCount = Number(count) || 0;
  const normalizedCurrentUserId = normalizeUserPageUserId(currentUserId);

  if (!ownCount || !normalizedCurrentUserId) {
    return null;
  }

  const peerUserIds = Array.from(populationUserIds)
    .filter(userId => userId && userId !== normalizedCurrentUserId);

  if (!peerUserIds.length) {
    return null;
  }

  const lowerCount = peerUserIds.reduce((total, userId) => (
    total + ((countsByUser.get(userId) || 0) < ownCount ? 1 : 0)
  ), 0);

  if (!lowerCount) {
    return null;
  }

  return Math.min(99, Math.max(1, Math.round((lowerCount / peerUserIds.length) * 100)));
}

function getUserPageActivityPlace(count, countsByUser, populationUserIds, currentUserId) {
  const ownCount = Number(count) || 0;
  const normalizedCurrentUserId = normalizeUserPageUserId(currentUserId);

  if (!ownCount || !normalizedCurrentUserId) {
    return null;
  }

  const peerUserIds = Array.from(populationUserIds)
    .filter(userId => userId && userId !== normalizedCurrentUserId);

  if (!peerUserIds.length) {
    return null;
  }

  const higherCount = peerUserIds.reduce((total, userId) => (
    total + ((countsByUser.get(userId) || 0) > ownCount ? 1 : 0)
  ), 0);

  return higherCount + 1;
}

function getUserPageActivityRank(count, countsByUser, populationUserIds, currentUserId) {
  const place = getUserPageActivityPlace(count, countsByUser, populationUserIds, currentUserId);

  if (!place) {
    return null;
  }

  return {
    place,
    percent: getUserPageBetterThanPercent(count, countsByUser, populationUserIds, currentUserId)
  };
}

function hasUserPageComparableActivityCount(countsByUser, currentUserId, ownCount) {
  const normalizedCurrentUserId = normalizeUserPageUserId(currentUserId);
  const expectedCount = Number(ownCount) || 0;

  if (!expectedCount) {
    return true;
  }

  return (countsByUser.get(normalizedCurrentUserId) || 0) === expectedCount;
}

function syncUserPageOwnActivityCount(countsByUser, currentUserId, ownCount) {
  const normalizedCurrentUserId = normalizeUserPageUserId(currentUserId);

  if (!normalizedCurrentUserId) {
    return;
  }

  countsByUser.set(normalizedCurrentUserId, Number(ownCount) || 0);
}

function getUserPageActivityRanks(userId, aggregateRows = {}, ownCounts = {}) {
  const ratingCounts = aggregateRows.hasRatingRows
    ? getUserPageUserCountMap(aggregateRows.ratingRows)
    : new Map();
  const watchlistCounts = aggregateRows.hasWatchlistRows && aggregateRows.hasRatingRows
    ? getUserPageActiveWatchlistCountMap(aggregateRows.watchlistRows, aggregateRows.ratingRows)
    : new Map();
  const reviewCounts = aggregateRows.hasReviewRows
    ? getUserPageUserCountMap(aggregateRows.reviewRows)
    : new Map();

  syncUserPageOwnActivityCount(ratingCounts, userId, ownCounts.ratings);
  syncUserPageOwnActivityCount(watchlistCounts, userId, ownCounts.watchlist);
  syncUserPageOwnActivityCount(reviewCounts, userId, ownCounts.reviews);

  const populationUserIds = getUserPageActivityPopulationIds(
    aggregateRows,
    userId,
    [ratingCounts, watchlistCounts, reviewCounts]
  );
  const hasComparableRatings = aggregateRows.hasRatingRows &&
    hasUserPageComparableActivityCount(ratingCounts, userId, ownCounts.ratings);
  const hasComparableWatchlist = aggregateRows.hasWatchlistRows && aggregateRows.hasRatingRows &&
    hasUserPageComparableActivityCount(watchlistCounts, userId, ownCounts.watchlist);
  const hasComparableReviews = aggregateRows.hasReviewRows &&
    hasUserPageComparableActivityCount(reviewCounts, userId, ownCounts.reviews);

  return {
    ratings: hasComparableRatings
      ? getUserPageActivityRank(ownCounts.ratings, ratingCounts, populationUserIds, userId)
      : null,
    watchlist: hasComparableWatchlist
      ? getUserPageActivityRank(ownCounts.watchlist, watchlistCounts, populationUserIds, userId)
      : null,
    reviews: hasComparableReviews
      ? getUserPageActivityRank(ownCounts.reviews, reviewCounts, populationUserIds, userId)
      : null
  };
}

function sortUserPageMoviesByTitle(firstItem, secondItem) {
  return getManualSimilarMovieLabel(firstItem.movie).localeCompare(
    getManualSimilarMovieLabel(secondItem.movie),
    'ru'
  );
}

function getUserPageItemTimestampMs(item, fields) {
  for (const field of fields) {
    const timestamp = new Date(item?.[field] || 0).getTime();

    if (Number.isFinite(timestamp) && timestamp > 0) {
      return timestamp;
    }
  }

  return 0;
}

function sortUserPageItemsByNewestAdded(firstItem, secondItem) {
  const firstTime = getUserPageItemTimestampMs(firstItem, ['created_at', 'updated_at']);
  const secondTime = getUserPageItemTimestampMs(secondItem, ['created_at', 'updated_at']);

  return (
    secondTime - firstTime ||
    sortUserPageMoviesByTitle(firstItem, secondItem)
  );
}

function sortUserPageReviewsByNewestActivity(firstItem, secondItem) {
  const firstTime = getUserPageItemTimestampMs(firstItem, ['updated_at', 'created_at']);
  const secondTime = getUserPageItemTimestampMs(secondItem, ['updated_at', 'created_at']);

  return (
    secondTime - firstTime ||
    sortUserPageMoviesByTitle(firstItem, secondItem)
  );
}

function getUserPageMovieCardHtml(item, getBadgeHtml = null) {
  const movie = item.movie;
  const movieTitle = getManualSimilarMovieLabel(movie);
  const originalTitle = String(movie?.original_title || '').trim();
  const year = movie?.year ? String(movie.year) : '';
  const badgeHtml = getBadgeHtml ? getBadgeHtml(item) : '';

  return `
    <a href="${escapeHtml(buildMoviePageUrl(movie))}" class="user-page-movie-card" aria-label="Перейти к фильму ${escapeHtml(movieTitle)}">
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

function getUserPageStatRankClass(place) {
  if (place === 1) {
    return 'user-page-stat-rank-gold';
  }

  if (place === 2) {
    return 'user-page-stat-rank-silver';
  }

  if (place === 3) {
    return 'user-page-stat-rank-bronze';
  }

  return 'user-page-stat-rank-regular';
}

function getUserPageStatRankHtml(rank) {
  const place = Number(rank?.place);

  if (!Number.isFinite(place) || place <= 0) {
    return '';
  }

  const rankClass = getUserPageStatRankClass(place);
  const percent = Number(rank?.percent);
  const title = Number.isFinite(percent) && percent > 0
    ? `Больше, чем у ${percent}% пользователей`
    : '';
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const tooltipAttrs = title
    ? ` data-user-page-rank-title="${escapeHtml(title)}" aria-expanded="false" role="button" tabindex="0"`
    : '';
  const ariaLabel = title || `${place} место в рейтинге`;

  return `
    <span class="user-page-stat-rank ${rankClass}"${titleAttr}${tooltipAttrs} aria-label="${escapeHtml(ariaLabel)}">
      <span class="user-page-stat-rank-number">${escapeHtml(String(place))}</span>
    </span>
  `;
}

function getUserPageStatCardHtml(value, label, rank = null) {
  return `
    <div class="user-page-stat">
      <span class="user-page-stat-value">${escapeHtml(String(value))}</span>
      <span class="user-page-stat-label">${escapeHtml(label)}</span>
      ${getUserPageStatRankHtml(rank)}
    </div>
  `;
}

function getUserPageTasteValueHtml(item) {
  if (!item) {
    return '<span class="user-page-taste-empty">—</span>';
  }

  return `
    <span class="user-page-taste-name" title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>
    <span class="user-page-taste-count">(${escapeHtml(String(item.count))})</span>
  `;
}

function getUserPageTasteCardHtml(label, item) {
  return `
    <div class="user-page-taste-card">
      <span class="user-page-taste-label">${escapeHtml(label)}</span>
      <span class="user-page-taste-value">${getUserPageTasteValueHtml(item)}</span>
    </div>
  `;
}

function getUserPageTasteStatsHtml(tasteStats = {}) {
  return `
    <section class="user-page-taste-stats" aria-label="Вкусовая статистика">
      ${getUserPageTasteCardHtml('Любимый доп. жанр', tasteStats.extraGenre)}
      ${getUserPageTasteCardHtml('Любимый поджанр', tasteStats.subgenre)}
      ${getUserPageTasteCardHtml('Любимая страна', tasteStats.country)}
      ${getUserPageTasteCardHtml('Любимый год', tasteStats.year)}
    </section>
  `;
}

function getUserPageSectionHeaderHtml(title, url) {
  const normalizedTitle = String(title || '').trim();
  const normalizedUrl = String(url || '').trim();

  if (!normalizedTitle) {
    return '';
  }

  return `
    <div class="user-page-section-header">
      <h2>
        ${
          normalizedUrl
            ? `
              <a class="user-page-section-title-link" href="${escapeHtml(normalizedUrl)}">
                <span>${escapeHtml(normalizedTitle)}</span>
                <span class="user-page-section-title-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M7 17 17 7"></path>
                    <path d="M9 7h8v8"></path>
                  </svg>
                </span>
              </a>
            `
            : escapeHtml(normalizedTitle)
        }
      </h2>
    </div>
  `;
}

const NOTIFICATIONS_PAGE_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'social', label: 'Реакции' },
  { key: 'replies', label: 'Ответы' },
  { key: 'following', label: 'Отслеживаемые' },
  { key: 'new-movies', label: 'Новинки' }
];

const NOTIFICATIONS_DEFAULT_PREFERENCES = {
  notify_new_movies: true,
  notify_review_likes: true,
  notify_comment_likes: true,
  notify_comment_replies: true,
  notify_review_comments: true,
  notify_new_followers: true
};

const NOTIFICATIONS_PREFERENCE_LABELS = {
  notify_new_movies: 'Новые фильмы',
  notify_review_likes: 'Лайки рецензий',
  notify_comment_likes: 'Лайки комментариев',
  notify_comment_replies: 'Ответы на комментарии',
  notify_review_comments: 'Ответы на рецензии',
  notify_new_followers: 'Новые отслеживания'
};

const FOLLOWING_NOTIFICATION_PREFERENCE_LABELS = {
  notify_ratings: 'Оценки',
  notify_watchlist: 'Смотреть позже',
  notify_reviews: 'Рецензии'
};

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

function getNotificationEventTimestampMs(item) {
  const timestamp = new Date(item?.createdAt || item?.deliveryCreatedAt || 0).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getNotificationCategory(type) {
  if (type === 'new_movies_digest') {
    return 'new-movies';
  }

  if (type === 'followed_rating' || type === 'followed_watchlist' || type === 'followed_review') {
    return 'following';
  }

  if (type === 'comment_reply' || type === 'review_comment') {
    return 'replies';
  }

  return 'social';
}

function getNotificationMovieIdsFromPayload(payload) {
  const movieIds = Array.isArray(payload?.movie_ids) ? payload.movie_ids : [];

  return [...new Set(
    movieIds
      .map(movieId => String(movieId || '').trim())
      .filter(Boolean)
  )];
}

function getNotificationReviewSnippetIds(items = []) {
  const reviewIds = new Set();

  (Array.isArray(items) ? items : []).forEach(item => {
    if ((item.type === 'review_liked' || item.type === 'followed_review') && item.entityId) {
      reviewIds.add(String(item.entityId));
    }
  });

  return [...reviewIds];
}

function getNotificationCommentSnippetIds(items = []) {
  const commentIds = new Set();

  (Array.isArray(items) ? items : []).forEach(item => {
    if (
      (item.type === 'comment_liked' || item.type === 'comment_reply' || item.type === 'review_comment') &&
      item.entityId
    ) {
      commentIds.add(String(item.entityId));
    }
  });

  return [...commentIds];
}

async function fetchNotificationReviewSnippets(reviewIds = []) {
  const normalizedReviewIds = [...new Set(
    (Array.isArray(reviewIds) ? reviewIds : [])
      .map(reviewId => String(reviewId || '').trim())
      .filter(Boolean)
  )];

  if (!normalizedReviewIds.length) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('movie_reviews')
    .select('id, movie_id, review_text, contains_spoilers, contains_profanity')
    .in('id', normalizedReviewIds);

  if (error) {
    console.warn('Ошибка загрузки фрагментов рецензий для уведомлений:', error);
    return [];
  }

  return data || [];
}

async function fetchNotificationCommentSnippets(commentIds = []) {
  const normalizedCommentIds = [...new Set(
    (Array.isArray(commentIds) ? commentIds : [])
      .map(commentId => String(commentId || '').trim())
      .filter(Boolean)
  )];

  if (!normalizedCommentIds.length || !areMovieCommentsAvailable) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('movie_comments')
    .select('id, movie_id, comment_text, contains_spoilers, contains_profanity, is_deleted')
    .in('id', normalizedCommentIds);

  if (error) {
    if (isMovieCommentsTableUnavailableError(error)) {
      areMovieCommentsAvailable = false;
    }

    console.warn('Ошибка загрузки фрагментов комментариев для уведомлений:', error);
    return [];
  }

  areMovieCommentsAvailable = true;
  return data || [];
}

function normalizeNotificationRow(row) {
  const event = Array.isArray(row?.notification_events)
    ? row.notification_events[0]
    : row?.notification_events;

  if (!event?.id) {
    return null;
  }

  return {
    id: String(event.id),
    type: String(event.type || '').trim(),
    actorId: String(event.actor_id || '').trim(),
    movieId: String(event.movie_id || '').trim(),
    entityType: String(event.entity_type || '').trim(),
    entityId: String(event.entity_id || '').trim(),
    payload: event.payload && typeof event.payload === 'object' ? event.payload : {},
    createdAt: event.created_at,
    deliveryCreatedAt: row?.created_at,
    readAt: row?.read_at || null
  };
}

async function fetchNotificationsPageRows() {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('notification_deliveries')
    .select('event_id, read_at, created_at, notification_events (*)')
    .eq('recipient_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(NOTIFICATIONS_PAGE_LIMIT);

  if (error) {
    if (isNotificationsUnavailableError(error)) {
      areNotificationsUnavailable = true;
    }

    throw error;
  }

  return (data || [])
    .map(normalizeNotificationRow)
    .filter(Boolean);
}

async function fetchCurrentNotificationPreferences() {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    return { ...NOTIFICATIONS_DEFAULT_PREFERENCES };
  }

  const { data, error } = await supabaseClient
    .from('notification_preferences')
    .select(Object.keys(NOTIFICATIONS_DEFAULT_PREFERENCES).join(', '))
    .eq('user_id', currentUser.id)
    .maybeSingle();

  if (error) {
    if (isNotificationsUnavailableError(error)) {
      areNotificationsUnavailable = true;
      return { ...NOTIFICATIONS_DEFAULT_PREFERENCES };
    }

    throw error;
  }

  if (data) {
    return {
      ...NOTIFICATIONS_DEFAULT_PREFERENCES,
      ...Object.fromEntries(
        Object.keys(NOTIFICATIONS_DEFAULT_PREFERENCES).map(key => [key, Boolean(data[key])])
      )
    };
  }

  const insertPayload = {
    user_id: currentUser.id,
    ...NOTIFICATIONS_DEFAULT_PREFERENCES
  };
  const { error: insertError } = await supabaseClient
    .from('notification_preferences')
    .insert(insertPayload);

  if (insertError && insertError.code !== '23505') {
    if (isNotificationsUnavailableError(insertError)) {
      areNotificationsUnavailable = true;
      return { ...NOTIFICATIONS_DEFAULT_PREFERENCES };
    }

    throw insertError;
  }

  return { ...NOTIFICATIONS_DEFAULT_PREFERENCES };
}

async function fetchNotificationsPageData() {
  const [notificationRows, preferences] = await Promise.all([
    fetchNotificationsPageRows(),
    fetchCurrentNotificationPreferences()
  ]);
  const actorIds = [...new Set(
    notificationRows
      .map(item => item.actorId)
      .filter(Boolean)
  )];
  const movieIds = [...new Set(
    notificationRows
      .flatMap(item => [
        item.movieId,
        ...getNotificationMovieIdsFromPayload(item.payload)
      ])
      .map(movieId => String(movieId || '').trim())
      .filter(Boolean)
  )];
  const reviewSnippetIds = getNotificationReviewSnippetIds(notificationRows);
  const commentSnippetIds = getNotificationCommentSnippetIds(notificationRows);
  const [profiles, movies, reviewSnippets, commentSnippets] = await Promise.all([
    fetchPublicProfilesByIds(actorIds),
    fetchMoviesByIdsWithSelect(movieIds, MOVIE_USER_PAGE_CARD_SELECT),
    fetchNotificationReviewSnippets(reviewSnippetIds),
    fetchNotificationCommentSnippets(commentSnippetIds)
  ]);
  const profilesById = new Map((profiles || []).map(profile => [String(profile.id), profile]));
  const moviesById = new Map((movies || []).map(movie => [String(movie.id), movie]));
  const reviewSnippetsById = new Map((reviewSnippets || []).map(review => [String(review.id), review]));
  const commentSnippetsById = new Map((commentSnippets || []).map(comment => [String(comment.id), comment]));

  notificationsPagePreferences = preferences;
  notificationsPageItems = notificationRows
    .map(item => ({
      ...item,
      actor: item.actorId ? profilesById.get(item.actorId) : null,
      movie: item.movieId ? moviesById.get(item.movieId) : null,
      reviewSnippet: item.entityId ? reviewSnippetsById.get(item.entityId) : null,
      commentSnippet: item.entityId ? commentSnippetsById.get(item.entityId) : null,
      digestMovies: getNotificationMovieIdsFromPayload(item.payload)
        .map(movieId => moviesById.get(movieId))
        .filter(Boolean)
    }))
    .sort((firstItem, secondItem) => (
      getNotificationEventTimestampMs(secondItem) - getNotificationEventTimestampMs(firstItem)
    ));

  return {
    items: notificationsPageItems,
    preferences
  };
}

function getNotificationActorLinkHtml(actor) {
  if (!actor) {
    return '<span class="notifications-page-actor">Пользователь</span>';
  }

  const displayName = getPublicProfileDisplayName(actor);
  const handle = getPublicProfileHandle(actor);

  return `
    <a class="notifications-page-actor" href="${escapeHtml(buildUserPageUrl(handle))}">
      ${escapeHtml(displayName)}
    </a>
  `;
}

function getNotificationMovieDisplayTitle(movie, fallbackTitle = 'фильм') {
  if (!movie) {
    return fallbackTitle;
  }

  const title = String(movie.title || getManualSimilarMovieLabel(movie) || fallbackTitle).trim();
  const year = Number(movie.year || 0);

  return Number.isFinite(year) && year > 0 ? `${title} (${year})` : title;
}

function getNotificationMovieLinkHtml(movie, fallbackTitle = 'фильм') {
  if (!movie) {
    return `<span class="notifications-page-movie">${escapeHtml(fallbackTitle)}</span>`;
  }

  return `<a class="notifications-page-movie" href="${escapeHtml(buildMoviePageUrl(movie))}">${escapeHtml(getNotificationMovieDisplayTitle(movie, fallbackTitle))}</a>`;
}

function getNotificationAvatarHtml(item) {
  if (item.type === 'new_movies_digest') {
    return '<span class="notifications-page-avatar notifications-page-avatar-system" aria-hidden="true">+</span>';
  }

  return getFollowingPageAvatarHtml(
    item.actor,
    'notifications-page-avatar',
    'small'
  );
}

function getNotificationBadgeLabelHtml(item) {
  if (item.type === 'followed_rating') {
    const rating = Number(item.payload?.rating || 0);

    return rating
      ? `Оценка <strong>${escapeHtml(rating)}</strong><span>★</span>`
      : 'Оценка';
  }

  if (item.type === 'followed_watchlist') {
    return 'Смотреть позже';
  }

  if (item.type === 'followed_review') {
    return 'Рецензия';
  }

  if (item.type === 'new_movies_digest') {
    return 'Новинки';
  }

  if (item.type === 'review_liked' || item.type === 'comment_liked') {
    return 'Реакция';
  }

  if (item.type === 'comment_reply' || item.type === 'review_comment') {
    return 'Ответ';
  }

  if (item.type === 'profile_followed') {
    return 'Новое отслеживание';
  }

  return '';
}

function getNotificationBadgeHtml(item) {
  const labelHtml = getNotificationBadgeLabelHtml(item);

  if (!labelHtml) {
    return '';
  }

  return `
    <span class="notifications-page-type-badge${item.type === 'followed_rating' ? ' is-rating' : ''}">
      ${labelHtml}
    </span>
  `;
}

function getNotificationContextKind(item) {
  if (item.type === 'review_liked' || item.type === 'followed_review') {
    return 'review';
  }

  if (item.type === 'comment_liked' || item.type === 'comment_reply' || item.type === 'review_comment') {
    return 'comment';
  }

  return '';
}

function getNotificationContextSource(item) {
  const contextKind = getNotificationContextKind(item);

  if (contextKind === 'review') {
    return item.reviewSnippet || null;
  }

  if (contextKind === 'comment') {
    return item.commentSnippet || null;
  }

  return null;
}

function getNotificationContextText(source, contextKind) {
  if (!source) {
    return '';
  }

  const label = NOTIFICATION_CONTEXT_SNIPPET_LABELS[contextKind] || 'Текст';

  if (source.is_deleted) {
    return `${label} удалён.`;
  }

  if (source.contains_spoilers || source.contains_profanity) {
    return getMovieContentWarningCoverText(source, label);
  }

  const rawText = contextKind === 'review'
    ? normalizeMovieReviewText(source.review_text || '')
    : normalizeMovieCommentText(source.comment_text || '');

  return rawText.replace(/\s+/g, ' ').trim();
}

function getNotificationContextAnchorId(source, contextKind) {
  if (!source?.id) {
    return '';
  }

  return contextKind === 'review'
    ? getMovieReviewAnchorId(source.id)
    : getMovieCommentAnchorId(source.id);
}

function getNotificationContextHtml(item) {
  const contextKind = getNotificationContextKind(item);
  const source = getNotificationContextSource(item);
  const contextText = getNotificationContextText(source, contextKind);
  const anchorId = getNotificationContextAnchorId(source, contextKind);

  if (!contextKind || !source || !contextText) {
    return '';
  }

  const label = NOTIFICATION_CONTEXT_SNIPPET_LABELS[contextKind] || 'Текст';
  const contextInnerHtml = `
    <span class="notifications-page-context-label">${escapeHtml(label)}</span>
    <span class="notifications-page-context-text">${escapeHtml(contextText)}</span>
  `;

  if (!item.movie || !anchorId) {
    return `<div class="notifications-page-context">${contextInnerHtml}</div>`;
  }

  return `
    <a class="notifications-page-context" href="${escapeHtml(`${buildMoviePageUrl(item.movie)}#${anchorId}`)}">
      ${contextInnerHtml}
    </a>
  `;
}

function getNotificationMovieCardHtml(movie) {
  if (!movie) {
    return '';
  }

  return getUserPageMovieCardHtml({ movie });
}

function getNotificationDigestMoviesHtml(item) {
  const digestMovies = item.digestMovies || [];
  const digestCount = Math.max(getNotificationMovieIdsFromPayload(item.payload).length, digestMovies.length);

  return `
    <div class="notifications-page-digest-summary">
      Добавлены новые фильмы${digestCount ? ` (${digestCount})` : ''}
    </div>
    ${
      digestMovies.length
        ? `
          <div class="notifications-page-movie-rail-shell user-page-movie-rail-shell" data-user-page-rail-shell="true">
            <button
              class="user-page-rail-button user-page-rail-button-prev notifications-page-movie-rail-button"
              type="button"
              data-user-page-rail-prev="true"
              aria-label="Прокрутить новинки назад"
              hidden
            >
              <span class="user-page-rail-button-icon" aria-hidden="true"></span>
            </button>
            <div class="notifications-page-movie-rail user-page-movie-rail" data-user-page-rail="true" tabindex="0">
              ${digestMovies.map(getNotificationMovieCardHtml).join('')}
            </div>
            <button
              class="user-page-rail-button user-page-rail-button-next notifications-page-movie-rail-button"
              type="button"
              data-user-page-rail-next="true"
              aria-label="Прокрутить новинки вперёд"
              hidden
            >
              <span class="user-page-rail-button-icon" aria-hidden="true"></span>
            </button>
          </div>
        `
        : ''
    }
  `;
}

function getNotificationBodyHtml(item) {
  const actorHtml = getNotificationActorLinkHtml(item.actor);
  const movieHtml = getNotificationMovieLinkHtml(item.movie);
  let mainHtml = '';

  if (item.type === 'review_liked') {
    mainHtml = `${actorHtml} оценил(а) вашу рецензию к фильму ${movieHtml}.`;
  }
  else if (item.type === 'comment_liked') {
    mainHtml = `${actorHtml} оценил(а) ваш комментарий к фильму ${movieHtml}.`;
  }
  else if (item.type === 'comment_reply') {
    mainHtml = `${actorHtml} ответил(а) на ваш комментарий к фильму ${movieHtml}.`;
  }
  else if (item.type === 'review_comment') {
    mainHtml = `${actorHtml} оставил(а) комментарий к вашей рецензии к фильму ${movieHtml}.`;
  }
  else if (item.type === 'followed_rating') {
    mainHtml = `${actorHtml} оценил(а) фильм ${movieHtml}.`;
  }
  else if (item.type === 'followed_watchlist') {
    mainHtml = `${actorHtml} добавил(а) фильм ${movieHtml} в «Смотреть позже».`;
  }
  else if (item.type === 'followed_review') {
    mainHtml = `${actorHtml} написал(а) рецензию к фильму ${movieHtml}.`;
  }
  else if (item.type === 'profile_followed') {
    mainHtml = `${actorHtml} начал(а) отслеживать ваш профиль.`;
  }
  else if (item.type === 'new_movies_digest') {
    return getNotificationDigestMoviesHtml(item);
  }
  else {
    mainHtml = 'Новое уведомление.';
  }

  return `
    <div class="notifications-page-item-main-text">${mainHtml}</div>
    ${getNotificationContextHtml(item)}
  `;
}

function getNotificationsPageFilterCounts(items = []) {
  const counts = new Map(NOTIFICATIONS_PAGE_FILTERS.map(filter => [filter.key, 0]));

  for (const item of items) {
    const category = getNotificationCategory(item.type);

    counts.set('all', (counts.get('all') || 0) + 1);
    counts.set(category, (counts.get(category) || 0) + 1);
  }

  return counts;
}

function renderNotificationsPreferenceToggles(preferences) {
  return Object.entries(NOTIFICATIONS_PREFERENCE_LABELS)
    .map(([key, label]) => {
      const isChecked = Boolean(preferences?.[key]);
      const isBusy = notificationPreferenceRequestKeys.has(key);

      return `
        <label class="notifications-page-preference">
          <input
            type="checkbox"
            data-notification-preference-key="${escapeHtml(key)}"
            ${isChecked ? 'checked' : ''}
            ${isBusy ? 'disabled' : ''}
          >
          <span>${escapeHtml(label)}</span>
        </label>
      `;
    })
    .join('');
}

function renderNotificationsPagePreferences(preferences) {
  return `
    <section class="notifications-page-settings">
      <div class="notifications-page-settings-header">
        <h2>Настройки уведомлений</h2>
        <a href="${escapeHtml(buildFollowingPageUrl())}" class="notifications-page-settings-action">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 7h10"></path>
            <path d="M18 7h2"></path>
            <path d="M16 5v4"></path>
            <path d="M4 17h2"></path>
            <path d="M10 17h10"></path>
            <path d="M8 15v4"></path>
          </svg>
          <span>Отслеживаемые профили</span>
        </a>
      </div>
      <div class="notifications-page-preferences">
        ${renderNotificationsPreferenceToggles(preferences)}
      </div>
    </section>
  `;
}

function renderNotificationsPageFilters(items = []) {
  const counts = getNotificationsPageFilterCounts(items);

  return `
    <div class="notifications-page-toolbar">
      <div class="notifications-page-filter-list" role="tablist" aria-label="Фильтр уведомлений">
        ${NOTIFICATIONS_PAGE_FILTERS.map(filter => {
          const count = counts.get(filter.key) || 0;
          const isActive = notificationsPageFilter === filter.key;

          return `
            <button
              type="button"
              class="notifications-page-filter${isActive ? ' is-active' : ''}"
              data-notification-filter="${escapeHtml(filter.key)}"
              aria-pressed="${isActive ? 'true' : 'false'}"
            >
              ${escapeHtml(filter.label)}
              <span>${escapeHtml(count)}</span>
            </button>
          `;
        }).join('')}
      </div>
      <button
        type="button"
        class="secondary-button notifications-page-read-all-button"
        data-notifications-mark-all-read="true"
        ${isNotificationsPageMarkingAllRead || !items.some(item => !item.readAt) ? 'disabled' : ''}
      >
        Отметить все прочитанными
      </button>
    </div>
  `;
}

function renderNotificationsPageItem(item) {
  const timestampMs = getNotificationEventTimestampMs(item);
  const dateLabel = formatShortDateTime(timestampMs);
  const readClass = item.readAt ? ' is-read' : ' is-unread';
  const actorHandle = item.actor ? getPublicProfileHandle(item.actor) : '';
  const actorDisplayName = item.actor ? getPublicProfileDisplayName(item.actor) : '';
  const avatarHtml = getNotificationAvatarHtml(item);
  const avatarContentHtml = actorHandle
    ? `
      <a
        href="${escapeHtml(buildUserPageUrl(actorHandle))}"
        class="notifications-page-avatar-link"
        aria-label="Профиль ${escapeHtml(actorDisplayName)}"
      >
        ${avatarHtml}
      </a>
    `
    : avatarHtml;

  return `
    <article
      class="notifications-page-item${readClass}"
      data-notification-event-id="${escapeHtml(item.id)}"
    >
      <div class="notifications-page-avatar-shell">
        ${avatarContentHtml}
        ${item.readAt ? '' : '<span class="notifications-page-unread-dot" aria-hidden="true"></span>'}
      </div>
      <div class="notifications-page-item-body">
        <div class="notifications-page-item-topline">
          ${getNotificationBadgeHtml(item)}
          ${dateLabel ? `<time datetime="${new Date(timestampMs).toISOString()}">${escapeHtml(dateLabel)}</time>` : ''}
        </div>
        <div class="notifications-page-item-text">
          ${getNotificationBodyHtml(item)}
        </div>
      </div>
    </article>
  `;
}

function renderNotificationsPageList(items = []) {
  const filteredItems = notificationsPageFilter === 'all'
    ? items
    : items.filter(item => getNotificationCategory(item.type) === notificationsPageFilter);

  if (!items.length) {
    return '<div class="notifications-page-empty-state">Уведомлений пока нет.</div>';
  }

  if (!filteredItems.length) {
    return '<div class="notifications-page-empty-state">В этом разделе пока нет уведомлений.</div>';
  }

  return `
    <div class="notifications-page-list">
      ${filteredItems.map(renderNotificationsPageItem).join('')}
    </div>
  `;
}

function renderNotificationsPageLoading() {
  if (!notificationsPage) {
    return;
  }

  notificationsPage.innerHTML = '<div class="notifications-page-loading-state">Загрузка уведомлений...</div>';
}

function renderNotificationsPageAuthGate() {
  if (!notificationsPage) {
    return;
  }

  document.title = 'Уведомления — Хоррорейро';
  notificationsPage.innerHTML = `
    <div class="notifications-page-empty-state notifications-page-empty-state-large">
      <p>Войди, чтобы видеть уведомления о реакциях, ответах и отслеживаемых профилях.</p>
      <button type="button" class="secondary-button following-page-login-button" data-following-page-login="true">
        Войти
      </button>
    </div>
  `;
}

function renderNotificationsPageUnavailable() {
  if (!notificationsPage) {
    return;
  }

  document.title = 'Уведомления — Хоррорейро';
  notificationsPage.innerHTML = `
    <div class="notifications-page-empty-state notifications-page-empty-state-large">
      Контур уведомлений ещё не подключён. Примените notifications-setup.sql в Supabase и обновите страницу.
    </div>
  `;
}

function renderNotificationsPageError() {
  if (!notificationsPage) {
    return;
  }

  notificationsPage.innerHTML = `
    <div class="notifications-page-empty-state notifications-page-empty-state-large">
      Не удалось загрузить уведомления. Попробуй обновить страницу.
    </div>
  `;
}

function renderNotificationsPage(data = {}) {
  if (!notificationsPage) {
    return;
  }

  clearNotificationReadDwellTimers();

  const items = data.items || notificationsPageItems || [];
  const preferences = data.preferences || notificationsPagePreferences || NOTIFICATIONS_DEFAULT_PREFERENCES;

  document.title = 'Уведомления — Хоррорейро';
  notificationsPage.innerHTML = `
    ${renderNotificationsPagePreferences(preferences)}
    <section class="notifications-page-feed">
      <div class="notifications-page-section-header">
        <h2>Лента уведомлений</h2>
      </div>
      ${renderNotificationsPageFilters(items)}
      ${renderNotificationsPageList(items)}
    </section>
  `;
  bindUserPageRailControls(notificationsPage);
  bindNotificationsPageReadTracking();
}

function clearNotificationReadDwellTimers() {
  notificationReadDwellTimers.forEach(timerId => window.clearTimeout(timerId));
  notificationReadDwellTimers.clear();
}

function getNotificationItemByEventId(eventId) {
  const normalizedEventId = String(eventId || '').trim();

  return notificationsPageItems.find(item => item.id === normalizedEventId) || null;
}

function getNotificationElementByEventId(eventId) {
  const normalizedEventId = String(eventId || '').trim();

  if (!notificationsPage || !normalizedEventId) {
    return null;
  }

  return notificationsPage.querySelector(`[data-notification-event-id="${CSS.escape(normalizedEventId)}"]`);
}

function syncNotificationsPageReadAllButtonState() {
  const readAllButton = notificationsPage?.querySelector('[data-notifications-mark-all-read="true"]');

  if (!readAllButton) {
    return;
  }

  readAllButton.disabled = isNotificationsPageMarkingAllRead || !notificationsPageItems.some(item => !item.readAt);
}

function applyNotificationReadStateToDom(eventId) {
  const notificationElement = getNotificationElementByEventId(eventId);

  if (!notificationElement) {
    return;
  }

  notificationElement.classList.remove('is-unread');
  notificationElement.classList.add('is-read');
  notificationElement.querySelector('.notifications-page-unread-dot')?.remove();
  syncNotificationsPageReadAllButtonState();
}

function clearNotificationReadDwell(eventId) {
  const normalizedEventId = String(eventId || '').trim();
  const timerId = notificationReadDwellTimers.get(normalizedEventId);

  if (!timerId) {
    return;
  }

  window.clearTimeout(timerId);
  notificationReadDwellTimers.delete(normalizedEventId);
}

function startNotificationReadDwell(eventId) {
  const normalizedEventId = String(eventId || '').trim();
  const item = getNotificationItemByEventId(normalizedEventId);

  if (!normalizedEventId || !item || item.readAt || notificationReadDwellTimers.has(normalizedEventId)) {
    return;
  }

  const timerId = window.setTimeout(() => {
    notificationReadDwellTimers.delete(normalizedEventId);
    void markNotificationRead(normalizedEventId, { rerender: false }).catch(error => {
      console.warn('Ошибка отметки уведомления прочитанным:', error);
    });
  }, NOTIFICATION_READ_DWELL_MS);

  notificationReadDwellTimers.set(normalizedEventId, timerId);
}

function isNotificationVisibilityReadTrackingEnabled() {
  return Boolean(window.matchMedia?.('(hover: none), (pointer: coarse)').matches);
}

function observeNotificationsPageVisibleItems() {
  if (notificationReadObserver) {
    notificationReadObserver.disconnect();
    notificationReadObserver = null;
  }

  if (
    !notificationsPage ||
    !isNotificationVisibilityReadTrackingEnabled() ||
    typeof IntersectionObserver === 'undefined'
  ) {
    return;
  }

  notificationReadObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const eventId = entry.target?.dataset?.notificationEventId || '';

      if (
        entry.isIntersecting &&
        entry.intersectionRatio >= NOTIFICATION_READ_VISIBILITY_RATIO &&
        document.visibilityState !== 'hidden'
      ) {
        startNotificationReadDwell(eventId);
      } else {
        clearNotificationReadDwell(eventId);
      }
    });
  }, {
    threshold: [0, NOTIFICATION_READ_VISIBILITY_RATIO, 1]
  });

  notificationsPage
    .querySelectorAll('.notifications-page-item.is-unread[data-notification-event-id]')
    .forEach(item => notificationReadObserver.observe(item));
}

function handleNotificationReadPointerOver(event) {
  if (event.pointerType === 'touch') {
    return;
  }

  const notificationElement = event.target?.closest?.('.notifications-page-item[data-notification-event-id]');

  if (!notificationElement || !notificationsPage?.contains(notificationElement)) {
    return;
  }

  startNotificationReadDwell(notificationElement.dataset.notificationEventId);
}

function handleNotificationReadPointerOut(event) {
  if (event.pointerType === 'touch') {
    return;
  }

  const notificationElement = event.target?.closest?.('.notifications-page-item[data-notification-event-id]');

  if (!notificationElement || notificationElement.contains(event.relatedTarget)) {
    return;
  }

  clearNotificationReadDwell(notificationElement.dataset.notificationEventId);
}

function handleNotificationReadFocusIn(event) {
  const notificationElement = event.target?.closest?.('.notifications-page-item[data-notification-event-id]');

  if (!notificationElement || !notificationsPage?.contains(notificationElement)) {
    return;
  }

  startNotificationReadDwell(notificationElement.dataset.notificationEventId);
}

function handleNotificationReadFocusOut(event) {
  const notificationElement = event.target?.closest?.('.notifications-page-item[data-notification-event-id]');

  if (!notificationElement || notificationElement.contains(event.relatedTarget)) {
    return;
  }

  clearNotificationReadDwell(notificationElement.dataset.notificationEventId);
}

function bindNotificationsPageReadTracking() {
  if (!areNotificationReadTrackingEventsBound) {
    document.addEventListener('pointerover', handleNotificationReadPointerOver);
    document.addEventListener('pointerout', handleNotificationReadPointerOut);
    document.addEventListener('focusin', handleNotificationReadFocusIn);
    document.addEventListener('focusout', handleNotificationReadFocusOut);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearNotificationReadDwellTimers();
        return;
      }

      observeNotificationsPageVisibleItems();
    });
    areNotificationReadTrackingEventsBound = true;
  }

  observeNotificationsPageVisibleItems();
}

async function markNotificationRead(eventId, { rerender = true } = {}) {
  const normalizedEventId = String(eventId || '').trim();

  if (!normalizedEventId || !shouldUseAuthenticatedUi() || !currentUser?.id) {
    return;
  }

  clearNotificationReadDwell(normalizedEventId);

  const item = getNotificationItemByEventId(normalizedEventId);

  if (item?.readAt) {
    return;
  }

  const readAt = new Date().toISOString();
  const { error } = await supabaseClient
    .from('notification_deliveries')
    .update({ read_at: readAt })
    .eq('recipient_id', currentUser.id)
    .eq('event_id', normalizedEventId)
    .is('read_at', null);

  if (error) {
    if (isNotificationsUnavailableError(error)) {
      areNotificationsUnavailable = true;
    }

    throw error;
  }

  if (item) {
    item.readAt = readAt;
  }

  notificationsUnreadCount = Math.max(0, notificationsUnreadCount - 1);
  syncNotificationsBadgeUi();

  if (notificationsPage && rerender) {
    renderNotificationsPage();
  } else if (notificationsPage) {
    applyNotificationReadStateToDom(normalizedEventId);
  }
}

async function markAllNotificationsRead() {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id || isNotificationsPageMarkingAllRead) {
    return;
  }

  const unreadItems = notificationsPageItems.filter(item => !item.readAt);

  if (!unreadItems.length) {
    return;
  }

  isNotificationsPageMarkingAllRead = true;
  renderNotificationsPage();

  try {
    const readAt = new Date().toISOString();
    const { error } = await supabaseClient
      .from('notification_deliveries')
      .update({ read_at: readAt })
      .eq('recipient_id', currentUser.id)
      .is('read_at', null);

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        areNotificationsUnavailable = true;
      }

      throw error;
    }

    notificationsPageItems = notificationsPageItems.map(item => ({
      ...item,
      readAt: item.readAt || readAt
    }));
    notificationsUnreadCount = 0;
    syncNotificationsBadgeUi();
  } catch (error) {
    console.error('Ошибка отметки уведомлений прочитанными:', error);
    showAppMessage('Не удалось отметить уведомления прочитанными.', 'error', true);
  } finally {
    isNotificationsPageMarkingAllRead = false;
    renderNotificationsPage();
  }
}

function handleNotificationsPageClick(event) {
  const filterButton = event.target?.closest?.('[data-notification-filter]');

  if (filterButton) {
    event.preventDefault();
    notificationsPageFilter = String(filterButton.dataset.notificationFilter || 'all');
    renderNotificationsPage();
    return true;
  }

  const markAllReadButton = event.target?.closest?.('[data-notifications-mark-all-read="true"]');

  if (markAllReadButton) {
    event.preventDefault();
    void markAllNotificationsRead();
    return true;
  }

  const notificationItem = event.target?.closest?.('[data-notification-event-id]');

  if (notificationItem) {
    const destinationLink = event.target?.closest?.('a[href]');
    const notificationEventId = notificationItem.dataset.notificationEventId;

    if (!destinationLink) {
      return false;
    }

    const shouldOpenNormally = Boolean(
      (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        destinationLink.target === '_blank'
      )
    );

    if (!shouldOpenNormally) {
      event.preventDefault();
      void markNotificationRead(notificationEventId, { rerender: false })
        .catch(error => {
          console.warn('Ошибка отметки уведомления прочитанным:', error);
        })
        .finally(() => {
          window.location.href = destinationLink.href;
        });
      return true;
    }

    void markNotificationRead(notificationEventId, { rerender: false }).catch(error => {
      console.warn('Ошибка отметки уведомления прочитанным:', error);
    });
    return true;
  }

  return false;
}

async function updateNotificationPreference(key, value) {
  const normalizedKey = String(key || '').trim();

  if (!Object.prototype.hasOwnProperty.call(NOTIFICATIONS_DEFAULT_PREFERENCES, normalizedKey)) {
    return;
  }

  if (!shouldUseAuthenticatedUi() || !currentUser?.id || notificationPreferenceRequestKeys.has(normalizedKey)) {
    return;
  }

  notificationPreferenceRequestKeys.add(normalizedKey);
  notificationsPagePreferences = {
    ...(notificationsPagePreferences || NOTIFICATIONS_DEFAULT_PREFERENCES),
    [normalizedKey]: Boolean(value)
  };
  renderNotificationsPage();

  try {
    const { error } = await supabaseClient
      .from('notification_preferences')
      .upsert({
        user_id: currentUser.id,
        [normalizedKey]: Boolean(value)
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        areNotificationsUnavailable = true;
      }

      throw error;
    }
  } catch (error) {
    console.error('Ошибка обновления настройки уведомлений:', error);
    notificationsPagePreferences = {
      ...(notificationsPagePreferences || NOTIFICATIONS_DEFAULT_PREFERENCES),
      [normalizedKey]: !Boolean(value)
    };
    showAppMessage('Не удалось обновить настройку уведомлений.', 'error', true);
  } finally {
    notificationPreferenceRequestKeys.delete(normalizedKey);
    renderNotificationsPage();
  }
}

function handleNotificationsPagePreferenceChange(event) {
  const input = event.target?.closest?.('[data-notification-preference-key]');

  if (!input) {
    return false;
  }

  void updateNotificationPreference(input.dataset.notificationPreferenceKey, input.checked);
  return true;
}

async function loadNotificationsPage() {
  if (!notificationsPage) {
    return;
  }

  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    renderNotificationsPageAuthGate();
    return;
  }

  renderNotificationsPageLoading();

  try {
    const data = await fetchNotificationsPageData();
    await refreshNotificationsUnreadCount({ force: true });
    renderNotificationsPage(data);
  } catch (error) {
    if (isNotificationsUnavailableError(error)) {
      console.warn('Контур уведомлений пока недоступен:', error);
      renderNotificationsPageUnavailable();
      return;
    }

    console.error('Ошибка загрузки страницы уведомлений:', error);
    renderNotificationsPageError();
  }
}

async function initNotificationsPage() {
  renderNotificationsPageLoading();

  const restoredUser = await restoreSession();

  bindSharedAuthStateListener({
    onAfterAuthSync: async () => {
      await loadNotificationsPage();
    }
  });

  if (!restoredUser && !shouldUseAuthenticatedUi()) {
    renderNotificationsPageAuthGate();
    return;
  }

  await loadNotificationsPage();
}

function renderFollowingPageLoading() {
  if (!followingPage) {
    return;
  }

  followingPage.innerHTML = '<div class="following-page-loading-state">Загрузка отслеживаний...</div>';
}

function renderFollowingPageAuthGate() {
  if (!followingPage) {
    return;
  }

  document.title = 'Отслеживания — Хоррорейро';
  followingPage.innerHTML = `
    <div class="following-page-empty-state following-page-empty-state-large">
      <p>Войди, чтобы управлять отслеживаемыми профилями и уведомлениями от них.</p>
      <button type="button" class="secondary-button following-page-login-button" data-following-page-login="true">
        Войти
      </button>
    </div>
  `;
}

function renderFollowingPageError() {
  if (!followingPage) {
    return;
  }

  followingPage.innerHTML = `
    <div class="following-page-empty-state following-page-empty-state-large">
      Не удалось загрузить отслеживания. Попробуй обновить страницу.
    </div>
  `;
}

async function fetchFollowingPageFollowRows() {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('user_profile_follows')
    .select('following_id, created_at')
    .eq('follower_id', currentUser.id)
    .order('created_at', { ascending: false });

  throwIfSupabaseError(error);

  const rows = data || [];

  currentUserFollowedProfileIds = new Set(
    rows
      .map(row => String(row?.following_id || '').trim())
      .filter(Boolean)
  );

  return rows;
}

async function fetchFollowingPageNotificationPreferences(profileIds = []) {
  const normalizedProfileIds = [...new Set(
    (Array.isArray(profileIds) ? profileIds : [])
      .map(profileId => String(profileId || '').trim())
      .filter(Boolean)
  )];

  if (!shouldUseAuthenticatedUi() || !currentUser?.id || !normalizedProfileIds.length) {
    return {
      preferencesByProfileId: new Map(),
      arePreferencesAvailable: true
    };
  }

  const { data, error } = await supabaseClient
    .from('user_follow_notification_preferences')
    .select('following_id, notify_ratings, notify_watchlist, notify_reviews')
    .eq('follower_id', currentUser.id)
    .in('following_id', normalizedProfileIds);

  if (error) {
    if (isNotificationsUnavailableError(error)) {
      return {
        preferencesByProfileId: new Map(),
        arePreferencesAvailable: false
      };
    }

    throw error;
  }

  return {
    preferencesByProfileId: new Map(
      (data || []).map(row => [
        String(row.following_id),
        {
          notify_ratings: row.notify_ratings !== false,
          notify_watchlist: row.notify_watchlist !== false,
          notify_reviews: row.notify_reviews !== false
        }
      ])
    ),
    arePreferencesAvailable: true
  };
}

function getFollowingNotificationPreference(preferencesByProfileId, profileId) {
  const preference = preferencesByProfileId?.get?.(String(profileId || '').trim());

  return {
    notify_ratings: preference?.notify_ratings !== false,
    notify_watchlist: preference?.notify_watchlist !== false,
    notify_reviews: preference?.notify_reviews !== false
  };
}

async function fetchFollowingPageData() {
  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    return null;
  }

  const followRows = await fetchFollowingPageFollowRows();
  const followedProfileIds = followRows
    .map(row => String(row?.following_id || '').trim())
    .filter(Boolean);

  if (!followedProfileIds.length) {
    return {
      followRows,
      profiles: [],
      preferencesByProfileId: new Map(),
      arePreferencesAvailable: true
    };
  }

  const [profiles, preferencesResult] = await Promise.all([
    fetchPublicProfilesByIds(followedProfileIds),
    fetchFollowingPageNotificationPreferences(followedProfileIds)
  ]);
  const profilesById = new Map((profiles || []).map(profile => [String(profile.id), profile]));
  const orderedProfiles = followRows
    .map(row => profilesById.get(String(row.following_id)))
    .filter(Boolean);

  return {
    followRows,
    profiles: orderedProfiles,
    preferencesByProfileId: preferencesResult.preferencesByProfileId,
    arePreferencesAvailable: preferencesResult.arePreferencesAvailable
  };
}

function getFollowingPageAvatarHtml(profile, className, size = 'small') {
  const displayName = getPublicProfileDisplayName(profile);
  const avatarUrl = getPublicProfileAvatarUrl(profile);
  const modifierClass = size ? ` ${className}-${size}` : '';

  if (avatarUrl) {
    return `
      <img
        class="${className}${modifierClass}"
        src="${escapeHtml(avatarUrl)}"
        alt="Аватар пользователя ${escapeHtml(displayName)}"
        loading="lazy"
        decoding="async"
      >
    `;
  }

  return `
    <span class="${className}${modifierClass}" aria-hidden="true">
      ${escapeHtml(getUserPageAvatarLetter(displayName))}
    </span>
  `;
}

function getFollowingPagePreferenceKey(profileId, key) {
  return `${String(profileId || '').trim()}:${String(key || '').trim()}`;
}

function getFollowingPageProfileCardHtml(profile, preferencesByProfileId, arePreferencesAvailable = true) {
  const displayName = getPublicProfileDisplayName(profile);
  const handle = getPublicProfileHandle(profile);
  const profileId = String(profile?.id || '').trim();
  const preference = getFollowingNotificationPreference(preferencesByProfileId, profileId);

  return `
    <article class="following-page-profile-card">
      <a href="${escapeHtml(buildUserPageUrl(handle))}" class="following-page-profile-link">
        ${getFollowingPageAvatarHtml(profile, 'following-page-profile-avatar')}
        <span class="following-page-profile-name">${escapeHtml(displayName)}</span>
        <span class="following-page-profile-handle">${escapeHtml(handle)}</span>
      </a>

      <div class="following-page-profile-controls" aria-label="Уведомления от ${escapeHtml(displayName)}">
        ${Object.entries(FOLLOWING_NOTIFICATION_PREFERENCE_LABELS).map(([key, label]) => {
          const preferenceKey = getFollowingPagePreferenceKey(profileId, key);
          const isBusy = followingPagePreferenceRequestKeys.has(preferenceKey);
          const isChecked = preference[key] !== false;

          return `
            <label class="following-page-profile-toggle">
              <input
                type="checkbox"
                data-follow-notification-toggle="true"
                data-following-id="${escapeHtml(profileId)}"
                data-follow-notification-key="${escapeHtml(key)}"
                ${isChecked ? 'checked' : ''}
                ${isBusy || !arePreferencesAvailable ? 'disabled' : ''}
              >
              <span>${escapeHtml(label)}</span>
            </label>
          `;
        }).join('')}
      </div>

      <button
        type="button"
        class="secondary-button following-page-unfollow-button"
        data-following-page-unfollow-profile-id="${escapeHtml(profileId)}"
        ${followingPageUnfollowRequestProfileIds.has(profileId) ? 'disabled' : ''}
      >
        Не отслеживать
      </button>
    </article>
  `;
}

function renderFollowingPage(data) {
  if (!followingPage) {
    return;
  }

  document.title = 'Отслеживания — Хоррорейро';

  if (!data?.profiles?.length) {
    followingPage.innerHTML = `
      <div class="following-page-empty-state following-page-empty-state-large">
        Ты пока никого не отслеживаешь. Открой чужой профиль и нажми «Отслеживать».
      </div>
    `;
    return;
  }

  followingPage.innerHTML = `
    <section class="following-page-block">
      <div class="following-page-section-header">
        <h2>Отслеживаемые профили</h2>
        <span>${data.profiles.length}</span>
      </div>
      ${
        data.arePreferencesAvailable
          ? ''
          : '<div class="following-page-empty-state following-page-warning-state">Настройки уведомлений станут доступны после применения notifications-setup.sql в Supabase.</div>'
      }
      <div class="following-page-profile-grid">
        ${data.profiles
          .map(profile => getFollowingPageProfileCardHtml(
            profile,
            data.preferencesByProfileId,
            data.arePreferencesAvailable
          ))
          .join('')}
      </div>
    </section>
  `;
}

async function updateFollowingNotificationPreference(profileId, key, value) {
  const normalizedProfileId = String(profileId || '').trim();
  const normalizedKey = String(key || '').trim();

  if (
    !normalizedProfileId ||
    !Object.prototype.hasOwnProperty.call(FOLLOWING_NOTIFICATION_PREFERENCE_LABELS, normalizedKey) ||
    !shouldUseAuthenticatedUi() ||
    !currentUser?.id
  ) {
    return;
  }

  const requestKey = getFollowingPagePreferenceKey(normalizedProfileId, normalizedKey);

  if (followingPagePreferenceRequestKeys.has(requestKey)) {
    return;
  }

  followingPagePreferenceRequestKeys.add(requestKey);

  try {
    const { error } = await supabaseClient
      .from('user_follow_notification_preferences')
      .upsert({
        follower_id: currentUser.id,
        following_id: normalizedProfileId,
        [normalizedKey]: Boolean(value)
      }, {
        onConflict: 'follower_id,following_id'
      });

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        areNotificationsUnavailable = true;
      }

      throw error;
    }
  } catch (error) {
    console.error('Ошибка обновления настройки отслеживания:', error);
    showAppMessage('Не удалось обновить настройку отслеживания.', 'error', true);
  } finally {
    followingPagePreferenceRequestKeys.delete(requestKey);
    await loadFollowingPage();
  }
}

function handleFollowingPagePreferenceChange(event) {
  const input = event.target?.closest?.('[data-follow-notification-toggle="true"]');

  if (!input) {
    return false;
  }

  void updateFollowingNotificationPreference(
    input.dataset.followingId,
    input.dataset.followNotificationKey,
    input.checked
  );
  return true;
}

async function unfollowProfileFromFollowingPage(profileId) {
  const normalizedProfileId = String(profileId || '').trim();

  if (!normalizedProfileId || !shouldUseAuthenticatedUi() || !currentUser?.id) {
    return;
  }

  if (followingPageUnfollowRequestProfileIds.has(normalizedProfileId)) {
    return;
  }

  followingPageUnfollowRequestProfileIds.add(normalizedProfileId);

  try {
    const { error } = await supabaseClient
      .from('user_profile_follows')
      .delete()
      .eq('follower_id', currentUser.id)
      .eq('following_id', normalizedProfileId);

    throwIfSupabaseError(error);
    currentUserFollowedProfileIds.delete(normalizedProfileId);
    showAppMessage('Профиль больше не отслеживается.', 'success', true);
  } catch (error) {
    console.error('Ошибка удаления отслеживания:', error);
    showAppMessage('Не удалось удалить отслеживание.', 'error', true);
  } finally {
    followingPageUnfollowRequestProfileIds.delete(normalizedProfileId);
    await loadFollowingPage();
  }
}

function handleFollowingPageUnfollowClick(event) {
  const button = event.target?.closest?.('[data-following-page-unfollow-profile-id]');

  if (!button) {
    return false;
  }

  event.preventDefault();
  void unfollowProfileFromFollowingPage(button.dataset.followingPageUnfollowProfileId);
  return true;
}

function handleFollowingPageLoginClick(event) {
  const button = event.target?.closest?.('[data-following-page-login="true"]');

  if (!button) {
    return false;
  }

  event.preventDefault();
  openAuthModal();
  return true;
}

async function loadFollowingPage() {
  if (!followingPage) {
    return;
  }

  if (!shouldUseAuthenticatedUi() || !currentUser?.id) {
    renderFollowingPageAuthGate();
    return;
  }

  renderFollowingPageLoading();

  try {
    const data = await fetchFollowingPageData();
    renderFollowingPage(data);
  } catch (error) {
    console.error('Ошибка загрузки страницы отслеживаемых профилей:', error);
    renderFollowingPageError();
  }
}

function renderUserPageLoading() {
  if (!userPage) {
    return;
  }

  hideUserPageRankTooltip();
  syncUserPageMainTitle();
  userPage.innerHTML = '<div class="user-page-loading-state">Загрузка профиля...</div>';
}

function renderUserPageNotFound() {
  if (!userPage) {
    return;
  }

  hideUserPageRankTooltip();
  syncUserPageMainTitle();
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
    reviewsResult,
    activityAggregateRows
  ] = await Promise.all([
    supabaseClient
      .from('movie_ratings')
      .select('movie_id, rating, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabaseClient
      .from('movie_watchlist')
      .select('movie_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabaseClient
      .from('movie_reviews')
      .select('id, movie_id, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false }),
    fetchUserPageActivityAggregateRows()
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

  const previewRatingRows = ratingRows.slice(0, USER_PAGE_PREVIEW_LIMIT);
  const previewWatchlistRows = activeWatchlistRows.slice(0, USER_PAGE_PREVIEW_LIMIT);
  const previewReviewRows = reviewRows.slice(0, USER_PAGE_PREVIEW_LIMIT);
  const previewMovieIds = [...new Set([
    ...getUserPageMovieIds(previewRatingRows),
    ...getUserPageMovieIds(previewWatchlistRows),
    ...getUserPageMovieIds(previewReviewRows)
  ])];
  const tasteMovieIds = getUserPageMovieIds(ratingRows);

  const [previewMovies, tasteMovies] = await Promise.all([
    fetchMoviesByIdsWithSelect(previewMovieIds, MOVIE_USER_PAGE_CARD_SELECT),
    fetchMoviesByIdsWithSelect(tasteMovieIds, MOVIE_USER_PAGE_TASTE_SELECT)
  ]);
  const previewMoviesById = new Map(previewMovies.map(movie => [String(movie.id), movie]));
  const tasteMoviesById = new Map(tasteMovies.map(movie => [String(movie.id), movie]));
  const ratingItems = previewRatingRows
    .map(row => ({
      ...row,
      movie: previewMoviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie)
    .sort(sortUserPageItemsByNewestAdded);
  const watchlistItems = previewWatchlistRows
    .map(row => ({
      ...row,
      movie: previewMoviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie)
    .sort(sortUserPageItemsByNewestAdded);
  const reviewItems = previewReviewRows
    .map(row => ({
      ...row,
      movie: previewMoviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie)
    .sort(sortUserPageReviewsByNewestActivity);
  const tasteItems = ratingRows
    .map(row => ({
      ...row,
      movie: tasteMoviesById.get(String(row.movie_id))
    }))
    .filter(item => item.movie);

  return {
    profile,
    ratingItems,
    watchlistItems,
    reviewItems,
    ratingCount: ratingRows.length,
    watchlistCount: activeWatchlistRows.length,
    reviewCount: reviewRows.length,
    averageRating: getUserPageAverageRating(ratingRows),
    tasteStats: getUserPageTasteStats(tasteItems),
    activityRanks: getUserPageActivityRanks(userId, activityAggregateRows, {
      ratings: ratingRows.length,
      watchlist: activeWatchlistRows.length,
      reviews: reviewRows.length
    })
  };
}

function renderUserPage(data) {
  if (!userPage || !data?.profile) {
    return;
  }

  hideUserPageRankTooltip();
  const displayName = getPublicProfileDisplayName(data.profile);
  const handle = getPublicProfileHandle(data.profile);
  const averageRating = data.averageRating === null ? '-' : data.averageRating.toFixed(1);
  const ratingCount = Number(data.ratingCount ?? data.ratingItems.length) || 0;
  const watchlistCount = Number(data.watchlistCount ?? data.watchlistItems.length) || 0;
  const reviewCount = Number(data.reviewCount ?? data.reviewItems.length) || 0;
  const ratingsCatalogUrl = buildCatalogProfileActivityUrl(handle, 'ratings');
  const watchlistCatalogUrl = buildCatalogProfileActivityUrl(handle, 'watchlist');
  const reviewsCatalogUrl = buildCatalogProfileActivityUrl(handle, 'reviews');
  const canEditDisplayName = Boolean(
    shouldUseAuthenticatedUi() &&
    currentUser?.id &&
    String(data.profile.id || '') === String(currentUser.id)
  );
  const avatarHtml = getUserPageAvatarHtml(data.profile, displayName, canEditDisplayName);
  const followButtonHtml = getUserPageFollowButtonHtml(data.profile);
  const profileSettingsButtonHtml = canEditDisplayName
    ? `
      <button
        type="button"
        class="user-page-display-name-edit-button user-page-settings-button"
        data-user-page-profile-settings="true"
        data-profile-id="${escapeHtml(data.profile.id)}"
        aria-label="Настройки профиля"
        title="Настройки профиля"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path class="settings-gear-fill" fill-rule="evenodd" clip-rule="evenodd" d="M10.1 2h3.8l.45 3.02c.55.18 1.08.4 1.58.68l2.47-1.83 2.69 2.69-1.83 2.47c.28.5.5 1.03.68 1.58L22.96 11v3.8l-3.02.45a8.2 8.2 0 0 1-.68 1.58l1.83 2.47-2.69 2.69-2.47-1.83c-.5.28-1.03.5-1.58.68l-.45 3.02h-3.8l-.45-3.02a8.2 8.2 0 0 1-1.58-.68L5.6 21.99 2.91 19.3l1.83-2.47a8.2 8.2 0 0 1-.68-1.58L1.04 14.8V11l3.02-.45c.18-.55.4-1.08.68-1.58L2.91 6.5 5.6 3.81l2.47 1.83c.5-.28 1.03-.5 1.58-.68L10.1 2ZM12 15.45a3.55 3.55 0 1 0 0-7.1 3.55 3.55 0 0 0 0 7.1Z"></path>
        </svg>
      </button>
    `
    : '';

  setUserPageDocumentMeta(data.profile);
  syncUserPageMainTitle(data.profile);

  userPage.innerHTML = `
    <div class="user-page-overview">
      <section class="user-page-hero">
        ${avatarHtml}
        <div class="user-page-identity">
          <div class="user-page-title-row">
            <div class="user-page-display-name" data-user-page-display-name="true">${escapeHtml(displayName)}</div>
            ${profileSettingsButtonHtml}
          </div>
          <div class="user-page-handle">${escapeHtml(handle)}</div>
          ${followButtonHtml}
        </div>
      </section>

      <section class="user-page-stats" aria-label="Статистика пользователя">
        ${getUserPageStatCardHtml(ratingCount, 'Оценено', data.activityRanks?.ratings)}
        ${getUserPageStatCardHtml(averageRating, 'Средняя оценка')}
        ${getUserPageStatCardHtml(watchlistCount, 'Смотреть позже', data.activityRanks?.watchlist)}
        ${getUserPageStatCardHtml(reviewCount, 'Рецензии', data.activityRanks?.reviews)}
      </section>
    </div>

    ${getUserPageTasteStatsHtml(data.tasteStats)}

    <section class="user-page-section">
      ${getUserPageSectionHeaderHtml('Оценки и просмотры', ratingsCatalogUrl)}
      ${getUserPageMovieRailHtml(
          data.ratingItems,
          'Пока нет оценённых фильмов.',
          item => `<span class="user-page-card-badge">★ ${Number(item.rating || 0)}</span>`,
          ratingsCatalogUrl,
          ratingCount
        )}
    </section>

    <section class="user-page-section">
      ${getUserPageSectionHeaderHtml('Смотреть позже', watchlistCatalogUrl)}
      ${getUserPageMovieRailHtml(data.watchlistItems, 'Список просмотра пуст.', null, watchlistCatalogUrl, watchlistCount)}
    </section>

    <section class="user-page-section">
      ${getUserPageSectionHeaderHtml('Рецензии', reviewsCatalogUrl)}
      ${getUserPageMovieRailHtml(
          data.reviewItems,
          'Пока нет рецензий.',
          () => '<span class="user-page-card-badge user-page-card-badge-muted">Рецензия</span>',
          reviewsCatalogUrl,
          reviewCount
        )}
    </section>

    ${getUserPageAdminPasswordPanelHtml(data.profile)}
  `;

  bindUserPageRailControls();
  syncUserPageProfileSettingsButton();
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

  bindSharedAuthStateListener({
    onAfterAuthSync: async () => {
      try {
        const profile = await fetchPublicUserProfileByHandle(handle);

        if (!profile) {
          renderUserPageNotFound();
          return;
        }

        const data = await fetchPublicUserPageData(profile);
        renderUserPage(data);
      } catch (error) {
        console.error('Ошибка обновления страницы пользователя после смены auth-состояния:', error);
      }
    }
  });
}

async function initFollowingPage() {
  renderFollowingPageLoading();
  await restoreSession();
  trackEmailConfirmedLoginIfNeeded();
  await loadFollowingPage();

  bindSharedAuthStateListener({
    onAfterAuthSync: loadFollowingPage
  });
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
  const { data, error } = await runMovieSelectWithOptionalColumns(
    selectQuery => supabaseClient
      .from('movies')
      .select(selectQuery)
      .eq('id', movieId)
      .order('position', { foreignTable: 'movie_genres', ascending: true })
      .single(),
    MOVIE_BASE_SELECT
  );

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
    const { data, error } = await runMovieSelectWithOptionalColumns(
      selectQuery => supabaseClient
        .from('movies')
        .select(selectQuery)
        .eq('slug', routeParams.slug)
        .order('position', { foreignTable: 'movie_genres', ascending: true })
        .maybeSingle(),
      MOVIE_BASE_SELECT
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

function getMoviePageSimilarSelectedMovies() {
  return currentMoviePageSimilarMovieIds
    .map(movieId => getCatalogMovieById(movieId))
    .filter(Boolean);
}

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

function getMoviePageSimilarSearchSuggestions(movie, limit = 8) {
  const normalizedQuery = normalizeSearchText(moviePageSimilarEditorSearchQuery);

  if (!normalizedQuery || !Array.isArray(allMovies) || allMovies.length === 0) {
    return [];
  }

  const excludedMovieIds = new Set([
    String(movie?.id || ''),
    ...currentMoviePageSimilarMovieIds.map(movieId => String(movieId))
  ].filter(Boolean));

  return allMovies
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

function getMoviePageSimilarEditorStatusHtml() {
  if (!moviePageSimilarEditorStatus) {
    return '';
  }

  const statusClassName = moviePageSimilarEditorStatusType
    ? ` is-${moviePageSimilarEditorStatusType}`
    : '';

  return `
    <div class="movie-page-similar-editor-status${statusClassName}" aria-live="polite">
      ${escapeHtml(moviePageSimilarEditorStatus)}
    </div>
  `;
}

function getMoviePageSimilarEditorSuggestionsHtml(movie) {
  const query = moviePageSimilarEditorSearchQuery.trim();

  if (!query) {
    return `
      <div class="movie-page-similar-editor-hint">
        Начни вводить название, оригинальное название или режиссёра.
      </div>
    `;
  }

  if (!Array.isArray(allMovies) || allMovies.length === 0) {
    return `
      <div class="movie-page-similar-editor-hint">
        Загружаю каталог для поиска...
      </div>
    `;
  }

  const suggestions = getMoviePageSimilarSearchSuggestions(movie);

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
          ${isMoviePageSimilarEditorSaving ? 'disabled' : ''}
        >
          ${escapeHtml(getManualSimilarMovieLabel(suggestion))}
        </button>
      `).join('')}
    </div>
  `;
}

function getMoviePageSimilarEditorListHtml() {
  const selectedMovies = getMoviePageSimilarSelectedMovies();

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
        const isDragging = moviePageSimilarEditorDraggedMovieId === movieId;

        return `
          <div
            class="movie-page-similar-editor-item${isDragging ? ' is-dragging' : ''}"
            data-movie-page-similar-editor-item="${escapeHtml(movieId)}"
            draggable="${isMoviePageSimilarEditorSaving ? 'false' : 'true'}"
          >
            <button
              type="button"
              class="movie-page-similar-drag-handle"
              aria-label="Перетащить ${escapeHtml(getManualSimilarMovieLabel(movie))}"
              title="Перетащить"
              ${isMoviePageSimilarEditorSaving ? 'disabled' : ''}
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
                ${isFirst || isMoviePageSimilarEditorSaving ? 'disabled' : ''}
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
                ${isLast || isMoviePageSimilarEditorSaving ? 'disabled' : ''}
              >
                ↓
              </button>
              <button
                type="button"
                class="movie-page-similar-editor-icon-button movie-page-similar-editor-remove-button"
                data-movie-page-similar-remove="${escapeHtml(movieId)}"
                aria-label="Убрать из похожих"
                title="Убрать"
                ${isMoviePageSimilarEditorSaving ? 'disabled' : ''}
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

function getMoviePageSimilarEditorHtml(movie) {
  if (!isAdmin || !movie?.id) {
    return '';
  }

  if (!manualSimilarTableAvailable) {
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
          value="${escapeHtml(moviePageSimilarEditorSearchQuery)}"
          autocomplete="off"
          spellcheck="false"
          data-movie-page-similar-search="true"
          ${isMoviePageSimilarEditorSaving ? 'disabled' : ''}
        >
        ${getMoviePageSimilarEditorSuggestionsHtml(movie)}
      </div>

      <div class="movie-page-similar-editor-selected">
        <div class="movie-page-similar-editor-label">Порядок похожих</div>
        ${getMoviePageSimilarEditorListHtml()}
      </div>

      ${getMoviePageSimilarEditorStatusHtml()}
    </div>
  `;
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
  if (!movie || !moviePage) {
    return;
  }

  const requestId = ++moviePageSimilarRequestId;
  const movieId = String(movie.id);

  if (String(currentMoviePageSimilarMovieId || '') !== movieId) {
    moviePageSimilarEditorSearchQuery = '';
    setMoviePageSimilarEditorStatus();
  }

  currentMoviePageSimilarMovieId = movieId;
  currentMoviePageSimilarMovieIds = [];
  currentMoviePageSimilarMovies = [];

  if (shouldRender) {
    renderMoviePageSimilarSection(movieId);
  }

  try {
    let similarMovieIds = [];

    if (isAdmin) {
      await ensureManualSimilarDataLoaded({ ensureMovies: true });
      similarMovieIds = getManualSimilarMovieIds(movieId);
    } else {
      similarMovieIds = await fetchManualSimilarMovieIdsForMovie(movieId, limit);
    }

    const displayMovieIds = isAdmin
      ? similarMovieIds
      : similarMovieIds.slice(0, limit);
    const similarMovies = await fetchCatalogMoviesByIds(displayMovieIds);

    if (
      requestId !== moviePageSimilarRequestId ||
      String(currentMoviePageMovieId) !== movieId
    ) {
      return;
    }

    if (shouldRender && !moviePage.querySelector('[data-movie-page-similar-mount="true"]')) {
      renderMoviePage(movie);
    }

    currentMoviePageSimilarMovieIds = similarMovieIds;
    currentMoviePageSimilarMovies = similarMovies;

    if (shouldRender) {
      renderMoviePageSimilarSection(movieId);
    }
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
    <article class="movie-page-similar-card" data-movie-id="${escapeHtml(movie.id)}">
      <a href="${escapeHtml(buildMoviePageUrl(movie))}" class="movie-page-similar-poster-link" aria-label="Перейти к фильму ${escapeHtml(movie.title)}">
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
    <section class="movie-page-review-form-block movie-page-collapsible-composer" data-movie-review-composer="true">
      <button
        type="button"
        class="secondary-button movie-page-composer-open-button"
        data-movie-review-composer-open="true"
        aria-expanded="${isMovieReviewComposerExpanded ? 'true' : 'false'}"
        ${isMovieReviewComposerExpanded ? 'hidden' : ''}
      >
        Написать рецензию
      </button>

      <div
        class="movie-page-composer-panel"
        data-movie-review-composer-panel="true"
        ${isMovieReviewComposerExpanded ? '' : 'hidden'}
      >
        <div class="movie-page-composer-header">
          <div class="movie-page-subtitle">Написать рецензию</div>
          <button
            type="button"
            class="secondary-button secondary-button-compact movie-page-composer-collapse-button"
            data-movie-review-composer-close="true"
          >
            Свернуть
          </button>
        </div>

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

          <label class="movie-page-review-spoiler-toggle">
            <input
              type="checkbox"
              name="containsProfanity"
              data-movie-review-profanity="true"
            >
            <span>Есть нецензурная лексика</span>
          </label>

          <div class="movie-page-review-form-actions">
            <button type="submit" data-movie-review-submit="true" disabled>Опубликовать</button>
          </div>

          <div class="movie-page-review-form-hint">
            Символов: <span class="movie-page-review-length" data-movie-review-length="true">0</span>. Нужно от ${MOVIE_REVIEW_MIN_LENGTH} до ${MOVIE_REVIEW_MAX_LENGTH}.
          </div>

          <p class="movie-page-review-form-message" data-movie-review-form-message="true"></p>
        </form>
      </div>
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
    const reviewTextLength = getMovieReviewTextLength(review.review_text || '');
    const isReviewTextValid = !getMovieReviewValidationMessage(review.review_text || '');

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

        <label class="movie-page-review-spoiler-toggle">
          <input
            type="checkbox"
            name="containsProfanity"
            data-movie-review-profanity="true"
            ${review.contains_profanity ? 'checked' : ''}
          >
          <span>Есть нецензурная лексика</span>
        </label>

        <div class="movie-page-review-form-actions">
          <button type="submit" data-movie-review-submit="true" ${isReviewTextValid ? '' : 'disabled'}>Сохранить изменения</button>
          <button
            type="button"
            class="secondary-button"
            data-movie-review-cancel-edit="true"
          >
            Отмена
          </button>
        </div>

        <div class="movie-page-review-form-hint">
          Символов: <span class="movie-page-review-length" data-movie-review-length="true">${reviewTextLength}</span>. Нужно от ${MOVIE_REVIEW_MIN_LENGTH} до ${MOVIE_REVIEW_MAX_LENGTH}.
        </div>

        <p class="movie-page-review-form-message" data-movie-review-form-message="true"></p>
      </form>
    `;
  }

  if (isSpoilerReview && !isExpandedSpoiler) {
    return `
      <div class="movie-page-review-spoiler-cover">
        <div class="movie-page-review-spoiler-cover-text">
          ${escapeHtml(getMovieContentWarningCoverText(review, 'Рецензия'))}
        </div>
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
    ${getMovieContentWarningBadgesHtml(review)}
    <div class="movie-page-review-text ${isLongReview && !isExpandedText ? 'is-collapsed' : ''}">${escapeHtml(normalizeMovieReviewText(review.review_text || ''))}</div>
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
  const metaLineCount = 1 + (reviewDate ? 1 : 0) + (userRatingHtml ? 1 : 0);
  const metaSizeClass = metaLineCount >= 3 ? ' is-meta-tall' : '';
  const canManageReview = Boolean(!isEditing && (isCurrentUserReview || isAdmin));

  return `
    <div class="movie-page-review-card-header">
      <div class="movie-page-review-author-row${metaSizeClass}">
        ${getMovieReviewAuthorAvatarHtml(review)}
        <div class="movie-page-review-card-meta">
          ${getMovieReviewAuthorNameHtml(review, authorName)}
          ${
            reviewDate
              ? `<div class="movie-page-review-date">${escapeHtml(reviewDate)}</div>`
              : ''
          }
          ${userRatingHtml}
        </div>
      </div>

      <div class="movie-page-review-card-header-side">
        ${
          canManageReview
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

function getMovieCommentAuthorAvatarHtml(comment) {
  const authorName = getMovieCommentAuthorName(comment);
  const avatarUrl = getPublicProfileAvatarUrl(comment?.profiles);
  const profileUrl = getMovieCommentAuthorProfileUrl(comment);
  let avatarHtml = '';

  if (avatarUrl) {
    avatarHtml = `
      <img
        class="movie-page-comment-avatar movie-page-comment-avatar-image"
        src="${escapeHtml(avatarUrl)}"
        alt=""
        aria-hidden="true"
      >
    `;
  } else {
    avatarHtml = `
      <div class="movie-page-comment-avatar" aria-hidden="true">
        ${escapeHtml(getUserPageAvatarLetter(authorName))}
      </div>
    `;
  }

  if (!profileUrl) {
    return avatarHtml;
  }

  return `
    <a
      class="movie-page-comment-avatar-link"
      href="${escapeHtml(profileUrl)}"
      aria-label="Открыть профиль ${escapeHtml(authorName)}"
    >
      ${avatarHtml}
    </a>
  `;
}

function getMovieCommentAuthorNameHtml(comment, authorName) {
  const profileUrl = getMovieCommentAuthorProfileUrl(comment);

  if (!profileUrl) {
    return `<div class="movie-page-comment-author">${escapeHtml(authorName)}</div>`;
  }

  return `
    <a class="movie-page-comment-author" href="${escapeHtml(profileUrl)}">
      ${escapeHtml(authorName)}
    </a>
  `;
}

function getMovieCommentFormHtml({
  movie,
  comment = null,
  parentCommentId = '',
  replyToCommentId = '',
  rootReviewId = '',
  depth = 0,
  submitLabel = 'Опубликовать',
  cancelLabel = 'Отмена',
  isInline = false,
  placeholder = 'Добавьте комментарий'
}) {
  const commentText = comment?.comment_text || '';
  const commentTextLength = getMovieCommentTextLength(commentText);
  const isCommentTextValid = !getMovieCommentValidationMessage(commentText);

  return `
    <form
      class="movie-page-comment-form${isInline ? ' movie-page-comment-inline-form' : ''}"
      data-movie-comment-form="true"
      data-movie-comment-id="${escapeHtml(comment?.id || '')}"
      data-movie-comment-movie-id="${escapeHtml(movie?.id || '')}"
      data-movie-comment-parent-id="${escapeHtml(parentCommentId || '')}"
      data-movie-comment-reply-to-id="${escapeHtml(replyToCommentId || '')}"
      data-movie-comment-root-review-id="${escapeHtml(rootReviewId || '')}"
      data-movie-comment-depth="${escapeHtml(String(depth || 0))}"
    >
      <textarea
        class="movie-page-comment-textarea"
        name="commentText"
        placeholder="${escapeHtml(placeholder)}"
        rows="${isInline ? 3 : 4}"
        maxlength="${MOVIE_COMMENT_MAX_LENGTH}"
        data-movie-comment-textarea="true"
      >${escapeHtml(commentText)}</textarea>

      <label class="movie-page-comment-spoiler-toggle">
        <input
          type="checkbox"
          name="containsSpoilers"
          data-movie-comment-spoilers="true"
          ${comment?.contains_spoilers ? 'checked' : ''}
        >
        <span>Есть спойлеры</span>
      </label>

      <label class="movie-page-comment-spoiler-toggle">
        <input
          type="checkbox"
          name="containsProfanity"
          data-movie-comment-profanity="true"
          ${comment?.contains_profanity ? 'checked' : ''}
        >
        <span>Есть нецензурная лексика</span>
      </label>

      <div class="movie-page-comment-form-actions">
        <button type="submit" data-movie-comment-submit="true" ${isCommentTextValid ? '' : 'disabled'}>${escapeHtml(submitLabel)}</button>
        ${
          isInline
            ? `
              <button
                type="button"
                class="secondary-button secondary-button-compact"
                data-movie-comment-cancel="true"
              >
                ${escapeHtml(cancelLabel)}
              </button>
            `
            : ''
        }
      </div>

      <div class="movie-page-comment-form-hint">
        Символов: <span class="movie-page-comment-length" data-movie-comment-length="true">${commentTextLength}</span>. Максимум ${MOVIE_COMMENT_MAX_LENGTH}.
      </div>

      <p class="movie-page-comment-form-message" data-movie-comment-form-message="true"></p>
    </form>
  `;
}

function getMovieCommentBodyHtml(comment) {
  if (comment.is_deleted) {
    return `<div class="movie-page-comment-deleted">Комментарий удалён.</div>`;
  }

  if ((comment.contains_spoilers || comment.contains_profanity) && !isMovieCommentSpoilerExpanded(comment.id)) {
    return `
      <div class="movie-page-comment-spoiler-cover">
        <div class="movie-page-comment-spoiler-cover-text">
          ${escapeHtml(getMovieContentWarningCoverText(comment, 'Комментарий'))}
        </div>
        <button
          type="button"
          class="secondary-button secondary-button-compact"
          data-movie-comment-show-spoilers="${escapeHtml(String(comment.id))}"
        >
          Показать
        </button>
      </div>
    `;
  }

  return `
    ${getMovieContentWarningBadgesHtml(comment)}
    <div class="movie-page-comment-text">${escapeHtml(normalizeMovieCommentText(comment.comment_text || ''))}</div>
  `;
}

function getMovieCommentReviewContextHtml(comment) {
  if (!comment?.root_review_id || comment?.parent_comment_id) {
    return '';
  }

  const review = getMovieReviewById(comment.root_review_id);
  const reviewAuthorName = review ? getMovieReviewAuthorName(review) : '';
  const shouldShowReviewSnippet = Boolean(review && !review.contains_spoilers && !review.contains_profanity);
  const reviewSnippet = shouldShowReviewSnippet ? getMovieReviewReplySnippet(review) : '';
  const reviewLinkHtml = review
    ? `<a href="#${escapeHtml(getMovieReviewAnchorId(review.id))}" data-movie-comment-review-anchor="${escapeHtml(String(review.id))}">рецензию ${escapeHtml(reviewAuthorName)}</a>`
    : 'рецензию';

  return `
    <div class="movie-page-comment-review-context">
      <span>Ответ на ${reviewLinkHtml}</span>
      ${reviewSnippet ? `<span class="movie-page-comment-review-context-snippet">${escapeHtml(reviewSnippet)}</span>` : ''}
    </div>
  `;
}

function getMovieCommentActionsHtml(comment) {
  const isOwnOrAdminComment = Boolean(
    currentUser?.id &&
    (isAdmin || String(comment.user_id || '') === String(currentUser.id))
  );

  if (!isOwnOrAdminComment || comment.is_deleted) {
    return '';
  }

  const canEdit = canCurrentUserEditMovieComment(comment);
  const editTitle = canEdit
    ? 'Редактировать'
    : 'Редактирование недоступно: на комментарий уже ответили';

  return `
    <div class="movie-page-comment-icon-actions">
      <button
        type="button"
        class="movie-page-comment-icon-button"
        data-movie-comment-edit="${escapeHtml(String(comment.id))}"
        aria-label="${escapeHtml(editTitle)}"
        title="${escapeHtml(editTitle)}"
        ${canEdit ? '' : 'disabled'}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path>
        </svg>
      </button>

      <button
        type="button"
        class="movie-page-comment-icon-button movie-page-comment-icon-button-danger"
        data-movie-comment-delete="${escapeHtml(String(comment.id))}"
        aria-label="Удалить комментарий"
        title="Удалить"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
}

function getMovieCommentFooterHtml(comment, movie, comments) {
  const childCount = getMovieCommentDescendantCount(comment.id, comments);
  const isThreadExpanded = isMovieCommentThreadExpanded('comment', comment.id);
  const replyTarget = getMovieCommentReplyTargetForComment(comment);
  const canReply = Boolean(currentUser?.id && !comment.is_deleted);
  const footerStartItems = [];
  let likeHtml = '';

  if (canReply) {
    footerStartItems.push(`
      <button
        type="button"
        class="secondary-button secondary-button-compact movie-page-comment-reply-button"
        data-movie-comment-reply="${escapeHtml(String(comment.id))}"
      >
        Ответить
      </button>
    `);
  }

  if (childCount > 0) {
    footerStartItems.push(`
      <button
        type="button"
        class="secondary-button secondary-button-compact movie-page-comment-thread-toggle"
        data-movie-comment-toggle-thread="comment:${escapeHtml(String(comment.id))}"
      >
        ${isThreadExpanded ? 'Скрыть ветку' : `Раскрыть ветку (${childCount})`}
      </button>
    `);
  }

  if (areMovieCommentLikesAvailable && !comment.is_deleted) {
    const likesCount = getMovieCommentLikeCount(comment);
    const isLiked = isMovieCommentLikedByCurrentUser(comment);
    const isOwnComment = Boolean(currentUser?.id && String(comment.user_id) === String(currentUser.id));
    const isBusy = movieCommentLikeRequestInFlight.has(String(comment.id));
    const countLabel = `${likesCount}`;
    const likeTitle = isOwnComment
      ? 'Нельзя лайкать собственный комментарий'
      : isLiked
        ? 'Убрать лайк'
        : 'Поставить лайк';

    likeHtml = isOwnComment
      ? `
        <div
          class="movie-page-discussion-like movie-page-comment-like movie-page-comment-like-static"
          title="${escapeHtml(likeTitle)}"
          aria-label="Лайков: ${escapeHtml(countLabel)}"
          aria-disabled="true"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"></path>
          </svg>
          <span>${escapeHtml(countLabel)}</span>
        </div>
      `
      : `
        <button
          type="button"
          class="movie-page-discussion-like movie-page-comment-like ${isLiked ? 'is-liked' : ''} ${isBusy ? 'is-busy' : ''}"
          data-movie-comment-like="${escapeHtml(String(comment.id))}"
          aria-pressed="${isLiked ? 'true' : 'false'}"
          aria-label="${escapeHtml(`${likeTitle}. Лайков: ${countLabel}`)}"
          title="${escapeHtml(likeTitle)}"
          ${isBusy ? 'disabled' : ''}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"></path>
          </svg>
          <span>${escapeHtml(countLabel)}</span>
        </button>
      `;
  }

  if (!footerStartItems.length && !likeHtml) {
    return '';
  }

  return `
    <div class="movie-page-comment-footer">
      <div class="movie-page-comment-footer-start">
        ${footerStartItems.join('')}
      </div>
      <div class="movie-page-comment-footer-end">
        ${likeHtml}
      </div>
    </div>
    ${
      isMovieCommentReplyingTo('comment', comment.id)
        ? getMovieCommentFormHtml({
            movie,
            parentCommentId: replyTarget.parentCommentId,
            replyToCommentId: replyTarget.replyToCommentId,
            rootReviewId: replyTarget.rootReviewId,
            depth: replyTarget.depth,
            submitLabel: 'Ответить',
            isInline: true,
            placeholder: 'Ваш ответ'
          })
        : ''
    }
  `;
}

function getMovieCommentCardHtml(comment, movie, comments = allMovieComments) {
  const authorName = getMovieCommentAuthorName(comment);
  const commentDate = formatMovieCommentDate(comment.updated_at || comment.created_at);
  const isEditing = isMovieCommentEditing(comment.id);
  const childComments = getMovieCommentChildComments(comment.id, comments);
  const isThreadExpanded = isMovieCommentThreadExpanded('comment', comment.id);

  return `
    <article
      class="movie-page-comment-card${comment.is_deleted ? ' is-deleted' : ''}"
      id="${escapeHtml(getMovieCommentAnchorId(comment.id))}"
      data-movie-comment-id="${escapeHtml(String(comment.id))}"
      style="--comment-depth: ${Math.max(0, Math.min(MOVIE_COMMENT_MAX_DEPTH, Number(comment.depth || 0)))}"
    >
      <div class="movie-page-comment-card-inner">
        <div class="movie-page-comment-card-header">
          <div class="movie-page-comment-author-row">
            ${getMovieCommentAuthorAvatarHtml(comment)}
            <div class="movie-page-comment-card-meta">
              ${comment.is_deleted ? '<div class="movie-page-comment-author">Удалённый комментарий</div>' : getMovieCommentAuthorNameHtml(comment, authorName)}
              ${
                commentDate
                  ? `<div class="movie-page-comment-date">${escapeHtml(commentDate)}</div>`
                  : ''
              }
            </div>
          </div>
          ${getMovieCommentActionsHtml(comment)}
        </div>

        ${getMovieCommentReviewContextHtml(comment)}

        ${
          isEditing
            ? getMovieCommentFormHtml({
                movie,
                comment,
                submitLabel: 'Сохранить',
                isInline: true,
                placeholder: 'Редактирование комментария'
              })
            : getMovieCommentBodyHtml(comment)
        }

        ${isEditing ? '' : getMovieCommentFooterHtml(comment, movie, comments)}
      </div>

      ${
        childComments.length > 0 && isThreadExpanded
          ? `
            <div class="movie-page-comment-children">
              ${childComments.map(childComment => getMovieCommentCardHtml(childComment, movie, comments)).join('')}
            </div>
          `
          : ''
      }
    </article>
  `;
}

function getMoviePageReviewFooterHtml(review, {
  isEditing,
  isSpoilerReview,
  isExpandedSpoiler,
  isExpandedText,
  isLongReview
}) {
  if (isEditing) {
    return '';
  }

  const shouldShowTextToggle = isLongReview && (!isSpoilerReview || isExpandedSpoiler);
  const textToggleHtml = shouldShowTextToggle
    ? `
      <button
        type="button"
        class="secondary-button secondary-button-compact"
        data-movie-review-toggle-text="${review.id}"
      >
        ${isExpandedText ? 'Свернуть' : 'Читать дальше'}
      </button>
    `
    : '';
  const canReplyToReview = canCurrentUserReplyToMovieReview(review);
  const reviewReplyHtml = currentUser
    ? `
      <button
        type="button"
        class="secondary-button secondary-button-compact movie-page-comment-reply-button${canReplyToReview ? '' : ' is-disabled'}"
        data-movie-comment-reply-review="${escapeHtml(String(review.id))}"
        data-movie-comment-reply-review-disabled="${canReplyToReview ? 'false' : 'true'}"
        aria-disabled="${canReplyToReview ? 'false' : 'true'}"
        title="${canReplyToReview ? 'Ответить на рецензию' : 'Ответить на рецензию можно после оценки фильма'}"
      >
        Ответить
      </button>
    `
    : '';
  const footerStartHtml = [
    textToggleHtml,
    reviewReplyHtml
  ].filter(Boolean).join('');
  let likeHtml = '';

  if (!areMovieReviewLikesAvailable && !footerStartHtml) {
    return '';
  }

  if (!areMovieReviewLikesAvailable) {
    return `
      <div class="movie-page-review-footer">
        <div class="movie-page-review-footer-start">
          ${footerStartHtml}
        </div>
      </div>
    `;
  }

  const likesCount = getMovieReviewLikeCount(review);
  const isLiked = isMovieReviewLikedByCurrentUser(review);
  const isOwnReview = Boolean(currentUser?.id && String(review.user_id) === String(currentUser.id));
  const isBusy = reviewLikeRequestInFlight.has(String(review.id));
  const countLabel = `${likesCount}`;
  const likeTitle = isOwnReview
    ? 'Нельзя лайкать собственную рецензию'
    : isLiked
      ? 'Убрать лайк'
      : 'Поставить лайк';

  if (isOwnReview) {
    likeHtml = `
        <div
          class="movie-page-discussion-like movie-page-review-like movie-page-review-like-static"
          title="${escapeHtml(likeTitle)}"
          aria-label="Лайков: ${escapeHtml(countLabel)}"
          aria-disabled="true"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"></path>
          </svg>
          <span>${escapeHtml(countLabel)}</span>
        </div>
    `;
  } else {
    likeHtml = `
      <button
        type="button"
        class="movie-page-discussion-like movie-page-review-like ${isLiked ? 'is-liked' : ''} ${isBusy ? 'is-busy' : ''}"
        data-movie-review-like="${escapeHtml(String(review.id))}"
        aria-pressed="${isLiked ? 'true' : 'false'}"
        aria-label="${escapeHtml(`${likeTitle}. Лайков: ${countLabel}`)}"
        title="${escapeHtml(likeTitle)}"
        ${isBusy ? 'disabled' : ''}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"></path>
        </svg>
        <span>${escapeHtml(countLabel)}</span>
      </button>
    `;
  }

  return `
    <div class="movie-page-review-footer">
      ${
        footerStartHtml
          ? `<div class="movie-page-review-footer-start">${footerStartHtml}</div>`
          : ''
      }
      <div class="movie-page-review-footer-end">
        ${likeHtml}
      </div>
    </div>
  `;
}

function getMoviePageReviewCardHtml(review) {
  const authorName = getMovieReviewAuthorName(review);
  const reviewDate = formatMovieReviewDate(review.updated_at || review.created_at);
  const userRating = getMovieReviewUserRating(review.movie_id, review.user_id);
  const userRatingHtml = Number.isFinite(userRating) && userRating > 0
    ? `<div class="movie-page-review-user-rating">Оценка: ${userRating}/10 <span class="movie-page-review-user-rating-star">★</span></div>`
    : '';
  const isCurrentUserReview = Boolean(currentUser) && String(review.user_id) === String(currentUser.id);
  const isSpoilerReview = Boolean(review.contains_spoilers || review.contains_profanity);
  const isExpandedSpoiler = isMovieReviewExpanded(review.id);
  const isExpandedText = isMovieReviewTextExpanded(review.id);
  const isLongReview = isMovieReviewLong(review.review_text);
  const isEditing = isMovieReviewEditing(review.id);

  return `
    <article class="movie-page-review-card" id="${escapeHtml(getMovieReviewAnchorId(review.id))}" data-movie-review-id="${review.id}">
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

      ${getMoviePageReviewFooterHtml(review, {
        isEditing,
        isSpoilerReview,
        isExpandedSpoiler,
        isExpandedText,
        isLongReview
      })}
    </article>
  `;
}

function getMoviePageSectionTitleHtml(titleId, title, count = null) {
  const hasCount = count !== null && count !== undefined && Number.isFinite(Number(count));

  return `
    <h2 id="${escapeHtml(titleId)}" class="movie-page-subtitle movie-page-section-title">
      <span>${escapeHtml(title)}</span>
      ${hasCount ? `<span class="movie-page-section-count">(${Number(count)})</span>` : ''}
    </h2>
  `;
}

function getMoviePageReviewRailHtml(reviews) {
  return `
    <div class="movie-page-review-rail-shell" data-movie-page-review-rail-shell="true">
      <button
        class="user-page-rail-button user-page-rail-button-prev movie-page-review-rail-button movie-page-review-rail-button-prev"
        type="button"
        data-movie-page-review-rail-prev="true"
        aria-label="Прокрутить рецензии назад"
        hidden
      >
        <span class="user-page-rail-button-icon" aria-hidden="true"></span>
      </button>
      <div class="movie-page-reviews-list movie-page-review-rail" data-movie-page-review-rail="true" tabindex="0">
        ${reviews.map(review => getMoviePageReviewCardHtml(review)).join('')}
      </div>
      <button
        class="user-page-rail-button user-page-rail-button-next movie-page-review-rail-button movie-page-review-rail-button-next"
        type="button"
        data-movie-page-review-rail-next="true"
        aria-label="Прокрутить рецензии вперёд"
        hidden
      >
        <span class="user-page-rail-button-icon" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function getMoviePageReviewsSectionHtml(movie, { isLoading = false } = {}) {
  const reviews = sortMovieReviewsForDisplay(getMovieReviews(movie.id));

  return `
  <section class="movie-page-reviews-block" aria-labelledby="moviePageReviewsTitle" data-movie-page-reviews-section="true">
  ${getMoviePageSectionTitleHtml('moviePageReviewsTitle', 'Рецензии', isLoading ? null : reviews.length)}

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
            ${getMoviePageReviewRailHtml(reviews)}
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

function getMoviePageCommentComposerHtml(movie) {
  if (!currentUser) {
    return `
      <div class="movie-page-comment-gate">
        <div class="movie-page-comment-gate-text">Войдите, чтобы оставить комментарий.</div>
      </div>
    `;
  }

  return `
    <section class="movie-page-comment-form-block movie-page-collapsible-composer" data-movie-comment-composer="true">
      <button
        type="button"
        class="secondary-button movie-page-composer-open-button"
        data-movie-comment-composer-open="true"
        aria-expanded="${isMovieCommentComposerExpanded ? 'true' : 'false'}"
        ${isMovieCommentComposerExpanded ? 'hidden' : ''}
      >
        Написать комментарий
      </button>

      <div
        class="movie-page-composer-panel"
        data-movie-comment-composer-panel="true"
        ${isMovieCommentComposerExpanded ? '' : 'hidden'}
      >
        <div class="movie-page-composer-header">
          <div class="movie-page-subtitle">Написать комментарий</div>
          <button
            type="button"
            class="secondary-button secondary-button-compact movie-page-composer-collapse-button"
            data-movie-comment-composer-close="true"
          >
            Свернуть
          </button>
        </div>

        ${getMovieCommentFormHtml({
          movie,
          submitLabel: 'Опубликовать',
          placeholder: 'Ваш комментарий'
        })}
      </div>
    </section>
  `;
}

function getMoviePageReviewReplyComposerHtml(movie) {
  if (!currentUser || !replyingMovieCommentTargetKey.startsWith('review:')) {
    return '';
  }

  const reviewId = replyingMovieCommentTargetKey.split(':')[1] || '';
  const review = getMovieReviewById(reviewId);

  if (!review || String(review.movie_id || '') !== String(movie?.id || '')) {
    return '';
  }

  const reviewAuthorName = getMovieReviewAuthorName(review);

  return `
    <section class="movie-page-comment-form-block movie-page-comment-review-reply-composer" data-movie-comment-review-reply-composer="true">
      <div class="movie-page-comment-reply-context">
        Ответ на рецензию ${escapeHtml(reviewAuthorName)}
      </div>
      ${getMovieCommentFormHtml({
        movie,
        rootReviewId: review.id,
        depth: 0,
        submitLabel: 'Ответить',
        isInline: true,
        placeholder: 'Ответ на рецензию'
      })}
    </section>
  `;
}

function getMoviePageCommentsSectionHtml(movie, { isLoading = false } = {}) {
  const comments = getTopLevelMovieComments(movie.id);
  const commentCount = getMovieComments(movie.id).filter(comment => !comment.is_deleted).length;

  return `
    <section class="movie-page-comments-block" aria-labelledby="moviePageCommentsTitle" data-movie-page-comments-section="true">
      ${getMoviePageSectionTitleHtml('moviePageCommentsTitle', 'Комментарии', isLoading ? null : commentCount)}

      ${isLoading || !areMovieCommentsAvailable ? '' : getMoviePageCommentComposerHtml(movie)}
      ${isLoading || !areMovieCommentsAvailable ? '' : getMoviePageReviewReplyComposerHtml(movie)}

      ${
        isLoading
          ? `
            <div class="movie-page-comment-empty-state">
              Загружаю комментарии...
            </div>
          `
          : !areMovieCommentsAvailable
            ? `
              <div class="movie-page-comment-empty-state">
                Комментарии пока недоступны.
              </div>
            `
            : comments.length > 0
              ? `
                <div class="movie-page-comment-list">
                  ${comments.map(comment => getMovieCommentCardHtml(comment, movie, allMovieComments)).join('')}
                </div>
              `
              : `
                <div class="movie-page-comment-empty-state">
                  Пока нет ни одного комментария.
                </div>
              `
      }
    </section>
  `;
}

function getMoviePageSimilarSectionHtml(similarMovies, movie = currentMoviePageMovieData) {
  const hasSimilarMovies = Array.isArray(similarMovies) && similarMovies.length > 0;
  const editorHtml = getMoviePageSimilarEditorHtml(movie);

  if (!hasSimilarMovies && !editorHtml) {
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

function getMoviePageSimilarIdsAfterMove(movieId, direction) {
  const normalizedMovieId = String(movieId || '');
  const currentIndex = currentMoviePageSimilarMovieIds.indexOf(normalizedMovieId);
  const nextIndex = currentIndex + Number(direction || 0);

  if (
    currentIndex < 0 ||
    nextIndex < 0 ||
    nextIndex >= currentMoviePageSimilarMovieIds.length
  ) {
    return currentMoviePageSimilarMovieIds;
  }

  const nextMovieIds = currentMoviePageSimilarMovieIds.slice();
  const [movedMovieId] = nextMovieIds.splice(currentIndex, 1);

  nextMovieIds.splice(nextIndex, 0, movedMovieId);
  return nextMovieIds;
}

function getMoviePageSimilarIdsAfterDrop(sourceMovieId, targetMovieId, shouldPlaceAfter = false) {
  const sourceId = String(sourceMovieId || '');
  const targetId = String(targetMovieId || '');

  if (!sourceId || !targetId || sourceId === targetId) {
    return currentMoviePageSimilarMovieIds;
  }

  const nextMovieIds = currentMoviePageSimilarMovieIds.filter(movieId => String(movieId) !== sourceId);
  const targetIndex = nextMovieIds.indexOf(targetId);

  if (targetIndex < 0) {
    return currentMoviePageSimilarMovieIds;
  }

  nextMovieIds.splice(targetIndex + (shouldPlaceAfter ? 1 : 0), 0, sourceId);
  return nextMovieIds;
}

function focusMoviePageSimilarSearch(selectionStart = null) {
  requestAnimationFrame(() => {
    const searchInputElement = moviePage?.querySelector('[data-movie-page-similar-search="true"]');

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

async function saveMoviePageSimilarEditorIds(nextMovieIds, successMessage = 'Похожие фильмы сохранены.') {
  const movie = currentMoviePageMovieData;
  const movieId = String(movie?.id || '');

  if (!isAdmin || !movieId || isMoviePageSimilarEditorSaving) {
    return;
  }

  const normalizedMovieIds = normalizeManualSimilarMovieIds(nextMovieIds, movieId);
  const previousMovieIds = currentMoviePageSimilarMovieIds.slice();
  const previousMovies = currentMoviePageSimilarMovies.slice();

  currentMoviePageSimilarMovieIds = normalizedMovieIds;
  currentMoviePageSimilarMovies = normalizedMovieIds
    .map(similarMovieId => getCatalogMovieById(similarMovieId))
    .filter(Boolean);
  isMoviePageSimilarEditorSaving = true;
  setMoviePageSimilarEditorStatus('Сохраняю похожие фильмы...');
  renderMoviePageSimilarSection(movieId);

  try {
    await replaceManualSimilarMovies(movieId, normalizedMovieIds);

    currentMoviePageSimilarMovieIds = getManualSimilarMovieIds(movieId);
    currentMoviePageSimilarMovies = await fetchCatalogMoviesByIds(currentMoviePageSimilarMovieIds);
    moviePageSimilarEditorSearchQuery = '';
    setMoviePageSimilarEditorStatus(successMessage, 'success');
  } catch (error) {
    console.error('Ошибка сохранения похожих на деталке:', error);
    currentMoviePageSimilarMovieIds = previousMovieIds;
    currentMoviePageSimilarMovies = previousMovies;
    setMoviePageSimilarEditorStatus(
      error?.message || 'Не удалось сохранить похожие фильмы.',
      'error'
    );
  } finally {
    isMoviePageSimilarEditorSaving = false;
    moviePageSimilarEditorDraggedMovieId = null;
    renderMoviePageSimilarSection(movieId);
  }
}

function handleMoviePageSimilarSearchInput(event, movie) {
  const searchInputElement = event.currentTarget;
  const selectionStart = searchInputElement.selectionStart;

  moviePageSimilarEditorSearchQuery = searchInputElement.value;
  setMoviePageSimilarEditorStatus();
  renderMoviePageSimilarSection(movie.id);
  focusMoviePageSimilarSearch(selectionStart);
}

function handleMoviePageSimilarEditorClick(event) {
  const addButton = event.target.closest('[data-movie-page-similar-add]');
  const removeButton = event.target.closest('[data-movie-page-similar-remove]');
  const moveButton = event.target.closest('[data-movie-page-similar-move]');

  if (addButton) {
    saveMoviePageSimilarEditorIds(
      [...currentMoviePageSimilarMovieIds, addButton.dataset.moviePageSimilarAdd],
      'Похожий фильм добавлен.'
    );
    return;
  }

  if (removeButton) {
    const movieId = removeButton.dataset.moviePageSimilarRemove;

    saveMoviePageSimilarEditorIds(
      currentMoviePageSimilarMovieIds.filter(similarMovieId => String(similarMovieId) !== String(movieId)),
      'Похожий фильм убран.'
    );
    return;
  }

  if (moveButton) {
    saveMoviePageSimilarEditorIds(
      getMoviePageSimilarIdsAfterMove(
        moveButton.dataset.moviePageSimilarMove,
        Number(moveButton.dataset.moviePageSimilarDirection || 0)
      ),
      'Порядок похожих обновлён.'
    );
  }
}

function handleMoviePageSimilarDragStart(event) {
  const item = event.target.closest('[data-movie-page-similar-editor-item]');

  if (!item || isMoviePageSimilarEditorSaving) {
    event.preventDefault();
    return;
  }

  moviePageSimilarEditorDraggedMovieId = item.dataset.moviePageSimilarEditorItem;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', moviePageSimilarEditorDraggedMovieId);
  item.classList.add('is-dragging');
}

function handleMoviePageSimilarDragEnd(event) {
  event.target
    .closest('[data-movie-page-similar-editor-item]')
    ?.classList.remove('is-dragging');
  moviePageSimilarEditorDraggedMovieId = null;
}

function handleMoviePageSimilarDragOver(event) {
  if (!moviePageSimilarEditorDraggedMovieId) {
    return;
  }

  const item = event.target.closest('[data-movie-page-similar-editor-item]');

  if (!item) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function handleMoviePageSimilarDrop(event) {
  const targetItem = event.target.closest('[data-movie-page-similar-editor-item]');
  const sourceMovieId = moviePageSimilarEditorDraggedMovieId ||
    event.dataTransfer.getData('text/plain');
  const targetMovieId = targetItem?.dataset.moviePageSimilarEditorItem;

  if (!sourceMovieId || !targetMovieId || sourceMovieId === targetMovieId) {
    return;
  }

  event.preventDefault();

  const targetRect = targetItem.getBoundingClientRect();
  const shouldPlaceAfter = event.clientY > targetRect.top + (targetRect.height / 2);

  saveMoviePageSimilarEditorIds(
    getMoviePageSimilarIdsAfterDrop(sourceMovieId, targetMovieId, shouldPlaceAfter),
    'Порядок похожих обновлён.'
  );
}

function bindMoviePageSimilarEditorEvents(movie) {
  const editor = moviePage?.querySelector('[data-movie-page-similar-editor="true"]');

  if (!editor || !movie?.id) {
    return;
  }

  editor
    .querySelector('[data-movie-page-similar-search="true"]')
    ?.addEventListener('input', event => {
      handleMoviePageSimilarSearchInput(event, movie);
    });

  editor.addEventListener('click', handleMoviePageSimilarEditorClick);
  editor.addEventListener('dragstart', handleMoviePageSimilarDragStart);
  editor.addEventListener('dragend', handleMoviePageSimilarDragEnd);
  editor.addEventListener('dragover', handleMoviePageSimilarDragOver);
  editor.addEventListener('drop', handleMoviePageSimilarDrop);
}

function setMovieReviewFormMessage(formElement, message = '', type = '') {
  const messageElement = formElement?.querySelector('[data-movie-review-form-message="true"]');

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.classList.remove('is-error', 'is-success');

  if (type) {
    messageElement.classList.add(`is-${type}`);
  }
}

function updateMovieReviewFormState(formElement, { shouldClearMessage = false } = {}) {
  const textareaElement = formElement?.querySelector('[data-movie-review-textarea="true"]');
  const submitButtonElement = formElement?.querySelector('[data-movie-review-submit="true"]');
  const lengthElement = formElement?.querySelector('[data-movie-review-length="true"]');
  const reviewText = textareaElement?.value || '';
  const reviewTextLength = getMovieReviewTextLength(reviewText);
  const validationMessage = getMovieReviewValidationMessage(reviewText);

  if (lengthElement) {
    lengthElement.textContent = String(reviewTextLength);
    lengthElement.classList.toggle('is-valid', !validationMessage);
    lengthElement.classList.toggle('is-invalid', Boolean(validationMessage));
  }

  if (submitButtonElement) {
    submitButtonElement.disabled = Boolean(validationMessage);
  }

  if (shouldClearMessage) {
    setMovieReviewFormMessage(formElement);
  }

  return {
    isValid: !validationMessage,
    validationMessage,
    reviewTextLength
  };
}

function setMovieReviewFormSubmitting(formElement, isSubmitting) {
  const textareaElement = formElement?.querySelector('[data-movie-review-textarea="true"]');
  const spoilersCheckbox = formElement?.querySelector('[data-movie-review-spoilers="true"]');
  const profanityCheckbox = formElement?.querySelector('[data-movie-review-profanity="true"]');
  const submitButtonElement = formElement?.querySelector('[data-movie-review-submit="true"]');
  const deleteButtonElement = formElement?.querySelector('[data-movie-review-delete]');
  const cancelEditButtonElement = formElement?.querySelector('[data-movie-review-cancel-edit="true"]');

  [
    textareaElement,
    spoilersCheckbox,
    profanityCheckbox,
    deleteButtonElement,
    cancelEditButtonElement
  ].forEach(element => {
    if (element) {
      element.disabled = isSubmitting;
    }
  });

  if (submitButtonElement) {
    submitButtonElement.disabled = isSubmitting;
  }

  if (!isSubmitting) {
    updateMovieReviewFormState(formElement);
  }
}

async function handleMovieReviewFormSubmit(movie, formElement) {
  if (!formElement || reviewRequestInFlight.has(String(movie.id))) {
    return;
  }

  const textareaElement = formElement.querySelector('[data-movie-review-textarea="true"]');
  const spoilersCheckbox = formElement.querySelector('[data-movie-review-spoilers="true"]');
  const profanityCheckbox = formElement.querySelector('[data-movie-review-profanity="true"]');
  const validationState = updateMovieReviewFormState(formElement);

  if (!validationState.isValid) {
    setMovieReviewFormMessage(formElement, validationState.validationMessage, 'error');
    textareaElement?.focus();
    return;
  }

  let didSaveReview = false;

  try {
    reviewRequestInFlight.add(String(movie.id));
    setMovieReviewFormSubmitting(formElement, true);
    setMovieReviewFormMessage(formElement, 'Сохраняю...');

    const reviewPayload = {
      reviewText: textareaElement?.value || '',
      containsSpoilers: Boolean(spoilersCheckbox?.checked),
      containsProfanity: Boolean(profanityCheckbox?.checked)
    };
    const reviewId = String(formElement.dataset.movieReviewId || '').trim();

    if (reviewId) {
      await updateMovieReview(reviewId, movie.id, reviewPayload);
    } else {
      await saveMovieReview(movie.id, reviewPayload);
      isMovieReviewComposerExpanded = false;
    }

    stopMovieReviewEditing();
    didSaveReview = true;
    setMovieReviewFormMessage(formElement, 'Рецензия сохранена.', 'success');
    renderMoviePageSocialSections(movie);
  } catch (error) {
    console.error('Ошибка сохранения рецензии:', error);
    setMovieReviewFormMessage(formElement, error?.message || 'Не удалось сохранить рецензию.', 'error');
  } finally {
    reviewRequestInFlight.delete(String(movie.id));

    if (!didSaveReview && formElement.isConnected) {
      setMovieReviewFormSubmitting(formElement, false);
      textareaElement?.focus();
    }
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
      renderMoviePageSocialSections(movie);
    });
  } catch (error) {
    console.error('Ошибка удаления рецензии:', error);
    alert(error?.message || 'Не удалось удалить рецензию.');
  } finally {
    reviewRequestInFlight.delete(String(movie.id));
  }
}

async function handleMovieReviewLikeToggle(movie, reviewId) {
  const review = allMovieReviews.find(item => String(item.id) === String(reviewId));

  if (!review || reviewLikeRequestInFlight.has(String(reviewId))) {
    return;
  }

  if (!currentUser?.id) {
    openAuthModal();
    return;
  }

  if (!canCurrentUserLikeMovieReview(review)) {
    showAppMessage('Нельзя лайкать собственную рецензию.', 'info', true);
    return;
  }

  const shouldLike = !isMovieReviewLikedByCurrentUser(review);

  try {
    reviewLikeRequestInFlight.add(String(reviewId));
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });

    await setMovieReviewLike(review, shouldLike);
    await fetchMovieReviews(movie.id);
  } catch (error) {
    console.error('Ошибка переключения лайка рецензии:', error);

    if (isMovieReviewLikesTableUnavailableError(error)) {
      areMovieReviewLikesAvailable = false;
      showAppMessage('Лайки рецензий пока недоступны: нужно применить SQL для movie_review_likes.', 'error', true);
    } else {
      showAppMessage(error?.message || 'Не удалось обновить лайк рецензии.', 'error', true);
    }
  } finally {
    reviewLikeRequestInFlight.delete(String(reviewId));
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
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

function getMoviePageReviewRailScrollStep(rail) {
  return Math.max(rail.clientWidth * MOVIE_REVIEW_RAIL_SCROLL_STEP_RATIO, 220);
}

function getMoviePageReviewRailState(rail) {
  const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  const scrollLeft = Math.max(0, rail.scrollLeft);
  const tolerance = 2;

  return {
    canScrollPrev: scrollLeft > tolerance,
    canScrollNext: scrollLeft < maxScrollLeft - tolerance
  };
}

function updateMoviePageReviewRailControls(shell) {
  const rail = shell?.querySelector('[data-movie-page-review-rail="true"]');
  const prevButton = shell?.querySelector('[data-movie-page-review-rail-prev="true"]');
  const nextButton = shell?.querySelector('[data-movie-page-review-rail-next="true"]');

  if (!rail || !prevButton || !nextButton) {
    return;
  }

  const { canScrollPrev, canScrollNext } = getMoviePageReviewRailState(rail);

  prevButton.hidden = !canScrollPrev;
  nextButton.hidden = !canScrollNext;
}

function syncMoviePageReviewRailControls() {
  moviePage
    ?.querySelectorAll('[data-movie-page-review-rail-shell="true"]')
    .forEach(updateMoviePageReviewRailControls);
}

function scheduleMoviePageReviewRailControlsSync() {
  requestAnimationFrame(() => {
    syncMoviePageReviewRailControls();
    requestAnimationFrame(syncMoviePageReviewRailControls);
  });

  window.setTimeout(syncMoviePageReviewRailControls, 120);
  window.setTimeout(syncMoviePageReviewRailControls, 360);
}

function highlightMoviePageReviewCard(reviewCard) {
  if (!reviewCard) {
    return;
  }

  const currentTimer = movieReviewHighlightTimers.get(reviewCard);

  if (currentTimer) {
    window.clearTimeout(currentTimer);
  }

  reviewCard.classList.remove('is-review-highlighted');
  void reviewCard.offsetWidth;
  reviewCard.classList.add('is-review-highlighted');

  const nextTimer = window.setTimeout(() => {
    reviewCard.classList.remove('is-review-highlighted');
    movieReviewHighlightTimers.delete(reviewCard);
  }, 1200);

  movieReviewHighlightTimers.set(reviewCard, nextTimer);
}

function focusMoviePageReviewCard(reviewId, { shouldUpdateHash = true } = {}) {
  const normalizedReviewId = String(reviewId || '');

  if (!normalizedReviewId) {
    return;
  }

  const reviewCard = [...(moviePage?.querySelectorAll('[data-movie-review-id]') || [])]
    .find(card => String(card.dataset.movieReviewId || '') === normalizedReviewId);

  if (!reviewCard) {
    return;
  }

  const reviewsSection = reviewCard.closest('[data-movie-page-reviews-section="true"]');
  const rail = reviewCard.closest('[data-movie-page-review-rail="true"]');

  reviewsSection?.scrollIntoView({
    block: 'start',
    behavior: 'smooth'
  });

  if (rail) {
    const railRect = rail.getBoundingClientRect();
    const cardRect = reviewCard.getBoundingClientRect();
    const targetScrollLeft = Math.max(0, rail.scrollLeft + cardRect.left - railRect.left);

    rail.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });

    window.setTimeout(() => {
      updateMoviePageReviewRailControls(rail.closest('[data-movie-page-review-rail-shell="true"]'));
    }, 380);
  }

  highlightMoviePageReviewCard(reviewCard);

  if (shouldUpdateHash) {
    const anchorId = getMovieReviewAnchorId(normalizedReviewId);
    const nextUrl = `${window.location.pathname}${window.location.search}#${anchorId}`;

    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
      window.history.pushState(null, '', nextUrl);
    }
  }
}

function expandMovieCommentAncestors(commentId) {
  let comment = getMovieCommentById(commentId);
  let didExpand = false;

  while (comment?.parent_comment_id) {
    const parentComment = getMovieCommentById(comment.parent_comment_id);

    if (!parentComment?.id) {
      break;
    }

    if (!isMovieCommentThreadExpanded('comment', parentComment.id)) {
      setMovieCommentThreadExpandedState('comment', parentComment.id, true);
      didExpand = true;
    }

    comment = parentComment;
  }

  return didExpand;
}

function highlightMoviePageCommentCard(commentCard) {
  if (!commentCard) {
    return;
  }

  commentCard.classList.remove('is-comment-highlighted');
  void commentCard.offsetWidth;
  commentCard.classList.add('is-comment-highlighted');

  window.setTimeout(() => {
    commentCard.classList.remove('is-comment-highlighted');
  }, 1200);
}

function focusMoviePageCommentCard(commentId, { shouldUpdateHash = true } = {}) {
  const normalizedCommentId = String(commentId || '');

  if (!normalizedCommentId || !currentMoviePageMovieData) {
    return;
  }

  const didExpandAncestors = expandMovieCommentAncestors(normalizedCommentId);

  if (didExpandAncestors) {
    renderMoviePageCommentsSection(currentMoviePageMovieData);
  }

  const commentCard = moviePage?.querySelector(`[data-movie-comment-id="${CSS.escape(normalizedCommentId)}"]`);

  if (!commentCard) {
    return;
  }

  commentCard.scrollIntoView({
    block: 'center',
    behavior: 'smooth'
  });
  highlightMoviePageCommentCard(commentCard);

  if (shouldUpdateHash) {
    const anchorId = getMovieCommentAnchorId(normalizedCommentId);
    const nextUrl = `${window.location.pathname}${window.location.search}#${anchorId}`;

    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
      window.history.pushState(null, '', nextUrl);
    }
  }
}

function focusMoviePageHashTarget() {
  const anchorId = decodeURIComponent(String(window.location.hash || '').replace(/^#/, ''));

  if (!anchorId || !moviePage) {
    return;
  }

  if (anchorId.startsWith('movie-review-')) {
    focusMoviePageReviewCard(anchorId.replace(/^movie-review-/, ''), { shouldUpdateHash: false });
    return;
  }

  if (anchorId.startsWith('movie-comment-')) {
    focusMoviePageCommentCard(anchorId.replace(/^movie-comment-/, ''), { shouldUpdateHash: false });
  }
}

function bindMoviePageReviewRailControls() {
  moviePage
    ?.querySelectorAll('[data-movie-page-review-rail-shell="true"]')
    .forEach(shell => {
      const rail = shell.querySelector('[data-movie-page-review-rail="true"]');

      if (rail && rail.dataset.moviePageReviewRailBound !== 'true') {
        rail.dataset.moviePageReviewRailBound = 'true';
        rail.addEventListener('scroll', () => updateMoviePageReviewRailControls(shell), { passive: true });
      }

      if (
        rail &&
        typeof ResizeObserver !== 'undefined' &&
        rail.dataset.moviePageReviewRailResizeBound !== 'true'
      ) {
        rail.dataset.moviePageReviewRailResizeBound = 'true';
        const resizeObserver = new ResizeObserver(() => updateMoviePageReviewRailControls(shell));

        resizeObserver.observe(rail);
        resizeObserver.observe(shell);
        movieReviewRailResizeObservers.set(rail, resizeObserver);
      }

      shell
        .querySelectorAll('[data-movie-page-review-rail-prev="true"], [data-movie-page-review-rail-next="true"]')
        .forEach(button => {
          if (button.dataset.moviePageReviewRailButtonBound === 'true') {
            return;
          }

          button.dataset.moviePageReviewRailButtonBound = 'true';
          button.addEventListener('click', () => {
            if (!rail) {
              return;
            }

            const direction = button.matches('[data-movie-page-review-rail-next="true"]') ? 1 : -1;

            rail.scrollBy({
              left: getMoviePageReviewRailScrollStep(rail) * direction,
              behavior: 'smooth'
            });

            requestAnimationFrame(() => updateMoviePageReviewRailControls(shell));
          });
        });
    });

  scheduleMoviePageReviewRailControlsSync();
}

function getMoviePageReviewRailSnapshot(reviewId = '') {
  const rail = moviePage?.querySelector('[data-movie-page-review-rail="true"]');

  if (!rail) {
    return null;
  }

  return {
    scrollLeft: rail.scrollLeft,
    reviewId: String(reviewId || '')
  };
}

function restoreMoviePageReviewRailSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }

  requestAnimationFrame(() => {
    const rail = moviePage?.querySelector('[data-movie-page-review-rail="true"]');

    if (!rail) {
      return;
    }

    rail.scrollLeft = snapshot.scrollLeft || 0;

    if (snapshot.reviewId) {
      const reviewCard = [...rail.querySelectorAll('[data-movie-review-id]')]
        .find(card => String(card.dataset.movieReviewId || '') === snapshot.reviewId);

      reviewCard?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'auto'
      });
    }

    updateMoviePageReviewRailControls(rail.closest('[data-movie-page-review-rail-shell="true"]'));
  });
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

  bindMoviePageReviewRailControls();

  bindMoviePageReviewClickAction('[data-movie-review-composer-open="true"]', () => {
    setMoviePageReviewComposerExpanded(true);
  });

  bindMoviePageReviewClickAction('[data-movie-review-composer-close="true"]', () => {
    setMoviePageReviewComposerExpanded(false);
  });

  moviePage.querySelectorAll('[data-movie-review-form="true"]').forEach(reviewForm => {
    updateMovieReviewFormState(reviewForm);

    reviewForm.addEventListener('input', event => {
      if (event.target?.matches?.('[data-movie-review-textarea="true"]')) {
        updateMovieReviewFormState(reviewForm, { shouldClearMessage: true });
      }
    });

    reviewForm.addEventListener('submit', event => {
      event.preventDefault();
      handleMovieReviewFormSubmit(movie, reviewForm);
    });
  });

  bindMoviePageReviewClickAction('[data-movie-review-delete]', button => {
    handleMovieReviewDelete(movie, button.dataset.movieReviewDelete);
  });

  bindMoviePageReviewClickAction('[data-movie-review-edit]', button => {
    const reviewId = button.dataset.movieReviewEdit;

    startMovieReviewEditing(reviewId);
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
  });

  bindMoviePageReviewClickAction('[data-movie-review-cancel-edit="true"]', button => {
    const reviewId = button.closest('[data-movie-review-id]')?.dataset.movieReviewId || '';

    stopMovieReviewEditing();
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
  });

  bindMoviePageReviewClickAction('[data-movie-review-show-spoilers]', button => {
    const reviewId = button.dataset.movieReviewShowSpoilers;

    setMovieReviewExpandedState(reviewId, true);
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
  });

  bindMoviePageReviewClickAction('[data-movie-review-toggle-text]', button => {
    const reviewId = button.dataset.movieReviewToggleText;
    const shouldExpand = !isMovieReviewTextExpanded(reviewId);

    setMovieReviewTextExpandedState(reviewId, shouldExpand);
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
  });

  bindMoviePageReviewClickAction('[data-movie-review-like]', button => {
    handleMovieReviewLikeToggle(movie, button.dataset.movieReviewLike);
  });
}

function setMovieCommentFormMessage(formElement, message = '', type = '') {
  const messageElement = formElement?.querySelector('[data-movie-comment-form-message="true"]');

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.classList.remove('is-error', 'is-success');

  if (type) {
    messageElement.classList.add(`is-${type}`);
  }
}

function updateMovieCommentFormState(formElement, { shouldClearMessage = false } = {}) {
  const textareaElement = formElement?.querySelector('[data-movie-comment-textarea="true"]');
  const submitButtonElement = formElement?.querySelector('[data-movie-comment-submit="true"]');
  const lengthElement = formElement?.querySelector('[data-movie-comment-length="true"]');
  const commentText = textareaElement?.value || '';
  const commentTextLength = getMovieCommentTextLength(commentText);
  const validationMessage = getMovieCommentValidationMessage(commentText);

  if (lengthElement) {
    lengthElement.textContent = String(commentTextLength);
    lengthElement.classList.toggle('is-valid', !validationMessage);
    lengthElement.classList.toggle('is-invalid', Boolean(validationMessage));
  }

  if (submitButtonElement) {
    submitButtonElement.disabled = Boolean(validationMessage);
  }

  if (shouldClearMessage) {
    setMovieCommentFormMessage(formElement);
  }

  return {
    isValid: !validationMessage,
    validationMessage,
    commentTextLength
  };
}

function setMovieCommentFormSubmitting(formElement, isSubmitting) {
  const textareaElement = formElement?.querySelector('[data-movie-comment-textarea="true"]');
  const spoilersCheckbox = formElement?.querySelector('[data-movie-comment-spoilers="true"]');
  const profanityCheckbox = formElement?.querySelector('[data-movie-comment-profanity="true"]');
  const submitButtonElement = formElement?.querySelector('[data-movie-comment-submit="true"]');
  const cancelButtonElement = formElement?.querySelector('[data-movie-comment-cancel="true"]');

  [
    textareaElement,
    spoilersCheckbox,
    profanityCheckbox,
    cancelButtonElement
  ].forEach(element => {
    if (element) {
      element.disabled = isSubmitting;
    }
  });

  if (submitButtonElement) {
    submitButtonElement.disabled = isSubmitting;
  }

  if (!isSubmitting) {
    updateMovieCommentFormState(formElement);
  }
}

function renderMoviePageSocialSections(movie) {
  renderMoviePageReviewsSection(movie);
  renderMoviePageCommentsSection(movie);
}

async function handleMovieCommentFormSubmit(movie, formElement) {
  if (!formElement || movieCommentRequestInFlight.has(String(movie.id))) {
    return;
  }

  const textareaElement = formElement.querySelector('[data-movie-comment-textarea="true"]');
  const spoilersCheckbox = formElement.querySelector('[data-movie-comment-spoilers="true"]');
  const profanityCheckbox = formElement.querySelector('[data-movie-comment-profanity="true"]');
  const validationState = updateMovieCommentFormState(formElement);

  if (!validationState.isValid) {
    setMovieCommentFormMessage(formElement, validationState.validationMessage, 'error');
    textareaElement?.focus();
    return;
  }

  const commentId = String(formElement.dataset.movieCommentId || '').trim();
  const isMainCommentComposer = Boolean(
    !commentId &&
    !formElement.dataset.movieCommentParentId &&
    !formElement.dataset.movieCommentReplyToId &&
    !formElement.dataset.movieCommentRootReviewId
  );
  let didSaveComment = false;

  try {
    movieCommentRequestInFlight.add(String(movie.id));
    setMovieCommentFormSubmitting(formElement, true);
    setMovieCommentFormMessage(formElement, 'Сохраняю...');

    if (commentId) {
      await updateMovieComment(commentId, movie.id, {
        commentText: textareaElement?.value || '',
        containsSpoilers: Boolean(spoilersCheckbox?.checked),
        containsProfanity: Boolean(profanityCheckbox?.checked)
      });
      stopMovieCommentEditing();
    } else {
      await saveMovieComment(movie.id, {
        commentText: textareaElement?.value || '',
        containsSpoilers: Boolean(spoilersCheckbox?.checked),
        containsProfanity: Boolean(profanityCheckbox?.checked),
        parentCommentId: formElement.dataset.movieCommentParentId || '',
        replyToCommentId: formElement.dataset.movieCommentReplyToId || '',
        rootReviewId: formElement.dataset.movieCommentRootReviewId || '',
        depth: Number(formElement.dataset.movieCommentDepth || 0)
      });
      stopMovieCommentReply();

      if (isMainCommentComposer) {
        isMovieCommentComposerExpanded = false;
      }
    }

    didSaveComment = true;
    setMovieCommentFormMessage(formElement, 'Комментарий сохранён.', 'success');
    renderMoviePageSocialSections(movie);
  } catch (error) {
    console.error('Ошибка сохранения комментария:', error);
    setMovieCommentFormMessage(formElement, error?.message || 'Не удалось сохранить комментарий.', 'error');
  } finally {
    movieCommentRequestInFlight.delete(String(movie.id));

    if (!didSaveComment && formElement.isConnected) {
      setMovieCommentFormSubmitting(formElement, false);
      textareaElement?.focus();
    }
  }
}

async function handleMovieCommentDelete(movie, commentId) {
  if (!commentId || movieCommentRequestInFlight.has(String(movie.id))) {
    return;
  }

  try {
    await runConfirmedAction('Удалить комментарий?', async () => {
      movieCommentRequestInFlight.add(String(movie.id));
      stopMovieCommentEditing();
      stopMovieCommentReply();
      await removeMovieComment(commentId, movie.id);
      renderMoviePageSocialSections(movie);
    });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    alert(error?.message || 'Не удалось удалить комментарий.');
  } finally {
    movieCommentRequestInFlight.delete(String(movie.id));
  }
}

async function handleMovieCommentLikeToggle(movie, commentId) {
  const comment = getMovieCommentById(commentId);

  if (!comment || movieCommentLikeRequestInFlight.has(String(commentId))) {
    return;
  }

  if (!currentUser?.id) {
    openAuthModal();
    return;
  }

  if (!canCurrentUserLikeMovieComment(comment)) {
    showAppMessage('Нельзя лайкать собственный или удалённый комментарий.', 'info', true);
    return;
  }

  const shouldLike = !isMovieCommentLikedByCurrentUser(comment);

  try {
    movieCommentLikeRequestInFlight.add(String(commentId));
    renderMoviePageSocialSections(movie);

    await setMovieCommentLike(comment, shouldLike);
    await fetchMovieComments(movie.id);
  } catch (error) {
    console.error('Ошибка переключения лайка комментария:', error);

    if (isMovieCommentLikesTableUnavailableError(error)) {
      areMovieCommentLikesAvailable = false;
      showAppMessage('Лайки комментариев пока недоступны: нужно применить SQL для movie_comment_likes.', 'error', true);
    } else {
      showAppMessage(error?.message || 'Не удалось обновить лайк комментария.', 'error', true);
    }
  } finally {
    movieCommentLikeRequestInFlight.delete(String(commentId));
    renderMoviePageSocialSections(movie);
  }
}

function bindMoviePageCommentClickAction(selector, handler) {
  if (!moviePage) {
    return;
  }

  moviePage.querySelectorAll(selector).forEach(element => {
    element.addEventListener('click', event => {
      handler(element, event);
    });
  });
}

function handleMoviePageCommentReviewAnchorClick(event) {
  const link = event.target?.closest?.('[data-movie-comment-review-anchor]');

  if (!link) {
    return;
  }

  event.preventDefault();
  focusMoviePageReviewCard(link.dataset.movieCommentReviewAnchor);
}

function focusMoviePageReviewReplyComposer() {
  requestAnimationFrame(() => {
    const composer = moviePage?.querySelector('[data-movie-comment-review-reply-composer="true"]');
    const textarea = composer?.querySelector('[data-movie-comment-textarea="true"]');

    composer?.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
    textarea?.focus();
  });
}

function bindMoviePageCommentEvents(movie) {
  if (!moviePage || !movie) {
    return;
  }

  const commentsSection = moviePage.querySelector('[data-movie-page-comments-section="true"]');

  if (commentsSection && commentsSection.dataset.movieCommentReviewAnchorsBound !== 'true') {
    commentsSection.dataset.movieCommentReviewAnchorsBound = 'true';
    commentsSection.addEventListener('click', handleMoviePageCommentReviewAnchorClick);
  }

  bindMoviePageCommentClickAction('[data-movie-comment-composer-open="true"]', () => {
    setMoviePageCommentComposerExpanded(true);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-composer-close="true"]', () => {
    setMoviePageCommentComposerExpanded(false);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-review-anchor]', (link, event) => {
    event.preventDefault();
    focusMoviePageReviewCard(link.dataset.movieCommentReviewAnchor);
  });

  moviePage.querySelectorAll('[data-movie-comment-form="true"]').forEach(commentForm => {
    updateMovieCommentFormState(commentForm);

    commentForm.addEventListener('input', event => {
      if (event.target?.matches?.('[data-movie-comment-textarea="true"]')) {
        updateMovieCommentFormState(commentForm, { shouldClearMessage: true });
      }
    });

    commentForm.addEventListener('submit', event => {
      event.preventDefault();
      handleMovieCommentFormSubmit(movie, commentForm);
    });
  });

  bindMoviePageCommentClickAction('[data-movie-comment-reply]', button => {
    if (!currentUser?.id) {
      openAuthModal();
      return;
    }

    const commentId = button.dataset.movieCommentReply;
    startMovieCommentReply('comment', commentId);
    setMovieCommentThreadExpandedState('comment', commentId, true);
    renderMoviePageSocialSections(movie);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-reply-review]', button => {
    if (button.dataset.movieCommentReplyReviewDisabled === 'true') {
      showAppMessage('Ответить на рецензию можно только после оценки фильма.', 'info', true);
      return;
    }

    if (!currentUser?.id) {
      openAuthModal();
      return;
    }

    const reviewId = button.dataset.movieCommentReplyReview;
    startMovieCommentReply('review', reviewId);
    renderMoviePageSocialSections(movie);
    focusMoviePageReviewReplyComposer();
  });

  bindMoviePageCommentClickAction('[data-movie-comment-cancel="true"]', () => {
    stopMovieCommentEditing();
    stopMovieCommentReply();
    renderMoviePageSocialSections(movie);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-edit]', button => {
    if (button.disabled) {
      return;
    }

    startMovieCommentEditing(button.dataset.movieCommentEdit);
    renderMoviePageSocialSections(movie);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-delete]', button => {
    handleMovieCommentDelete(movie, button.dataset.movieCommentDelete);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-show-spoilers]', button => {
    setMovieCommentSpoilerExpandedState(button.dataset.movieCommentShowSpoilers, true);
    renderMoviePageSocialSections(movie);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-toggle-thread]', button => {
    const [threadType, threadId] = String(button.dataset.movieCommentToggleThread || '').split(':');

    if (!threadType || !threadId) {
      return;
    }

    const shouldExpand = !isMovieCommentThreadExpanded(threadType, threadId);

    setMovieCommentThreadExpandedState(threadType, threadId, shouldExpand);
    renderMoviePageSocialSections(movie);
  });

  bindMoviePageCommentClickAction('[data-movie-comment-like]', button => {
    handleMovieCommentLikeToggle(movie, button.dataset.movieCommentLike);
  });
}

function getMoviePageSubgenreLabel(movie) {
  if (!Array.isArray(movie?.tags_perceived) || movie.tags_perceived.length === 0) {
    return '';
  }

  return formatPublicCommaSeparatedValues(movie.tags_perceived.slice(0, 2));
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

function buildMoviePageViewModel(movie) {
  const genreNames = movie.movie_genres
    .map(item => item.genres.name)
    .filter(Boolean);

  return {
    genres: formatGenreNamesForPublicDisplay(genreNames),
    countries: movie.movie_countries.map(item => item.countries.name).join(', '),
    production: formatTextArrayForDetail(movie.production),
    distribution: formatTextArrayForDetail(movie.distribution),
    russianDistribution: formatTextArrayForDetail(movie.russian_distribution),
    runtimeLabel: formatRuntimeMinutes(movie.runtime_minutes),
    averageRating: getMovieAverageRating(movie.id),
    votesCount: getMovieVotesCount(movie.id),
    currentUserRating: getCurrentUserRating(movie.id),
    userMovieState: getCurrentUserMovieState(movie.id),
    primaryPerceivedTagLabel: getMoviePageSubgenreLabel(movie),
    formatsLabel: getMoviePageFormatsLabel(movie),
    externalLinksHtml: getMoviePageExternalLinksHtml(movie),
    trailerEmbedUrl: getYouTubeTrailerEmbedUrl(movie.trailer_url),
    synopsis: String(movie.synopsis || '').trim(),
    isRatingBusy: ratingRequestInFlight.has(String(movie.id)),
    isWatchlistBusy: watchlistRequestInFlight.has(String(movie.id)),
    reviewsSectionHtml: getMoviePageReviewsSectionHtml(movie),
    commentsSectionHtml: getMoviePageCommentsSectionHtml(movie)
  };
}

function getMoviePagePosterGalleryImages(movie) {
  if (!movie?.id) {
    return [];
  }

  const uniqueImageUrls = new Set();
  const images = [];

  const addImage = (imageUrl, label) => {
    const normalizedImageUrl = String(imageUrl || '').trim();

    if (!normalizedImageUrl || uniqueImageUrls.has(normalizedImageUrl)) {
      return;
    }

    uniqueImageUrls.add(normalizedImageUrl);
    images.push({
      imageUrl: normalizedImageUrl,
      label
    });
  };

  addImage(movie.poster_url, 'Основной постер');
  getMoviePosterImages(movie.id).forEach((row, index) => {
    addImage(row.image_url, `Дополнительное изображение ${index + 1}`);
  });

  return images;
}

function getMoviePagePosterGalleryIndex(movieId, imagesCount) {
  const storedIndex = Number(currentMoviePagePosterIndexByMovieId.get(String(movieId || '')) || 0);

  if (!Number.isFinite(storedIndex) || storedIndex < 0) {
    return 0;
  }

  if (storedIndex >= imagesCount) {
    return Math.max(0, imagesCount - 1);
  }

  return storedIndex;
}

function getMoviePagePosterGalleryButtonHtml(direction, { isHidden, title }) {
  const buttonClassName = direction < 0
    ? 'user-page-rail-button-prev movie-page-poster-gallery-button-prev'
    : 'user-page-rail-button-next movie-page-poster-gallery-button-next';

  return `
    <button
      type="button"
      class="user-page-rail-button ${buttonClassName} movie-page-poster-gallery-button"
      data-movie-page-poster-gallery-step="${direction}"
      aria-label="${escapeHtml(title)}"
      title="${escapeHtml(title)}"
      ${isHidden ? 'hidden' : ''}
    >
      <span class="user-page-rail-button-icon" aria-hidden="true"></span>
    </button>
  `;
}

function applyPosterImageDataToElement(posterImage, publicUrl, presetName = 'detail') {
  if (!posterImage || !publicUrl) {
    return;
  }

  const imageData = getPosterImageData(publicUrl, presetName);

  posterImage.dataset.posterFallbackApplied = 'false';
  posterImage.src = imageData.src || publicUrl;

  if (imageData.srcset) {
    posterImage.srcset = imageData.srcset;
  } else {
    posterImage.removeAttribute('srcset');
  }

  if (imageData.sizes) {
    posterImage.sizes = imageData.sizes;
  } else {
    posterImage.removeAttribute('sizes');
  }

  if (imageData.fallbackSrc) {
    posterImage.dataset.posterFallbackSrc = imageData.fallbackSrc;
  } else {
    delete posterImage.dataset.posterFallbackSrc;
  }

  if (imageData.originalSrc) {
    posterImage.dataset.originalPosterSrc = imageData.originalSrc;
  } else {
    delete posterImage.dataset.originalPosterSrc;
  }
}

function restartMoviePagePosterSwitchAnimation(posterImage) {
  if (
    !posterImage ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  posterImage.classList.remove('is-switching');
  void posterImage.offsetWidth;
  posterImage.classList.add('is-switching');
  posterImage.addEventListener('animationend', () => {
    posterImage.classList.remove('is-switching');
  }, { once: true });
}

function prepareMoviePagePosterSwitch(wrapper, posterImage, shouldAnimatePoster) {
  if (!wrapper || !posterImage || !shouldAnimatePoster) {
    return () => {};
  }

  const loadToken = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  wrapper.dataset.moviePagePosterLoadToken = loadToken;
  wrapper.classList.add('is-loading');
  posterImage.classList.remove('is-switching');

  const finishLoading = () => {
    if (wrapper.dataset.moviePagePosterLoadToken !== loadToken) {
      return;
    }

    wrapper.classList.remove('is-loading');
    delete wrapper.dataset.moviePagePosterLoadToken;
    restartMoviePagePosterSwitchAnimation(posterImage);
  };

  const handleLoadError = () => {
    if (wrapper.dataset.moviePagePosterLoadToken !== loadToken) {
      return;
    }

    if (posterImage.dataset.posterFallbackApplied === 'true') {
      posterImage.addEventListener('error', finishLoading, { once: true });
      return;
    }

    finishLoading();
  };

  posterImage.addEventListener('load', finishLoading, { once: true });
  posterImage.addEventListener('error', handleLoadError, { once: true });

  return () => {
    if (posterImage.complete && posterImage.naturalWidth > 0) {
      finishLoading();
    }
  };
}

function updateMoviePagePosterGallery(wrapper, movie, nextIndex) {
  if (!wrapper || !movie?.id) {
    return;
  }

  const images = getMoviePagePosterGalleryImages(movie);

  if (images.length === 0) {
    return;
  }

  const normalizedIndex = Math.max(0, Math.min(images.length - 1, Number(nextIndex) || 0));
  const currentImage = images[normalizedIndex];
  const posterImage = wrapper.querySelector('[data-movie-page-poster-image="true"]');
  const counter = wrapper.querySelector('[data-movie-page-poster-counter="true"]');
  const prevButton = wrapper.querySelector('[data-movie-page-poster-gallery-step="-1"]');
  const nextButton = wrapper.querySelector('[data-movie-page-poster-gallery-step="1"]');
  const previousIndex = Number(wrapper.dataset.moviePagePosterIndex || 0);
  const shouldAnimatePoster = normalizedIndex !== previousIndex;

  currentMoviePagePosterIndexByMovieId.set(String(movie.id), normalizedIndex);
  wrapper.dataset.moviePagePosterIndex = String(normalizedIndex);

  if (posterImage) {
    const finishPosterSwitchIfLoaded = prepareMoviePagePosterSwitch(
      wrapper,
      posterImage,
      shouldAnimatePoster
    );

    applyPosterImageDataToElement(posterImage, currentImage.imageUrl, 'detail');
    posterImage.alt = `${currentImage.label} фильма ${movie.title || ''}`.trim();
    finishPosterSwitchIfLoaded();
  }

  if (counter) {
    counter.textContent = `${normalizedIndex + 1} / ${images.length}`;
  }

  if (prevButton) {
    prevButton.hidden = normalizedIndex === 0;
  }

  if (nextButton) {
    nextButton.hidden = normalizedIndex >= images.length - 1;
  }
}

function bindMoviePagePosterGalleryEvents(movie) {
  const wrapper = moviePage?.querySelector('[data-movie-page-poster-gallery="true"]');

  if (!wrapper || !movie?.id) {
    return;
  }

  wrapper.addEventListener('click', event => {
    const button = event.target.closest('[data-movie-page-poster-gallery-step]');

    if (!button) {
      return;
    }

    updateMoviePagePosterGallery(
      wrapper,
      movie,
      Number(wrapper.dataset.moviePagePosterIndex || 0) + Number(button.dataset.moviePagePosterGalleryStep || 0)
    );
  });
}

function getMoviePagePosterColumnHtml(movie, viewModel) {
  const {
    userMovieState,
    isWatchlistBusy,
    trailerEmbedUrl
  } = viewModel;
  const galleryImages = getMoviePagePosterGalleryImages(movie);
  const currentGalleryIndex = getMoviePagePosterGalleryIndex(movie.id, galleryImages.length);
  const currentGalleryImage = galleryImages[currentGalleryIndex] || null;

  return `
    <div class="movie-page-poster-column">
      <div
        class="movie-page-poster-wrapper"
        data-movie-page-poster-gallery="true"
        data-movie-page-poster-index="${currentGalleryIndex}"
      >
        ${
          currentGalleryImage
            ? `
              <img
                class="movie-page-poster"
                data-movie-page-poster-image="true"
                ${getPosterImageAttributeHtml(currentGalleryImage.imageUrl, 'detail')}
                alt="${escapeHtml(`${currentGalleryImage.label} фильма ${movie.title}`)}"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              >
            `
            : `<div class="movie-poster-placeholder">Нет постера</div>`
        }

        ${
          galleryImages.length > 1
            ? `
              ${getMoviePagePosterGalleryButtonHtml(-1, {
                isHidden: currentGalleryIndex === 0,
                title: 'Предыдущее изображение'
              })}
              ${getMoviePagePosterGalleryButtonHtml(1, {
                isHidden: currentGalleryIndex >= galleryImages.length - 1,
                title: 'Следующее изображение'
              })}
              <div class="movie-page-poster-gallery-counter" data-movie-page-poster-counter="true">
                ${currentGalleryIndex + 1} / ${galleryImages.length}
              </div>
            `
            : ''
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
        ${
          trailerEmbedUrl
            ? `
              <button
                type="button"
                class="secondary-button movie-page-rate-trigger movie-page-trailer-button"
                data-movie-page-trailer-open="true"
              >
                <span class="movie-page-trailer-play-icon" aria-hidden="true"></span>
                <span>Смотреть трейлер</span>
              </button>
            `
            : ''
        }
        </div>
      `;
    }

function getMoviePageMainColumnHtml(movie, viewModel) {
  const {
    genres,
    countries,
    production,
    distribution,
    russianDistribution,
    runtimeLabel,
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
          <div class="movie-page-meta-item"><span>Поджанры:</span> ${primaryPerceivedTagLabel ? escapeHtml(primaryPerceivedTagLabel) : '-'}</div>
          ${
            formatsLabel
              ? `<div class="movie-page-meta-item"><span>Формат:</span> ${escapeHtml(formatsLabel)}</div>`
              : ''
          }
          <div class="movie-page-meta-item"><span>Страны:</span> ${countries ? escapeHtml(countries) : '-'}</div>
          ${
            production
              ? `<div class="movie-page-meta-item"><span>Производство:</span> ${escapeHtml(production)}</div>`
              : ''
          }
          ${
            distribution
              ? `<div class="movie-page-meta-item"><span>Дистрибуция:</span> ${escapeHtml(distribution)}</div>`
              : ''
          }
          ${
            russianDistribution
              ? `<div class="movie-page-meta-item"><span>Дистрибуция в России:</span> ${escapeHtml(russianDistribution)}</div>`
              : ''
          }
          ${
            runtimeLabel
              ? `<div class="movie-page-meta-item"><span>Время:</span> ${escapeHtml(runtimeLabel)}</div>`
              : ''
          }
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
    <article class="movie-page-layout" data-movie-id="${escapeHtml(movie.id)}">
      ${getMoviePagePosterColumnHtml(movie, viewModel)}
      ${getMoviePageMainColumnHtml(movie, viewModel)}
    </article>
  `;
}

function getMoviePageSkeletonHtml() {
  const metaLinesHtml = Array.from({ length: 10 }, (_, index) => `
    <div class="movie-page-skeleton-meta-line">
      <span class="movie-text-skeleton movie-page-skeleton-label"></span>
      <span class="movie-text-skeleton movie-page-skeleton-value movie-page-skeleton-value-${index + 1}"></span>
    </div>
  `).join('');
  const externalLinksHtml = [
    'movie-page-skeleton-link-wide',
    'movie-page-skeleton-link-wide',
    'movie-page-skeleton-link-icon',
    'movie-page-skeleton-link-icon',
  ].map((className) => `<span class="movie-text-skeleton movie-page-skeleton-link ${className}"></span>`).join('');

  return `
    <div class="movie-page-stack movie-page-stack-skeleton" aria-busy="true" aria-live="polite">
      <span class="movie-page-skeleton-status">Загружаем фильм...</span>
      <article class="movie-page-layout movie-page-layout-skeleton" aria-hidden="true">
        <div class="movie-page-poster-column">
          <div class="movie-page-poster-wrapper movie-poster-wrapper-skeleton">
            <div class="movie-poster-skeleton" aria-hidden="true"></div>
          </div>
          <span class="movie-text-skeleton movie-page-skeleton-action"></span>
        </div>

        <div class="movie-page-main-column">
          <div class="movie-page-title-block">
            <div class="movie-page-title-row">
              <div class="movie-page-title-main">
                <span class="movie-text-skeleton movie-page-skeleton-title"></span>
                <span class="movie-text-skeleton movie-page-skeleton-original-title"></span>
              </div>

              <div class="movie-page-summary-panel movie-page-skeleton-summary">
                <span class="movie-text-skeleton movie-page-skeleton-rating"></span>
                <span class="movie-text-skeleton movie-page-skeleton-rate-button"></span>
              </div>
            </div>

            <div class="movie-page-meta-list movie-page-skeleton-meta-list">
              ${metaLinesHtml}
            </div>

            <div class="movie-page-synopsis-block movie-page-skeleton-synopsis">
              <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-1"></span>
              <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-2"></span>
              <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-3"></span>
            </div>

            <div class="movie-page-external-links-block movie-page-skeleton-links">
              ${externalLinksHtml}
            </div>
          </div>
        </div>
      </article>

      <section class="movie-page-reviews-block movie-page-skeleton-section" aria-hidden="true">
        <span class="movie-text-skeleton movie-page-skeleton-section-title"></span>
        <div class="movie-page-skeleton-panel"></div>
      </section>

      <section class="movie-page-comments-block movie-page-skeleton-section" aria-hidden="true">
        <span class="movie-text-skeleton movie-page-skeleton-section-title"></span>
        <div class="movie-page-skeleton-panel movie-page-skeleton-panel-short"></div>
      </section>
    </div>
  `;
}

function renderMoviePageSkeleton() {
  if (!moviePage) {
    return;
  }

  document.documentElement.classList.remove('movie-page-rendered');
  moviePage.innerHTML = getMoviePageSkeletonHtml();
}

function renderMoviePage(movie) {
  if (!moviePage || !movie) {
    return;
  }

  if (String(currentMoviePageMovieId || '') !== String(movie.id || '')) {
    resetMoviePageComposerState();
  }

  currentMoviePageMovieId = movie.id;
  currentMoviePageMovieData = movie;

  const viewModel = buildMoviePageViewModel(movie);
  const { reviewsSectionHtml, commentsSectionHtml } = viewModel;

  setMoviePageDocumentMeta(movie);

  moviePage.innerHTML = `
    <div class="movie-page-stack">
      ${getMoviePageHeaderHtml(movie, viewModel)}

      ${reviewsSectionHtml}
      ${commentsSectionHtml}
      <div data-movie-page-similar-mount="true">
        ${
          String(currentMoviePageSimilarMovieId) === String(movie.id)
            ? getMoviePageSimilarSectionHtml(currentMoviePageSimilarMovies, movie)
            : ''
        }
      </div>
    </div>
  `;
  document.documentElement.classList.add('movie-page-rendered');

  const watchlistIconButton = moviePage.querySelector('[data-movie-page-watchlist-icon-toggle="true"]');
  const mobileRatingButton = moviePage.querySelector('[data-open-mobile-rating="true"]');
  const trailerButton = moviePage.querySelector('[data-movie-page-trailer-open="true"]');

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

  if (trailerButton) {
    trailerButton.addEventListener('click', () => {
      openMovieTrailerModal(movie);
    });
  }

  bindPosterFallbackImages(moviePage);
  bindMoviePagePosterGalleryEvents(movie);
  bindMoviePageReviewEvents(movie);
  bindMoviePageCommentEvents(movie);
  bindMoviePageSimilarEditorEvents(movie);
  requestAnimationFrame(focusMoviePageHashTarget);
}

function renderMoviePageReviewsSection(movie, { preserveReviewId = '' } = {}) {
  if (!moviePage || !movie) {
    return;
  }

  const reviewsSection = moviePage.querySelector('[data-movie-page-reviews-section="true"]');
  const railSnapshot = getMoviePageReviewRailSnapshot(preserveReviewId);

  if (!reviewsSection) {
    renderMoviePage(movie);
    return;
  }

  reviewsSection.outerHTML = getMoviePageReviewsSectionHtml(movie);
  bindMoviePageReviewEvents(movie);
  bindMoviePageCommentEvents(movie);
  restoreMoviePageReviewRailSnapshot(railSnapshot);
}

function renderMoviePageCommentsSection(movie) {
  if (!moviePage || !movie) {
    return;
  }

  const commentsSection = moviePage.querySelector('[data-movie-page-comments-section="true"]');

  if (!commentsSection) {
    renderMoviePage(movie);
    return;
  }

  commentsSection.outerHTML = getMoviePageCommentsSectionHtml(movie);
  bindMoviePageCommentEvents(movie);
}

function renderMoviePageReviewsStatus(message) {
  const reviewsSection = moviePage?.querySelector('[data-movie-page-reviews-section="true"]');

  if (!reviewsSection) {
    return;
  }

  reviewsSection.innerHTML = `
    ${getMoviePageSectionTitleHtml('moviePageReviewsTitle', 'Рецензии')}
    <div class="movie-page-review-empty-state">
      ${escapeHtml(message)}
    </div>
  `;
}

function renderMoviePageCommentsStatus(message) {
  const commentsSection = moviePage?.querySelector('[data-movie-page-comments-section="true"]');

  if (!commentsSection) {
    return;
  }

  commentsSection.innerHTML = `
    ${getMoviePageSectionTitleHtml('moviePageCommentsTitle', 'Комментарии')}
    <div class="movie-page-comment-empty-state">
      ${escapeHtml(message)}
    </div>
  `;
}

async function deleteMovieFromMoviePage(movieId, movieTitle) {
  try {
    await deleteMovieRecord(movieId);
    removeMovieFromCatalogSessionSnapshot(movieId);
    window.location.href = buildCatalogPageUrl();
  } catch (error) {
    console.error('Ошибка при удалении фильма со страницы detail-page:', error);
  }
}

async function loadMoviePageByRouteParams(routeParams, {
  warmMovie = null,
  skipUserStateFetch = false
} = {}) {
  const movie = await fetchMovieByRouteParams(routeParams);

  if (!movie) {
    if (warmMovie) {
      removeMovieFromCatalogSessionSnapshot(warmMovie.id);
    }

    renderMoviePageNotFound();
    return null;
  }

  const userStateTasks = [fetchMovieRatingStatsForMovie(movie.id)];

  if (!skipUserStateFetch) {
    userStateTasks.push(
      fetchCurrentUserRatingForMovie(movie.id),
      fetchMovieWatchlistForCurrentUser(movie.id)
    );
  }

  await Promise.all(userStateTasks);

  if (String(currentMoviePageMovieId || '') !== String(movie.id || '')) {
    resetMoviePageComposerState();
  }

  currentMoviePageMovieId = movie.id;
  currentMoviePageMovieData = movie;

  await Promise.all([
    loadMoviePageSimilarMovies(movie, 4, { shouldRender: false }),
    fetchMovieReviews(movie.id),
    fetchMovieComments(movie.id),
    fetchMoviePosterImagesForMovieSafe(movie.id)
  ]);
  syncCatalogSessionSnapshotMovieState(movie.id, {
    syncReviews: true,
    syncMovie: movie
  });

  renderMoviePage(movie);

  return movie;
}

async function initMoviePage() {
  const routeParams = getMoviePageRouteParams();

  renderMoviePageSkeleton();

  if (!routeParams) {
    renderMoviePageNotFound();
    return;
  }

  await restoreSession();
  trackEmailConfirmedLoginIfNeeded();
  const warmMovie = hydrateMoviePageFromCatalogSnapshot(routeParams);

  try {
    await loadMoviePageByRouteParams(routeParams, {
      warmMovie
    });
  } catch (error) {
    console.error('Ошибка загрузки страницы фильма:', error);

    const fallbackMovie = currentMoviePageMovieData || warmMovie;

    if (!fallbackMovie) {
      renderMoviePageNotFound();
      return;
    }

    renderMoviePage(fallbackMovie);
    renderMoviePageReviewsStatus('Не удалось обновить рецензии. Попробуй обновить страницу.');
    renderMoviePageCommentsStatus('Не удалось обновить комментарии. Попробуй обновить страницу.');
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
  const initialAuthRedirectInfo = getAuthRedirectInfo();

  isPasswordRecoveryEntryPage = initialAuthRedirectInfo.isRecovery;
  const wasResetApplied = applyBuildVersionSoftResetIfNeeded();

  if (wasResetApplied) {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    return;
  }

  if (isMoviePage()) {
    renderMoviePageSkeleton();
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

  if (isMoviePage()) {
    bindMoviePageEvents();
    await initMoviePage();
  }
}

init();
