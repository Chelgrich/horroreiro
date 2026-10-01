import { AUTO_RELATED_PROVIDERS, readAutoRelatedConfig } from './config.mjs';
import { getMovieExternalIds } from './ids.mjs';
import {
  buildEvidenceRowsFromMatches,
  buildMovieMatchIndex,
  getMatchIndexSummary,
  matchRecommendationCandidates
} from './matching.mjs';
import { createRecommendationProviders } from './providers.mjs';
import { mergeEvidenceRowsForScoring, scoreRelatedMovies } from './scoring.mjs';
import { createSupabaseAutoRelatedAdapter } from './supabase-adapter.mjs';

const PROVIDER_SYNC_FIELDS = Object.freeze({
  [AUTO_RELATED_PROVIDERS.tmdbRecommendations]: {
    error: 'tmdb_last_error',
    externalCount: 'tmdb_external_count',
    lastSuccessAt: 'tmdb_last_success_at',
    matchedCount: 'tmdb_matched_count',
    statusCode: 'tmdb_last_status_code'
  },
  [AUTO_RELATED_PROVIDERS.traktRelated]: {
    error: 'trakt_last_error',
    externalCount: 'trakt_external_count',
    lastSuccessAt: 'trakt_last_success_at',
    matchedCount: 'trakt_matched_count',
    statusCode: 'trakt_last_status_code'
  }
});

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value || {}).filter(([, item]) => item !== null && item !== undefined && item !== '')
  );
}

function getSourceMovie(index, options = {}) {
  const movieId = String(options.movieId || '').trim();
  const slug = String(options.slug || '').trim();

  if (movieId) {
    return index.byMovieId.get(movieId) || null;
  }

  if (!slug) {
    return null;
  }

  return [...index.byMovieId.values()].find(movie => movie.slug === slug) || null;
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

function getBatchCandidateMovies(matchIndex, syncStateRows = [], options = {}) {
  const limit = Math.max(1, Number(options.limit || 1));
  const unsyncedOnly = Boolean(options.unsyncedOnly);
  const syncStateByMovieId = new Map(
    (syncStateRows || [])
      .filter(row => row?.movie_id)
      .map(row => [String(row.movie_id), row])
  );

  return [...matchIndex.byMovieId.values()]
    .filter(movie => movie.tmdb || movie.trakt || movie.imdb)
    .map(movie => ({
      movie,
      syncTimestamp: getSyncStateTimestamp(syncStateByMovieId.get(movie.id))
    }))
    .filter(candidate => !unsyncedOnly || candidate.syncTimestamp === 0)
    .sort((firstCandidate, secondCandidate) =>
      firstCandidate.syncTimestamp - secondCandidate.syncTimestamp ||
      Number(firstCandidate.movie.year || 0) - Number(secondCandidate.movie.year || 0) ||
      String(firstCandidate.movie.title || '').localeCompare(String(secondCandidate.movie.title || '')) ||
      String(firstCandidate.movie.id).localeCompare(String(secondCandidate.movie.id))
    )
    .slice(0, limit)
    .map(candidate => candidate.movie);
}

function incrementCount(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function sleep(delayMs) {
  return new Promise(resolve => {
    setTimeout(resolve, Math.max(0, Number(delayMs || 0)));
  });
}

function toProviderMovie(sourceMovie) {
  return compactObject({
    id: sourceMovie.id,
    imdb_id: sourceMovie.imdb,
    imdb_url: sourceMovie.imdb ? `https://www.imdb.com/title/${sourceMovie.imdb}/` : '',
    slug: sourceMovie.slug,
    title: sourceMovie.title,
    tmdb_id: sourceMovie.tmdb,
    tmdb_url: sourceMovie.tmdb ? `https://www.themoviedb.org/movie/${sourceMovie.tmdb}` : '',
    trakt_id: sourceMovie.trakt,
    year: sourceMovie.year
  });
}

function getTouchedMaterializationMovieIds(sourceMovieId, existingEvidenceRows = [], freshEvidenceRows = [], replacedProviders = []) {
  const sourceId = String(sourceMovieId || '').trim();
  const replacedProviderSet = new Set(
    replacedProviders.map(provider => String(provider || '').trim()).filter(Boolean)
  );
  const touchedMovieIds = new Set(sourceId ? [sourceId] : []);

  freshEvidenceRows.forEach(row => {
    if (String(row?.source_movie_id || '') === sourceId && row?.target_movie_id) {
      touchedMovieIds.add(String(row.target_movie_id));
    }
  });

  existingEvidenceRows.forEach(row => {
    if (
      String(row?.source_movie_id || '') === sourceId &&
      replacedProviderSet.has(String(row?.provider || '')) &&
      row?.target_movie_id
    ) {
      touchedMovieIds.add(String(row.target_movie_id));
    }
  });

  return [...touchedMovieIds];
}

async function materializeRelatedRowsForMovie(adapter, config, movieId) {
  const evidenceRows = typeof adapter.fetchRecommendationEvidenceForMovie === 'function'
    ? await adapter.fetchRecommendationEvidenceForMovie(movieId)
    : [];
  const relatedRows = scoreRelatedMovies({
    config,
    evidenceRows,
    sourceMovieId: movieId
  });
  const savedRelatedRows = typeof adapter.replaceRelatedRows === 'function'
    ? await adapter.replaceRelatedRows(movieId, relatedRows)
    : [];

  return {
    movieId,
    relatedRows,
    savedRelatedRows
  };
}

function getProviderSyncPatch(providerName, result, nowIso) {
  const fields = PROVIDER_SYNC_FIELDS[providerName];

  if (!fields) {
    return {};
  }

  if (result.status === 'error') {
    return {
      [fields.error]: result.error || 'Provider sync failed.',
      [fields.externalCount]: result.externalCount ?? 0,
      [fields.matchedCount]: result.matchedCount ?? 0,
      [fields.statusCode]: result.statusCode || null
    };
  }

  return {
    [fields.error]: null,
    [fields.externalCount]: result.externalCount ?? 0,
    [fields.lastSuccessAt]: nowIso,
    [fields.matchedCount]: result.matchedCount ?? 0,
    [fields.statusCode]: null
  };
}

function getProviderResultSummary(result) {
  return compactObject({
    error: result.error,
    externalCount: result.externalCount,
    matchedCount: result.matchedCount,
    persistedCount: result.persistedCount,
    provider: result.provider,
    status: result.status,
    statusCode: result.statusCode,
    unmatchedCount: result.unmatchedCount
  });
}

function getSyncStatePatch(sourceMovie, providerMovie, providerResults, nowIso) {
  const externalIds = {
    ...getMovieExternalIds(sourceMovie),
    ...getMovieExternalIds(providerMovie)
  };
  const errors = providerResults
    .filter(result => result.status === 'error')
    .map(result => `${result.provider}: ${result.error || 'Provider sync failed.'}`);
  const hasSuccess = providerResults.some(result => result.status === 'success');

  return {
    imdb_id: externalIds.imdb || null,
    movie_id: sourceMovie.id,
    recommendations_last_error: errors.length ? errors.join('; ') : null,
    recommendations_last_success_at: hasSuccess ? nowIso : null,
    recommendations_last_synced_at: nowIso,
    tmdb_id: externalIds.tmdb || null,
    trakt_id: externalIds.trakt || null,
    ...providerResults.reduce((patch, result) => ({
      ...patch,
      ...getProviderSyncPatch(result.provider, result, nowIso)
    }), {})
  };
}

async function resolveProviderMovieIds(provider, providerMovie) {
  if (
    provider.name === AUTO_RELATED_PROVIDERS.traktRelated &&
    !providerMovie.trakt_id &&
    typeof provider.resolveTraktId === 'function'
  ) {
    const traktId = await provider.resolveTraktId(providerMovie);

    if (traktId) {
      providerMovie.trakt_id = traktId;
    }
  }

  return providerMovie;
}

async function syncOneAutoRelatedMovieWithContext(context, options = {}) {
  const { adapter, config, matchIndex, providers } = context;
  const write = Boolean(options.write);
  const force = Boolean(options.force);

  if (write && !config.enabled && !force) {
    throw new Error('AUTO_RELATED_MOVIES=true is required for writes. Pass --force only for a deliberate one-off sync.');
  }

  const now = options.now || new Date();
  const nowIso = now.toISOString();
  const sourceMovie = getSourceMovie(matchIndex, options);

  if (!sourceMovie) {
    const identity = options.movieId ? `movie_id=${options.movieId}` : `slug=${options.slug || ''}`;
    throw new Error(`Source movie not found in match index (${identity}).`);
  }

  return syncResolvedAutoRelatedMovie({
    adapter,
    config,
    force,
    matchIndex,
    nowIso,
    providers,
    sourceMovie,
    write
  });
}

async function createAutoRelatedSyncContext(options = {}) {
  const config = options.config || readAutoRelatedConfig();
  const adapter = options.adapter || createSupabaseAutoRelatedAdapter(config);
  const providers = options.providers || createRecommendationProviders(config, options.providerOptions);
  const [movieRows, syncStateRows] = await Promise.all([
    adapter.fetchMovieMatchRows(),
    adapter.fetchRecommendationSyncStates()
  ]);
  const matchIndex = buildMovieMatchIndex(movieRows, syncStateRows);

  return {
    adapter,
    config,
    matchIndex,
    movieRows,
    providers,
    syncStateRows
  };
}

async function syncResolvedAutoRelatedMovie(options = {}) {
  const {
    adapter,
    config,
    force,
    matchIndex,
    nowIso,
    providers,
    sourceMovie,
    write
  } = options;
  const providerMovie = toProviderMovie(sourceMovie);
  const providerResults = [];
  const evidenceRows = [];
  const successfulProviders = [];

  for (const provider of providers) {
    try {
      await resolveProviderMovieIds(provider, providerMovie);

      const candidates = await provider.getRecommendations(providerMovie);
      const matched = matchRecommendationCandidates(candidates, matchIndex, {
        sourceMovieId: sourceMovie.id
      });
      const providerMatches = matched.matches.filter(match => match.candidate.provider === provider.name);
      const providerEvidenceRows = buildEvidenceRowsFromMatches(sourceMovie.id, providerMatches);

      if (write) {
        await adapter.replaceProviderEvidence(sourceMovie.id, provider.name, providerEvidenceRows);
      }

      evidenceRows.push(...providerEvidenceRows);
      successfulProviders.push(provider.name);
      providerResults.push({
        externalCount: candidates.length,
        matchedCount: providerMatches.length,
        persistedCount: write ? providerEvidenceRows.length : 0,
        provider: provider.name,
        status: 'success',
        unmatchedCount: matched.unmatched.length
      });
    } catch (error) {
      providerResults.push({
        error: error.message || String(error),
        externalCount: 0,
        matchedCount: 0,
        persistedCount: 0,
        provider: provider.name,
        status: 'error',
        statusCode: error.status || 0,
        unmatchedCount: 0
      });
    }
  }

  const syncStatePatch = getSyncStatePatch(sourceMovie, providerMovie, providerResults, nowIso);
  const existingEvidenceRows = typeof adapter.fetchRecommendationEvidenceForMovie === 'function'
    ? await adapter.fetchRecommendationEvidenceForMovie(sourceMovie.id)
    : [];
  const scoringEvidenceRows = mergeEvidenceRowsForScoring(
    existingEvidenceRows,
    evidenceRows,
    successfulProviders,
    { sourceMovieId: sourceMovie.id }
  );
  const relatedRows = scoreRelatedMovies({
    config,
    evidenceRows: scoringEvidenceRows,
    sourceMovieId: sourceMovie.id
  });
  let materializedRows = [];
  let touchedMaterializedRows = [];

  if (write) {
    await adapter.upsertRecommendationSyncState(syncStatePatch);
    materializedRows = typeof adapter.replaceRelatedRows === 'function'
      ? await adapter.replaceRelatedRows(sourceMovie.id, relatedRows)
      : [];
    const touchedMovieIds = getTouchedMaterializationMovieIds(
      sourceMovie.id,
      existingEvidenceRows,
      evidenceRows,
      successfulProviders
    ).filter(movieId => movieId !== sourceMovie.id);

    touchedMaterializedRows = [];

    for (const touchedMovieId of touchedMovieIds) {
      touchedMaterializedRows.push(await materializeRelatedRowsForMovie(
        adapter,
        config,
        touchedMovieId
      ));
    }
  }

  return {
    dryRun: !write,
    evidenceRows,
    matchIndex: getMatchIndexSummary(matchIndex),
    providers: providerResults.map(getProviderResultSummary),
    sourceMovie: {
      id: sourceMovie.id,
      imdb: sourceMovie.imdb || null,
      slug: sourceMovie.slug,
      title: sourceMovie.title,
      tmdb: sourceMovie.tmdb || null,
      trakt: sourceMovie.trakt || null,
      year: sourceMovie.year
    },
    relatedRows,
    relatedWritten: write,
    savedRelatedRows: materializedRows,
    syncStatePatch,
    syncStateWritten: write,
    touchedMaterializedRows
  };
}

export async function syncOneAutoRelatedMovie(options = {}) {
  const context = await createAutoRelatedSyncContext(options);

  return syncOneAutoRelatedMovieWithContext(context, options);
}

export async function syncAutoRelatedMoviesBatch(options = {}) {
  const context = await createAutoRelatedSyncContext(options);
  const write = Boolean(options.write);
  const force = Boolean(options.force);

  if (write && !context.config.enabled && !force) {
    throw new Error('AUTO_RELATED_MOVIES=true is required for writes. Pass --force only for a deliberate one-off batch sync.');
  }

  const candidates = getBatchCandidateMovies(context.matchIndex, context.syncStateRows, {
    limit: options.limit,
    unsyncedOnly: options.unsyncedOnly
  });
  const delayMs = Math.max(0, Number(options.delayMs || 0));
  const results = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const sourceMovie = candidates[index];

    try {
      const result = await syncResolvedAutoRelatedMovie({
        adapter: context.adapter,
        config: context.config,
        force,
        matchIndex: context.matchIndex,
        nowIso: (options.now || new Date()).toISOString(),
        providers: context.providers,
        sourceMovie,
        write
      });

      results.push({
        result,
        status: 'success'
      });
    } catch (error) {
      results.push({
        error: error.message || String(error),
        sourceMovie: {
          id: sourceMovie.id,
          slug: sourceMovie.slug,
          title: sourceMovie.title,
          year: sourceMovie.year
        },
        status: 'error'
      });
    }

    if (delayMs && index < candidates.length - 1) {
      await sleep(delayMs);
    }
  }

  return {
    delayMs,
    dryRun: !write,
    limit: Math.max(1, Number(options.limit || 1)),
    matchIndex: getMatchIndexSummary(context.matchIndex),
    processed: results.length,
    results,
    totalCandidates: candidates.length,
    unsyncedOnly: Boolean(options.unsyncedOnly),
    write
  };
}

export async function getAutoRelatedCoverageReport(options = {}) {
  const context = await createAutoRelatedSyncContext(options);
  const [evidenceRows, relatedRows] = await Promise.all([
    typeof context.adapter.fetchAllRecommendationEvidenceRows === 'function'
      ? context.adapter.fetchAllRecommendationEvidenceRows()
      : [],
    typeof context.adapter.fetchAllRelatedRows === 'function'
      ? context.adapter.fetchAllRelatedRows()
      : []
  ]);
  const syncedMovieIds = new Set(
    context.syncStateRows
      .filter(row => row?.recommendations_last_synced_at || row?.recommendations_last_success_at)
      .map(row => String(row.movie_id))
  );
  const successfulMovieIds = new Set(
    context.syncStateRows
      .filter(row => row?.recommendations_last_success_at)
      .map(row => String(row.movie_id))
  );
  const errorRows = context.syncStateRows.filter(row => row?.recommendations_last_error);
  const relatedCountByMovie = new Map();
  const evidenceCountByProvider = new Map();
  const confidenceCounts = new Map();

  relatedRows.forEach(row => {
    if (row?.movie_id) {
      incrementCount(relatedCountByMovie, String(row.movie_id));
    }

    if (row?.confidence) {
      incrementCount(confidenceCounts, String(row.confidence));
    }
  });

  evidenceRows.forEach(row => {
    if (row?.provider) {
      incrementCount(evidenceCountByProvider, String(row.provider));
    }
  });

  let zeroRelated = 0;
  let oneToThreeRelated = 0;
  let fourPlusRelated = 0;
  let maxRelated = 0;

  context.matchIndex.byMovieId.forEach(movie => {
    const relatedCount = relatedCountByMovie.get(movie.id) || 0;

    if (relatedCount === 0) {
      zeroRelated += 1;
    } else if (relatedCount <= 3) {
      oneToThreeRelated += 1;
    } else {
      fourPlusRelated += 1;
    }

    if (relatedCount >= context.config.maxRelated) {
      maxRelated += 1;
    }
  });

  return {
    evidenceRows: evidenceRows.length,
    evidenceRowsByProvider: Object.fromEntries([...evidenceCountByProvider.entries()].sort()),
    failedSyncStates: errorRows.length,
    matchIndex: getMatchIndexSummary(context.matchIndex),
    movies: context.matchIndex.byMovieId.size,
    moviesNeverSynced: Math.max(0, context.matchIndex.byMovieId.size - syncedMovieIds.size),
    moviesSynced: syncedMovieIds.size,
    moviesSyncedSuccessfully: successfulMovieIds.size,
    relatedConfidenceCounts: Object.fromEntries([...confidenceCounts.entries()].sort()),
    relatedDistribution: {
      fourPlus: fourPlusRelated,
      maxed: maxRelated,
      oneToThree: oneToThreeRelated,
      zero: zeroRelated
    },
    relatedRows: relatedRows.length
  };
}

export function formatAutoRelatedSyncSummary(result) {
  return {
    dryRun: result.dryRun,
    evidenceRows: result.evidenceRows.length,
    matchIndex: result.matchIndex,
    providers: result.providers,
    relatedRows: result.relatedRows.length,
    relatedWritten: result.relatedWritten,
    sourceMovie: result.sourceMovie,
    syncStateWritten: result.syncStateWritten,
    touchedMaterializedMovies: Array.isArray(result.touchedMaterializedRows)
      ? result.touchedMaterializedRows.length
      : 0
  };
}

export function formatAutoRelatedBatchSummary(result) {
  const successfulResults = result.results.filter(item => item.status === 'success');
  const failedResults = result.results.filter(item => item.status === 'error');

  return {
    delayMs: result.delayMs,
    dryRun: result.dryRun,
    failed: failedResults.length,
    limit: result.limit,
    matchIndex: result.matchIndex,
    processed: result.processed,
    results: result.results.map(item => {
      if (item.status === 'error') {
        return item;
      }

      return {
        evidenceRows: item.result.evidenceRows.length,
        providers: item.result.providers,
        relatedRows: item.result.relatedRows.length,
        sourceMovie: item.result.sourceMovie,
        status: item.status,
        syncStateWritten: item.result.syncStateWritten,
        touchedMaterializedMovies: Array.isArray(item.result.touchedMaterializedRows)
          ? item.result.touchedMaterializedRows.length
          : 0
      };
    }),
    succeeded: successfulResults.length,
    unsyncedOnly: result.unsyncedOnly,
    write: result.write
  };
}
