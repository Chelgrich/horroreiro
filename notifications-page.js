const NOTIFICATIONS_PAGE_LIMIT = 80;
const NOTIFICATION_READ_DWELL_MS = 1300;
const NOTIFICATION_READ_VISIBILITY_RATIO = 0.7;
const NOTIFICATION_CONTEXT_SNIPPET_LABELS = {
  review: 'Рецензия',
  comment: 'Комментарий'
};

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

export function createNotificationsPageController(context = {}) {
  const {
    notificationsPage = null,
    supabaseClient = null,
    getCurrentUser = () => null,
    shouldUseAuthenticatedUi = () => false,
    restoreSession = async () => null,
    bindSharedAuthStateListener = () => {},
    openAuthModal = () => {},
    showAppMessage = () => {},
    escapeHtml = value => String(value ?? ''),
    buildFollowingPageUrl = () => '/following',
    buildUserPageUrl = () => '',
    buildMoviePageUrl = () => '',
    getUserPageAvatarLetter = value => String(value || '?').trim().charAt(0).toUpperCase(),
    getPublicProfileDisplayName = profile => String(profile?.display_name || profile?.default_display_name || 'Пользователь'),
    getPublicProfileAvatarUrl = () => '',
    getPublicProfileHandle = () => '',
    fetchPublicProfilesByIds = async () => [],
    fetchMoviesByIdsWithSelect = async () => [],
    ensurePreferredPosterImagesForMovies = async () => {},
    movieUserPageCardSelect = '',
    movieNotificationLinkSelect = '',
    getManualSimilarMovieLabel = () => '',
    normalizeMovieReviewText = value => String(value || ''),
    normalizeMovieCommentText = value => String(value || ''),
    getMovieContentWarningCoverText = () => '',
    getMovieReviewAnchorId = reviewId => String(reviewId || ''),
    getMovieCommentAnchorId = commentId => String(commentId || ''),
    formatShortDateTime = () => '',
    getUserPageMovieCardHtml = () => '',
    bindUserPageRailControls = () => {},
    runConfirmedAction = async (confirmMessage, action) => {
      if (!confirm(confirmMessage)) {
        return false;
      }

      await action();
      return true;
    },
    isNotificationsUnavailableError = () => false,
    isMovieCommentsTableUnavailableError = () => false,
    getAreMovieCommentsAvailable = () => true,
    setAreMovieCommentsAvailable = () => {},
    setNotificationsUnavailable = () => {},
    refreshNotificationsUnreadCount = async () => 0,
    setNotificationsUnreadCount = () => {},
    decrementNotificationsUnreadCount = () => {}
  } = context;

  let notificationsPageItems = [];
  let notificationsPageFilter = 'all';
  let isNotificationsPageMarkingAllRead = false;
  let isNotificationsPageClearingAll = false;
  let notificationsPagePreferences = null;
  const notificationPreferenceRequestKeys = new Set();
  const notificationReadDwellTimers = new Map();
  let notificationReadObserver = null;
  let areNotificationReadTrackingEventsBound = false;

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

    if (!normalizedCommentIds.length || !getAreMovieCommentsAvailable()) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('movie_comments')
      .select('id, movie_id, comment_text, contains_spoilers, contains_profanity, is_deleted')
      .in('id', normalizedCommentIds);

    if (error) {
      if (isMovieCommentsTableUnavailableError(error)) {
        setAreMovieCommentsAvailable(false);
      }

      console.warn('Ошибка загрузки фрагментов комментариев для уведомлений:', error);
      return [];
    }

    setAreMovieCommentsAvailable(true);
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
    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('notification_deliveries')
      .select('event_id, read_at, created_at, notification_events (id, type, actor_id, movie_id, entity_type, entity_id, payload, created_at)')
      .eq('recipient_id', getCurrentUser().id)
      .order('created_at', { ascending: false })
      .limit(NOTIFICATIONS_PAGE_LIMIT);

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        setNotificationsUnavailable(true);
      }

      throw error;
    }

    return (data || [])
      .map(normalizeNotificationRow)
      .filter(Boolean);
  }

  async function fetchCurrentNotificationPreferences() {
    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      return { ...NOTIFICATIONS_DEFAULT_PREFERENCES };
    }

    const { data, error } = await supabaseClient
      .from('notification_preferences')
      .select(Object.keys(NOTIFICATIONS_DEFAULT_PREFERENCES).join(', '))
      .eq('user_id', getCurrentUser().id)
      .maybeSingle();

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        setNotificationsUnavailable(true);
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
      user_id: getCurrentUser().id,
      ...NOTIFICATIONS_DEFAULT_PREFERENCES
    };
    const { error: insertError } = await supabaseClient
      .from('notification_preferences')
      .insert(insertPayload);

    if (insertError && insertError.code !== '23505') {
      if (isNotificationsUnavailableError(insertError)) {
        setNotificationsUnavailable(true);
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
    const notificationMovieIds = [...new Set(
      notificationRows
        .map(item => String(item.movieId || '').trim())
        .filter(Boolean)
    )];
    const digestMovieIds = [...new Set(
      notificationRows
        .flatMap(item => getNotificationMovieIdsFromPayload(item.payload))
        .map(movieId => String(movieId || '').trim())
        .filter(Boolean)
    )];
    const reviewSnippetIds = getNotificationReviewSnippetIds(notificationRows);
    const commentSnippetIds = getNotificationCommentSnippetIds(notificationRows);
    const [profiles, notificationMovies, digestMovies, reviewSnippets, commentSnippets] = await Promise.all([
      fetchPublicProfilesByIds(actorIds),
      fetchMoviesByIdsWithSelect(notificationMovieIds, movieNotificationLinkSelect || movieUserPageCardSelect),
      fetchMoviesByIdsWithSelect(digestMovieIds, movieUserPageCardSelect),
      fetchNotificationReviewSnippets(reviewSnippetIds),
      fetchNotificationCommentSnippets(commentSnippetIds)
    ]);
    await ensurePreferredPosterImagesForMovies(digestMovies);
    const profilesById = new Map((profiles || []).map(profile => [String(profile.id), profile]));
    const notificationMoviesById = new Map((notificationMovies || []).map(movie => [String(movie.id), movie]));
    const digestMoviesById = new Map((digestMovies || []).map(movie => [String(movie.id), movie]));
    const reviewSnippetsById = new Map((reviewSnippets || []).map(review => [String(review.id), review]));
    const commentSnippetsById = new Map((commentSnippets || []).map(comment => [String(comment.id), comment]));

    notificationsPagePreferences = preferences;
    notificationsPageItems = notificationRows
      .map(item => ({
        ...item,
        actor: item.actorId ? profilesById.get(item.actorId) : null,
        movie: item.movieId ? notificationMoviesById.get(item.movieId) : null,
        reviewSnippet: item.entityId ? reviewSnippetsById.get(item.entityId) : null,
        commentSnippet: item.entityId ? commentSnippetsById.get(item.entityId) : null,
        digestMovies: getNotificationMovieIdsFromPayload(item.payload)
          .map(movieId => digestMoviesById.get(movieId))
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

  function getNotificationProfileAvatarHtml(profile, className = 'notifications-page-avatar', size = 'small') {
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

  function getNotificationAvatarHtml(item) {
    if (item.type === 'new_movies_digest') {
      return '<span class="notifications-page-avatar notifications-page-avatar-system" aria-hidden="true">+</span>';
    }

    return getNotificationProfileAvatarHtml(
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
        <div class="notifications-page-toolbar-actions">
          <button
            type="button"
            class="secondary-button notifications-page-clear-all-button"
            data-notifications-clear-all="true"
            aria-label="Очистить все уведомления"
            title="Очистить всё"
            ${isNotificationsPageClearingAll || isNotificationsPageMarkingAllRead || !items.length ? 'disabled' : ''}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
            <span>Очистить всё</span>
          </button>
          <button
            type="button"
            class="secondary-button notifications-page-read-all-button"
            data-notifications-mark-all-read="true"
            ${isNotificationsPageMarkingAllRead || isNotificationsPageClearingAll || !items.some(item => !item.readAt) ? 'disabled' : ''}
          >
            Отметить все прочитанными
          </button>
        </div>
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
        <button type="button" class="secondary-button notifications-page-login-button" data-notifications-login="true">
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
        Контур уведомлений ещё не подключён. Обнови страницу позже или проверь серверную настройку.
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
    const clearAllButton = notificationsPage?.querySelector('[data-notifications-clear-all="true"]');

    if (readAllButton) {
      readAllButton.disabled =
        isNotificationsPageMarkingAllRead ||
        isNotificationsPageClearingAll ||
        !notificationsPageItems.some(item => !item.readAt);
    }

    if (clearAllButton) {
      clearAllButton.disabled =
        isNotificationsPageClearingAll ||
        isNotificationsPageMarkingAllRead ||
        notificationsPageItems.length === 0;
    }
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

    if (!normalizedEventId || !shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
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
      .eq('recipient_id', getCurrentUser().id)
      .eq('event_id', normalizedEventId)
      .is('read_at', null);

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        setNotificationsUnavailable(true);
      }

      throw error;
    }

    if (item) {
      item.readAt = readAt;
    }

    decrementNotificationsUnreadCount(1);

    if (notificationsPage && rerender) {
      renderNotificationsPage();
    } else if (notificationsPage) {
      applyNotificationReadStateToDom(normalizedEventId);
    }
  }

  async function markAllNotificationsRead() {
    if (
      !shouldUseAuthenticatedUi() ||
      !getCurrentUser()?.id ||
      isNotificationsPageMarkingAllRead ||
      isNotificationsPageClearingAll
    ) {
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
        .eq('recipient_id', getCurrentUser().id)
        .is('read_at', null);

      if (error) {
        if (isNotificationsUnavailableError(error)) {
          setNotificationsUnavailable(true);
        }

        throw error;
      }

      notificationsPageItems = notificationsPageItems.map(item => ({
        ...item,
        readAt: item.readAt || readAt
      }));
      setNotificationsUnreadCount(0, { userId: getCurrentUser()?.id || '', fetchedAt: Date.now() });
    } catch (error) {
      console.error('Ошибка отметки уведомлений прочитанными:', error);
      showAppMessage('Не удалось отметить уведомления прочитанными.', 'error', true);
    } finally {
      isNotificationsPageMarkingAllRead = false;
      renderNotificationsPage();
    }
  }

  async function clearAllNotifications() {
    if (
      !shouldUseAuthenticatedUi() ||
      !getCurrentUser()?.id ||
      isNotificationsPageClearingAll ||
      isNotificationsPageMarkingAllRead ||
      !notificationsPageItems.length
    ) {
      return;
    }

    await runConfirmedAction('Очистить все уведомления? Это действие нельзя отменить.', async () => {
      isNotificationsPageClearingAll = true;
      renderNotificationsPage();

      try {
        const { error } = await supabaseClient
          .from('notification_deliveries')
          .delete()
          .eq('recipient_id', getCurrentUser().id);

        if (error) {
          if (isNotificationsUnavailableError(error)) {
            setNotificationsUnavailable(true);
          }

          throw error;
        }

        clearNotificationReadDwellTimers();
        notificationsPageItems = [];
        setNotificationsUnreadCount(0, { userId: getCurrentUser()?.id || '', fetchedAt: Date.now() });
      } catch (error) {
        console.error('Ошибка очистки уведомлений:', error);
        showAppMessage('Не удалось очистить уведомления.', 'error', true);
      } finally {
        isNotificationsPageClearingAll = false;
        renderNotificationsPage();
      }
    });
  }

  function handleNotificationsPageClick(event) {
    const loginButton = event.target?.closest?.('[data-notifications-login="true"]');

    if (loginButton) {
      event.preventDefault();
      openAuthModal();
      return true;
    }

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

    const clearAllButton = event.target?.closest?.('[data-notifications-clear-all="true"]');

    if (clearAllButton) {
      event.preventDefault();
      void clearAllNotifications();
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

    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id || notificationPreferenceRequestKeys.has(normalizedKey)) {
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
          user_id: getCurrentUser().id,
          [normalizedKey]: Boolean(value)
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        if (isNotificationsUnavailableError(error)) {
          setNotificationsUnavailable(true);
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

    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
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

  return {
    initNotificationsPage,
    loadNotificationsPage,
    handleNotificationsPageClick,
    handleNotificationsPagePreferenceChange,
    observeNotificationsPageVisibleItems,
    renderNotificationsPageLoading
  };
}
