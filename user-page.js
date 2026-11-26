const USER_PAGE_ACTIVITY_AGGREGATE_CACHE_VERSION = 1;
const USER_PAGE_ACTIVITY_AGGREGATE_CACHE_MAX_AGE_MS = 5 * 60 * 1000;
const USER_PAGE_ACTIVITY_AGGREGATE_LIMIT = 10000;
const USER_PAGE_DATA_CACHE_VERSION = 3;
const USER_PAGE_DATA_CACHE_MAX_AGE_MS = 10 * 60 * 1000;
const USER_PAGE_DATA_CACHE_MAX_ENTRIES = 12;

export function createUserPageController(context = {}) {
  const {
    userPage = null,
    isCurrentUserFollowingProfile,
    setProfileFollowing,
    openAuthModal,
    showAuthMessage,
    showAppMessage,
    getUserPageAvatarMediaHtml,
    supabaseClient = null,
    getCurrentUser,
    hasWarmStartedPageDom,
    shouldUseAuthenticatedUi,
    shouldPreferRussianPosters,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    bindSharedAuthStateListener,
    escapeHtml,
    buildCatalogProfileActivityUrl,
    getPublicProfileDisplayName,
    getPublicProfileHandle,
    fetchPublicUserProfileByHandle,
    fetchUserPageActivityRanks,
    isUserPageActivityRankFallbackEnabled,
    addCount,
    ensurePreferredPosterImagesForMovies,
    throwIfSupabaseError,
    getManualSimilarMovieLabel,
    getUserPageAvatarHtml,
    getUserPageAdminPasswordPanelHtml,
    setUserPageDocumentMeta,
    bindUserPageRailControls,
    getUserPageMovieRailHtml,
    getUserPageMoreCardHtml,
    appBuildVersion = 'dev',
    getDataMutationStamp,
    getPageDependencySnapshot,
    isPageDependencySnapshotFresh,
    userPageActivityAggregateCacheKey = 'horroreiro_user_page_activity_aggregate_cache',
    userPageDataCacheKey = 'horroreiro_user_page_data_cache'
  } = context;

  let userPageActivityAggregateRowsCache = null;
  let userPageDataCache = null;
  const userPageFollowRequestProfileIds = new Set();
  let userPageRankTooltipElement = null;
  let userPageRankTooltipTarget = null;
  let renderedProfile = null;
  let pageLoadVersion = 0;
  let profileIdentityVersion = 0;
  let arePageEventsBound = false;

  function isOwnUserProfile(profile) {
    return Boolean(shouldUseAuthenticatedUi() && getCurrentUser()?.id && profile?.id &&
      String(profile.id) === String(getCurrentUser().id));
  }

  function syncOwnProfileIdentity(profile) {
    if (!isOwnUserProfile(renderedProfile) || !isOwnUserProfile(profile)) return;
    profileIdentityVersion += 1;
    renderedProfile = profile;
    const name = userPage.querySelector('[data-user-page-display-name="true"]');
    if (name) name.textContent = getPublicProfileDisplayName(profile);
    const avatar = userPage.querySelector('[data-user-page-avatar-shell="true"]');
    if (avatar) avatar.innerHTML = getUserPageAvatarMediaHtml(profile, getPublicProfileDisplayName(profile)).trim();
    syncUserPageMainTitle(profile);
    setUserPageDocumentMeta(profile);
  }

  function setAvatarSubmitting(isSubmitting) {
    if (isOwnUserProfile(renderedProfile)) {
      userPage.querySelector('[data-user-page-avatar-shell="true"]')?.classList.toggle('is-uploading', isSubmitting);
    }
  }

  async function toggleUserPageProfileFollow(profileId) {
    const followingId = String(profileId || '').trim();
    if (!followingId) return;
    const followerId = String(getCurrentUser()?.id || '');
    if (!shouldUseAuthenticatedUi() || !followerId) {
      openAuthModal();
      showAuthMessage('Войди, чтобы отслеживать профили.', 'info', true);
      return;
    }
    const requestKey = `${followerId}:${followingId}`;
    if (followingId === followerId || userPageFollowRequestProfileIds.has(requestKey)) return;
    const wasFollowing = isCurrentUserFollowingProfile(followingId);
    userPageFollowRequestProfileIds.add(requestKey);
    syncUserPageFollowButtonState(followingId);
    try {
      const applied = await setProfileFollowing({ followerId, followingId, isFollowing: !wasFollowing });
      if (!applied || String(getCurrentUser()?.id || '') !== followerId) return;
      showAppMessage(wasFollowing ? 'Профиль больше не отслеживается.' : 'Профиль отслеживается.', 'success', true);
    } catch (error) {
      console.error('Ошибка обновления отслеживания профиля:', error);
      if (String(getCurrentUser()?.id || '') === followerId) {
        showAppMessage('Не удалось обновить отслеживание профиля.', 'error', true);
      }
    } finally {
      userPageFollowRequestProfileIds.delete(requestKey);
      syncUserPageFollowButtonState(followingId);
    }
  }

  function bindUserPageEvents() {
    if (arePageEventsBound || !userPage) return;
    arePageEventsBound = true;
    userPage.addEventListener('click', event => {
      const button = event.target?.closest?.('[data-user-page-follow-profile-id]');
      if (button) {
        event.preventDefault();
        return toggleUserPageProfileFollow(button.dataset.userPageFollowProfileId);
      }
    });
    document.addEventListener('click', handleUserPageRankTooltipClick);
    document.addEventListener('keydown', handleUserPageRankTooltipKeydown);
    document.addEventListener('focusin', event => {
      if (userPageRankTooltipTarget && !getUserPageRankTooltipTarget(event.target)) hideUserPageRankTooltip();
    });
    window.addEventListener('scroll', hideUserPageRankTooltip, { passive: true });
    window.addEventListener('resize', hideUserPageRankTooltip);
  }

  function getUserPageRouteHandle() {
    const searchParams = new URLSearchParams(window.location.search);
    const pathHandleMatch = window.location.pathname.match(/\/user\/([^/]+)\/?$/);
    const pathHandle = pathHandleMatch ? decodeURIComponent(pathHandleMatch[1] || '').trim() : '';
    const queryHandle = String(searchParams.get('handle') || '').trim();

    return pathHandle || queryHandle || '';
  }

  function getUserPageServerProfileId(handle) {
    const hint = document.querySelector('meta[name="app-profile-id"]');
    if (hint?.dataset?.profileHandle !== handle) return null;
    return /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(hint.content) ? hint.content : null;
  }

  function getUserPageFollowButtonHtml(profile) {
    const profileId = String(profile?.id || '').trim();

    if (!profileId || isOwnUserProfile(profile)) {
      return '';
    }

    const isAuthenticated = Boolean(shouldUseAuthenticatedUi() && getCurrentUser()?.id);
    const isFollowing = isAuthenticated && isCurrentUserFollowingProfile(profileId);
    const isBusy = userPageFollowRequestProfileIds.has(`${getCurrentUser()?.id || ''}:${profileId}`);
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

    const isAuthenticated = Boolean(shouldUseAuthenticatedUi() && getCurrentUser()?.id);
    const isFollowing = isAuthenticated && isCurrentUserFollowingProfile(normalizedProfileId);
    const isBusy = userPageFollowRequestProfileIds.has(`${getCurrentUser()?.id || ''}:${normalizedProfileId}`);

    button.disabled = isBusy;
    button.classList.toggle('is-following', isFollowing);
    button.setAttribute('aria-pressed', isFollowing ? 'true' : 'false');
    button.title = isAuthenticated
      ? (isFollowing ? 'Больше не отслеживать профиль' : 'Отслеживать профиль')
      : 'Войти, чтобы отслеживать профиль';
    button.textContent = isFollowing ? 'Отслеживается' : 'Отслеживать';
  }

  function syncUserPageMainTitle(profile = null) {
    const userPageMainTitle = globalThis.document?.querySelector('.user-page-main-title');
    if (!userPageMainTitle) {
      return;
    }

    userPageMainTitle.textContent = isOwnUserProfile(profile)
      ? 'Мой профиль'
      : 'Профиль зрителя';
  }

  function syncUserPageProfileSettingsButton() {
    const settingsButton = userPage?.querySelector('[data-user-page-profile-settings="true"]');

    if (!settingsButton) {
      return;
    }

    settingsButton.hidden = !(
      shouldUseAuthenticatedUi() &&
      getCurrentUser()?.id &&
      String(settingsButton.dataset.profileId || '') === String(getCurrentUser().id)
    );
  }

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

  function getUserPageMovieIds(rows = []) {
    return [...new Set(
      (Array.isArray(rows) ? rows : [])
        .map(row => String(row?.movie_id || ''))
        .filter(Boolean)
    )];
  }

  function getOptionalUserPageAggregateRows(result, label) {
    if (result?.error) {
      console.warn(`Не удалось загрузить агрегаты профиля (${label}):`, result.error);
      return [];
    }

    return Array.isArray(result?.data) ? result.data : [];
  }

  function isUserPageActivityAggregateRowsCacheValid(cache) {
    if (
      !cache ||
      cache.version !== USER_PAGE_ACTIVITY_AGGREGATE_CACHE_VERSION ||
      cache.buildVersion !== appBuildVersion ||
      cache.mutationStamp !== getDataMutationStamp()
    ) {
      return false;
    }

    const createdAt = Number(cache.createdAt || 0);

    if (!createdAt || Date.now() - createdAt > USER_PAGE_ACTIVITY_AGGREGATE_CACHE_MAX_AGE_MS) {
      return false;
    }

    return (
      Array.isArray(cache.profileRows) &&
      Array.isArray(cache.ratingRows) &&
      Array.isArray(cache.watchlistRows) &&
      Array.isArray(cache.reviewRows)
    );
  }

  function getUserPageActivityAggregateRowsCachePayload(cache) {
    return {
      profileRows: cache.profileRows || [],
      ratingRows: cache.ratingRows || [],
      watchlistRows: cache.watchlistRows || [],
      reviewRows: cache.reviewRows || [],
      hasProfileRows: Boolean(cache.hasProfileRows),
      hasRatingRows: Boolean(cache.hasRatingRows),
      hasWatchlistRows: Boolean(cache.hasWatchlistRows),
      hasReviewRows: Boolean(cache.hasReviewRows)
    };
  }

  function readUserPageActivityAggregateRowsCache() {
    if (isUserPageActivityAggregateRowsCacheValid(userPageActivityAggregateRowsCache)) {
      return getUserPageActivityAggregateRowsCachePayload(userPageActivityAggregateRowsCache);
    }

    try {
      const rawCache = sessionStorage.getItem(userPageActivityAggregateCacheKey);
      const parsedCache = rawCache ? JSON.parse(rawCache) : null;

      if (!isUserPageActivityAggregateRowsCacheValid(parsedCache)) {
        sessionStorage.removeItem(userPageActivityAggregateCacheKey);
        userPageActivityAggregateRowsCache = null;
        return null;
      }

      userPageActivityAggregateRowsCache = parsedCache;
      return getUserPageActivityAggregateRowsCachePayload(parsedCache);
    } catch (error) {
      userPageActivityAggregateRowsCache = null;
      return null;
    }
  }

  function writeUserPageActivityAggregateRowsCache(payload) {
    const cache = {
      version: USER_PAGE_ACTIVITY_AGGREGATE_CACHE_VERSION,
      buildVersion: appBuildVersion,
      mutationStamp: getDataMutationStamp(),
      createdAt: Date.now(),
      profileRows: Array.isArray(payload?.profileRows) ? payload.profileRows : [],
      ratingRows: Array.isArray(payload?.ratingRows) ? payload.ratingRows : [],
      watchlistRows: Array.isArray(payload?.watchlistRows) ? payload.watchlistRows : [],
      reviewRows: Array.isArray(payload?.reviewRows) ? payload.reviewRows : [],
      hasProfileRows: Boolean(payload?.hasProfileRows),
      hasRatingRows: Boolean(payload?.hasRatingRows),
      hasWatchlistRows: Boolean(payload?.hasWatchlistRows),
      hasReviewRows: Boolean(payload?.hasReviewRows)
    };

    userPageActivityAggregateRowsCache = cache;

    try {
      sessionStorage.setItem(userPageActivityAggregateCacheKey, JSON.stringify(cache));
    } catch (error) {
      // Session storage can be unavailable or full; in-memory cache is enough as a fallback.
    }
  }

  function invalidateUserPageActivityAggregateRowsCache() {
    userPageActivityAggregateRowsCache = null;

    try {
      sessionStorage.removeItem(userPageActivityAggregateCacheKey);
    } catch (error) {
      // Ignore storage errors; cache invalidation is best-effort.
    }
  }

  function getUserPageDataCacheEntryKey(handle) {
    const normalizedHandle = String(handle || '').trim().toLowerCase();
    const viewerId = getCurrentUser()?.id ? `user:${getCurrentUser().id}` : 'public';
    const posterPreferenceKey = shouldPreferRussianPosters() ? 'ru-posters' : 'default-posters';

    return `${normalizedHandle}|${viewerId}|${posterPreferenceKey}`;
  }

  function isUserPageDataCacheRootValid(cache) {
    return Boolean(
      cache &&
      cache.version === USER_PAGE_DATA_CACHE_VERSION &&
      cache.buildVersion === appBuildVersion &&
      cache.entries &&
      typeof cache.entries === 'object' &&
      !Array.isArray(cache.entries)
    );
  }

  function readUserPageDataCacheRoot() {
    if (isUserPageDataCacheRootValid(userPageDataCache)) {
      return userPageDataCache;
    }

    try {
      const rawCache = sessionStorage.getItem(userPageDataCacheKey);
      const parsedCache = rawCache ? JSON.parse(rawCache) : null;

      if (!isUserPageDataCacheRootValid(parsedCache)) {
        userPageDataCache = {
          version: USER_PAGE_DATA_CACHE_VERSION,
          buildVersion: appBuildVersion,
          entries: {}
        };
        return userPageDataCache;
      }

      userPageDataCache = parsedCache;
      return parsedCache;
    } catch (error) {
      userPageDataCache = {
        version: USER_PAGE_DATA_CACHE_VERSION,
        buildVersion: appBuildVersion,
        entries: {}
      };
      return userPageDataCache;
    }
  }

  function writeUserPageDataCacheRoot(cache) {
    userPageDataCache = isUserPageDataCacheRootValid(cache)
      ? cache
      : {
          version: USER_PAGE_DATA_CACHE_VERSION,
          buildVersion: appBuildVersion,
          entries: {}
        };

    try {
      sessionStorage.setItem(userPageDataCacheKey, JSON.stringify(userPageDataCache));
    } catch (error) {
      // Session storage can be unavailable or full; the in-memory cache is enough as a fallback.
    }
  }

  function isUserPageDataCacheEntryValid(entry) {
    if (!entry || typeof entry !== 'object' || !entry.data?.profile) {
      return false;
    }

    const createdAt = Number(entry.createdAt || 0);

    if (!createdAt || Date.now() - createdAt > USER_PAGE_DATA_CACHE_MAX_AGE_MS) {
      return false;
    }

    if (String(entry.mutationStamp || '') !== getDataMutationStamp()) {
      return false;
    }

    return isPageDependencySnapshotFresh(entry.dependencySnapshot || {});
  }

  function readUserPageDataCacheEntry(handle) {
    const entryKey = getUserPageDataCacheEntryKey(handle);
    const cache = readUserPageDataCacheRoot();
    const entry = cache.entries[entryKey];

    if (!isUserPageDataCacheEntryValid(entry)) {
      if (entry) {
        delete cache.entries[entryKey];
        writeUserPageDataCacheRoot(cache);
      }

      return null;
    }

    return entry.data;
  }

  function writeUserPageDataCacheEntry(handle, data) {
    if (!data?.profile) {
      return;
    }

    const entryKey = getUserPageDataCacheEntryKey(handle);
    const dependencyMovieIds = [...new Set(
      (Array.isArray(data.dependencyMovieIds) ? data.dependencyMovieIds : [])
        .map(movieId => String(movieId || '').trim())
        .filter(Boolean)
    )];
    const dependencyKeys = dependencyMovieIds.map(movieId => `movie:${movieId}`);
    const cache = readUserPageDataCacheRoot();
    const nextEntries = {
      ...cache.entries,
      [entryKey]: {
        createdAt: Date.now(),
        mutationStamp: getDataMutationStamp(),
        dependencySnapshot: getPageDependencySnapshot(dependencyKeys),
        data
      }
    };
    const prunedEntries = Object.fromEntries(
      Object.entries(nextEntries)
        .sort(([, firstEntry], [, secondEntry]) => (
          Number(secondEntry?.createdAt || 0) - Number(firstEntry?.createdAt || 0)
        ))
        .slice(0, USER_PAGE_DATA_CACHE_MAX_ENTRIES)
    );

    writeUserPageDataCacheRoot({
      version: USER_PAGE_DATA_CACHE_VERSION,
      buildVersion: appBuildVersion,
      entries: prunedEntries
    });
  }

  function invalidateUserPageDataCache() {
    userPageDataCache = null;

    try {
      sessionStorage.removeItem(userPageDataCacheKey);
    } catch (error) {
      // Ignore storage errors; cache invalidation is best-effort.
    }
  }

  async function fetchUserPageActivityAggregateRows() {
    const cachedRows = readUserPageActivityAggregateRowsCache();

    if (cachedRows) {
      return cachedRows;
    }

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

      const aggregateRows = {
        profileRows: getOptionalUserPageAggregateRows(profilesResult, 'profiles'),
        ratingRows: getOptionalUserPageAggregateRows(ratingsResult, 'movie_ratings'),
        watchlistRows: getOptionalUserPageAggregateRows(watchlistResult, 'movie_watchlist'),
        reviewRows: getOptionalUserPageAggregateRows(reviewsResult, 'movie_reviews'),
        hasProfileRows: !profilesResult.error,
        hasRatingRows: !ratingsResult.error,
        hasWatchlistRows: !watchlistResult.error,
        hasReviewRows: !reviewsResult.error
      };

      if (
        aggregateRows.hasProfileRows &&
        aggregateRows.hasRatingRows &&
        aggregateRows.hasWatchlistRows &&
        aggregateRows.hasReviewRows
      ) {
        writeUserPageActivityAggregateRowsCache(aggregateRows);
      }

      return aggregateRows;
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

  function normalizeUserPageServerActivityRank(rank) {
    const place = Number(rank?.place);
    const percent = Number(rank?.percent);

    if (!Number.isFinite(place) || place <= 0) {
      return null;
    }

    return {
      place,
      percent: Number.isFinite(percent) && percent > 0 ? percent : null
    };
  }

  function normalizeUserPageServerActivityRanks(ranks) {
    if (!ranks || typeof ranks !== 'object') {
      return null;
    }

    return {
      ratings: normalizeUserPageServerActivityRank(ranks.ratings),
      watchlist: normalizeUserPageServerActivityRank(ranks.watchlist),
      reviews: normalizeUserPageServerActivityRank(ranks.reviews)
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

  function getUserPageStatCardHtml(value, label, key, rank = null) {
    return `
      <div class="user-page-stat" data-user-page-stat="${key}">
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

  function renderUserPageLoading() {
    if (!userPage) {
      return;
    }

    hideUserPageRankTooltip();
    syncUserPageMainTitle();
    userPage.innerHTML = '<div class="user-page-loading-state page-content-skeleton" role="status" aria-label="Загрузка профиля..."></div>';
  }

  function renderUserPageUnavailable(message) {
    if (!userPage) {
      return;
    }

    renderedProfile = null;
    hideUserPageRankTooltip();
    syncUserPageMainTitle();
    setUserPageDocumentMeta(null);
    userPage.innerHTML = `
      <div class="user-page-empty-state user-page-empty-state-large">
        ${escapeHtml(message)}
      </div>
    `;
  }

  async function requestUserPageActivityPreview(userId) {
    return supabaseClient.rpc('get_profile_activity_preview', { p_user_id: userId }, { get: true });
  }

  async function fetchPublicUserPageData(profile, previewRequest) {
    const { data, error } = (await previewRequest) ?? await requestUserPageActivityPreview(profile.id);
    throwIfSupabaseError(error);
    const { ratings, watchlist, reviews, movies } = data;
    const previewMovieIds = getUserPageMovieIds([...ratings, ...watchlist, ...reviews]);
    await ensurePreferredPosterImagesForMovies(movies);
    const previewMoviesById = new Map(movies.map(movie => [String(movie.id), movie]));
    const buildItems = (rows, compare) => rows
      .map(row => ({ ...row, movie: previewMoviesById.get(String(row.movie_id)) }))
      .filter(item => item.movie)
      .sort(compare);

    return {
      profile,
      ratingItems: buildItems(ratings, sortUserPageItemsByNewestAdded),
      watchlistItems: buildItems(watchlist, sortUserPageItemsByNewestAdded),
      reviewItems: buildItems(reviews, sortUserPageReviewsByNewestActivity),
      dependencyMovieIds: previewMovieIds
    };
  }

  async function requestUserPageSummary(userId) {
    const dependencySnapshot = getPageDependencySnapshot(['profile-taste']);
    try {
      const { data, error } = await supabaseClient.rpc('get_profile_activity_summary', { p_user_id: userId }, { get: true });
      throwIfSupabaseError(error);
      const tasteStats = Object.fromEntries(Object.entries(data.tasteCandidates).map(([kind, items]) => [
        kind,
        items.sort((a, b) => kind === 'year' ? Number(b.label) - Number(a.label) : a.label.localeCompare(b.label, 'ru'))[0]
      ]));
      return { counts: data.counts, averageRating: data.averageRating, tasteStats, dependencySnapshot };
    } catch (error) {
      console.warn('Не удалось загрузить статистику профиля:', error);
      return null;
    }
  }

  function getUserPageAverageRatingLabel(summary) {
    return summary ? summary.averageRating?.toFixed(1) ?? '-' : '—';
  }

  async function loadUserPageSummary(handle, data, summaryRequest, isCurrentLoad) {
    const summary = await summaryRequest;
    if (!summary || !isCurrentLoad()) return;
    data.summary = summary;
    const cache = readUserPageDataCacheRoot();
    if (cache.entries[getUserPageDataCacheEntryKey(handle)]?.data === data) writeUserPageDataCacheRoot(cache);

    const values = { ...summary.counts, average: getUserPageAverageRatingLabel(summary) };
    for (const [key, value] of Object.entries(values)) {
      const node = userPage.querySelector(`[data-user-page-stat="${key}"] .user-page-stat-value`);
      if (node) node.textContent = String(value);
    }
    const tasteSection = userPage.querySelector('.user-page-taste-stats');
    if (tasteSection) tasteSection.outerHTML = getUserPageTasteStatsHtml(summary.tasteStats);

    for (const [key, count] of Object.entries(summary.counts)) {
      const rail = userPage.querySelector(`[data-user-page-activity="${key}"] [data-user-page-rail]`);
      if (!rail) continue;
      const existing = rail.querySelector('.user-page-more-card');
      const remaining = count - rail.querySelectorAll('.user-page-movie-card').length;
      if (remaining <= 0) existing?.remove();
      else {
        const moreHtml = getUserPageMoreCardHtml(remaining, buildCatalogProfileActivityUrl(getPublicProfileHandle(data.profile), key));
        if (existing) existing.outerHTML = moreHtml;
        else rail.insertAdjacentHTML('beforeend', moreHtml);
      }
    }
    bindUserPageRailControls();
  }

  function renderUserPage(data) {
    if (!userPage || !data?.profile) {
      return;
    }

    renderedProfile = data.profile;
    hideUserPageRankTooltip();
    const displayName = getPublicProfileDisplayName(data.profile);
    const handle = getPublicProfileHandle(data.profile);
    const { ratings: ratingCount, watchlist: watchlistCount, reviews: reviewCount } = data.summary?.counts || {};
    const ratingsCatalogUrl = buildCatalogProfileActivityUrl(handle, 'ratings');
    const watchlistCatalogUrl = buildCatalogProfileActivityUrl(handle, 'watchlist');
    const reviewsCatalogUrl = buildCatalogProfileActivityUrl(handle, 'reviews');
    const canEditDisplayName = Boolean(
      shouldUseAuthenticatedUi() &&
      getCurrentUser()?.id &&
      String(data.profile.id || '') === String(getCurrentUser().id)
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
          ${getUserPageStatCardHtml(ratingCount ?? '—', 'Оценено', 'ratings', data.activityRanks?.ratings)}
          ${getUserPageStatCardHtml(getUserPageAverageRatingLabel(data.summary), 'Средняя оценка', 'average')}
          ${getUserPageStatCardHtml(watchlistCount ?? '—', 'Смотреть позже', 'watchlist', data.activityRanks?.watchlist)}
          ${getUserPageStatCardHtml(reviewCount ?? '—', 'Рецензии', 'reviews', data.activityRanks?.reviews)}
        </section>
      </div>

      ${getUserPageTasteStatsHtml(data.summary?.tasteStats)}

      <section class="user-page-section" data-user-page-activity="ratings">
        ${getUserPageSectionHeaderHtml('Оценки и просмотры', ratingsCatalogUrl)}
        ${getUserPageMovieRailHtml(
            data.ratingItems,
            'Пока нет оценённых фильмов.',
            item => `<span class="user-page-card-badge">★ ${Number(item.rating || 0)}</span>`,
            ratingsCatalogUrl,
            ratingCount
          )}
      </section>

      <section class="user-page-section" data-user-page-activity="watchlist">
        ${getUserPageSectionHeaderHtml('Смотреть позже', watchlistCatalogUrl)}
        ${getUserPageMovieRailHtml(data.watchlistItems, 'Список просмотра пуст.', null, watchlistCatalogUrl, watchlistCount)}
      </section>

      <section class="user-page-section" data-user-page-activity="reviews">
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

  function requestUserPageActivityRanks(userId) {
    return fetchUserPageActivityRanks(userId).catch(error => {
      console.warn('Не удалось загрузить места в рейтинге:', error);
      return null;
    });
  }

  async function loadUserPageMedals(handle, data, ranksRequest, summaryRequest, isCurrentLoad) {
    try {
      let activityRanks = normalizeUserPageServerActivityRanks(await ranksRequest);
      if (!isCurrentLoad()) return;

      if (!activityRanks && isUserPageActivityRankFallbackEnabled()) {
        const [rows, summary] = await Promise.all([fetchUserPageActivityAggregateRows(), summaryRequest]);
        if (summary) activityRanks = getUserPageActivityRanks(data.profile.id, rows, summary.counts);
      }

      if (!activityRanks || !isCurrentLoad()) return;

      const cache = readUserPageDataCacheRoot();
      const entry = cache.entries[getUserPageDataCacheEntryKey(handle)];
      if (entry?.data === data && isUserPageDataCacheEntryValid(entry)) {
        data.activityRanks = activityRanks;
        writeUserPageDataCacheRoot(cache);
      }

      for (const [key, rank] of Object.entries(activityRanks)) {
        if (!rank) continue;
        userPage.querySelector(`[data-user-page-stat="${key}"]`)
          ?.insertAdjacentHTML('beforeend', getUserPageStatRankHtml(rank));
      }
    } catch (error) {
      console.warn('Не удалось обновить медали профиля:', error);
    }
  }

  async function loadUserPage({ useCache = true } = {}) {
    const handle = getUserPageRouteHandle();
    const viewerId = String(getCurrentUser()?.id || '');
    const loadVersion = ++pageLoadVersion;
    const identityVersion = profileIdentityVersion;
    const isCurrentLoad = () => loadVersion === pageLoadVersion &&
      viewerId === String(getCurrentUser()?.id || '') && handle === getUserPageRouteHandle();
    const canRenderProfile = () => isCurrentLoad() && identityVersion === profileIdentityVersion;
    try {
      if (useCache) {
        const cachedData = readUserPageDataCacheEntry(handle);

        if (cachedData) {
          renderUserPage(cachedData);
          const needsSummary = !cachedData.summary || !isPageDependencySnapshotFresh(cachedData.summary.dependencySnapshot);
          const summaryRequest = needsSummary ? requestUserPageSummary(cachedData.profile.id) : Promise.resolve(cachedData.summary);
          if (needsSummary) void loadUserPageSummary(handle, cachedData, summaryRequest, isCurrentLoad);
          if (!cachedData.activityRanks) {
            void loadUserPageMedals(handle, cachedData, requestUserPageActivityRanks(cachedData.profile.id), summaryRequest, isCurrentLoad);
          }
          return;
        }
      }

      const hintedProfileId = useCache ? getUserPageServerProfileId(handle) : null;
      const earlyPreview = hintedProfileId && requestUserPageActivityPreview(hintedProfileId).catch(() => null);
      const profile = await fetchPublicUserProfileByHandle(handle);
      if (!canRenderProfile()) return;

      if (!profile) {
        renderUserPageUnavailable('Пользователь не найден.');
        return;
      }

      const ranksRequest = requestUserPageActivityRanks(profile.id);
      const summaryRequest = requestUserPageSummary(profile.id);
      const data = await fetchPublicUserPageData(profile, profile.id === hintedProfileId ? earlyPreview : null);
      if (!canRenderProfile()) return;
      writeUserPageDataCacheEntry(handle, data);
      renderUserPage(data);
      void loadUserPageSummary(handle, data, summaryRequest, isCurrentLoad);
      void loadUserPageMedals(handle, data, ranksRequest, summaryRequest, isCurrentLoad);
    } catch (error) {
      if (canRenderProfile()) throw error;
    }
  }

  async function initUserPage() {
    bindUserPageEvents();
    if (!hasWarmStartedPageDom()) renderUserPageLoading();
    await restoreSession();
    trackEmailConfirmedLoginIfNeeded();

    bindSharedAuthStateListener({
      onAfterAuthSync: async () => {
        try {
          await loadUserPage({ useCache: false });
        } catch (error) {
          console.error('Ошибка обновления страницы пользователя после смены auth-состояния:', error);
        }
      }
    });

    try {
      await loadUserPage();
    } catch (error) {
      console.error('Ошибка загрузки страницы пользователя:', error);
      renderUserPageUnavailable('Не удалось загрузить профиль. Обновите страницу.');
    }
  }

  async function reloadUserPage() {
    try {
      await loadUserPage({ useCache: false });
    } catch (error) {
      console.error('Ошибка обновления страницы пользователя:', error);
    }
  }

  return {
    syncOwnProfileIdentity,
    syncProfileSettingsButton: syncUserPageProfileSettingsButton,
    setAvatarSubmitting,
    initUserPage,
    reloadUserPage,
    invalidateUserPageActivityAggregateRowsCache,
    invalidateUserPageDataCache
  };
}
