const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
};
const SUPABASE_PAGE_SIZE = 1000;
const SUPABASE_MAX_ROWS_PER_TABLE = 100000;

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

function getSupabaseBaseUrl(env) {
  return String(env.SUPABASE_URL || '').replace(/\/$/, '');
}

function getServiceRoleKey(env) {
  return env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || '';
}

function getSupabaseReadKey(env) {
  return getServiceRoleKey(env) || env.SUPABASE_ANON_KEY || '';
}

function normalizeUserId(userId) {
  return String(userId || '').trim();
}

function addCount(counts, key) {
  const normalizedKey = String(key || '').trim();

  if (!normalizedKey) {
    return;
  }

  counts.set(normalizedKey, (counts.get(normalizedKey) || 0) + 1);
}

function getUserMoviePairKey(row) {
  const userId = normalizeUserId(row?.user_id);
  const movieId = String(row?.movie_id || '').trim();

  return userId && movieId ? `${userId}:${movieId}` : '';
}

function getUserCountMap(rows = []) {
  const counts = new Map();

  rows.forEach(row => {
    addCount(counts, normalizeUserId(row?.user_id));
  });

  return counts;
}

function getActiveWatchlistCountMap(watchlistRows = [], ratingRows = []) {
  const ratedMovieUserPairs = new Set(
    ratingRows
      .map(getUserMoviePairKey)
      .filter(Boolean)
  );
  const counts = new Map();

  watchlistRows.forEach(row => {
    const pairKey = getUserMoviePairKey(row);

    if (!pairKey || ratedMovieUserPairs.has(pairKey)) {
      return;
    }

    addCount(counts, normalizeUserId(row.user_id));
  });

  return counts;
}

function getPopulationUserIds(profileRows = [], countMaps = [], targetUserId = '') {
  const userIds = new Set();
  const normalizedTargetUserId = normalizeUserId(targetUserId);

  profileRows.forEach(row => {
    const userId = normalizeUserId(row?.id);

    if (userId) {
      userIds.add(userId);
    }
  });

  countMaps.forEach(countMap => {
    countMap.forEach((count, userId) => {
      if (userId) {
        userIds.add(userId);
      }
    });
  });

  if (normalizedTargetUserId) {
    userIds.add(normalizedTargetUserId);
  }

  return userIds;
}

function getBetterThanPercent(count, countsByUser, populationUserIds, targetUserId) {
  const ownCount = Number(count) || 0;
  const normalizedTargetUserId = normalizeUserId(targetUserId);

  if (!ownCount || !normalizedTargetUserId) {
    return null;
  }

  const peerUserIds = Array.from(populationUserIds)
    .filter(userId => userId && userId !== normalizedTargetUserId);

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

function getActivityRank(count, countsByUser, populationUserIds, targetUserId) {
  const ownCount = Number(count) || 0;
  const normalizedTargetUserId = normalizeUserId(targetUserId);

  if (!ownCount || !normalizedTargetUserId) {
    return null;
  }

  const peerUserIds = Array.from(populationUserIds)
    .filter(userId => userId && userId !== normalizedTargetUserId);

  if (!peerUserIds.length) {
    return null;
  }

  const higherCount = peerUserIds.reduce((total, userId) => (
    total + ((countsByUser.get(userId) || 0) > ownCount ? 1 : 0)
  ), 0);

  return {
    place: higherCount + 1,
    percent: getBetterThanPercent(ownCount, countsByUser, populationUserIds, normalizedTargetUserId)
  };
}

async function readSupabaseJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function fetchSupabaseRowsPage(supabaseUrl, supabaseReadKey, tableName, selectColumns, from, to) {
  const url = new URL(`${supabaseUrl}/rest/v1/${tableName}`);
  url.searchParams.set('select', selectColumns);

  const response = await fetch(url.toString(), {
    headers: {
      apikey: supabaseReadKey,
      Authorization: `Bearer ${supabaseReadKey}`,
      Range: `${from}-${to}`,
      Prefer: 'count=exact'
    }
  });
  const payload = await readSupabaseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Failed to load ${tableName}`);
  }

  return {
    rows: Array.isArray(payload) ? payload : [],
    contentRange: response.headers.get('content-range') || ''
  };
}

async function fetchAllSupabaseRows(supabaseUrl, supabaseReadKey, tableName, selectColumns) {
  const rows = [];

  for (let from = 0; from < SUPABASE_MAX_ROWS_PER_TABLE; from += SUPABASE_PAGE_SIZE) {
    const to = from + SUPABASE_PAGE_SIZE - 1;
    const page = await fetchSupabaseRowsPage(
      supabaseUrl,
      supabaseReadKey,
      tableName,
      selectColumns,
      from,
      to
    );
    rows.push(...page.rows);

    const totalMatch = page.contentRange.match(/\/(\d+)$/);
    const total = totalMatch ? Number(totalMatch[1]) : null;

    if (
      page.rows.length < SUPABASE_PAGE_SIZE ||
      (Number.isFinite(total) && rows.length >= total)
    ) {
      break;
    }
  }

  return rows;
}

export async function onRequestGet(context) {
  const { env, params } = context;
  const supabaseUrl = getSupabaseBaseUrl(env);
  const supabaseReadKey = getSupabaseReadKey(env);
  const targetUserId = normalizeUserId(params.userId);

  if (!supabaseUrl || !supabaseReadKey) {
    return jsonResponse(503, {
      ok: false,
      message: 'Profile activity ranks are not configured.'
    });
  }

  if (!targetUserId) {
    return jsonResponse(400, {
      ok: false,
      message: 'User id is required.'
    });
  }

  try {
    const [
      profileRows,
      ratingRows,
      watchlistRows,
      reviewRows
    ] = await Promise.all([
      fetchAllSupabaseRows(supabaseUrl, supabaseReadKey, 'profiles', 'id'),
      fetchAllSupabaseRows(supabaseUrl, supabaseReadKey, 'movie_ratings', 'user_id,movie_id'),
      fetchAllSupabaseRows(supabaseUrl, supabaseReadKey, 'movie_watchlist', 'user_id,movie_id'),
      fetchAllSupabaseRows(supabaseUrl, supabaseReadKey, 'movie_reviews', 'user_id')
    ]);

    const ratingCounts = getUserCountMap(ratingRows);
    const watchlistCounts = getActiveWatchlistCountMap(watchlistRows, ratingRows);
    const reviewCounts = getUserCountMap(reviewRows);
    const populationUserIds = getPopulationUserIds(
      profileRows,
      [ratingCounts, watchlistCounts, reviewCounts],
      targetUserId
    );

    const counts = {
      ratings: ratingCounts.get(targetUserId) || 0,
      watchlist: watchlistCounts.get(targetUserId) || 0,
      reviews: reviewCounts.get(targetUserId) || 0
    };

    return jsonResponse(200, {
      ok: true,
      counts,
      ranks: {
        ratings: getActivityRank(counts.ratings, ratingCounts, populationUserIds, targetUserId),
        watchlist: getActivityRank(counts.watchlist, watchlistCounts, populationUserIds, targetUserId),
        reviews: getActivityRank(counts.reviews, reviewCounts, populationUserIds, targetUserId)
      }
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      message: error?.message || 'Failed to calculate profile activity ranks.'
    });
  }
}
