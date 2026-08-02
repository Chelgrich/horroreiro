const MOVIE_REVIEW_MIN_LENGTH = 80;
const MOVIE_REVIEW_MAX_LENGTH = 5000;
const MOVIE_REVIEW_REPLY_SNIPPET_MAX_LENGTH = 120;
const MOVIE_REVIEW_RAIL_SCROLL_STEP_RATIO = 1;
const MOVIE_COMMENT_MAX_LENGTH = 1200;
const MOVIE_COMMENT_MAX_DEPTH = 2;

export function createMovieSocialController(context = {}) {
  const {
  moviePage = null,
  supabaseClient = null,
  escapeHtml = value => String(value ?? ''),
  buildUserPageUrl = () => '',
  getPublicProfileHandle = () => '',
  getPublicProfileAvatarUrl = () => '',
  getUserPageAvatarLetter = value => String(value || '?').trim().charAt(0).toUpperCase(),
  getCurrentUserRating = () => null,
  getMovieUserRatingKey = (movieId, userId) => `${movieId}:${userId}`,
  fetchPublicProfilesByIds = async () => [],
  upsertKnownMovieRatingRows = () => {},
  removeKnownMovieRatingRows = () => {},
  throwIfSupabaseError = error => {
    if (error) {
      throw error;
    }
  },
  ensureActiveSessionForWrite = () => {
    throw new Error('Нужна авторизация.');
  },
  markLocalDataMutation = () => {},
  markCatalogDataChanged = () => {},
  syncCatalogSessionSnapshotMovieState = () => {},
  persistCurrentMoviePageSessionCache = () => '',
  openAuthModal = () => {},
  showAppMessage = () => {},
  runConfirmedAction = async (confirmMessage, action) => {
    if (!confirm(confirmMessage)) {
      return false;
    }

    await action();
    return true;
  },
  renderMoviePage = () => {},
  getCurrentUser = () => null,
  getIsAdmin = () => false,
  getCurrentMoviePageMovieData = () => null,
  getMovieRatingByMovieAndUserKey = () => new Map(),
  getCatalogReviewedMovieIds = () => new Set(),
  getAllMovieReviews = () => [],
  setAllMovieReviews = () => {},
  getAllMovieComments = () => [],
  setAllMovieComments = () => {},
  getAreMovieReviewLikesAvailable = () => true,
  setAreMovieReviewLikesAvailable = () => {},
  getAreMovieCommentsAvailable = () => true,
  setAreMovieCommentsAvailable = () => {},
  getAreMovieCommentLikesAvailable = () => true,
  setAreMovieCommentLikesAvailable = () => {},
  isMovieReviewLikesTableUnavailableError = () => false,
  isMovieCommentsTableUnavailableError = () => false,
  isMovieCommentLikesTableUnavailableError = () => false
} = context;

let currentUser = null;
let isAdmin = false;
let currentMoviePageMovieData = null;
let movieRatingByMovieAndUserKey = new Map();
let catalogReviewedMovieIds = new Set();
let allMovieReviews = [];
let allMovieComments = [];
let areMovieReviewLikesAvailable = true;
let areMovieCommentsAvailable = true;
let areMovieCommentLikesAvailable = true;
const reviewRequestInFlight = new Set();
const reviewLikeRequestInFlight = new Set();
const movieReviewHighlightTimers = new WeakMap();
const movieReviewRailResizeObservers = new WeakMap();
const movieCommentRequestInFlight = new Set();
const movieCommentLikeRequestInFlight = new Set();
const expandedSpoilerReviewIds = new Set();
const expandedMovieReviewTextIds = new Set();
const expandedSpoilerCommentIds = new Set();
const expandedMovieCommentThreadKeys = new Set();
let editingMovieReviewId = null;
let editingMovieCommentId = null;
let replyingMovieCommentTargetKey = '';
let isMovieReviewComposerExpanded = false;
let isMovieCommentComposerExpanded = false;

function syncMovieSocialContextState() {
  currentUser = getCurrentUser?.() || null;
  isAdmin = Boolean(getIsAdmin?.());
  currentMoviePageMovieData = getCurrentMoviePageMovieData?.() || null;
  movieRatingByMovieAndUserKey = getMovieRatingByMovieAndUserKey?.() || new Map();
  catalogReviewedMovieIds = getCatalogReviewedMovieIds?.() || new Set();
  allMovieReviews = Array.isArray(getAllMovieReviews?.()) ? getAllMovieReviews() : [];
  allMovieComments = Array.isArray(getAllMovieComments?.()) ? getAllMovieComments() : [];
  areMovieReviewLikesAvailable = getAreMovieReviewLikesAvailable?.() !== false;
  areMovieCommentsAvailable = getAreMovieCommentsAvailable?.() !== false;
  areMovieCommentLikesAvailable = getAreMovieCommentLikesAvailable?.() !== false;
}

function setMovieSocialReviews(reviews) {
  allMovieReviews = Array.isArray(reviews) ? reviews : [];
  setAllMovieReviews(allMovieReviews);
}

function setMovieSocialComments(comments) {
  allMovieComments = Array.isArray(comments) ? comments : [];
  setAllMovieComments(allMovieComments);
}

function setMovieSocialReviewLikesAvailable(isAvailable) {
  areMovieReviewLikesAvailable = Boolean(isAvailable);
  setAreMovieReviewLikesAvailable(areMovieReviewLikesAvailable);
}

function setMovieSocialCommentsAvailable(isAvailable) {
  areMovieCommentsAvailable = Boolean(isAvailable);
  setAreMovieCommentsAvailable(areMovieCommentsAvailable);
}

function setMovieSocialCommentLikesAvailable(isAvailable) {
  areMovieCommentLikesAvailable = Boolean(isAvailable);
  setAreMovieCommentLikesAvailable(areMovieCommentLikesAvailable);
}

syncMovieSocialContextState();

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
        loading="lazy"
        decoding="async"
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
      setMovieSocialReviewLikesAvailable(false);
      console.warn('Лайки рецензий недоступны: таблица movie_review_likes не найдена или закрыта политиками.', error);
      return [];
    }

    console.error('Ошибка загрузки лайков рецензий:', error);
    return [];
  }

  setMovieSocialReviewLikesAvailable(true);
  return data || [];
}

async function fetchMovieReviews(movieId) {
  if (!movieId) {
    setMovieSocialReviews([]);
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
    setMovieSocialReviews([]);
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
      fetchPublicProfilesByIds(uniqueUserIds)
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

  setMovieSocialReviews(reviews.map(review => ({
    ...review,
    profiles: profilesMap.get(String(review.user_id)) || null,
    likes_count: reviewLikeStats.countsByReviewId.get(String(review.id)) || 0,
    is_liked_by_current_user: reviewLikeStats.currentUserLikedReviewIds.has(String(review.id))
  })));
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
      setMovieSocialCommentLikesAvailable(false);
      console.warn('Лайки комментариев недоступны: таблица movie_comment_likes не найдена или закрыта политиками.', error);
      return [];
    }

    console.error('Ошибка загрузки лайков комментариев:', error);
    return [];
  }

  setMovieSocialCommentLikesAvailable(true);
  return data || [];
}

async function fetchMovieComments(movieId) {
  if (!movieId) {
    setMovieSocialComments([]);
    return;
  }

  if (!areMovieCommentsAvailable) {
    setMovieSocialComments([]);
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
      setMovieSocialCommentsAvailable(false);
      setMovieSocialComments([]);
      console.warn('Комментарии недоступны: таблица movie_comments не найдена или закрыта политиками.', error);
      return;
    }

    console.error('Ошибка загрузки комментариев:', error);
    setMovieSocialComments([]);
    return;
  }

  setMovieSocialCommentsAvailable(true);

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
      fetchPublicProfilesByIds(uniqueUserIds)
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

  setMovieSocialComments(comments.map(comment => ({
    ...comment,
    depth: Math.max(0, Math.min(MOVIE_COMMENT_MAX_DEPTH, Number(comment.depth || 0))),
    profiles: profilesMap.get(String(comment.user_id)) || null,
    likes_count: commentLikeStats.countsByCommentId.get(String(comment.id)) || 0,
    is_liked_by_current_user: commentLikeStats.currentUserLikedCommentIds.has(String(comment.id))
  })));
}

async function refreshMovieReviewsAfterMutation(movieId, reviewIdToCollapse = null) {
  if (reviewIdToCollapse) {
    setMovieReviewExpandedState(reviewIdToCollapse, false);
    setMovieReviewTextExpandedState(reviewIdToCollapse, false);
  }

  await fetchMovieReviews(movieId);
  markLocalDataMutation(`reviews:${movieId}`);
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

    markLocalDataMutation(`review-like:${reviewId}`);
    return;
  }

  const { error } = await supabaseClient
    .from('movie_review_likes')
    .delete()
    .eq('review_id', reviewId)
    .eq('user_id', activeUser.id);

  throwIfSupabaseError(error);
  markLocalDataMutation(`review-like:${reviewId}`);
}

async function refreshMovieCommentsAfterMutation(movieId) {
  await fetchMovieComments(movieId);
  markLocalDataMutation(`comments:${movieId}`);
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

    markLocalDataMutation(`comment-like:${commentId}`);
    return;
  }

  const { error } = await supabaseClient
    .from('movie_comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', activeUser.id);

  throwIfSupabaseError(error);
  markLocalDataMutation(`comment-like:${commentId}`);
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
        loading="lazy"
        decoding="async"
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
      setMovieSocialReviewLikesAvailable(false);
      showAppMessage('Лайки рецензий пока недоступны: серверный контур лайков не подключён.', 'error', true);
    } else {
      showAppMessage(error?.message || 'Не удалось обновить лайк рецензии.', 'error', true);
    }
  } finally {
    reviewLikeRequestInFlight.delete(String(reviewId));
    renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
  }
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

function handleMovieReviewReplyButtonClick(movie, reviewReplyButton) {
  if (!reviewReplyButton) {
    return;
  }

  if (!areMovieCommentsAvailable) {
    showAppMessage('Комментарии пока недоступны.', 'info', true);
    return;
  }

  if (reviewReplyButton.dataset.movieCommentReplyReviewDisabled === 'true') {
    showAppMessage('Ответить на рецензию можно только после оценки фильма.', 'info', true);
    return;
  }

  if (!currentUser?.id) {
    openAuthModal();
    return;
  }

  const reviewId = reviewReplyButton.dataset.movieCommentReplyReview;

  startMovieCommentReply('review', reviewId);
  renderMoviePageSocialSections(movie);
  focusMoviePageReviewReplyComposer();
}

function bindMoviePageReviewEvents(movie) {
  if (!moviePage || !movie) {
    return;
  }

  const reviewsSection = moviePage.querySelector('[data-movie-page-reviews-section="true"]');

  if (!reviewsSection) {
    return;
  }

  bindMoviePageReviewRailControls();

  reviewsSection.querySelectorAll('[data-movie-review-form="true"]').forEach(updateMovieReviewFormState);

  if (reviewsSection.dataset.moviePageReviewEventsBound === 'true') {
    return;
  }

  reviewsSection.dataset.moviePageReviewEventsBound = 'true';

  reviewsSection.addEventListener('click', event => {
    syncMovieSocialContextState();
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;

    if (!target) {
      return;
    }

    if (target.closest('[data-movie-review-composer-open="true"]')) {
      setMoviePageReviewComposerExpanded(true);
      return;
    }

    if (target.closest('[data-movie-review-composer-close="true"]')) {
      setMoviePageReviewComposerExpanded(false);
      return;
    }

    const deleteButton = target.closest('[data-movie-review-delete]');

    if (deleteButton && reviewsSection.contains(deleteButton)) {
      handleMovieReviewDelete(movie, deleteButton.dataset.movieReviewDelete);
      return;
    }

    const editButton = target.closest('[data-movie-review-edit]');

    if (editButton && reviewsSection.contains(editButton)) {
      const reviewId = editButton.dataset.movieReviewEdit;

      startMovieReviewEditing(reviewId);
      renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
      return;
    }

    const cancelEditButton = target.closest('[data-movie-review-cancel-edit="true"]');

    if (cancelEditButton && reviewsSection.contains(cancelEditButton)) {
      const reviewId = cancelEditButton.closest('[data-movie-review-id]')?.dataset.movieReviewId || '';

      stopMovieReviewEditing();
      renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
      return;
    }

    const spoilerButton = target.closest('[data-movie-review-show-spoilers]');

    if (spoilerButton && reviewsSection.contains(spoilerButton)) {
      const reviewId = spoilerButton.dataset.movieReviewShowSpoilers;

      setMovieReviewExpandedState(reviewId, true);
      renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
      return;
    }

    const textToggleButton = target.closest('[data-movie-review-toggle-text]');

    if (textToggleButton && reviewsSection.contains(textToggleButton)) {
      const reviewId = textToggleButton.dataset.movieReviewToggleText;
      const shouldExpand = !isMovieReviewTextExpanded(reviewId);

      setMovieReviewTextExpandedState(reviewId, shouldExpand);
      renderMoviePageReviewsSection(movie, { preserveReviewId: reviewId });
      return;
    }

    const reviewReplyButton = target.closest('[data-movie-comment-reply-review]');

    if (reviewReplyButton && reviewsSection.contains(reviewReplyButton)) {
      handleMovieReviewReplyButtonClick(movie, reviewReplyButton);
      return;
    }

    const likeButton = target.closest('[data-movie-review-like]');

    if (likeButton && reviewsSection.contains(likeButton)) {
      handleMovieReviewLikeToggle(movie, likeButton.dataset.movieReviewLike);
    }
  });

  reviewsSection.addEventListener('input', event => {
    syncMovieSocialContextState();
    if (!event.target?.matches?.('[data-movie-review-textarea="true"]')) {
      return;
    }

    const reviewForm = event.target.closest('[data-movie-review-form="true"]');

    if (reviewForm && reviewsSection.contains(reviewForm)) {
      updateMovieReviewFormState(reviewForm, { shouldClearMessage: true });
    }
  });

  reviewsSection.addEventListener('submit', event => {
    syncMovieSocialContextState();
    const reviewForm = event.target?.closest?.('[data-movie-review-form="true"]');

    if (!reviewForm || !reviewsSection.contains(reviewForm)) {
      return;
    }

    event.preventDefault();
    handleMovieReviewFormSubmit(movie, reviewForm);
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
  persistCurrentMoviePageSessionCache();
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
  persistCurrentMoviePageSessionCache();
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
      setMovieSocialCommentLikesAvailable(false);
      showAppMessage('Лайки комментариев пока недоступны: серверный контур лайков не подключён.', 'error', true);
    } else {
      showAppMessage(error?.message || 'Не удалось обновить лайк комментария.', 'error', true);
    }
  } finally {
    movieCommentLikeRequestInFlight.delete(String(commentId));
    renderMoviePageSocialSections(movie);
  }
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

  if (!commentsSection) {
    return;
  }

  commentsSection.querySelectorAll('[data-movie-comment-form="true"]').forEach(updateMovieCommentFormState);

  if (commentsSection.dataset.moviePageCommentEventsBound === 'true') {
    return;
  }

  commentsSection.dataset.moviePageCommentEventsBound = 'true';

  commentsSection.addEventListener('click', event => {
    syncMovieSocialContextState();
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;

    if (!target) {
      return;
    }

    const reviewAnchor = target.closest('[data-movie-comment-review-anchor]');

    if (reviewAnchor && commentsSection.contains(reviewAnchor)) {
      event.preventDefault();
      focusMoviePageReviewCard(reviewAnchor.dataset.movieCommentReviewAnchor);
      return;
    }

    if (target.closest('[data-movie-comment-composer-open="true"]')) {
      setMoviePageCommentComposerExpanded(true);
      return;
    }

    if (target.closest('[data-movie-comment-composer-close="true"]')) {
      setMoviePageCommentComposerExpanded(false);
      return;
    }

    const replyButton = target.closest('[data-movie-comment-reply]');

    if (replyButton && commentsSection.contains(replyButton)) {
      if (!currentUser?.id) {
        openAuthModal();
        return;
      }

      const commentId = replyButton.dataset.movieCommentReply;
      startMovieCommentReply('comment', commentId);
      setMovieCommentThreadExpandedState('comment', commentId, true);
      renderMoviePageSocialSections(movie);
      return;
    }

    const cancelButton = target.closest('[data-movie-comment-cancel="true"]');

    if (cancelButton && commentsSection.contains(cancelButton)) {
      stopMovieCommentEditing();
      stopMovieCommentReply();
      renderMoviePageSocialSections(movie);
      return;
    }

    const editButton = target.closest('[data-movie-comment-edit]');

    if (editButton && commentsSection.contains(editButton)) {
      if (editButton.disabled) {
        return;
      }

      startMovieCommentEditing(editButton.dataset.movieCommentEdit);
      renderMoviePageSocialSections(movie);
      return;
    }

    const deleteButton = target.closest('[data-movie-comment-delete]');

    if (deleteButton && commentsSection.contains(deleteButton)) {
      handleMovieCommentDelete(movie, deleteButton.dataset.movieCommentDelete);
      return;
    }

    const spoilerButton = target.closest('[data-movie-comment-show-spoilers]');

    if (spoilerButton && commentsSection.contains(spoilerButton)) {
      setMovieCommentSpoilerExpandedState(spoilerButton.dataset.movieCommentShowSpoilers, true);
      renderMoviePageSocialSections(movie);
      return;
    }

    const threadToggleButton = target.closest('[data-movie-comment-toggle-thread]');

    if (threadToggleButton && commentsSection.contains(threadToggleButton)) {
      const [threadType, threadId] = String(threadToggleButton.dataset.movieCommentToggleThread || '').split(':');

      if (!threadType || !threadId) {
        return;
      }

      const shouldExpand = !isMovieCommentThreadExpanded(threadType, threadId);

      setMovieCommentThreadExpandedState(threadType, threadId, shouldExpand);
      renderMoviePageSocialSections(movie);
      return;
    }

    const likeButton = target.closest('[data-movie-comment-like]');

    if (likeButton && commentsSection.contains(likeButton)) {
      handleMovieCommentLikeToggle(movie, likeButton.dataset.movieCommentLike);
    }
  });

  commentsSection.addEventListener('input', event => {
    syncMovieSocialContextState();
    if (!event.target?.matches?.('[data-movie-comment-textarea="true"]')) {
      return;
    }

    const commentForm = event.target.closest('[data-movie-comment-form="true"]');

    if (commentForm && commentsSection.contains(commentForm)) {
      updateMovieCommentFormState(commentForm, { shouldClearMessage: true });
    }
  });

  commentsSection.addEventListener('submit', event => {
    syncMovieSocialContextState();
    const commentForm = event.target?.closest?.('[data-movie-comment-form="true"]');

    if (!commentForm || !commentsSection.contains(commentForm)) {
      return;
    }

    event.preventDefault();
    handleMovieCommentFormSubmit(movie, commentForm);
  });
}

  return {
    syncContextState: syncMovieSocialContextState,
    resetMoviePageComposerState,
    getMoviePageReviewsSectionHtml: (movie, options = {}) => {
      syncMovieSocialContextState();
      return getMoviePageReviewsSectionHtml(movie, options);
    },
    getMoviePageCommentsSectionHtml: (movie, options = {}) => {
      syncMovieSocialContextState();
      return getMoviePageCommentsSectionHtml(movie, options);
    },
    fetchMovieReviews: async movieId => {
      syncMovieSocialContextState();
      return fetchMovieReviews(movieId);
    },
    fetchMovieComments: async movieId => {
      syncMovieSocialContextState();
      return fetchMovieComments(movieId);
    },
    bindMoviePageReviewEvents: movie => {
      syncMovieSocialContextState();
      bindMoviePageReviewEvents(movie);
    },
    bindMoviePageCommentEvents: movie => {
      syncMovieSocialContextState();
      bindMoviePageCommentEvents(movie);
    },
    focusMoviePageHashTarget: () => {
      syncMovieSocialContextState();
      focusMoviePageHashTarget();
    },
    renderMoviePageReviewsSection: (movie, options = {}) => {
      syncMovieSocialContextState();
      renderMoviePageReviewsSection(movie, options);
    },
    renderMoviePageCommentsSection: movie => {
      syncMovieSocialContextState();
      renderMoviePageCommentsSection(movie);
    },
    renderMoviePageReviewsStatus: message => {
      syncMovieSocialContextState();
      renderMoviePageReviewsStatus(message);
    },
    renderMoviePageCommentsStatus: message => {
      syncMovieSocialContextState();
      renderMoviePageCommentsStatus(message);
    }
  };
}
