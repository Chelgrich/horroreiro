const USER_PAGE_ACTIVITY_AGGREGATE_CACHE_VERSION = 1;
const USER_PAGE_ACTIVITY_AGGREGATE_CACHE_MAX_AGE_MS = 5 * 60 * 1000;
const USER_PAGE_ACTIVITY_AGGREGATE_LIMIT = 10000;

export function createUserPageController(context = {}) {
  const {
    userPage = null,
    supabaseClient = null,
    getCurrentUser = () => null,
    shouldUseAuthenticatedUi = () => false,
    restoreSession = async () => null,
    trackEmailConfirmedLoginIfNeeded = () => {},
    bindSharedAuthStateListener = () => {},
    escapeHtml = value => String(value ?? ''),
    buildCatalogProfileActivityUrl = () => '',
    getPublicProfileDisplayName = profile => String(profile?.display_name || profile?.default_display_name || 'Пользователь'),
    getPublicProfileHandle = profile => String(profile?.default_display_name || ''),
    fetchPublicUserProfileByHandle = async () => null,
    fetchUserPageActivityRanks = async () => null,
    isUserPageActivityRankFallbackEnabled = () => true,
    getCatalogMovieMeta = () => ({ filterableGenreNames: [], subgenreKeys: [], countryNames: [] }),
    addCount = () => {},
    fetchMoviesByIdsWithSelect = async () => [],
    ensurePreferredPosterImagesForMovies = async () => {},
    movieUserPageCardSelect = '',
    movieUserPageTasteSelect = '',
    throwIfSupabaseError = error => {
      if (error) {
        throw error;
      }
    },
    getManualSimilarMovieLabel = movie => String(movie?.title || ''),
    getUserPageAvatarHtml = () => '',
    getUserPageFollowButtonHtml = () => '',
    getUserPageAdminPasswordPanelHtml = () => '',
    setUserPageDocumentMeta = () => {},
    syncUserPageMainTitle = () => {},
    bindUserPageRailControls = () => {},
    syncUserPageProfileSettingsButton = () => {},
    getUserPageMovieRailHtml = () => '',
    hideUserPageRankTooltip = () => {},
    userPageActivityAggregateCacheKey = 'horroreiro_user_page_activity_aggregate_cache',
    userPagePreviewLimit = 10
  } = context;

  let userPageActivityAggregateRowsCache = null;

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

  function isUserPageActivityAggregateRowsCacheValid(cache) {
    if (
      !cache ||
      cache.version !== USER_PAGE_ACTIVITY_AGGREGATE_CACHE_VERSION ||
      cache.buildVersion !== APP_BUILD_VERSION ||
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
      buildVersion: APP_BUILD_VERSION,
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
      serverActivityRanksResult
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
      fetchUserPageActivityRanks(userId)
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

    const previewRatingRows = ratingRows.slice(0, userPagePreviewLimit);
    const previewWatchlistRows = activeWatchlistRows.slice(0, userPagePreviewLimit);
    const previewReviewRows = reviewRows.slice(0, userPagePreviewLimit);
    const previewMovieIds = [...new Set([
      ...getUserPageMovieIds(previewRatingRows),
      ...getUserPageMovieIds(previewWatchlistRows),
      ...getUserPageMovieIds(previewReviewRows)
    ])];
    const tasteMovieIds = getUserPageMovieIds(ratingRows);
    const ownActivityCounts = {
      ratings: ratingRows.length,
      watchlist: activeWatchlistRows.length,
      reviews: reviewRows.length
    };
    let activityRanks = normalizeUserPageServerActivityRanks(serverActivityRanksResult);

    if (!activityRanks && isUserPageActivityRankFallbackEnabled()) {
      const activityAggregateRows = await fetchUserPageActivityAggregateRows();
      activityRanks = getUserPageActivityRanks(userId, activityAggregateRows, ownActivityCounts);
    }

    const [previewMovies, tasteMovies] = await Promise.all([
      fetchMoviesByIdsWithSelect(previewMovieIds, movieUserPageCardSelect),
      fetchMoviesByIdsWithSelect(tasteMovieIds, movieUserPageTasteSelect)
    ]);
    await ensurePreferredPosterImagesForMovies(previewMovies);
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
      activityRanks
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

    async function loadUserPage() {
      const profile = await fetchPublicUserProfileByHandle(handle);

      if (!profile) {
        renderUserPageNotFound();
        return;
      }

      const data = await fetchPublicUserPageData(profile);
      renderUserPage(data);
    }

    try {
      await loadUserPage();
    } catch (error) {
      console.error('Ошибка загрузки страницы пользователя:', error);
      renderUserPageNotFound();
    }

    bindSharedAuthStateListener({
      onAfterAuthSync: async () => {
        try {
          await loadUserPage();
        } catch (error) {
          console.error('Ошибка обновления страницы пользователя после смены auth-состояния:', error);
        }
      }
    });
  }

  async function reloadUserPage() {
    const handle = getUserPageRouteHandle();

    try {
      const profile = await fetchPublicUserProfileByHandle(handle);

      if (!profile) {
        renderUserPageNotFound();
        return;
      }

      const data = await fetchPublicUserPageData(profile);
      renderUserPage(data);
    } catch (error) {
      console.error('Ошибка обновления страницы пользователя:', error);
    }
  }

  return {
    initUserPage,
    reloadUserPage,
    invalidateUserPageActivityAggregateRowsCache
  };
}
