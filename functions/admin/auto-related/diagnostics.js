import { readAutoRelatedConfig } from '../../../tools/auto-related/config.mjs';
import { createSupabaseAutoRelatedAdapter } from '../../../tools/auto-related/supabase-adapter.mjs';

const JSON_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Content-Type': 'application/json; charset=UTF-8'
};

const CAN_RUN_PROVIDER_SYNC = typeof process !== 'undefined' && Boolean(process.versions?.node);

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

function getMissingSupabaseServerVariableLabels({
  anonKey,
  serviceRoleKey,
  supabaseUrl
}) {
  const missingLabels = [];

  if (!supabaseUrl) {
    missingLabels.push('SUPABASE_URL');
  }

  if (!anonKey) {
    missingLabels.push('SUPABASE_ANON_KEY');
  }

  if (!serviceRoleKey) {
    missingLabels.push('SUPABASE_SERVICE_ROLE_KEY или SUPABASE_SERVICE_KEY');
  }

  return missingLabels;
}

function getBearerToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match ? match[1].trim() : '';
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

async function verifyRequester(supabaseUrl, anonKey, accessToken) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });
  const payload = await readSupabaseJson(response);

  if (!response.ok || !payload?.id) {
    return {
      error: payload?.message || 'Admin session is invalid.',
      user: null
    };
  }

  return {
    error: '',
    user: payload
  };
}

async function fetchRequesterRole(supabaseUrl, serviceRoleKey, requesterId) {
  const url = new URL(`${supabaseUrl}/rest/v1/profiles`);

  url.searchParams.set('id', `eq.${requesterId}`);
  url.searchParams.set('select', 'role');
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    }
  });
  const payload = await readSupabaseJson(response);

  if (!response.ok) {
    return {
      error: payload?.message || 'Could not verify admin role.',
      role: ''
    };
  }

  return {
    error: '',
    role: Array.isArray(payload) ? payload[0]?.role || '' : ''
  };
}

function getMovieLabel(movie) {
  const title = String(movie?.title || movie?.original_title || 'Без названия').trim();
  const year = movie?.year ? ` (${movie.year})` : '';

  return `${title}${year}`;
}

function getConfidenceOrder(confidence) {
  const normalizedConfidence = String(confidence || '').trim().toLowerCase();
  const orderMap = {
    fallback: 0,
    low: 1,
    normal: 2,
    strong: 3,
    manual: 4
  };

  return orderMap[normalizedConfidence] ?? 99;
}

function getMoviePath(movie) {
  const slug = String(movie?.slug || '').trim();

  return slug ? `/movie/${slug}` : `/movie.html?id=${encodeURIComponent(movie?.id || '')}`;
}

function getSyncStateTimestamp(syncState = {}) {
  const timestamps = [
    syncState.recommendations_last_success_at,
    syncState.recommendations_last_synced_at,
    syncState.tmdb_last_success_at,
    syncState.trakt_last_success_at
  ]
    .map(value => {
      const timestamp = Date.parse(value || '');
      return Number.isFinite(timestamp) ? timestamp : null;
    })
    .filter(value => value !== null);

  return timestamps.length ? Math.max(...timestamps) : 0;
}

function getNumberOrNull(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function buildProviderSummary(syncState = {}, provider) {
  const normalizedProvider = String(provider || '').trim().toLowerCase();
  const prefix = normalizedProvider === 'trakt' ? 'trakt' : 'tmdb';
  const successAt = syncState?.[`${prefix}_last_success_at`] || null;
  const error = syncState?.[`${prefix}_last_error`] || '';
  const statusCode = getNumberOrNull(syncState?.[`${prefix}_last_status_code`]);
  const externalCount = getNumberOrNull(syncState?.[`${prefix}_external_count`]);
  const matchedCount = getNumberOrNull(syncState?.[`${prefix}_matched_count`]);

  return {
    error,
    externalCount,
    hasRun: Boolean(successAt || error || statusCode !== null || externalCount !== null || matchedCount !== null),
    matchedCount,
    provider: prefix,
    statusCode,
    successAt
  };
}

function getPairKey(sourceMovieId, targetMovieId) {
  return `${sourceMovieId}->${targetMovieId}`;
}

function getUndirectedPairKey(firstMovieId, secondMovieId) {
  return [String(firstMovieId), String(secondMovieId)].sort().join('<->');
}

function incrementCount(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function formatEvidenceSummary(evidenceRows = [], sourceMovieId, targetMovieId) {
  const directRows = [];
  const reverseRows = [];

  evidenceRows.forEach(row => {
    const rowSourceId = String(row?.source_movie_id || '');
    const rowTargetId = String(row?.target_movie_id || '');

    if (rowSourceId === sourceMovieId && rowTargetId === targetMovieId) {
      directRows.push(row);
    } else if (rowSourceId === targetMovieId && rowTargetId === sourceMovieId) {
      reverseRows.push(row);
    }
  });

  const formatRows = rows => rows
    .slice()
    .sort((firstRow, secondRow) => (
      String(firstRow?.provider || '').localeCompare(String(secondRow?.provider || '')) ||
      Number(firstRow?.provider_rank || 0) - Number(secondRow?.provider_rank || 0)
    ))
    .map(row => ({
      provider: String(row?.provider || ''),
      rank: Number(row?.provider_rank || 0) || null
    }));

  return {
    direct: formatRows(directRows),
    reverse: formatRows(reverseRows)
  };
}

function getRelatedCountBucket(count) {
  if (count === 0) {
    return 'zero';
  }

  if (count <= 3) {
    return 'oneToThree';
  }

  return 'fourPlus';
}

function buildMovieSummary(movie, relatedCount, syncState) {
  const timestamp = getSyncStateTimestamp(syncState);
  const lastSuccessTimestamp = Date.parse(syncState?.recommendations_last_success_at || '');
  const lastSyncedTimestamp = Date.parse(syncState?.recommendations_last_synced_at || '');

  return {
    id: movie.id,
    lastSuccessAt: Number.isFinite(lastSuccessTimestamp) ? new Date(lastSuccessTimestamp).toISOString() : null,
    lastSyncedAt: Number.isFinite(lastSyncedTimestamp) ? new Date(lastSyncedTimestamp).toISOString() : null,
    label: getMovieLabel(movie),
    path: getMoviePath(movie),
    providers: [
      buildProviderSummary(syncState, 'tmdb'),
      buildProviderSummary(syncState, 'trakt')
    ],
    relatedCount,
    syncError: syncState?.recommendations_last_error || '',
    synced: Boolean(timestamp),
    syncedAt: timestamp ? new Date(timestamp).toISOString() : null
  };
}

function buildDiagnosticsPayload({
  evidenceRows,
  movieRows,
  relatedRows,
  syncStateRows
}) {
  const moviesById = new Map(movieRows.map(movie => [String(movie.id), movie]));
  const syncStateByMovieId = new Map(syncStateRows.map(row => [String(row.movie_id), row]));
  const relatedRowsByMovieId = new Map();
  const evidenceByDirectedPair = new Map();
  const relatedConfidenceCounts = new Map();
  const relatedCountDistribution = {
    fourPlus: 0,
    oneToThree: 0,
    zero: 0
  };

  relatedRows.forEach(row => {
    if (!row?.movie_id || !row?.related_movie_id) {
      return;
    }

    const movieId = String(row.movie_id);

    if (!relatedRowsByMovieId.has(movieId)) {
      relatedRowsByMovieId.set(movieId, []);
    }

    relatedRowsByMovieId.get(movieId).push(row);

    if (row.confidence) {
      incrementCount(relatedConfidenceCounts, String(row.confidence));
    }
  });

  evidenceRows.forEach(row => {
    if (!row?.source_movie_id || !row?.target_movie_id || !row?.provider) {
      return;
    }

    const key = getPairKey(String(row.source_movie_id), String(row.target_movie_id));

    if (!evidenceByDirectedPair.has(key)) {
      evidenceByDirectedPair.set(key, new Set());
    }

    evidenceByDirectedPair.get(key).add(String(row.provider));
  });

  const bothProvidersDirectedPairs = [...evidenceByDirectedPair.values()]
    .filter(providers => providers.size >= 2)
    .length;
  const reciprocalPairs = new Set();

  evidenceByDirectedPair.forEach((providers, key) => {
    const [sourceMovieId, targetMovieId] = key.split('->');
    const reverseKey = getPairKey(targetMovieId, sourceMovieId);

    if (evidenceByDirectedPair.has(reverseKey)) {
      reciprocalPairs.add(getUndirectedPairKey(sourceMovieId, targetMovieId));
    }
  });

  const lowCoverageMovies = movieRows
    .map(movie => {
      const movieId = String(movie.id);
      const relatedCount = (relatedRowsByMovieId.get(movieId) || []).length;

      relatedCountDistribution[getRelatedCountBucket(relatedCount)] += 1;

      return buildMovieSummary(movie, relatedCount, syncStateByMovieId.get(movieId));
    })
    .filter(item => item.relatedCount < 4 || item.syncError)
    .sort((firstItem, secondItem) => (
      Number(Boolean(secondItem.syncError)) - Number(Boolean(firstItem.syncError)) ||
      firstItem.relatedCount - secondItem.relatedCount ||
      String(firstItem.label).localeCompare(String(secondItem.label), 'ru')
    ))
    .slice(0, 24);

  const diagnosticPairs = relatedRows
    .filter(row => moviesById.has(String(row?.movie_id)) && moviesById.has(String(row?.related_movie_id)))
    .slice()
    .sort((firstRow, secondRow) => (
      getConfidenceOrder(firstRow.confidence) - getConfidenceOrder(secondRow.confidence) ||
      Number(firstRow.score || 0) - Number(secondRow.score || 0) ||
      Number(firstRow.position || 0) - Number(secondRow.position || 0)
    ))
    .slice(0, 24)
    .map(row => {
      const sourceMovieId = String(row.movie_id);
      const targetMovieId = String(row.related_movie_id);
      const sourceMovie = moviesById.get(sourceMovieId);
      const targetMovie = moviesById.get(targetMovieId);

      return {
        confidence: row.confidence || '',
        evidence: formatEvidenceSummary(evidenceRows, sourceMovieId, targetMovieId),
        position: Number(row.position || 0),
        score: Number(row.score || 0),
        source: {
          id: sourceMovieId,
          label: getMovieLabel(sourceMovie),
          path: getMoviePath(sourceMovie)
        },
        target: {
          id: targetMovieId,
          label: getMovieLabel(targetMovie),
          path: getMoviePath(targetMovie)
        }
      };
    });

  const syncedMovieIds = new Set(
    syncStateRows
      .filter(row => row?.recommendations_last_synced_at || row?.recommendations_last_success_at)
      .map(row => String(row.movie_id))
  );
  const successfulMovieIds = new Set(
    syncStateRows
      .filter(row => row?.recommendations_last_success_at)
      .map(row => String(row.movie_id))
  );
  const failedSyncStates = syncStateRows.filter(row => row?.recommendations_last_error);
  const averageRelatedCount = movieRows.length
    ? relatedRows.length / movieRows.length
    : 0;

  return {
    capabilities: {
      canRunProviderSync: CAN_RUN_PROVIDER_SYNC
    },
    diagnosticPairs,
    lowCoverageMovies,
    summary: {
      averageRelatedCount,
      bothProvidersDirectedPairs,
      evidenceRows: evidenceRows.length,
      failedSyncStates: failedSyncStates.length,
      movies: movieRows.length,
      moviesNeverSynced: Math.max(0, movieRows.length - syncedMovieIds.size),
      moviesSynced: syncedMovieIds.size,
      moviesSyncedSuccessfully: successfulMovieIds.size,
      reciprocalPairs: reciprocalPairs.size,
      relatedConfidenceCounts: Object.fromEntries([...relatedConfidenceCounts.entries()].sort()),
      relatedDistribution: relatedCountDistribution,
      relatedRows: relatedRows.length
    },
    updatedAt: new Date().toISOString()
  };
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const supabaseUrl = getSupabaseBaseUrl(env);
  const anonKey = env.SUPABASE_ANON_KEY || '';
  const serviceRoleKey = getServiceRoleKey(env);
  const accessToken = getBearerToken(request);

  const missingSupabaseServerVariables = getMissingSupabaseServerVariableLabels({
    anonKey,
    serviceRoleKey,
    supabaseUrl
  });

  if (missingSupabaseServerVariables.length) {
    return jsonResponse(500, {
      message: `Не настроены серверные переменные Supabase для диагностики автопохожих: ${missingSupabaseServerVariables.join(', ')}.`,
      ok: false
    });
  }

  if (!accessToken) {
    return jsonResponse(401, {
      message: 'Active admin session is required.',
      ok: false
    });
  }

  const requesterResult = await verifyRequester(supabaseUrl, anonKey, accessToken);

  if (!requesterResult.user) {
    return jsonResponse(401, {
      message: requesterResult.error,
      ok: false
    });
  }

  const roleResult = await fetchRequesterRole(supabaseUrl, serviceRoleKey, requesterResult.user.id);

  if (roleResult.error) {
    return jsonResponse(500, {
      message: roleResult.error,
      ok: false
    });
  }

  if (roleResult.role !== 'admin') {
    return jsonResponse(403, {
      message: 'Admin access is required.',
      ok: false
    });
  }

  try {
    const config = readAutoRelatedConfig(env);
    const adapter = createSupabaseAutoRelatedAdapter(config);
    const [
      movieRows,
      syncStateRows,
      evidenceRows,
      relatedRows
    ] = await Promise.all([
      adapter.fetchMovieMatchRows(),
      adapter.fetchRecommendationSyncStates(),
      adapter.fetchAllRecommendationEvidenceRows(),
      adapter.fetchAllRelatedRows()
    ]);

    return jsonResponse(200, {
      ok: true,
      result: buildDiagnosticsPayload({
        evidenceRows,
        movieRows,
        relatedRows,
        syncStateRows
      })
    });
  } catch (error) {
    console.error('Admin auto-related diagnostics failed:', error);

    return jsonResponse(500, {
      message: error.message || 'Auto-related diagnostics failed.',
      ok: false
    });
  }
}
